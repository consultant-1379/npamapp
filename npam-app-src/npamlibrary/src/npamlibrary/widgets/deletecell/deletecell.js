define([
    "tablelib/Cell",
    "./deletecellview",
    'i18n!npamlibrary/dictionary.json',
    'npamlibrary/constants'
], function (Cell, View, libLanguage, Constants) {

    return Cell.extend({

        View: View,

        setValue: function (value) {
            var options = this.options;
            this.view.getDeleteCellHolder();
            this.view.getDeleteIconHolder().addEventHandler('click', this.deleteTableRow.bind(this));

        },

        deleteTableRow: function () {
            var obj = {
            nodeName: this.getRow().getData().nodeName,
            isOtherObj: true
            };
            this.getRow().getData().callBackFn(obj);
            this.options.row.remove();
        }
    });
});