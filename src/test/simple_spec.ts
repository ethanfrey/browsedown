/* jshint esversion: 6 */
import {AbstractLevelDOWN} from 'abstract-leveldown';
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

function all(factory: Factory, test: Test): void {
  openClose(factory, test);
  readWrite(factory, test);
};

module.exports = {
  all,
  openClose,
  readWrite
}