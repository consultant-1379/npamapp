
define([
    'jscore/core',
    './PopUpDialogView',
    'widgets/Dialog'
], function (core, View, Dialog) {

    return core.Widget.extend({

        view: function() {
            return new View(this.options);
        },

        initDialog: function (header, content, optionalContent, type, buttons) {
           this.destroyDialog();
           this.dialog = new Dialog({
               header: header,
               content: content,
               optionalContent: optionalContent,
               visible: true,
               type: type,
               buttons: buttons
           });

        },

        destroyDialog: function () {
            if (this.dialog) {
                this.dialog.destroy();
            }
        },

        showDialog: function () {
            return this.dialog.show();
        },

        setDialogButtons: function(buttons){
            return this.dialog.setButtons(buttons);
        },

        hideDialog: function(){
            this.dialog.hide();
        },

        setDialogHeader: function(options) {
            this.dialog.setHeader(options.header || 'Header not set');
        }

    });
});