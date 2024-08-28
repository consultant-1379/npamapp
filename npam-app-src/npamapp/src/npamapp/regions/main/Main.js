define([
    'jscore/core',
    'jscore/ext/utils/base/underscore',
    'jscore/ext/locationController',
    './MainView',
    'scopingpanel/ScopingPanel',
    '../../ext/NeAccountMgmtFacade',
    '../../ext/TopologyCollectionsFacade',
    '../../ext/ManagedObjectFacade',
    'widgets/Tabs',
    'widgets/InlineMessage',
    'i18n!npamapp/dictionary.json',
    '../../ext/Constants',
    '../../ext/DataService',
    'container/api',
    'widgets/Button',
    'widgets/Dialog',
    '../../widgets/neaccounttable/NeAccountTable',
    '../../widgets/exportDialogContent/ExportDialogContent',
    '../../widgets/importDialogContent/ImportDialogContent',
    'npamlibrary/dateUtil',
    'npamlibrary/StandardErrorMessagesUtil',
    'npamlibrary/displaymessage',
    'npamlibrary/i18NumberUtil',
    'npamlibrary/constants'
], function (core, underscore, LocationController, View, ScopingPanel, NeAccountMgmtFacade,TopologyCollectionsFacade,
             ManagedObjectFacade, Tabs, InlineMessage, Dictionary, Constants, dataService, Container, Button, Dialog,
             NeAccountTable, ExportDialogContent, ImportDialogContent, DateUtil,
             StandardErrorMessagesUtil, DisplayMessage, i18NumberUtil, libConstants) {
    'use strict';
    return core.Region.extend({
        View: View,

        init: function (options) {
            this.searchQuery = "";
            this.isCollection = false;
            this.isSavedSearch = false;
            this.neList = '';
            this.unmanagedNodesNeList = '';
            this.sortData = {};
            this.debugMode = false;
            this.unmanagedNodes = [];
            this.managedNodes = [];
            this.collections = [];
            this.savedSearches = [];
            this.npamEnabled = options.npamEnabled;
            this.cbrsEnabled = options.cbrsEnabled;
        },

        onStart: function () {
            this.locationController = new LocationController({namespace:  this.options.namespace,
                    autoUrlDecode: false});
            this.initialAppNamespace = this.getAppNameSpace(this.locationController.getNamespaceLocation());
            this.lastNamespace = this.initialAppNamespace;
            this.locationController.addLocationListener(this.handleLocationChange, this);
            this.locationController.start();

            this.getEventBus().subscribe(ScopingPanel.events.SELECT, this.handleNodeItemSelectEvent, this);
            this.getEventBus().subscribe('scopingPanel:tabChange', this.scopingPanelTabChange, this);
            this.getEventBus().subscribe('action:viewSummary', this.neAccountSummaryTrigger, this);
            this.getEventBus().subscribe('npamapp:test_allnodes_on', function() { this.debugMode = true; }, this);
            this.getEventBus().subscribe('npamapp:test_allnodes_off', function() { this.debugMode = false; }, this);
            this.getEventBus().subscribe("updatecolumns", this.updateColumns.bind(this));
            this.getEventBus().subscribe("noColSelected", this.updateColumns.bind(this));

        },

        getAppNameSpace: function(e) {
            var t = e.split("/")[0];
            return t.split("?")[0];
        },

        handleLocationChange: function(e) {
           console.log("locationChange " + e + " " + this.initialAppNamespace + " " + this.lastNamespace);
           if (e.startsWith(this.initialAppNamespace) && this.lastNamespace !== this.initialAppNamespace) {
               console.log("locationChange to my app");
               if (this.data) {
                  this.handleNodeItemSelectEvent();
               }
               this.getEventBus().publish('npamapp:updateActions', []);
           } else {
               console.log("localchange inside up");
               if (e === this.initialAppNamespace) {
                 this.handleNodeItemSelectEvent(this.data);
               }
           }
           this.lastNamespace = this.getAppNameSpace(this.locationController.getNamespaceLocation());

        },

        refreshNeAccountTable: function() {
            console.log("Main refresh");
            if (this.data)
                this.handleNodeItemSelectEvent(this.data);
        },

        onViewReady: function () {
            this.nodeNotSelectedInlineMessage = createInlineMessage(Dictionary.inlineMessages.nodeNotSelectedMessageHeader, Constants.dialogType.INFO, Dictionary.inlineMessages.nodeNotSelectedMessageDescription);
            this.nodeNotSelectedInlineMessage.attachTo(this.view.getUserMessagePlaceholder());
        },

        scopingPanelTabChange: function (index) {
            this.tabIndex = index;
        },

        /**
         * Handles incoming data from Scoping Panel interface
         *
         * @param {Object} data
         */
        handleNodeItemSelectEvent: function (data) {
            this.data = data;
            //Show container loader when there is change in scoping panel elements selection
            this.showLoadingIcon();
            this.resetWidgets();
            this.sortData = {};

            if (this.tabIndex === 1) {
                console.log("handleNodeItemSelectEvent Topology Tab");
            }

            // See if at least one item is selected in Scoping Panel
            if (data && data.networkObjects.length !== 0) {
                this.handleSelectionInTopologyAndSearchTabs(data.networkObjects);
            } else if (data && data.collections.length !== 0) {
                this.handleSelectionInCollectionsTab(data.collections);
            } else if (data && data.savedSearches.length !== 0) {
                this.handleSelectionInSavedSearchesTab(data.savedSearches);
            } else {
                if (this.tabNeAccount) {
                    this.tabNeAccount.detach();
                }
                this.managedNodes = [];
                this.unmanagedNodes = [];
                destroyWidgets.call(this, [this.errorInlineMessage, this.infoInlineMessage, this.tableNeAccountManaged, this.tableNeAccountUnmanaged, this.tabNeAccount]);
                this.getEventBus().publish('npamapp:updateActions', []);
                this.getEventBus().publish('npamapp:scopingPanelNoSelection');

                // When no items are selected in Scoping Panel
                this.nodeNotSelectedInlineMessage.attachTo(this.view.getUserMessagePlaceholder());
                this.hideContainerLoader();
            }
        },

        /**
         * GET NEAcccount and send event to Display Summary panel
         */
        neAccountSummaryTrigger: function () {
            var tableNeAccount;
            if (this.tabNeAccountSelectedId === 0) {
                tableNeAccount = this.tableNeAccountManaged;
            } else {
                tableNeAccount = this.tableNeAccountUnmanaged;
            }

            if ( tableNeAccount ) {
                var checkedRows = tableNeAccount.getCheckedRows();
                if ( checkedRows.length !== 0 ) {
                   if (checkedRows[0].status) {
                     var neName = checkedRows[0].neName;
                     NeAccountMgmtFacade.readNeAccountDetails(neName).
                          then(function (responseData) {
                       this.getEventBus().publish('npamapp:updateSummary', responseData );
                    }.bind(this))
                    .catch(displayInlineErrorMessage.bind(this));
                  } else {
                      this.getEventBus().publish('npamapp:updateSummary', [{"neName": checkedRows[0].neName}] );
                  }
                } else {
                    this.getEventBus().publish('npamapp:updateSummary', [] );
                }
            } else {
                this.getEventBus().publish('npamapp:updateSummary', [] );
            }
        },

       events: {
            showContainerLoader: 'container:loader',
            hideContainerLoader: 'container:loader-hide'
        },

        showLoadingIcon: function () {
            this.showContainerLoader();
            this.showLoaderText();
        },

        showLoaderText: function () {
            if (this.retryTimer) {
                clearTimeout(this.retryTimer);
            }
            this.retryTimer = setTimeout(function () {
                Container.getEventBus().publish(this.events.showContainerLoader, {content: Dictionary.loaderTextMsg});
            }.bind(this), 10000);
        },

        showContainerLoader: function () {
            Container.getEventBus().publish(this.events.showContainerLoader);
        },

        hideContainerLoader: function () {
            Container.getEventBus().publish(this.events.hideContainerLoader);
            if (this.retryTimer) {
                clearTimeout(this.retryTimer);
            }
        },

        resetWidgets: function () {
            if (this.nodeNotSelectedInlineMessage) {
                this.nodeNotSelectedInlineMessage.detach();
            }
        },

        // When network elements are selected under Topology tab in scoping panel
        handleSelectionInTopologyAndSearchTabs: function (selectedNetworkObjects) {
            var responseData;
            this.isCollection = false;
            this.isSavedSearch = false;
            this.collections = [];
            this.savedSearches = [];
            this.handleNodeSelect(selectedNetworkObjects);
        },

        handleNodeSelect: function (selectedNetworkObjects) {

            var promises = [];
            var i,j,chunk = 250;
            for (i=0,j=selectedNetworkObjects.length; i<j; i+=chunk) {
                promises.push(NeAccountMgmtFacade.getPosByIds(selectedNetworkObjects.slice(i,i+chunk)));
            }
            new Promise(function (resolve, reject) {
                Promise.all(promises).then(function (responseData) {
                    var NEList = [];
                    var neListInfo = [];

                    responseData.flat().forEach(function(element){
                        NEList.push(element.moName);
                        var neType = '';
                        if (element.attributes ) {
                            neType = element.attributes.neType;
                        }
                        neListInfo.push({'neName': element.moName, 'syncStatus':element.cmSyncStatus, "neType": neType});
                    }.bind(this));

                    getNEAccountTopologyForSelectedNodes.call(this, NEList ).
                        then(function (responseData) {
                        destroyWidgets.call(this, [this.errorInlineMessage, this.infoInlineMessage]);

                        var newResponseData = this.getNeAccountData(responseData);
                        this.neList = newResponseData;

                        // Add syncStatus and neType to NeList
                        this.neList.forEach(function (neEl) {
                            neListInfo.forEach(function (neInfoEl) {
                                if(neEl.neName===neInfoEl.neName) {
                                    neEl.syncStatus = neInfoEl.syncStatus;
                                    neEl.neType = neInfoEl.neType;
                                }
                            });
                        });

                        this.updateTable();
                        this.getEventBus().publish('npamapp:checkSummary');
                        this.hideContainerLoader();
                    }.bind(this))
                        .catch(displayInlineErrorMessage.bind(this));

                }.bind(this))
                    .catch(displayInlineErrorMessage.bind(this));
            }.bind(this));
        },

        handleCollectionSelect: function (selectedCollections) {
            getNEAccountTopologyForSelectedCollections.call(this, selectedCollections ).
                then(function (responseData) {
                    destroyWidgets.call(this, [this.errorInlineMessage, this.infoInlineMessage]);

                    this.neList = this.getNeAccountData(responseData);
                    this.updateTable();
                    this.getEventBus().publish('npamapp:checkSummary');
                    this.hideContainerLoader();
                }.bind(this))
                .catch(displayInlineErrorMessage.bind(this));
        },


        handleSavedSearchSelect: function (selectedSavedSearches) {
            getNEAccountTopologyForSelectedSavedSearches.call(this, selectedSavedSearches ).
            then(function (responseData) {
                destroyWidgets.call(this, [this.errorInlineMessage, this.infoInlineMessage]);

                this.neList = this.getNeAccountData(responseData);
                this.updateTable();
                this.getEventBus().publish('npamapp:checkSummary');
                this.hideContainerLoader();
            }.bind(this))
                .catch(displayInlineErrorMessage.bind(this));
        },

        getNeAccountData: function(responseData) {
            var newData = [];

            responseData.forEach(function (neEl) {
                var newNeEl =  {};
                newNeEl.neName = neEl.neName;
                newNeEl.neNpamStatus = neEl.neNpamStatus;
                newNeEl.neAccounts = [];

                var cbrsStatus, cbrsErrorDetails;

                neEl.neAccounts.forEach(function (neAccountEl) {
                    if(neAccountEl.id==="1") {
                        newNeEl.neAccounts.push( JSON.parse(JSON.stringify(neAccountEl)) );
                    } else if (neAccountEl.id==="2") {
                        cbrsStatus = neAccountEl.status;
                        cbrsErrorDetails = neAccountEl.errorDetails;
                    }
                });

                if ( newNeEl.neAccounts.length !== 0 ) {
                    if ( cbrsStatus === undefined ) {
                        newNeEl.neAccounts[0].cbrsStatus = "N/A";
                        if ( this.cbrsEnabled && newNeEl.neNpamStatus === 'MANAGED' )
                            newNeEl.neAccounts[0].cbrsErrorDetails = Dictionary.cbrsDisableWarningMsg;
                    } else {
                        newNeEl.neAccounts[0].cbrsStatus = cbrsStatus;
                        newNeEl.neAccounts[0].cbrsErrorDetails = cbrsErrorDetails;
                    }
                }
                newData.push(newNeEl);
            }.bind(this));
            return newData;
        },

        getTableSettings: function() {
            if (this.tableNeAccountManaged) {
                return this.tableNeAccountManaged.getTableSettings();
            }

             if (this.tableNeAccountUnmanaged) {
                return this.tableNeAccountUnmanaged.getTableSettings();
            }

        },

        updateTable: function(columns) {
            this.splitNeList();

            this.neListServiceType = "mixed_or_empty";
            if ( this.managedNodes.length > 0 && this.unmanagedNodes.length === 0 ) {
                this.neListServiceType = "managed"; // contains only managed
            } else if ( this.unmanagedNodes.length > 0 && this.managedNodes.length === 0 )  {
                this.neListServiceType = "unmanaged"; // contains only managed
            }
            this.getEventBus().publish('npamapp:scopingPanelSelectionDone', [], undefined, this.neListServiceType );

            if (!this.tableNeAccountManaged) {
                this.tableNeAccountManaged = new NeAccountTable({neList: this.managedNodes, eventBus: this.getEventBus(),
                                                                context: this.getContext(), dataServiceType: "managed",
                                                                npamEnabled: this.npamEnabled, cbrsEnabled: this.cbrsEnabled,
                                                                columns: columns});
            } else {
              this.tableNeAccountManaged.updateTable(this.managedNodes);
            }

            if (!this.tableNeAccountUnmanaged) {
                this.tableNeAccountUnmanaged = new NeAccountTable({neList: this.unmanagedNodes, eventBus: this.getEventBus(),
                                                                   context: this.getContext(), dataServiceType: "unmanaged",
                                                                   npamEnabled: this.npamEnabled, cbrsEnabled: this.cbrsEnabled,
                                                                   columns: columns});
            } else {
                this.tableNeAccountUnmanaged.updateTable(this.unmanagedNodes);
            }

            if (!this.tabNeAccount || (this.tabNeAccount && this.tabNeAccount.isDestroyed())) {
                 this.tabNeAccount = new Tabs({
                    showAddButton: false,
                    tabs: [
                        {title: Dictionary.regions.managedNE + " (" + this.managedNodes.length + ")", content: this.tableNeAccountManaged},
                        {title: Dictionary.regions.unmanagedNE + " (" + this.unmanagedNodes.length + ")", content: this.tableNeAccountUnmanaged }
                    ]});
                 this.tabNeAccountSelectedId = 0; //managed nodes
                 this.tabNeAccount.addEventHandler("tabselect", function(title, id){
                     this.tabNeAccountSelectedId = id;
                     this.getEventBus().publish("npamapp:checkSummary");

                     if (this.tabNeAccountSelectedId === 0) {
                         this.getEventBus().publish('npamapp:updateActions', this.tableNeAccountManaged.getCheckedRows(), "managed", this.neListServiceType);
                     } else {
                         this.getEventBus().publish('npamapp:updateActions', this.tableNeAccountUnmanaged.getCheckedRows(), "ummanaged", this.neListServiceType);
                     }    
                 }.bind(this));
                 this.tabNeAccount.attachTo(this.view.getNeAccountTabHolder());
            } else {
                this.tabNeAccount.setTabTitle(0, Dictionary.regions.managedNE + " (" + this.managedNodes.length + ")");
                this.tabNeAccount.setTabTitle(1, Dictionary.regions.unmanagedNE + " (" + this.unmanagedNodes.length + ")");
            }
        },

        splitNeList: function() {
            this.managedNodes = [];
            this.unmanagedNodes = [];
            var someNodesNotSupport = false;
            var someNodesHaveWarnings = false;

            this.neList.forEach(function(e) {
                var emptyNeAccount = {"neName": e.neName, "status": "N/A", "cbrsStatus": "N/A",
                                      "syncStatus": e.syncStatus, "neType": e.neType };
                if (e.neNpamStatus === "MANAGED") {
                    if (e.neAccounts.length > 0) {
                        e.neAccounts[0].syncStatus = e.syncStatus;
                        e.neAccounts[0].neType = e.neType;
                        e.neAccounts[0].lastUpdate = DateUtil.formatNpamDate(e.neAccounts[0].lastUpdate, true);
                        this.managedNodes.push(e.neAccounts[0]);

                        if ( this.npamEnabled ) {
                            e.neAccounts.forEach( function(el) {
                                if ( el.errorDetails !== undefined && el.errorDetails !== "" ) {
                                    if ( !el.errorDetails.toLowerCase().startsWith("error:")  ) {
                                        someNodesHaveWarnings = true;
                                    }
                                }

                                if ( el.cbrsErrorDetails !== undefined && el.cbrsErrorDetails !== "" ) {
                                     if ( !el.cbrsErrorDetails.toLowerCase().startsWith("error:")  ) {
                                         someNodesHaveWarnings = true;
                                     }
                                 }

                            });
                        }

                    } else {
                        // add warning icon when NE Account is not present and npam and remote management are enabled
                        if ( this.npamEnabled ) {
                            emptyNeAccount.errorDetails = Dictionary.missingNeAccountWarningMsg;
                            if ( this.cbrsEnabled ) {
                                emptyNeAccount.cbrsErrorDetails = Dictionary.missingCbrsWarningMsg;
                            }
                            someNodesHaveWarnings = true;
                        }
                        this.managedNodes.push(emptyNeAccount);
                    }                    
                } else if (e.neNpamStatus === "NOT_MANAGED"){
                    if (e.neAccounts.length > 0) {
                        e.neAccounts[0].syncStatus = e.syncStatus;
                        e.neAccounts[0].neType = e.neType;
                        e.neAccounts[0].lastUpdate = DateUtil.formatNpamDate(e.neAccounts[0].lastUpdate, true);
                        this.unmanagedNodes.push(e.neAccounts[0]);
                    } else {
                         this.unmanagedNodes.push(emptyNeAccount);
                    }

                    if ( this.npamEnabled ) {
                        e.neAccounts.forEach( function(el) {
                            if ( el.errorDetails !== undefined && el.errorDetails !== "" ) {
                                if ( !el.errorDetails.toLowerCase().startsWith("error:")  ) {
                                    someNodesHaveWarnings = true;
                                }
                            }
                        });
                    }
                } else {
                    someNodesNotSupport = true;
                }
            }.bind(this));

            var description = "";
            if (someNodesHaveWarnings && someNodesNotSupport) {
                description = Dictionary.inlineMessages.nodeNotSupportNPAM + "\n" + Dictionary.inlineMessages.nodeHasWarnings;
            } else if (someNodesHaveWarnings) {
                description = Dictionary.inlineMessages.nodeHasWarnings;
            } else if (someNodesNotSupport) {
                description = Dictionary.inlineMessages.nodeNotSupportNPAM;
            }
            if ( description !== "" ) {
                displayInlineInfoMessage.call(this, {"header": Dictionary.inlineMessages.nodeWarningHeader, "icon": "infoMsgIndicator", "description": description});
            }

        },
        
        getCollections: function() {
            if (this.isCollection) {
                return this.collections;
            }
            return [];
        },

        getSavedSearches: function () {
            if (this.isSavedSearch) {
                return this.savedSearches;
            }
            return [];
        },

        getManagedNodes: function() {
            return this.managedNodes;
        },

        getUnManagedNodes: function() {
            return this.unmanagedNodes;
        },

        // When collections are selected under Collections tab in scoping panel
        handleSelectionInCollectionsTab: function (selectedCollections) {
            this.isCollection = true;
            this.isSavedSearch = false;
            getCollectionNames(selectedCollections)
                .then(function (response) {
                    this.handleCollectionSelect(response);
                }.bind(this))
                .catch(displayInlineErrorMessage.bind(this));
            this.collections = selectedCollections;
        },

        // When saved searches are selected under SavedSearches tab in scoping panel
        handleSelectionInSavedSearchesTab: function (selectedSearches) {
            this.isSavedSearch = true;
            this.isCollection = false;
            getSearchQueryForSavedSearches(selectedSearches)
                .then(function (response) {
                    this.handleSavedSearchSelect(response);
                }.bind(this))
                .catch(displayInlineErrorMessage.bind(this));
            this.savedSearches = selectedSearches;
        },

        handleExportNEAccount: function(selectedNENamesUI) {
            var selectedNENames = [];
            if (selectedNENamesUI.length !== 0) {
                selectedNENamesUI.forEach(function(e) { selectedNENames.push(e.name);});
            }

            var exportContent = new ExportDialogContent({"all": (selectedNENames.length === 0)});

            var dialogWidget = new Dialog({
                header: Dictionary.export.exportHeader,
                content: exportContent,
                buttons: [{
                    caption: Dictionary.buttons.export,
                    color: 'darkBlue',
                    action: function() { dialogWidget.hide(); this.exportNEAccounts(exportContent.getFilename(), exportContent.getPasskey(), selectedNENames);}.bind(this),
                    enabled: false
                }, {
                    caption: Dictionary.buttons.cancel,
                    action: function () {
                        dialogWidget.hide();
                    }
                }]
            });

            exportContent.addEventHandler('valid', function(isValid) {
                var exportButton = dialogWidget.getButtons().find(function(e) {
                    if (e.options.caption === Dictionary.buttons.export) {
                        return e;
                    }
                });

                if (isValid === true) {
                    exportButton.enable();
                } else {
                    exportButton.disable();
                }
            }.bind(this));

            dialogWidget.show();
        },

        exportFailed: function(filename, xhr) {
            var errorMessage = StandardErrorMessagesUtil.getStandardErrorMessage(xhr.status);
            var displayErrorMessage = new DisplayMessage();

            var dialogWidget = new Dialog({
                header: errorMessage.header,
                content: displayErrorMessage,
                buttons: [{ caption: Dictionary.buttons.close,
                            action: function () {
                                dialogWidget.hide();
                            }
                         }]
            });
            dialogWidget.show();
            displayErrorMessage.showMessage( true, "", "error", errorMessage.description);
        },

        exportNEAccounts: function(filename, passkey, selectedNENames) {
            this.showLoadingIcon();
            NeAccountMgmtFacade.exportNeAccount(filename, passkey, selectedNENames,function(responseData, textStatus, request) {
                  exportSuccess.call(this, filename, responseData, request);
                  this.hideContainerLoader();
            }.bind(this),
               function(xhr) {
                   this.exportFailed(filename, xhr);
                   this.hideContainerLoader();
                }.bind(this)
            );
        },

        handleImportNEAccount: function() {
            var importContent = new ImportDialogContent();

            var dialogWidget = new Dialog({
                header: Dictionary.import.importHeader,
                content: importContent,
                buttons: [{
                    caption: Dictionary.buttons.import,
                    color: 'darkBlue',
                    action: function() {
                        dialogWidget.hide();
                        this.importNEAccounts(importContent.getFilename(), false);
                    }.bind(this),
                    enabled: false
                }, {
                    caption: Dictionary.buttons.cancel,
                    action: function () {
                        dialogWidget.hide();
                    }
                }]
            });

            importContent.addEventHandler('valid', function(isValid) {
                  var importButton = dialogWidget.getButtons().find(function(e) {
                      if (e.options.caption === Dictionary.buttons.import) {
                          return e;
                      }
                  });

                  if (isValid === true) {
                      importButton.enable();
                  } else {
                      importButton.disable();
                  }
              }.bind(this));
            dialogWidget.show();
        },

        importNEAccounts: function(filename, overwrite) {
            this.showLoadingIcon();
            NeAccountMgmtFacade.importNeAccount(filename, overwrite,
                function(responseData, textStatus, request) {
                    this.importSuccess(filename, responseData, textStatus, request);
                    this.hideContainerLoader();
                }.bind(this),
                function(msg, xhr) {
                    this.importFailed(filename, xhr);
                    this.hideContainerLoader();
                }.bind(this)
            );
        },

        importSuccess: function(filename, report, textStatus, request) {
            var displayMessage = new DisplayMessage();

            var dialogWidget = new Dialog({
                header: Dictionary.import.importSuccess,
                content: displayMessage,
                buttons: [{
                    caption: Dictionary.buttons.rotateNeAccount,
                    color: 'darkBlue',
                    action: function() {
                        dialogWidget.hide();
                        this.rotateCredentials(filename.name);
                    }.bind(this)
                }, {
                    caption: Dictionary.buttons.close,
                    action: function () {
                        dialogWidget.hide();
                    }
                }]
            });

            dialogWidget.show();
            var fileImportedStr = i18NumberUtil.printf(Dictionary.import.importedFile, filename.name );
            displayMessage.showMessage( true, Dictionary.import.rotateInfo, "tick", fileImportedStr);
        },

        rotateCredentials: function(filename) {
            window.location.hash = "npamapp/npamrotateneaccountjob?FileName="+filename;
        },

        importFailed: function(filename, xhr) {
            var internalErrorCode;
            var details = "";
            try {
                internalErrorCode = xhr.getResponseJSON().internalErrorCode;
                details = xhr.getResponseJSON().errorDetails.replace(/\n/g, "<br />");
            } catch(e) {
                //JSON parse error, this is not json (or JSON isn't in your browser)
                details = "";
            }

            var errorMessage = StandardErrorMessagesUtil.getStandardErrorMessage(xhr.getStatus(), internalErrorCode);
            var displayErrorMessage = new DisplayMessage();

            var buttonsActions = [];
            if ( internalErrorCode === 4424 ) { // File Already Exist
                buttonsActions.push({ caption: Dictionary.buttons.importOverwrite,
                                      header: errorMessage.header,
                                      color: 'darkBlue',
                                      action: function() {
                                                dialogWidget.hide();
                                                this.importNEAccounts(filename, true);
                                              }.bind(this)
                                    });
                details = Dictionary.import.overwriteConfirm;
            }
            buttonsActions.push({ caption: Dictionary.buttons.close,
                                  action: function () {
                                            dialogWidget.hide();
                                          }
                                });

            var dialogWidget = new Dialog({
                header: errorMessage.header,
                content: displayErrorMessage,
                buttons: buttonsActions
            });
            dialogWidget.show();
            displayErrorMessage.showMessage( true, details, "error", errorMessage.description);
        },

        updateColumns: function(columns) {
            this.getEventBus().publish('npamapp:updateActions', []);

            if (this.tableNeAccountManaged) {
                this.tableNeAccountManaged.destroy();
                this.tableNeAccountManaged = undefined;
            }

            if (this.tableNeAccountUnmanaged) {
                this.tableNeAccountUnmanaged.destroy();
                this.tableNeAccountUnmanaged = undefined;
            }

            if ( this.tabNeAccount ) {
               this.tabNeAccount.destroy();
               this.tabNeAccount = undefined;
            }
            this.updateTable(columns);
        }

    });

    function exportSuccess(filename, report, request) {
        if (!filename  || filename.length === 0) {
            console.log("no filename");
            filename = request.getResponseHeader('content-disposition').split('=')[1];
            filename = filename.slice(1, filename.length-1);
        }
        var anchor = document.createElement('a');

        anchor.setAttribute('href', window.URL.createObjectURL(report));
        anchor.setAttribute('download', filename);
        anchor.setAttribute('target', "_blank");
        anchor.click();

        anchor.remove();
    }

    /**
     * Fetches Collection objects for the requested Ids and gets
     * all nodes from the Collection objects.
     *
     * @param collectionIds
     * @return {Array} - List of collection objects.
     */
    function getCollectionNames(collectionIds) {
        var collectionNames = [];
        return TopologyCollectionsFacade.getCollections(collectionIds)
            .then(function (collections) {
                collections.forEach(function (obj) {
                    collectionNames.push(obj.name);
                });
                return collectionNames;
            });
    }

    /**
     * Fetches search queries for the requested saved search ids
     *
     * @param savedSearchIds
     * @return {Array} - List of search queries.
     */
    function getSearchQueryForSavedSearches(savedSearchIds) {
        var searchQueryNames = [];
        return TopologyCollectionsFacade.getSearchQueryForSavedSearches(savedSearchIds)
            .then(function (response) {
                response.forEach(function (obj) {
                    searchQueryNames.push(obj.name);
                });
                return searchQueryNames;
            });
    }

    /**
     * Fetches persistent objects for the requested search queries
     *
     * @param searchQueryList
     * @return {Array} - List of persistent objects.
     */
    function getPosForSearchQuery(searchQueryList) {
        var savedSearchesObjects = [];
        return ManagedObjectFacade.getPosForSearchQuery(searchQueryList)
            .then(function (savedSearches) {
                savedSearches.forEach(function (obj) {
                    savedSearchesObjects.push(obj);
                });
                return savedSearchesObjects;
            });
    }

    /**
     * Retrieves the PO Ids from a list of objects.
     * @param {objects} list of network and collection objects.
     */
    function retrievePoIds(objects) {
        /*jshint validthis: true */
        var poIdsList = [];
        objects.forEach(function (response) {
            response.forEach(function (obj) {
                poIdsList.push(obj.id);
            }.bind(this));
        }.bind(this));
        return poIdsList;
    }

    function getNEAccountTopologyForSelectedNodes(neList) {
        /*jshint validthis: true */
        if (neList.length > 1)
            this.nodesSelectedMoreThanOne = true;
        else
            this.nodesSelectedMoreThanOne = false;

        if ( this.debugMode ) {
            neList = ['all'];
        }
        return NeAccountMgmtFacade.readNeAccounts(neList, [], []);
    }

    function getNEAccountTopologyForSelectedCollections(collectionList) {
        return NeAccountMgmtFacade.readNeAccounts([], collectionList, []);
    }

    function getNEAccountTopologyForSelectedSavedSearches(savedSearchList) {
        return NeAccountMgmtFacade.readNeAccounts([], [], savedSearchList);
    }

    function displayInlineErrorMessage(responseBody) {
        /*jshint validthis: true */
        console.log(responseBody);
        destroyWidgets.call(this, [this.errorInlineMessage, this.infoInlineMessage, this.tableNeAccountManaged, this.tableNeAccountUnmanaged, this.tabNeAccount]);
        this.getEventBus().publish('npamapp:scopingPanelNoSelection');
        this.errorInlineMessage = createInlineMessage(responseBody.header, responseBody.icon, responseBody.description);
        this.errorInlineMessage.attachTo(this.view.getUserMessagePlaceholder());
        this.hideContainerLoader();
    }

    function displayInlineInfoMessage(message) {
        /*jshint validthis: true */
        console.log(message);
        if ( this.infoInlineMessage ) {
            this.infoInlineMessage.destroy();
        }
        this.infoInlineMessage = createInlineMessage(message.header, message.icon, message.description);
        this.infoInlineMessage.attachTo(this.view.getUserMessagePlaceholder());
        this.hideContainerLoader();
    }

    function createInlineMessage(header, icon, description) {
        return new InlineMessage({
            header: header,
            icon: icon,
            description: description
        });
    }

    function destroyWidgets(widgets) {
        /*jshint validthis: true */
        widgets.forEach(function (widget) {
            if (widget) {
                widget.destroy();
            }
        });
    }

});
