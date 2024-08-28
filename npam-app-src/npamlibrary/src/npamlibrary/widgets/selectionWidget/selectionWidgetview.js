define([
    "jscore/core",
    "text!./selectionWidget.html",
    "styles!./selectionWidget.less"
], function (core, template, style) {

    var ClassName = ".eaNpamlibrary-wSelectedMessage-content-";

    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return style;
        },

        getSelectedRowsInfoHolder: function() {
            return this.getElement().find(ClassName+"selectedRowsInfo");
        },

        getSelectAllOnAllPageHolder: function() {
            return this.getElement().find(ClassName+"selectAllOnAllPage");
        },

        getClearAllHolder: function() {
            return this.getElement().find(ClassName+"clearAll");
        },

        setSelectedRowsTxt: function(txt) {
            this.getSelectedRowsInfoHolder().setText(txt);
        },

        setSelectAllTxt: function(txt) {
            this.getSelectAllOnAllPageHolder().setText(txt);
        },

        setClearSelectionTxt: function(txt) {
            this.getClearAllHolder().setText(txt);
        },

        addSelectAllClickHandler: function(fn) {
            this.getSelectAllOnAllPageHolder().addEventHandler("click", fn);
            this.getSelectAllOnAllPageHolder().addEventHandler("keydown", function(evt){
                if(evt.originalEvent.keyCode === 13){
                    this.getSelectAllOnAllPageHolder().trigger("click");
                }
            }.bind(this));
        },

        addClearAllClickHandler: function(fn) {
            this.getClearAllHolder().addEventHandler("click", fn);
            this.getClearAllHolder().addEventHandler("keypress", fn);
        }
    });

});