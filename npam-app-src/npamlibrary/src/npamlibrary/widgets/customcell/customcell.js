define([
    'tablelib/Cell',
    'widgets/Tooltip',
    'npamlibrary/constants',
], function (Cell, Tooltip, constants) {

    return Cell.extend({
        setValue: function(value) {
            var column = this.options.column.attribute;
             if(value === 'NA' || value === "" || value === undefined || value === null) {
                this.getElement().setModifier("empty", "", "ebTableCell");
                this.tooltip = new Tooltip({
                    parent: this.getElement(),
                    content: "Not Applicable",
                 });
                 this.tooltip.view.content.setAttribute("style", "min-width: max-content;");
            }else{
                this.getElement().setText(value);
            }
        }
    });
});