describe('BrowseDown', function () {
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

  describe('delete databases', function () {
      let store;

      before(function (done) {
          store = BrowseDown.makeDB('spec-store-simple', done);
      });

      it('should delete the newly created database', function (done) {
          store.deleteDatabase(function (result) {
              expect(result).to.be.ok;
              done();
          }, err => assert(false, err));
      });
  });

  describe('try abstract interface', function() {
    it('should open and close db', function(done) {
        let store = new BrowseDown.BrowseDown('open-close-test');
        // TODO: is there a way to avoid these callbacks?
        store.open(result => {
            expect(result).to.equal(undefined);
            store.close(result => {
                expect(result).to.equal(undefined);
                done();
            });
        });
    })

    it('should put and get data', function(done) {
        let store = new BrowseDown.BrowseDown('put-get-test');
        // TODO: is there a way to avoid these callbacks?
        store.open(err => {
            expect(err).to.be.undefined;
            store.get('foo', err => {
                // not found error....
                expect(err).to.be.an('error');
                // let's add it now
                // TODO: this errors!
                // let data = new Buffer('bar');
                store.put('foo', 'bar', { raw: true }, err => {
                    expect(err).to.be.undefined;
                    store.get('foo', (err, val) => {
                        // not found error....
                        expect(err).to.be.null;
                        expect(val.toString()).to.equal('bar');                                           
                        store.close(err => {
                            expect(err).to.be.undefined;
                            done();
                        });
                    });                
                });
            });
        });
    });
  });
});
  