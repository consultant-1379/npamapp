/*global define*/
define([
    'jscore/core',
    'text!./createTable.html',
    'styles!./createTable.less',
    'i18n!npamlibrary/dictionary.json'
], function (core, template, style, libLanguage) {

    'use strict';

    var CLASS_PREFIX = ".eaNpamlibrary-createTable-";

    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return style;
        },

        getHeader: function() {
          return this.getElement().find(CLASS_PREFIX + "header");
        },

        showHeader: function() {
            this.getHeader().setStyle("display", "block");
        },

        hideHeader: function() {
            this.getHeader().setStyle("display", "none");
        },

        getPageLimitHolder: function () {
            return this.getElement().find(CLASS_PREFIX + "pageSizeSelectHolder");
        },

        getPageSizeSelect: function () {
            return this.getElement().find(CLASS_PREFIX + "pageSizeSelect");
        },

        hidePageSizeSelect: function () {
            this.getPageSizeSelect().setAttribute("style","display:none");
        },

        showPageSizeSelect: function () {
            this.getPageSizeSelect().setAttribute("style","display:block");
        },

        getDeleteBtnHolder: function() {
            return this.getElement().find(CLASS_PREFIX + "header-deleteBtn");
        },

        getTableHolder: function() {
            return this.getElement().find(CLASS_PREFIX + "table");
        },

        getPaginationHolder: function () {
            return this.getElement().find(CLASS_PREFIX + "paginationHolder");
        },

        getNodesDisplayed: function() {
            return this.getElement().find(CLASS_PREFIX + "header-nodesDisplay");
        },

        hideSelectedOfTotal: function () {
            this.getNodesDisplayed().setAttribute("style", "display:none");
        },

        showSelectedOfTotal: function () {
            this.getNodesDisplayed().setAttribute("style", "display:block");
        },

        getEmptyMessageHolder: function () {
            return this.getElement().find(CLASS_PREFIX + "emptyRecordsDisplayMessage");
        },

        hideEmptyRecordsMessageHolder: function () {
            this.getEmptyMessageHolder().setStyle('display', 'display:none');
        },

        showEmptyRecordsMessageHolder: function () {
            this.getEmptyMessageHolder().setStyle('display', 'display:block');
        },

        getSelectedRowCountHolder: function() {
            return this.getElement().find(CLASS_PREFIX + "header-selectedRowCount");
        },

        setSelectedRowCount: function(count) {
            this.getSelectedRowCountHolder().setText(count);
        },

        hideSelectedRowCount: function () {
            this.getSelectedRowCountHolder().setStyle("display", "none");
        },

        showSelectedRowCount: function () {
            this.getSelectedRowCountHolder().setStyle("display", "inline-block");
        },

        getClearSelectionLink: function(){
            return this.getElement().find(CLASS_PREFIX + "header-clearSelection-link");
        },

        getClearSelection: function(){
            return this.getElement().find(CLASS_PREFIX + "header-clearSelection");
        },

         hideClearSelection: function(){
            this.getClearSelection().setAttribute("style","display:none");
        },

        showClearSelection: function(){
            this.getClearSelection().setAttribute("style","display:inline-block");
        },

         setClearText: function() {
           this.getElement().find(CLASS_PREFIX + "header-clearSelection-separator").setText("-");
           this.getClearSelectionLink().setText(libLanguage.get('clear'));
        },

        getFooter: function () {
            return this.getElement().find(".eaNpamlibrary-createTable-footer");
        },

        setLimitLabelText:function(name){
            this.getElement().find(CLASS_PREFIX + "pageSizeSelectLabel").setText(name);
        }
    });
});