define([
    'jscore/core',
    'text!./npamcheckneaccountconfigjob.html',
    'styles!./npamcheckneaccountconfigjob.less'
], function (core, template, styles) {

    return core.View.extend({

        getTemplate: function () {
            return template;
        },
        getStyle: function () {
            return styles;
        },
        getLoadingAnimationHolder: function () {
            return this.getElement().find('.eaNpamcheckneaccountconfigjob-loaderHolder');
        },

        getDialogbox: function () {
            return this.getElement().find(".eaNpamcheckneaccountconfigjob-dialogboxHolder");
        },

        getNotificationHolder: function () {
            return this.getElement().find(".eaNpamcheckneaccountconfigjob-notificationHolder");
        }
    });

});
