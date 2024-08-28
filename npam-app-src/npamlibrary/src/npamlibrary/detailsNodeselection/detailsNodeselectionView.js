/*global define*/
define([
    'jscore/core',
    'text!./detailsNodeselection.html',
    'styles!./detailsNodeselection.less'
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

        getJobDescription: function () {
            return this.getElement().find(NAME+"jobDescriptionBox");
        },

        setJobDescription: function (text) {
            this.getJobDescription().setValue(text);
        },

        getTopologyButtonHolder: function () {
            return this.getElement().find(NAME+"TopologyButton");
        },

        getTopologySelectionButtonHolder: function () {
            return this.getElement().find(NAME+"wTopologySelection-Holder");
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

        getAccordion: function() {
            return this.getElement().find(".eaNpamlibrary-accordion");
        },

        hideAccordionHolderDiv: function () {
            this.getAccordion().setStyle("display", "none");
        },
        
        showAccordionHolderDiv: function () {
            this.getAccordion().setStyle("display", "block");
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
        },

        getSelection: function(){
            return this.getElement().find(NAME+"selection");
        },

        getSelectionHeader: function(){
            return this.getElement().find(NAME+"selectionHeader");
        },

        getTopologySection: function(){
            return this.getElement().find(NAME+"wTopologySelection-topologySection");
        },

        hideTopologySection: function(){
            this.getTopologySection().setStyle('display','none');
        },

        showTopologySection: function(){
            this.getTopologySection().setStyle('display','block');
        },

        getComponentContent: function(){
            return this.getElement().find(NAME+"wTopologySelection-componentContent");
        },

        hideComponentContent: function(){
            this.getComponentContent().setStyle('display','none');
        },

        showComponentContent: function(){
            this.getComponentContent().setStyle('display','block');
        },

        getSelectionHeaderNotification: function() {
            return this.getElement().find(NAME+"selectionHeaderNotification");
        },

        setSelectionHeaderNotification: function(txt) {
            this.getSelectionHeaderNotification().setText(txt);
        },

        hideSelectionHeaderNotification: function() {
            this.getSelectionHeaderNotification().setStyle('display','none');
        },

        showSelectionHeaderNotification: function() {
            this.getSelectionHeaderNotification().setStyle('display','block');
        },

        getSelectionLoaderHolder: function() {
            return this.getElement().find(NAME+"selection-loadingIcons");
        },

        showSelectionLoaders:  function() {
            this.getSelectionLoaderHolder().setStyle('display','block');
        },

        hideSelectionLoaders:  function() {
            this.getSelectionLoaderHolder().setStyle('display','none');
        },

        getSelectionWidgetHolder: function() {
            return this.getElement().find(NAME+"selection-widget");
        }
    });

});
