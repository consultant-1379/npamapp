define([
    "jscore/core",
    "text!./jobname.html",
    "styles!./jobname.less"
], function (core, template, style) {

    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return style;
        },

        getIconHolder: function () {
            return this.getElement().find(".eaNpamlibrary-jobTypeIcon");
        },

        setJobName: function (name) {
            this.getElement().find(".eaNpamlibrary-jobName").setText(name);
        },

        setJobAsperiodic: function (txt) {
            this.getElement().find(".eaNpamlibrary-periodicJobIcon").setModifier("show");
            this.getElement().find(".eaNpamlibrary-periodicJobIcon").setAttribute("title", txt);
        },

        setCellLeftPadding: function (value) {
            this.getElement().setStyle("padding-left", value);
        },

        setIconText: function (text) {
            this.getIconHolder().setText(text);
        },

        setIconBgColor: function (color) {
            this.getIconHolder().setStyle("background-color", color);
        },

        setIconTooltip: function (title) {
            this.getIconHolder().setAttribute("title", title);
        }
    });

});