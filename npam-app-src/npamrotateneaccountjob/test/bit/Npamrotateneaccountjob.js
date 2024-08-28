define([
    'jscore/core',
    'npamrotateneaccountjob/Npamrotateneaccountjob',
    "jscore/ext/mvp",
    'npamrotateneaccountjob/finish/finish'
], function (core, Npamrotateneaccountjob, mvp, Finish) {
   'use strict';

   describe('Npamrotateneaccountjob', function () {
        it('Npamrotateneaccountjob should be defined', function () {
            expect(Npamrotateneaccountjob).not.to.be.undefined;
        });


      describe('Npamrotateneaccountjob', function () {
         it('Verifying onStart() has been called', function (done) {
            sinon.spy(Npamrotateneaccountjob.prototype, "onStart");
            var currentApp = new Npamrotateneaccountjob();
            currentApp.start(core.Element.wrap(document.getElementById("bitContainer")));
            expect(currentApp.onStart.callCount).to.equal(1);
            Npamrotateneaccountjob.prototype.onStart.restore();
            currentApp.stop();
            done();
         });
      });

      describe('Methods', function () {

        var currentApp, server;
        beforeEach(function (done) {
            server = sinon.fakeServer.create();
            sinon.spy(Npamrotateneaccountjob.prototype, "getJSONData");
            sinon.spy(Npamrotateneaccountjob.prototype, "rotateneaccountsJobSuccess");
            sinon.spy(Npamrotateneaccountjob.prototype, "loadErrorMessage");
            currentApp = new Npamrotateneaccountjob();
            currentApp.finish = new Finish(new mvp.Model());
            sinon.stub(currentApp.finish, "isScheduled");
            currentApp.start(core.Element.wrap(document.getElementById("bitContainer")));
            done();
        });

        afterEach(function () {
            currentApp.stop();
            server.restore();
            Npamrotateneaccountjob.prototype.getJSONData.restore();
            Npamrotateneaccountjob.prototype.rotateneaccountsJobSuccess.restore();
            Npamrotateneaccountjob.prototype.loadErrorMessage.restore();
        });

        describe('onStart', function () {

            it("Call getJSONData : On click of create button has called getJSONData()", function () {
                currentApp.finishDialog.buttons[0].trigger("click");
                expect(Npamrotateneaccountjob.prototype.getJSONData.callCount).to.equal(1);
            });

            it("Call loadErrorMessage has been called", function () {
                currentApp.finishDialog.buttons[0].trigger("click");
                server.respondWith("POST","/npamservice/v1/createjob",
                    [403, { "Content-Type": "application/json" },
                        '[{"errorCode" : "failed"}]']);
                server.respond();
                expect(Npamrotateneaccountjob.prototype.loadErrorMessage.callCount).to.equal(1);
            });
        });

      });
   });
});