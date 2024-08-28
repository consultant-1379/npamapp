/**
 * Created with IntelliJ IDEA.
 * User: tcsvina
 * Date: 4/14/16
 * Time: 6:53 PM
 * To change this template use File | Settings | File Templates.
 */
define([
    "jscore/core",
    "shmjobdetails/widgets/activityDetails/activityDetails",
    "shmlibrary/constants"
], function(core, ActivityDetails, Constants) {
    "use strict";

    describe("Test the 'ActivityDetails' widget of shmJobDetails", function() {

        var activityDetailsWidget, activity;
        beforeEach(function() {

            activityDetailsWidget = new ActivityDetails();

            activity =
            {
                "activityName":"Install",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"SUCCESS",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            };
        });

        afterEach(function() {

        });

        it("If job name is UPGRADE and jobType is Update, then result should not be displayed", function() {

            activity.activityName = "upgrade";

            activityDetailsWidget.setActivityDetails("activityName", activity, "Update", "");

            expect(activityDetailsWidget.view.getElement().find(".eaShmjobdetails-wActivityDetails-Result").getStyle("display")).to.equal("none");
        });

        it("If job name is UPGRADE and jobType is Update, then upgradeType should be set as Update", function() {

            activity.activityName = Constants.UPGRADE.toLowerCase();

            activityDetailsWidget.setUpgradeType(activity.activityName, "Update");

            expect(activityDetailsWidget.view.getElement().find(".eaShmjobdetails-wActivityDetails-ActivityKey").getText()).to.equal("Type:");
            expect(activityDetailsWidget.view.getElement().find(".eaShmjobdetails-wActivityDetails-ActivityValue").getText()).to.equal("Update");
        });

        it("If job name is UPGRADE and jobType is not Update, then upgradeType and result should be hidden", function() {

            activity.activityName = Constants.UPGRADE.toLowerCase();

            activityDetailsWidget.setActivityDetails("activityName", activity, "UpdateJob", "");

            expect(activityDetailsWidget.view.getElement().find(".eaShmjobdetails-wActivityDetails-Activity").getStyle("display")).to.equal("none");
            expect(activityDetailsWidget.view.getElement().find(".eaShmjobdetails-wActivityDetails-Result").getStyle("display")).to.equal("none");
        });

        it("If start time is not given for the job, startTime should be hidden", function() {

            activity.activityStartTime = "";

            activityDetailsWidget.setActivityDetails("activityStartTime", activity, "", "");

            expect(activityDetailsWidget.view.getElement().find(".eaShmjobdetails-wActivityDetails-Activity").getStyle("display")).to.equal("none");
        });

        it("If end time is not given for the job, endTime should be hidden", function() {

            activity.activityEndTime = "";

            activityDetailsWidget.setActivityDetails("activityEndTime", activity, "", "");

            expect(activityDetailsWidget.view.getElement().find(".eaShmjobdetails-wActivityDetails-Activity").getStyle("display")).to.equal("none");
        });

        it("If activity result is Success, resultMessage should be SUCCESS, result icon should be tick", function() {

            activityDetailsWidget.setActivityDetails("activityResult", activity, "", "");

            expect(activityDetailsWidget.view.getElement().find(".eaShmjobdetails-wActivityDetails-ResultMessage").getText()).to.equal("Success");
            expect(activityDetailsWidget.view.getElement().find(".eaShmjobdetails-wActivityDetails-ResultIcon").hasModifier("tick")).to.equal(true);
        });

        it("If activity result is FAILED, resultMessage should be FAILED, result icon should be error", function() {

            activity.activityResult = "FAILED";

            activityDetailsWidget.setActivityDetails("activityResult", activity, "", "");

            expect(activityDetailsWidget.view.getElement().find(".eaShmjobdetails-wActivityDetails-ResultMessage").getText()).to.equal("Failed");
            expect(activityDetailsWidget.view.getElement().find(".eaShmjobdetails-wActivityDetails-ResultIcon").hasModifier("error")).to.equal(true);
        });

        it("If activity result is SKIPPED, resultMessage should be SKIPPED, result icon should be warning", function() {

            activity.activityResult = "SKIPPED";

            activityDetailsWidget.setActivityDetails("activityResult", activity, "", "");

            expect(activityDetailsWidget.view.getElement().find(".eaShmjobdetails-wActivityDetails-ResultMessage").getText()).to.equal("Skipped");
            expect(activityDetailsWidget.view.getElement().find(".eaShmjobdetails-wActivityDetails-ResultIcon").hasModifier("warning")).to.equal(true);
        });

        it("If activity result is Cancelled, resultMessage should be Cancelled, result icon should be error", function() {

            activity.activityResult = "CANCELLED";

            activityDetailsWidget.setActivityDetails("activityResult", activity, "", "");

            expect(activityDetailsWidget.view.getElement().find(".eaShmjobdetails-wActivityDetails-ResultMessage").getText()).to.equal("Cancelled");
            expect(activityDetailsWidget.view.getElement().find(".eaShmjobdetails-wActivityDetails-ResultIcon").hasModifier("error")).to.equal(true);
        });

        it("If no activityResult is present, resultMessage and activity should be hidden", function() {

            activity.activityResult = "";

            activityDetailsWidget.setActivityDetails("activityResult", activity, "", "");

            expect(activityDetailsWidget.view.getElement().find(".eaShmjobdetails-wActivityDetails-Activity").getStyle("display")).to.equal("none");
            expect(activityDetailsWidget.view.getElement().find(".eaShmjobdetails-wActivityDetails-Result").getStyle("display")).to.equal("none");
        });

        it("Activity schedule should be set to the corresponding schedule of the job", function() {

            activityDetailsWidget.setActivityDetails("activitySchedule", activity, "UpdateJob", "");

            expect(activityDetailsWidget.view.getElement().find(".eaShmjobdetails-wActivityDetails-ActivityValue").getText()).to.equal("Immediate");
            expect(activityDetailsWidget.view.getElement().find(".eaShmjobdetails-wActivityDetails-ActivityKey").getText()).to.equal("Schedule Type:");
        });
    });
});