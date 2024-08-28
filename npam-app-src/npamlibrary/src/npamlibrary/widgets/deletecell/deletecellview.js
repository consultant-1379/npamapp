define([
    "jscore/core",
    "text!./deletecell.html",
    "styles!./deletecell.less"
], function (core, template, style) {

    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return style;
        },

        getDeleteCellHolder: function () {
            return this.getElement().find(".eaNpamlibrary-wDeleteCell-deleteCellHolder");
        },

        getDeleteIconHolder: function () {
            return this.getElement().find(".eaNpamlibrary-deleteCell-icon");
        }

    });

});