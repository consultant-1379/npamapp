define([
    'jscore/core',
    'text!./unavailableJobDataDialog.html',
    'styles!./unavailableJobDataDialog.less'
], function (core, template, style) {

    var CLASS_NAME = '.eaNpamlibrary-wUnavailableJobData-';

    return core.View.extend({
        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return style;
        },

        getAccordionsHolder: function () {
            return this.getElement().find(CLASS_NAME + 'accordionHolder');
        },

        getDialogHeader: function () {
            return this.getElement().find(CLASS_NAME + 'dialogHeader');
        },

        setDialogHeader: function (txt) {
            this.getDialogHeader().setText(txt);
        }
    });
});