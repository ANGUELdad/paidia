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


def apply_operation(current, command, session, keys, dict_keys, now=None, catalog=None):
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
        unknown=set(payload)-set(keys)-{'staffKidRatingSummaries'}
        if unknown:raise OperationError(422,'unknown_collection','Unknown shared collection.',field=sorted(unknown)[0])
        for key in keys:
            if key not in payload:
                continue
            value = payload[key]
            expected_type = dict if key in dict_keys else list
            if not isinstance(value, expected_type):
                raise OperationError(422, 'validation', 'Unexpected collection type.', field=key)
            state[key] = deepcopy(value)
        if not session.get('admin'):
            for protected in ('children','groups','template','houseRules','pocketMoneySettings','kidBadgePrefs'):
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
        old_order=list(old_ledger)
        if [r['id'] for r in ledger[:len(old_order)]]!=old_order:
            raise OperationError(422,'immutable_ledger','Append corrections without reordering financial history.')
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
        # Server-authored command audit records cannot be erased by legacy snapshots.
        old_audit={r['id']:r for r in current.get('log',[]) if isinstance(r,dict) and r.get('operationId') and r.get('id')}
        incoming_log=state.setdefault('log',[])
        incoming_ids={r.get('id'):r for r in incoming_log if isinstance(r,dict)}
        for rid,row in old_audit.items():
            if rid in incoming_ids and incoming_ids[rid]!=row:raise OperationError(422,'immutable_audit','Command audit records cannot be changed.',targetId=rid)
            if rid not in incoming_ids:incoming_log.append(deepcopy(row))
        affected = [key for key in keys if state.get(key) != current.get(key)]
        if affected:audit.append({'type':'STATE','collections':affected})
    elif action in {'stock.adjust','stock.record'}:
        changes = payload.get('changes')
        if not isinstance(changes, list) or not 1 <= len(changes) <= 200:
            raise OperationError(422, 'validation', 'Select between 1 and 200 stock records.')
        seen = set()
        for item in changes:
            if not isinstance(item, dict):
                raise OperationError(422, 'validation', 'Invalid stock adjustment.')
            hid = require_id(item.get('houseId'), 'houseId')
            pid = require_id(item.get('productId'), 'productId')
            if catalog is not None:
                houses={r['id'] for r in catalog.get('houses',[])}
                products={r['id'] for r in catalog.get('products',[])}|{r.get('id') for r in state.get('customProducts',[]) if isinstance(r,dict)}
                if hid not in houses or pid not in products:
                    raise OperationError(404,'not_found','Stock reference not found.',targetId=hid+':'+pid)
            key = hid + ':' + pid
            if key in seen:
                raise OperationError(422, 'duplicate_target', 'A stock record occurs twice.')
            seen.add(key)
            if action=='stock.record':
                if state.setdefault('stock',{}).get(key) is not None:
                    raise OperationError(409,'already_recorded','An initial quantity already exists.',targetId=key)
                quantity=finite(item.get('quantity'),'quantity',0)
                reason=str(item.get('reason') or '').strip()[:400]
                if not reason:raise OperationError(422,'reason_required','A count reason is required.')
                state['stock'][key]=quantity
                affected.append(key)
                audit.append({'type':'COUNT','houseId':hid,'productId':pid,'qty':quantity,'before':None,'after':quantity,'reason':reason})
                continue
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
    elif action == 'attendance.set':
        from datetime import date
        changes=payload.get('changes')
        if not isinstance(changes,list) or not 1<=len(changes)<=100:
            raise OperationError(422,'validation','Select between 1 and 100 attendance records.')
        children={r.get('id') for r in state.get('children',[]) if isinstance(r,dict)}
        seen=set()
        for index,item in enumerate(changes):
            if not isinstance(item,dict):raise OperationError(422,'validation','Invalid attendance record.')
            kid=require_id(item.get('kidId'),'kidId')
            if kid not in children:raise OperationError(404,'not_found','Child not found.',targetId=kid)
            ds=item.get('date')
            try:
                parsed=date.fromisoformat(ds)
                if parsed.isoformat()!=ds or not 1900<=parsed.year<=2100:raise ValueError()
            except (ValueError,TypeError):raise OperationError(422,'date','Use a valid calendar date.',field='date')
            status=item.get('status')
            if status not in {'present','absent','excused','unrecorded'}:
                raise OperationError(422,'validation','Choose an attendance status.',field='status')
            key=kid+':'+ds
            if key in seen:raise OperationError(422,'duplicate_target','Attendance record selected twice.',targetId=key)
            seen.add(key)
            records=state.setdefault('attendance',[])
            row=next((r for r in records if r.get('kidId')==kid and r.get('date')==ds),None)
            before=row.get('status') if row else 'unrecorded'
            if row is None:
                row={'id':operation_id+':attendance:'+str(index),'kidId':kid,'date':ds};records.append(row)
            row.update(status=status,by=actor,ts=now,revision=revision+1)
            affected.append(row['id'])
            audit.append({'type':'ATTENDANCE','kidId':kid,'date':ds,'before':before,'after':status,'recordId':row['id']})
    elif action == 'shopping.confirm':
        changes=payload.get('items')
        hid=require_id(payload.get('houseId'),'houseId')
        if catalog is not None and hid not in {r['id'] for r in catalog.get('houses',[])}:
            raise OperationError(404,'not_found','House not found.')
        if not isinstance(changes,list) or not 1<=len(changes)<=200:
            raise OperationError(422,'validation','Select between 1 and 200 shopping entries.')
        by_id={r.get('id'):r for r in state.get('listEntries',[]) if isinstance(r,dict)}
        products={r['id']:r for r in (catalog or {}).get('products',[])}
        products.update({r['id']:r for r in state.get('customProducts',[]) if isinstance(r,dict) and r.get('id')})
        for pid,override in (state.get('productOverrides') or {}).items():
            if pid in products and isinstance(override,dict):products[pid]={**products[pid],**override,'id':pid}
        seen=set();items=[]
        for index,item in enumerate(changes):
            if not isinstance(item,dict):raise OperationError(422,'validation','Invalid shopping item.')
            eid=require_id(item.get('entryId'),'entryId')
            if eid in seen:raise OperationError(422,'duplicate_target','Shopping entry selected twice.')
            seen.add(eid)
            entry=by_id.get(eid)
            if not entry or entry.get('houseId')!=hid:raise OperationError(404,'not_found','Shopping entry not found.',targetId=eid)
            if entry.get('status')!='pending':raise OperationError(409,'already_processed','Shopping entry is no longer pending.',targetId=eid)
            outcome=item.get('outcome')
            if outcome not in {'bought','substituted','missing','skipped'}:raise OperationError(422,'validation','Choose a shopping outcome.',targetId=eid)
            quantity=finite(entry.get('qty'),'quantity',0)
            if quantity==0:raise OperationError(422,'validation','Quantity must be positive.',targetId=eid)
            pid=entry.get('productId')
            if outcome in {'bought','substituted'}:
                if outcome=='substituted':pid=require_id(item.get('productId'),'productId')
                if not pid:
                    name=str(entry.get('name') or '').strip()[:160]
                    if not name:raise OperationError(422,'validation','Product name is required.')
                    pid=next((p['id'] for p in products.values() if name.casefold() in {str(p.get('de','')).casefold(),str(p.get('el','')).casefold()}),None)
                    if not pid:
                        pid=operation_id+':product:'+str(index)
                        product={'id':pid,'de':name,'el':name,'unit':entry.get('unit') or 'Stk','cat':'custom','alias':[]}
                        state.setdefault('customProducts',[]).append(product);products[pid]=product
                if pid not in products:raise OperationError(404,'not_found','Product not found.',targetId=pid)
                unit=str(entry.get('unit') or '')
                if unit.casefold()!=str(products[pid].get('unit') or '').casefold():
                    raise OperationError(422,'unit_mismatch','Correct the unit before confirmation.',targetId=eid)
                key=hid+':'+pid;old=state.setdefault('stock',{}).get(key)
                if old is None:old=finite(item.get('initialQuantity'),'initialQuantity',0)
                balance=finite(old+quantity,'quantity',0)
                state['stock'][key]=balance;entry['productId']=pid
                audit.append({'type':'IN','houseId':hid,'productId':pid,'qty':quantity,'before':old,'after':balance,'reason':'shopping','entryId':eid})
            entry.update(status=outcome,decidedAt=now,decidedBy=actor)
            entry.pop('decision',None)
            entry['missReason']=str(item.get('reason') or 'unavailable')[:160] if outcome=='missing' else None
            request=next((r for r in state.get('listRequests',[]) if r.get('id')==entry.get('fromRequestId')),None)
            if request is not None and outcome in {'bought','substituted'}:request.update(status='bought',listEntryId=eid,decidedAt=now,decidedBy=actor)
            items.append({'entryId':eid,'productId':pid,'name':entry.get('name'),'qty':quantity,'unit':entry.get('unit'),'result':outcome,'reason':entry.get('missReason')})
            affected.append(eid)
        trip={'id':operation_id+':trip','houseId':hid,'fridayDate':payload.get('fridayDate'),'completedAt':now,'completedBy':actor,'items':items}
        state.setdefault('shoppingTrips',[]).append(trip)
        audit.append({'type':'SHOP','houseId':hid,'tripId':trip['id'],'items':items})
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


def project_child_state(payload, kid_id, dict_keys=()):
    """Allowlisted child projection; unknown operational collections stay empty."""
    out={key:({} if key in dict_keys else []) for key in payload if key not in {'revision','updatedAt','changed','durable'}}
    out.update({key:payload[key] for key in ('revision','updatedAt','changed','durable') if key in payload})
    if not kid_id:return out
    def rows(key):return [r for r in payload.get(key,[]) if isinstance(r,dict)]
    def own(row):return str(row.get('kidId') or '')==kid_id
    for key in ('pocketMoneyTxns','attendance','subjectGrades','schoolMaterials','schoolMaterialMedia','schoolActivity','choreSubmissions','xpLog','kidRatings'):
        out[key]=deepcopy([r for r in rows(key) if own(r)])
    out['kidNotes']=deepcopy([r for r in rows('kidNotes') if own(r) and str(r.get('by') or kid_id)==kid_id])
    out['listRequests']=deepcopy([r for r in rows('listRequests') if own(r)])
    out['feedbackReports']=[{k:deepcopy(v) for k,v in r.items() if k in {'id','kidId','authorId','type','title','description','screenshotNote','status','createdAt','ts','resolvedAt','publicResponse'}} for r in rows('feedbackReports') if str(r.get('kidId') or r.get('authorId') or '')==kid_id]
    out['children']=[{k:deepcopy(v) for k,v in r.items() if k in {'id','name','color','avatar','photo','photoUrl','age','birthday','houseId'}} for r in rows('children') if r.get('id')==kid_id]
    out['groups']=[{**{k:deepcopy(v) for k,v in r.items() if k in {'id','de','el'}},'childIds':[kid_id]} for r in rows('groups') if kid_id in (r.get('childIds') or [])]
    for key in ('gameStats','kidBadgePrefs','profilePrefs'):
        value=payload.get(key) or {};out[key]={kid_id:deepcopy(value[kid_id])} if isinstance(value,dict) and kid_id in value else {}
    for key in ('homework','chores','schoolTimetable'):
        permitted=[]
        for row in rows(key):
            if row.get('kidId') and not own(row):continue
            if row.get('kidIds') and kid_id not in row['kidIds']:continue
            if row.get('childIds') and kid_id not in row['childIds']:continue
            clean=deepcopy(row)
            for field in ('kidIds','childIds'):
                if clean.get(field):clean[field]=[kid_id]
            permitted.append(clean)
        out[key]=permitted
    out['subjects']=deepcopy(rows('subjects'))
    out['houseRules']=deepcopy([r for r in rows('houseRules') if r.get('active') is not False and r.get('audience') not in {'staff','admin'}])
    settings=payload.get('pocketMoneySettings') or {}
    out['pocketMoneySettings']={k:deepcopy(settings[k]) for k in ('rulesDe','rulesEl','categories') if k in settings}
    for field in ('allowances','monthlyAllowances'):
        values=settings.get(field) or {};out['pocketMoneySettings'][field]={kid_id:values[kid_id]} if kid_id in values else {}
    schedule_fields={'id','date','day','templateId','block','activityId','from','to','time','houseId','houseIds','employeeId','employeeIds','childIds','cancelled'}
    def schedule(row):
        clean={k:deepcopy(v) for k,v in row.items() if k in schedule_fields}
        clean['childIds']=[kid_id] if kid_id in (row.get('childIds') or []) else []
        return clean
    templates={r.get('id'):r for r in rows('template')}
    visible={r['id'] for r in templates.values() if kid_id in (r.get('childIds') or [])}
    visible.update(r.get('templateId') for r in rows('overrides') if kid_id in (r.get('childIds') or []))
    out['template']=[schedule(r) if kid_id in (r.get('childIds') or []) else {'id':r['id'],'day':r.get('day'),'childIds':[]} for r in templates.values() if r['id'] in visible]
    out['overrides']=[]
    for row in rows('overrides'):
        base=templates.get(row.get('templateId')) or {};effective={**base,**row}
        if row.get('templateId') in visible or kid_id in (effective.get('childIds') or []):
            clean=schedule(effective);clean['id']=row.get('id');out['overrides'].append(clean)
    event_fields=schedule_fields|{'de','el','name','title','description','location','place','emoji','color','featured','status'}
    out['events']=[{**{k:deepcopy(v) for k,v in r.items() if k in event_fields},'childIds':[kid_id]} for r in rows('events') if r.get('status')=='published' and kid_id in (r.get('childIds') or [])]
    activity_ids={r.get('activityId') for r in out['template']+out['overrides']}
    out['customActivities']=[{k:deepcopy(v) for k,v in r.items() if k in {'id','de','el','emoji','category'}} for r in rows('customActivities') if r.get('id') in activity_ids]
    out['staffKidRatings']=[]
    return out
