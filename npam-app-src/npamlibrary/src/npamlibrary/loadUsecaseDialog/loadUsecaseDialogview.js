/*global define*/
define([
    'jscore/core',
    'text!./loadUsecaseDialog.html',
    'styles!./loadUsecaseDialog.less'
], function (core, template, style) {

    'use strict';
    var className = '.eaNpamlibrary-loadUsecaseDialog-';
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

        showCommonMsg: function() {
            this.getElement().find(className+"showCommonMsg").setStyle("display","block");
            this.getElement().find(className+"showMsgForOtherNodes").setStyle("display,none");
        },

        showMsgForOtherNodes: function() {
            this.getElement().find(className+"showCommonMsg").setStyle("display","none");
            this.getElement().find(className+"showMsgForOtherNodes").setStyle("display","block");
        },

        addTextToDomObjects: function(h2, note, nodeListText, showCommonMsg, showMsgForOtherNodes) {
            this.getElement().find(className+"h2").setText(h2);
            this.getElement().find(className+"note").setText(note);
            this.getElement().find(className+"nodeListText").setText(nodeListText);
            this.getElement().find(className+"showCommonMsg").setText(showCommonMsg);
            this.getElement().find(className+"showMsgForOtherNodes").setText(showMsgForOtherNodes);
        }

    });
});