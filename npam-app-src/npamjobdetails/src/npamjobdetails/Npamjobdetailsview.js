define([
    'jscore/core',
    'text!./npamjobdetails.html'
], function (core, template) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getNotificationHolder: function() {
            return this.getElement().find(".eaNpamjobdetails-notificationHolder");
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