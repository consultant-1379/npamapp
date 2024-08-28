define([
    'jscore/core',
    'npamcdeleteneaccountjob/Npamdeleteneaccountjob',
    "jscore/ext/mvp",
    'npamdeleteneaccountjob/finish/finish'
], function (core, Npamdeleteneaccountjob, mvp, Finish) {
   'use strict';

    describe('Npamdeleteneaccountjob', function () {
        it('Npamdeleteneaccountjob should be defined', function () {
            expect(Npamdeleteneaccountjob).not.to.be.undefined;
        });


        describe('Npamdeleteneaccountjob', function () {
            it('Verifying onStart() has been called', function (done) {
                sinon.spy(Npamdeleteneaccountjob.prototype, "onStart");
                var currentApp = new Npamdeleteneaccountjob();
                currentApp.start(core.Element.wrap(document.getElementById("bitContainer")));
                expect(currentApp.onStart.callCount).to.equal(1);
                Npamdeleteneaccountjob.prototype.onStart.restore();
                currentApp.stop();
                done();
            });
        });

        describe('Methods', function () {
            var currentApp, server;

            beforeEach(function (done) {
                server = sinon.fakeServer.create();
                sinon.spy(Npamdeleteneaccountjob.prototype, "initStep1AndLocationController");
                sinon.spy(Npamdeleteneaccountjob.prototype, "loadApplication");
                sinon.spy(Npamdeleteneaccountjob.prototype, "getJSONData");
                sinon.spy(Npamdeleteneaccountjob.prototype, "loadErrorMessage");

                currentApp = new Npamdeleteneaccountjob();
                currentApp.finish = new Finish(new mvp.Model());
                sinon.stub(currentApp.finish, "isScheduled");
                currentApp.start(core.Element.wrap(document.getElementById("bitContainer")));
                done();
            });

            afterEach(function () {
                currentApp.stop();
                server.restore();
                Npamdeleteneaccountjob.prototype.getJSONData.restore();
                Npamdeleteneaccountjob.prototype.backupJobSuccess.restore();
                Npamdeleteneaccountjob.prototype.loadErrorMessage.restore();
            });

            describe('onStart', function () {
                it("Verifying methods called by onStart()", function () {
                    expect(Npamdeleteneaccountjob.prototype.initStep1AndLocationController.callCount).to.equal(1);
                    expect(Npamdeleteneaccountjob.prototype.loadApplication.callCount).to.equal(1);
                    expect(Npamdeleteneaccountjob.step1).not.to.be.undefined;
                });

                it("Call getJSONData : On click of create button has called getJSONData()", function () {
                    currentApp.finishDialog.buttons[0].trigger("click");
                    expect(Npamdeleteneaccountjob.prototype.getJSONData.callCount).to.equal(1);
                });

                it("Call loadErrorMessage has been called", function () {
                    currentApp.finishDialog.buttons[0].trigger("click");
                    server.respondWith("POST","/npamservice/v1/createjob",
                        [403, { "Content-Type": "application/json" },
                            '[{"errorCode" : "failed"}]']);
                    server.respond();
                    expect(Npamdeleteneaccountjob.prototype.loadErrorMessage.callCount).to.equal(1);
                });
            });
      });
   });
});