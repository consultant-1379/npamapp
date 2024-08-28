define([
    "jscore/core",
    "shmjobdetails/regions/mejobdetails/mejobdetails",
    "shmjobdetails/Shmjobdetails",
    'layouts/MultiSlidingPanels'
], function(core, MeJobDetails, Shmjobdetails, SlidingPanels) {
    "use strict";

    describe("Test the 'mejobdetails' region of shmjobdetails app", function() {

        var meJobDetailsRegion, eventBus, sandbox, meJobDetails, selectedRow, server, context, options, MainApp;
        beforeEach(function() {

            server = sinon.fakeServer.create();

            sandbox = sinon.sandbox.create();

            meJobDetails = [
            {
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
            },
            {
               "neJobId": 2,
               "neNodeName": "eNodeB 2",
               "neActivity":"Verify",
               "neProgress":100,
               "neStatus":"COMPLETED",
               "neResult":"SUCCESS",
               "neStartDate":"1436261373693",
               "neEndDate":"1436261373693",
               "neComments": "",
               "activityDetailsList":[
                   {
                       "activityName":"Install",
                       "activitySchedule":"Immediate",
                       "activityStartTime":"1436261373693",
                       "activityEndTime":"1436261373693",
                       "activityResult":"SUCCESS" ,
                       "activityConfiguration": {
                           "LicenseKeyFile": "erbs2key.xml"
                       }
                   },
                   {
                       "activityName":"Upgrade",
                       "activitySchedule":"Immediate",
                       "activityStartTime":"1436261373693",
                       "activityEndTime":"1436261373693",
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
            },
            {
               "neJobId":3,
               "neNodeName": "eNodeB 3",
               "neActivity":"Verify",
               "neProgress":100,
               "neStatus":"COMPLETED",
               "neResult":"SUCCESS",
               "neStartDate":"1436450157710",
               "neEndDate":"1436450158122",
               "neComments": "",
               "activityDetailsList":[
                   {
                       "activityName":"Install",
                       "activitySchedule":"Immediate",
                       "activityStartTime":"1436450157796",
                       "activityEndTime":"1436261373693",
                       "activityResult":"SUCCESS",
                       "activityConfiguration": {
                           "LicenseKeyFile": "erbs2key.xml"
                       }
                   },
                   {
                       "activityName":"Upgrade",
                       "activitySchedule":"Immediate",
                       "activityStartTime":"1436450157796",
                       "activityEndTime":"1436261373693",
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
            }
            ];

            eventBus = {
                publish: function() {
                },
                subscribe: function() {
                }
            };

            sandbox.stub(MeJobDetails.prototype, "getEventBus", function() {
                return eventBus;
            });

            context = {
                eventBus: eventBus
            };

            MainApp = new Shmjobdetails();
            MainApp.slidingPanels = new SlidingPanels({
                context: context,
                main: {},
                right: []
            });

            options = {
                context: context,
                mainApp: MainApp
            };

            meJobDetailsRegion = new MeJobDetails(options);

            meJobDetailsRegion.getContext = function() {
                return eventBus;
            };

            meJobDetailsRegion.getEventBus = function() {
                return eventBus;
            };

            meJobDetailsRegion.meJobCollectionSet.addModel(meJobDetails);

            meJobDetailsRegion.createTable();

            meJobDetailsRegion.initialShowSelectbox();
        });

        afterEach(function() {

            server.restore();

            sandbox.restore();
        });

        it("Checks the default condition when app gets loaded", function() {

            expect(meJobDetailsRegion.meJobDetailsTable.getData().length).to.equal(3);
        });

        it("Checks if the selected arrays gets updated correctly, when a row is selected", function() {

            selectedRow = {"3": true};

            meJobDetailsRegion.meJobDetailsTable.checkRows(function(row) {
                return selectedRow[row.getData().neJobId];
            });

            meJobDetailsRegion.maintainSelection();

            expect(meJobDetailsRegion.selectedJobsArray.length).to.equal(1);
            expect(meJobDetailsRegion.selectedJobsArrayOfModels.length).to.equal(1);
        });

        it("Checks the action bar values when a row is selected and the job status is RUNNING", function() {

            selectedRow = {"1": true};

            meJobDetailsRegion.meJobDetailsTable.checkRows(function(row) {
                return selectedRow[row.getData().neJobId];
            });

            meJobDetailsRegion.maintainSelection();

            expect(meJobDetailsRegion.actions[0][0].name).to.equal("Cancel");
            expect(meJobDetailsRegion.actions[1][0].name).to.equal("Job Comments");
            expect(meJobDetailsRegion.actions[1][1].name).to.equal("Node Activities");
            expect(meJobDetailsRegion.actions[1][2].name).to.equal("View Job Logs");
        });

        it("Checks the action bar values when a row is selected and the job status is COMPLETED", function() {

            selectedRow = {"2": true};

            meJobDetailsRegion.meJobDetailsTable.checkRows(function(row) {
                return selectedRow[row.getData().neJobId];
            });

            meJobDetailsRegion.maintainSelection();

            expect(meJobDetailsRegion.actions[0][0].name).to.equal("Job Comments");
            expect(meJobDetailsRegion.actions[0][1].name).to.equal("Node Activities");
            expect(meJobDetailsRegion.actions[0][2].name).to.equal("View Job Logs");
        });

        it("Checks the action bar values when a row is selected and the job status is CANCELLED", function() {

            meJobDetails[1].neStatus = "CANCELLED";

            selectedRow = {"2": true};

            meJobDetailsRegion.meJobDetailsTable.checkRows(function(row) {
                return selectedRow[row.getData().neJobId];
            });

            meJobDetailsRegion.maintainSelection();

            expect(meJobDetailsRegion.actions[0][0].name).to.equal("Job Comments");
            expect(meJobDetailsRegion.actions[0][1].name).to.equal("Node Activities");
            expect(meJobDetailsRegion.actions[0][2].name).to.equal("View Job Logs");
        });

        it("Checks the action bar values when a row is selected and the job status is CREATED", function() {

            meJobDetails[1].neStatus = "CREATED";

            selectedRow = {"2": true};

            meJobDetailsRegion.meJobCollectionSet.addModel(meJobDetails);

            meJobDetailsRegion.createTable();

            meJobDetailsRegion.meJobDetailsTable.checkRows(function(row) {
                return selectedRow[row.getData().neJobId];
            });

            meJobDetailsRegion.maintainSelection();

            expect(meJobDetailsRegion.actions[0][0].name).to.equal("Cancel");
            expect(meJobDetailsRegion.actions[1][0].name).to.equal("Job Comments");
            expect(meJobDetailsRegion.actions[1][1].name).to.equal("Node Activities");
            expect(meJobDetailsRegion.actions[1][2].name).to.equal("View Job Logs");
        });

        it("Checks the action bar values when a row is selected and the job status is WAIT_FOR_USER_INPUT", function() {

            meJobDetails[1].neStatus = "WAIT_FOR_USER_INPUT";

            selectedRow = {"2": true};

            meJobDetailsRegion.meJobCollectionSet.addModel(meJobDetails);

            meJobDetailsRegion.createTable();

            meJobDetailsRegion.meJobDetailsTable.checkRows(function(row) {
                return selectedRow[row.getData().neJobId];
            });

            meJobDetailsRegion.maintainSelection();

            expect(meJobDetailsRegion.actions[0][0].name).to.equal("Continue");
            expect(meJobDetailsRegion.actions[0][1].name).to.equal("Cancel");
            expect(meJobDetailsRegion.actions[1][0].name).to.equal("Job Comments");
            expect(meJobDetailsRegion.actions[1][1].name).to.equal("Node Activities");
            expect(meJobDetailsRegion.actions[1][2].name).to.equal("View Job Logs");
        });

        it("Checks the action bar values when a row is selected and the job status is SCHEDULED", function() {

            meJobDetails[1].neStatus = "SCHEDULED";

            selectedRow = {"2": true};

            meJobDetailsRegion.meJobCollectionSet.addModel(meJobDetails);

            meJobDetailsRegion.createTable();

            meJobDetailsRegion.meJobDetailsTable.checkRows(function(row) {
                return selectedRow[row.getData().neJobId];
            });

            meJobDetailsRegion.maintainSelection();

            expect(meJobDetailsRegion.actions[0][0].name).to.equal("Cancel");
            expect(meJobDetailsRegion.actions[1][0].name).to.equal("Job Comments");
            expect(meJobDetailsRegion.actions[1][1].name).to.equal("Node Activities");
            expect(meJobDetailsRegion.actions[1][2].name).to.equal("View Job Logs");
        });

        it("When a row is selected and 'clear selection' is selected from the action bar, row should be deselected and selected array should be updated", function() {

            selectedRow = {"3": true};

            meJobDetailsRegion.meJobDetailsTable.checkRows(function(row) {
                return selectedRow[row.getData().neJobId];
            });

            meJobDetailsRegion.maintainSelection();

            expect(meJobDetailsRegion.selectedJobsArray.length).to.equal(1);
            expect(meJobDetailsRegion.selectedJobsArrayOfModels.length).to.equal(1);

            meJobDetailsRegion.clearMenu();

            expect(meJobDetailsRegion.selectedJobsArray.length).to.equal(0);
            expect(meJobDetailsRegion.selectedJobsArrayOfModels.length).to.equal(0);

            expect(meJobDetailsRegion.meJobDetailsTable.getSelectedRows().length).to.equal(0);
        });

        it("When a row is selected and 'continue' option is selected from action bar, rest call should be triggered and a popup should be displayed", function() {

            meJobDetails[1].neStatus = "WAIT_FOR_USER_INPUT";

            selectedRow = {"2": true};

            meJobDetailsRegion.meJobCollectionSet.addModel(meJobDetails);

            meJobDetailsRegion.createTable();

            meJobDetailsRegion.meJobDetailsTable.checkRows(function(row) {
                return selectedRow[row.getData().neJobId];
            });

            sandbox.stub(meJobDetailsRegion.continueDialog, "show");

            meJobDetailsRegion.maintainSelection();

            meJobDetailsRegion.actions[0][0].action();

            server.respondWith("GET", "/oss/shm/rest/rbac/nejobs/continue", [200, { "Content-Type": "application/json" },JSON.stringify({})]);
            server.respond();

            expect(meJobDetailsRegion.continueDialog.view.content.getText()).to.equal("Are you sure you want to Continue selected Job(s)");

            expect(meJobDetailsRegion.continueDialog.show.callCount).to.equal(1);
        });

        it("When a row is selected and 'cancel' option is selected from action bar, rest call should be triggered and a popup should be displayed", function() {

            meJobDetails[1].neStatus = "WAIT_FOR_USER_INPUT";

            selectedRow = {"2": true};

            meJobDetailsRegion.meJobCollectionSet.addModel(meJobDetails);

            meJobDetailsRegion.createTable();

            meJobDetailsRegion.meJobDetailsTable.checkRows(function(row) {
                return selectedRow[row.getData().neJobId];
            });

            sandbox.stub(meJobDetailsRegion.cancelDialog, "show");

            meJobDetailsRegion.maintainSelection();

            meJobDetailsRegion.actions[0][1].action();

            server.respondWith("GET", "/oss/shm/rest/rbac/canceljob", [200, { "Content-Type": "application/json" },JSON.stringify({})]);
            server.respond();

            expect(meJobDetailsRegion.cancelDialog.view.content.getText()).to.equal("Are you sure you want to cancel selected Job(s)");

            expect(meJobDetailsRegion.cancelDialog.show.callCount).to.equal(1);
        });

        it("Checks the action bar values when more than one row is selected", function() {

            selectedRow = {"2": true, "3": true};

            meJobDetailsRegion.meJobDetailsTable.checkRows(function(row) {
                return selectedRow[row.getData().neJobId];
            });

            meJobDetailsRegion.maintainSelection();

            expect(meJobDetailsRegion.selectedJobsArray.length).to.equal(2);

            expect(meJobDetailsRegion.actions[0][0].name).to.equal("Job Comments");
            expect(meJobDetailsRegion.actions[0][1].name).to.equal("Node Activities");
            expect(meJobDetailsRegion.actions[0][2].name).to.equal("View Job Logs");
        });

        it("When a job is selected, and 'View job Logs' is selected from the action bar, hash value should be changed", function() {

            selectedRow = {"2": true};

            meJobDetailsRegion.meJobDetailsTable.checkRows(function(row) {
                return selectedRow[row.getData().neJobId];
            });

            meJobDetailsRegion.maintainSelection();

            meJobDetailsRegion.actions[0][2].action();

            expect(window.location.hash).to.equal("#shmjoblogs?neJobIdList=2&jobPoId=undefined");
        });

        it("When more than one row is selected and 'clear selection' is selected from action bar, all rows should be deselected and selected array should be updated", function() {

            selectedRow = {"2": true, "3": true};

            meJobDetailsRegion.meJobDetailsTable.checkRows(function(row) {
                return selectedRow[row.getData().neJobId];
            });

            meJobDetailsRegion.maintainSelection();

            expect(meJobDetailsRegion.selectedJobsArray.length).to.equal(2);

            meJobDetailsRegion.clearMenu();

            expect(meJobDetailsRegion.selectedJobsArray.length).to.equal(0);

            expect(meJobDetailsRegion.meJobDetailsTable.getSelectedRows().length).to.equal(0);
        });

        it("When more than one row is selected and 'clear selection' is selected from action bar,action bar values should be set to default values", function() {

            selectedRow = {"2": true, "3": true};

            meJobDetailsRegion.meJobDetailsTable.checkRows(function(row) {
                return selectedRow[row.getData().neJobId];
            });

            meJobDetailsRegion.maintainSelection();

            expect(meJobDetailsRegion.selectedJobsArray.length).to.equal(2);

            meJobDetailsRegion.clearMenu();

            expect(meJobDetailsRegion.actions.length).to.equal(0);
        });

        /*it("Checks whether only rows matching the filtered text are displayed", function() {

            meJobDetailsRegion.filters = {"neJobId": {"comparator": "=", "value": "3"}};

            meJobDetailsRegion.setTableData();

            expect(meJobDetailsRegion.meJobDetailsTable.getData().length).to.equal(1);
        });

        it("All rows should be displayed if filters are removed", function() {

            meJobDetailsRegion.filters = {"neJobId": {"comparator": "=", "value": "3"}};

            meJobDetailsRegion.setTableData();

            expect(meJobDetailsRegion.meJobDetailsTable.getData().length).to.equal(1);

            meJobDetailsRegion.filters = {"neJobId": {"comparator": "=", "value": ""}};

            meJobDetailsRegion.setTableData();

            expect(meJobDetailsRegion.meJobDetailsTable.getData().length).to.equal(3);
        });

        it("Should display empty table when no rows are matched with the filter text", function() {

            meJobDetailsRegion.filters = {"neJobId": {"comparator": "=", "value": "6"}};

            meJobDetailsRegion.setTableData();

            expect(meJobDetailsRegion.meJobDetailsTable.getData().length).to.equal(0);
        });

        it("Should display the selected rows (if any) even after removing filters", function() {

            selectedRow = {"2": true};

            meJobDetailsRegion.meJobDetailsTable.checkRows(function(row) {
                return selectedRow[row.getData().neJobId];
            });

            meJobDetailsRegion.maintainSelection();

            expect(meJobDetailsRegion.selectedJobsArray.length).to.equal(1);

            meJobDetailsRegion.filters = {"neJobId": {"comparator": "=", "value": "1"}};

            meJobDetailsRegion.setTableData();

            expect(meJobDetailsRegion.meJobDetailsTable.getData().length).to.equal(1);
            expect(meJobDetailsRegion.meJobDetailsTable.getSelectedRows().length).to.equal(0);

            meJobDetailsRegion.filters = {"neJobId": {"comparator": "=", "value": ""}};

            meJobDetailsRegion.setTableData();

            expect(meJobDetailsRegion.meJobDetailsTable.getData().length).to.equal(3);
            expect(meJobDetailsRegion.meJobDetailsTable.getSelectedRows().length).to.equal(1);
        });

        it("Should display only the rows matching the applied filters when more than one filter is applied", function() {

            meJobDetailsRegion.filters = {"neJobId": {"comparator": "=", "value": "2"}, "neActivity": {"comparator": "=", "value": "V"}};

            meJobDetailsRegion.setTableData();

            var filterData = meJobDetailsRegion.meJobDetailsTable.getData();

            expect(filterData.length).to.equal(1);

            expect(filterData[0].neJobId).to.equal(meJobDetails[1].neJobId);
        });

        it("Should display appropriate rows matching when the filter text is modified", function() {

            meJobDetailsRegion.filters = {"neActivity": {"comparator": "=", "value": "i"}};

            meJobDetailsRegion.setTableData();

            expect(meJobDetailsRegion.meJobDetailsTable.getData().length).to.equal(3);

            meJobDetailsRegion.filters = {"neActivity": {"comparator": "=", "value": "ins"}};

            meJobDetailsRegion.setTableData();

            expect(meJobDetailsRegion.meJobDetailsTable.getData().length).to.equal(1);
        });

        it("Should preserve row selection when rows are selected before and after applying filters", function() {

            selectedRow = {"1": true};

            meJobDetailsRegion.meJobDetailsTable.checkRows(function(row) {
                return selectedRow[row.getData().neJobId];
            });

            meJobDetailsRegion.maintainSelection();

            expect(meJobDetailsRegion.selectedJobsArray.length).to.equal(1);

            meJobDetailsRegion.filters = {"neActivity": {"comparator": "=", "value": "ver"}};

            meJobDetailsRegion.setTableData();

            expect(meJobDetailsRegion.meJobDetailsTable.getData().length).to.equal(2);

            selectedRow = {"2": true};

            meJobDetailsRegion.meJobDetailsTable.checkRows(function(row) {
                return selectedRow[row.getData().neJobId];
            });

            meJobDetailsRegion.maintainSelection();

            expect(meJobDetailsRegion.meJobDetailsTable.getSelectedRows().length).to.equal(1);

            meJobDetailsRegion.filters = {"neActivity": {"comparator": "=", "value": ""}};

            meJobDetailsRegion.setTableData();

            expect(meJobDetailsRegion.meJobDetailsTable.getData().length).to.equal(3);

            expect(meJobDetailsRegion.meJobDetailsTable.getSelectedRows().length).to.equal(2);

            expect(meJobDetailsRegion.selectedJobsArray.length).to.equal(2);
        });

        it("Checks whether appropriate rows are displayed when comparator is '>'", function() {

            meJobDetailsRegion.filters = {"neJobId": {"comparator": ">", "value": "2"}};

            meJobDetailsRegion.setTableData();

            expect(meJobDetailsRegion.meJobDetailsTable.getData().length).to.equal(1);
        });

        it("All rows should be displayed if filters are removed when comparator is '>'", function() {

            meJobDetailsRegion.filters = {"neJobId": {"comparator": ">", "value": "2"}};

            meJobDetailsRegion.setTableData();

            expect(meJobDetailsRegion.meJobDetailsTable.getData().length).to.equal(1);

            meJobDetailsRegion.filters = {"neJobId": {"comparator": ">", "value": ""}};

            meJobDetailsRegion.setTableData();

            expect(meJobDetailsRegion.meJobDetailsTable.getData().length).to.equal(3);
        });

        it("Should display empty table when no rows are matched with the filter text when comparator is '>'", function() {

            meJobDetailsRegion.filters = {"neJobId": {"comparator": ">", "value": "3"}};

            meJobDetailsRegion.setTableData();

            expect(meJobDetailsRegion.meJobDetailsTable.getData().length).to.equal(0);
        });

        it("Should display the selected rows (if any) even after removing filters when comparator is '>'", function() {

            selectedRow = {"1": true};

            meJobDetailsRegion.meJobDetailsTable.checkRows(function(row) {
                return selectedRow[row.getData().neJobId];
            });

            meJobDetailsRegion.maintainSelection();

            expect(meJobDetailsRegion.selectedJobsArray.length).to.equal(1);

            meJobDetailsRegion.filters = {"neJobId": {"comparator": ">", "value": "0"}};

            meJobDetailsRegion.setTableData();

            expect(meJobDetailsRegion.meJobDetailsTable.getData().length).to.equal(3);

            expect(meJobDetailsRegion.meJobDetailsTable.getSelectedRows().length).to.equal(1);

            meJobDetailsRegion.filters = {"neJobId": {"comparator": ">", "value": ""}};

            meJobDetailsRegion.setTableData();

            expect(meJobDetailsRegion.meJobDetailsTable.getData().length).to.equal(3);
            expect(meJobDetailsRegion.selectedJobsArray.length).to.equal(1);
            expect(meJobDetailsRegion.meJobDetailsTable.getSelectedRows().length).to.equal(1);
        });

        it("Should display only the rows matching the applied filters when more than one filter is applied when comparator is '>'", function() {

            meJobDetailsRegion.filters = {"neJobId": {"comparator": ">", "value": "1"}, "neActivity": {"comparator": ">", "value": "i"}};

            meJobDetailsRegion.setTableData();

            expect(meJobDetailsRegion.meJobDetailsTable.getData().length).to.equal(2);
        });

        it("Checks whether appropriate rows are displayed when comparator is '<'", function() {

            meJobDetailsRegion.filters = {"neJobId": {"comparator": "<", "value": "4"}};

            meJobDetailsRegion.setTableData();

            expect(meJobDetailsRegion.meJobDetailsTable.getData().length).to.equal(3);
        });

        it("All rows should be displayed if filters are removed when comparator is '<'", function() {

            meJobDetailsRegion.filters = {"neJobId": {"comparator": "<", "value": "3"}};

            meJobDetailsRegion.setTableData();

            expect(meJobDetailsRegion.meJobDetailsTable.getData().length).to.equal(2);

            meJobDetailsRegion.filters = {"neJobId": {"comparator": "<", "value": ""}};

            meJobDetailsRegion.setTableData();

            expect(meJobDetailsRegion.meJobDetailsTable.getData().length).to.equal(3);
        });

        it("Should display empty table when no rows are matched with the filter text when comparator is '<'", function() {

            meJobDetailsRegion.filters = {"neJobId": {"comparator": "<", "value": "0"}};

            meJobDetailsRegion.setTableData();

            expect(meJobDetailsRegion.meJobDetailsTable.getData().length).to.equal(0);
        });

        it("Should display the selected rows (if any) even after removing filters when comparator is '<'", function() {

            selectedRow = {"1": true};

            meJobDetailsRegion.meJobDetailsTable.checkRows(function(row) {
                return selectedRow[row.getData().neJobId];
            });

            meJobDetailsRegion.maintainSelection();

            expect(meJobDetailsRegion.selectedJobsArray.length).to.equal(1);

            meJobDetailsRegion.filters = {"neJobId": {"comparator": "<", "value": "3"}};

            meJobDetailsRegion.setTableData();

            expect(meJobDetailsRegion.meJobDetailsTable.getData().length).to.equal(2);

            expect(meJobDetailsRegion.meJobDetailsTable.getSelectedRows().length).to.equal(1);

            meJobDetailsRegion.filters = {"neJobId": {"comparator": "<", "value": ""}};

            meJobDetailsRegion.setTableData();

            expect(meJobDetailsRegion.meJobDetailsTable.getData().length).to.equal(3);
            expect(meJobDetailsRegion.selectedJobsArray.length).to.equal(1);
            expect(meJobDetailsRegion.meJobDetailsTable.getSelectedRows().length).to.equal(1);
        });

        it("Should display only the rows matching the applied filters when more than one filter is applied when comparator is '<'", function() {

            meJobDetailsRegion.filters = {"neJobId": {"comparator": "<", "value": "3"}, "neActivity": {"comparator": "<", "value": "n"}};

            meJobDetailsRegion.setTableData();

            expect(meJobDetailsRegion.meJobDetailsTable.getData().length).to.equal(1);
        });*/

        it("Checks the selected rows has been re-selected when table settings applied", function () {
            selectedRow = {1: true};

            var columns = [{
                title: "nodeName",
                attribute: "neNodeName",
                sortable: true,
                resizable: true
            }];

            sandbox.stub(meJobDetailsRegion, "persistSelection", function () {
            });
            meJobDetailsRegion.selectedJobsArray = [{nodeName: "name"}];
            meJobDetailsRegion.updateColumns(columns);

            expect(meJobDetailsRegion.persistSelection.callCount).to.equal(1);
        });
    });
});