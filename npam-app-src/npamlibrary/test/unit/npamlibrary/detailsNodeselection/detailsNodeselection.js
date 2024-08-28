define([
    'jscore/core',
    'npamlibrary/detailsNodeselection/detailsNodeselection',
    "jscore/ext/mvp",
    "widgets/Table",
    "applib/LaunchContext"
], function (core, detailsNodeSelection, mvp, LaunchContext) {
    'use strict';

    describe("Tests the first step in all job creation wizards files(detailsNodeselection)", function () {

        var detailsAndNodeSelectionStep, nodes = [],selectedRow, nodeDetails = {}, sandbox, getPosByPoIds, map = [];

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            var mainApp = {};
            mainApp.model = new mvp.Model();
            mainApp.getContext = function () {
                return {eventBus: {
                    publish: function() {},
                    subscribe: function() {},
                    unsubscribe: function() {}
                }};
            };
            mainApp.appName = "shmcreateupgradejob";
            mainApp.showLoadingAnimation = function () {};
            mainApp.getEventBus = function () {
                return sinon.createStubInstance(core.EventBus);
            };
            detailsAndNodeSelectionStep = new detailsNodeSelection(mainApp);

            getPosByPoIds = [{"moName":"LTE17_ERBS00001","moType":"NetworkElement","poId":"281474977748949","mibRootName":"LTE17_ERBS00001","parentRDN":"","attributes":{"platformType":"CPP","neType":"ERBS"}},
                {"moName":"LTE17_ERBS00002","moType":"NetworkElement","poId":"281474977639702","mibRootName":"LTE17_ERBS00002","parentRDN":"","attributes":{"platformType":"CPP","neType":"ERBS"}},
                {"moName":"LTE17_ERBS00003","moType":"NetworkElement","poId":"281474977639734","mibRootName":"LTE17_ERBS00003","parentRDN":"","attributes":{"platformType":"CPP","neType":"MGW"}},
                {"moName":"LTE17_ERBS00004","moType":"NetworkElement","poId":"281474977639734","mibRootName":"LTE17_ERBS00004","parentRDN":"","attributes":{"platformType":"CPP","neType":"SGSN-MME"}},
                {"moName":"LTE17_ERBS00005","moType":"NetworkElement","poId":"281474977640035","mibRootName":"LTE17_ERBS00005","parentRDN":"","attributes":{"platformType":"CPP","neType":"RadioNode"}},
                {"moName":"LTE53vRC00003","moType":"NetworkElement","poId":"281474977896286","mibRootName":"LTE53vRC00003","parentRDN":"","attributes":{"platformType":"ECIM","neType":"vRC"}}];

            map["281474977748949"] = {name: "Other Objects",  attr: {} };
            map["281474977639702"] = {name: "Collection",  attr: {} };

            var node = {
                site: "Site1",
                networkElementFdn: "MeContext=LTE17_ERBS00001",
                fdnName: null,
                poid: "1234567894",
                nodeName: "LTE17_ERBS00001",
                neType: "eRNS",
                mirrorSynchronizationStatus: "SYNCING",
                release: "14A"
            };
            nodes.push(node);

            node = {
                site: "Site1",
                networkElementFdn: "MeContext=LTE17_ERBS00002",
                fdnName: null,
                poid: "1234567894",
                nodeName: "LTE17_ERBS00002",
                neType: "eRBS",
                mirrorSynchronizationStatus: "NOT_SYNCING",
                release: "14A"
            };
            nodes.push(node);

            node = {
                site: "Site1",
                networkElementFdn: "MeContext=LTE17_ERBS00003",
                fdnName: null,
                poid: "1234567894",
                nodeName: "LTE17_ERBS00003",
                neType: "eRNS",
                mirrorSynchronizationStatus: "SYNCING",
                release: "14A"
            };
            nodes.push(node);

            node = {
                site: "Site1",
                networkElementFdn: "MeContext=LTE17_ERBS00004",
                fdnName: null,
                poid: "1234567894",
                nodeName: "LTE17_ERBS00004",
                neType: "eRBS",
                mirrorSynchronizationStatus: "SYNCING",
                release: "14A"
            };
            nodes.push(node);

            node = {
                site: "Site1",
                networkElementFdn: "NetworkElement=LTE53vRC00003",
                fdnName: null,
                poid: "12345678949",
                nodeName: "LTE53vRC00003",
                neType: "vRC",
                mirrorSynchronizationStatus: "SYNCING",
                release: "14A"
            }
            nodes.push(node);

            nodeDetails = {
                "MeContext=LTE17_ERBS00001":{"site":"Site1","networkElementFdn":"MeContext=LTE17_ERBS00001","neType":"eRNS","poid":"1234567893","fdnName":null,"mirrorSynchronizationStatus":"SYNCING","release":"14A","nodeName":"LTE17_ERBS00001"},
                "MeContext=LTE17_ERBS00002":{"site":"Site1","networkElementFdn":"MeContext=LTE17_ERBS00002","neType":"eRBS","poid":"1234567893","fdnName":null,"mirrorSynchronizationStatus":"NOT_SYNCING","release":"14A","nodeName":"LTE17_ERBS00002"},
                "MeContext=LTE17_ERBS00003":{"site":"Site1","networkElementFdn":"MeContext=LTE17_ERBS00003","neType":"eRNS","poid":"1234567893","fdnName":null,"mirrorSynchronizationStatus":"SYNCING","release":"14A","nodeName":"LTE17_ERBS00003"},
                "MeContext=LTE17_ERBS00004":{"site":"Site1","networkElementFdn":"MeContext=LTE17_ERBS00004","neType":"eRBS","poid":"1234567893","fdnName":null,"mirrorSynchronizationStatus":"SYNCING","release":"14A","nodeName":"LTE17_ERBS00004"},
                "MeContext=LTE53vRC00003":{"site":"Site1","networkElementFdn":"MeContext=LTE53vRC00003","neType":"vRC","poid":"12345678931","fdnName":null,"mirrorSynchronizationStatus":"SYNCING","release":"14A","nodeName":"LTE53vRC00003"},

            };
        });

        afterEach(function () {
            nodes = [];
            nodeDetails = {};
            sandbox.restore();
        });

        // default view testcase
        it("Checks if next button and remove selected button are disabled when job name is not entered and nodes are not present", function() {

            expect(false).to.equal(detailsAndNodeSelectionStep.isValid());
        });

        //jobname, table content with next button
        it("Checks if Next button is disabled if only job name is entered even thought the job name is not taken.", function () {

            detailsAndNodeSelectionStep.view.getJobNameHolder().setValue("job name");

            var xhr = {

                getStatus: function () {
                    return 404;
                },
                getResponseText: function() {
                    return '{"id":"jobTemplate","message":"job with name does not exist"}';
                }
            };
            detailsAndNodeSelectionStep.proceedToNextStep({}, xhr);

            expect("job name").to.equal(detailsAndNodeSelectionStep.view.getJobName());
            expect(false).to.equal(detailsAndNodeSelectionStep.isValid());
        });

        it("Checks accordion deleted in first step then isFirstStepModified is setting to true or not.", function () {
            detailsAndNodeSelectionStep.finalCollection = [];
            sandbox.stub(detailsAndNodeSelectionStep, 'checkToLoadData');
            sandbox.stub(detailsAndNodeSelectionStep, 'whenNodesModified');
            detailsAndNodeSelectionStep.map["281474977748949"] = map["281474977748949"];
            detailsAndNodeSelectionStep.map["281474977639702"] = map["281474977639702"];
            detailsAndNodeSelectionStep.prepareCollection(false, "281474977748949", getPosByPoIds);
            detailsAndNodeSelectionStep.prepareCollection(true, "281474977639702", getPosByPoIds);
            detailsAndNodeSelectionStep.createAccordion("Test1", false, "281474977748949");
            detailsAndNodeSelectionStep.createAccordion("Test2", true, "281474977639702");
            expect(detailsAndNodeSelectionStep.whenNodesModified.callCount).to.equal(2);
            detailsAndNodeSelectionStep.accordions["Test2"].getDeleteIcon().trigger("click");
            expect(detailsAndNodeSelectionStep.whenNodesModified.callCount).to.equal(3);
            expect(detailsAndNodeSelectionStep.model.getAttribute("isFirstStepModified")).to.equal(true);
        });

        /*it("Checks if Next button is disabled if only nodes are present and the job name is not entered.", function() {

            detailsAndNodeSelectionStep.mesDetailsCollection.addModel(nodes);

            expect(false).to.equal(detailsAndNodeSelectionStep.isValid());
        });

        it("Checks if Next button is enabled when nodes are present and the job name is entered and the job name is not taken.", function() {

            detailsAndNodeSelectionStep.view.getJobNameHolder().setValue("job name");

            var xhr = {

                getStatus: function () {
                    return 404;
                },
                getResponseText: function() {
                    return '{"id":"jobTemplate","message":"job with name does not exist"}';
                }
            };
            detailsAndNodeSelectionStep.proceedToNextStep({}, xhr);

            detailsAndNodeSelectionStep.validateJobName();

            detailsAndNodeSelectionStep.mesDetailsCollection.addModel(nodes);

            expect(false).to.equal(detailsAndNodeSelectionStep.isValid());
        });

        it("Checks if Next button is disabled when nodes are present and the job name is entered and the job name is already taken.", function() {

            detailsAndNodeSelectionStep.view.getJobNameHolder().setValue("job name");

            var xhr = {

                getStatus: function () {
                    return 200;
                },
                getResponseText: function() {
                    return '{"id":"jobTemplate","message":"job with name is already taken"}';
                }
            };
            detailsAndNodeSelectionStep.proceedToNextStep({}, xhr);

            detailsAndNodeSelectionStep.mesDetailsCollection.addModel(nodes);

            expect(false).to.equal(detailsAndNodeSelectionStep.isValid());
        });

        it("Checks if Next button is disabled when nodes are present and a not existing job name is entered and the job name is again removed.", function() {

            detailsAndNodeSelectionStep.view.getJobNameHolder().setValue("job name");

            var xhr = {

                getStatus: function () {
                    return 404;
                },
                getResponseText: function() {
                    return '{"id":"jobTemplate","message":"job with name does not exist"}';
                }
            };
            detailsAndNodeSelectionStep.proceedToNextStep({}, xhr);

            detailsAndNodeSelectionStep.mesDetailsCollection.addModel(nodes);

            expect(false).to.equal(detailsAndNodeSelectionStep.isValid());

            detailsAndNodeSelectionStep.view.getJobNameHolder().setValue("");

            detailsAndNodeSelectionStep.validateJobName();

            expect(false).to.equal(detailsAndNodeSelectionStep.isValid());
        });*/

        it("Checks if Next button is disabled when nodes are present and the job name is populated and the job name is not taken and the nodes are removed.", function() {

            detailsAndNodeSelectionStep.view.getJobNameHolder().setValue("job name");

            var xhr = {

                getStatus: function () {
                    return 404;
                },
                getResponseText: function() {
                    return '{"id":"jobTemplate","message":"job with name does not exist"}';
                }
            };
            detailsAndNodeSelectionStep.proceedToNextStep({}, xhr);

            detailsAndNodeSelectionStep.validateJobName();

            expect(detailsAndNodeSelectionStep.view.getLoadingIcons().getStyle("display").to.equal("none"));

            expect(false).to.equal(detailsAndNodeSelectionStep.isValid());
        });

        it("When job name text box is given as Empty,check for the loading icon", function() {

            detailsAndNodeSelectionStep.view.getJobNameHolder().setValue("");
            detailsAndNodeSelectionStep.view.getJobNameHolder().trigger("input");
            expect(detailsAndNodeSelectionStep.view.getJobNameHolder().getValue()).to.equal("");
            expect(detailsAndNodeSelectionStep.view.getLoadingIcons().getStyle("display").to.equal("none"));
        });

        it("Checks if Next button is enabled when nodes are present and the job name is entered.", function() {

            detailsAndNodeSelectionStep.view.getJobNameHolder().setValue("job name");

            var xhr = {

                getStatus: function () {
                    return 200;
                },
                getResponseText: function() {
                    return '{"id":"jobTemplate","message":"job with name does not exist"}';
                }
            };
            detailsAndNodeSelectionStep.proceedToNextStep({}, xhr);

            detailsAndNodeSelectionStep.mesDetailsCollection.addModel(nodes);

            expect(true).to.equal(detailsAndNodeSelectionStep.isValid());
        });

        /*describe("When retrieving nodes from the LaunchContext", function () {
            it('should get nodes from LaunchContext if the query string contains the a launchContextId', function () {
                sandbox.stub(detailsAndNodeSelectionStep, 'getNodesFromLaunchContext');
                detailsAndNodeSelectionStep.loadNodesHandler("launchContextId=123");
                expect(detailsAndNodeSelectionStep.getNodesFromLaunchContext.callCount).to.equal(1);
                expect(detailsAndNodeSelectionStep.getNodesFromLaunchContext.getCall(0).calledWith('123')).to.equal(true);
            });
        });*/

        /*it("All rows should be displayed if filters are removed", function() {
            detailsAndNodeSelectionStep.mesTable.setData(nodes);

            detailsAndNodeSelectionStep.paginatedData = nodes;

            detailsAndNodeSelectionStep.filterTableData("neType","ern","=");
            detailsAndNodeSelectionStep.filterTableData("neType","","=");

            var filteredData = detailsAndNodeSelectionStep.mesTable.getData();

            expect(filteredData.length).to.equal(4);
            expect(filteredData[0].nodeName).to.equal(nodes[0].nodeName);
            expect(filteredData[0].neType).to.equal(nodes[0].neType);

            expect(filteredData[1].nodeName).to.equal(nodes[1].nodeName);
            expect(filteredData[1].neType).to.equal(nodes[1].neType);

            expect(filteredData[2].nodeName).to.equal(nodes[2].nodeName);
            expect(filteredData[2].neType).to.equal(nodes[2].neType);

            expect(filteredData[3].nodeName).to.equal(nodes[3].nodeName);
            expect(filteredData[3].neType).to.equal(nodes[3].neType);

        });

        it("Should display empty table when no rows are matched with the filter text", function() {
            detailsAndNodeSelectionStep.mesTable.setData(nodes);

            detailsAndNodeSelectionStep.paginatedData = nodes;

            detailsAndNodeSelectionStep.filterTableData("nodeName","g","=");

            var filteredData = detailsAndNodeSelectionStep.mesTable.getData();

            expect(filteredData.length).to.equal(0);
        });*/

      /*  it("Should display the selected rows (if any) even after removing filters and remove selected button should be enabled", function() {
            detailsAndNodeSelectionStep.mesTable.setData(nodes);

            selectedRow = {"MeContext=LTE17_ERBS00001" :true, "MeContext=LTE17_ERBS00003" :true};
            detailsAndNodeSelectionStep.mesTable.selectRows(function(row){
                return selectedRow[row.getData().networkElementFdn];
            });
            detailsAndNodeSelectionStep.rowSelectEndHandler();


            expect(Object.keys(detailsAndNodeSelectionStep.selectedNodes).length).to.equal(2);

            expect(undefined).to.equal(detailsAndNodeSelectionStep.removeSelectedButton.getElement().getAttribute('disabled'));

            detailsAndNodeSelectionStep.paginatedData = nodes;

            detailsAndNodeSelectionStep.filterTableData("nodeName","g","=");

            expect("disabled").to.equal(detailsAndNodeSelectionStep.removeSelectedButton.getElement().getAttribute('disabled'));
            var filteredData = detailsAndNodeSelectionStep.mesTable.getData();

            expect(filteredData.length).to.equal(0);

            expect(detailsAndNodeSelectionStep.mesTable.getSelectedRows().length).to.equal(0);

            detailsAndNodeSelectionStep.filterTableData("nodeName","","=");

            expect(undefined).to.equal(detailsAndNodeSelectionStep.removeSelectedButton.getElement().getAttribute('disabled'));
            expect(Object.keys(detailsAndNodeSelectionStep.selectedNodes).length).to.equal(2);

        });*/

        /*it("Should display only the rows matching the applied filters when more than one filter is applied", function() {
            detailsAndNodeSelectionStep.mesTable.setData(nodes);

            detailsAndNodeSelectionStep.paginatedData = nodes;

            detailsAndNodeSelectionStep.filterTableData("neType","e","=");
            detailsAndNodeSelectionStep.filterTableData("mirrorSynchronizationStatus","no","=");

            var filteredData = detailsAndNodeSelectionStep.mesTable.getData();

            expect(filteredData.length).to.equal(1);

            expect(filteredData[0].nodeName).to.equal(nodes[1].nodeName);
            expect(filteredData[0].neType).to.equal(nodes[1].neType);

        });*/

        /*it("Should display appropriate rows matching when the filter text is modified", function(){
            detailsAndNodeSelectionStep.mesTable.setData(nodes);

            detailsAndNodeSelectionStep.paginatedData = nodes;

            detailsAndNodeSelectionStep.filterTableData("neType","erb","=");

            var filteredData = detailsAndNodeSelectionStep.mesTable.getData();
            expect(filteredData.length).to.equal(2);

            detailsAndNodeSelectionStep.filterTableData("neType","er","=");

            var filteredData = detailsAndNodeSelectionStep.mesTable.getData();
            expect(filteredData.length).to.equal(4);
        });*/

       /* it("Should preserve row selection and enables remove selected button when rows are selected before and after applying filters", function() {
            detailsAndNodeSelectionStep.mesTable.setData(nodes);

            //selecting a row
            selectedRow = {"MeContext=LTE17_ERBS00002" :true};
            detailsAndNodeSelectionStep.mesTable.selectRows(function(row){
                return selectedRow[row.getData().networkElementFdn];
            });
            detailsAndNodeSelectionStep.rowSelectEndHandler();


            expect(Object.keys(detailsAndNodeSelectionStep.selectedNodes).length).to.equal(1);
            expect(undefined).to.equal(detailsAndNodeSelectionStep.removeSelectedButton.getElement().getAttribute('disabled'));

            //filtering two rows
            detailsAndNodeSelectionStep.paginatedData = nodes;

            detailsAndNodeSelectionStep.filterTableData("neType","ern","=");

            expect(detailsAndNodeSelectionStep.mesTable.getData().length).to.equal(2);
            expect("disabled").to.equal(detailsAndNodeSelectionStep.removeSelectedButton.getElement().getAttribute('disabled'));

            //selecting a row in filteredData
            selectedRow = {"MeContext=LTE17_ERBS00003" :true};
            detailsAndNodeSelectionStep.mesTable.selectRows(function(row){
                return selectedRow[row.getData().networkElementFdn];
            });

            detailsAndNodeSelectionStep.rowSelectEndHandler();

            expect(detailsAndNodeSelectionStep.mesTable.getSelectedRows().length).to.equal(1);

            expect(detailsAndNodeSelectionStep.selectedNodes["MeContext=LTE17_ERBS00003"]).to.equal(true);

            expect(undefined).to.equal(detailsAndNodeSelectionStep.removeSelectedButton.getElement().getAttribute('disabled'));



            //removing the filter
            detailsAndNodeSelectionStep.filterTableData("neType","","=");
            expect(detailsAndNodeSelectionStep.mesTable.getData().length).to.equal(4);

            //expecting two selected rows
            expect(detailsAndNodeSelectionStep.mesTable.getSelectedRows().length).to.equal(2);
            expect(Object.keys(detailsAndNodeSelectionStep.selectedNodes).length).to.equal(2);
            expect(undefined).to.equal(detailsAndNodeSelectionStep.removeSelectedButton.getElement().getAttribute('disabled'));


        });*/

        //filters with comparator as >
        /*it("Checks whether appropriate rows are displayed when comparator is \">\" ", function() {
            detailsAndNodeSelectionStep.mesTable.setData(nodes);

            detailsAndNodeSelectionStep.paginatedData = nodes;
            detailsAndNodeSelectionStep.filterTableData("nodeName","a",">");
            var filteredData = detailsAndNodeSelectionStep.mesTable.getData();
            expect(filteredData.length).to.equal(4);
            expect(filteredData[0].nodeName).to.equal(nodes[0].nodeName);
            expect(filteredData[1].nodeName).to.equal(nodes[1].nodeName);
            expect(filteredData[2].nodeName).to.equal(nodes[2].nodeName);
            expect(filteredData[3].nodeName).to.equal(nodes[3].nodeName);
        });

        it("All rows should be displayed if filters are removed when comparator is \">\"", function() {
            detailsAndNodeSelectionStep.mesTable.setData(nodes);

            detailsAndNodeSelectionStep.paginatedData = nodes;
            detailsAndNodeSelectionStep.filterTableData("neType","a",">");
            detailsAndNodeSelectionStep.filterTableData("neType","",">");

            var filteredData = detailsAndNodeSelectionStep.mesTable.getData();

            expect(filteredData.length).to.equal(4);
            expect(filteredData[0].nodeName).to.equal(nodes[0].nodeName);
            expect(filteredData[0].neType).to.equal(nodes[0].neType);

            expect(filteredData[1].nodeName).to.equal(nodes[1].nodeName);
            expect(filteredData[1].neType).to.equal(nodes[1].neType);

            expect(filteredData[2].nodeName).to.equal(nodes[2].nodeName);
            expect(filteredData[2].neType).to.equal(nodes[2].neType);

            expect(filteredData[3].nodeName).to.equal(nodes[3].nodeName);
            expect(filteredData[3].neType).to.equal(nodes[3].neType);

        });

        it("Should display empty table when no rows are matched with the filter text when comparator is \">\"", function() {
            detailsAndNodeSelectionStep.mesTable.setData(nodes);

            detailsAndNodeSelectionStep.paginatedData = nodes;
            detailsAndNodeSelectionStep.filterTableData("nodeName","m",">");

            var filteredData = detailsAndNodeSelectionStep.mesTable.getData();

            expect(filteredData.length).to.equal(0);
        });*/

        /*it("Should display the selected rows (if any) even after removing filters and remove selected button should be enabled when comparator is \">\"", function() {
            detailsAndNodeSelectionStep.mesTable.setData(nodes);

            selectedRow = {"MeContext=LTE17_ERBS00001" :true, "MeContext=LTE17_ERBS00003" :true};
            detailsAndNodeSelectionStep.mesTable.selectRows(function(row){
                return selectedRow[row.getData().networkElementFdn];
            });
            detailsAndNodeSelectionStep.rowSelectEndHandler();


            expect(detailsAndNodeSelectionStep.selectedNodes["MeContext=LTE17_ERBS00001"]).to.equal(true);
            expect(detailsAndNodeSelectionStep.selectedNodes["MeContext=LTE17_ERBS00003"]).to.equal(true);

            expect(Object.keys(detailsAndNodeSelectionStep.selectedNodes).length).to.equal(2);

            expect(undefined).to.equal(detailsAndNodeSelectionStep.removeSelectedButton.getElement().getAttribute('disabled'));



            detailsAndNodeSelectionStep.paginatedData = nodes;
            detailsAndNodeSelectionStep.filterTableData("nodeName","m",">");

            expect("disabled").to.equal(detailsAndNodeSelectionStep.removeSelectedButton.getElement().getAttribute('disabled'));
            var filteredData = detailsAndNodeSelectionStep.mesTable.getData();

            expect(filteredData.length).to.equal(0);

            expect(detailsAndNodeSelectionStep.mesTable.getSelectedRows().length).to.equal(0);

            detailsAndNodeSelectionStep.filterTableData("nodeName","",">");

            expect(undefined).to.equal(detailsAndNodeSelectionStep.removeSelectedButton.getElement().getAttribute('disabled'));
            expect(Object.keys(detailsAndNodeSelectionStep.selectedNodes).length).to.equal(2);

        });*/

        /*it("Should display only the rows matching the applied filters when more than one filter is applied when comparator is \">\"", function() {
            detailsAndNodeSelectionStep.mesTable.setData(nodes);

            detailsAndNodeSelectionStep.paginatedData = nodes;
            detailsAndNodeSelectionStep.filterTableData("neType","c",">");
            detailsAndNodeSelectionStep.filterTableData("mirrorSynchronizationStatus","r",">");

            var filteredData = detailsAndNodeSelectionStep.mesTable.getData();

            expect(filteredData.length).to.equal(3);

            expect(filteredData[0].nodeName).to.equal(nodes[0].nodeName);
            expect(filteredData[0].neType).to.equal(nodes[0].neType);

        });


        //filters with comparator as <
        it("Checks whether appropriate rows are displayed when comparator is \"<\" ", function() {
            detailsAndNodeSelectionStep.mesTable.setData(nodes);

            detailsAndNodeSelectionStep.paginatedData = nodes;
            detailsAndNodeSelectionStep.filterTableData("mirrorSynchronizationStatus","s","<");
            var filteredData = detailsAndNodeSelectionStep.mesTable.getData();
            expect(filteredData.length).to.equal(1);
            expect(filteredData[0].nodeName).to.equal(nodes[1].nodeName);
        });

        it("All rows should be displayed if filters are removed when comparator is \"<\"", function() {
            detailsAndNodeSelectionStep.mesTable.setData(nodes);

            detailsAndNodeSelectionStep.paginatedData = nodes;
            detailsAndNodeSelectionStep.filterTableData("neType","f","<");
            detailsAndNodeSelectionStep.filterTableData("neType","","<");

            var filteredData = detailsAndNodeSelectionStep.mesTable.getData();

            expect(filteredData.length).to.equal(4);
            expect(filteredData[0].nodeName).to.equal(nodes[0].nodeName);
            expect(filteredData[0].neType).to.equal(nodes[0].neType);

            expect(filteredData[1].nodeName).to.equal(nodes[1].nodeName);
            expect(filteredData[1].neType).to.equal(nodes[1].neType);

            expect(filteredData[2].nodeName).to.equal(nodes[2].nodeName);
            expect(filteredData[2].neType).to.equal(nodes[2].neType);

            expect(filteredData[3].nodeName).to.equal(nodes[3].nodeName);
            expect(filteredData[3].neType).to.equal(nodes[3].neType);

        });

        it("Should display empty table when no rows are matched with the filter text when comparator is \"<\"", function() {
            detailsAndNodeSelectionStep.mesTable.setData(nodes);

            detailsAndNodeSelectionStep.paginatedData = nodes;
            detailsAndNodeSelectionStep.filterTableData("nodeName","k","<");

            var filteredData = detailsAndNodeSelectionStep.mesTable.getData();

            expect(filteredData.length).to.equal(0);
        });

      *//*  it("Should display the selected rows (if any) even after removing filters and remove selected button should be enabled when comparator is \"<\"", function() {
            detailsAndNodeSelectionStep.mesTable.setData(nodes);

            selectedRow = {"MeContext=LTE17_ERBS00001" :true, "MeContext=LTE17_ERBS00003" :true};
            detailsAndNodeSelectionStep.mesTable.selectRows(function(row){
                return selectedRow[row.getData().networkElementFdn];
            });


            detailsAndNodeSelectionStep.rowSelectEndHandler();


            expect(Object.keys(detailsAndNodeSelectionStep.selectedNodes).length).to.equal(2);

            expect(detailsAndNodeSelectionStep.selectedNodes["MeContext=LTE17_ERBS00001"]).to.equal(true);
            expect(detailsAndNodeSelectionStep.selectedNodes["MeContext=LTE17_ERBS00003"]).to.equal(true);

            expect(undefined).to.equal(detailsAndNodeSelectionStep.removeSelectedButton.getElement().getAttribute('disabled'));


            detailsAndNodeSelectionStep.paginatedData = nodes;
            detailsAndNodeSelectionStep.filterTableData("nodeName","k","<");

            expect("disabled").to.equal(detailsAndNodeSelectionStep.removeSelectedButton.getElement().getAttribute('disabled'));
            var filteredData = detailsAndNodeSelectionStep.mesTable.getData();

            expect(filteredData.length).to.equal(0);

            expect(detailsAndNodeSelectionStep.mesTable.getSelectedRows().length).to.equal(0);

            detailsAndNodeSelectionStep.filterTableData("nodeName","","<");

            expect(undefined).to.equal(detailsAndNodeSelectionStep.removeSelectedButton.getElement().getAttribute('disabled'));
            expect(Object.keys(detailsAndNodeSelectionStep.selectedNodes).length).to.equal(2);


        });*//*

        it("Should display only the rows matching the applied filters when more than one filter is applied when comparator is \"<\"", function() {
            detailsAndNodeSelectionStep.mesTable.setData(nodes);

            detailsAndNodeSelectionStep.paginatedData = nodes;

            detailsAndNodeSelectionStep.filterTableData("neType","f","<");
            detailsAndNodeSelectionStep.filterTableData("mirrorSynchronizationStatus","o","<");

            var filteredData = detailsAndNodeSelectionStep.mesTable.getData();

            expect(filteredData.length).to.equal(1);

            expect(filteredData[0].nodeName).to.equal(nodes[1].nodeName);
            expect(filteredData[0].neType).to.equal(nodes[1].neType);
        });

        it("Pagination should be displayed only when table rows are greater than dropdown value", function() {

            detailsAndNodeSelectionStep.mesTable.setData(nodes);

            detailsAndNodeSelectionStep.mesDetailsCollection.addModel(nodes);

            detailsAndNodeSelectionStep.mainpageLimit.setValue({name: "1", value: "1"});

            detailsAndNodeSelectionStep.resetTableAndPagination(false);

            expect(detailsAndNodeSelectionStep.view.getElement().find(".eanpamlibrary-wJobdetails-wTopologySelection-paginationHolder").getStyle("display")).to.equal("inline-block");
        });

        it("Pagination should not be displayed when table rows are lesser than dropdown value", function() {

            detailsAndNodeSelectionStep.mesTable.setData(nodes);

            detailsAndNodeSelectionStep.mesDetailsCollection.addModel(nodes);

            detailsAndNodeSelectionStep.mainpageLimit.setValue({name: "10", value: "10"});

            detailsAndNodeSelectionStep.resetTableAndPagination(false);

            expect(detailsAndNodeSelectionStep.view.getElement().find(".eanpamlibrary-wJobdetails-wTopologySelection-paginationHolder").getStyle("display")).to.equal("none");
        });

        it("Number of rows in table should be less than or equal to dropdown value", function() {

            detailsAndNodeSelectionStep.mesTable.setData(nodes);

            detailsAndNodeSelectionStep.mesDetailsCollection.addModel(nodes);

            detailsAndNodeSelectionStep.mainpageLimit.setValue({name: "1", value: "1"});

            detailsAndNodeSelectionStep.resetTableAndPagination(false);

            expect(detailsAndNodeSelectionStep.mesTable.getData().length).to.equal(1);
        });*/
    });
});
