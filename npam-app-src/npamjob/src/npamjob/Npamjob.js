define([
    'jscore/core',
    'layouts/TopSection',
    'layouts/MultiSlidingPanels',
    './regions/jobdetails/jobdetails',
    './widgets/jobconfigurationdetails/jobconfigurationdetails',
    './Npamjobview',
    "widgets/Notification",
    "widgets/Button",
    "npamlibrary/accessdenied",
    'jscore/ext/locationController',
    "npamlibrary/Content",
    "npamlibrary/tableSettings",
    './regions/jobdetails/columns',
    'npamlibrary/columnsUtil',
    'i18n!npamjob/dictionary.json',
    'i18n!npamlibrary/dictionary.json',
    'npamlibrary/constants',
    'npamlibrary/messageUtil',
    'npamlibrary/displaymessage',
    'npamlibrary/serverUtil',
    'npamlibrary/serverDateUtil',
    'npamlibrary/sessionStorageUtil',
    './widgets/jobnodedetails/jobnodedetails',
    "widgets/Tabs",
    "npamlibrary/restUrls",
    "npamlibrary/npamCommonUtil",
    "container/api",
    'widgets/Dialog'
], function (core, TopSection, MultiSlidingPanels, JobDetails, JobConfigurationDetails, View, Notification,Button, AccessDeniedDialog,
             LocationController, Content, TableSettings, Columns, columnsUtil, language, libLanguage, Constants, MessageUtil,
             DisplayMessage, ServerUtil, ServerDateUtil, sessionStorageUtil, JobNodeDetails, Tabs, RestUrls,
             npamCommonUtil, container, Dialog) {
    return core.App.extend({
        View: View,
        appName: "npamapp/npamjob",

        init: function (options) {
            this.accessDeniedDialog = new AccessDeniedDialog();
            this.options = options;

            this.locationController = new LocationController({
                namespace: this.appName
            });

            this.displayMessage = new DisplayMessage();
            this.rightPanelClosedByUser = false;
        },

//        getColumnsFromResponse: function (response, sortBy, orderBy) {
//            this.tableSettings = new TableSettings({context: this.getContext(), columns: columnsUtil.getColumnsFromResponseObject(response.columns, response.result, sortBy, orderBy, true), appName: this.appName, tableId: "jobsTable"});
//        },
//
//        noneSelected: function (columns) {
//            this.tableSettings = new TableSettings({context: this.getContext(), columns: columnsUtil.makeInVisibleAllColumns(columns),appName: this.appName, tableId: "jobsTable"});
//        },

        onStart: function () {
            this.isServerTimeOffSet = true;
            this.loadApplication();
            this.getServerTimeOffSet();
        },

        getServerTimeOffSet: function () {
            // Instantiate ServerDate
            ServerDateUtil.init(this.getCurrentUser.bind(this), this.showFailureMessage.bind(this));
        },

        getCurrentUser: function(){
            sessionStorageUtil.getCurrentUser(this.onAppCalled.bind(this), this.showFailureMessage.bind(this));
        },

        showFailureMessage: function(errorMessage){
            this.isServerTimeOffSet = false;
            this.errorMessage = errorMessage;
            if (errorMessage) {
                errorMessage.attachTo(this.jobDetails.view.getErrorMessageHolder());
            }
        },

        loadApplication: function () {
            this.getElement().setStyle({
                position: 'relative',
                width: '100%',
                height: '100%'
            });
            if(this.layout) {
                this.layout.destroy();
            }
            this.layout = this.getTopSection(true);

            var jobConfigurationDetails = new JobConfigurationDetails({
                header: libLanguage.get('jobSummary'),
                context: this.getContext(),
                eventBus: this.getEventBus()
            });

            this.jobNodeDetails = new JobNodeDetails({
                header: libLanguage.get('jobSummary'),
                context: this.getContext(),
                eventBus: this.getEventBus()
            });

            this.rightContent = new Content();

            this.jobSummaryTabs = new Tabs({
                enabled: true,
                maxTabs: 2,
                tabs: [
                    {   title: language.get('jobConfigDetails'), content: jobConfigurationDetails },
                    {   title: language.get('nodeDetails'), content: this.jobNodeDetails }
                ]
            });

            this.rightContent.setBody(this.jobSummaryTabs);

            this.jobDetails = new JobDetails({
                context: this.getContext(),
                pageHolder: this.getPageHolder()
            });

            this.slidingPanels = this.getMultiSlidingPanel(true);
            this.layout.setContent(this.slidingPanels);
            this.layout.attachTo(this.getElement());
            this.locationController.start();
            this.subscribeForEvents();
            this.tableSettings = new TableSettings({context: this.getContext(), columns: Columns.getColumns(), appName: this.appName, tableId: "jobsTable"});            
            this.setTableSettingContent(false);
        },

        getMultiSlidingPanel: function(value) {
            return  new MultiSlidingPanels({
                context: this.getContext(),
                rightWidth: 350,
                resizeable: true,
                showFlyoutInMobileMode: true,
                resizeMode: MultiSlidingPanels.RESIZE_MODE.ON_DRAG,
                main: {
                    label: libLanguage.get('jobs'),
                    content: this.jobDetails
                },
                right:[
                    {
                        label: libLanguage.get('jobSummary'),
                        value: Constants.JOBSUMMARY,
                        icon: 'info',
                        content: this.rightContent,
                        expanded: value
                    }
                ]
            });
        },

        getPageHolder: function () {
            return this.getElement();
        }, 

        showNoneSelSettings: function () {
            this.tableSettings = new TableSettings({context: this.getContext(), columns: Columns.getColumns(undefined, true), appName: this.appName, tableId: "jobsTable"});
            this.tableSettingContent = this.tableSettings;
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

        subscribeForEvents: function () {
            this.getEventBus().subscribe("jobNotificationEvent", this.jobNotificationHandler.bind(this));
            this.getEventBus().subscribe("showTableSettings", this.showTableSettings.bind(this));
            this.getEventBus().subscribe("deleteJobsEvent", this.showLoadingAnimation.bind(this));
            this.getEventBus().subscribe("deleteJobsCompleteEvent", this.hideLoadingAnimation.bind(this));
            this.getEventBus().subscribe('layouts:panelaction', this.panelEvents.bind(this));
            this.getEventBus().subscribe('layouts:rightpanel:afterchange', this.rightPanelClosed.bind(this));
            this.getEventBus().subscribe("showNoneSelSettings", this.showNoneSelSettings.bind(this));
            this.getEventBus().subscribe("loadTableSettingEvent", this.setTableSettingContent.bind(this));
            this.getEventBus().subscribe("updatecolumns", this.updateColumns.bind(this));
            this.getEventBus().subscribe("noColSelected", this.updateColumns.bind(this));
        },

        rightPanelClosed: function () {
            if (!this.slidingPanels.isShown('right') ) {
                this.rightPanelClosedByUser = true;
            } else {
                this.rightPanelClosedByUser = false;
            }
        },

        updateColumns: function(columns) {
            this.setColumns = columns;
        },

        panelEvents: function (value) {
            var isTableSettingShown = false;
            if (value === Constants.TABLESETTINGS) {
                if (this.showSettings) {
                    isTableSettingShown = true;
                    this.showFlyoutPanel(libLanguage.get('tableSettings'),this.tableSettingContent);
                    if(this.tableSettingContent.updateTableSettingsFromRegion && this.setColumns){
                        this.tableSettingContent.updateTableSettingsFromRegion(Columns.getColumns());
                    }
                } else {
                    this.displayMessage.showMessage(false, libLanguage.get('noInfoMsg').replace("<replace>", libLanguage.get('tableSettings')));
                    this.showFlyoutPanel(libLanguage.get('tableSettings'), this.displayMessage);
                }
            } else if (value === Constants.JOBSUMMARY) {
                this.loadRightPanel(libLanguage.get('jobSummary'), this.jobSummaryTabs);
            }
            this.jobDetails.setIsTableSettingShown(isTableSettingShown);
        },

        showFlyoutPanel: function (header,content) {
            container.getEventBus().publish('flyout:show', {
                header: header,
                content: content
            });
        },

        loadRightPanel: function (header, content) {
            this.getEventBus().publish('layouts:showpanel', {
                header: header,
                content: content,
                side: 'right'
            });
        },

        onBeforeLeave: function (containerEvent) {
            if (containerEvent.type === "tabclose") {
                sessionStorageUtil.removeUser();
                return false;
            } else if (this.isClearFilterAndSelection()) {
                this.jobDetails.clearMenu();
            }
            this.jobNodeDetails.maintainFilters = false;
            if(this.jobDetails.setIntId) {
                clearInterval(this.jobDetails.setIntId);
            }
        },
 
        showTableSettings: function (value, columns) {
            if (value === true) {
                this.showSettings = true;
            } else {
                this.showSettings = false;
            }
            if(columns) this.setColumns = columns;
        },

        onResume: function () {
            this.onAppCalled();
        },

        onAppCalled: function () {
            if(this.errorMessage) {
                this.errorMessage.detach();
            }
            if(!this.isServerTimeOffSet) {
                this.isServerTimeOffSet = true;
                this.getServerTimeOffSet();
            } else {
                this.jobDetails.view.showLoadingAnimation();
                ServerUtil.rbacCheck('neaccount_job', this.loadJobs.bind(this), this.showAccessDenied.bind(this));
                var attribute1 = ["comeFrom",this.appName];
                var attribute2 = ["navigateTo",this.appName];
                sessionStorageUtil.updateSessionStorage(attribute1, attribute2);
            }
        },

        loadJobs: function () {
            this.rbacSuccess = true;
            if(this.rightPanelClosedByUser) {
                this.destroySlidingPanels();
                this.slidingPanels = this.getMultiSlidingPanel(false);
            }
            this.layout.setContent(this.slidingPanels);
            this.layout.attachTo(this.getElement());
            var isNewJob = false;
            var hashValue = this.locationController.getLocation();
            if (hashValue.match("jobNameAndStatus")) {
                isNewJob = true;
                this.locationController.setLocation("npamjob", false, true);
                var messageInfo = hashValue.split('=');
                if(messageInfo[1]){
                    var statusAndErrorMessage = messageInfo[1].split(',');
                    if (statusAndErrorMessage.length > 1) {
                        var statusCode = statusAndErrorMessage[1];
                        if (statusAndErrorMessage[0] === Constants.ERROR && statusCode !== '409') {
                            var errorBody = MessageUtil.getErrorMessage(statusCode, statusAndErrorMessage[2]);
                            this.jobDetails.showErrorMessage(errorBody, statusCode);
                        } else {
                            var jobName = statusAndErrorMessage[0];
                            var message = '';
                            var jobStatus;
                            if (statusAndErrorMessage[1] === Constants.SUCCESS.toLowerCase()) {
                                message = jobName + libLanguage.get('jobCreatedSuccess');
                                jobStatus = 'success';
                            } else if (statusCode === '409' && (statusAndErrorMessage.length > 3)) {
                                message = statusAndErrorMessage[2] + " ," + statusAndErrorMessage[3];
                                jobStatus = 'error';
                            } else if(statusAndErrorMessage[1] === Constants.PARTIAL_SUCCESS) {
                                message = jobName + libLanguage.get('jobCreatedSuccessvRAN');
                                jobStatus = 'error';
                            } else {
                                message = libLanguage.get('errorOnJobCreation') + jobName;
                                jobStatus = 'error';
                            }
                            this.jobNotificationHandler(jobStatus, message, true);
                        }
                    }
                }
            }
            this.jobDetails.fetchJobs();
        },

        showAccessDenied: function (response, xhr) {
            this.jobDetails.view.hideLoadingAnimation();
            if (xhr.getStatus() === 403) {
                this.removeAllSections();
            } else{
                var errorBodyMsg = MessageUtil.getErrorMessage(xhr.getStatus());
                this.displayMessage.showMessage(true, errorBodyMsg.userMessage.body, "error", errorBodyMsg.userMessage.title);
                this.displayMessage.attachTo(this.view.getElement());
            }
        },

        removeAllSections: function() {
            this.destroySlidingPanels();
            this.destroyLayout();

            this.layout = this.getTopSection();
            this.layout.setContent(npamCommonUtil.getInfoRegion({"isInfoMsg": false, "appName": ""}));
            this.layout.attachTo(this.getElement());
        },

        destroySlidingPanels: function() {
            if(this.slidingPanels) {
                this.slidingPanels.destroy();
            }
        },

        destroyLayout: function() {
            if(this.layout) {
                this.layout.destroy();
            }
        },

        addRotateFile: function() {
            var newChildren = [];
            this.options.breadcrumb[1].children.forEach(function(e) {
                newChildren.push(e);
                if (e.name === libLanguage.get('RotateNeAccount')) {
                    newChildren.push({"name": libLanguage.get('RotateNeAccountFromFile'),
                                      "url": "#npamapp/npamrotateneaccountjob?FileName",
                                      "app": "npamrotateneaccountjob"});
                }
            });
            return newChildren;
        },

        getTopSection: function(actions) {
            this.options.breadcrumb[1].children = this.addRotateFile();
            return new TopSection({
                context: this.getContext(),
                title: language.get('title'),
                breadcrumb: this.options.breadcrumb,
                defaultActions: actions ? this.getActions() : []
            });
        },

        getActions: function() {
            return [
                /*[{
                    type: 'dropdown',
                    options: {
                        caption: libLanguage.get('contextActions.createJob'),
                        color: "blue",
                        items: [
                            {type: 'separator'},
                            {name: libLanguage.get('contextActions.createNeAccountJob'), action: this.createJobHandler.bind(this, "npamapp/npamcreateneaccountjob")},
                            {name: libLanguage.get('contextActions.detachNeAccountJob'), action: this.createJobHandler.bind(this, "npamapp/npamdeleteneaccountjob")},
                            {name: libLanguage.get('contextActions.rotateNeAccountJob'), action: this.createJobHandler.bind(this, "npamapp/npamrotateneaccountjob")},
                            {name: libLanguage.get('contextActions.rotateImportFileJob'), action: this.createJobHandler.bind(this, "npamapp/npamrotateneaccountjob?FileName")},
                            {name: libLanguage.get('contextActions.checkNeAccountConfigJob'), action: this.createJobHandler.bind(this, "npamapp/npamcheckneaccountconfigjob")}

                        ]
                    }
                }],*/
                [{
                    type: 'button',
                    icon: Constants.icon.refresh,
                    name: "Refresh",
                    caption: libLanguage.get('contextActions.refresh'),
                    action: function () {
                        if (this.jobDetails) {
                            this.jobDetails.fetchJobs();
                        }
                    }.bind(this)
                }]
            ];
        },

        createJobHandler: function (url) {
            var comeFrom = ["comeFrom", this.appName];
            var navigateTo = sessionStorageUtil.getSessionStorageAttribute("navigateTo");
            sessionStorageUtil.updateSessionStorage(comeFrom, navigateTo);
            window.location.hash = url;
        },

        jobNotificationHandler: function (level, message, autoDismiss) {
            var icon, color;
            switch (level) {
                case "error":
                    icon = "error";
                    color = "red";
                    break;
                case "success":
                    icon = "tick";
                    color = "green";
                    break;
                case "info":
                    icon = "info";
                    color = "paleBlue";
                    break;
                case "warning":
                    icon = "warning";
                    color = "yellow";
                    break;
            }
            if (this.notification) {
                this.notification.detach();
            }
            this.notification = new Notification({
                icon: icon,
                color: color,
                showCloseButton: true,
                showAsToast: true,
                autoDismiss: autoDismiss,
                autoDismissDuration: 5000
            });
            this.notification.attachTo(this.view.getNotificationHolder());
            var el = document.createElement("a");
            el.className = "eaNpamjob-clickHere";
            el.innerHTML = libLanguage.get('clickHere');
            this.notification.setLabel(message);
        },

        getJobsAndDetachNotification: function () {
            this.jobDetails.fetchJobs();
            this.notification.detach();
        },

        showLoadingAnimation: function () {
            this.view.getLoadingAnimationHolder().removeModifier("hidden");
        },

        hideLoadingAnimation: function () {
            this.view.getLoadingAnimationHolder().setModifier("hidden");
        },

        isClearFilterAndSelection: function () {
            return (this.jobDetails.selectedJobsArray.length === 0) || !(this.jobNodeDetails.maintainFilters || this.jobDetails.maintainFilters);
        }
    });
});

