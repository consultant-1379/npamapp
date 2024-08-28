/**
 * Created by tcsmukm on 7/1/2016.
 */

define([
    'npamlibrary/serverUtil',
    "widgets/Dialog",
    'i18n!npamlibrary/dictionary.json',
    'npamlibrary/filterUtil',
    'npamlibrary/displaymessage',
    'npamlibrary/restUrls',
    'npamlibrary/messageUtil'
], function (ServerUtil, Dialog, libLanguage, FilterUtil, Displaymessage, RestUrls, MessageUtil) {
    return {

        triggerExport: function( isExportNew, app ) {
            this.app = app;
            this.isExportNew= isExportNew;
            if(this.app.getExportPayLoad(isExportNew).neFdns && this.app.getExportPayLoad(isExportNew).neFdns.length > 0) {
                ServerUtil.sendRestCall(
                    'POST',
                    RestUrls.exportInventoryURL,
                    this.successHandler.bind(this),
                    this.errorHandler.bind(this),
                    'json',
                    'application/json',
                    JSON.stringify(this.app.getExportPayLoad(isExportNew))
                );
            } else {
                this.showErrorMessage(libLanguage.get("noNodesForExport"));
            }
        },

        successHandler: function (response) {
            if (response.message && response.message.indexOf("Exception occured") > -1) {
                this.showErrorMessage(libLanguage.get("exceptionWhileExport"));
            } else if (this.isExportNew) {
                this.navigateToExport(response.requestId);
                this.isExportNew= false;
            } else if (response.isDuplicateRequest) {
                this.createExportPopup();
                this.showExportPopup();
            } else {
                this.navigateToExport(response.requestId);
            }
        },

        showErrorMessage: function(message){
            this.createDisplayMessage(message, false);
        },

        createDisplayMessage: function (message, isError) {
            var target = this.app.view.getDisplayMessageHolder();
            if (isError) {
                target = this.view.getElement();
            }
            if (this.displayMessage)
                this.displayMessage.detach();
            this.displayMessage = new Displaymessage();
            this.displayMessage.showMessage(true, message, "error", libLanguage.get('inventoryExport'));
            target.setText("");
            this.displayMessage.attachTo(target);
        },

        navigateToExport: function(requestId){
            window.open("#shmexport" + "?requestId=" + requestId, "_blank");
        },

        errorHandler: function() {
            var errorBody = MessageUtil.getErrorMessage(xhr.getStatus(), xhr.getResponseText());
            this.view.getElement().setText("");
            this.createDisplayMessage(errorBody.userMessage.body, true);
        },

        hideExportPopup: function(){
            this.exportNewInventory.hide();
        },

        showExportPopup: function(){
            this.exportNewInventory.show();
        },

        createExportPopup : function(){
            this.exportNewInventory = new Dialog({
                header: libLanguage.get('exportDialogHeader'),
                content: libLanguage.get('exportDialogContent'),
                buttons: [
                    {
                        caption: libLanguage.get('startNewExport'),
                        color: 'darkBlue',
                        action: function(){
                            this.hideExportPopup();
                            this.triggerExport(true, this.app);
                        }.bind(this)
                    },
                    {
                        caption: libLanguage.get('cancel'),
                        action: this.hideExportPopup.bind(this)
                    }
                ]
            });
        },

        getExportActionButton: function (invDetails) {
            return {
                name: libLanguage.get('export'),
                type: "button",
                icon: "export",
                action: function () {
                    this.triggerExport(false, invDetails);
                }.bind(this)
            };
        }
    };
});
