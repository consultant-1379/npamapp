/**
 * Created with IntelliJ IDEA.
 * User: tcskrth
 * Date: 3/20/14
 * Time: 6:21 PM
 * To change this template use File | Settings | File Templates.
 */
define([
    'jscore/core',
    "text!./displaymessage.html",
    "styles!./displaymessage.less"
], function (core, template, style) {
    var CLASSNAME = '.eaNpamlibrary-wDisplayMessage-';
    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return style;
        },

        getTitleHolder: function () {
            return this.getElement().find(CLASSNAME + "titleHolder");
        },

        getTitleContentHolder: function () {
            return this.getElement().find(CLASSNAME + "titleHolder-content");
        },

        getContentHolder: function () {
            return this.getElement().find(CLASSNAME + "contentHolder");
        },

        getIconHolder: function () {
            return this.getElement().find(".ebIcon");
        },

        showTitle: function (icon, title) {
            this.getIconHolder().removeModifier("dialogInfo");
            this.getIconHolder().setModifier(icon);
            this.getTitleContentHolder().setText(title);
            this.showTitleHolder();
        },

        setContent: function (text) {
            this.getContentHolder().setText(text);
        },

        hideTitleHolder: function () {
            this.getTitleHolder().removeModifier("show");
            this.getTitleHolder().setModifier("hide");
        },

        showTitleHolder: function () {
            this.getTitleHolder().removeModifier("hide");
            this.getTitleHolder().setModifier("show");
        },

        setContentHolderLeft: function () {
            this.getContentHolder().setModifier("left");
        },

        removeContentHolderLeft: function () {
            if (this.getContentHolder().hasModifier("left")) {
                this.getContentHolder().removeModifier("left");
            }
        },

        getLinkHolder: function () {
            return this.getElement().find(".eaNpamlibrary-wDisplayMessage-link");
        }
    });

});