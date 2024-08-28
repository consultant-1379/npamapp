
define([
    'jscore/core',
    'widgets/Button',
    './ImportDialogContentView',
    'i18n!npamapp/dictionary.json'
], function (core, Button, View, Dictionary) {

    return core.Widget.extend({
        View: View,

        init: function (options) {
            this.options = options;
            this.selectCsvButton = new Button();
            this.fileName = "";
        },

        onViewReady: function() {
            this.view.getCaption().setText(Dictionary.import.importHeader);
            this.view.getSubCaption().setText(Dictionary.import.subcaption);
            this.view.getInfoText().setText(Dictionary.import.infomsg);
            this.view.getFilenameTitle().setText(Dictionary.import.filename);

            this.selectCsvButton.setCaption(Dictionary.import.selectFile);
            this.selectCsvButton.attachTo(this.view.getSelectCsvButton());
            this.selectCsvButton.addEventHandler("click", this.chooseFileFromFileWindow.bind(this));

            this.view.getFileName().addEventHandler("change", this.setFileNameInTextBox.bind(this));
        },

        setFileNameInTextBox: function () {
            this.pathVal = this.view.getFileName().getValue();
            this.path = undefined;
            if (this.pathVal && this.pathVal.trim()!=="") {
                this.path = this.pathVal;
            }

            if ( this.path ) {
                this.fileName = this.path.split("\\");
                this.view.getFilePathTextBox().setValue(this.fileName[this.fileName.length - 1]);
                this.view.getFilePathRemoveIcon().setModifier("close");
                this.trigger('valid', true);
            } else {
                this.trigger('valid', false);
            }
        },

        chooseFileFromFileWindow: function () {
            this.view.getFileName().trigger("click");
        },

        getFilename: function () {
            return this.view.getFileName().getProperty("files")[0];
        }
    });
});