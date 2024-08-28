define([
    "jscore/core",
    "text!./FilterHeaderCell.html",
    "styles!./FilterHeaderCell.less"
], function (core, template, styles) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return styles;
        },

        getInputTag: function () {
            return this.getElement().find(".eaNpamlibrary-FilterHeaderCell-input");
        },

        getWrapper: function(){
            return this.getElement().find(".eaNpamlibrary-FilterHeaderCell-wrapper");
        },

        hideOptions: function(){
            return this.getElement().find(".eaNpamlibrary-FilterHeaderCell-options");
        },

        setPlaceHolderTxt: function(txt) {
            this.getInputTag().setProperty("placeholder",txt);
        },

        getDatePicker: function() {
            return this.getElement().find(".eaNpamlibrary-FilterHeaderCell-datePicker");
        },

        showDatePicker: function() {
            this.getDatePicker().removeModifier("hidden");
        },

        hideDatePicker: function() {
            this.getDatePicker().setModifier("hidden");
        },

        getCancelButton: function(){
            return this.getElement().find(".eaNpamlibrary-FilterHeaderCell-cancelButton");
        },

        showCancelButton: function(){
            this.getCancelButton().setAttribute("style", "display:inline-block");
        },

        hideCancelButton: function(){
            this.getCancelButton().setAttribute("style", "display:none");
        }

    });

});