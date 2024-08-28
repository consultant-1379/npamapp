/*global define*/
define([
    'jscore/core',
    'jscore/ext/mvp',
    './NetworkView',
    'widgets/SelectionList',
    "scopingpanel/TopologyButton",
    "npamlibrary/displaymessage",
    'jscore/ext/locationController',
    'jscore/ext/net',
    'i18n!npamlibrary/dictionary.json',
    'npamlibrary/serverUtil',
    '../ext/networkUtil',
    'npamlibrary/sessionStorageUtil',
    'npamlibrary/constants',
    'widgets/Dialog',
    'scopingpanel/ScopingPanel'
], function (core, mvp, View, SelectionList, TopologyButton, DisplayMessage, LocationController, net, libLanguage, ServerUtil, networkUtil, sessionStorageUtil, Constants, Dialog, ScopingPanel) {

    'use strict';
    return core.Region.extend({

        View: View,

        flag: false,

        init: function (options) {
            this.appName = options.appName;
            this.flag = false;
            this.topologyButton = new TopologyButton({
                context: this.getContext(),
                multiselect: true,
                restrictions: {
                    nodeLevel: true
                }
            });
            this.meCollectionSet = new mvp.Collection();
            this.savedSearchSet = new mvp.Collection();
            this.index = 0;
            /*nodes object stores the node name as a key and network element fdn as it's value
             * Ex: {'node name': 'network element fdn of the node'}*/
            this.nodesObject = {};
            this.poIdList = [];
            this.getEventBus().subscribe("inventorydetails:unsupportedNodes", this.addUnsupportedIconToSelectionItemsList.bind(this));
            this.unSupportedMoPopup = this.createUnSupportedMoPopup();
            networkUtil.parent = this;
        },

        getDefaultDropdownOptions: function () {
            return [
                {name: libLanguage.get('removeList').replace("<replace>", libLanguage.get('selected')), action: this.removeSelectedNetworkElements.bind(this)},
                {type: 'separator'},
                {name: libLanguage.get('removeList').replace("<replace>", libLanguage.get('all')), action: this.clearList.bind(this)}
            ];
        },

        getMultipleDropdownOptions: function () {
            return [
                {name: libLanguage.get('removeList').replace("<replace>", libLanguage.get('selected')), action: this.removeSelectedNetworkElements.bind(this)},
                {type: 'separator'},
                {name: this.dropdownOptionFirst, action: this.rbackCheck.bind(this, this.hashValueFirst)},
                {name: this.dropdownOptionSecond, action: this.rbackCheck.bind(this, this.hashValueSecond)},
                {name: this.dropdownOptionThird, action: this.rbackCheck.bind(this, this.hashValueThird)},
                {name: this.dropdownOptionFourth, action: this.rbackCheck.bind(this, this.hashValueFourth)},
                {name: libLanguage.get('removeList').replace("<replace>", libLanguage.get('all')), action: this.clearList.bind(this)}
            ];
        },

        onStart: function () {
            this.topologyButton.attachTo(this.view.getTopologySelectionHolder());
            this.scopingPanelEventId = this.getEventBus().subscribe(ScopingPanel.events.SELECT, networkUtil.onScopingPanelSelect.bind(networkUtil));
        },

        onStop: function() {
            this.getEventBus().unsubscribe(this.scopingPanelEventId);
        },

        buildDropDownOptions: function() {
            if (this.appName === "shm/softwareadministration") {
                this.dropdownOptionFirst = libLanguage.get('createUpgradeJob');
                this.hashValueFirst = Constants.UP_JOB_LINK;
                this.dropdownOptionSecond = libLanguage.get('nodeRestartJob');
                this.hashValueSecond = Constants.NODE_RESTART_LINK;
            }
            else if (this.appName === "shm/backupadministration") {
                this.dropdownOptionFirst = libLanguage.get('createBackupJob');
                this.hashValueFirst = Constants.BKUP_JOB_LINK;
                this.dropdownOptionSecond = libLanguage.get('createRestoreJob');
                this.hashValueSecond = Constants.RESTORE_JOB_LINK;
                this.dropdownOptionThird = libLanguage.get('backupHouseKeeping');
                this.hashValueThird = Constants.HOUSE_KEEPING_LINK;
                this.dropdownOptionFourth = libLanguage.get('nodeRestartJob');
                this.hashValueFourth = Constants.NODE_RESTART_LINK;
            }
            else if (this.appName === "shm/licenseadministration") {
                localStorage.setItem("matchingNodesWithLicenseKeys", JSON.stringify([]));
                localStorage.setItem("nodeNameAndSequenceNumberSet", JSON.stringify({}));
                this.dropdownOptionFirst = libLanguage.get('installKeyFiles');
                this.hashValueFirst = Constants.LIC_JOB_LINK;
                this.dropdownOptionSecond = libLanguage.get('nodeRestartJob');
                this.hashValueSecond = Constants.NODE_RESTART_LINK;
                this.dropdownOptionThird = libLanguage.get('refreshKeyFiles');
                this.hashValueThird = Constants.REFRESH_JOB_LINK;
                this.dropdownOptionFourth = libLanguage.get('upgradeLicKeys');
                this.hashValueFourth = Constants.UPGRADE_LIC_LINK;
            }
            else {
                this.dropdownOptionFirst = libLanguage.get('nodeRestartJob');
                this.hashValueFirst = Constants.NODE_RESTART_LINK;
                this.dropdownOptionSecond = "";
                this.hashValueSecond = "";
            }
        },

        onViewReady: function() {
            this.locationController = new LocationController({
                namespace: this.appName
            });
            this.locationController.addLocationListener(networkUtil.locationChangeHandler.bind(networkUtil, this));
            this.locationController.start();
            if(Object.keys(this.nodesObject).length === 0) {
                this.showDisplayMessage();
            }
        },

        showDisplayMessage: function () {
            if(this.displayMessage) {
                this.displayMessage.destroy();
            }
            this.displayMessage = new DisplayMessage();
            this.displayMessage.showMessage(true, libLanguage.get('loadTopologyContent'), "dialogInfo", libLanguage.get('loadTopologyHeader'));
            this.displayMessage.attachTo(this.view.getDisplayMessageHolder());
        },

        hideDisplayMessage: function () {
            if(this.displayMessage){
                this.displayMessage.detach();
            }
        },

        loadData: function () {
            this.buildDropDownOptions();
            this.hideDisplayMessage();
            if(!networkUtil.showErrorDialog) {
                this.hidePopup();
            }
            if (this.selectionList) {
                this.selectionList.destroy();
            }
            var selectedNodes = sessionStorageUtil.getSessionStorageAttribute("selectedNodes"), selectedNeFDNsList = [];
            if(selectedNodes) {
                selectedNodes.forEach(function(node) {
                    selectedNeFDNsList.push(node.networkElementFdn);
                });
            }

            /*Prepare the items list for the selection list from nodesObject.
             * while preparing check if the node is already in selected nodes list.
             * If it is present set the flag 'selected' to true.*/
            var selectionListItemsArray = [];
            Object.keys(this.nodesObject).forEach(function (nodeName) {
                var neFdn = this.nodesObject[nodeName];
                if(neFdn !== undefined) {
                    var item = {
                        name: nodeName,
                        networkElementFdn: neFdn
                    };
                    if(selectedNeFDNsList.indexOf(neFdn) > -1) {
                        item.selected = true;
                    }
                    selectionListItemsArray.push(item);
                }
            }.bind(this));
            selectionListItemsArray.sort(function (a, b) {
                a = a.name.toUpperCase();
                b = b.name.toUpperCase();
                if (a < b) {
                    return -1;
                } else if (a > b) {
                    return 1;
                } else {
                    return 0;
                }
            });
            this.nodes = [];
            this.selectedNodes = [];
            var attribute1 = ["selectedNodes",this.selectedNodes];
            var attribute2 = ["nodes",this.nodes];
            sessionStorageUtil.updateSessionStorage(attribute1, attribute2);
            var selectionListItemsArrayLength = selectionListItemsArray.length;
            this.selectionList = new SelectionList({
                items: selectionListItemsArray,
                header: libLanguage.get('networkHeader'),
                headerTagName: 'h3',
                showSelectActions: true,
                dropdown: {
                    caption: libLanguage.get('actions'),
                    items: [
                        {name: libLanguage.get('removeList').replace("<replace>", libLanguage.get('selected')), title: libLanguage.get('removeList').replace("<replace>", libLanguage.get('selected')), action: this.removeSelectedNetworkElements.bind(this, selectionListItemsArrayLength)},
                        {type: 'separator'},
                        {name: this.dropdownOptionFirst, title: this.dropdownOptionFirst, action: this.rbackCheck.bind(this, this.hashValueFirst)},
                        {name: this.dropdownOptionSecond, title: this.dropdownOptionSecond, action: this.rbackCheck.bind(this, this.hashValueSecond)},
                        {name: libLanguage.get('removeList').replace("<replace>", libLanguage.get('all')), title: libLanguage.get('removeList').replace("<replace>", libLanguage.get('all')), action: this.clearList.bind(this)}
                    ]
                }
            });
            this.selectionList.addEventHandler("change", this.publishSelectedNodes.bind(this));
            this.selectionList.attachTo(this.view.getList());
            this.view.setSelectText(libLanguage.get('select'));
            this.view.setAllText(libLanguage.get('all'));
            this.view.setNoneText(libLanguage.get('none'));
            this.publishSelectedNodes();
        },

        removeSelectedNetworkElements: function (selectionListItemsArrayLength) {
            if(selectionListItemsArrayLength && this.selectionList.getSelected().length === selectionListItemsArrayLength) {
                this.clearList();
            } else {
                var selectedIndexes = [];
                this.selectionList.getSelected().forEach(function (item) {
                    selectedIndexes.push(item.index);
                    for(var nodeName in this.nodesObject) {
                        /*Entries in the nodes object can be deleted with 'delete' keyword, but as it slows the performance of application
                         * assigning the undefined value will serve the purpose.*/
                        if(nodeName === item.name) {
                            this.nodesObject[nodeName] = undefined;
                        }
                    }
                }.bind(this));
                selectedIndexes.sort(function (a, b) {
                    return b - a;
                });
                selectedIndexes.forEach(function (index) {
                    this.selectionList.removeItem(index);
                }.bind(this));
                var attribute = ["actionType","deletion"];
                sessionStorageUtil.updateSessionStorage(attribute);
                this.publishSelectedNodes();
                this.locationController.setLocation(this.appName, true, true);
            }
        },

        createUnSupportedMoPopup: function() {
            return new Dialog({
                type: "error",
                optionalContent: "",
                buttons: [
                    {
                        caption: libLanguage.get('ok'),
                        color: 'darkBlue',
                        action: function(){
                            this.hidePopup();
                        }.bind(this)
                    }
                ]
            });
        },

        hidePopup: function(){
            this.unSupportedMoPopup.hide();
        },

        showPopup: function(){
            this.unSupportedMoPopup.show();
        },

        setErrorPopup: function(header, content, optContent) {
            this.unSupportedMoPopup.setHeader(header);
            this.unSupportedMoPopup.setContent(content);
            this.unSupportedMoPopup.setOptionalContent(optContent);
        },

        rbackCheck: function (hash) {
            ServerUtil.rbacCheck('/oss/shm/rest/rbac/createjob', this.navigateViaOptions.bind(this, hash), this.restrictAccess.bind(this));
        },

        restrictAccess: function (response, xhr) {
            this.getEventBus().publish("rbacCheckFailed", response, xhr);
        },

        navigateViaOptions: function(hash){
            var attribute = ["comeFrom",this.appName];
            sessionStorageUtil.updateSessionStorage(attribute);
            window.location.hash = hash;
        },

        clearList: function () {
            var attribute = ["actionType","deletion"];
            sessionStorageUtil.updateSessionStorage(attribute);
            this.nodesObject = {};
            if(this.selectionList) {
                this.selectionList.getItems().forEach(function (item) {
                    item.destroy();
                }.bind(this));
                this.selectionList.clear();
                this.publishSelectedNodes();
            }
            this.locationController.setLocation(this.appName, false, true);
        },

        publishSelectedNodes: function () {
            if (this.selectionList.getSelected().length > 0) {
                this.selectionList.getDropdown().setItems(this.getMultipleDropdownOptions());
            }

            this.nodes = [];
            this.selectedNodes = [];
            var fdns = [];
            var selectedFdns = [];
            this.selectionList.getItems().forEach(function (item) {
                var neDetails = {
                    'networkElementFdn':item.options.data.networkElementFdn,
                    'name': item.options.data.name
                };
                if (item.isHighlighted()) {
                    this.selectedNodes.push(neDetails);
                    selectedFdns.push(neDetails.networkElementFdn);
                }
                this.nodes.push(neDetails);
                fdns.push(neDetails.networkElementFdn);
            }.bind(this));
            var attribute1 = ["selectedNodes",this.selectedNodes];
            var attribute2 = ["nodes",this.nodes];
            sessionStorageUtil.updateSessionStorage(attribute1, attribute2);

            if (this.selectedNodes.length > 0) {
                var attribute = ["actionType","selection"];
                sessionStorageUtil.updateSessionStorage(attribute);
                this.getEventBus().publish("mesSelectedEvent", selectedFdns);
            } else if (this.nodes.length > 0) {
                this.getEventBus().publish("mesSelectedEvent", fdns);
                this.selectionList.dropdown.disable();
            } else {
                this.getEventBus().publish("mesDeSelectedEvent", fdns);
                this.showDisplayMessage();
                this.selectionList.detach();
            }
        },

        addUnsupportedIconToSelectionItemsList: function (unsupportedNodes) {
            var startTime = new Date(), unsupportedNodesArray = Object.keys(unsupportedNodes), invNotSupported = libLanguage.get('invNotSupported');
            if(this.selectionList) {
                this.selectionList.getItems().forEach(function (item) {
                    var labelHolder = item.view.getElement();
                    if (labelHolder.children().length > 0 && labelHolder.find('.ebIcon_info')) {
                        labelHolder.find('.ebIcon_info').remove();
                    }
                    unsupportedNodesArray.forEach(function (unsupportedNode) {
                        if (unsupportedNode === item.options.data.name) {
                            var spanEl = this.getSpanElement(invNotSupported);
                            if(Constants[unsupportedNodes[unsupportedNode]]) {
                                spanEl.setAttribute("title", libLanguage[Constants[unsupportedNodes[unsupportedNode]]]);
                            }
                            item.view.getElement().find('.elWidgets-SelectionList-label').setAttribute("class", "elWidgets-SelectionList-label eaNpamlibrary-Network-overFlowEllipsis");
                            labelHolder.append(spanEl);
                        }
                        var labelText = item.view.getElement().find('.elWidgets-SelectionList-label').getText().trim();
                        item.view.getElement().find('.elWidgets-SelectionList-label').setAttribute("title", labelText);
                    }.bind(this));
                }.bind(this));
            }
            var endTime = new Date();
            console.info("Inventories::Time taken to populate info icon in millies::", endTime - startTime);
        },

        getSpanElement: function (invNotSupported) {
            var label = new core.Element("span");
            label.setAttribute("class", "ebIcon ebIcon_info");
            label.setAttribute("title", invNotSupported);
            label.setAttribute("style", "float:right; margin-top:8px; margin-right: 4px;");
            return label;
        }
    });
});