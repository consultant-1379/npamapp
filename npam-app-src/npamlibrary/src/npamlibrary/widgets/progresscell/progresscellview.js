define([
    "jscore/core",
    "text!./progresscell.html",
    "styles!./progresscell.less"
], function (core, template, style) {

    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return style;
        },

        getProgress: function () {
            return this.getElement().find(".eaNpamlibrary-wProgressCell-progressbarHolder");
        }
    });

});