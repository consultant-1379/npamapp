/*******************************************************************************
 * COPYRIGHT Ericsson 2024
 *
 *
 *
 * The copyright to the computer program(s) herein is the property of
 *
 * Ericsson Inc. The programs may be used and/or copied only with written
 *
 * permission from Ericsson Inc. or in accordance with the terms and
 *
 * conditions stipulated in the agreement/contract under which the
 *
 * program(s) have been supplied.
 ******************************************************************************/

define([
    'jscore/core',
    'i18n!npamapp/dictionary.json',
    'i18n!npamlibrary/dictionary.json',
    'layouts/TopSection',
    'layouts/MultiSlidingPanels',
    'scopingpanel/ScopingPanel',
    'widgets/Tabs',
    './regions/main/Main',
    './widgets/dialogBox/PopupDialog',
    './ext/AccessControlFacade',
    './ext/NeAccountMgmtFacade',
    './ext/NpamConfigFacade',
    './ext/Constants',
    'widgets/Notification',
     'widgets/Dialog',
     './regions/summaryregion/SummaryRegion',
     'npamlibrary/constants',
     'npamlibrary/sessionStorageUtil',
     'npamlibrary/serverDateUtil'
], function (core, Dictionary, libLanguage, TopSection, MultiSlidingPanels, ScopingPanel, Tabs, Main, PopupDialog, AccessControlFacade, NeAccountMgmtFacade, NpamConfigFacade, Constants, Notification,
             Dialog, SummaryRegion, libraryConstants, sessionStorageUtil, ServerDateUtil) {
    //'use strict';

    return core.App.extend({
        onStart: function () {
            this.npamAppStatusOnResume = false;
            this.getServerTimeOffSet();
        },

        onResume: function() {
            this.npamAppStatusOnResume = true;
            this.npamManagementAccessControl.fetchAccessRights(this.onNpamManagementAccessRights.bind(this));
        },

        appName: libraryConstants.NEACCOUNTS_LINK.substring(1),

        handleAuthentication: function(){
            // Fetch restrictions based on the role.
            if (!this.npamManagementAccessControl) {
              this.npamManagementAccessControl = new AccessControlFacade();
            }
            this.npamManagementAccessControl.fetchAccessRights(this.onNpamManagementAccessRights.bind(this));
        },

        getServerTimeOffSet: function () {
            // Instantiate ServerDate
            ServerDateUtil.init(this.getCurrentUser.bind(this), this.showFailureMessage.bind(this));
        },

        getCurrentUser: function(){
            sessionStorageUtil.getCurrentUser(this.handleAuthentication.bind(this), this.showFailureMessage.bind(this));
        },

        showFailureMessage: function () {
            var dialogHeader, dialogContent, dialogOptionalContent, dialogType;

            dialogHeader = Dictionary.headers.rbacServerDownHeader;
            dialogContent = Dictionary.content.rbacServerDownContent;
            dialogOptionalContent = Dictionary.content.npamDisabledOptionalContent;
            dialogType = Constants.dialogType.ERROR;

            this.setOkDialog(dialogHeader, dialogContent, dialogOptionalContent, dialogType, function () {
                this.locationController.setLocation("#launcher");
            });
        },

       /**
         * Checks whether user can view NPAM application or not.
         * If user have access to view then getUserSettings method is invoked to fetch the user settings from presentation server
         * otherwise it displays a dialog saying user don't have rights to perform actions.
         */
        onNpamManagementAccessRights: function () {
            var userAccess = this.npamManagementAccessControl.isAllowed(Constants.npamManagementGui,'read');
            if (userAccess.hasRights) {
                if (!this.npamManagementNpamConfig) {
                  this.npamManagementNpamConfig = new NpamConfigFacade();
                }
                this.npamManagementNpamConfig.fetchAccess(this.onNpamManagementAccess.bind(this));
            } else {
                this.showRBACErrorDialog(userAccess);
            }
        },

        /**
         * Checks whether user can view NPAM application or not.
         * If user have access to view then getUserSettings method is invoked to fetch the user settings from presentation server
         * otherwise it displays a dialog saying user don't have rights to perform actions.
         */
        onNpamManagementAccess: function () {
            if (this.npamAppStatusOnResume) {
                this.npamDisableManagement();
                this.topSection.setBreadcrumb(this.breadcrumb);
                this.publishEventsToUpdateActionBar([]);
            } else {
              this.getUserSettings();
            }
        },

        /**
         * Displays a user access error dialog.
         */
        showRBACErrorDialog: function (userAccess) {
            var dialogHeader, dialogContent, dialogOptionalContent, dialogType;

            if (userAccess.status === Constants.authorizationResponse.UNAUTHORIZED) {
                dialogHeader = Dictionary.headers.accessDeniedHeader;
                dialogContent = Dictionary.content.accessDeniedContent;
                dialogOptionalContent = Dictionary.content.accessDeniedOptionalContent;
                dialogType = Constants.dialogType.ERROR;
            } else {
                dialogHeader = Dictionary.headers.rbacServerDownHeader;
                dialogContent = Dictionary.content.rbacServerDownContent;
                dialogOptionalContent = Dictionary.content.rbacServerDownOptionalContent;
                dialogType = Constants.dialogType.ERROR;
            }

            this.setOkDialog(dialogHeader, dialogContent, dialogOptionalContent, dialogType, function () {
                this.locationController.setLocation("#launcher");
            });

        },

        showNPAMErrorDialog: function (npamAccess) {
            var dialogHeader, dialogContent, dialogOptionalContent, dialogType;

            if (npamAccess.status === Constants.npamResponse.DISABLED) {
                dialogHeader = Dictionary.headers.npamDisableHeader;
                dialogContent = Dictionary.content.npamDisableContent;
                dialogOptionalContent = Dictionary.content.npamDisableOptionalContent;
                dialogType = Constants.dialogType.ERROR;
            } else {
                dialogHeader = Dictionary.headers.rbacServerDownHeader;
                dialogContent = Dictionary.content.rbacServerDownContent;
                dialogOptionalContent = Dictionary.content.rbacServerDownOptionalContent;
                dialogType = Constants.dialogType.ERROR;
            }
            this.setOkDialog(dialogHeader, dialogContent, dialogOptionalContent, dialogType, function () {
                this.locationController.setLocation("#launcher");
            });
        },

        setOkDialog: function (dialogHeader, dialogContent, dialogOptionalContent, dialogType, okCallBack) {
            var dialog = new PopupDialog();
            var dialogButtons = [
                {
                    caption: Dictionary.buttons.ok,
                    action: function () {
                        dialog.hideDialog();
                        okCallBack();
                    }.bind(this)
                }
            ];
            dialog.initDialog(dialogHeader, dialogContent, dialogOptionalContent, dialogType, dialogButtons);
        },

        /*
         * Fetch the user settings from the presentation server and apply the settings to UI (initializeUI)
         * Load the UI with default settings if there are no previously saved settings for the user or if the rest request fails to fetch the settings
          */
        getUserSettings: function () {
            this.initializeUI();
        },

        npamDisableManagement: function() {
            this.breadcrumb = JSON.parse(JSON.stringify(this.options.breadcrumb));
            this.breadcrumb[1].children = this.addRotateFile();
            if (!this.npamManagementNpamConfig.isAllowed("npam").hasRights) {
                this.breadcrumb[1].children = [];
                if (!this.npamNotification) {
                  this.npamNotification = new Notification({
                      label: Dictionary.inlineMessages.npamDisabledMessageHeader  + " - " +  Dictionary.inlineMessages.npamDisabledMessageDescription,
                      color: "paleBlue",
                      icon: "warning",
                      showAsToast: true,
                      autoDismiss: false
                  });
                }
                this.npamNotification.attachTo(this.getElement());
            } else {
                if (this.npamNotification) {
                    this.npamNotification.detach();
                }
            }
        },

        addRotateFile: function() {
            var newChildren = [];
            this.breadcrumb[1].children.forEach(function(e) {
                newChildren.push(e);
                if (e.name === libLanguage.get('RotateNeAccount')) {
                    newChildren.push({"name": libLanguage.get('RotateNeAccountFromFile'),
                                      "url": "#npamapp/npamrotateneaccountjob?FileName",
                                      "app": "npamrotateneaccountjob"});
                }
            });
            return newChildren;
        },

        /**
         * Initializes GUI for an authorized user.
         */
        initializeUI: function (userSettings) {
            this.visiblePanel = 'none';
            this.npamDisableManagement();
            this.noSelectionOnScopingPanel = true;

            this.topSection = new TopSection({
                breadcrumb: this.breadcrumb,
                title: this.options.properties.title,
                context: this.getContext()
            });

            this.scopingPanel = new ScopingPanel({
                context: this.getContext(),
                multiselect: true,

                multiSelectPerTab: {
                    TOPOLOGY: true,
                    SEARCH: true,
                    COLLECTIONS: true,
                    SAVED_SEARCHES: true
                },

                tabs: [
                    ScopingPanel.tabs.TOPOLOGY,
                    ScopingPanel.tabs.SEARCH,
                    ScopingPanel.tabs.COLLECTIONS,
                    ScopingPanel.tabs.SAVED_SEARCHES
                ],

                restrictions: {
                    nodeLevel: true,
                    neType: {
                        neTypes: ['RadioNode'],
                        filter: 'whitelist'
                    }
                },

                tabsOptions: {
                    topology: {
                        selection: {
                            collectionOfCollections: 'multi',
                            collectionOfObjects: 'multi',
                            networkObjects: 'multi',
                            combination: {
                                collections: true,
                                networkObject: true
                            }
                        }
                    }
                }
            });

            this.mainNeAccountRegion = new Main({ context: this.getContext(),
                                                  npamEnabled: this.npamManagementNpamConfig.isAllowed("npam").hasRights,
                                                  cbrsEnabled: this.npamManagementNpamConfig.isAllowed("cbrs").hasRights
                                                });

            // set the content:
            // in the left side the Scoping panel,
            // and the main part of the display set it to a region which contains the tabs and the tables
            this.multislidingpanelsNeAccounts = new MultiSlidingPanels({
                context: this.getContext(),
                leftWidth: 400,
                rightWidth: 360,
                resizeable: true,
                showFlyoutInMobileMode: true,
                resizeMode: MultiSlidingPanels.RESIZE_MODE.ON_DRAG,
                main: {
                    content: this.mainNeAccountRegion
                },
                left: [
                    {
                        label: Dictionary.regions.scopingpanel,
                        value: 'topology',
                        icon: 'topology',
                        expanded: true,
                        content: this.scopingPanel
                    }
                ],
                right: [{
                    label: Dictionary.regions.summary,
                    icon: 'info',
                    value: "summary",
                    type: 'external'
                }]
            });

            this.topSection.setContent(this.multislidingpanelsNeAccounts);
            this.topSection.attachTo(this.getElement());
            this.publishEventsToUpdateActionBar([]);
            this.subscribeForEvents();
        },

         /**
         * Publishes events that will trigger the update of the action bar to add / remove buttons related to context
         * actions defined in {@link getContextActions} if selection exists.
         * actions defined in {@link getExportContextAction} if there is no selection.
         *
         * @param selectedRows the rows selected in the table.
         */
        publishEventsToUpdateActionBar: function (selectedRows, dataServiceType, neServiceType) {
            /*jshint validthis:true */
            if (selectedRows.length > 0 ) {
                this.getEventBus().publish('topsection:contextactions', getContextActions.call(this, selectedRows, dataServiceType, neServiceType));
             } else {
                this.getEventBus().publish('topsection:leavecontext');
                this.getEventBus().publish('topsection:defaultactions', getContextActions.call(this, selectedRows, dataServiceType, neServiceType));
            }
        },

          /**
          * Publishes events that will trigger the update of the Summary
          *
          * @param selectedRows the rows selected in the table.
          */
         publishEventsToUpdateSummary: function (data) {
            if ( this.multislidingpanelsNeAccounts.isShown('right') ) {
                if ( this.visiblePanel === 'SummaryRegion') {
                    // summary panel is open and the user clicked on another NE Account
                    this.getEventBus().publish("summaryregion:update", data);
                }
            } else {
                if ( this.visiblePanel === 'inProgress' ) {
                    this.visiblePanel = 'SummaryRegion';
                    this.getEventBus().publish('layouts:showpanel', getneAccountSummary.call(this, data));
                }
            }
        },

        subscribeForEvents: function () {
            this.getEventBus().subscribe('npamapp:scopingPanelNoSelection', function () {
                this.noSelectionOnScopingPanel = true;
                this.getEventBus().publish('topsection:defaultactions', getContextActions.call(this, []));
                if (this.multislidingpanelsNeAccounts.isShown('right')) {
                    if (this.visiblePanel === 'SummaryRegion') {
                        this.visiblePanel = 'none';
                        this.getEventBus().publish('layouts:closerightpanel');
                    }
                }
            }.bind(this));

            this.getEventBus().subscribe('npamapp:scopingPanelSelectionDone', function (rows, dataServiceType, neServiceType) {
                this.noSelectionOnScopingPanel = false;
                this.getEventBus().publish('topsection:defaultactions',
                                   getContextActions.call(this, rows, dataServiceType, neServiceType));
            }.bind(this));

            this.getEventBus().subscribe("npamapp:updateActions", this.publishEventsToUpdateActionBar.bind(this));
            this.getEventBus().subscribe("npamapp:updateSummary", this.publishEventsToUpdateSummary.bind(this));

            this.getEventBus().subscribe("npamapp:checkSummary", function() {
               if (this.multislidingpanelsNeAccounts.isShown('right')) {
                   if (this.visiblePanel === 'SummaryRegion' || this.visiblePanel === 'inProgress') {
                       this.getEventBus().publish('action:viewSummary');
                   }
               }
            }.bind(this));

            this.getEventBus().subscribe('layouts:panelaction', function (value) {
                if ( value==="summary" ) {
                    if (this.multislidingpanelsNeAccounts.isShown('right')) {
                        if (this.visiblePanel === 'SummaryRegion') {
                          this.visiblePanel = 'none';
                          this.getEventBus().publish('layouts:closerightpanel');
                        } else {
                          this.getEventBus().publish('action:viewSummary');
                        }
                    } else {
                        this.visiblePanel = 'inProgress';
                        this.getEventBus().publish('action:viewSummary' );
                    }
                } else if (value === libraryConstants.TABLESETTINGS) {
                    this.getEventBus().publish('layouts:showpanel', getneSettings.call(this));
                }
            }.bind(this));
        }
    });

    /**
     * Provides the context actions which generate the context menu options when a row in the table is right clicked,
     * and adds buttons to the action bar when a row in a table is selected.
     *
     * @returns an array of objects representing the context actions.
     */
    function getContextActions(selectedRows, dataServiceType, neServiceType) {
        /*jshint validthis:true */
        var actions = [];
        var attribute1 = [];
        var attribute2 = [];
        var npamaccess = this.npamManagementNpamConfig.isAllowed("npam").hasRights;

        if (selectedRows.length === 0) {
            attribute1 = ["selectedNodes", []];
            attribute2 = ["nodes", []];
            sessionStorageUtil.updateSessionStorage(attribute1, attribute2);

            if (this.npamManagementAccessControl.isAllowed(Constants.npamManagementJob,'create').hasRights) {
                if ( this.noSelectionOnScopingPanel ) {
                    actions.push(createDefaultCreateJobsActions.call(this, npamaccess));
                } else {
                    actions.push(createCreateJobsActions.call(this, npamaccess, neServiceType));
                }
            }

            if (this.npamManagementAccessControl.isAllowed(Constants.npamManagementJob,'read').hasRights) {
                actions.push(createContextAction(libLanguage.get('contextActions.viewJobs'), null, viewJobsHandler.bind(this), npamaccess));
            }

            if (this.npamManagementAccessControl.isAllowed(Constants.npamManagementImport,'execute').hasRights) {
                actions.push(createContextAction(libLanguage.get('contextActions.import'), Constants.icon.import, importHandler.bind(this), npamaccess));
            }

            if (this.npamManagementAccessControl.isAllowed(Constants.npamManagementExport,'execute').hasRights) {
                actions.push(createContextAction(libLanguage.get('contextActions.exportAll'), Constants.icon.export, exportHandler.bind(this), true));
            }

            if ( this.options.properties.debugMode ) {
                actions.push(createContextAction("Enable All nodes", null, function(){ this.getEventBus().publish('npamapp:test_allnodes_on' ); }.bind(this), true));
                actions.push(createContextAction("Disable All nodes", null, function(){ this.getEventBus().publish('npamapp:test_allnodes_off' ); }.bind(this), true));
            }

        } else {
            var selectedNENames = [];
            var hasWarning = getSummaryWarnings.call( this, selectedRows, this.npamManagementNpamConfig.isAllowed("npam").hasRights, true );
            selectedRows.forEach(function(e) {
                selectedNENames.push(getSelectedNE.call(this, e));
            });

            attribute1 = ["selectedNodes", selectedNENames];
            attribute2 = ["nodes", selectedNENames];
            sessionStorageUtil.updateSessionStorage(attribute1, attribute2);

            var attribute3 = ["collections", []];
            var attribute4 = ["savedSearches", []];
            sessionStorageUtil.updateSessionStorage(attribute3, attribute4);

            if ( dataServiceType === "managed" ) {
                if (this.npamManagementAccessControl.isAllowed(Constants.npamManagementJob,'create').hasRights) {
                    actions.push(createContextAction(libLanguage.get('contextActions.detachNeAccountJobBtn'), null, detachNeAccountsJobHandler.bind(this), npamaccess));
                    actions.push(createContextAction(libLanguage.get('contextActions.rotateNeAccountJobBtn'), null, rotateNeAccountsJobHandler.bind(this), npamaccess));
                    if ( hasWarning )
                        actions.push(createContextAction(libLanguage.get('contextActions.checkNeAccountConfigJob'), null, checkNeAccountConfigJobHandler.bind(this) , npamaccess));
                }

                if (this.npamManagementAccessControl.isAllowed(Constants.npamManagementExport,'execute').hasRights) {
                    actions.push(createContextAction(libLanguage.get('contextActions.export'), Constants.icon.export, exportHandler.bind(this), true));
                }

            } else {
                if (this.npamManagementAccessControl.isAllowed(Constants.npamManagementJob,'create').hasRights) {
                    actions.push(createContextAction(libLanguage.get('contextActions.createNeAccountJob'), null, createNeAccountsJobHandler.bind(this), npamaccess));
                    if ( hasWarning )
                        actions.push(createContextAction(libLanguage.get('contextActions.checkNeAccountConfigJob'), null, checkNeAccountConfigJobHandler.bind(this) , npamaccess));
                }
            }
        }
        actions.push(createContextAction(libLanguage.get('contextActions.refresh'), Constants.icon.refresh, function() {this.mainNeAccountRegion.refreshNeAccountTable();}.bind(this), true));
        return actions;
    }

    function createDefaultCreateJobsActions(enabled) {
        return {
            type: 'dropdown',
            options: {
                caption: libLanguage.get('contextActions.createJob'),
                color: "blue",
                items: [
                    {type: 'separator'},
                    createContextAction(libLanguage.get('contextActions.rotateImportFileJob'), null, rotateImportFileJobHandler.bind(this), enabled)
                ],
                enabled: enabled
            }
        };
    }

    function createCreateJobsActions(enabled, neServiceType) {
        var menuItems = [];

        if ( neServiceType === 'managed') {
            return {
                type: 'dropdown',
                options: {
                    caption: libLanguage.get('contextActions.createJob'),
                    color: "blue",
                    items: [
                        {type: 'separator'},
                        createContextAction(libLanguage.get('contextActions.detachNeAccountJob'), null, detachNeAccountsJobHandler.bind(this), enabled),
                        createContextAction(libLanguage.get('contextActions.rotateNeAccountJob'), null, rotateNeAccountsJobHandler.bind(this), enabled),
                        createContextAction(libLanguage.get('contextActions.rotateImportFileJob'), null, rotateImportFileJobHandler.bind(this), enabled)
                    ],
                    enabled: enabled
                }
            };
        } else if ( neServiceType === 'unmanaged') {
            return {
                type: 'dropdown',
                options: {
                    caption: libLanguage.get('contextActions.createJob'),
                    color: "blue",
                    items: [
                        {type: 'separator'},
                        createContextAction(libLanguage.get('contextActions.createNeAccountJob'), null, createNeAccountsJobHandler.bind(this), enabled),
                        createContextAction(libLanguage.get('contextActions.rotateImportFileJob'), null, rotateImportFileJobHandler.bind(this), enabled)
                    ],
                    enabled: enabled
                }
            };
        }

        // neServiceType === 'mixed_or_empy'
        return {
            type: 'dropdown',
            options: {
                caption: libLanguage.get('contextActions.createJob'),
                color: "blue",
                items: [
                    {type: 'separator'},
                    createContextAction(libLanguage.get('contextActions.createNeAccountJob'), null, createNeAccountsJobHandler.bind(this), enabled),
                    createContextAction(libLanguage.get('contextActions.detachNeAccountJob'), null, detachNeAccountsJobHandler.bind(this), enabled),
                    createContextAction(libLanguage.get('contextActions.rotateNeAccountJob'), null, rotateNeAccountsJobHandler.bind(this), enabled),
                    createContextAction(libLanguage.get('contextActions.rotateImportFileJob'), null, rotateImportFileJobHandler.bind(this), enabled)
                ],
                enabled: enabled
            }
        };
    }

    /**
     * Function to launch export application which generates the enc file for the exported content in encryption mode
     */
    function exportHandler() {
        var selectedNENames = sessionStorageUtil.getSessionStorageAttribute("selectedNodes");

        this.mainNeAccountRegion.handleExportNEAccount(selectedNENames);
    }

    /**
     * Function to launch import application which download a CSV file
     */
    function importHandler() {
        this.mainNeAccountRegion.handleImportNEAccount();
    }

   /**
    * Function to launch Create NE Accounts Job application
    */
    function createNeAccountsJobHandler() {
        var comeFrom = ["comeFrom", this.appName];
        var navigateTo = sessionStorageUtil.getSessionStorageAttribute("navigateTo");
        sessionStorageUtil.updateSessionStorage(comeFrom, navigateTo);

        var selectedNENames = sessionStorageUtil.getSessionStorageAttribute("selectedNodes");
        if (selectedNENames.length === 0) {
            var selectedCollections = this.mainNeAccountRegion.getCollections();
            var selectedSavedSearches = this.mainNeAccountRegion.getSavedSearches();
            sessionStorageUtil.updateSessionStorage(["collections", selectedCollections], ["savedSearches", selectedSavedSearches]);

            if (selectedCollections.length === 0  && selectedSavedSearches.length === 0) {
                this.mainNeAccountRegion.getUnManagedNodes().forEach(function (e) {
                    selectedNENames.push(getSelectedNE.call(this, e));
                });
                var attribute1 = ["selectedNodes", selectedNENames];
                var attribute2 = ["nodes", selectedNENames];
                sessionStorageUtil.updateSessionStorage(attribute1, attribute2);
            }
        }
        window.location.hash = "npamapp/npamcreateneaccountjob";
    }

    /**
    * Function to launch Detach NE Accounts Job application
    */
    function detachNeAccountsJobHandler() {
        var comeFrom = ["comeFrom", this.appName];
        var navigateTo = sessionStorageUtil.getSessionStorageAttribute("navigateTo");
        sessionStorageUtil.updateSessionStorage(comeFrom, navigateTo);

        var selectedNENames = sessionStorageUtil.getSessionStorageAttribute("selectedNodes");
        if (selectedNENames.length === 0) {
            var selectedCollections = this.mainNeAccountRegion.getCollections();
            var selectedSavedSearches = this.mainNeAccountRegion.getSavedSearches();
            sessionStorageUtil.updateSessionStorage(["collections", selectedCollections], ["savedSearches", selectedSavedSearches]);

            if (selectedCollections.length === 0  && selectedSavedSearches.length === 0) {
                this.mainNeAccountRegion.getManagedNodes().forEach(function(e) {
                    selectedNENames.push(getSelectedNE.call(this, e));
                });
                var attribute1 = ["selectedNodes", selectedNENames];
                var attribute2 = ["nodes", selectedNENames];
                sessionStorageUtil.updateSessionStorage(attribute1, attribute2);
            }
        }
        window.location.hash = "npamapp/npamdeleteneaccountjob";
    }

    /**
    * Function to launch Rotate Job application
    */
    function rotateNeAccountsJobHandler() {
      var comeFrom = ["comeFrom", this.appName];
      var navigateTo = sessionStorageUtil.getSessionStorageAttribute("navigateTo");
      sessionStorageUtil.updateSessionStorage(comeFrom, navigateTo);

      var selectedNENames = sessionStorageUtil.getSessionStorageAttribute("selectedNodes");
      if (selectedNENames.length === 0) {
          var selectedCollections = this.mainNeAccountRegion.getCollections();
          var selectedSavedSearches = this.mainNeAccountRegion.getSavedSearches();
          sessionStorageUtil.updateSessionStorage(["collections", selectedCollections], ["savedSearches", selectedSavedSearches]);

          if (selectedCollections.length === 0  && selectedSavedSearches.length === 0) {
              this.mainNeAccountRegion.getManagedNodes().forEach(function (e) {
                  selectedNENames.push(getSelectedNE.call(this, e));
              });
              var attribute1 = ["selectedNodes", selectedNENames];
              var attribute2 = ["nodes", selectedNENames];
              sessionStorageUtil.updateSessionStorage(attribute1, attribute2);
          }
      }
      window.location.hash = "npamapp/npamrotateneaccountjob";
    }

    /**
     * Function to launch Create NE Accounts Job application
     */
     function checkNeAccountConfigJobHandler() {
         var comeFrom = ["comeFrom", this.appName];
         var navigateTo = sessionStorageUtil.getSessionStorageAttribute("navigateTo");
         sessionStorageUtil.updateSessionStorage(comeFrom, navigateTo);

         var selectedNENames = sessionStorageUtil.getSessionStorageAttribute("selectedNodes");
         if (selectedNENames.length === 0) {
             var selectedCollections = this.mainNeAccountRegion.getCollections();
             var selectedSavedSearches = this.mainNeAccountRegion.getSavedSearches();
             sessionStorageUtil.updateSessionStorage(["collections", selectedCollections], ["savedSearches", selectedSavedSearches]);

             if (selectedCollections.length === 0  && selectedSavedSearches.length === 0) {
                 this.mainNeAccountRegion.getManagedNodes().forEach(function (e) {
                     selectedNENames.push(getSelectedNE.call(this, e));
                 });
                 this.mainNeAccountRegion.getUnManagedNodes().forEach(function (e) {
                     selectedNENames.push(getSelectedNE.call(this, e));
                 });
                 var attribute1 = ["selectedNodes", selectedNENames];
                 var attribute2 = ["nodes", selectedNENames];
                 sessionStorageUtil.updateSessionStorage(attribute1, attribute2);
             }
         }
         window.location.hash = "npamapp/npamcheckneaccountconfigjob";
     }

    /**
    * Function to launch Rotate Import File Job application
    */
    function rotateImportFileJobHandler() {
      var comeFrom = ["comeFrom", this.appName];
      var navigateTo = sessionStorageUtil.getSessionStorageAttribute("navigateTo");
      sessionStorageUtil.updateSessionStorage(comeFrom, navigateTo);

      window.location.hash = "npamapp/npamrotateneaccountjob?FileName";
    }

    /**
    * Function to launch View Jobs application
    */
    function viewJobsHandler() {
        window.location.hash = "npamapp/npamjob";
    }

    function createContextAction(name, icon, action, enabled) {
        var contextAction = {
            name: name,
            type: 'button',
            flat: false,
            action: action,
            disabled: !enabled
        };

        if ( icon ) {
            contextAction.icon = icon;
        }
        return contextAction;
    }

   function showMessageDialog(message) {
       if (this.exportDialog) {
           this.exportDialog.destroy();
       }
       this.exportDialog = new Dialog({
           header: "TEST",
           content: message,
           type: Constants.dialogType.WARNING,
           buttons: [
               {
                   caption: Dictionary.buttons.close, action: function () {
                       this.exportDialog.hide();
                   }.bind(this)
               }
           ],
           visible: true
       });
   }

    function getneAccountSummary(neAccountData) {
        return  {
           side: 'right',
           header: Dictionary.regions.summary,
           content: new SummaryRegion({
                    context: this.getContext(),
                    data: neAccountData
            }),
            value: 'summaryregion'
       };
    }

    function getneSettings() {
        return  {
           side: 'right',
           header: libLanguage.get('tableSettings'),
           content: this.mainNeAccountRegion.getTableSettings(),
            value: libraryConstants.TABLESETTINGS
       };
    }

    function getSelectedNE(node) {
        var nodeJson = {"name": node.neName, 'networkElementFdn': "NetworkElement="+node.neName,
                "syncStatus": node.syncStatus, "neType": node.neType };
        return nodeJson;

    }

    function getSummaryWarnings( selectedRows, npamEnabled, bErrors ) {
        if ( npamEnabled === false ) {
            return false;
        }

        var results = false;
        selectedRows.forEach(function(e) {
            if ( e.errorDetails !== undefined && e.errorDetails !== "" ) {
                if ( e.errorDetails.toLowerCase().startsWith("error:")  ) {
                    if ( bErrors ) {
                        results = true;
                    }
                } else {
                    results = true;
                }
            }

            if ( e.cbrsErrorDetails !== undefined && e.cbrsErrorDetails !== "" ) {
                if ( e.cbrsErrorDetails.toLowerCase().startsWith("error:") ) {
                    if ( bErrors ) {
                        results = true;
                    }
                } else {
                    results = true;
                }
            }

        });
        return results;
    }
});
