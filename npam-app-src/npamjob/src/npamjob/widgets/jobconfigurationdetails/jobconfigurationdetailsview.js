define([
    'jscore/core',
    'text!./jobconfigurationdetails.html',
    'styles!./jobconfigurationdetails.less',
    'i18n!npamjob/dictionary.json'
], function (core, template, styles, language) {
    var CLASSNAME = ".eaNpamjob-wJobConfigurationDetails-", jobContent = "JobContent-", configContent = 'ConfigurationContent-';
    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return styles;
        },

        setHeader: function (header) {
            this.getElement().find(CLASSNAME+"Header").setText(header);
        },

        setJobHeader: function (jobHeader) {
            this.getElement().find(CLASSNAME+"JobHeader").setText(jobHeader);
        },

        setJobDescriptionKey: function (descriptionKey) {
            this.getElement().find(CLASSNAME+jobContent+"JobDescription-Key").setText(descriptionKey);
        },

        setJobDescriptionValue: function (descriptionValue) {
            this.getElement().find(CLASSNAME+jobContent+"JobDescription-Value").setText(descriptionValue);
        },

        setJobTypeKey: function (typeKey) {
            this.getElement().find(CLASSNAME+jobContent+"JobType-Key").setText(typeKey);
        },

        setJobTypeValue: function (typeValue) {
            this.getElement().find(CLASSNAME+jobContent+"JobType-Value").setText(typeValue);
        },

        setJobCreatedByKey: function (createdByKey) {
            this.getElement().find(CLASSNAME+jobContent+"JobCreatedBy-Key").setText(createdByKey);
        },

        setJobCreatedByValue: function (createdByValue) {
            this.getElement().find(CLASSNAME+jobContent+"JobCreatedBy-Value").setText(createdByValue);
        },

        setJobCreatedOnKey: function (createdOnKey) {
            this.getElement().find(CLASSNAME+jobContent+"JobCreatedOn-Key").setText(createdOnKey);
        },

        setJobCreatedOnValue: function (createdOnValue) {
            this.getElement().find(CLASSNAME+jobContent+"JobCreatedOn-Value").setText(createdOnValue);
        },

        setFilename: function (filenameKey, filenameValue) {
            if ( filenameValue ) {
                this.getElement().find(CLASSNAME+jobContent+"Filename").setStyle("display", "block");
                this.getElement().find(CLASSNAME+jobContent+"Filename-Key").setText(filenameKey);
                this.getElement().find(CLASSNAME+jobContent+"Filename-Value").setText(filenameValue);
            } else {
                this.getElement().find(CLASSNAME+jobContent+"Filename").setStyle("display", "none");
            }
        },

        setUsername: function (usernameKey, usernameValue) {
            if ( usernameValue ) {
                this.getElement().find(CLASSNAME+jobContent+"Username").setStyle("display", "block");
                this.getElement().find(CLASSNAME+jobContent+"Username-Key").setText(usernameKey);
                this.getElement().find(CLASSNAME+jobContent+"Username-Value").setText(usernameValue);
            } else {
                this.getElement().find(CLASSNAME+jobContent+"Username").setStyle("display", "none");
            }
        },

        setPassword: function (passwordKey, passwordValue) {
            if ( passwordValue ) {
                this.getElement().find(CLASSNAME+jobContent+"Password").setStyle("display", "block");
                this.getElement().find(CLASSNAME+jobContent+"Password-Key").setText(passwordKey);
//                this.getElement().find(CLASSNAME+jobContent+"Password-Value").setText(passwordValue);

                var passwordValuePlainText = passwordValue;
                var passwordValueHtml = this.getElement().find(CLASSNAME+jobContent+"Password-Value");
                var passwordValueEye = this.getElement().find(CLASSNAME+jobContent+"Password-eye");

                passwordValueHtml.setText("******");
                passwordValueEye.setModifier("eye");

                passwordValueEye.addEventHandler('click', function (e) {
                    if ( passwordValueHtml.hasModifier("password") ) {
                        passwordValueHtml.setText(passwordValuePlainText);
                        passwordValueHtml.removeModifier("password");
                        passwordValueEye.removeModifier("eye");
                        passwordValueEye.setModifier("eyeLine");
                    } else {
                        passwordValueHtml.setText("******");
                        passwordValueHtml.setModifier("password");
                        passwordValueEye.removeModifier("eyeLine");
                        passwordValueEye.setModifier("eye");
                     }
                }.bind(this));
            } else {
                this.getElement().find(CLASSNAME+jobContent+"Password").setStyle("display", "none");
            }

        },

        hideProperties: function () {
            this.getElement().find(CLASSNAME+jobContent+"Filename").setStyle("display", "none");
            this.getElement().find(CLASSNAME+jobContent+"Username").setStyle("display", "none");
            this.getElement().find(CLASSNAME+jobContent+"Password").setStyle("display", "none");
        },


        setConfigurationHeader: function (configurationHeader) {
            this.getElement().find(CLASSNAME+"ConfigurationHeader").setText(configurationHeader);
        },

        setConfigurationStartTimeKey: function (startTimeKey) {
            this.getElement().find(CLASSNAME+configContent+"ConfigurationStartTime-Key").setText(startTimeKey);
        },

        setConfigurationStartTimeValue: function (startTimeValue) {
            this.getElement().find(CLASSNAME+configContent+"ConfigurationStartTime-Value").setText(startTimeValue);
        },

        setConfigurationModeKey: function (modeKey) {
            this.getElement().find(CLASSNAME+configContent+"ConfigurationMode-Key").setText(modeKey);
        },

        setConfigurationModeValue: function (modeValue) {
            this.getElement().find(CLASSNAME+configContent+"ConfigurationMode-Value").setText(modeValue);
        },

        getPeriodicConfigurationHolder: function () {
            return this.getElement().find(CLASSNAME+"ConfigurationContentHolder");
        },

        hideJobTypeHeader: function () {
            this.getJobTypeHolder().setStyle("display", "none");
        },

        hidePeriodicValues: function () {
            this.getElement().find(CLASSNAME+"ConfigurationContentHolder").setStyle("display", "none");
        },

        showPeriodicValues: function () {
            this.getElement().find(CLASSNAME+"ConfigurationContentHolder").setStyle("display", "inline");
        },

        showJobTypeHeader: function () {
            this.getJobTypeHolder().setStyle("display", "block");
        },

        getJobTypeHolder: function() {
            return this.getElement().find(CLASSNAME+"JobTypeHeader");
        },

        setJobTypeHeader: function (jobTypeHeader) {
            this.showJobTypeHeader();
            this.getJobTypeHolder().setText(jobTypeHeader);
        },

        getJobTypeContent: function () {
            return this.getElement().find(CLASSNAME+"JobTypeContent");
        },

        getContentHolder: function () {
            return this.getElement().find(CLASSNAME+"ContentHolder");
        },

        showContentHolder: function() {
            this.getContentHolder().removeModifier("hide");
            this.getContentHolder().setModifier("show");
        },

        hideContentHolder: function() {
            this.getContentHolder().removeModifier("show");
            this.getContentHolder().setModifier("hide");
        },

        setDefaultMessage: function (message) {
            this.getDefaultMessage().setText(message);
        },

        hideDefaultMsg: function() {
            this.getDefaultMessage().removeModifier("show");
            this.getDefaultMessage().setModifier("hide");
        },

        showDefaultMsg: function() {
            this.getDefaultMessage().removeModifier("hide");
            this.getDefaultMessage().setModifier("show");
        },

        getDefaultMessage: function () {
            return this.getElement().find(CLASSNAME+"DefaultMessage");
        },

        getNeTypeSelectHolder: function () {
            return this.getElement().find(CLASSNAME+"neTypeSelectBox");
        },

        getNeTypeLabel: function () {
            return this.getElement().find(CLASSNAME+"neType");
        },

        setNeTypeLabel: function () {
            this.getNeTypeLabel().setText(language.get('neType'));
        },

        getLoaderHolder: function () {
            return this.getElement().find(CLASSNAME+"loaderHolder");
        },

        enableNeType: function() {
            this.getNeTypeSelectHolder().removeModifier("hide");
            this.setNeTypeLabel();
            this.getNeTypeLabel().removeModifier("hide");
        },
        getAccordionsHolder: function () {
            return this.getElement().find(CLASSNAME + "JobTypeContent");
        }
    });
})
;
