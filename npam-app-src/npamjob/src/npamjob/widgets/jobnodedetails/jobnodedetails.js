define([
    'jscore/core',
    './jobnodedetailsview',
    'i18n!npamjob/dictionary.json',
    'i18n!npamlibrary/dictionary.json',
    'tablelib/plugins/ResizableHeader',
    'tablelib/plugins/SmartTooltips',
    'tablelib/Table',
    'widgets/Accordion',
    'npamlibrary/displaymessage',
    'npamlibrary/i18NumberUtil',
    'widgets/InlineMessage'
    ], function (core, View, language, libLanguage, ResizableHeader, SmartTooltips, Table, Accordion, DisplayMessage, i18nNumber, InlineMessage) {
    return core.Widget.extend({

        View: View,

        init: function (options) {
            this.options = options || {};
            this.accordions = [];
            this.displayErrorMessage = new DisplayMessage();
            this.eventBus = this.options.eventBus;
            this.eventBus.subscribe("jobConfigurationEvent", this.displayConfigContent.bind(this));
            this.eventBus.subscribe("jobConfigurationError", this.showErrorMsg.bind(this));
            this.eventBus.subscribe("noJobSelected", this.noJobSelected.bind(this));
        },

        noJobSelected: function(){
            if(this.inlineMessage){
                this.inlineMessage.destroy();
            }
            if(this.displayErrorMessage){
                this.displayErrorMessage.destroy();
            }
            this.inlineMessage = new InlineMessage({
                icon: 'infoMsgIndicator',
                header: language.get("noJobSelectedHeader"),
                description: language.get("noJobSelectedMsg")
            });
            this.inlineMessage.attachTo(this.view.getDefaultMessage());
            this.view.hideComponent();
            this.view.hideLoader();
            this.view.showDefaultMsg();
        },

        displayConfigContent: function (response) {
            this.hideContent();

            this.view.setJobHeader(response.name);
            if ( !response.selectedNEs ||
                 ( response.selectedNEs.neNames.length === 0 &&
                   response.selectedNEs.collectionNames.length === 0 &&
                   response.selectedNEs.savedSearchIds.length === 0 )) {
                this.showNoNodesMsg();
            } else {
                if ( response.selectedNEs.neNames.length > 0 ) {
                    this.createAccordion( libLanguage.get('NODES'), response.selectedNEs.neNames );
                }

                if ( response.selectedNEs.collectionNames.length > 0 ) {
                    this.createAccordion( libLanguage.get('COLLECTIONS'), response.selectedNEs.collectionNames );
                }

                if ( response.selectedNEs.savedSearchIds.length > 0 ) {
                    this.createAccordion( libLanguage.get('SAVED_SEARCHES'), response.selectedNEs.savedSearchIds );
                }
                this.displayContent();
            }
        },

        hideContent: function () {
            this.displayErrorMessage.detach();
            this.view.hideComponent();
            this.view.showLoader();
            this.detachExistingAcc();
        },

        displayContent: function() {
            this.view.showComponent();
            this.view.hideLoader();
//            this.hideDefaultMsg();
        },

        showNoNodesMsg: function () {
            this.view.setErrorMsg(language.get('noNodesAvailableMsg'));
            this.view.showErrorMsg();
        },

        showErrorMsg: function (errorBody) {
            this.displayErrorMessage.showMessage(true, errorBody.body, "error", errorBody.title);
            this.displayErrorMessage.attachTo(this.view.getDefaultMessage());
            this.view.showDefaultMsg();
            this.view.hideLoader();
        },

        detachExistingAcc: function () {
            for (var i in this.accordions) {
                this.accordions[i].detach();
            }
            this.accordions = [];
        },

        createAccordion: function (accTitle, dataList) {
            var tableData = [];
            dataList.forEach(function(data){
                tableData.push({ "name" : data });
            });

            var accordionData = new Table({
                 plugins: [
                     new ResizableHeader(),
                     new SmartTooltips()
                 ],
                     columns: this.getColumns(),
                 data: tableData,
                 modifiers: [
                     {name: "striped"}
                 ]
            });
            accordionData.setWidth("auto");

            var nodesAccordion = new Accordion({
                title: accTitle + " (" + i18nNumber.getNumber(tableData.length) + ")",
                content: accordionData
            });
            this.accordions.push(nodesAccordion);
            nodesAccordion.attachTo(this.view.getAccordionsHolder());
        },

        getColumns: function () {
            return  [
                {
                    title: libLanguage.get('name'),
                    attribute: "name",
                    resizable: true,
                    width: "300px"
                }
            ];
        }
    });
});
