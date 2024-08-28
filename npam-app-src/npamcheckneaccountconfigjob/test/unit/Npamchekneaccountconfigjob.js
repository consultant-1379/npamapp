define([
    'jscore/core',
    "npamcheckneaccountconfigjob/Npamcheckneaccountconfigjob",
    'jscore/ext/locationController',
    "widgets/Dialog",
    'jscore/ext/mvp',
    "layouts/TopSection"
], function(core, Npamcheckneaccountconfigjob, LocationController, Dialog, mvp, TopSection){
    "use strict";

    describe("Test the main page of Npamcheckneaccountconfigjob", function() {
        var NpamcheckneaccountconfigStep, sandbox, viewStub, locationController, server, attributeStub, contextStub, eventBusStub;
        beforeEach(function() {

            sandbox = sinon.sandbox.create();

            attributeStub = {
                removeModifier: function() {}
            };

            viewStub = {
                showWhiteBackground: function() {},
                getLoadingAnimationHolder: function() { return attributeStub; }
            };

            eventBusStub = new core.EventBus();

            sandbox.stub(viewStub, "showWhiteBackground");
            sandbox.spy(viewStub, "getLoadingAnimationHolder");

            NpamcheckneaccountconfigStep = new Npamcheckneaccountconfigjob();
            sandbox.stub(NpamcheckneaccountconfigStep, "getEventBus").returns(eventBusStub);

            NpamcheckneaccountconfigStep.view = viewStub;

            server = sinon.fakeServer.create();
        });

        afterEach(function() {

            sandbox.restore();
            server.restore();

        });

        it("Checks if session storage gets updated correctly when onResume is called", function() {

            localStorage.setItem("navigateTo", null);

            NpamcheckneaccountconfigStep.locationController = new LocationController();
            NpamcheckneaccountconfigStep.locationController.start();

            NpamcheckneaccountconfigStep.onResume();
            server.respondWith("GET", "/oss/uiaccesscontrol/resources/neaccount_job/actions", [200,{},'{"resource":"neaccount_job","actions":["read","create"]}']);
            server.respond();

            server.respondWith("GET", "/oss/shm/rest/servertime/getTimeOffset", [200,{},'{"timestamp":1454000043,"offset":3600000, "serverLocation":"Europe/London" }']);
            server.respond();

            expect(localStorage.getItem("navigateTo")).to.equal("npamapp");
        });

        it("Checks if localStorage gets cleared before leaving to another app", function() {

            localStorage.setItem("comefrom", "inventory");

            var containerEvent = {};

            containerEvent.type = "tabclose";

            NpamcheckneaccountconfigStep.onBeforeLeave(containerEvent);

            expect(" ").to.equal(NpamcheckneaccountconfigStep.onBeforeLeave(containerEvent));

            expect(localStorage.getItem("comefrom")).to.equal('#npamapp');

        });

        it("Application should navigate accordingly when it is reloaded", function() {

            localStorage.setItem("navigateTo", "npamapp");

            NpamcheckneaccountconfigStep.cancelDialog = new Dialog();

            sandbox.stub(NpamcheckneaccountconfigStep, "clearWizard");
            NpamcheckneaccountconfigStep.reloadPage();

            NpamcheckneaccountconfigStep.cancelDialog.attachTo(NpamcheckneaccountconfigStep.getElement());
            expect(window.location.hash).to.equal("#npamapp");

        });

        it("Checks if json data is send correctly when job has been created successfully", function() {

            NpamcheckneaccountconfigStep.model = new mvp.Model();

            NpamcheckneaccountconfigStep.finishDialog = new Dialog();

            NpamcheckneaccountconfigStep.model.setAttribute("finalJson", {});

            sandbox.stub(NpamcheckneaccountconfigStep, "checkneaccountconfigsjobJobSuccess");
            NpamcheckneaccountconfigStep.getJSONData();

            server.respondWith("POST", "/npamservice/v1/createjob", [200, { "Content-Type": "application/json" },JSON.stringify({})]);
            server.respond();

            expect(NpamcheckneaccountconfigStep.checkNeAccountsJobSuccess.callCount).to.equal(1);
        });

        it("Checks if json data is send correctly when job gets failed", function() {

            NpamcheckneaccountconfigStep.model = new mvp.Model();

            NpamcheckneaccountconfigStep.finishDialog = new Dialog();

            NpamcheckneaccountconfigStep.model.setAttribute("finalJson", {});

            sandbox.stub(NpamcheckneaccountconfigStep, "loadErrorMessage");
            NpamcheckneaccountconfigStep.getJSONData();

            server.respondWith("POST", "/npamservice/v1/createjob", [404, { "Content-Type": "application/json" },JSON.stringify({})]);
            server.respond();

            expect(NpamcheckneaccountconfigStep.loadErrorMessage.callCount).to.equal(1);
        });

        it("Finish dialog should be displayed when finish button is clicked", function() {

            NpamcheckneaccountconfigStep.finish = {
              isScheduled: function() {
                  return false;
              }
            };

            sandbox.spy(NpamcheckneaccountconfigStep.finishDialog, "show");

            NpamcheckneaccountconfigStep.finishJobCreation();

            expect(NpamcheckneaccountconfigStep.finishDialog.show.callCount).to.equal(1);
        });

    });
});
