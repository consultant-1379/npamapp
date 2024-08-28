define([
    'jscore/core',
    "npamcreateneaccountjob/Npamcreateneaccountjob",
    'jscore/ext/locationController',
    "widgets/Dialog",
    'jscore/ext/mvp',
    "layouts/TopSection"
], function(core, Npamcreateneaccountjob, LocationController, Dialog, mvp, TopSection){
    "use strict";

    describe("Test the main page of Npamcreateneaccountjob", function() {
        var NpamcreateneaccountStep, sandbox, viewStub, locationController, server, attributeStub, contextStub, eventBusStub;
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

            NpamcreateneaccountStep = new Npamcreateneaccountjob();
            sandbox.stub(NpamcreateneaccountStep, "getEventBus").returns(eventBusStub);

            NpamcreateneaccountStep.view = viewStub;

            server = sinon.fakeServer.create();
        });

        afterEach(function() {

            sandbox.restore();
            server.restore();

        });

        it("Checks if session storage gets updated correctly when onResume is called", function() {

            localStorage.setItem("navigateTo", null);

            NpamcreateneaccountStep.locationController = new LocationController();
            NpamcreateneaccountStep.locationController.start();

            NpamcreateneaccountStep.onResume();
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

            NpamcreateneaccountStep.onBeforeLeave(containerEvent);

            expect(" ").to.equal(NpamcreateneaccountStep.onBeforeLeave(containerEvent));

            expect(localStorage.getItem("comefrom")).to.equal('#npamapp');

        });

        it("Application should navigate accordingly when it is reloaded", function() {

            localStorage.setItem("navigateTo", "npamapp");

            NpamcreateneaccountStep.cancelDialog = new Dialog();

            sandbox.stub(NpamcreateneaccountStep, "clearWizard");
            NpamcreateneaccountStep.reloadPage();

            NpamcreateneaccountStep.cancelDialog.attachTo(NpamcreateneaccountStep.getElement());
            expect(window.location.hash).to.equal("#npamapp");

        });

        it("Checks if json data is send correctly when job has been created successfully", function() {

            NpamcreateneaccountStep.model = new mvp.Model();

            NpamcreateneaccountStep.finishDialog = new Dialog();

            NpamcreateneaccountStep.model.setAttribute("finalJson", {});

            sandbox.stub(NpamcreateneaccountStep, "createneaccountsjobJobSuccess");
            NpamcreateneaccountStep.getJSONData();

            server.respondWith("POST", "/npamservice/v1/createjob", [200, { "Content-Type": "application/json" },JSON.stringify({})]);
            server.respond();

            expect(NpamcreateneaccountStep.createNeAccountsJobSuccess.callCount).to.equal(1);
        });

        it("Checks if json data is send correctly when job gets failed", function() {

            NpamcreateneaccountStep.model = new mvp.Model();

            NpamcreateneaccountStep.finishDialog = new Dialog();

            NpamcreateneaccountStep.model.setAttribute("finalJson", {});

            sandbox.stub(NpamcreateneaccountStep, "loadErrorMessage");
            NpamcreateneaccountStep.getJSONData();

            server.respondWith("POST", "/npamservice/v1/createjob", [404, { "Content-Type": "application/json" },JSON.stringify({})]);
            server.respond();

            expect(NpamcreateneaccountStep.loadErrorMessage.callCount).to.equal(1);
        });

        it("Finish dialog should be displayed when finish button is clicked", function() {

            NpamcreateneaccountStep.finish = {
              isScheduled: function() {
                  return false;
              }
            };

            sandbox.spy(NpamcreateneaccountStep.finishDialog, "show");

            NpamcreateneaccountStep.finishJobCreation();

            expect(NpamcreateneaccountStep.finishDialog.show.callCount).to.equal(1);
        });

    });
});
