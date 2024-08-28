define([
    'jscore/core',
    'text!./npamcreateneaccountjob.html',
    'styles!./npamcreateneaccountjob.less'
], function (core, template, styles) {

    return core.View.extend({

        getTemplate: function () {
            return template;
        },
        getStyle: function () {
            return styles;
        },
        getLoadingAnimationHolder: function () {
            return this.getElement().find('.eaNpamcreateneaccountjob-loaderHolder');
        },

        getDialogbox: function () {
            return this.getElement().find(".eaNpamcreateneaccountjob-dialogboxHolder");
        },

        getNotificationHolder: function () {
            return this.getElement().find(".eaNpamcreateneaccountjob-notificationHolder");
        }
    });

});
