define([
    "jscore/core",
    "text!./FilterOptions.html",
    "styles!./FilterOptions.less"
], function(core, template, style) {

    return core.View.extend( {

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },

        setSelected: function(value) {
            this.getElement().setText(value);
        },

        getSelected: function() {
            return this.getElement().getText();
        },

        getInfoIconHolder: function () {
            return this.getElement();
        }

    });

});