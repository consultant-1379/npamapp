define([
    'jscore/core',
    'npamcheckneaccountconfigjob/Npamcheckneaccountconfigjob',
    "jscore/ext/mvp",
    'npamlibrary/finish'
], function (core, Npamcheckneaccountconfigjob, mvp, Finish) {
   'use strict';

   describe('Npamcheckneaccountconfigjob', function () {
        it('Npamcheckneaccountconfigjob should be defined', function () {
            expect(Npamcheckneaccountconfigjob).not.to.be.undefined;
        });


      describe('Npamcheckneaccountconfigjob', function () {
         it('Verifying onStart() has been called', function (done) {
            sinon.spy(Npamcheckneaccountconfigjob.prototype, "onStart");
            var currentApp = new Npamcheckneaccountconfigjob();
            currentApp.start(core.Element.wrap(document.getElementById("bitContainer")));
            expect(currentApp.onStart.callCount).to.equal(1);
            Npamcheckneaccountconfigjob.prototype.onStart.restore();
            currentApp.stop();
            done();
         });
      });

      describe('Methods', function () {

        var currentApp, server;
        beforeEach(function (done) {
            server = sinon.fakeServer.create();
            sinon.spy(Npamcheckneaccountconfigjob.prototype, "getJSONData");
            sinon.spy(Npamcheckneaccountconfigjob.prototype, "checkneaccountsJobSuccess");
            sinon.spy(Npamcheckneaccountconfigjob.prototype, "loadErrorMessage");
            currentApp = new Npamcheckneaccountconfigjob();
            currentApp.finish = new Finish(new mvp.Model());
            sinon.stub(currentApp.finish, "isScheduled");
            currentApp.start(core.Element.wrap(document.getElementById("bitContainer")));
            done();
        });

        afterEach(function () {
            currentApp.stop();
            server.restore();
            Npamcheckneaccountconfigjob.prototype.getJSONData.restore();
            Npamcheckneaccountconfigjob.prototype.rotateneaccountsJobSuccess.restore();
            Npamcheckneaccountconfigjob.prototype.loadErrorMessage.restore();
        });

        describe('onStart', function () {

            it("Call getJSONData : On click of create button has called getJSONData()", function () {
                currentApp.finishDialog.buttons[0].trigger("click");
                expect(Npamcheckneaccountconfigjob.prototype.getJSONData.callCount).to.equal(1);
            });

            it("Call loadErrorMessage has been called", function () {
                currentApp.finishDialog.buttons[0].trigger("click");
                server.respondWith("POST","/npamservice/v1/createjob",
                    [403, { "Content-Type": "application/json" },
                        '[{"errorCode" : "failed"}]']);
                server.respond();
                expect(Npamcheckneaccountconfigjob.prototype.loadErrorMessage.callCount).to.equal(1);
            });
        });

      });
   });
});