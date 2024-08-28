define([
    'jscore/core',
    'text!./schedulejob.html',
    'styles!./schedulejob.less'
], function (core, template, style) {
    var CLASSNAME = ".eaNpamlibrary-wScheduleJob-";
    return core.View.extend({

        getTemplate: function () {
            return template;
        },
        getStyle: function () {
            return style;
        },

        setStartLabel: function (txt) {
            this.getElement().find(CLASSNAME+"scheduleOptionsLabel").setText(txt);

        },
        setSchdMsg: function (txt) {
            this.getElement().find(CLASSNAME+"defaultMessageForStep").setText(txt);

        },
        getScheduleOptionSelectBox: function () {
            return this.getElement().find(CLASSNAME+"scheduleOptionsSelectBox");
        },
        getManualRadioButton: function () {
            return this.getElement().find(CLASSNAME+"manualRadioButton");
        },
        getImmediateRadioButton: function () {
            return this.getElement().find(CLASSNAME+"immediateRadioButton");
        },
        getDateAndTimeRadioButton: function () {
            return this.getElement().find(CLASSNAME+"dateAndTimeRadioButton");
        },
        getDateTimeWidgetHolder: function () {
            return this.getElement().find(CLASSNAME+"dateTimeWidgetHolder");
        },
        getRepeatPatternHolder: function () {
            return this.getElement().find(CLASSNAME+"repeatPatternHolder");
        },
        errorMessage: function () {
            return this.getElement().find(".ebInput-statusError");
        }

    });
});
