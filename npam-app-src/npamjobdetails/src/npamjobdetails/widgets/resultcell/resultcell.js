define([
    'tablelib/Cell',
    './resultcellview',
    'npamlibrary/constants',
    'i18n!npamlibrary/dictionary.json'
], function (Cell, View, constants, libLanguage) {

    return Cell.extend({

        View: View,
        value: 100,

        setValue: function () {
            var options = this.options;
            var attribute = options.column.attribute;
            var model = options.row.options.model;
            var value = model[attribute];
            this.setResultIcon(value);
        },

        setResultIcon: function (value) {
           this.view.hideWarningIcon();
           	this.view.hideErrorIcon();
           	this.view.hideTickIcon();

            switch(value){
                case constants.SUCCESS:
                    this.view.showTickIcon(libLanguage.get('success'));
                    break;

                case constants.FAILED:
                    this.view.showErrorIcon(libLanguage.get('failed'));
                    break;

                case constants.SKIPPED:
                    this.view.showWarningIcon(libLanguage.get('skipped'));
                    break;
            }
        }
    });
});