/*global define*/
define([
    'jscore/core',
    'template!./_network.html',
    'styles!./_network.less'
], function (core, template, styles) {
    'use strict';

    var NAME = '.eaNpamlibrary-Network-';
    return core.View.extend({
        getTemplate: function () {
            return template();
        },
        getStyle: function () {
            return styles;
        },
        getList: function () {
            return this.getElement().find(NAME + 'selectionList');
        },
        getTopologySelectionHolder: function () {
            return this.getElement().find(NAME + 'topologySelectionHolder');
        },

        getDisplayMessageHolder: function() {
            return this.getElement().find(NAME + "displayMessageHolder");
        },
        
        setSelectText: function(txt) {
        	this.getElement().find(".elWidgets-SelectionList-actions-label").setText(txt);
        },
        setAllText: function(txt) {
        	this.getElement().find(".elWidgets-SelectionList-actions-selectAll").setText(txt);
        },
        setNoneText: function(txt) {
        	this.getElement().find(".elWidgets-SelectionList-actions-deselectAll").setText(txt);
        },

        getNetworkElementLabel: function () {
            return this.getElement().find(".elWidgets-SelectionList-content");
        }
    });
});
