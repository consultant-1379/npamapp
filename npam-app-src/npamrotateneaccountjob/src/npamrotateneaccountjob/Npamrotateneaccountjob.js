define([
    'jscore/core',
    'jscore/ext/locationController',
    'jscore/ext/mvp',
    'layouts/TopSection',
    'layouts/Wizard',
    "widgets/Dialog",
    'widgets/Notification',
    'i18n!npamrotateneaccountjob/dictionary.json',
    'i18n!npamlibrary/dictionary.json',
    './NpamrotateneaccountjobView',
    'npamlibrary/finish',
    './credentials/credentials',
    'npamlibrary/detailsNodeselection',
    'npamlibrary/detailsFileselection',
    'npamlibrary/schedule',
    'npamlibrary/accessdenied',
    'npamlibrary/constants',
    'npamlibrary/serverDateUtil',
    'npamlibrary/serverUtil',
    'npamlibrary/sessionStorageUtil',
    "npamlibrary/npamCommonUtil",
    'npamlibrary/displaymessage',
    "npamlibrary/StandardErrorMessagesUtil"
], function (core, LocationController, mvp, TopSection, Wizard, Dialog, Notification, language, libLanguage,
             View, finish, Credentials, detailsNodeselection, detailsFileselection, schedule, AccessDeniedDialog,
             constants, ServerDateUtil, serverUtil, sessionStorageUtil, npamCommonUtil, DisplayMessage,
             StandardErrorMessagesUtil) {

    return core.App.extend({
        View: View,

        appName: constants.ROTATE_NE_ACCOUNTS_LINK.substring(1),

        init: function () {
            this.isValidJobName = false;
            this.hashValue = "";
            this.accessDeniedDialog = new AccessDeniedDialog();
            this.model = new mvp.Model();
            this.isLeavePage = false;
            this.title = language.get('header');

            this.cancelDialog = new Dialog({
                type: 'warning',
                header: this.title,
                content: language.get('content').replace("<replace>", (libLanguage.get('cancel')).toLowerCase()),
                buttons: [
                    {caption: libLanguage.get('yes'), action: this.reloadPage.bind(this)},
                    {
                        caption: libLanguage.get('cancel'), action: function () {
                        this.cancelDialog.detach();
                    }.bind(this)
                    }
                ]
            });

            this.finishDialog = new Dialog({
                type: 'warning',
                header: this.title,
                content: language.get('content').replace("<replace>", (libLanguage.get('configure')).toLowerCase()),
                buttons: [
                    {
                        caption: libLanguage.get('yes'), action: function () {
                            var finishDialogButtons = this.finishDialog.getButtons();
                            finishDialogButtons[0].disable();
                            npamCommonUtil.scheduleDateValidation.bind(this).call();
                      }.bind(this)
                    },
                    {caption: libLanguage.get('no'), action: this.hideFinishDialog.bind(this)}
                ]
            });

            this.retryNotification = new Notification({
                label: language.get('tryAgain'),
                color: 'yellow',
                icon: 'warning',
                showAsToast: true,
                autoDismiss: false,
                showCloseButton: true
            });
        },

        createNodeSelectionStep: function() {
            return new detailsNodeselection(this);
        },

        createFileSelectionStep: function() {
            return new detailsFileselection(this);
        },

        createCredentialsStep: function() {
            return new Credentials(this);
        },

        createScheduleStep: function() {
            return new schedule(this.model, this.getEventBus(), this.rotateWithFile ? false : true);
        },

        createFinisStep: function() {
            return new finish(this.model, constants.ROTATENEACCOUNTJOB);
        },

        showLoadingAnimation: function () {
            this.view.getLoadingAnimationHolder().removeModifier("hidden");
        },

        hideLoadingAnimation: function () {
            this.view.getLoadingAnimationHolder().setModifier("hidden");
        },

        locationChangeHandler: function (hash) {
            this.step1.locationChangeHandler(hash);
        },

        onStart: function () {
            this.checkRotateType();

            // Instantiate ServerDate
            ServerDateUtil.init(this.getCurrentUser.bind(this), this.showFailureMessage.bind(this));
            this.getEventBus().subscribe("showLoadingAnimation", this.showLoadingAnimation.bind(this));
            this.getEventBus().subscribe("hideLoadingAnimation", this.hideLoadingAnimation.bind(this));
        },

        getCurrentUser: function () {
            sessionStorageUtil.getCurrentUser(this.loadApplication.bind(this), this.showFailureMessage.bind(this));
        },

        showFailureMessage: function (errorMessage) {
            if(this.displayErrorMessage){
                this.displayErrorMessage.detach();
            }
            if (errorMessage) {
                this.displayErrorMessage = errorMessage;
                this.displayErrorMessage.attachTo(this.view.getElement());
            }
        },

        initStep1AndLocationController: function () {
            if (this.step1) {
                this.step1.destroy();
            }

            if( this.rotateWithFile ) {
                this.step1 = this.createFileSelectionStep();
            } else {
                this.step1 = this.createNodeSelectionStep();
                this.locationController = new LocationController({
                    namespace: this.appName
                });
                this.locationController.addLocationListener(this.locationChangeHandler.bind(this));
                this.locationController.start();

                if (this.stepCredentials) {
                    this.stepCredentials.destroy();
                }
                this.stepCredentials = this.createCredentialsStep();
            }
        },

        loadApplication: function () {
            // Instantiate top part of layout
            this.initStep1AndLocationController();
            this.layout = this.getTopSection(false); // true to see remove selected
            this.initWizard();
            this.onAppCalled();
        },

        onBeforeLeave: function (containerEvent) {
            if (containerEvent.type === "tabclose") {
                var attribute = ["comeFrom", this.appName];
                sessionStorageUtil.updateSessionStorage(attribute);
                sessionStorageUtil.removeUser();
                return " ";
            }
            if (this.isNavToRelatedApps()) {
                return false;
            }
            return " ";
        },

        onPause: function(){
            if((this.isNavToRelatedApps() && !this.wizardReset) || !this.rbacSuccess){
                return false;
            }
            this.clearWizard(true);
        },

        isNavToRelatedApps: function () {
            if (window.location.hash.indexOf("loadNodes") > -1 || this.isLeavePage) {
                return true;
            }
        },

        initWizard: function () {
            if (this.wizard) {
                this.wizard.destroy();
            }

            // Model that will be shared across all steps
            this.finish = this.createFinisStep();

            this.schedule = this.createScheduleStep();

            //Instantiate the wizard layout
            var stepsWizard = [];
            stepsWizard.push(this.step1);
            if( !this.rotateWithFile ) {
                stepsWizard.push(this.stepCredentials);
            }
            stepsWizard.push(this.schedule);
            stepsWizard.push(this.finish);

            this.wizard = new Wizard({
                steps: stepsWizard,
                labels: {
                    next: libLanguage.get('next'),
                    previous: libLanguage.get('previous'),
                    cancel: libLanguage.get('cancel'),
                    finish: libLanguage.get('finish')
                }
            });

            // Attach the wizard to the layout
            if(this.rbacSuccess) {
                this.layout.setContent(this.wizard);
                this.layout.attachTo(this.getElement());
            }

            // Useful event handlers
            this.wizard.addEventHandler("finish", npamCommonUtil.finishJobCreation.bind(this));
            this.wizard.addEventHandler("cancel", this.cancelJobCreation.bind(this));
            this.wizard.addEventHandler("stepchange", npamCommonUtil.onStepChange.bind(this));

//            this.getEventBus().subscribe("attachRetryNotification", this.attachRetryNotificationHandler.bind(this));
//            this.getEventBus().subscribe("detachRetryNotification", function () {
//                this.retryNotification.detach();
//            }.bind(this));
        },

//        attachRetryNotificationHandler: function () {
//            this.retryNotification.setLabel(libLanguage.get('retrying'));
//            this.retryNotification.attachTo(this.view.getNotificationHolder());
//        },

        onAppCalled: function () {
            serverUtil.rbacCheck('neaccount_job', this.checkRbacCreate.bind(this), this.showAccessDenied.bind(this));
            this.isLeavePage = false;
            this.wizardReset = false;
        },

        checkRbacCreate: function (capabilities) {
            var capabilitiesJson = JSON.parse(capabilities);
            if ( capabilitiesJson.actions.includes('create') ) {
                this.renderApplication();
            } else {
                this.removeAllSections();
            }
        },

        renderApplication: function () {
            this.rbacSuccess = true;
            this.layout.setContent(this.wizard);
            this.layout.attachTo(this.getElement());

            var comeFrom = sessionStorageUtil.getSessionStorageAttribute("comeFrom");
            console.log("comeFrom " + comeFrom);

            if ( (this.oldRotateWithFile !== undefined) && (this.oldRotateWithFile !== this.rotateWithFile) ) {
                this.clearWizard(false);
            }
            this.oldRotateWithFile = this.rotateWithFile;

            if (!comeFrom) {
                comeFrom = ["comeFrom", this.appName];
            }
            var navigateTo = ["navigateTo", constants.JOB_LIST_LINK];
            sessionStorageUtil.updateSessionStorage(comeFrom, navigateTo);
            var comeFrom1 = sessionStorageUtil.getSessionStorageAttribute("comeFrom");
            console.log("comeFrom " + comeFrom1);
            var navigateTo1 = sessionStorageUtil.getSessionStorageAttribute("navigateTo");
            console.log("navigateTo " + navigateTo1);
        },

        onResume: function () {
            this.checkRotateType();
            this.getEventBus().publish('topsection:leavecontext');
            if( this.rotateWithFile ) {
                this.step1.refreshView();
            }
            this.onAppCalled();
        },

        checkRotateType: function () {
            if( window.location.hash.indexOf("FileName") > 1 ) {
                var urlSplit = window.location.hash.split("=");
                if ( urlSplit.length === 2 ) {
                    this.importedFileName = urlSplit[1];
                } else {
                    this.importedFileName = undefined;
                }
                this.rotateWithFile = true;
                this.title = language.get('headerFromFile');

            } else {
                this.rotateWithFile = false;
                this.title = language.get('header');
            }

            if ( this.layout ) {
                this.layout.setTitle(this.title);
            }

            if ( this.cancelDialog ) {
                this.cancelDialog.setHeader(this.title);
            }

            if ( this.finishDialog ) {
                this.finishDialog.setHeader(this.title);
            }
        },


        cancelJobCreation: function () {
            this.cancelDialog.attachTo(this.view.getDialogbox());
        },

        showAccessDenied: function (response, xhr) {
            if (xhr.getStatus() === 403) {
                this.removeAllSections();
            }
        },

        removeAllSections: function() {
            this.destroyWizard();
            this.destroyLayout();
            this.layout = this.getTopSection();
            this.layout.setContent(npamCommonUtil.getInfoRegion({"isInfoMsg": false, "appName": ""}));
            this.layout.attachTo(this.getElement());
        },

        destroyWizard: function() {
            if(this.wizard) {
                this.wizard.destroy();
            }
        },

        destroyLayout: function() {
            if(this.layout) {
                this.layout.destroy();
            }
        },

        getTopSection: function(actions) {
            this.options.breadcrumb[1].children = [];
            return new TopSection({
               context: this.getContext(),
               title: this.title,
               breadcrumb: this.options.breadcrumb,
               defaultActions: (actions) ? this.getActions() : []
            });
        },

        getActions: function() {
            return [
                [{
                    name: libLanguage.get('removeSelected'),
                    type: 'button',
                    action: this.removeSelected.bind(this),
                    disabled: true
                }]
            ];
        },

        removeSelected: function () {
            this.trigger("detailsNodeSelection:removeSelected");
        },

        hideFinishDialog: function () {
            this.finishDialog.hide();
        },

        getJSONData: function () {
            this.finishDialog.detach();
            serverUtil.sendRestCall('POST', '/npamservice/v1/job/create', this.rotateNeAccountsJobSuccess.bind(this),
                                    this.loadErrorMessage.bind(this), 'json', 'application/json',
                                    JSON.stringify(this.model.getAttribute('createJobJSON')));
            this.view.getLoadingAnimationHolder().removeModifier("hidden");
        },

        rotateNeAccountsJobSuccess: function () {
            this.wizardReset = true;
            this.wizard.detach();
            this.layout.detach();
            window.location.href = constants.JOB_LIST_LINK;
            window.location.hash = "npamapp/npamjob?jobNameAndStatus=" + this.model.getAttribute('createJobJSON').name + ",success";
            this.view.getLoadingAnimationHolder().setModifier("hidden");
        },

        loadErrorMessage: function (response, xhr) {
            if (xhr.getStatus() === 403) {
                this.accessDeniedDialog.show();
            } else {
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
                var displayMessage = new DisplayMessage();
                var dialog = new Dialog({
                    header: errorMessage.header,
                    content: displayMessage,
                    topRightCloseBtn: true,
                    buttons: []
                });
                displayMessage.showMessage( true, details, "error", errorMessage.description);
                dialog.show();
            }
            this.view.getLoadingAnimationHolder().setModifier("hidden");
        },

        reloadPage: function () {
            this.cancelDialog.detach();
            window.location.hash = sessionStorageUtil.getSessionStorageAttribute("comeFrom");
            this.clearWizard(true);
            this.isLeavePage = true;
        },

        clearWizard: function (resetModels) {
            if ( resetModels ) {
                this.model = new mvp.Model();
            }

            if (this.step1) {
                this.step1.destroy();
            }

            if( this.rotateWithFile ) {
                this.step1 = this.createFileSelectionStep();
            } else {
                this.step1 = this.createNodeSelectionStep();
                if (this.stepCredentials) {
                    this.stepCredentials.destroy();
                }
                this.stepCredentials = this.createCredentialsStep();
            }
            this.initWizard();
        },

        validateAndGetServerTime: function () {
            ServerDateUtil.triggerServerTimeCall(this.validate.bind(this), this.showFailureMessage.bind(this));
        },

        validate: function () {
            if(this.finish.isScheduled()){
                if(this.finish.validateDate()) {
                    this.isValidDate = true;
                    this.finish.hideError();
                } else {
                    this.isValidDate = false;
                    this.finish.showError();
                    this.finishDialog.hide();
                }
            } else {
               this.isValidDate = true;
            }

            if(this.isValidJobName &&  this.isValidDate) {
                if(this.isFinishBtnClicked){
                    this.finish.hideJobNameError();
                    this.finishDialog.getButtons()[0].enable();
                    this.finishDialog.show();
                } else {
                    this.getJSONData();
                    this.finishDialog.hide();
                }
            }
        },

        validJobName: function (response, xhr) {
           if (xhr.getStatus() === 404 || xhr.getStatus() === 400 ) { //TODO remove 400 when fixed
               try {
                   this.isValidJobName = true;
               } catch (e) {
                   console.log('Exceptions setting variable');
               }
           } else if (xhr.getStatus() === 500 && xhr.getResponseText() === Constants.DATABASEERROR) {
               this.isValidJobName = true;
               this.finish.setJobNameErrorMsg(libLanguage.get('databaseErrorParagraph'));
               this.finish.showJobNameError();
           }
           this.validateAndGetServerTime();
        },

        invalidJobName: function (modifiedJobName) {
           this.isValidJobName = false;
           this.finish.setJobNameErrorMsg(modifiedJobName);
           this.finish.showJobNameError();
           this.finishDialog.hide();
           this.finish.revalidate();
           this.validateAndGetServerTime();
       }
    });
});
