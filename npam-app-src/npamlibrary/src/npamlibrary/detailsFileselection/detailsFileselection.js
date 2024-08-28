define([
    'jscore/core',
    'layouts/WizardStep',
    './detailsFileselectionView',
    'npamlibrary/serverUtil',
    'i18n!npamlibrary/dictionary.json',
    "widgets/SelectBox",
    'npamlibrary/displaymessage',
    'widgets/Notification',
    'npamlibrary/constants',
    'npamlibrary/dateUtil',
    'npamlibrary/serverDateUtil',
    'npamlibrary/sessionStorageUtil',
    'npamlibrary/restUrls',
    "npamlibrary/npamCommonUtil"
], function (core, WizardStep, View, ServerUtil, libLanguage, SelectBox, DisplayMessage, Notification, Constants,
             dateUtil, serverDateUtil, sessionStorageUtil, restUrls, CommonUtil ) {
    var jobName, isJobNameValid, isFileNameValid, mode, contextEvent, xhr, inputTimer , appName;

    return WizardStep.extend({
        title: libLanguage.get('jobDetailstitleWithFile'),
        View: View,

        init: function (mainApp) {
            this.mainApp = mainApp;

            this.model = this.mainApp.model;
            this.model.setAttribute("collectionNames", []);
            this.model.setAttribute("savedSearches", []);
            this.model.setAttribute("otherObjects", []);
            this.model.setAttribute("nodeDetails", []);
            this.model.setAttribute("isFirstStepModified", true);
            this.model.setAttribute("nodesModified", true);
            this.model.setAttribute("disableScheduleAndSummarySteps", false);
            this.model.setAttribute('JobDescription', '');

            this.tooltip = undefined;
            isJobNameValid = false;
            isFileNameValid = false;

            this.displayErrorMessage = new DisplayMessage();
            this.infoNotification = new Notification({
                label: libLanguage.get('schedule'),
                content: 'info',
                color: 'paleBlue',
                autoDismiss: false,
                icon: 'info'
            });
            this.isBackToFirstStep = false;
        },

        onViewReady: function () {
            this.view.getJobDescription().addEventHandler("change", function () {
                this.model.setAttribute('JobDescription', this.view.getJobDescription().getValue());
            }.bind(this));
            this.view.getJobNameHolder().addEventHandler("input", this.validateJobName.bind(this));
            this.view.setPlaceHolder(libLanguage.get('jobName'), libLanguage.get('jobDescription'));
            this.view.showLoading();
            this.refreshView();
        },

        refreshView: function () {
            ServerUtil.sendRestCall('GET', restUrls.importFileListUrl, this.importListSuccess.bind(this),
                                    this.showFailureMessage.bind(this), "json", "application/json");
        },

        importListSuccess: function (response, xhr) {
            var defaultValue = {};
            var fileList = [];

            isJobNameValid = false;
            isFileNameValid = false;
            response.forEach(function (el) {
                var fileEl = {};
                fileEl.name = el;
                fileEl.value = el;
                fileEl.title = el;

                if (!isFileNameValid) {
                    isFileNameValid = true;
                    this.model.setAttribute("credType", Constants.FILE_CRED);

                    defaultValue = JSON.parse(JSON.stringify(fileEl));
                    this.model.setAttribute("fileName", el);
                }
                fileList.push(fileEl);

                if ( decodeURI(this.mainApp.importedFileName) === el ) { // overwrite defaultValue
                    defaultValue = JSON.parse(JSON.stringify(fileEl));
                    this.model.setAttribute("fileName", el);
                }
            }.bind(this));

            if ( this.selectBoxWidget ) {
                this.selectBoxWidget.detach();
            }

            this.selectBoxWidget = new SelectBox({
                value: defaultValue,
                items: fileList
            });

            this.selectBoxWidget.attachTo(this.view.getFileNameHolder());
            this.selectBoxWidget.addEventHandler("change", function () {
                this.model.setAttribute("fileName", this.selectBoxWidget.getValue().name);
            }.bind(this));
            this.view.hideLoading();
            this.addObjectsToDom();
            this.validateAndGetServerTime();
        },

        addObjectsToDom: function () {
            this.view.setProcessDescription(libLanguage.get('processDescriptionWithFile'));
            this.view.setJobName(libLanguage.get('jobName'));
            this.view.setJobNameMaxText(libLanguage.get('jobNameMaxLimit'));
            this.view.setJobDesc(libLanguage.get('jobDescription'));
            this.view.setJobDescMaxText(libLanguage.get('jobDescMaxLimit'));
            this.view.setFileName(libLanguage.get('fileName'));
            this.view.setErrorMsg(libLanguage.get('errorMsg'));
            this.infoNotification.attachTo(this.view.getInfoHolder());
            this.infoNotification.setLabel(libLanguage.get('neAccountsJobInfoMessage'));
        },

        onAttach: function () {
            this.model.trigger("change:detachNotification");
            this.model.setAttribute("inValidationStep", true);

            if(!this.model.getAttribute("isFirstStepModified")){
                this.isBackToFirstStep = true;
            }
        },

        isValid: function () {
            if (!isJobNameValid) {
                return false;
            }
            return isFileNameValid;
        },

        validateJobName: function () {
            if (inputTimer) {
                this.view.showLoading();
                clearTimeout(inputTimer);
            }

            isJobNameValid = false;
            jobName = this.view.getJobName();
            this.view.setJobNameText(jobName);
            this.tooltip = CommonUtil.createTooltip(this.tooltip, this.view.getJobNameHolder(), jobName);

            if (this.isJobNameInvalid()) {
                this.dontProceedToNextStep(libLanguage.get('jobNameInvalidMsg'));
                this.view.hideLoading();
            } else {
                this.view.hideErrorMessageForJobName();
                if (jobName.length > 0) {
                    if (jobName.length > 150) {
                        this.dontProceedToNextStep(libLanguage.get('jobNameExceeds'));
                    } else {
                        inputTimer = setTimeout(function () {
                            ServerUtil.sendRestCall('GET', restUrls.jobNameValidation + jobName, this.dontProceedToNextStep.bind(this, libLanguage.get('differentJob')), this.proceedToNextStep.bind(this));
                        }.bind(this), 2000);
                        this.proceedToNextStep();
                    }
                } else {
                    isJobNameValid = false;
                    this.view.hideLoading();
                }
                this.revalidate();
            }
        },

        isJobNameInvalid: function () {
            //If any new characters are added in JOB_NAME_VALIDATION_PATTERN, Make sure getJobName() is also modified.
            return (Constants.JOB_NAME_VALIDATION_PATTERN.test(jobName));
        },

        proceedToNextStep: function (response, xhr) {
            this.view.hideErrorMessageForJobName();
            this.model.setAttribute('JobName', jobName);
            isJobNameValid = true;
            this.revalidate();
            this.view.hideLoading();
        },

        dontProceedToNextStep: function (modifiedJobName) {
            this.view.setInputErrorMsgForJobName(modifiedJobName);
            this.view.showErrorMessageForJobName();
            isJobNameValid = false;
            this.revalidate();
            this.view.hideLoading();
        },

        populateJobName: function (jobName) {
            if (this.mainApp.appName) {
                this.view.getJobNameHolder().setValue(jobName ? jobName : this.getJobName());
            }
            this.view.getJobNameHolder().trigger("input");
        },

        getJobName: function () {
            var appName = "npamrotateneaccountjob";
            var jobTitle = libLanguage.get('rotateneaccountsjobTitle');
            localStorage.setItem("jobTitle", jobTitle);

            //If userName contains any characters otherthan (a-zA-Z0-9-_.). Then, those characters will be replaced by "_".
            var userName = sessionStorageUtil.getUserName().replace(/[^a-zA-Z0-9-_.]/g, "_");
            return (Constants[appName + "_" + Constants.jobName] + userName + "_" + dateUtil.getServerDateTime());
        },

        validateAndGetServerTime: function () {
            serverDateUtil.triggerServerTimeCall(this.populateJobName.bind(this), this.showFailureMessage.bind(this));
        },

        showFailureMessage: function (errorMessage) {
            if(this.displayErrorMessage){
                this.displayErrorMessage.detach();
            }
            if (errorMessage) {
                this.displayErrorMessage = errorMessage;
//                this.displayErrorMessage.attachTo(this.view.getElement());
            }
        }
    });
});
