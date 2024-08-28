define([
    'jscore/core',
    './regions/mejobdetails/mejobdetails',
    'layouts/TopSection',
    'layouts/MultiSlidingPanels',
    'npamlibrary/Content',
    './Npamjobdetailsview',
    'widgets/Notification',
    'npamlibrary/tableSettings',
    './ext/mejobcolumns',
    'i18n!npamlibrary/dictionary.json',
    'npamlibrary/displaymessage',
    'npamlibrary/constants',
    'npamlibrary/serverDateUtil',
    'npamlibrary/sessionStorageUtil',
    'npamlibrary/InfoRegion',
    'jscore/ext/locationController',
    'container/api',
    "widgets/Button",
    'tablelib/Table'
], function (core, MeJobDetails, TopSection, MultiSlidingPanels, Content, View, Notification, TableSettings, Columns, libLanguage, DisplayMessage, Constants, ServerDateUtil, sessionStorageUtil, InfoRegion, LocationController, container, Button, Table) {
    return core.App.extend({
        appName: 'npamjobdetails',
        View: View,

        init: function () {
            this.inforegion = new InfoRegion({"isInfoMsg": true, "appName": this.options.properties.title});
            this.application = this.appName.split("/")[this.appName.split("/").length-1];
            this.displayErrorMessage = new DisplayMessage();
//            this.rightPanelClosedByUser = false;
        },

        onStart: function () {
            this.isNewId = true;
            this.subscribeEvents();
            this.startLocationController();
        },

//        rightPanelClosed: function () {
//            if ( !this.slidingPanels.isShown('right')) {
//                this.rightPanelClosedByUser = true;
//            } else {
//                this.rightPanelClosedByUser = false;
//            }
//            this.getEventBus().publish('panelClosedByUser', this.rightPanelClosedByUser);
//        },

        subscribeEvents: function () {
            this.getEventBus().subscribe("loadTableSettingEvent", this.setTableSettingContent.bind(this));
            this.getEventBus().subscribe("showNoneSelSettings", this.showNoneSelSettings.bind(this));
            this.getEventBus().subscribe("jobNotificationEvent", this.jobNotificationHandler.bind(this));
            this.getEventBus().subscribe("showTableSettings", this.showTableSettings.bind(this));
            this.getEventBus().subscribe("closeRightPanel", this.closeRightPanel.bind(this));
            this.getEventBus().subscribe('layouts:panelaction', this.panelEvents.bind(this));
            this.getEventBus().subscribe('errorMsgForDefaultCases', this.errorMsgForDefaultCases.bind(this));
//            this.getEventBus().subscribe("jobDetails:nodeConfigData", this.prepareData.bind(this));
//            this.getEventBus().subscribe('jobDetails:publishSummaryIcon', this.publishNodeConfigIcon.bind(this));
//            this.getEventBus().subscribe("jobDetails:removeSummaryIcon", this.destroyNodeConfigIcon.bind(this));
//            this.getEventBus().subscribe('layouts:rightpanel:afterchange', this.rightPanelClosed.bind(this));
        },

        showNoneSelSettings: function () {
            this.tableSettings = new TableSettings({context: this.getContext(), columns: Columns.getColumns(undefined, true), appName: this.application, tableId: "nodeProgressTable"});
            this.tableSettingContent = this.tableSettings;
        },

//        publishNodeConfigIcon: function(){
//            //Will publish job summary icon to right end of action bar
//            this.getEventBus().publish('topsection:right',this.nodeConfigurationIcon);
//            this.view.setJobSummaryIconAttr(libLanguage.get('nodeConfiguration'));
//        },
//
//        destroyNodeConfigIcon: function(){
//            //Will destroy job summary icon when row is selection is not 1
//            this.getEventBus().publish('topsection:right');
//        },

        jobNotificationHandler: function (status, message) {
            var icon, color;
            switch (status) {
                case "success":
                    icon = "tick";
                    color = "green";
                    break;
                case "warning":
                    icon = "warning";
                    color = "yellow";
                    break;
                default:
                    icon = "error";
                    color = "red";
            }
            var notification = new Notification({
                label: message,
                icon: icon,
                color: color,
                showCloseButton: true,
                showAsToast: true,
                autoDismiss: true,
                autoDismissDuration: 5000
            });
            notification.attachTo(this.view.getNotificationHolder());
        },

        showTableSettings: function (value) {
            if (value === true) {
                this.tableSettingContent = this.tableSettings;
                this.showSettings = true;
            }
            else {
                this.showSettings = false;
            }
        },

        closeRightPanel: function () {
            this.getEventBus().publish('layouts:closerightpanel');
        },

        panelEvents: function (value) {
            var isTableSettingShown = false;
            if (value === Constants.TABLESETTINGS) {
                if (this.showSettings) {
                    isTableSettingShown = true;
                     this.showFlyoutPanel(libLanguage.get('tableSettings'),this.tableSettingContent);
                     if(this.tableSettingContent.updateTableSettingsFromRegion){
                       this.tableSettingContent.updateTableSettingsFromRegion(Columns.getColumns());
                   }
                } else {
                    this.displayMessage = new DisplayMessage();
                    this.displayMessage.showMessage(false, libLanguage.get('noInfoMsg').replace("<replace>", libLanguage.get('tableSettings')));
                    this.showFlyoutPanel(libLanguage.get('tableSettings'),this.displayMessage);
                    this.tableSettingContent = this.displayMessage;
                }
            }
            this.meJobDetails.setIsTableSettingShown(isTableSettingShown);
        },

        showFlyoutPanel: function (header,content) {
            container.getEventBus().publish('flyout:show', {
                header: header,
                content: content
            });
        },

        startLocationController: function () {
            this.lc = new LocationController({
                namespace: this.options.namespace
            });
            this.lc.addLocationListener(this.onLocationChange.bind(this));
            this.lc.start();
        },

        /**
         * Location Controller listener.
         *
         * @method onLocationChange
         * @param {String} hash
         */
        onLocationChange: function (hash) {
            if (hash !== "") {
                var currentId = hash;
                if (hash.indexOf("joblogs") < 0) {
                    if (currentId.indexOf("/") > 0) {
                        this.ShowMsgForInvalidURL();
                    } else {
                        if (this.jobId === currentId) {
                            this.isNewId = false;
                        } else {
                            this.isNewId = true;
                        }
                        this.jobId = currentId;
                        this.instantiateServerDate();
                    }
                }
            } else {
                // If there's no ID in the URL, we need to inform the user of what went wrong.
                this.displayInfoRegion();
            }
            var attribute1 = ["comeFrom", this.appName];
            var attribute2 = ["navigateTo", this.appName + "/" + this.jobId];
            sessionStorageUtil.updateSessionStorage(attribute1, attribute2);
        },

        ShowMsgForInvalidURL: function () {
            this.destroySlidingPanels();
            this.destroyLayout();
            this.destroyTopSection();
            this.displayMessage = new DisplayMessage();
            this.displayMessage.showMessage(true, "", "dialogInfo", libLanguage.get('invalidURLMsg') + " " + libLanguage.get('view').toLowerCase() + " " + this.options.properties.title.toLowerCase());
            this.displayMessage.attachTo(this.view.getElement());
        },

        detachInvalidURLMsg: function () {
            if (this.displayMessage)
                this.displayMessage.detach();
        },

        instantiateServerDate: function () {
            // Instantiate ServerDate
            ServerDateUtil.init(this.instantiateCurrentUser.bind(this), this.showFailureMessage.bind(this));
        },

        instantiateCurrentUser: function () {
            sessionStorageUtil.getCurrentUser(this.loadApplication.bind(this), this.showFailureMessage.bind(this));
        },

        showFailureMessage: function (errorMessage) {
            this.detachInvalidURLMsg();
            if (errorMessage) {
                errorMessage.attachTo(this.view.getElement());
            }
        },

        loadApplication: function () {
            if (this.isNewId) {
                this.meJobDetails = this.getMeJobDetails();

            }
            this.tableSettings = new TableSettings({context: this.getContext(), columns: Columns.getColumns(), appName: this.application, tableId: "nodeProgressTable"});
            this.setTableSettingContent(false);
            this.meJobDetails.parseJobIdIntoRequest(this.jobId);
            this.displayJobDetailsRegion();
        },

        setTableSettingContent: function (value) {
            if (value) {
                this.tableSettingContent = this.tableSettings;
            } else {
                this.displayMessage = new DisplayMessage();
                this.displayMessage.showMessage(false, libLanguage.get('noInfoMsg').replace("<replace>", libLanguage.get('tableSettings')));
                this.tableSettingContent = this.displayMessage;
            }
        },

        getMeJobDetails: function () {
            return new MeJobDetails({
                header: this.options.properties.title,
                context: this.getContext(),
                appName: this.application,
                mainApp: this
            });
        },

        getPageHolder: function () {
            return this.getElement();
        },

        displayJobDetailsRegion: function () {
            this.detachInvalidURLMsg();
            if (this.isNewId) {
                this.destroySlidingPanels();
            }
            this.destroyTopSection();
            this.destroyLayout();
            if (this.isNewId) {
                this.slidingPanels = this.getSlidingPanels();
            }
            this.layout = this.getTopSection(true);
            this.layout.setContent(this.slidingPanels);
            this.layout.attachTo(this.getElement());
        },

        getSlidingPanels: function () {
            return new MultiSlidingPanels({
                context: this.getContext(),
                resizeable: true,
                showFlyoutInMobileMode: true,
                main: {
                    label: this.options.properties.title,
                    content: this.meJobDetails
                },
                rightWidth: 250
            });
        },

        getTopSection: function (actions) {
            this.options.breadcrumb[1].children = [];
            return new TopSection({
                context: this.getContext(),
                title: this.options.properties.title,
                breadcrumb: this.options.breadcrumb,
                defaultActions: (actions) ? this.getActions() : []
            });
        },

        getActions: function() {
            return [
                [{
                    type: 'button',
                    icon: Constants.icon.refresh,
                    name: "Refresh",
                    caption: libLanguage.get('contextActions.refresh'),
                    action: function () {
                        if (this.meJobDetails) {
                            this.meJobDetails.refreshNeJobDetails();
                        }
                    }.bind(this)
                }]
            ];
        },


        destroyTopSection: function () {
            if (this.topSection) {
                this.topSection.destroy();
            }
        },

        destroyLayout: function () {
            if (this.layout) {
                this.layout.destroy();
            }
        },

        destroySlidingPanels: function () {
            if (this.slidingPanels) {
                this.slidingPanels.destroy();
            }
        },

        displayInfoRegion: function () {
            this.detachInvalidURLMsg();
            this.destroySlidingPanels();
            this.destroyLayout();
            this.destroyTopSection();

            this.topSection = this.getTopSection();
            this.topSection.setContent(this.inforegion);
            this.topSection.attachTo(this.getElement());
        },

        onBeforeLeave: function (containerEvent) {
            if (containerEvent.type === "tabclose") {
                var attribute = ["comeFrom", this.appName];
                sessionStorageUtil.updateSessionStorage(attribute);
                sessionStorageUtil.removeUser();
            }
            return " ";
        },

        errorMsgForDefaultCases: function (errorBody) {
            this.destroyLayout();
            this.destroyTopSection();
            this.topSection = this.getTopSection();
            this.topSection.attachTo(this.getElement());
            var displayErrorMessage = new DisplayMessage();
            displayErrorMessage.showMessage(true, errorBody.body, "error", errorBody.title);
            this.topSection.setContent(displayErrorMessage);
        }

    });

});
