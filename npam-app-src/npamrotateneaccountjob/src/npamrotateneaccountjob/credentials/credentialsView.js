/*global define*/
define([
    'jscore/core',
    'text!./credentials.html',
    'styles!./credentials.less'
], function (core, template, style) {
    'use strict';
    var NAME = ".eaNpamrotateneaccountjob-wJobdetails-";
    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return style;
        },

        getDefaultMsgHolder: function() {
           return this.getElement().find(".eaNpamrotateneaccountjob-defaultMsg");
        },

        setProcessDescription: function (txt) {
            this.getDefaultMsgHolder().setText(txt);
        },

        setPlaceHolder: function (txt1, txt2) {
            this.getJobNameHolder().setAttribute("placeholder", txt1);
            this.getJobDescription().setAttribute("placeholder", txt2);
        },

        setErrorMsg: function (txt) {
            this.getElement().find(NAME+"errorMsg").setText(txt);
        },

        setAddNodesMsg: function (txt) {
            this.getElement().find(NAME+"addNodes").setText(txt);
        },

        setInputErrorMsgForJobName: function (txt) {
            this.getElement().find(".ebInput-statusError").setText(txt);
        },

        getCredRadioButton: function() {
            return this.getElement().find(".eaNpamrotateneaccountjob-wCreddetails-credentials-radioButton");
        },

        getCredInfoButton: function() {
            return this.getElement().find(".eaNpamrotateneaccountjob-wCreddetails-credentials-infoButton");
        },

        getCredFields: function() {
            return this.getElement().find(".eaNpamrotateneaccountjob-wCreddetails-credentials-fields");
        },

        getErrorMsgHolder: function() {
            return this.getElement().find(NAME+"errorMessage");
        },

        hideErrorMessage: function () {
            this.getErrorMsgHolder().setStyle("display", "none");
        },

        showErrorMessage: function () {
            this.getErrorMsgHolder().setStyle("display", "block");
        },

        divTopLeft: function () {
            return this.getElement().find(NAME+"wTopologySelection-infoPopup-TopLeft");
        },

        getPopUpHolder: function () {
            return this.getElement().find(NAME+"wTopologySelection-infoPopupHolder");
        },

        getErrorMessageHolder: function () {
            return this.getElement().find(".eaNpamrotateneaccountjob-errorMessage-holder");
        },

    });

});
