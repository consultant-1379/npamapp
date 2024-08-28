define([
    'tablelib/Cell',
    './rightAlignCellView'
], function (Cell, View) {

    return Cell.extend({

      View: View,

      setValue: function (value) {
        if(value === 'NA') {
            this.getElement().setModifier("empty", "", "ebTableCell");
        } else {
            this.getElement().setText(value);
        }
      },
    });
});
