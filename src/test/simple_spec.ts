/* jshint esversion: 6 */
import {AbstractLevelDOWN, PutBatch} from 'abstract-leveldown';
import {TestCase} from 'tape';

type Factory = (name: string) => AbstractLevelDOWN;
type Test = (name: string, cb: TestCase) => void;

function openClose(factory: Factory, test: Test): void {
  test('should open and close db', t => {
    const store = factory('open-close-test');
    // TODO: is there a way to avoid these callbacks?
    store.open((err: any) => {
      t.error(err);
      store.close((err2: any) => {
        t.error(err2);
        t.end();
      });
    });
  });
};

function readWrite(factory: Factory, test: Test): void {
  test('should put and get data', t => {
    const store = factory('put-get-test-2');
    // TODO: is there a way to avoid these callbacks?
    store.open((err: any) => {
      t.error(err);
      store.get('foo', (err2: any, noval?: any) => {
        // not found error....
        t.assert(err2, 'Should be NotFoundError: ' + noval);
        // let's add it now
        store.put('foo', 'bar', { raw: true }, (err3: any) => {
          t.error(err3);
          store.get('foo', (err4: any, val: any) => {
            // not found error....
            t.error(err4);
            t.assert(val);
            t.equals('bar', val.toString());                                           
            store.close((err5: any) => {
              t.error(err5);
              t.end();
            });
          });                
        });
      });
    });
  });
};

function iterate(factory: Factory, test: Test): void {
  test('should iterate over a batch', t => {
    const store = factory('iterate-test');
    // TODO: is there a way to avoid these callbacks?
    store.open((err: any) => {
      t.error(err);
      // these must be in sorted order, as we check those
      // in order from iterators
      const batch : Array<PutBatch<any, any>> = [
        {type: 'put', key: 'bar', value: 'barbar'},
        {type: 'put', key: 'baz', value: 'bazbaz'},
        {type: 'put', key: 'foo', value: 'foofoo'}
      ];

      const check = () => {
        // const opts = { lt: 'das' };
        // const count = 2;
        const opts = undefined;
        const count = 3;
        const iter = store.iterator(opts);
        // first calls gets data
        let i = 0;
        const checkVal = (err: any, key: any, val: any) => {
          t.error(err);
          if (i < count) {
            t.equals(key.toString(), batch[i].key);
            t.equals(val.toString(), batch[i].value);
            i++;
            // this works, process.nextTick doesn't
            next();
            // process.nextTick(next);
          } else {
            t.equals(key, undefined);
            t.equals(val, undefined);
            iter.end(() => t.end());
          }
        }
        const next = () => iter.next(checkVal);
        next();
      };

      store.batch(batch, check);
    });
  });
}

function all(factory: Factory, test: Test): void {
  openClose(factory, test);
  readWrite(factory, test);
  iterate(factory, test);
};

module.exports = {
  all,
  openClose,
  readWrite
}