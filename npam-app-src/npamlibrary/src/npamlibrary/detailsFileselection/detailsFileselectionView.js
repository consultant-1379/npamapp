/*global define*/
define([
    'jscore/core',
    'text!./detailsFileselection.html',
    'styles!./detailsFileselection.less'
], function (core, template, style) {
    'use strict';
    var NAME = ".eaNpamlibrary-wJobdetails-";
    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return style;
        },

        getDefaultMsgHolder: function() {
           return this.getElement().find(".eaNpamlibrary-defaultMsg");
        },

        setProcessDescription: function (txt) {
            this.getDefaultMsgHolder().setText(txt);
        },

        setPlaceHolder: function (txt1, txt2) {
            this.getJobNameHolder().setAttribute("placeholder", txt1);
            this.getJobDescription().setAttribute("placeholder", txt2);
        },

        setJobDesc: function (txt) {
            this.getElement().find(NAME+"jobDescription").setText(txt);
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

        setJobName: function (txt) {
            this.getElement().find(NAME+"jobName").setText(txt);
        },

        getJobName: function () {
            return this.getJobNameHolder().getValue().trim();
        },

        getJobNameHolder: function () {
            return this.getElement().find(NAME+"jobNameTextBox");
        },

        setJobNameText: function (jobName) {
            this.getJobNameHolder().setValue(jobName);
        },

        getFileName: function () {
            return this.getFileNameHolder().getValue();
        },

        setFileName: function (txt) {
             this.getElement().find(NAME+"fileName").setText(txt);
        },

        getFileNameHolder: function () {
            return this.getElement().find(NAME+"fileNameList");
        },

        getJobDescription: function () {
            return this.getElement().find(NAME+"jobDescriptionBox");
        },

        setJobDescription: function (text) {
            this.getJobDescription().setValue(text);
        },

        getJobNameInputMsgHolder: function() {
            return this.getElement().find(".eaNpamlibrary-rInputMessage");
        },

        showErrorMessageForJobName: function () {
            this.getJobNameInputMsgHolder().setAttribute("class", "eaNpamlibrary-rInputMessage ebInput-status_error");
        },

        hideErrorMessageForJobName: function () {
            this.getJobNameInputMsgHolder().setAttribute("class", "eaNpamlibrary-rInputMessage");
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
            return this.getElement().find(".eaNpamlibrary-errorMessage-holder");
        },

        setJobNameMaxText: function(txt){
            this.getElement().find(NAME+"inputFieldInfo").setText(txt);
        },

        setJobDescMaxText: function(txt){
            this.getElement().find(NAME+"inputFieldInfoDes").setText(txt);
        },

        getInfoHolder: function () {
            return this.getElement().find(NAME + 'infoMessage');
        },

        getLoadingIcons: function() {
            return this.getElement().find(NAME+"loadingIcons");
        },

        hideLoading: function() {
           this.getLoadingIcons().setStyle('display','none');
        },

        showLoading: function () {
            this.getLoadingIcons().setStyle("display", "inline-block");
        }

    });

});
