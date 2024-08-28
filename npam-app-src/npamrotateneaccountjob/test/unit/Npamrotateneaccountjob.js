define([
    'jscore/core',
    "npamrotateneaccountjob/Npamrotateneaccountjob",
    'jscore/ext/locationController',
    "widgets/Dialog",
    'jscore/ext/mvp',
    "layouts/TopSection"
], function(core, Npamrotateneaccountjob, LocationController, Dialog, mvp, TopSection){
    "use strict";

    describe("Test the main page of Npamrotateneaccountjob", function() {
        var NpamrotateneaccountStep, sandbox, viewStub, locationController, server, attributeStub, contextStub, eventBusStub;
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

            NpamrotateneaccountStep = new Npamrotateneaccountjob();
            sandbox.stub(NpamrotateneaccountStep, "getEventBus").returns(eventBusStub);

            NpamrotateneaccountStep.view = viewStub;

            server = sinon.fakeServer.create();
        });

        afterEach(function() {

            sandbox.restore();
            server.restore();

        });

        it("Checks if session storage gets updated correctly when onResume is called", function() {

            localStorage.setItem("navigateTo", null);

            NpamrotateneaccountStep.locationController = new LocationController();
            NpamrotateneaccountStep.locationController.start();

            NpamrotateneaccountStep.onResume();
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

            NpamrotateneaccountStep.onBeforeLeave(containerEvent);

            expect(" ").to.equal(NpamrotateneaccountStep.onBeforeLeave(containerEvent));

            expect(localStorage.getItem("comefrom")).to.equal('#npamapp');

        });

        it("Application should navigate accordingly when it is reloaded", function() {

            localStorage.setItem("navigateTo", "npamapp");

            NpamrotateneaccountStep.cancelDialog = new Dialog();

            sandbox.stub(NpamrotateneaccountStep, "clearWizard");
            NpamrotateneaccountStep.reloadPage();

            NpamrotateneaccountStep.cancelDialog.attachTo(NpamrotateneaccountStep.getElement());
            expect(window.location.hash).to.equal("#npamapp");

        });

        it("Checks if json data is send correctly when job has been created successfully", function() {

            NpamrotateneaccountStep.model = new mvp.Model();

            NpamrotateneaccountStep.finishDialog = new Dialog();

            NpamrotateneaccountStep.model.setAttribute("finalJson", {});

            sandbox.stub(NpamrotateneaccountStep, "rotateneaccountsjobJobSuccess");
            NpamrotateneaccountStep.getJSONData();

            server.respondWith("POST", "/npamservice/v1/createjob", [200, { "Content-Type": "application/json" },JSON.stringify({})]);
            server.respond();

            expect(NpamrotateneaccountStep.rotateNeAccountsJobSuccess.callCount).to.equal(1);
        });

        it("Checks if json data is send correctly when job gets failed", function() {

            NpamrotateneaccountStep.model = new mvp.Model();

            NpamrotateneaccountStep.finishDialog = new Dialog();

            NpamrotateneaccountStep.model.setAttribute("finalJson", {});

            sandbox.stub(NpamrotateneaccountStep, "loadErrorMessage");
            NpamrotateneaccountStep.getJSONData();

            server.respondWith("POST", "/npamservice/v1/createjob", [404, { "Content-Type": "application/json" },JSON.stringify({})]);
            server.respond();

            expect(NpamrotateneaccountStep.loadErrorMessage.callCount).to.equal(1);
        });

        it("Finish dialog should be displayed when finish button is clicked", function() {

            NpamrotateneaccountStep.finish = {
              isScheduled: function() {
                  return false;
              }
            };

            sandbox.spy(NpamrotateneaccountStep.finishDialog, "show");

            NpamrotateneaccountStep.finishJobCreation();

            expect(NpamrotateneaccountStep.finishDialog.show.callCount).to.equal(1);
        });

    });
});
