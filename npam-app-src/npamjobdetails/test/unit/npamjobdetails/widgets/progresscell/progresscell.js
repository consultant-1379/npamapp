define([
    "jscore/core",
    "shmjobdetails/widgets/progresscell/progresscell"
], function(core, ProgressCell) {
    "use strict";

    describe("Test the 'ProgressCell' widget of shmjobdetails", function() {

        var progressCellWidget, options, activity;
        beforeEach(function() {

            activity = {
              "neJobId": 1,
              "neNodeName": "eNodeB 1",
              "neActivity":"Install",
              "neProgress":0,
              "neStatus":"RUNNING",
              "neResult":"",
              "neStartDate":"1436450157710",
              "neEndDate":"1436450158122",
              "neComments": "",
              "neJobConfiguration":{"CV Name":"cvname_ERBS00001"},
              "activityDetailsList":[
                  {
                      "activityName":"Install",
                      "activitySchedule":"Immediate",
                      "activityStartTime":"1436450157796",
                      "activityEndTime":"1436450158002",
                      "activityResult":"SUCCESS",
                      "activityConfiguration": {
                          "LicenseKeyFile": "erbs2key.xml"
                      }
                  },
                  {
                      "activityName":"Upgrade",
                      "activitySchedule":"Immediate",
                      "activityStartTime":"1436450157796",
                      "activityEndTime":"1436450158002",
                      "activityResult":"FAILED",
                      "activityConfiguration": {
                          "LicenseKeyFile": "erbs2key.xml"
                      }
                  },
                  {
                      "activityName":"SWAdjust",
                      "activitySchedule":"Manual",
                      "activityStartTime":"",
                      "activityEndTime":"",
                      "activityResult":"",
                      "activityConfiguration": {
                          "LicenseKeyFile": "erbs2key.xml"
                      }
                  }]
            };

            options = {
                column: {
                    attribute: "neProgress"
                },
                row: {
                    options: {
                        model: activity
                    }
                }
            };

            progressCellWidget = new ProgressCell(options);
        });

        afterEach(function() {

        });

        it("If the job status is CREATED, progressbar should not be displayed", function() {

            progressCellWidget.setProgressColor("CREATED", "SUCCESS");

            expect(progressCellWidget.view.getProgress().getStyle("display")).to.equal("none");
        });

        it("If the job status is SCHEDULED, progressbar should not be displayed", function() {

            progressCellWidget.setProgressColor("SCHEDULED", "");

            expect(progressCellWidget.view.getProgress().getStyle("display")).to.equal("none");
        });

        it("If the job status is COMPLETED and result is SKIPPED, progressbar should not be displayed", function() {

            progressCellWidget.setProgressColor("COMPLETED", "SKIPPED");

            expect(progressCellWidget.view.getProgress().getStyle("display")).to.equal("none");
        });

        it("If the job status and result does not match with the job conditions, progressbar should not be displayed", function() {

            progressCellWidget.setProgressColor("", "");

            expect(progressCellWidget.view.getProgress().getStyle("display")).to.equal("none");
        });
    });
});