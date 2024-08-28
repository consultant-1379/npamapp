define([
    "jscore/core",
    "npamjob/Npamjob"
], function(core, Npamjob ) {
    "use strict";

    describe("Tests the main page of npamjob app", function() {

        var NpamjobMain, options, childrenArray, sandbox, eventBus, styleStub, server;
        beforeEach(function() {

            server = sinon.fakeServer.create();

            eventBus = {
                publish: function() {},
                subscribe: function() {}
            };

            styleStub = {
                setStyle: function() {}
            };

            sandbox = sinon.sandbox.create();

            sandbox.stub(Npamjob.prototype, "getEventBus", function() {
                return eventBus;
            });

            sandbox.stub(Npamjob.prototype, "getElement", function() {
                return styleStub;
            });

            NpamjobMain = new Npamjob();
        });

        afterEach(function() {

            sandbox.restore();

            server.restore();
        });

        it("Checks the panel event actions when tableSettings is selected", function() {
            NpamjobMain.showSettings = true;
            sandbox.stub(NpamjobMain, "loadRightPanel");
            NpamjobMain.panelEvents("tableSettings");
            expect(NpamjobMain.loadRightPanel.calledWith("Table Settings")).to.equal(true);
        });

        it("Checks the panel event actions when tableSettings is selected and there is no table displayed on the page", function() {
            NpamjobMain.showSettings = false;
            sandbox.stub(NpamjobMain, "loadRightPanel");
            NpamjobMain.panelEvents("tableSettings");
            expect(NpamjobMain.loadRightPanel.calledWith("Table Settings")).to.equal(true);
        });

        it("Checks the panel event actions when jobSummary is selected", function() {
            sandbox.stub(NpamjobMain, "loadRightPanel");
            NpamjobMain.panelEvents("jobSummary");
            expect(NpamjobMain.loadRightPanel.calledWith(" Job Summary")).to.equal(true);
        });

        it("Checks if sessionStorage is cleared, before leaving the app", function() {
            var containerEvent = {
                type: "tabclose"
            };

            sessionStorage.setItem("comeFrom", "npamapp");
            NpamjobMain.onBeforeLeave(containerEvent);
            expect(sessionStorage.getItem("comeFrom")).to.equal(null);
        });

        it("If showTableSettings is published with true value, then table settings should be displayed", function() {

            NpamjobMain.showTableSettings(true);

            expect(NpamjobMain.showSettings).to.equal(true);
        });

        it("If showTableSettings is published with true value, then table settings should not be displayed", function() {
            NpamjobMain.showTableSettings(false);
            expect(NpamjobMain.showSettings).to.equal(false);
        });

//        it("When the app gets loaded, if the rest call is successful, jobs should be loaded", function() {
//
//            sandbox.stub(NpamjobMain, "loadJobs");
//
//            NpamjobMain.onAppCalled();
//
//            server.respondWith("GET", "/oss/shm/rest/rbac/viewjobs", [200, { "Content-Type": "application/json" },JSON.stringify({})]);
//            server.respond();
//
//            expect(NpamjobMain.loadJobs.callCount).to.equal(1);
//        });

//        it("When the app gets loaded, if the rest call is not successful, showAccessDenied should be called", function() {
//
//            sandbox.stub(NpamjobMain, "showAccessDenied");
//
//            NpamjobMain.onAppCalled();
//
//            server.respondWith("GET", "/oss/shm/rest/rbac/viewjobs", [403, { "Content-Type": "application/json" },JSON.stringify({})]);
//            server.respond();
//
//            expect(NpamjobMain.showAccessDenied.callCount).to.equal(1);
//        });
    });
});