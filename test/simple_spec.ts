/* jshint esversion: 6 */
import test from 'tape';

import {BrowseDown, makeDB} from '../src';

test('always passes', t => {
  t.equal(1+1, 2);
  t.end();
});

// test('never passes', t => {
//   t.equal(2, 3);
//   t.end();
// });

test('create and delete databases', t => {
  const store = makeDB('spec-store-simple', () => {
    store.deleteDatabase(
      () => { t.equal(1, 1); t.end() },  // just to show some success
      (err: any) => { t.error(err); t.end(); }
    );
  });
});

test('should open and close db', t => {
  const store = new BrowseDown('open-close-test');
  // TODO: is there a way to avoid these callbacks?
  store.open((err: any) => {
    t.error(err);
    store.close((err2: any) => {
      t.error(err2);
      t.end();
    });
  });
});

test('should put and get data', t => {
  const store = new BrowseDown('put-get-test-2');
  // TODO: is there a way to avoid these callbacks?
  store.open((err: any) => {
    t.error(err);
    store.get('foo', (err2: any, noval?: any) => {
      // not found error....
      // t.assert(err, 'Should be NotFoundError: ' + noval);
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
  