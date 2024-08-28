define([
    'jscore/core',
    './loadNodesDialogview',
    'i18n!npamlibrary/dictionary.json'
], function (core, View, libLanguage) {
    var className = "eaNpamlibrary-loadNodesDialog-";
    return core.Widget.extend({
        View: View,

        init: function (options) {
            this.isSupportAndUnSupport = options.status;
            this.response = options.response;
            this.name = options.name;
        },

        onViewReady: function () {
            var supported = this.response.supportedFdns;
            var unsupported = this.response.unsupportedFdns;
            if (supported && Object.keys(supported).length > 0) {
                this.displayNodes(supported, libLanguage.get('supportedMo'));
            }
            if (unsupported && Object.keys(unsupported).length > 0) {
                this.displayNodes(unsupported, libLanguage.get('unsupportedMo'));
            }
            var msg =    libLanguage.get('commonMsg');
            if (!this.isSupportAndUnSupport){
                msg = libLanguage.get('msgForOtherNodes');
            }
            this.view.setMessageText(msg);

            this.view.setContent(libLanguage.get('fullSelection'), libLanguage.get('noSupport').replace("<replace>", Object.keys(unsupported).toString().replace(/,/g, " ")), libLanguage.get('youSelected'));
            if(Object.keys(unsupported).length === 0 && Object.keys(supported).length === 0) {
                this.showNoResponse();
            }
            this.showSelectionName();
        },

        showSelectionName: function () {
            this.getElement().find("."+className+"h2").getNative().appendChild(this.prepareHTMLElement('span', className+'selectionName', this.name));
        },

        displayNodes: function (nodes, type) {
            var div = this.prepareHTMLElement('div', className+'section', '');
            div.appendChild(this.prepareHTMLElement('span', className+'type', type));
            var ul = document.createElement("ul");
            for (var i = 0; i < Object.keys(nodes).length; i++) {
                ul.appendChild(this.prepareHTMLElement('li', className+'nodeList', Object.keys(nodes)[i] + " " + "(" + nodes[Object.keys(nodes)[i]].length + ")"));
            }
            div.appendChild(ul);
            this.view.appendNodes(div);
        },

        prepareHTMLElement: function (tag, className, text) {
            var el = document.createElement(tag);
            el.className = className;
            el.innerHTML = text;
            return el;
        },

        showNoResponse: function() {
            this.view.setContent(libLanguage.get('fullSelection'), '', '', libLanguage.get('commonMsg'), libLanguage.get('msgForOtherNodes'));
            this.view.addElementToMsgHolder(this.prepareHTMLElement('i', 'ebIcon ebIcon_large ebIcon_warning', ''));
            this.view.addElementToMsgHolder(this.prepareHTMLElement('span', className+'msgText', libLanguage.get('nodesNotSupported')));
            this.view.showNoResponseMsg();
        }
    });

});