define([
    'jscore/core',
    'text!./npamdeleteneaccountjob.html',
    'styles!./npamdeleteneaccountjob.less'
], function (core, template, styles) {

    return core.View.extend({

        getTemplate: function () {
            return template;
        },
        getStyle: function () {
            return styles;
        },
        getLoadingAnimationHolder: function () {
            return this.getElement().find('.eaNpamdeleteneaccountjob-loaderHolder');
        },

        getDialogbox: function () {
            return this.getElement().find(".eaNpamdeleteneaccountjob-dialogboxHolder");
        },

        getNotificationHolder: function () {
            return this.getElement().find(".eaNpamdeleteneaccountjob-notificationHolder");
        }
    });

});
