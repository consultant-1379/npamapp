define([
    'jscore/core',
    "container/api",
    'applib/LaunchContext',
    'layouts/WizardStep',
    './credentialsView',
    'widgets/InfoPopup',
    'npamlibrary/displaymessage',
    'widgets/Notification',
    'i18n!npamlibrary/dictionary.json',
    'npamlibrary/constants',
    "npamlibrary/radioButtonWidget",
    "npamlibrary/labelWidget"
], function (core, container, LaunchContext, WizardStep,
             View,  InfoPopup, DisplayMessage, Notification, libLanguage, Constants, RadioButtonWidget, LabelWidget ) {

    return WizardStep.extend({
        title: libLanguage.get('credentialstitle'),
        View: View,

        init: function (mainApp) {
            this.mainApp = mainApp;
            this.model = this.mainApp.model;
            this.model.setAttribute("username", "");
            this.model.setAttribute("password", "");
            this.model.setAttribute("credType", Constants.AUTO_CRED);
            this.displayErrorMessage = new DisplayMessage();
            this.infoNotification = new Notification({
                label: libLanguage.get('schedule'),
                content: 'info',
                color: 'paleBlue',
                autoDismiss: false,
                icon: 'info'
            });
            this.resetPassword = true;
            //this.mainApp.getEventBus().subscribe('validateComponent', this.validateComponent.bind(this));

        },


        onDestroy: function() {
        },

        onViewReady: function () {
            this.radioButton = new RadioButtonWidget({"value0": Constants.AUTO_CRED, "name0": libLanguage.get(Constants.AUTO_CRED + 'credLabel'),
                                                      "value1": Constants.MAN_CRED, "name1": libLanguage.get(Constants.MAN_CRED + 'credLabel'),
                                                      "group": Constants.CREDENTIALS,
                                                      "type": "radio",
                                                      "identifier": Constants.CREDENTIALS});
            this.radioButton.setValue(Constants.AUTO_CRED);
            this.model.setAttribute("credType", Constants.AUTO_CRED);
            this.radioButton.addOnClick(Constants.AUTO_CRED, this.autoCredDraw.bind(this));
            this.radioButton.addOnClick(Constants.MAN_CRED, this.manCredDraw.bind(this));
            this.username = new LabelWidget({"label": libLanguage.get("username"), "identifier": "username", "placeholder": libLanguage.get("usernamePlaceholder"), "disabled": true});
            this.username.addEventHandler('input', function() {
                this.model.setAttribute("username", this.username.getValue());
                this.revalidate();
            }.bind(this));
            this.username.attachTo(this.view.getCredFields());
            this.password = new LabelWidget({
                "label": libLanguage.get("password"),
                "identifier": "password",
                "required": true,
                "info": {content: libLanguage.get("passwordRules")},
                "type": "password",
                "disabled": true
            });
            this.password.addEventHandler('input', function() {
                this.model.setAttribute("password",this.password.getValue());
                this.revalidate();
            }.bind(this));
            this.password.attachTo(this.view.getCredFields());
            this.radioButton.attachTo(this.view.getCredRadioButton());

        },

        autoCredDraw: function() {
            this.username.disable();
            this.password.disable();
            this.resetPassword = true;
            this.mainApp.schedule.enableRepeatFeature();
            this.model.setAttribute("credType", Constants.AUTO_CRED);
            this.revalidate();
        },

        manCredDraw: function() {
            this.revalidate();
            this.model.setAttribute("credType", Constants.MAN_CRED);
            this.username.enable();
            this.password.enable();
            this.resetPassword = false;
            this.mainApp.schedule.disableRepeatFeature();
       },

        isValid: function () {
            if (this.radioButton.getValue() === Constants.AUTO_CRED) {
                return true;
            } else {
                if (!this.password || this.resetPassword === true) {
                   return false;
                } else if (this.isValidPassword(this.password.getValue())) {
                    return true;
                } else {
                    return false;
                }
            }
        },

        isValidPassword: function(password) {
            if (!password || password === "") {
                this.password.setError(libLanguage.get('passwordMustBeFilled'));
            } else if (!Constants.PASSWORD_VALIDATION_CHARS_PATTERN.test(password)) {
                this.password.setError(libLanguage.get('passwordCharNotAllowed'));
            } else if(this.username.getValue() !== "" && password.includes(this.username.getValue())) {
                this.password.setError(libLanguage.get('passwordMustNotUsername'));
            } else if (password.length < 12) {
                this.password.setError(libLanguage.get('passwordMustAtLeast12'));
            } else if (!Constants.PASSWORD_VALIDATION_2DIGITS_PATTERN.test(password)) {
                this.password.setError(libLanguage.get('passwordMustAtLeast2Digits'));
            } else if (!Constants.PASSWORD_VALIDATION_3UPPER_PATTERN.test(password)) {
                this.password.setError(libLanguage.get('passwordMustAtLeast3Upper'));
            } else if (!Constants.PASSWORD_VALIDATION_3LOWER_PATTERN.test(password)) {
                this.password.setError(libLanguage.get('passwordMustAtLeast3Lower'));
            } else if (!Constants.PASSWORD_VALIDATION_SPECIAL_PATTERN.test(password)) {
                this.password.setError(libLanguage.get('passwordMustAtLeastSpecial'));
            } else {
                this.password.unsetError();
                return true;
            }
            return false;
        }

});
});
