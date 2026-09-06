import concurrent.futures
import importlib.util
import json
import os
from pathlib import Path
import tempfile
import unittest
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from operations import apply_operation, OperationError, minor_units

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

    def test_minor_units(self):
        self.assertEqual(minor_units('0.29'),29)
        self.assertEqual(minor_units('1.005'),101)
        with self.assertRaises(OperationError):minor_units('NaN')

class AtomicPersistence(unittest.TestCase):
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
