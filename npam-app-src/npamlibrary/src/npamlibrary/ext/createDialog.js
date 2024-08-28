define([
    'jscore/core',
    'widgets/Dialog',
    "npamlibrary/resultForBulkOperation",
    'i18n!npamlibrary/dictionary.json'
], function (core, Dialog, ResultForBulkOperation, libLanguage) {

    return core.Widget.extend({

        init: function (options) {
            var dialogBox = new ResultForBulkOperation({'columns': options.columns, 'data': options.data, 'successCount': options.successCount, 'failureCount': options.failureCount});
            var widget = new Dialog({
                buttons: [
                    {caption: libLanguage.get('ok'), action: function () {
                        widget.hide();
                        options.function();
                    }.bind(this)}
                ]
            });
            widget.setHeader(libLanguage.get('deleteResults'));
            widget.setContent(dialogBox);
            widget.show();
        }
    });
});
