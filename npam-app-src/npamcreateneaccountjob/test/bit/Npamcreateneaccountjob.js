define([
    'jscore/core',
    'npamcreateneaccountjob/Npamcreateneaccountjob',
    "jscore/ext/mvp",
    'npamcreateneaccountjob/finish/finish'
], function (core, Npamcreateneaccountjob, mvp, Finish) {
   'use strict';

   describe('Npamcreateneaccountjob', function () {
        it('Npamcreateneaccountjob should be defined', function () {
            expect(Npamcreateneaccountjob).not.to.be.undefined;
        });


      describe('Npamcreateneaccountjob', function () {
         it('Verifying onStart() has been called', function (done) {
            sinon.spy(Npamcreateneaccountjob.prototype, "onStart");
            var currentApp = new Npamcreateneaccountjob();
            currentApp.start(core.Element.wrap(document.getElementById("bitContainer")));
            expect(currentApp.onStart.callCount).to.equal(1);
            Npamcreateneaccountjob.prototype.onStart.restore();
            currentApp.stop();
            done();
         });
      });

      describe('Methods', function () {

        var currentApp, server;
        beforeEach(function (done) {
            server = sinon.fakeServer.create();
            sinon.spy(Npamcreateneaccountjob.prototype, "getJSONData");
            sinon.spy(Npamcreateneaccountjob.prototype, "createneaccountsJobSuccess");
            sinon.spy(Npamcreateneaccountjob.prototype, "loadErrorMessage");
            currentApp = new Npamcreateneaccountjob();
            currentApp.finish = new Finish(new mvp.Model());
            sinon.stub(currentApp.finish, "isScheduled");
            currentApp.start(core.Element.wrap(document.getElementById("bitContainer")));
            done();
        });

        afterEach(function () {
            currentApp.stop();
            server.restore();
            Npamcreateneaccountjob.prototype.getJSONData.restore();
            Npamcreateneaccountjob.prototype.createneaccountsJobSuccess.restore();
            Npamcreateneaccountjob.prototype.loadErrorMessage.restore();
        });

        describe('onStart', function () {

            it("Call getJSONData : On click of create button has called getJSONData()", function () {
                currentApp.finishDialog.buttons[0].trigger("click");
                expect(Npamcreateneaccountjob.prototype.getJSONData.callCount).to.equal(1);
            });

            it("Call loadErrorMessage has been called", function () {
                currentApp.finishDialog.buttons[0].trigger("click");
                server.respondWith("POST","/npamservice/v1/createjob",
                    [403, { "Content-Type": "application/json" },
                        '[{"errorCode" : "failed"}]']);
                server.respond();
                expect(Npamcreateneaccountjob.prototype.loadErrorMessage.callCount).to.equal(1);
            });
        });

      });
   });
});