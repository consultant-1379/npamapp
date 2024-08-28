define([
    "jscore/core",
    "text!./ExportDialogContent.html",
    "styles!./ExportDialogContent.less"
], function (core, template, styles) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function () {
            return styles;
        },

        getCaption: function() {
            return this.getElement().find(".eaNpamapp-wExportDialogContent-Caption");
        },

        getSubCaption: function() {
            return this.getElement().find(".eaNpamapp-wExportDialogContent-subCaption");
        },

        getFilename: function() {
            return this.getElement().find(".eaNpamapp-wExportDialogContent-Filename");
        },

        getPasskey: function() {
            return this.getElement().find(".eaNpamapp-wExportDialogContent-Passkey");
        },

        getNoPasskeyCheckbox: function() {
            return this.getElement().find(".eaNpamapp-wExportDialogContent-noPasskeyCheckbox-checkbox");
        },

        getNoPasskeyCheckboxLabel: function() {
            return this.getElement().find(".eaNpamapp-wExportDialogContent-noPasskeyCheckbox-label");
        },

        getInfoButton: function() {
            return this.getElement().find(".eaNpamapp-wExportDialogContent-infoButton");
        }

    });
});

