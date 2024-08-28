/**
 * Created with IntelliJ IDEA.
 * User: tcsmaus
 * Date: 6/9/14
 * Time: 3:33 PM
 * To change this template use File | Settings | File Templates.
 */
/**
 *    Extends the HeaderCell class to add filtering capabilties to the header row
 *
 *    @class FilterHeaderCell
 */
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

                case constants.CANCELLED:
                this.view.showErrorIcon(libLanguage.get('cancelled'));
                break;
            }
        }
    });
});