define([
    'jscore/core',
    'widgets/Dialog',
    'i18n!npamlibrary/dictionary.json'
], function (core, Dialog, libLanguage) {
    return core.Widget.extend({
        init: function () {
            this.dialog = new Dialog({
                type: "error",
                header: libLanguage.get('accessDenied'),
                content: core.Element.parse(libLanguage.get('accessDeniedContent')),
                buttons: [
                    {caption: libLanguage.get('ok'), color: 'darkBlue', action: function () {
                        this.dialog.hide();
                    }.bind(this)}
                ]
            });
            this.dialog.options.content.setProperty("innerHTML", libLanguage.get('accessDeniedContent'));
        },

        show: function () {
            this.dialog.show();
        }
    });
});
