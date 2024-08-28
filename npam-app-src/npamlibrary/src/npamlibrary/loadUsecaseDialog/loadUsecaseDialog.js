define([
    'jscore/core',
    './loadUsecaseDialogview',
    'i18n!npamlibrary/dictionary.json'
], function (core, View, libLanguage) {
    var className = 'eaNpamlibrary-loadUsecaseDialog-';
    return core.Widget.extend({

        View: View,

        init: function (options) {
            this.showCommonMsg = options.status;
            this.response = options.response;
            this.name = options.name;
        },

        onViewReady: function () {
            var supported = this.response.supported;
            var unsupported = this.response.unsupported;
            if (supported && supported.length > 0) {
                this.displayNodes(supported, libLanguage.get('supportedNodes'));
            }
            if (unsupported && unsupported.length > 0) {
                this.displayNodes(unsupported, libLanguage.get('unsupportedNodes'));
            }
            if (this.showCommonMsg) this.view.showCommonMsg(); else this.view.showMsgForOtherNodes();
            this.view.addTextToDomObjects(libLanguage.get('fullSelection'), libLanguage.get('noSupport').replace("<replace>", libLanguage.get('noSupportMsg')), libLanguage.get('youSelected'), libLanguage.get('commonMsg'), libLanguage.get('msgForOtherNodes'));
            this.showSelectionName();
        },

        showSelectionName: function () {
            this.getElement().find('.'+className+"h2").getNative().appendChild(this.prepareHTMLElement('span', className+'selectionName', this.name));
        },

        displayNodes: function (nodes, type) {
            var div = this.prepareHTMLElement('div', className+'section', '');
            div.appendChild(this.prepareHTMLElement('span', className+'type', type));
            var ol = this.prepareHTMLElement('ol', className+'elements', '');
            for (var i = 0; i < nodes.length; i++) {
                ol.appendChild(this.prepareHTMLElement('li', className+'nodeList', nodes[i].name));
            }
            div.appendChild(ol);
            this.view.appendNodes(div);
        },

        prepareHTMLElement: function (tag, className, text) {
            var el = document.createElement(tag);
            el.className = className;
            el.innerHTML = text;
            return el;
        }
    });

});