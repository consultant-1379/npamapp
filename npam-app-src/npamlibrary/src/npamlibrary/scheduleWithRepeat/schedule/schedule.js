define([
    'jscore/core',
    'layouts/WizardStep',
    './scheduleView',
    'npamlibrary/schedulejob',
    'npamlibrary/dateUtil',
    'i18n!npamlibrary/dictionary.json',
    'npamlibrary/serverDateUtil',
    'npamlibrary/constants'
], function (core, WizardStep, View, ScheduleJob, DateUtil, libLanguage, ServerDateUtil, constants) {

    return WizardStep.extend({

        title: libLanguage.get('scheduleTitle'),

        View: View,

        init: function (model, eventBus, isRepeatSupported) {
            this.eventBus = eventBus;
            this.model = model;
            this.isRepeatSupported = isRepeatSupported;

            this.repeatAttributes = Object.create(Object.prototype);
            this.startDateAndTime = Object.create(Object.prototype);
            this.endDateAndTime = Object.create(Object.prototype);
            this.occurrences = Object.create(Object.prototype);
            this.repeatType = Object.create(Object.prototype);
            this.repeatCount = Object.create(Object.prototype);
//            this.repeatOn = Object.create(Object.prototype);
            this.mainSchedule = Object.create(Object.prototype);

            this.startDateAndTime.name = "START_DATE";
            this.repeatType.name = "REPEAT_TYPE";
//            this.repeatOn.name = "REPEAT_ON";
            this.repeatCount.name = "REPEAT_COUNT";
            this.occurrences.name = "OCCURRENCES";
            this.endDateAndTime.name = "END_DATE";

            this.subscribeEvents = true;
            this.scheduleStep = false;
            this.isStartDateValid = false;
            this.isEndDateValid = false;
        },

        onViewReady: function () {
            this.scheduleJob = new ScheduleJob(this.eventBus);
            this.scheduleJob.attachTo(this.getElement());
            this.scheduleJob.view.getScheduleOptionSelectBox().addEventHandler("change", this.validateScheduleType.bind(this));
            if ( this.isRepeatSupported ) {
                this.scheduleJob.enableRepeatFeature();
            }

            var repeatPattern = this.scheduleJob.repeatPattern;
            repeatPattern.view.getRepeatCheckbox().addEventHandler("click", this.revalidate.bind(this));
            repeatPattern.repeatTypeSelectBox.getElement().addEventHandler("change", this.revalidate.bind(this));
            repeatPattern.view.getRepeatPeriodTextBox().addEventHandler("input", this.revalidate.bind(this));
            repeatPattern.view.getEndNever().addEventHandler("click", this.revalidate.bind(this));
            repeatPattern.view.getEndAfter().addEventHandler("click", this.revalidate.bind(this));
            repeatPattern.view.getEndOn().addEventHandler("click", this.revalidate.bind(this));
            repeatPattern.view.getEndAfterOccurrencesTextBox().addEventHandler("input", this.revalidate.bind(this));

//            var checkboxHoldersForEvent = repeatPattern.view.getRepeatWeekDayCheckboxes().children();
//            for (var i = 0; i < checkboxHoldersForEvent.length; i++) {
//                var weekdayCheckboxForEvent = (checkboxHoldersForEvent[i].children())[0];
//                weekdayCheckboxForEvent.addEventHandler("click", this.revalidate.bind(this));
//            }

            this.scheduleJob.dateTimePicker.addEventHandler("dateselect", this.validateAndGetServerTime.bind(this));
            this.scheduleJob.repeatPattern.dateTimePicker.addEventHandler("dateselect", this.verifyEndDate.bind(this));
            this.scheduleJob.dateTimePicker.addEventHandler("dateclear", this.cancelStartDate.bind(this));
            this.scheduleJob.repeatPattern.dateTimePicker.addEventHandler("dateclear", this.cancelEndDate.bind(this));
        },

        disableRepeatFeature: function() {
            this.isRepeatSupported = false;
            this.scheduleJob.disableRepeatFeature();
        },

        enableRepeatFeature: function() {
            this.isRepeatSupported = true;
            this.scheduleJob.enableRepeatFeature();
        },

        onAttach: function () {
            if (this.subscribeEvents) {
                this.getWizard().addEventHandler("getDateEvent", function () {
                    this.revalidate();
                }.bind(this));
                this.subscribeEvents = false;
            }
            this.scheduleJob.view.errorMessage().setAttribute("style", "display:none");
            this.scheduleJob.scheduleOptionSelectBox.getValue().action();
            if (this.scheduleJob.mainSchedule.execMode === "SCHEDULED") {
                this.validateAndGetServerTime();
            }
            this.scheduleJob.onAttach();
        },

        showOrHideStartDateError: function (flag) {
            this.scheduleStep = flag;
            if (flag) {
                this.scheduleJob.view.errorMessage().setAttribute("style", "display:none");
            } else {
                this.scheduleJob.view.errorMessage().setAttribute("style", "display:inline-block");
            }
        },

        validateScheduleType: function () {
            if (/*this.scheduleJob.mainSchedule.execMode === "MANUAL" || */this.scheduleJob.mainSchedule.execMode === "IMMEDIATE") {
                this.showOrHideStartDateError(true);
            } else if (this.scheduleJob.mainSchedule.execMode === "SCHEDULED") {
                if (this.scheduleJob.dateTimePicker.getInput() === "") {
                    this.scheduleStep = false;
                } else {
                    if (DateUtil.compareDate(this.getStartDate(), ServerDateUtil.getServerDate())) {
                        this.scheduleJob.repeatPattern.view.getRepeatCheckbox().getProperty("checked");
                        this.showOrHideStartDateError(true);
                    } else {
                        this.showOrHideStartDateError(false);
                    }
                }
            }
            this.revalidate();
        },

        getStartDate: function () {
            return Date.parse(this.scheduleJob.dateTimePicker.getValue());
        },

        getEndDate: function () {
            return Date.parse(this.scheduleJob.repeatPattern.dateTimePicker.getValue());
        },

        verifyEndDate: function () {
            if (this.scheduleJob.dateTimePicker.getInput() === "") {
                this.scheduleJob.repeatPattern.dateTimePicker.view.getCancelButton().trigger("click");
                this.scheduleJob.repeatPattern.view.showErrorType().setText(libLanguage.get('selectDate'));
                this.scheduleJob.repeatPattern.view.showErrorType().setAttribute("style", "display:inline-block;margin-left: 7.5px;");
            } else if (DateUtil.compareDate(this.getEndDate(), this.getStartDate())) {
                this.isEndDateValid = true;
            } else {
                this.scheduleJob.repeatPattern.view.showErrorType().setText(libLanguage.get('endDateGreaterThanSchedule'));
                this.scheduleJob.repeatPattern.view.showErrorType().setAttribute("style", "display:inline-block;margin-left: 7.5px;");
                this.isEndDateValid = false;
            }
            this.revalidate();
        },

        cancelStartDate: function () {
            this.scheduleJob.view.errorMessage().setAttribute("style", "display:none");
            this.scheduleJob.repeatPattern.showErrorType();
            this.isStartDateValid = false;
            this.revalidate();
        },

        verifyScheduleDate: function () {
            if (DateUtil.compareDate(this.getStartDate(), ServerDateUtil.getServerDate())) {
                this.isStartDateValid = true;
                this.scheduleJob.view.errorMessage().setAttribute("style", "display:none");
                this.scheduleJob.repeatPattern.showErrorType();
            } else {
                if (this.scheduleJob.dateTimePicker.getInput().length > 0 && this.scheduleJob.mainSchedule.execMode === "SCHEDULED") {
                    this.scheduleJob.view.errorMessage().setText(libLanguage.get('summaryErrorMsg'));
                    this.scheduleJob.view.errorMessage().setAttribute("style", "display:inline-block");
                    this.scheduleJob.repeatPattern.showErrorType();
                    this.isStartDateValid = false;
                } else if (this.scheduleJob.dateTimePicker.getInput().length <= 0) {
                    this.scheduleJob.dateTimePicker.view.getCancelButton().trigger("click");
                    this.scheduleStep = false;
                }
            }

            if ( this.isRepeatSupported ) {
                if (DateUtil.compareDate(this.getEndDate(), this.getStartDate())) {
                    this.isEndDateValid = true;
                } else {
                    if (this.scheduleJob.repeatPattern.view.getRepeatCheckbox().getProperty("checked") && this.scheduleJob.repeatPattern.repeatAttributes.endType === "On") {
                        this.scheduleJob.repeatPattern.view.showErrorType().setText(libLanguage.get('endDateGreaterThanSchedule'));
                        this.scheduleJob.repeatPattern.view.showErrorType().setAttribute("style", "display:inline-block;margin-left: 7.5px;");
                        this.isEndDateValid = false;
                    }
                }
            }
            this.revalidate();
        },

        cancelEndDate: function () {
            this.scheduleJob.repeatPattern.showErrorType();
            this.isEndDateValid = false;
            this.revalidate();
        },

//        getCheckedWeekdays: function () {
//            var checkboxHolders = this.scheduleJob.repeatPattern.view.getRepeatWeekDayCheckboxes().children();
//            var checkedWeekdays = "";
//            for (var i = 0; i < checkboxHolders.length; i++) {
//                var weekdayCheckbox = (checkboxHolders[i].children())[0];
//                if (weekdayCheckbox.getProperty("checked")) {
//                    checkedWeekdays = checkedWeekdays.concat(((i + 1).toString()), ",");
//                }
//            }
//            var indexOfLastChar = checkedWeekdays.length - 1;
//            checkedWeekdays = checkedWeekdays.substr(0, indexOfLastChar);
//            return checkedWeekdays;
//        },

        validateAllAttributes: function (attributeCount) {
            var filledAttributes = 0;
            for (var i = 0; i < attributeCount; i++) {
                if (this.mainSchedule.scheduleAttributes[i] !== undefined &&
                    this.mainSchedule.scheduleAttributes[i].value !== "") {
                    filledAttributes++;
                }
            }
            if (filledAttributes === attributeCount) {
                return true;
            }
            else {
                return false;
            }
        },

        validateAllFields: function () {
            var repeatPattern = this.scheduleJob.repeatPattern;
            if (this.mainSchedule.scheduleAttributes.length > 0) {

                if (repeatPattern.repeatAttributes.endType === "Never") {
                    this.scheduleJob.repeatPattern.showErrorType();
                    this.scheduleStep = this.validateAllAttributes(2);
                } else if (repeatPattern.repeatAttributes.endType === "After" || "On") {
                    this.scheduleJob.repeatPattern.showErrorType();
                    this.scheduleStep = this.validateAllAttributes(3);
                }
                else if (this.scheduleJob.repeatPattern.repeatAttributes.endType === "On") {
                    this.scheduleStep = true;
                }
            }
        },

        constructScheduleAttributes: function () {
            var repeatPattern = this.scheduleJob.repeatPattern;
            if (repeatPattern.view.getRepeatCheckbox().getProperty("checked")) {
                this.scheduleStep = false;
                if (repeatPattern.repeatTypeSelectBox.getValue().value !== "Select Repeat Pattern type") {

                    this.repeatType.value = repeatPattern.repeatAttributes.repeatType;
                    this.mainSchedule.scheduleAttributes.push(this.repeatType);

                    if (repeatPattern.view.getRepeatPeriodTextBox().getValue() <= 0) {
                        repeatPattern.view.getRepeatPeriodTextBox().setValue("");
                        this.repeatCount.value = repeatPattern.view.getRepeatPeriodTextBox().getValue();
                    }
                    else this.repeatCount.value = repeatPattern.view.getRepeatPeriodTextBox().getValue();
                    this.mainSchedule.scheduleAttributes.push(this.repeatCount);

//                    if (repeatPattern.repeatTypeSelectBox.getValue().value === "Weekly") {
//                        this.repeatOn.value = this.getCheckedWeekdays();
//                        this.mainSchedule.scheduleAttributes.push(this.repeatOn);
//                    }

                    if (repeatPattern.repeatAttributes.endType === "After") {
                        if (repeatPattern.view.getEndAfterOccurrencesTextBox().getValue() <= 0) {
                            repeatPattern.view.getEndAfterOccurrencesTextBox().setValue("");
                            this.occurrences.value = repeatPattern.view.getEndAfterOccurrencesTextBox().getValue();
                        }
                        else this.occurrences.value = repeatPattern.view.getEndAfterOccurrencesTextBox().getValue();
                        this.mainSchedule.scheduleAttributes.push(this.occurrences);
                    }

                    if (repeatPattern.repeatAttributes.endType === "On") {
                        var endDate = repeatPattern.dateTimePicker.getValue();
                        this.endDateAndTime.value = DateUtil.getFormattedScheduleDate(endDate);
//                        this.model.setAttribute('endDateWithNoTimeZone', endDate);
                        this.model.setAttribute('endDateWithNoTimeZone', this.endDateAndTime.value);
                        this.mainSchedule.scheduleAttributes.push(this.endDateAndTime);
                    }
                    this.validateAllFields();
                }
            } else {
                this.mainSchedule.scheduleAttributes = [];
                this.scheduleStep = true;
            }
        },

        pushStartdate: function () {
            var startDate = this.scheduleJob.dateTimePicker.getValue();
            this.startDateAndTime.value = DateUtil.getFormattedScheduleDate(startDate);
//            this.model.setAttribute('startDateWithNoTimeZone', startDate);
            this.model.setAttribute('startDateWithNoTimeZone', this.startDateAndTime.value);
            this.mainSchedule.scheduleAttributes.push(this.startDateAndTime);
        },

        isValid: function () {
            this.mainSchedule.scheduleAttributes = [];
            if (this.scheduleJob.mainSchedule.execMode === "IMMEDIATE" /*|| this.scheduleJob.mainSchedule.execMode === "MANUAL"*/) {
                this.mainSchedule.execMode = this.scheduleJob.mainSchedule.execMode;
                return true;
            }
            else if (this.scheduleJob.mainSchedule.execMode === "SCHEDULED" && !this.isStartDateValid)
                return false;
            else if (this.scheduleJob.repeatPattern.repeatAttributes.endType === "On" && !this.isEndDateValid) {
                if (this.scheduleJob.repeatPattern.view.getRepeatCheckbox().getProperty("checked") === false) {
                    this.scheduleJob.view.errorMessage().setAttribute("style", "display:none");
                    return true;
                }
                else
                    return false;
            }
            else if (this.scheduleJob.mainSchedule.execMode === "SCHEDULED" && this.isStartDateValid && this.scheduleJob.repeatPattern.view.getRepeatCheckbox().getProperty("checked") === true) {
                this.mainSchedule.execMode = "SCHEDULED";
                this.constructScheduleAttributes();
                if (this.repeatCount.value === "" || this.repeatCount.value === undefined)  return false;
                if (this.scheduleJob.repeatPattern.repeatAttributes.endType === "After" && (this.occurrences.value === "" || this.occurrences.value === undefined)) {
                    return false;
                }
                if (this.scheduleJob.repeatPattern.view.getRepeatCheckbox().getProperty("checked") === true) {
                    if (this.scheduleJob.repeatPattern.view.getEndNever().getProperty("checked") === false && this.scheduleJob.repeatPattern.view.getEndAfter().getProperty("checked") === false && this.scheduleJob.repeatPattern.view.getEndOn().getProperty("checked") === false) {
                        return false;
                    }
                }
                this.pushStartdate();
            }
            //else if ( (this.scheduleJob.mainSchedule.execMode === "constructScheduleAttributes" || !this.isRepeatSupported ) &&
            else if ( (this.scheduleJob.mainSchedule.execMode === "SCHEDULED" || !this.isRepeatSupported ) &&
                       this.isStartDateValid) {
                this.mainSchedule.execMode = "SCHEDULED";
                this.pushStartdate();
                return true;
            }

            this.model.setAttribute('mainSchedule', this.mainSchedule);
            if (this.scheduleStep === true) {
                return true;
            } else {
                return false;
            }
        },

        validateAndGetServerTime: function () {
            ServerDateUtil.triggerServerTimeCall(this.verifyScheduleDate.bind(this), this.showFailureMessage.bind(this));
        },

        showFailureMessage: function (errorMessage) {
            if (errorMessage) {
                errorMessage.attachTo(this.view.getElement());
            }
        }
    });
});
