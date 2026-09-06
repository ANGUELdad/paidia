"""Exercise the snapshot function without opening the live database or credentials."""
import ast
import time
import unittest
from pathlib import Path

source = ast.parse(Path(__file__).resolve().parents[1].joinpath('server.py').read_text())
node = next(n for n in source.body if isinstance(n, ast.FunctionDef) and n.name == 'build_ops_snapshot')

class SnapshotTests(unittest.TestCase):
    def snapshot(self, data, query, session=None):
        scope = {'time': time, 'OPS_STATE': data, 'refresh_ops_state_from_disk': lambda: None}
        exec(compile(ast.Module(body=[node], type_ignores=[]), '<snapshot>', 'exec'), scope)
        return scope['build_ops_snapshot'](query, session)

    def test_roles(self):
        self.assertEqual(self.snapshot({}, {})[0], 401)
        self.assertEqual(self.snapshot({}, {}, {'mode':'child','admin':True})[0], 403)
        self.assertEqual(self.snapshot({}, {}, {'mode':'staff','admin':False})[0], 403)

    def test_filters_apply_to_every_collection_and_keep_zero(self):
        ts = int(time.mktime(time.strptime('2026-09-06', '%Y-%m-%d')) * 1000)
        good = {'kidId':'k1','houseId':'h1','date':'2026-09-06','ts':ts,'amount':0,'delta':99}
        rows = [good, {**good,'houseId':'h2'}, {**good,'date':'2026-09-05','ts':ts-86400000}, {**good,'kidId':'k2'}, {**good,'houseId':''}]
        data = {k:rows for k in ['log','shiftNotes','pocketMoneyTxns','schoolActivity']}
        status, result = self.snapshot(data, {'date':'2026-09-06','kidId':'k1','houseId':'h1'}, {'mode':'staff','admin':True})
        self.assertEqual(status, 200)
        for key in ['log','shiftNotes','pocket','school']:
            self.assertEqual(len(result[key]), 1, key)
        self.assertEqual(result['pocket'][0]['amount'], 0)

    def test_journal_dictionary_is_supported(self):
        _, result = self.snapshot({'shiftNotes':{'e1:2026-09-06':{'date':'2026-09-06','text':'Handover'}}}, {'date':'2026-09-06'}, {'mode':'staff','admin':True})
        self.assertEqual(result['shiftNotes'][0]['text'], 'Handover')

    def test_school_limit_is_global(self):
        data = {k:[{'kidId':'k1'}]*40 for k in ['schoolActivity','kidNotes','staffKidRatings']}
        _, result = self.snapshot(data, {}, {'mode':'staff','admin':True})
        self.assertEqual(len(result['school']), 30)

if __name__ == '__main__':
    unittest.main()
