define([
    "jscore/core",
    "text!./statuscell.html",
    "styles!./statuscell.less"
], function (core, template, style) {

    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return style;
        },

        getTickIcon: function () {
            return this.getElement().find('.eaNpamlibrary-wStatusCell-tick');
        },

        getErrorIcon: function () {
            return this.getElement().find('.eaNpamlibrary-wStatusCell-error');
        },

        getWarningIcon: function () {
            return this.getElement().find('.eaNpamlibrary-wStatusCell-warning');
        },

        showTickIcon: function (text) {
            this.getTickIcon().removeModifier('hidden');
            this.getElement().find(".eaNpamlibrary-wStatusCell-tickTEXT").setText(text);
        },

        hideTickIcon: function () {
            this.getTickIcon().setModifier('hidden');
        },

        showErrorIcon: function (text) {
            this.getErrorIcon().removeModifier('hidden');
            this.getElement().find(".eaNpamlibrary-wStatusCell-errorText").setText(text);
        },

        hideErrorIcon: function () {
            this.getErrorIcon().setModifier('hidden');
        },

        showWarningIcon: function (text) {
            this.getWarningIcon().removeModifier('hidden');
            this.getElement().find(".eaNpamlibrary-wStatusCell-warningText").setText(text);
        },

        hideWarningIcon: function () {
            this.getWarningIcon().setModifier('hidden');
        },
        getResultText: function () {
            return this.getElement().find('.eaNpamlibrary-wStatusCell-text');
        }
    });

});