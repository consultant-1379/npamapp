/*global define*/
define([
    'jscore/core',
    'template!./resultForBulkOperation.html',
    'styles!./resultForBulkOperation.less'
], function (core, template, styles) {
    'use strict';

    var CLASSNAME = '.eaNpamlibrary-resultForBulkOperation';
    return core.View.extend({
        getTemplate: function () {
            return template();
        },

        getStyle: function () {
            return styles;
        },

        getContentHolder: function() {
            return this.getElement();
        },

        getExportBtnHolder: function() {
            return this.getElement().find(CLASSNAME+'-exportBtn');
        },

        getResultHolder: function() {
            return this.getElement().find(CLASSNAME+'-result');
        },

        appendToResultHolder: function(el) {
            this.getResultHolder().append(el);
        },

        getDataGridHolder: function() {
            return this.getElement().find(CLASSNAME+'-dataGrid');
        },

        getTotalCountLabelHolder: function() {
            return this.getElement().find(CLASSNAME+'-totalCountLabel');
        },

        setTotalCountLabelTxt: function(txt) {
           this.getTotalCountLabelHolder().setText(txt);
        },

        getTotalCountHolder: function() {
            return this.getElement().find(CLASSNAME+'-totalCount');
        },

        setTableHeader: function(txt) {
            this.getElement().find(CLASSNAME+'-heading').setText(txt);
        },

        setTotalCount: function(txt) {
            this.getTotalCountHolder().setText(txt);
        },

        getSuccessCountHolder: function() {
            return this.getElement().find(CLASSNAME+'-successCount');
        },

        setSuccessCount: function(txt) {
            this.getSuccessCountHolder().setText(txt);
        },

        getFailedCountHolder: function() {
            return this.getElement().find(CLASSNAME+'-failedCount');
        },

        setFailedCount: function(txt) {
            this.getFailedCountHolder().setText(txt);
        },

        getExportButtonAnchor: function() {
            return this.getElement().find(".eaNpamlibrary-resultForBulkOperation-exportBtn-anchor");
        },

        getExportBtn: function() {
            return this.getElement().find(".eaNpamlibrary-resultForBulkOperation-exportBtn-txt");
        },

        setExportBtnTxt: function(txt) {
           this.getExportBtn().setText(txt);
        }
    });
});