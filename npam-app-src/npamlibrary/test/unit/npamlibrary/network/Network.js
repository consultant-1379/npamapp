/**
 * Created with IntelliJ IDEA.
 * User: tcsvina
 * Date: 7/21/15
 * Time: 10:57 AM
 * To change this template use File | Settings | File Templates.
 */

define([
    "jscore/core",
    "npamlibrary/network/Network",
    'jscore/ext/locationController',
    "networkexplorerlib/TopologyDropdown",
    "jscore/ext/mvp",
    "npamlibrary/displaymessage",
    'widgets/SelectionList'
], function (core, network, locationController, topologydropdown, mvp, DisplayMessage, SelectionList) {
    'use strict';

    describe("Tests the Network widget", function () {

        var server, networkWidget, sandbox, eventBusStub, model, models = [], networkCollection, viewStub;

        beforeEach(function(done){
            var options = {};
            options.appName = "SHM";
            networkCollection = new mvp.Collection();
            sandbox = sinon.sandbox.create();
            server = sinon.fakeServer.create();
            sandbox.spy(network.prototype, "init");
            sandbox.spy(locationController.prototype, "addLocationListener");
            sandbox.spy(locationController.prototype, "start");
            eventBusStub = {
                publish: function () {
                },

                subscribe: function(){
                }
            };
            sandbox.stub(network.prototype, 'getEventBus', function () {
                return eventBusStub;
            });
            networkWidget = new network(options, eventBusStub);
            networkWidget.start();
            networkWidget.finalCollection = new mvp.Collection();
            viewStub = {
                getList: function () {
                },
                getTopologySelectionHolder: function () {
                },
                getDisplayMessageHolder: function () {
                },
                setSelectText: function () {

                },
                setAllText: function () {

                },
                setNoneText: function () {

                }
            };
            networkWidget.view = viewStub;

            sandbox.stub(networkWidget, 'showDisplayMessage', function () {
            });
//            networkWidget.selectionList = new SelectionList();
            networkWidget.displayMessage = new DisplayMessage();
            /*sandbox.spy(networkWidget.displayMessage, 'setLevel');
            sandbox.spy(networkWidget.displayMessage, 'setHeading');
            sandbox.spy(networkWidget.displayMessage, 'setDescription');*/
            sandbox.spy(viewStub, 'getTopologySelectionHolder');
            sandbox.spy(networkWidget.topologyDropdown, 'attachTo');
            networkWidget.onStart();
            sandbox.spy(viewStub, "getList");
            sandbox.spy(SelectionList.prototype, "attachTo");
//            sandbox.spy(networkWidget, "loadManagedObjectsForStaticCollectionsOnSuccess");
//            sandbox.spy(networkWidget, "loadErrorMessage");
            sandbox.spy(networkWidget, "loadData");
            sandbox.spy(networkWidget, "hideDisplayMessage");
            sandbox.spy(networkWidget, "clearList");

            model = {
                "networkElementFdn": "NetworkElement=LTE17_ERBS00001",
                "neType": "ERBS",
                "attributes": {
                    "name": null,
                    "fdn": "NetworkElement=LTE17_ERBS00001",
                    "neType": "ERBS",
                    "selected": false
                }
            };
            models.push(model);

            model = {
                "networkElementFdn": "NetworkElement=LTE17_ERBS00002",
                "neType": "ERBS",
                "attributes": {
                    "name": null,
                    "fdn": "NetworkElement=LTE17_ERBS00002",
                    "neType": "ERBS",
                    "selected": false
                }
            };
            models.push(model);

            model = {
                "networkElementFdn": "NetworkElement=LTE17_ERBS00003",
                "neType": "ERBS",
                "attributes": {
                    "name": null,
                    "fdn": "NetworkElement=LTE17_ERBS00003",
                    "neType": "ERBS",
                    "selected": false
                }
            };
            models.push(model);

            model = {
                "networkElementFdn": "NetworkElement=LTE17_ERBS00004",
                "neType": "ERBS",
                "attributes": {
                    "name": null,
                    "fdn": "NetworkElement=LTE17_ERBS00004",
                    "neType": "ERBS",
                    "selected": false
                }
            };
            models.push(model);
            done();

        });

        afterEach(function (done) {
            networkWidget.stop();
            server.restore();
            models = [];
            sandbox.restore();
            done();
        });

        it("Display message should be hidden when data gets loaded", function () {
            networkWidget.finalCollection.addModel(models);
            networkWidget.loadData();
            expect(networkWidget.hideDisplayMessage.callCount).to.equal(1);
        });

        it("When data gets loaded, selection list should be displayed and updated with data", function () {
            networkWidget.finalCollection.addModel(models);
//            networkWidget.selectionList.setItems(networkWidget.finalCollection.toJSON());
            networkWidget.loadData();
            expect(networkWidget.selectionList.attachTo.callCount).to.equal(1);
            expect(networkWidget.selectionList.getItems().length).to.equal(4);
            console.log(networkWidget.selectionList);
            expect(networkWidget.selectionList._data[0].networkElementFdn).to.equal("NetworkElement=LTE17_ERBS00001");
//            expect(networkWidget.selectionList._data[1].name).to.equal("LTE17_ERBS00002");
            expect(networkWidget.selectionList._data[2].neType).to.equal("ERBS");
//            expect(networkWidget.selectionList._data[3].selected).to.equal(false);
        });

        it("When nodes are selected in the selection list, action dropdown should be enabled", function () {
            networkWidget.finalCollection.addModel(models);
            networkWidget.loadData();
            expect(networkWidget.selectionList.dropdown.getElement()._getHTMLElement().getAttribute("class")).to.be.equal("ebDropdown ebDropdown_disabled");
            networkWidget.selectionList.selectItem(3);
            expect(networkWidget.selectionList.dropdown.getElement()._getHTMLElement().getAttribute("class")).to.be.equal("ebDropdown");
        });

        it("When a node is selected and removed, no. of nodes in the selection list should be updated", function () {
            networkWidget.finalCollection.addModel(models);
            networkWidget.loadData();
            networkWidget.selectionList.selectItem(2);
            networkWidget.selectionList.selectItem(3);
            networkWidget.removeSelectedNetworkElements();
            expect(networkWidget.finalCollection.toJSON().length).to.equal(2);
        });

        it("When all the nodes are selected and removed, no. of nodes in the selection list should be zero", function () {
            networkWidget.finalCollection.addModel(models);
            networkWidget.loadData();
            networkWidget.selectionList.selectAll();
            networkWidget.removeSelectedNetworkElements();
            expect(networkWidget.finalCollection.toJSON().length).to.equal(0);
        });

        it("When remove all from the list is selected in dropdown, selection list items should be zero", function () {
            networkWidget.finalCollection.addModel(models);
//            networkWidget.loadData();
            networkWidget.loadData();
            networkWidget.selectionList.selectItem(2);
            networkWidget.clearList();
            expect(networkWidget.finalCollection.toJSON().length).to.equal(0);
        });

        it("When all the nodes are selected in the list and remove all from the list is selected in dropdown, selection list items should be zero", function () {
            networkWidget.finalCollection.addModel(models);
            networkWidget.loadData();
            console.log(networkWidget.selectionList.getItems());
            networkWidget.selectionList.selectAll();
            networkWidget.clearList();
            expect(networkWidget.selectionList.getItems().length).to.equal(0);
        });

        it("Checks finalCollection size should equal to model length ", function () {
            networkWidget.finalCollection.addModel(models);
            expect(networkWidget.finalCollection.size()).to.equal(models.length);
            networkWidget.finalCollection.toJSON().forEach(function (element) {
                var flag = false;
                models.forEach(function (model) {
                    if (model.fdn === element.fdn) {
                        flag = true;
                    }
                });
                expect(flag).to.equals(true);
            });
        });

        it("Checks drop-down values should update when app name is shmsoftwareinventory", function () {
            networkWidget.appName = "shmsoftwareinventory";
            networkWidget.buildDropDownOptions();
            expect(networkWidget.dropdownOptionFirst).to.equal("Create Upgrade Job");
            expect(networkWidget.hashValueFirst).to.equal("shmcreateupgradejob");
        });

        it("Checks drop-down values should update when app name is shmbackupinventory", function () {
            networkWidget.appName = "shmbackupinventory";
            networkWidget.buildDropDownOptions();
            expect(networkWidget.dropdownOptionFirst).to.equal("Create Backup Job");
            expect(networkWidget.hashValueFirst).to.equal("shmcreatebackupjob");
            expect(networkWidget.dropdownOptionSecond).to.equal("Create Restore Backup Job");
            expect(networkWidget.hashValueSecond).to.equal("shmrestorebackupjob");
        });

        it("Checks drop-down values should update when app name is shmlicenseinventory", function () {
            networkWidget.appName = "shmlicenseinventory";
            networkWidget.buildDropDownOptions();
            expect(networkWidget.dropdownOptionFirst).to.equal("Install Key Files");
            expect(networkWidget.hashValueFirst).to.equal("shminstalllicensekeyfiles");
        });

        it("checks hash value is assigning for app related first value", function() {
            networkWidget.appName = "shmsoftwareinventory";
            networkWidget.hashValueFirst = "shmcreateupgradejob";
            networkWidget.appRelatedFirstAction();
            expect(window.location.hash).to.equal("#shmcreateupgradejob");
            expect(sessionStorage.getItem("comeFrom")).to.equal("shmsoftwareinventory");
        });

        it("checks hash value is assigning for app related second value", function(){
            networkWidget.appName = "shmbackupinventory";
            networkWidget.hashValueSecond  = "shmrestorebackupjob";
            networkWidget.appRelatedSecondAction();
            expect(window.location.hash).to.equal("#shmrestorebackupjob");
            expect(sessionStorage.getItem("comeFrom")).to.equal("shmbackupinventory");
        })

    });


});