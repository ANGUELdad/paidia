import concurrent.futures
import importlib.util
import json
import os
from pathlib import Path
import tempfile
import subprocess
import unittest
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from operations import apply_operation, OperationError, minor_units, project_child_state

KEYS = ['stock','children','pocketMoneyTxns','log','attendance']
DICT = {'stock'}
ADMIN = {'mode':'staff','profile_id':'e1','admin':True}

def command(action='stock.adjust', **kw):
    return {'operationId':'test-1','action':action,'expectedRevision':0,'payload':kw}

class Commands(unittest.TestCase):
    def setUp(self):
        self.state={'revision':0,'stock':{'h1:p1':5},'children':[{'id':'k1'}],'pocketMoneyTxns':[]}
    def apply(self, c, state=None, session=ADMIN):
        return apply_operation(self.state if state is None else state,c,session,KEYS,DICT,now=1000)
    def test_duplicate_is_replayed_without_second_write(self):
        c=command(changes=[{'houseId':'h1','productId':'p1','delta':-2,'reason':'Used'}])
        state,result=self.apply(c)
        again,replayed=self.apply(c,state)
        self.assertEqual(again['stock']['h1:p1'],3)
        self.assertEqual(again['revision'],1)
        self.assertTrue(replayed['replayed'])
    def test_id_reuse_rejected(self):
        c=command(changes=[{'houseId':'h1','productId':'p1','delta':1,'reason':'Arrival'}])
        state,_=self.apply(c); c['payload']['changes'][0]['delta']=2
        with self.assertRaises(OperationError) as e:self.apply(c,state)
        self.assertEqual(e.exception.payload['code'],'idempotency_mismatch')
    def test_bulk_failure_rolls_back_every_record(self):
        c=command(changes=[{'houseId':'h1','productId':'p1','delta':1,'reason':'Arrival'},{'houseId':'h1','productId':'missing','delta':1,'reason':'Arrival'}])
        with self.assertRaises(OperationError):self.apply(c)
        self.assertEqual(self.state['stock']['h1:p1'],5)
    def test_child_denied(self):
        with self.assertRaises(OperationError) as e:self.apply(command(),session={'mode':'child','profile_id':'k1'})
        self.assertEqual(e.exception.status,403)
    def test_stale_revision_conflicts(self):
        c=command();c['expectedRevision']=4
        with self.assertRaises(OperationError) as e:self.apply(c)
        self.assertEqual(e.exception.status,409)
    def test_money_exact_and_reversible(self):
        c=command('pocket.post',changes=[{'kidId':'k1','amountMinor':10,'note':'Allowance'},{'kidId':'k1','amountMinor':20,'note':'Allowance'}])
        state,_=self.apply(c)
        self.assertEqual(state['pocketMoneyTxns'][-1]['balanceAfterMinor'],30)
        reverse=command('pocket.reverse',transactionId='test-1:0',reason='Correction');reverse.update(operationId='reverse-1',expectedRevision=1)
        state,_=self.apply(reverse,state)
        self.assertEqual(len(state['pocketMoneyTxns']),3)
        self.assertEqual(state['pocketMoneyTxns'][-1]['balanceAfterMinor'],20)
        reverse.update(operationId='reverse-2',expectedRevision=2)
        with self.assertRaises(OperationError):self.apply(reverse,state)
    def test_invalid_numeric_values(self):
        for value in [True,float('inf'),-10]:
            with self.assertRaises(OperationError):self.apply(command(changes=[{'houseId':'h1','productId':'p1','delta':value,'reason':'X'}]))
    def test_snapshot_cannot_rewrite_financial_history(self):
        state,_=self.apply(command('pocket.post',changes=[{'kidId':'k1','amountMinor':10,'note':'Allowance'}]))
        for payload in [{'pocketMoneyTxns':[]},{'pocketMoneyTxns':[{**state['pocketMoneyTxns'][0],'amount':99}]}]:
            c=command('state.commit',**payload);c.update(operationId='edit',expectedRevision=1)
            with self.assertRaises(OperationError) as e:self.apply(c,state)
            self.assertEqual(e.exception.payload['code'],'immutable_ledger')
    def test_snapshot_cannot_create_protected_collection_as_nonadmin(self):
        state={**self.state,'children':[]}
        with self.assertRaises(OperationError) as e:
            self.apply(command('state.commit',children=[{'id':'k2'}]),state,session={'mode':'staff','profile_id':'e2'})
        self.assertEqual(e.exception.status,403)
    def test_snapshot_checks_collection_shape(self):
        with self.assertRaises(OperationError):self.apply(command('state.commit',attendance={}))

    def test_initial_count_distinguishes_unrecorded_from_zero(self):
        c=command('stock.record',changes=[{'houseId':'h1','productId':'p2','quantity':0,'reason':'Count'}])
        state,_=self.apply(c)
        self.assertEqual(state['stock']['h1:p2'],0)
        c.update(operationId='second-count',expectedRevision=1)
        with self.assertRaises(OperationError) as e:self.apply(c,state)
        self.assertEqual(e.exception.payload['code'],'already_recorded')
    def test_receipt_stock_trip_and_request_are_atomic_and_replayable(self):
        state={**self.state,'customProducts':[{'id':'p1','unit':'Stk'}],'listEntries':[{'id':'l1','houseId':'h1','productId':'p1','qty':2,'unit':'Stk','name':'Milk','status':'pending','fromRequestId':'r1'}],'listRequests':[{'id':'r1','status':'accepted'}]}
        c=command('shopping.confirm',houseId='h1',items=[{'entryId':'l1','outcome':'bought'}])
        after,_=self.apply(c,state)
        self.assertEqual(after['stock']['h1:p1'],7)
        self.assertEqual(after['listEntries'][0]['status'],'bought')
        self.assertEqual(after['listRequests'][0]['status'],'bought')
        replay,result=self.apply(c,after)
        self.assertTrue(result['replayed']);self.assertEqual(len(replay['shoppingTrips']),1)
        c.update(operationId='different-operation',expectedRevision=1)
        with self.assertRaises(OperationError) as e:self.apply(c,after)
        self.assertEqual(e.exception.payload['code'],'already_processed')
    def test_receipt_invalid_second_entry_rolls_back_stock(self):
        state={**self.state,'customProducts':[{'id':'p1','unit':'Stk'}],'listEntries':[{'id':'l1','houseId':'h1','productId':'p1','qty':2,'unit':'Stk','status':'pending'}]}
        c=command('shopping.confirm',houseId='h1',items=[{'entryId':'l1','outcome':'bought'},{'entryId':'absent','outcome':'bought'}])
        with self.assertRaises(OperationError):self.apply(c,state)
        self.assertEqual(state['stock']['h1:p1'],5)
        self.assertEqual(state['listEntries'][0]['status'],'pending')
    def test_catalog_denies_forged_stock_target(self):
        with self.assertRaises(OperationError) as e:
            apply_operation(self.state,command(changes=[{'houseId':'h1','productId':'p1','delta':1,'reason':'X'}]),ADMIN,KEYS,DICT,catalog={'houses':[],'products':[]})
        self.assertEqual(e.exception.status,404)

    def test_bulk_attendance_has_explicit_unrecorded_state_and_actor(self):
        c=command('attendance.set',changes=[{'kidId':'k1','date':'2026-09-07','status':'unrecorded'}])
        state,_=self.apply(c)
        self.assertEqual(state['attendance'][0]['status'],'unrecorded')
        self.assertEqual(state['attendance'][0]['by'],'e1')
        self.assertEqual(state['log'][0]['before'],'unrecorded')
    def test_attendance_invalid_date_or_child_rolls_back(self):
        for child,ds in [('k1','2026-02-30'),('absent','2026-09-07')]:
            with self.assertRaises(OperationError):
                self.apply(command('attendance.set',changes=[{'kidId':child,'date':ds,'status':'present'}]))
        self.assertNotIn('attendance',self.state)

    def test_unknown_snapshot_collection_is_not_silently_discarded(self):
        with self.assertRaises(OperationError) as e:self.apply(command('state.commit',futureCollection=[]))
        self.assertEqual(e.exception.payload['code'],'unknown_collection')
    def test_snapshot_cannot_remove_command_audit(self):
        state,_=self.apply(command(changes=[{'houseId':'h1','productId':'p1','delta':1,'reason':'Count'}]))
        c=command('state.commit',log=[]);c.update(operationId='clear-log',expectedRevision=1)
        after,_=self.apply(c,state)
        self.assertTrue(any(r['operationId']=='test-1' for r in after['log']))

    def test_minor_units(self):
        self.assertEqual(minor_units('0.29'),29)
        self.assertEqual(minor_units('1.005'),101)
        with self.assertRaises(OperationError):minor_units('NaN')

class ChildProjection(unittest.TestCase):
    def test_child_cannot_download_other_ledgers_or_operational_records(self):
        payload={'revision':1,'changed':True,'stock':{'h1:p1':123},'schoolLessonNotes':[{'body':'private'}],
          'importantDates':[{'note':'private'}],'staffKidRatings':[{'kidId':'k1','raterId':'private'}],
          'pocketMoneyTxns':[{'id':'own','kidId':'k1','amount':1},{'id':'private','kidId':'k2','amount':99}],
          'kidNotes':[{'kidId':'k1','by':'e1','text':'private'},{'kidId':'k1','by':'k1','text':'own'}],
          'children':[{'id':'k1','name':'Own','privateNote':'private'},{'id':'k2','name':'private'}],
          'futureStaffCollection':[{'secret':'private'}]}
        result=project_child_state(payload,'k1',{'stock'})
        self.assertNotIn('private',json.dumps(result))
        self.assertEqual(result['pocketMoneyTxns'][0]['id'],'own')
        self.assertEqual(result['stock'],{})
        self.assertEqual(len(payload['pocketMoneyTxns']),2)
    def test_schedule_override_removes_child_without_leaking_other_assignment(self):
        payload={'template':[{'id':'t1','day':0,'childIds':['k1'],'activityId':'own'}],
          'overrides':[{'id':'o1','templateId':'t1','date':'2026-09-07','childIds':['k2'],'note':'private'}],
          'events':[{'id':'e1','status':'draft','childIds':['k1'],'de':'private'}]}
        result=project_child_state(payload,'k1')
        self.assertEqual(result['overrides'][0]['childIds'],[])
        self.assertNotIn('private',json.dumps(result))
        self.assertEqual(result['events'],[])
    def test_client_shared_collections_have_server_persistence_contract(self):
        import ast,re
        root=Path(__file__).resolve().parents[1]
        app=(root/'app.js').read_text();server=ast.parse((root/'server.py').read_text())
        client=set(ast.literal_eval(re.search(r'const SHARED_KEYS = (\[[\s\S]*?\]);',app).group(1)))
        node=next(n for n in server.body if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='OPS_KEYS' for t in n.targets))
        stored=set(ast.literal_eval(node.value))
        self.assertEqual(client-stored-{'staffKidRatingSummaries'},set())

class AtomicPersistence(unittest.TestCase):
    def test_receipt_survives_process_restart(self):
        with tempfile.TemporaryDirectory() as tmp:
            env=dict(os.environ,PAIDIA_DATABASE_URL='sqlite:///'+str(Path(tmp)/'restart.db'))
            for key in ('KV_REST_API_URL','KV_REST_API_TOKEN','UPSTASH_REDIS_REST_URL','UPSTASH_REDIS_REST_TOKEN'):env.pop(key,None)
            script="""import db,json
from operations import apply_operation
command={'operationId':'restart-op','action':'stock.adjust','expectedRevision':0,'payload':{'changes':[{'houseId':'h1','productId':'p1','delta':2,'reason':'Count'}]}}
state,result=db.update_json_atomic('ops',lambda value:apply_operation(value or {'revision':0,'stock':{'h1:p1':1}},command,{'mode':'staff','profile_id':'e1'},['stock','log'],{'stock'}))
print(json.dumps({'quantity':state['stock']['h1:p1'],'revision':state['revision'],'replayed':result['replayed']}))
"""
            first=json.loads(subprocess.check_output([sys.executable,'-c',script],env=env,cwd=Path(__file__).resolve().parents[1]))
            second=json.loads(subprocess.check_output([sys.executable,'-c',script],env=env,cwd=Path(__file__).resolve().parents[1]))
            self.assertEqual(first,{'quantity':3,'revision':1,'replayed':False})
            self.assertEqual(second,{'quantity':3,'revision':1,'replayed':True})

    def test_concurrent_sqlite_updates_and_rollback(self):
        # Import db without reading project credentials; set only this module's configuration.
        import db
        with tempfile.TemporaryDirectory() as tmp:
            old=(db.DATABASE_URL,db.SQLITE_PATH,db._INITIALIZED)
            db.DATABASE_URL='sqlite:///'+str(Path(tmp)/'test.db');db.SQLITE_PATH=Path(tmp)/'test.db';db._INITIALIZED=False
            try:
                db.set_json('counter',{'n':0})
                def inc(_):return db.update_json_atomic('counter',lambda value:({'n':value['n']+1},True))
                with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:list(pool.map(inc,range(30)))
                self.assertEqual(db.get_json('counter')['n'],30)
                def fail(value):raise ValueError('rollback')
                with self.assertRaises(ValueError):db.update_json_atomic('counter',fail)
                self.assertEqual(db.get_json('counter')['n'],30)
            finally:db.DATABASE_URL,db.SQLITE_PATH,db._INITIALIZED=old
if __name__=='__main__':unittest.main()
