define([
    "jscore/core",
    "npamjobdetails/Npamjobdetails",
    "widgets/Dialog",
    "npamjobdetails/regions/mejobdetails/mejobdetails"
], function(core, Npamjobdetails, Dialog, MeJobDetails) {
    "use strict";

    describe("Test the main page of npamjobdetails", function() {

        var npamjobdetailsMain, sandbox, eventBus, meJobDetailsRegion, commentsRegion, context;
        beforeEach(function() {
            sandbox = sinon.sandbox.create();

            var serverTime = '{ "date":1452266396224,offset":0.0,"serverLocation":"Europe/London"}';

            sessionStorage.setItem('shm-serverTime', JSON.stringify(serverTime));

            npamjobdetailsMain = new Npamjobdetails();

            context = {
                eventBus: {
                    publish: function() {
                    },
                    subscribe: function() {
                    }
                }
            };

            npamjobdetailsMain.meJobDetails = new MeJobDetails({
                context: context
            });
        });

        afterEach(function() {

            sandbox.restore();
        });

        it("When tableSettings is selected in panel events, right panel should be loaded", function() {

            sandbox.stub(npamjobdetailsMain, "loadRightPanel");

            npamjobdetailsMain.showSettings = true;

            npamjobdetailsMain.panelEvents("tableSettings");

            expect(npamjobdetailsMain.loadRightPanel.callCount).to.equal(1);
        });

        it("When tableSettings is selected in panel events and if table is not loaded, right panel should display defaultMessage", function() {

            sandbox.stub(npamjobdetailsMain, "loadRightPanel");

            npamjobdetailsMain.showSettings = false;

            npamjobdetailsMain.panelEvents("tableSettings");

            expect(npamjobdetailsMain.loadRightPanel.callCount).to.equal(1);

            expect(npamjobdetailsMain.displayMessage.view.getElement().find(".eaShmlibrary-wInventoryDetails-DisplayMessage-DescriptionLeft").getText()).to.equal("Table Settings are not visible if there is no information on the page.");
        });

        it("When nodeActivites is selected in panel events, right panel should load nodeActivites", function() {

            sandbox.stub(npamjobdetailsMain, "loadRightPanel");

            npamjobdetailsMain.meJobDetails = new MeJobDetails({
                context: context
            });

            npamjobdetailsMain.panelEvents("nodeActivities");

            expect(npamjobdetailsMain.loadRightPanel.callCount).to.equal(1);

            expect(npamjobdetailsMain.loadRightPanel.calledWith("Node Activities")).to.equal(true);
        });

        it("When jobComments is selected in panel events, right panel should load jobComments", function() {

            sandbox.stub(npamjobdetailsMain, "loadRightPanel");

            npamjobdetailsMain.panelEvents("jobComments");

            expect(npamjobdetailsMain.loadRightPanel.callCount).to.equal(1);

            expect(npamjobdetailsMain.loadRightPanel.calledWith("Job Comments")).to.equal(true);
        });

        it("If tableSettingStatus is called with some status, it should be assigned to settingsShow", function() {

            npamjobdetailsMain.tableSettingStatus("Table");

            expect(npamjobdetailsMain.settingsShow).to.equal("Table");
        });

        it("If table settings can be displayed, showSettings value should be true", function() {

            npamjobdetailsMain.showTableSettings(true);

            expect(npamjobdetailsMain.showSettings).to.equal(true);
        });

        it("If table settings cannot be displayed, showSettings value should be false", function() {

            npamjobdetailsMain.showTableSettings(false);

            expect(npamjobdetailsMain.showSettings).to.equal(false);
        });

        it("When access is restricted to some users, accessDeniedDialog should be displayed", function() {

            var xhr = {
                getStatus: function() {
                    return 403;
                }
            };

            sandbox.stub(npamjobdetailsMain, "stop");

            npamjobdetailsMain.accessDeniedDialog = new Dialog();
            sandbox.stub(npamjobdetailsMain.accessDeniedDialog, "show");

            npamjobdetailsMain.showAccessDenied({}, xhr);

            expect(npamjobdetailsMain.accessDeniedDialog.show.callCount).to.equal(1);
        });
    });
});