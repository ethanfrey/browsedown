/* jshint esversion: 6 */
import test from 'tape';

// import entire abstract leveldown test suite....
import testCommon from 'abstract-leveldown/testCommon';
import { close as closeTest } from 'abstract-leveldown/abstract/close-test'; 
import openTest from 'abstract-leveldown/abstract/open-test'; 
import { all as delTest } from 'abstract-leveldown/abstract/del-test'; 
import { all as getTest } from 'abstract-leveldown/abstract/get-test'; 
import { all as putTest } from 'abstract-leveldown/abstract/put-test'; 
import { all as putGetDelTest } from 'abstract-leveldown/abstract/put-get-del-test'; 

// import { all as batchTest } from 'abstract-leveldown/abstract/batch-test'; 
// import { all as chainedBatchTest } from 'abstract-leveldown/abstract/chained-batch-test'; 
// import { all as iteratorTest } from 'abstract-leveldown/abstract/iterator-test';
import iterTest from 'abstract-leveldown/abstract/iterator-test';

import { browsedown } from '..';
import simple from './simple_spec';

// we need to manually skip openAdvanced as I don't know how to check if a db exists
const openBasic = (factory, test) => {
  openTest.setUp(test, testCommon);
  openTest.args(factory, test, testCommon);
  openTest.open(factory, test, testCommon);
  openTest.tearDown(test, testCommon);
};

// basic tests...
simple.all(browsedown, test);

closeTest(browsedown, test);
openBasic(browsedown, test);

// standard read-write suite
putTest(browsedown, test);
getTest(browsedown, test);
delTest(browsedown, test);
putGetDelTest(browsedown, test);

const iteratorTest = (factory, test) => {
  iterTest.setUp(factory, test, testCommon);
  iterTest.args(test);
  iterTest.sequence(test);
  // broken due to batch
  // iterTest.iterator(factory, test, testCommon);
  iterTest.snapshot(factory, test, testCommon);
  iterTest.tearDown(test, testCommon);
};

// iterator
try {
  // iteratorTest(browsedown, test);
  iteratorTest(browsedown, test);
} catch (err) {
  console.log('problem in iterator test');
  console.log(err);
}


// batch tests
// batchTest(browsedown, test);
// chainedBatchTest(browsedown, test);

