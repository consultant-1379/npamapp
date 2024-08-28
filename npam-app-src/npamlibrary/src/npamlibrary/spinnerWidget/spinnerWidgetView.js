
define([
    'jscore/core',
    'text!./spinnerWidget.html'
], function (core, template) {
    var CLASSNAME = ".eaNpambackuphousekeeping-";
    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getSpinnerHolder: function () {
            return this.getElement().find(CLASSNAME+"activity-header-spinnerHolder");
        },

        setSpinnerTitle: function(txt) {
            return this.getElement().find(CLASSNAME+"titleHolder").setText(txt);
        },

        setSpinnerTitleWidth: function(){
            this.getElement().find(CLASSNAME+"titleHolder").setStyle("width", "56px");
        },

        getCheckBoxHolder: function () {
            return this.getElement().find(CLASSNAME+"checkBoxWidget-holder");
        },

        getCheckBox: function () {
            return this.getElement().find(CLASSNAME+"activity-checkbox");
        },
        getInfoPopUpHolder: function () {
            return this.getElement().find(".eaNpambackuphousekeeping-titleHolder-InfoPopUp");
        }

    });
});