define([
    'jscore/core',
    'layouts/WizardStep',
    './finishView',
    'i18n!npamlibrary/dictionary.json',
    'npamlibrary/dateUtil',
    'npamlibrary/serverDateUtil',
    'npamlibrary/constants',
    'npamlibrary/i18NumberUtil'
], function (core, WizardStep, View, libLanguage, DateUtil, ServerDateUtil, constants, i18nNumber) {

    return WizardStep.extend({
        title: libLanguage.get('summaryTitle'),

        View: View,

        init: function (model, jobType) {
            this.model = model;
            this.createJobJSON = Object.create(Object.prototype);
            this.jobType = jobType;
        },

        onViewReady: function () {
            this.view.getJobName().setText(this.model.getAttribute("JobName") + libLanguage.get('jobSummary'));
            this.model.addEventHandler('change:JobName', function () {
                this.view.getJobName().setText(this.model.getAttribute("JobName") + libLanguage.get('jobSummary'));
                this.hideJobNameError();
            }.bind(this));

            this.view.setDescription(this.model.getAttribute("JobDescription"));
            this.model.addEventHandler('change:JobDescription', function () {
                this.view.setDescription(this.model.getAttribute("JobDescription"));
            }.bind(this));

            if (this.jobType === constants.ROTATENEACCOUNTJOB) {
                this.view.getCredentials().setText(libLanguage.get(this.model.getAttribute("credType") + 'credLabel'));
                this.model.addEventHandler('change:credType', function() {
                    this.view.getCredentials().setText(libLanguage.get(this.model.getAttribute("credType") + 'credLabel'));
                }.bind(this));
            } else {
                this.view.getCredentialsHolder().setModifier("disabled");
            }
        },

        addObjectsToDom: function () {
            this.view.setSummaryDefaultMsg(libLanguage.get('summaryMsg').replace("<replace>", libLanguage.get(this.jobType)));

            this.view.setScopeSelected(libLanguage.get('scopeSelected'));
            var scopeSelected = "";
            var scopeCollectionOrSavedSearches = false;
            if ( this.model.getAttribute("otherObjects").length > 0 ) {
                scopeSelected += libLanguage.get('NODES');
            }
            if ( this.model.getAttribute("collectionNames").length > 0 ) {
                scopeCollectionOrSavedSearches = true;
                if ( scopeSelected.length > 0) {
                    scopeSelected += ", ";
                }
                scopeSelected += libLanguage.get('COLLECTIONS');
            }
            if ( this.model.getAttribute("savedSearches").length > 0 ) {
                scopeCollectionOrSavedSearches = true;
                if ( scopeSelected.length > 0) {
                    scopeSelected += ", ";
                }
                scopeSelected += libLanguage.get('SAVED_SEARCHES');
            }
            this.view.getScope().setText(scopeSelected);


            if ( this.model.getAttribute("credType") === constants.FILE_CRED) {
                this.view.getNodesHolder().setModifier("disabled");
            } else {
                if (scopeCollectionOrSavedSearches) {
                    this.view.setNodesSelected(libLanguage.get('noOfCurrentNodes'));
                } else {
                    this.view.setNodesSelected(libLanguage.get('noOfNodesSelected'));
                }
            }

            if (this.jobType === constants.ROTATENEACCOUNTJOB) {
                this.view.setCredType(libLanguage.get('credentialsType'));
            }
            this.view.setSchedule(libLanguage.get('scheduleSpace'));
            this.view.setDescLabel(libLanguage.get('jobDescription'));
            this.view.setStartDate(libLanguage.get('startDate'));
            this.view.setSummaryErrorMsg(libLanguage.get('summaryErrorMsg'));
            this.view.setRepeatType(libLanguage.get('repeatType'));
            this.view.setRepeats(libLanguage.get('repeats'));
//            this.view.setRepeatsOn(libLanguage.get('repeats') + " " + libLanguage.get('on'));
            this.view.setEndsTitle(libLanguage.get('ends'));
        },

        setScheduleValue: function (scheduleVal) {
            this.view.getSchedule().setText(scheduleVal.charAt(0) + scheduleVal.slice(1).toLowerCase());
            this.view.getScheduleStartDateHolder().setStyle("display", "none");
            this.view.getScheduleRepeatCountHolder().setStyle("display", "none");
            this.view.getScheduleRepeatTypeHolder().setStyle("display", "none");
//            this.view.getScheduleRepeatOnHolder().setStyle("display", "none");
            this.view.getScheduleEndHolder().setStyle("display", "none");
        },

        setAllAttributesText: function (lastIndexVal, scheduleTypeVal, repeatCountVal, daysVal, endVal) {
            this.view.getScheduleStartDateHolder().setStyle("display", "inline-block");
            this.view.getScheduleRepeatTypeHolder().setStyle("display", "inline-block");
            this.view.getScheduleRepeatCountHolder().setStyle("display", "inline-block");
            this.view.getScheduleEndHolder().setStyle("display", "inline-block");
            this.view.getScheduleStartDate().setText(DateUtil.formatStartDate(this.model.getAttribute("startDateWithNoTimeZone")));
            this.view.getScheduleRepeatType().setText(libLanguage[Object.keys(libLanguage)[Object.keys(libLanguage).indexOf(scheduleTypeVal.toLowerCase())]]);
            this.view.getScheduleRepeatCount().setText(repeatCountVal);
            this.view.getScheduleEnd().setText(endVal);

//            if (scheduleTypeVal === "Weekly") {
//                this.view.getScheduleRepeatOnHolder().setStyle("display", "inline-block");
//                this.view.getScheduleRepeatOn().setText(daysVal);
//            } else {
//                this.view.getScheduleRepeatOnHolder().setStyle("display", "none");
//            }
        },

        onAttach: function () {
            this.isValidDate = true;
            this.validJobName = true;
            this.addObjectsToDom();

            var neNamesArray = [];
            if ( this.model.getAttribute("credType") !== constants.FILE_CRED) {
                var totalNodes = this.model.getAttribute("nodeDetails").length;
                var otherObjects = this.model.getAttribute("otherObjects");
                for(var key in otherObjects) {
                    neNamesArray.push(otherObjects[key].name);
                }
                this.view.getNodes().setText(i18nNumber.getNumber(totalNodes));
           }

            if (this.isScheduled()) {
                this.validateAndGetServerTime();
            }
            this.getWizard().trigger("getDateEvent");

            var jobNPAMType = "";
            var jobProperties = [];

            if (this.jobType === constants.CREATENEACCOUNTJOB) {
                jobNPAMType = constants.CREATE_NE_ACCOUNT;
            } else if (this.jobType === constants.DETACHNEACCOUNTJOB) {
                jobNPAMType = constants.DETACH_NE_ACCOUNT;
            } else if (this.jobType === constants.ROTATENEACCOUNTJOB) {
              if (this.model.getAttribute("credType") === constants.AUTO_CRED) {
                  jobNPAMType = constants.ROTATE_CREDENTIALS_AUTO_PWD;
              } else if ( this.model.getAttribute("credType") === constants.FILE_CRED) {
                  jobNPAMType = constants.ROTATE_CREDENTIALS_FROM_FILE;
                  jobProperties.push({key: "FILENAME", value: this.model.getAttribute("fileName")});
              } else {
                  jobNPAMType = constants.ROTATE_CREDENTIALS;
                  if (this.model.getAttribute("username") !== "") {
                      var username = {key: "USERNAME", value: this.model.getAttribute("username")};
                      jobProperties.push(username);
                  }
                  var password = {key: "PASSWORD", value: this.model.getAttribute("password")};
                  jobProperties.push(password);
                  console.log(jobProperties);
              }
            } else if (this.jobType === constants.CHECKNEACCOUNTCONFIGJOB) {
                jobNPAMType = constants.CHECK_NE_ACCOUNT_CONFIG;
            }

            this.createJobJSON = {
                jobType : jobNPAMType,
                name : this.model.getAttribute("JobName"),
                description : this.model.getAttribute("JobDescription"),
                selectedNEs : {
                    neNames : neNamesArray,
                    collectionNames : this.model.getAttribute("collectionNames"),
                    savedSearchIds : this.model.getAttribute("savedSearches")
                },
                jobProperties : jobProperties,
                mainSchedule : this.model.getAttribute("mainSchedule"),
                configurations : this.model.getAttribute("configurations")
            };

            if (this.model.getAttribute("mainSchedule").execMode === 'IMMEDIATE') {
                this.setScheduleValue(libLanguage.get('scheduleImmediately'));
            } else {
                this.setScheduleValue(libLanguage.get('scheduledExecution'));
                if (this.model.getAttribute("mainSchedule").scheduleAttributes.length > 1) {
                    var repeatTypeVal = this.model.getAttribute("mainSchedule").scheduleAttributes[0].value;
                    var repeatCountVal = this.model.getAttribute("mainSchedule").scheduleAttributes[1].value;
                    var initText = libLanguage.get('every');
                    var daysRepeated = "";
                    var repeatCountText, repeatTypeText, lastIndex, endInitText, endDate, endText;

                    if (repeatTypeVal === "Weekly") {
                        repeatTypeText = libLanguage.get('weeks');
                        repeatCountText = initText.concat(repeatCountVal, repeatTypeText);
                    } else if (repeatTypeVal === "Monthly") {
                        repeatTypeText = libLanguage.get('months');
                        repeatCountText = initText.concat(repeatCountVal, repeatTypeText);
                    } else if (repeatTypeVal === "Yearly") {
                        repeatTypeText = libLanguage.get('years');
                        repeatCountText = initText.concat(repeatCountVal, repeatTypeText);
                    }

                    if (this.model.getAttribute("mainSchedule").scheduleAttributes[2].name === "END_DATE") {
                        endInitText = libLanguage.get('on');
                        endDate = DateUtil.formatStartDate(this.model.getAttribute("endDateWithNoTimeZone"));
                        endText = endInitText.concat(endDate);
                        lastIndex = 3;
                    } else if (this.model.getAttribute("mainSchedule").scheduleAttributes[2].name === "OCCURRENCES") {
                        endInitText = libLanguage.get('after');
                        endDate = this.model.getAttribute("mainSchedule").scheduleAttributes[2].value;
                        endText = endInitText.concat(endDate, libLanguage.get('occurrences'));
                        lastIndex = 3;
                    } else {
                        lastIndex = 2;
                        endText = libLanguage.get('never');
                    }
                    this.setAllAttributesText(lastIndex, repeatTypeVal, repeatCountText, daysRepeated, endText);

                } else {
                    this.view.getScheduleStartDateHolder().setStyle("display", "inline-block");
                    this.view.getScheduleStartDate().setText(DateUtil.formatStartDate(this.model.getAttribute("startDateWithNoTimeZone"), true));
                    this.view.getScheduleRepeatCountHolder().setStyle("display", "none");
                    this.view.getScheduleRepeatTypeHolder().setStyle("display", "none");
//                    this.view.getScheduleRepeatOnHolder().setStyle("display", "none");
                    this.view.getScheduleEndHolder().setStyle("display", "none");
                }
            }
            this.model.setAttribute('createJobJSON', this.createJobJSON);
            this.model.setAttribute("nodesModified", false);
        },

        getAllNeWithComponents: function() {
            var allNesAndComponents = this.model.getAttribute("selectedComponentDetails");
            var parentNeWithComponents = [];
            for(var l in allNesAndComponents) {
                for(var z in allNesAndComponents[l].neNames){
                    var selectedcomp = [];
                    for(var k=0; k<allNesAndComponents[l].neNames[z].length; k++) {
                        if (allNesAndComponents[l].neNames[z][k].split("_").splice(-1).toString() === "CLUSTER") {
                            selectedcomp.push(allNesAndComponents[l].neNames[z][k]);
                        } else {
                            selectedcomp.push(z + "__" + allNesAndComponents[l].neNames[z][k]);
                        }
                    }
                    parentNeWithComponents.push({
                        "parentNeName" : z,
                        "selectedComponents" : selectedcomp
                    });
                }
            }
            return parentNeWithComponents;
        },

        hideError: function () {
            this.view.getStatusError().setAttribute("style", "display:none");
        },

        showError: function () {
            this.view.getStatusError().setAttribute("style", "display:inline-block");
        },

        hideJobNameError: function () {
            this.view.hideJobNameError();
            this.validJobName = true;
        },

        showJobNameError: function () {
            this.view.showJobNameError();
            this.validJobName = false;
        },

        setJobNameErrorMsg: function (txt){
            this.view.setJobNameErrorMsg(txt);
        },

        isScheduled: function () {
            return this.model.getAttribute("mainSchedule").execMode === 'SCHEDULED';
        },

        isDateGreaterthanSystemDate: function () {
            return DateUtil.compareDate(this.getScheduleStartDate(), ServerDateUtil.getServerDate());
        },

        finalJSONobject: function () {
            return this.createJobJSON;
        },

        isValid: function () {
            return this.validJobName && this.isValidDate;
        },

        validateAndGetServerTime: function () {
            ServerDateUtil.triggerServerTimeCall(this.validateDate.bind(this), this.showFailureMessage.bind(this));
        },

        getScheduleStartDate: function(){
            return DateUtil.getStartDateValue(this.model.getAttribute("startDateWithNoTimeZone"));
        },

        showFailureMessage: function(errorMessage){
            if (errorMessage) {
                errorMessage.attachTo(this.view.getElement());
            }
        },

        validateDate: function() {
            var returnValue = true;
            if (this.isDateGreaterthanSystemDate()) {
                this.hideError();
                returnValue = true;
            } else {
                this.showError();
                returnValue = false;
            }
            this.isValidDate = returnValue;
            this.revalidate();
            return returnValue;
        }
    });
});
