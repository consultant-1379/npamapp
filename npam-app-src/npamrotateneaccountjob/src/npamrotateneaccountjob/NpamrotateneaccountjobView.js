define([
    'jscore/core',
    'text!./npamrotateneaccountjob.html',
    'styles!./npamrotateneaccountjob.less'
], function (core, template, styles) {

    return core.View.extend({

        getTemplate: function () {
            return template;
        },
        getStyle: function () {
            return styles;
        },
        getLoadingAnimationHolder: function () {
            return this.getElement().find('.eaNpamrotateneaccountjob-loaderHolder');
        },

        getDialogbox: function () {
            return this.getElement().find(".eaNpamrotateneaccountjob-dialogboxHolder");
        },

        getNotificationHolder: function () {
            return this.getElement().find(".eaNpamrotateneaccountjob-notificationHolder");
        }
    });

});
