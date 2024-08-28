define([
    'jscore/core',
    './resultForBulkOperationView',
    'jscore/ext/mvp',
    'tablelib/Table',
    'tablelib/plugins/ResizableHeader',
    'tablelib/plugins/SortableHeader',
    'tablelib/plugins/StickyHeader',
    'i18n!npamlibrary/dictionary.json',
    'tablelib/plugins/VirtualScrolling',
    'npamlibrary/dataService'
], function (core, View, mvp, Table, ResizableHeader, SortableHeader, StickyHeader, libLanguage, VirtualScrolling, dataService) {

    return core.Widget.extend({

        View: View,

        init: function (options) {
            this.data = options.data;
            this.successCount = options.successCount;
            this.failureCount = options.failureCount;
            this.columns = options.columns;
            this.tableConfig = {
                sortMode: 'asc',
                sortAttr: this.columns[0].attribute,
                columns: this.columns
            };
        },

        getDataRequest: function (index, length, callback) {
            // provide the service which sorting we expect
            // as well as the section of data to load
            var sortAttr = this.tableConfig.sortAttr,
            sortMode = this.tableConfig.sortMode;
            dataService.loadData(index, length, sortAttr, sortMode)
            .then(function (response) {
            // Check if the total length has changed, if so we need to update the height of the fake div
                if (response.totalLength !== this.tableConfig.dataLength) {
                this.table.setTotalRows(response.totalLength);
                this.tableConfig.dataLength = response.totalLength;
            }
            var resData = response.data;
            // Change message in annotated scroll bar
            if (resData[0] !== undefined) {

                var start = resData[0][sortAttr],
                end = resData[resData.length - 1][sortAttr];
                if (typeof start === 'string') {
                // truncate long text to the relevant part for usability
                    start = start.substr(0, 20);
                    end = end.substr(0, 20);
                }

            this.table.getVirtualScrollBar().setAnnotationText(libLanguage[sortAttr] + ': ' + start + ' - ' + end);
            }
            callback(resData);
            }.bind(this));
        },

        onViewReady: function() {
            this.view.setTableHeader(libLanguage.get('failureDetails'));
            this.view.setTotalCountLabelTxt(libLanguage.total);
            this.view.setTotalCount(' ('+(this.successCount+this.failureCount)+') ');
            this.view.setSuccessCount(' '+this.successCount+' '+libLanguage.get('succeeded'));
            this.view.setFailedCount(' '+this.failureCount+' '+libLanguage.get('failed'));
            this.view.setExportBtnTxt(libLanguage.get('export'));
            this.initializeTable();
            this.view.getExportButtonAnchor().setAttribute('href', this.prepareDataForCSVfile());
        },

        prepareDataForCSVfile: function() {
            var csvString = this.convertArrayOfObjectsToCSV();
            return  encodeURI('data:text/csv;charset=utf-8,' + csvString);
        },

        convertArrayOfObjectsToCSV: function() {
            var result, ctr, keys, columns, columnDelimiter, lineDelimiter;
            columnDelimiter = '\t';
            lineDelimiter = '\n';
            columns = {};
            if (this.data === null || !this.data.length) {
                return null;
            }
            this.columns.forEach(function(column) {
                columns[column.title] = column.attribute;
            });
            keys = Object.keys(columns);
            result = '';
            result += keys.join(columnDelimiter);
            result += lineDelimiter;
            this.data.forEach(function(item) {
                ctr = 0;
                keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;
                    result += item[columns[key]];
                    result = result.replace(/ /gi,"_");
                    ctr++;
                });
                result += lineDelimiter;
            });
            return result;
        },

        createTable: function () {
            var tableConfig = this.tableConfig;
            if(this.table) {
                this.table.destroy();
            }
            this.table = new Table({
                columns: tableConfig.columns,
                plugins: [
                new StickyHeader({
                    topOffset: 33
                }),
                new ResizableHeader(),
                new SortableHeader(),
                new VirtualScrolling({
                    totalRows: tableConfig.dataLength,
                    getData: this.getDataRequest.bind(this),
                    redrawMode: VirtualScrolling.RedrawMode.SOFT
                })
                ]
            });

            this.table.setSortIcon(tableConfig.sortMode, tableConfig.sortAttr);
            // Listen for the sort event
            this.table.addEventHandler('sort', function (sortMode, sortAttr) {

            // Set the new sort options
            tableConfig.sortAttr = sortAttr;
            tableConfig.sortMode = sortMode;

            // set scroll in the fake div to the top
            this.table.getVirtualScrollBar().setPosition(0);
                this.table.reload();
            }.bind(this));

            this.table.attachTo(this.view.getDataGridHolder());
        },

        initializeTable: function () {
            dataService.init();
            dataService.setCompleteData(this.data);
            dataService.getDataLength().then(function (len) {
                this.tableConfig.dataLength = len;
                this.createTable();
            }.bind(this));
        }
    });

});