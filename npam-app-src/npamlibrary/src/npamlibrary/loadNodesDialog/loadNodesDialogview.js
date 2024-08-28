/*global define*/
define([
    'jscore/core',
    'text!./loadNodesDialog.html',
    'styles!./loadNodesDialog.less'
], function (core, template, style) {

    'use strict';
    var className = ".eaNpamlibrary-loadNodesDialog-";
    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return style;
        },

        appendNodes: function(el) {
            this.getElement().find(className+"nodes").getNative().appendChild(el);
        },

        setMessageText: function(msg) {
            this.getMessageHolder().setText(msg);
        },

        setContent: function(h2, note, nodeListText) {
            this.getElement().find(className+"h2").setText(h2);
            this.getElement().find(className+"note").setText(note);
            this.getElement().find(className+"nodeListText").setText(nodeListText);
        },

        getMessageHolder: function() {
            return this.getElement().find(className+"msgHolder");
        },

        getNoDataMsgHolder: function() {
            return this.getElement().find(className+"noDataMsg");
        },

        addElementToMsgHolder: function(el) {
            this.getNoDataMsgHolder().getNative().appendChild(el);
        },

        showNoResponseMsg: function() {
            this.getNoDataMsgHolder().setStyle("display","block");
        }

    });
});