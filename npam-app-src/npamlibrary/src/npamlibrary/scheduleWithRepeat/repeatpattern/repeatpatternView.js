/**
 * Created with IntelliJ IDEA.
 * User: tcsyako
 * Date: 9/23/14
 * Time: 2:51 PM
 * To change this template use File | Settings | File Templates.
 */
define([
    'jscore/core',
    'text!./repeatpattern.html',
    'styles!./repeatpattern.less'
], function (core, template, style) {
    
    var CLASSNAME = ".eaNpamlibrary-wRepeatPattern-";
    
    return core.View.extend({
        
        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return style;
        },
        setRepeatHeading: function (txt) {
            this.getElement().find(CLASSNAME+"repeatCheckboxLabel").setText(txt);

        },
        setRepeatsLabel: function (txt) {
            this.getElement().find(CLASSNAME+"repeatTypeSelectBoxLabel").setText(txt);

        },
        setRepeatPattern: function (txt) {
            this.getElement().find(".eaNpamlibrary-repeatPattern").setText(txt);

        },
        setRepeatPeriodType: function (txt) {
            this.getElement().find(CLASSNAME+"repeatPeriodType").setText(txt);

        },
//        setRepeatsOn: function (txt) {
//            this.getElement().find(CLASSNAME+"repeatWeekDayLabel").setText(txt);
//
//        },
        setRepeatEvery: function (txt) {
            this.getElement().find(CLASSNAME+"repeatPeriodLabel").setText(txt);

        },
//        setMondayLabel: function (txt) {
//            this.getElement().find(".eaNpamlibrary-monday").setText(txt);
//
//        },
//        setTuesdayLabel: function (txt) {
//            this.getElement().find(".eaNpamlibrary-tuesday").setText(txt);
//
//        },
//        setWednesdayLabel: function (txt) {
//            this.getElement().find(".eaNpamlibrary-wednesday").setText(txt);
//
//        },
//        setThursdayLabel: function (txt) {
//            this.getElement().find(".eaNpamlibrary-thursday").setText(txt);
//
//        },
//        setFridayLabel: function (txt) {
//            this.getElement().find(".eaNpamlibrary-friday").setText(txt);
//
//        },
//        setSaturdayLabel: function (txt) {
//            this.getElement().find(".eaNpamlibrary-saturday").setText(txt);
//
//        },
//        setSundayLabel: function (txt) {
//            this.getElement().find(".eaNpamlibrary-sunday").setText(txt);
//
//        },
        setEndsLabel: function (txt) {
            this.getElement().find(CLASSNAME+"repeatEndLabel").setText(txt);

        },
        setNeverLabel: function (txt) {
            this.getElement().find(CLASSNAME+"repeatEndNeverLabel").setText(txt);

        },
        setAfterLabel: function (txt) {
            this.getElement().find(CLASSNAME+"repeatEndAfterLabel").setText(txt);

        },
        setOccurrencesLabel: function (txt) {
            this.getElement().find(".eaNpamlibrary-occurrences").setText(txt);

        },
        setOnLabel: function (txt) {
            this.getElement().find(CLASSNAME+"repeatEndOnLabel").setText(txt);

        },
        getRepeatCheckbox: function () {
            return this.getElement().find(CLASSNAME+"repeatCheckbox");
        },

        getRepeatTitle: function () {
            return this.getElement().find(CLASSNAME+"repeatTitle");
        },

        getRepeatTitleUnderLine: function () {
            return this.getElement().find(CLASSNAME+"repeatTitleUnderLine");
        },

        getRepeatSelectBoxLabel: function () {
            return this.getElement().find(CLASSNAME+"repeatTypeSelectBoxLabel");
        },

        getRepeatPeriodLabel: function () {
            return this.getElement().find(CLASSNAME+"repeatPeriodLabel");
        },

        getRepeatPeriodType: function () {
            return this.getElement().find(CLASSNAME+"repeatPeriodType");
        },

        getRepeatTypeSelectBox: function () {
            return this.getElement().find(CLASSNAME+"repeatTypeSelectBox");
        },

        getRepeatPeriodTextBox: function () {
            return this.getElement().find(CLASSNAME+"repeatPeriod");
        },

//        getRepeatWeekDayLabel: function () {
//            return this.getElement().find(CLASSNAME+"repeatWeekDayLabel");
//        },
//
//        getRepeatWeekDayHolder: function () {
//            return this.getElement().find(CLASSNAME+"repeatWeekDayHolder");
//        },
//
//        getRepeatWeekDayCheckboxes: function () {
//            return this.getElement().find(CLASSNAME+"repeatWeekDay");
//        },

        getEndLabel: function () {
            return this.getElement().find(CLASSNAME+"repeatEndLabel");
        },

        getEndRadioButtons: function () {
            return this.getElement().find(CLASSNAME+"repeatEndOptionHolder");
        },

        getEndNever: function () {
            return this.getElement().find(CLASSNAME+"repeatEndNever");
        },

        getEndNeverLabel: function () {
            return this.getElement().find(CLASSNAME+"repeatEndNeverLabel");
        },

        getEndAfter: function () {
            return this.getElement().find(CLASSNAME+"repeatEndAfter");
        },

        getEndAfterLabel: function () {
            return this.getElement().find(CLASSNAME+"repeatEndAfterLabel");
        },

        getEndAfterText: function () {
            return this.getElement().find(CLASSNAME+"repeatEndAfterText");
        },

        getEndAfterOccurrencesTextBox: function () {
            return this.getElement().find(CLASSNAME+"repeatEndAfterTextBox");
        },

        getEndOn: function () {
            return this.getElement().find(CLASSNAME+"repeatEndOn");
        },

        getEndOnLabel: function () {
            return this.getElement().find(CLASSNAME+"repeatEndOnLabel");
        },

        getRepeatEndOnDateTime: function () {
            return this.getElement().find(CLASSNAME+"repeatEndOnDateTime");
        },

        showErrorType: function () {
            return this.getElement().find(".ebInput-statusError");
        },

        getSpecificDayElement: function (day) {
            return this.getElement().find('.eaNpamlibrary-wRepeatPattern-' + day).children()[0];
        },

        getRepeatMaxLengthInfo: function () {
            return this.getElement().find(CLASSNAME+"repeatPeriodInfo");
        },

        getEndAfterMaxLengthInfo: function () {
            return this.getElement().find(CLASSNAME+"repeatEndAfterTextInfo");
        }
    });
});
