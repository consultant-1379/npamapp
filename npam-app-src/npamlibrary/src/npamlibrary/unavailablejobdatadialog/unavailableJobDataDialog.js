define([
    'jscore/core',
    'widgets/Dialog',
    './unavailableJobDataDialogView',
    'tablelib/Table',
    'widgets/Accordion',
    'i18n!npamlibrary/dictionary.json',
    'tablelib/plugins/ResizableHeader',
    'tablelib/plugins/SmartTooltips',
    'npamlibrary/constants'
], function (core, Dialog, View, Table, Accordion, libLanguage, ResizableHeader, SmartTooltips, Constants) {
    return core.Widget.extend({
        View: View,

        init: function (options) {
            this.options = options;
            this.accordions = [];
        },

        setDialogData: function () {
            var options = this.options;
            this.view.setDialogHeader(options.headerContent);
            if(options) {
                var unavailableNEs = options.networkElements, isCollectionNotExists = options.isCollectionNotExists, isSavedSearchNotExists = options.isSavedSearchNotExists;
                var unavailablePackages = options.packages, unavailableBackups = options.backups, eventBus = options.eventBus;
                if(unavailableNEs.length > 0) {
                    this.createAccordion(Constants.NODES, unavailableNEs);
                }

                if(isCollectionNotExists) {
                    this.createAccordion(Constants.COLLECTIONS);
                }

                if(isSavedSearchNotExists) {
                    this.createAccordion(Constants.SAVED_SEARCHES);
                }

                if(this.accordions.length > 0) {
                    this.accordions[0].trigger("expand");
                }
            }
        },

        createAccordion: function (accTitle, tableData) {
            var tableColumns = this.getColumns(accTitle), accordionData;

            switch (accTitle) {
                case Constants.NODES:
                    accordionData = new Table({
                        plugins: [
                            new ResizableHeader(),
                            new SmartTooltips()
                        ],
                        columns: tableColumns,
                        data: tableData
                    });
                    break;
                case Constants.COLLECTIONS:
                    accordionData = libLanguage.get('unavailableCollectionsMessage');
                    break;
                case Constants.SAVED_SEARCHES:
                    accordionData = libLanguage.get('unavailableSavedSearchMessage');
                    break;
            }

            var accordion = new Accordion({
                title: libLanguage[accTitle],
                content: accordionData
            });
            accordion.attachTo(this.view.getAccordionsHolder());
            this.accordions.push(accordion);
        },

        getColumns: function (typeOfData) {
            var columns = [];
            switch (typeOfData) {
                case Constants.NODES:
                    columns = [{
                        title: libLanguage.get('nodeName'),
                        attribute: "nodeName",
                        resizable: true
                    }, {
                        title: libLanguage.get('result'),
                        attribute: "result",
                        resizable: true
                    }];
                break;

                default:
            }
            return columns;
        }
    });
});