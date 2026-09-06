"""Validated commands over the shared operational document.

Pure reducer: no environment, network, credentials, or disk access. Persistence
and transaction boundaries are supplied by the HTTP adapter.
"""
from copy import deepcopy
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
import hashlib
import json
import math
import re
import time

class OperationError(Exception):
    def __init__(self, status, code, message, **details):
        super().__init__(message)
        self.status = status
        self.payload = {'ok': False, 'code': code, 'error': message, **details}


def minor_units(value):
    try:
        number = Decimal(str(value))
        if not number.is_finite():
            raise ValueError()
        return int((number * 100).quantize(Decimal('1'), rounding=ROUND_HALF_UP))
    except (ValueError, TypeError, InvalidOperation, OverflowError):
        raise OperationError(422, 'amount', 'A finite monetary amount is required.')


def finite(value, field, minimum=None):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
        raise OperationError(422, 'validation', 'A finite number is required.', field=field)
    if minimum is not None and value < minimum:
        raise OperationError(422, 'validation', 'Value is below the permitted minimum.', field=field)
    if abs(value) > 1_000_000:
        raise OperationError(422, 'validation', 'Value exceeds the permitted maximum.', field=field)
    return value


def require_id(value, field):
    if not isinstance(value, str) or not re.fullmatch(r'[\w.:/-]{1,160}', value):
        raise OperationError(422, 'validation', 'A valid identifier is required.', field=field)
    return value


def apply_operation(current, command, session, keys, dict_keys, now=None):
    if not session:
        raise OperationError(401, 'auth_required', 'Authentication required.')
    if session.get('mode') != 'staff':
        raise OperationError(403, 'staff_required', 'Staff access required.')
    if not isinstance(command, dict):
        raise OperationError(400, 'input', 'JSON object required.')
    operation_id = require_id(command.get('operationId'), 'operationId')
    actor = str(session.get('profile_id') or session.get('profileId') or '')
    if not actor:
        raise OperationError(401, 'auth_required', 'Authenticated profile required.')
    action = command.get('action')
    payload = command.get('payload')
    if not isinstance(payload, dict):
        raise OperationError(422, 'validation', 'Payload must be an object.', field='payload')
    try:
        fingerprint = hashlib.sha256(json.dumps(command, sort_keys=True, allow_nan=False).encode()).hexdigest()
    except (ValueError, TypeError):
        raise OperationError(422, 'validation', 'Invalid command values.')
    receipt_key = actor + ':' + operation_id
    receipts = current.get('_operationReceipts') or {}
    previous = receipts.get(receipt_key)
    if previous:
        if previous['fingerprint'] != fingerprint:
            raise OperationError(409, 'idempotency_mismatch', 'Operation ID already used with different input.')
        return current, {**previous['result'], 'replayed': True}
    revision = current.get('revision', 0)
    expected = command.get('expectedRevision')
    if type(expected) is not int or expected < 0:
        raise OperationError(422, 'validation', 'Expected revision is required.', field='expectedRevision')
    if expected != revision:
        raise OperationError(409, 'conflict', 'The records changed. Review the latest values.', revision=revision)
    state = deepcopy(current)
    now = int(time.time()*1000) if now is None else now
    affected = []
    audit = []
    if action == 'state.commit':
        # Compatibility bridge for the existing staff-only /ops contract.
        for key in keys:
            if key not in payload:
                continue
            value = payload[key]
            expected_type = dict if key in dict_keys else list
            if not isinstance(value, expected_type):
                raise OperationError(422, 'validation', 'Unexpected collection type.', field=key)
            state[key] = deepcopy(value)
        if not session.get('admin'):
            for protected in ('children','groups','houseRules','pocketMoneySettings','kidBadgePrefs'):
                before, after = current.get(protected), state.get(protected)
                if before != after:
                    raise OperationError(403, 'admin_required', 'Administrator access required.', field=protected)
            old_prefs=current.get('profilePrefs') or {}
            new_prefs=state.get('profilePrefs') or {}
            for owner in set(old_prefs)|set(new_prefs):
                if owner != actor and old_prefs.get(owner) != new_prefs.get(owner):
                    raise OperationError(403, 'forbidden', 'Cannot change another profile preference.', field='profilePrefs')
        # Financial history is append-only even through the compatibility API.
        old_ledger = {r.get('id'):r for r in current.get('pocketMoneyTxns',[]) if isinstance(r,dict)}
        ledger = state.get('pocketMoneyTxns',[])
        if any(not isinstance(row,dict) or not row.get('id') for row in ledger):
            raise OperationError(422,'validation','Invalid financial record.')
        if len({r['id'] for r in ledger}) != len(ledger):
            raise OperationError(422,'duplicate_target','Duplicate transaction identifier.')
        incoming = {r['id']:r for r in ledger}
        for rid, old in old_ledger.items():
            new = incoming.get(rid)
            if new is None or any(old.get(field)!=new.get(field) for field in ('kidId','amount','note','by','ts','reverses','kind','categoryId')):
                raise OperationError(422,'immutable_ledger','Reverse financial records instead of changing history.',targetId=rid)
        balances = {}
        reversed_ids = set()
        known_kids = {r.get('id') for r in state.get('children',[]) if isinstance(r,dict)}
        for row in ledger:
            kid = row.get('kidId')
            if row['id'] not in old_ledger:
                if kid not in known_kids:
                    raise OperationError(404,'not_found','Child not found.',targetId=kid)
                if not str(row.get('note') or '').strip():
                    raise OperationError(422,'reason_required','A transaction reason is required.')
                if minor_units(row.get('amount',0)) == 0 or abs(minor_units(row.get('amount',0))) > 100_000_000:
                    raise OperationError(422,'amount','Use a non-zero amount within the permitted range.')
                row['by'] = actor
                row['ts'] = now
            amount = minor_units(row.get('amount',0))
            if row.get('amountMinor') is not None and row['amountMinor'] != amount:
                raise OperationError(422,'amount','Amount and cents do not match.')
            if row.get('reverses'):
                original = incoming.get(row['reverses'])
                if not original or original.get('kidId')!=kid or amount!=-minor_units(original.get('amount',0)) or row['reverses'] in reversed_ids:
                    raise OperationError(422,'reversal','Invalid or duplicate reversal.')
                reversed_ids.add(row['reverses'])
            balances[kid] = balances.get(kid,0)+amount
            row.update(amountMinor=amount,balanceAfterMinor=balances[kid],balanceAfter=balances[kid]/100)
        for key, quantity in (state.get('stock') or {}).items():
            finite(quantity, 'stock.'+key, 0)
        affected = [key for key in keys if state.get(key) != current.get(key)]
    elif action == 'stock.adjust':
        changes = payload.get('changes')
        if not isinstance(changes, list) or not 1 <= len(changes) <= 200:
            raise OperationError(422, 'validation', 'Select between 1 and 200 stock records.')
        seen = set()
        for item in changes:
            if not isinstance(item, dict):
                raise OperationError(422, 'validation', 'Invalid stock adjustment.')
            hid = require_id(item.get('houseId'), 'houseId')
            pid = require_id(item.get('productId'), 'productId')
            key = hid + ':' + pid
            if key in seen:
                raise OperationError(422, 'duplicate_target', 'A stock record occurs twice.')
            seen.add(key)
            delta = finite(item.get('delta'), 'delta')
            reason = str(item.get('reason') or '').strip()[:400]
            if not delta or not reason:
                raise OperationError(422, 'reason_required', 'A non-zero adjustment and reason are required.')
            old = state.setdefault('stock', {}).get(key)
            if old is None:
                raise OperationError(422, 'unrecorded', 'Record the initial quantity before adjusting stock.', targetId=key)
            balance = finite(old, 'quantity', 0) + delta
            finite(balance, 'quantity', 0)
            state['stock'][key] = round(balance, 6)
            affected.append(key)
            audit.append({'type':'IN' if delta>0 else 'OUT','houseId':hid,'productId':pid,'qty':abs(delta),'reason':reason,'before':old,'after':balance})
    elif action in {'pocket.post', 'pocket.reverse'}:
        ledger = state.setdefault('pocketMoneyTxns', [])
        kid_ids = {r.get('id') for r in state.get('children', []) if isinstance(r, dict)}
        if action == 'pocket.reverse':
            original = next((r for r in ledger if r.get('id') == payload.get('transactionId')), None)
            if not original:
                raise OperationError(404, 'not_found', 'Transaction not found.')
            if any(r.get('reverses') == original['id'] for r in ledger):
                raise OperationError(409, 'already_reversed', 'Transaction already reversed.')
            changes = [{'kidId':original['kidId'], 'amountMinor':-original.get('amountMinor', minor_units(original.get('amount',0))), 'note':payload.get('reason'), 'reverses':original['id']}]
        else:
            changes = payload.get('changes')
        if not isinstance(changes, list) or not 1 <= len(changes) <= 100:
            raise OperationError(422, 'validation', 'Select between 1 and 100 transactions.')
        for index, item in enumerate(changes):
            if not isinstance(item, dict):
                raise OperationError(422, 'validation', 'Invalid transaction.')
            kid = require_id(item.get('kidId'), 'kidId')
            if kid not in kid_ids:
                raise OperationError(404, 'not_found', 'Child not found.', targetId=kid)
            amount = item.get('amountMinor')
            if type(amount) is not int or amount == 0 or abs(amount) > 100_000_000:
                raise OperationError(422, 'amount', 'Use a non-zero amount in cents.')
            note = str(item.get('note') or '').strip()[:400]
            if not note:
                raise OperationError(422, 'reason_required', 'A transaction reason is required.')
            balance = sum(r.get('amountMinor', minor_units(r.get('amount',0))) for r in ledger if r.get('kidId') == kid) + amount
            row = {'id':operation_id+':'+str(index),'kidId':kid,'amountMinor':amount,'amount':amount/100,'balanceAfterMinor':balance,'balanceAfter':balance/100,'kind':'adjust' if item.get('reverses') else 'in' if amount>0 else 'out','note':note,'by':actor,'ts':now,'categoryId':str(item.get('categoryId') or '')[:80]}
            if item.get('reverses'):
                row['reverses'] = item['reverses']
            ledger.append(row)
            affected.append(row['id'])
            audit.append({'type':'POCKET','kidId':kid,'transactionId':row['id'],'text':note})
    else:
        raise OperationError(422, 'unknown_action', 'Unknown operation type.')
    state.setdefault('log', [])
    for index, row in enumerate(audit):
        state['log'].append({**row, 'id':operation_id+':audit:'+str(index), 'ts':now, 'employeeId':actor, 'operationId':operation_id})
    state['revision'] = revision+1
    state['updatedAt'] = now
    result = {'ok':True,'durable':True,'operationId':operation_id,'action':action,'revision':revision+1,'updatedAt':now,'affected':affected,'replayed':False}
    receipts = dict(receipts)
    receipts[receipt_key] = {'fingerprint':fingerprint,'result':result}
    state['_operationReceipts'] = dict(list(receipts.items())[-1000:])
    return state, result
