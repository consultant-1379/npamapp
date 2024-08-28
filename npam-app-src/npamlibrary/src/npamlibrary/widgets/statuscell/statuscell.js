define([
    'tablelib/Cell',
    './statuscellview',
    'widgets/Tooltip'
], function (Cell, View, Tooltip) {
    return Cell.extend({

        View: View,

        setValue: function () {
            var options = this.options;
            var attribute = options.column.attribute;
            var model = options.row.options.model;
            var value = model[attribute];

            var errorDetails;
            if ( attribute === "cbrsStatus" ) {
                errorDetails = model.cbrsErrorDetails;
            } else {
                errorDetails = model.errorDetails;
            }
            this.setResultIcon( value, errorDetails, options.table.options.npamEnabled);
        },

        setResultIcon: function (value, errorDetails, npamEnabled) {
            this.view.hideWarningIcon();
            this.view.hideErrorIcon();

            if ( errorDetails !== undefined && errorDetails !== "" && npamEnabled ) {
                if ( errorDetails.toLowerCase().startsWith("error:") ) {
                    this.view.showErrorIcon(value);
                } else {
                    this.view.showWarningIcon(value);
                }

                this.tooltip = new Tooltip({
                    parent: this.getElement(),
                    content: errorDetails,
                 });
                this.tooltip.view.content.setAttribute("style", "min-width: max-content;");
            } else {
                this.view.getResultText().setText(value);
            }
        }
    });
});