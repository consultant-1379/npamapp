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
    'i18n/number'
], function (Cell, i18nNumber) {

    return Cell.extend({

        setValue: function() {
            var options = this.options;
            var attribute = options.column.attribute;
            var model = options.row.options.model;
            var value = model[attribute];
            if(value === 'NA') {
                this.getElement().setModifier("empty", "", "ebTableCell");
            } else if(Number(value)) {
                this.getElement().setText(i18nNumber(value).format('0,0'));
            } else {
                this.getElement().setText(value);
            }
        }
    });
});