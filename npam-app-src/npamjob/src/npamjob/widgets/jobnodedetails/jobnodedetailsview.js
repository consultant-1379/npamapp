define([
    'jscore/core',
    'text!./jobnodedetails.html',
    'styles!./jobnodedetails.less',
    'i18n!npamjob/dictionary.json',
    'i18n!npamlibrary/dictionary.json'
], function (core, template, styles, language, libLanguage) {
    var CLASSNAME = ".eaNpamjob-wJobNodeDetails-", jobContent = "JobContent-";
    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return styles;
        },

        showComponent: function () {
            this.showHolder(this.getContentHolder());
            this.showHolder(this.getAccordionsHolder());
//            this.showHolder(this.getNoOfNodesHolder());
        },

        hideComponent: function () {
            this.hideHolder(this.getContentHolder());
            this.hideHolder(this.getAccordionsHolder());
//            this.hideHolder(this.getNoOfNodesHolder());
            this.hideHolder(this.getDefaultMessage());
            this.hideHolder(this.getErrorMsgHolder());
        },

        hideHolder: function (holder) {
            holder.removeModifier("show");
            holder.setModifier("hide");
        },

        showHolder: function (holder) {
            holder.removeModifier("hide");
            holder.setModifier("show");
        },

        showLoader: function () {
            this.showHolder(this.getLoaderHolder());
        },

        hideLoader: function () {
            this.hideHolder(this.getLoaderHolder());
        },

        showErrorMsg: function () {
            this.showHolder(this.getErrorMsgHolder());
        },

        hideErrorMsg: function () {
            this.hideHolder(this.getErrorMsgHolder());
        },

        showDefaultMsg: function () {
            this.showHolder(this.getDefaultMessage());
        },

        hideDefaultMsg: function () {
            this.hideHolder(this.getDefaultMessage());
        },

        getLoaderHolder: function () {
            return this.getElement().find(CLASSNAME + "loaderHolder");
        },

        getContentHolder: function () {
            return this.getElement().find(CLASSNAME + "ContentHolder");
        },

        setJobHeader: function (jobHeader) {
            this.getElement().find(CLASSNAME + "JobHeader").setText(jobHeader);
        },

//        setNumberOfNodes: function (nodeNumberValue) {
//            this.getElement().find(CLASSNAME + jobContent + "numberOfNodes-Key").setText(language.get('totalnoNodes') + ":");
//            this.getElement().find(CLASSNAME + jobContent + "numberOfNodes-Value").setText(nodeNumberValue);
//        },

//        setNumberOfNodesSkipped: function (value) {
//            this.getElement().find(CLASSNAME + jobContent + "numberOfNodesSkipped-Key").setText(language.get('noNodes') + " " + libLanguage.get('skipped') + ":");
//            this.getElement().find(CLASSNAME + jobContent + "numberOfNodesSkipped-Value").setText(value);
//        },
//
//        getViewJobNodeInventory: function () {
//            return this.getElement().find(CLASSNAME + jobContent +     "ViewJobNodeInventory");
//        },
//        getNoOfNodesHolder: function () {
//            return this.getElement().find(CLASSNAME + jobContent + "numberOfNodes");
//        },
        getAccordionsHolder: function () {
            return this.getElement().find(CLASSNAME + jobContent + "accordionHolder");
        },
        getErrorMsgHolder: function () {
            return this.getElement().find(CLASSNAME + jobContent + "errorMsgHolder");
        },
        setErrorMsg: function (text) {
            return this.getElement().find(CLASSNAME + jobContent + "errorMsgHolder-message").setText(text);
        },
        getDefaultMessage: function () {
            return this.getElement().find(CLASSNAME + "DefaultMessage");
        }//,

//        getExportBtn: function (){
//            return this.getElement().find(CLASSNAME + "export");
//        },
//
//        getExportErrorNotificationHolder: function () {
//            return this.getElement().find(CLASSNAME + "notificationHolder");
//        }
    });
});
