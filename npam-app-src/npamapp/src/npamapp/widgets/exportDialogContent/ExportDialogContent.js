
define([
    'jscore/core',
    'widgets/InfoPopup',
    './ExportDialogContentView',
    "npamlibrary/labelWidget",
    "npamlibrary/constants",
    'i18n!npamlibrary/dictionary.json',
    'i18n!npamapp/dictionary.json'
], function (core, InfoPopup, View, LabelWidget, Constants, libLanguage, Dictionary) {

    return core.Widget.extend({

        View: View,

        init: function (options) {
            this.options = options;
            this.plainText = false;
        },

        onViewReady: function() {
            if (this.options.all) {
                this.view.getCaption().setText(Dictionary.export.allExportMsg);
            } else {
                this.view.getCaption().setText(Dictionary.export.selectedNEMsg);
            }

            this.view.getSubCaption().setText(Dictionary.export.fileEncryptionMsg);

            this.filename = new LabelWidget({
                "label": libLanguage.get("fileName"),
                "identifier": "filename",
                "placeholder": libLanguage.get("filenamePlaceholder"),
                "extension": ".enc"
            });
            this.filename.attachTo(this.view.getFilename());
            this.passkey = new LabelWidget({
                "label": libLanguage.get("passkey"),
                "identifier": "passkey",
                "required": true,
                "info": {content: libLanguage.get("passkeyRules")},
                "type": "password",
                "maxlength": 32
            });
            this.passkey.addEventHandler('input', function() {
                this.validatePasskey(this.passkey.getValue());
            }.bind(this));
            this.passkey.attachTo(this.view.getPasskey());
            this.view.getNoPasskeyCheckboxLabel().setText(Dictionary.export.warningExportPlainText);
            this.view.getNoPasskeyCheckbox().addEventHandler('change', this.selectedPlainText.bind(this));
//            this.infoPopup = new InfoPopup({icon: 'info', width: "325px",
//                content: libLanguage.get("passkeyRules")});
//            this.infoPopup.attachTo(this.view.getInfoButton());
        },

        selectedPlainText: function() {
            console.log(this.view.getNoPasskeyCheckbox()._getHTMLElement().checked);
            if (this.view.getNoPasskeyCheckbox()._getHTMLElement().checked) {
                this.plainText = true;
                this.filename.changeExtension('.csv');
                this.passkey.disable();
            } else {
                this.plainText = false;
                this.filename.changeExtension('.enc');
                this.passkey.enable();
            }
            this.validatePasskey(this.passkey.getValue());
        },

        validatePasskey: function(passkey) {
            if (this.plainText) {
                this.passkey.unsetError();
                this.trigger('valid', true);
                return true;
            }
            if (!passkey || passkey === "") {
                this.passkey.setError(libLanguage.get('passkeyMustBeFilled'));
            } else if (!Constants.PASSWORD_VALIDATION_CHARS_PATTERN.test(passkey)) {
                this.passkey.setError(libLanguage.get('passkeyCharNotAllowed'));
            } else if (this.passkey.getValue().length < 8) {
                this.passkey.setError(libLanguage.get('passkeyMustAtLeast8'));
            } else {
                this.passkey.unsetError();
                this.trigger('valid', true);
                return true;
            }
            this.trigger('valid', false);
            return false;
        },

        getFilename: function() {
            return this.filename.getValueAndExtension();
        },

        getPasskey: function() {
            return this.passkey.getValue();
        }

    });
});
