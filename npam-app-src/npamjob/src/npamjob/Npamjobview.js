/**
 * Created with IntelliJ IDEA.
 * User: tcsande
 * Date: 7/18/14
 * Time: 12:12 PM
 * To change this template use File | Settings | File Templates.
 */
define([
    'jscore/core',
    'text!./npamjob.html',
    'styles!./npamjob.less'
], function (core, template, styles) {

    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return styles;
        },

        getNotificationHolder: function () {
            return this.getElement().find(".eaNpamjob-notificationHolder");
        },

        getLoadingAnimationHolder: function () {
            return this.getElement().find('.eaNpamjob-loaderHolder');
        },

        setJobSummaryIconAttr: function (title) {
            var iconHolder = this.getElement().find(".elLayouts-QuickActionBar-right .ebBtn");
            if(iconHolder) {
                iconHolder.setAttribute("style", "z-index:2; position: relative;");
                iconHolder.setAttribute("title", title);
            }
        }

    });

});