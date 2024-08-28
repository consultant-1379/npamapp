define([
    "jscore/core",
    "text!./ImportDialogContent.html",
    "styles!./ImportDialogContent.less"
], function (core, template, styles) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function () {
            return styles;
        },

        getCaption: function() {
            return this.getElement().find(".eaNpamapp-wImportDialogContent-Caption");
        },

        getSubCaption: function() {
            return this.getElement().find(".eaNpamapp-wImportDialogContent-subCaption");
        },

        getFileName: function () {
            return this.getElement().find(".eaNpamapp-wImportDialogContent-file");
        },

        getFilePathTextBox: function () {
            return this.getElement().find(".eaNpamapp-wImportDialogContent-filePath");
        },

        getFilePathRemoveIcon: function () {
            return this.getElement().find(".eaNpamapp-wImportDialogContent-closeIcon");
        },

        getSelectCsvButton: function () {
            return this.getElement().find(".eaNpamapp-wImportDialogContent-selectCsvButtonHolder");
        },

        getFilenameTitle: function() {
            return this.getElement().find(".eaNpamapp-wImportDialogContent-Filename-title");
        },

        getInfoText: function() {
            return this.getElement().find(".eaNpamapp-wImportDialogContent-infoText");
        }
    });
});

