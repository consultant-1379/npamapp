/**
 * Created with IntelliJ IDEA.
 * User: tcsvina
 * Date: 4/14/16
 * Time: 6:52 PM
 * To change this template use File | Settings | File Templates.
 */
define([
    "jscore/core",
    "shmjobdetails/widgets/activity/activity",
    "shmlibrary/constants"
], function(core, NodeActivity, Constants) {
    "use strict";

    describe("Test the 'Activity' widget of shmjobdetails", function() {

        var nodeActivityWidget, activity;
        beforeEach(function() {

            nodeActivityWidget = new NodeActivity();

            activity =
            {
                "activityName":"Install",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"SUCCESS",
                "activityConfiguration": {
                    "LTE01ERBS0001": {
                        "LicenseKey": "erbs2key.xml"
                    }
                }
            };
        });

        afterEach(function() {

        });

        it("Checks if ActivityName is set according to the job while displaying nodeActivities", function() {

            nodeActivityWidget.setActivity(activity, "", "");

            expect(nodeActivityWidget.view.getElement().find(".eaShmjobdetails-wActivity-ActivityName").getText()).to.equal("Install");
        });

        it("If job name is RESTORE and activity is CONFIRM, then activityname should be set as ", function() {

            activity.activityName = Constants.CONFIRM.toLowerCase();

            nodeActivityWidget.setConfirmRestore(activity.activityName, "", "RESTORE");

            expect(nodeActivityWidget.view.getElement().find(".eaShmjobdetails-wActivity-ActivityName").getText()).to.equal("confirm restore");
        });

        it("Configuration filenames should be set for each file in activityConfigurations", function() {

            nodeActivityWidget.setActivity(activity, "UpdateJob", "");

            expect(nodeActivityWidget.view.getElement().find(".eaShmjobdetails-wActivity-ActivityConfiguration").getText()).to.equal("LicenseKey: erbs2key.xml");
        });
    });
});
