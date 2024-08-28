define([
    "jscore/core",
    "shmjobdetails/regions/nodeactivities/nodeactivities",
    "i18n!shmlibrary/app.json"
], function(core, NodeActivities, libLanguage) {
    "use strict";

    describe("Test the 'NodeActivities' region of shmjobdetails app", function() {

        var nodeActivitiesRegion, options, selectedJob;
        beforeEach(function() {

            options = {
                context: {
                    eventBus: {
                        publish: function() {},
                        subscribe: function() {},
                        unsubscribe: function() {}
                    }
                }
            };

            selectedJob = [
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
                     }];

            nodeActivitiesRegion = new NodeActivities(options);
        });

        afterEach(function() {

        });

        it("When displayNodeActivities is selected, nodeName should be set", function() {

            nodeActivitiesRegion.setNodeName("eNodeB 1");

            expect(nodeActivitiesRegion.view.getElement().find(".eaShmjobdetails-rNodeActivities-NodeName").getText()).to.equal("eNodeB 1")
        });
    });
});