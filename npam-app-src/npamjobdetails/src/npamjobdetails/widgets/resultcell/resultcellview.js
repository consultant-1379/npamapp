define([
    "jscore/core",
    "text!./resultcell.html",
    "styles!./resultcell.less"
], function (core, template, style) {

    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return style;
        },

        getTickIcon: function () {
            return this.getElement().find('.eaNpamjobdetails-wResultCell-tick');
        },

        getErrorIcon: function () {
            return this.getElement().find('.eaNpamjobdetails-wResultCell-error');
        },

        getWarningIcon: function () {
            return this.getElement().find('.eaNpamjobdetails-wResultCell-warning');
        },

        showTickIcon: function (text) {
            this.getTickIcon().removeModifier('hidden');
            this.getElement().find(".eaNpamjobdetails-wResultCell-tickText").setText(text);
        },

        hideTickIcon: function () {
            this.getTickIcon().setModifier('hidden');
        },

        showErrorIcon: function (text) {
            this.getErrorIcon().removeModifier('hidden');
            this.getElement().find(".eaNpamjobdetails-wResultCell-errorText").setText(text);
        },

        hideErrorIcon: function () {
            this.getErrorIcon().setModifier('hidden');
        },

        showWarningIcon: function (text) {
            this.getWarningIcon().removeModifier('hidden');
            this.getElement().find(".eaNpamjobdetails-wResultCell-warningText").setText(text);
        },

        hideWarningIcon: function () {
            this.getWarningIcon().setModifier('hidden');
        },
        getResultText: function () {
            return this.getElement().find('.eaNpamjobdetails-wResultCell-text');
        }
    });

});