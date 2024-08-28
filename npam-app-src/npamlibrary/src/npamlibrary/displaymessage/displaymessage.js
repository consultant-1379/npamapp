define([
    'jscore/core',
    "./displaymessageview",
    'i18n!npamlibrary/dictionary.json'
], function (core, View, libLanguage) {

    return core.Widget.extend({

        View: View,

        showMessage: function (hasIcon, content, icon, title, hasLink) {

            if (hasIcon) {
                this.view.showTitle(icon, title);
                this.view.removeContentHolderLeft();
            } else {
                this.view.hideTitleHolder();
                this.view.setContentHolderLeft();
            }
            if(hasLink) {
                content = this.addLink(content);
            }
            if ( content ) {
                this.view.getContentHolder().getNative().innerHTML = content;
            }
        },

        addLink: function(content) {
            var anchor = document.createElement("a");
            anchor.className = "eaNpamlibrary-wDisplayMessage-link";
            anchor.innerHTML = libLanguage.get('clickHere');
            var anchorMsg = libLanguage.get('continueNote').replace("<replace>", anchor.outerHTML);
            content = content + anchorMsg;
            return content;
        },

        getLink: function() {
            return this.view.getLinkHolder();
        },

        showTitleOnly: function(icon, title) {
            this.view.showTitle(icon, title);
            this.view.getTitleHolder().setStyle("border-bottom","none");
        }

    });

});
