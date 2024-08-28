define([
    'jscore/core',
    "./ScheduleJobView",
    "widgets/SelectBox",
    "npamlibrary/repeatpattern",
    "widgets/PopupDatePicker",
    'i18n!npamlibrary/dictionary.json',
    'npamlibrary/dateUtil'
], function (core, View, SelectBox, RepeatPattern, PopupDatePicker, libLanguage, DateUtil) {

    return core.Widget.extend({

        View: View,

        init: function (eventBus) {
            this.isRepeatPatternSupported = false;
            this.eventBus = eventBus;
            this.dateTimePicker = new PopupDatePicker({
                showTime: true,
                labels: {
                    YYYY: libLanguage.get('popupDatePickerLabels.YYYY'),
                    MM: libLanguage.get('popupDatePickerLabels.MM'),
                    DD: libLanguage.get('popupDatePickerLabels.DD'),
                    hh: libLanguage.get('popupDatePickerLabels.hh'),
                    mm: libLanguage.get('popupDatePickerLabels.mm'),
                    ss: libLanguage.get('popupDatePickerLabels.ss'),
                    hours: libLanguage.get('popupDatePickerLabels.hours'),
                    minutes: libLanguage.get('popupDatePickerLabels.minutes'),
                    seconds: libLanguage.get('popupDatePickerLabels.seconds')
                }
            });
            this.repeatPattern = new RepeatPattern();
            this.mainSchedule = Object.create(Object.prototype);
            this.mainSchedule.scheduleAttributes = [];
            this.dateAndTime = Object.create(Object.prototype);

            this.scheduleModeValues = {
                Immediate: {
                    name: libLanguage.get('scheduleImmediately'),
                    value: libLanguage.get('scheduleImmediately'),
                    title: libLanguage.get('scheduleImmediately'),
                    action: this.scheduleImmediate.bind(this)
                },
                Scheduled: {
                    name: libLanguage.get('scheduledExecution'),
                    value: libLanguage.get('scheduledExecution'),
                    title: libLanguage.get('scheduledExecution'),
                    action: this.scheduleOnDate.bind(this)
                }//,
//                Manual: {
//                    name: libLanguage.get('scheduleLater'),
//                    value: libLanguage.get('scheduleLater'),
//                    title: libLanguage.get('scheduleLater'),
//                    action: this.scheduleManual.bind(this)
//                }
            };

            this.scheduleOptionSelectBox = new SelectBox({
                value: this.scheduleModeValues.Immediate,
                items: [
                    this.scheduleModeValues.Immediate,
                    this.scheduleModeValues.Scheduled//,
//                    this.scheduleModeValues.Manual
                ]
            });
            this.scheduleOptionSelectBox.view.getButton().setStyle("width", "230px");
            this.scheduleOptionSelectBox.view.getElement().setStyle("width", "230px");
            this.scheduleOptionSelectBox.view.getButton().find(".ebSelect-value").setStyle("width", "200px");
            this.scheduleOptionSelectBox.setWidth("230px");
            this.scheduleOptionSelectBox.onItemSelected = function (selectedVal) {
                this.setValue(selectedVal);
                selectedVal.action();
                this.getElement().trigger("change");
            };

        },

        onViewReady: function () {
            this.eventBus.subscribe('detailsNodeSelection:scheduleMode', this.setScheduleMode.bind(this));
            this.scheduleOptionSelectBox.attachTo(this.view.getScheduleOptionSelectBox());
            this.view.setStartLabel(libLanguage.get('start'));
        },

        onAttach: function() {
            this.view.setSchdMsg(libLanguage.get('schdMsg').replace("<replace>", localStorage.getItem("jobTitle")));
        },

//        scheduleManual: function () {
//            this.setScheduleValues("MANUAL");
//        },

        enableRepeatFeature: function() {
            this.isRepeatPatternSupported = true;
            this.repeatPattern.activateRepeatCheckbox();
        },

        disableRepeatFeature: function() {
            this.isRepeatPatternSupported = false;
            this.repeatPattern.deactivateRepeatCheckbox();
        },

        scheduleImmediate: function () {
            this.setScheduleValues("IMMEDIATE");
        },

        setScheduleValues: function(mode) {
            this.repeatPattern.detach();
            this.dateTimePicker.view.getCancelButton().trigger("click");
            this.repeatPattern.view.getRepeatCheckbox().setProperty('checked', false);
            this.dateTimePicker.detach();
            this.mainSchedule.execMode = mode;
            this.mainSchedule.scheduleAttributes = [];
        },

        scheduleOnDate: function () {
            this.dateTimePicker.attachTo(this.view.getDateTimeWidgetHolder());
            if ( this.isRepeatPatternSupported ) {
                this.repeatPattern.activateRepeatCheckbox();
                this.repeatPattern.attachTo(this.view.getRepeatPatternHolder());
                this.repeatPattern.view.showErrorType().setAttribute("style", "display:none");
            }
            this.mainSchedule.execMode = "SCHEDULED";
        },

        setScheduleMode: function (scheduleMode, scheduleJobConfiguration) {
            //Set schedule select box value with old job's schedule mode.
            this.scheduleOptionSelectBox.setValue(this.scheduleModeValues[scheduleMode]);

            //If job execution is scheduled, set it's parameters.
            if (scheduleJobConfiguration && scheduleJobConfiguration.startDate) {
                var startDate = DateUtil.formatDate(scheduleJobConfiguration.startDate, true);
                //set value to Schedule date time picker.
                this.dateTimePicker.setValue(startDate);
                this.dateTimePicker.trigger('dateselect');

                //If repeat options were enabled, set those values as well.
                if (scheduleJobConfiguration.repeatType !== null) {
                    this.repeatPattern.setDuplicateJobValuesToRepeatWidget(scheduleJobConfiguration);
                }
            }
        }
    });
});