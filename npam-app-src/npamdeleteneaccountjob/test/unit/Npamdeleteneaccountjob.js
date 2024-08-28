define([
    'jscore/core',
    "npamdeleteneaccountjob/Npamdeleteneaccountjob",
    'jscore/ext/locationController',
    "widgets/Dialog",
    'jscore/ext/mvp',
    "layouts/TopSection"
], function(core, Npamdeleteneaccountjob, LocationController, Dialog, mvp, TopSection){
    "use strict";

    describe("Test the main page of Npamdeleteneaccountjob", function() {

        var NpamdeleteneaccountjobStep, sandbox, viewStub, locationController, server, attributeStub, contextStub, eventBusStub;
        beforeEach(function() {

            sandbox = sinon.sandbox.create();

            attributeStub = {
                removeModifier: function() {

                }
            };

            viewStub = {
                showWhiteBackground: function() {

                },

                getLoadingAnimationHolder: function() {
                    return attributeStub;
                }
            };

            sandbox.stub(viewStub, "showWhiteBackground");
            sandbox.spy(viewStub, "getLoadingAnimationHolder");

            NpamdeleteneaccountjobStep = new Npamdeleteneaccountjob();

            NpamdeleteneaccountjobStep.view = viewStub;

            server = sinon.fakeServer.create();
        });

        afterEach(function() {

            sandbox.restore();
            server.restore();

        });

        it("Checks if session storage gets updated correctly when onResume is called", function() {

            localStorage.setItem("navigateTo", null);

            NpamdeleteneaccountjobStep.locationController = new LocationController();
            NpamdeleteneaccountjobStep.locationController.start();

            NpamdeleteneaccountjobStep.onResume();
            server.respondWith("GET", "oss/uiaccesscontrol/resources/neaccount_job/actions", [200,{},{"resource":"neaccount_job","actions":["read","create"]}]);
            server.respond();
            expect(localStorage.getItem("navigateTo")).to.equal("npamapp");
        });
        it("Checks if localStorage gets cleared before leaving to another app", function() {

            localStorage.setItem("comefrom", "inventory");

            var containerEvent = {};

            containerEvent.type = "tabclose";

            NpamdeleteneaccountjobStep.onBeforeLeave(containerEvent);

            expect(false).to.equal(NpamdeleteneaccountjobStep.onBeforeLeave(containerEvent));

            expect(localStorage.getItem("comefrom")).to.equal(null);

        });

        it("Application should navigate accordingly when it is reloaded", function() {

            localStorage.setItem("navigateTo", "npamapp");

            NpamdeleteneaccountjobStep.cancelDialog = new Dialog();

            sandbox.stub(NpamdeleteneaccountjobStep, "clearWizard");
            NpamdeleteneaccountjobStep.reloadPage();

            NpamdeleteneaccountjobStep.cancelDialog.attachTo(NpamdeleteneaccountjobStep.getElement());
            expect(window.location.hash).to.equal("#npamapp");

        });

        it("Checks if json data is send correctly when job has been created successfully", function() {

            NpamdeleteneaccountjobStep.model = new mvp.Model();

            NpamdeleteneaccountjobStep.finishDialog = new Dialog();

            NpamdeleteneaccountjobStep.model.setAttribute("finalJson", {});

            sandbox.stub(NpamdeleteneaccountjobStep, "deleteneaccountsjobJobSuccess");
            NpamdeleteneaccountjobStep.getJSONData();

            server.respondWith("POST", "/npamservice/v1/createjob", [200, { "Content-Type": "application/json" },JSON.stringify({})]);
            server.respond();

            expect(NpamdeleteneaccountStep.deleteNeAccountsJobSuccess.callCount).to.equal(1);
        });

        it("Checks if json data is send correctly when job gets failed", function() {

            NpamdeleteneaccountStep.model = new mvp.Model();

            NpamdeleteneaccountStep.finishDialog = new Dialog();

            NpamdeleteneaccountStep.model.setAttribute("finalJson", {});

            sandbox.stub(NpamdeleteneaccountStep, "loadErrorMessage");
            NpamdeleteneaccountStep.getJSONData();

            server.respondWith("POST", "/npamservice/v1/createjob", [404, { "Content-Type": "application/json" },JSON.stringify({})]);
            server.respond();

            expect(NpamdeleteneaccountStep.loadErrorMessage.callCount).to.equal(1);
        });

        it("Finish dialog should be displayed when finish button is clicked", function() {

            NpamdeleteneaccountStep.finish = {
              isScheduled: function() {
                  return false;
              }
            };

            sandbox.spy(NpamdeleteneaccountStep.finishDialog, "show");

            NpamdeleteneaccountStep.finishJobCreation();

            expect(NpamdeleteneaccountStep.finishDialog.show.callCount).to.equal(1);
        });

    });
});
