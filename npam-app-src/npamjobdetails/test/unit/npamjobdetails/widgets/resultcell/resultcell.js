define([
    "jscore/core",
    "shmjobdetails/widgets/resultcell/resultcell"
], function(core, ResultCell) {
    "use strict";

    describe("Test the 'ResultCell' widget of shmjobdetails", function() {

        var resultCellWidget, options, activity;
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
                    attribute: "neResult"
                },
                row: {
                    options: {
                        model: activity
                    }
                }
            };

            resultCellWidget = new ResultCell(options);
        });

        afterEach(function() {

        });

        it("When result is SUCCESS, resultCell should be set as success", function() {

            resultCellWidget.setResultIcon("SUCCESS");

            expect(resultCellWidget.view.getElement().find('.eaShmjobdetails-wResultCell-error').hasModifier("hidden")).to.equal(true);
            expect(resultCellWidget.view.getElement().find('.eaShmjobdetails-wResultCell-warning').hasModifier("hidden")).to.equal(true);
            expect(resultCellWidget.view.getElement().find('.eaShmjobdetails-wResultCell-tickText').getText()).to.equal("Success");
        });

        it("When result is FAILED, resultCell should be set as Failed", function() {

            resultCellWidget.setResultIcon("FAILED");

            expect(resultCellWidget.view.getElement().find('.eaShmjobdetails-wResultCell-tick').hasModifier("hidden")).to.equal(true);
            expect(resultCellWidget.view.getElement().find('.eaShmjobdetails-wResultCell-warning').hasModifier("hidden")).to.equal(true);
            expect(resultCellWidget.view.getElement().find('.eaShmjobdetails-wResultCell-errorText').getText()).to.equal("Failed");
        });

        it("When result is SKIPPED, resultCell should be set as Skipped", function() {

            resultCellWidget.setResultIcon("SKIPPED");

            expect(resultCellWidget.view.getElement().find('.eaShmjobdetails-wResultCell-tick').hasModifier("hidden")).to.equal(true);
            expect(resultCellWidget.view.getElement().find('.eaShmjobdetails-wResultCell-error').hasModifier("hidden")).to.equal(true);
            expect(resultCellWidget.view.getElement().find('.eaShmjobdetails-wResultCell-warningText').getText()).to.equal("Skipped");
        });

        it("When result is not defined as job results, resultCell should be not be set to any status", function() {

            resultCellWidget.setResultIcon("");

            expect(resultCellWidget.view.getElement().find('.eaShmjobdetails-wResultCell-tick').hasModifier("hidden")).to.equal(true);
            expect(resultCellWidget.view.getElement().find('.eaShmjobdetails-wResultCell-error').hasModifier("hidden")).to.equal(true);
            expect(resultCellWidget.view.getElement().find('.eaShmjobdetails-wResultCell-warning').hasModifier("hidden")).to.equal(true);
        });
    });
});