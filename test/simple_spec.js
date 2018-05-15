describe('IDBWrapper', function () {
  // if (typeof window.excludeIE == 'undefined') {
  //     try {
  //         IDBKeyRange.only([1]);
  //         window.excludeIE = false;
  //     } catch (e) {
  //         window.excludeIE = true;
  //     }
  // }

  // console.log('Running ' + (excludeIE ? 'reduced' : 'full') + ' suite.');

  it('always passes', function () {
    expect(1+1).to.equal(2);
  });

  // it('never passes', function () {
  //   expect(1+1).to.equal(3);
  // });

  // describe('delete databases', function () {
  //     var store;

  //     before(function (done) {
  //         store = new idb.IDBStore({
  //             storeName: 'spec-store-simple'
  //         }, function () {
  //             done();
  //         });
  //     });

  //     it('should delete the newly created database', function (done) {
  //         store.deleteDatabase(function (result) {
  //             expect(result).to.be.ok;
  //             done();
  //         }, done);
  //     });

  // });
});