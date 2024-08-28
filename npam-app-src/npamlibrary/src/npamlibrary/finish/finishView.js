/*global define*/
define([
    'jscore/core',
    'text!./finish.html',
    'styles!./finish.less'
], function (core, template, style) {
    'use strict';
    var CLASSNAME = ".eaNpamlibrary-finish-";
    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return style;
        },
        setSummaryDefaultMsg: function (txt) {
            this.getElement().find(CLASSNAME+"defaultMessageForStep").setText(txt);
        },
        setNodesSelected: function (txt) {
            this.getElement().find(CLASSNAME+"nodeslabel").setText(txt);
        },
        setScopeSelected: function (txt) {
            this.getElement().find(CLASSNAME+"scopelabel").setText(txt);
        },
        setRepeatType: function (txt) {
            this.getElement().find(".eaNpamlibrary-repeatType").setText(txt);
        },
        setSummaryErrorMsg: function (txt) {
            this.getElement().find(CLASSNAME+"ErrorMsg").setText(txt);
        },
        setCredType: function(txt) {
            this.getElement().find(CLASSNAME+"credlabel").setText(txt);
        },
        setStartDate: function (txt) {
            this.getElement().find(".eaNpamlibrary-startDate").setText(txt);
        },
        setSchedule: function (txt) {
            this.getElement().find(".eaNpamlibrary-schedule").setText(txt);
        },
        setRepeats: function (txt) {
            this.getElement().find(".eaNpamlibrary-repeats").setText(txt);
        },
        setEndsTitle: function (txt) {
            this.getElement().find(".eaNpamlibrary-ends").setText(txt);
        },
//        setRepeatsOn: function (txt) {
//            this.getElement().find(".eaNpamlibrary-repeatsOn").setText(txt);
//        },
        getJobName: function () {
            return this.getElement().find(CLASSNAME+"jobname");
        },

        getJobNameErrorMsgHolder: function() {
            return this.getElement().find(".eaNpamlibrary-finish-jobnameError");
        },
        hideJobNameError: function() {
            this.getJobNameErrorMsgHolder().setAttribute("style", "display:none");
        },
        showJobNameError: function() {
            this.getJobNameErrorMsgHolder().setAttribute("style", "display:inline-block");
        },
        setJobNameErrorMsg: function(txt) {
            this.getJobNameErrorMsgHolder().setText(txt);
        },

        getNodes: function () {
            return this.getElement().find(CLASSNAME+"nodes");
        },

        getScope: function () {
            return this.getElement().find(CLASSNAME+"scope");
        },

        getCredentials: function() {
            return this.getElement().find(CLASSNAME+"cred");
        },

        getFilename: function () {
            return this.getElement().find(CLASSNAME+"filename");
        },

        getFiletype: function () {
            return this.getElement().find(CLASSNAME+"filetype");
        },

        getIdentity: function () {
            return this.getElement().find(CLASSNAME+"identity");
        },
        getProperties: function () {
            return this.getElement().find(CLASSNAME+"properties-selected");
        },

        getSchedule: function () {
            return this.getElement().find(CLASSNAME+"schedule");
        },

        getScheduleStartDateHolder: function () {
            return this.getElement().find(CLASSNAME+"startdateholder");
        },

        getScheduleStartDate: function () {
            return this.getElement().find(CLASSNAME+"startdate");
        },

        getScheduleRepeatCountHolder: function () {
            return this.getElement().find(CLASSNAME+"repeatcountholder");
        },

        getScheduleRepeatCount: function () {
            return this.getElement().find(CLASSNAME+"repeatcount");
        },

        getScheduleRepeatTypeHolder: function () {
            return this.getElement().find(CLASSNAME+"repeattypeholder");
        },

        getScheduleRepeatType: function () {
            return this.getElement().find(CLASSNAME+"repeattype");
        },

//        getScheduleRepeatOnHolder: function () {
//            return this.getElement().find(CLASSNAME+"repeatonholder");
//        },
//
//        getScheduleRepeatOn: function () {
//            return this.getElement().find(CLASSNAME+"repeaton");
//        },

        getScheduleEndHolder: function () {
            return this.getElement().find(CLASSNAME+"endholder");
        },

        getScheduleEnd: function () {
            return this.getElement().find(CLASSNAME+"end");
        },

        getStatusError: function () {
            return this.getElement().find(".eaNpamlibrary-finish-ErrorMsg");
        },
        getActivitiesHolder: function () {
            return this.getElement().find(CLASSNAME+"properties-selected");
        },

        getCredentialsHolder: function() {
            return this.getElement().find(".eaNpamlibrary-finish-row-credentials");
        },

        getNodesHolder: function() {
            return this.getElement().find(".eaNpamlibrary-finish-row-nodes");
        },

        getScopeHolder: function() {
            return this.getElement().find(".eaNpamlibrary-finish-row-scope");
        },

        getDescLabelHolder: function () {
            return this.getElement().find(CLASSNAME+"descLabel");
        },

        setDescLabel: function(txt) {
           this.getDescLabelHolder().setText(txt);
        },

        getDescHolder: function() {
            return this.getElement().find(CLASSNAME+"desc");
        },

        setDescription: function(txt) {
            this.getDescHolder().setText(txt);
        }
    });

});
