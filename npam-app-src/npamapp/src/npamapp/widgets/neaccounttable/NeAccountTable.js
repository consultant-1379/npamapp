/*******************************************************************************
 * COPYRIGHT Ericsson 2024
 *
 *
 *
 * The copyright to the computer program(s) herein is the property of
 *
 * Ericsson Inc. The programs may be used and/or copied only with written
 *
 * permission from Ericsson Inc. or in accordance with the terms and
 *
 * conditions stipulated in the agreement/contract under which the
 *
 * program(s) have been supplied.
 ******************************************************************************/

define([
    'jscore/core',
    'jscore/ext/utils/base/underscore',
    'tablelib/Table',
    'tablelib/plugins/ResizableHeader',
    'tablelib/plugins/RowEvents',
    'tablelib/plugins/QuickFilter',
    'tablelib/plugins/SortableHeader',
    'tablelib/plugins/VirtualSelection',
    'tablelib/plugins/VirtualScrolling',
    'tablelib/plugins/Selection',
    'tablelib/plugins/PinColumns',
    '../../ext/DataService',
    './NeAccountTableView',
    'i18n!npamapp/dictionary.json',
    'npamlibrary/statuscell',
    'npamlibrary/constants',
    "npamlibrary/tableSettings",
    'npamlibrary/serverUtil',
    'npamlibrary/restUrls'
], function (core, underscore, Table, ResizableHeader, RowEvents, QuickFilter, SortableHeader, VirtualSelection,
             VirtualScrolling, Selection, PinColumns, dataService, View, Dictionary, StatusCell, Constants,
             TableSettings, ServerUtil, RestUrls ) {
    'use strict';
        
    function getNeAccountColumns() {
        var columns = [
            {
                title: Dictionary.table.neNameHeader,
                attribute: 'neName',
                filter: {
                    type: 'text',
                    options: {
                        submitOn: 'input',
                        submitDelay: 250,
                        placeholder: Dictionary.filterPlaceHolder
                    }
                },
                width: '200px',
                sortable: true,
                resizable: true
            },
            {
                title: Dictionary.table.statusHeader,
                attribute: 'status',
                cellType: StatusCell,
                filter: {
                    type: 'text',
                    options: {
                        submitOn: 'input',
                        submitDelay: 250,
                        placeholder: Dictionary.filterPlaceHolder
                    }
                },
                width: '200px',
                sortable: true,
                resizable: true
            },
            {
                title: Dictionary.table.errorDetailsHeader,
                attribute: 'errorDetails',
                filter: {
                    type: 'text',
                    options: {
                        submitOn: 'input',
                        submitDelay: 250,
                        placeholder: Dictionary.filterPlaceHolder
                    }
                },
                width: '200px',
                sortable: true,
                resizable: true,
                visible: false
            },
            {
                title: Dictionary.table.lastUpdateHeader,
                attribute: 'lastUpdate',
                filter: {
                    type: 'text',
                    options: {
                        submitOn: 'input',
                        submitDelay: 250,
                        placeholder: Dictionary.filterPlaceHolder
                    }
                },
                width: '200px',
                sortable: true,
                resizable: true
            },
            {
                title: Dictionary.table.cbrsStatusHeader,
                attribute: 'cbrsStatus',
                cellType: StatusCell,
                filter: {
                    type: 'text',
                    options: {
                        submitOn: 'input',
                        submitDelay: 250,
                        placeholder: Dictionary.filterPlaceHolder
                    }
                },
                width: '150px',
                sortable: true,
                resizable: true
            },
            {
                title: Dictionary.table.cbrsErrorDetailsHeader,
                attribute: 'cbrsErrorDetails',
                filter: {
                    type: 'text',
                    options: {
                        submitOn: 'input',
                        submitDelay: 250,
                        placeholder: Dictionary.filterPlaceHolder
                    }
                },
                width: '200px',
                sortable: true,
                resizable: true,
                visible: false
            },
        ];
        return columns;
    }

    return core.Widget.extend({
        view: function () {
            // handlebar's comparator
             return new View({
                 dictionary : Dictionary
             });
         },

        init: function(options) {
            this.sortAttribute = 'neName';
            this.sortMode = 'asc';
            this.neList = options.neList;
            this.eventBus = options.eventBus;
            this.context = options.context;
            this.dataServiceType = options.dataServiceType;
            this.dataService = new dataService(this.dataServiceType);
            this.npamEnabled = options.npamEnabled;
            this.cbrsEnabled = options.cbrsEnabled;

            if ( options.columns )  {
                this.columns = options.columns;
            } else {
                this.columns = getNeAccountColumns.call(this);
            }
        },

        onViewReady: function () {
            this.getColumnWidths();

//            this.setTable(this.neList);
        },

        reload: function(neLlist) {
            this.getColumnWidths();
            //loader?
//            this.setTable(neList);
        },

        getCheckedIds: function() {
            return this.table.getCheckedIds();
        },

        updateTable: function(neList) {
            this.updateData(neList);
            this.table.uncheckAllIds();
            this.table.setTotalRows(this.neList.length);
            this.table.reload();
            if (this.table.getVirtualScrollBar() && this.table.getVirtualScrollBar().view.getScroll().find(".elWidgets-ScrollBar")) {
                this.table.getVirtualScrollBar().view.getContent()._getHTMLElement().style.width = 'calc(100% - 18px)';
            }
        },

        updateData: function(neList) {
            this.neList = neList;
            this.dataService.setData(this.neList, true);
            this.view.getCount().setText("(" + this.neList.length + ")");
            this.view.getSelected().setText(Dictionary.table.selected + "(" + 0 + ")");
            this.removeClearSelectionLink();
        },

        setTable: function (neList) {
            this.updateData(neList);
            if ( this.table && !this.table.isDestroyed() ) {
                this.table.destroy();
            }

//          Create table
            var sortAttribute = this.sortAttribute;
            var sortMode = this.sortMode;

            var plugins = [
                new SortableHeader(),
                new ResizableHeader() ,
                new PinColumns(),
                new QuickFilter({visible: true}),
                new VirtualScrolling({
                    totalRows: neList.length,
                    getData: this.getDataRequest.bind(this),
                    redrawMode: VirtualScrolling.RedrawMode.HARD
            })];

            plugins.push( new VirtualSelection ({
                bind: true,
                checkboxes: true,
                multiselect: true,
                selectableRows: true,
                getIds: function(start, end, success, error) {
                    this.dataService.getIds(start, end, sortAttribute, sortMode)
                        .then(success)
                        .catch(error);
                }.bind(this),
                getAllIds: function(success, error) {
                    this.dataService.getAllIds(sortAttribute, sortMode)
                        .then(success)
                        .catch(error);
                }.bind(this)
            }));

            this.table = new Table({
                unique_key: 'name',
                plugins: plugins,
                modifiers: [
                    {name: "striped"}
                ],
                columns: this.columns,
                neAccountType: this.dataServiceType,
                npamEnabled: this.npamEnabled,
                cbrsEnabled: this.cbrsEnabled
            });

            this.showSettings = true;
            this.tableSettings = new TableSettings({context: this.context, columns: this.columns,
                                                    appName: "neAccount", tableId: "neAccountTable"});
            this.view.getTableSettings().addEventHandler("click", function(){
                this.eventBus.publish('layouts:panelaction', Constants.TABLESETTINGS);
            }.bind(this));


            // Attach table to DOM
            this.table.addEventHandler('checkend', this.onTableSelect.bind(this));
            this.table.addEventHandler('filter:change', this.onTableFilter.bind(this));

            this.table.sort( this.sortMode, this.sortAttribute );
            this.table.addEventHandler("sort", function (sortMode, attribute) {
                this.sortMode = sortMode;
                this.sortAttribute = attribute;

                // set scroll in the fake div to the top
                this.table.getVirtualScrollBar().setPosition(0);
                this.table.reload();
            }.bind(this));

            // Set Table Height
            var windowHeight = core.Window.getProperty('innerHeight'),
                element = this.view.getNeAccountTableHolder(),
                eltPosition = element.getPosition();
            element.setStyle({height: (windowHeight - eltPosition.top ) + 'px'});

            this.table.attachTo(this.view.getNeAccountTableHolder());
        },

        getDataRequest: function (index, length, callback) {
            // provide the service which sorting we expect
            // as well as the section of data to load
            var sortAttr = this.sortAttribute,
                sortMode = this.sortMode;

            this.dataService.loadData(index, length, sortAttr, sortMode)
                .then(function (response) {
                    var resData = response.data;

                    // Change message in annotated scroll bar
                    if (resData !== undefined && resData.length > 0 ) {
                        var start = "";
                        if ( resData[0] !== undefined  ) {
                            start = resData[0][sortAttr];
                        }

                        var end = "";
                        if ( resData[resData.length - 1] !== undefined ) {
                            end = resData[resData.length - 1][sortAttr];
                        }

                        if (typeof start === 'string') {
                            // truncate long text to the relevant part for usability
                            if ( start )
                                start = start.substr(0, 20);
                            if ( end )
                                end = end.substr(0, 20);
                        }
                        this.table.getVirtualScrollBar().setAnnotationText(start + ' - ' + end);
                    }
                    callback(resData);
                }.bind(this));
        },

        onTableFilter: function (filters) {
            console.log("FILTERS ", filters);
            this.dataService.setFilter(filters);
            this.table.setTotalRows(this.dataService.getDataLength());
        },

        onTableSelect: function (visibleSelectedItems) {
            var selectedItems = this.getCheckedRows();
            var neAccountData = selectedItems.map(function (item) {
                return item;
            });
            this.view.getSelected().setText(Dictionary.table.selected + "(" + selectedItems.length + ")");
            if (selectedItems.length > 0) {
                this.addClearSelectionLink();
            } else {
                this.removeClearSelectionLink();
            }

            this.eventBus.publish('npamapp:updateActions', neAccountData, this.dataServiceType );
            this.eventBus.publish('npamapp:checkSummary');
        },

        addClearSelectionLink: function() {
            this.view.getClearSelectionSeparetor().setText("-");
            this.view.getClearSelectionLink().setText(Dictionary.table.clear);
            this.view.getClearSelectionLink().addEventHandler('click', function () {
            this.table.unselectAllIds();
            }.bind(this));
        },
       
        removeClearSelectionLink: function() {
            this.view.getClearSelectionSeparetor().setText("");
            this.view.getClearSelectionLink().setText("");
        },

        getCheckedRows: function() {
            var checkedRows = this.table.getCheckedIds();
            return this.dataService.getAllData().filter(function(rowObject) {
                return underscore.contains(checkedRows, rowObject.id);
            });
        },

        getTableSettings: function() {
            return this.tableSettings;
        },

        getColumnWidths: function () {
            ServerUtil.sendRestCall(
                'GET',
                RestUrls.getSavedTableSettings.replace("appName", "neAccount"),
                this.initColumnWidths.bind(this),
                this.errorFetchingSettings.bind(this),
                'json',
                'application/json'
            );
        },

        initColumnWidths: function(response) {
            if(response && response.length > 0) {
                this.updateColumns(response);
            } else {
                this.setTable(this.neList);
            }
         },

        errorFetchingSettings: function() {
            this.setTable(this.neList);
        },

        updateColumns: function(response) {
            var columnStatus;
            response.forEach(function(table) {
                columnStatus = JSON.parse(table.value);
            }.bind(this));

            for(var key in columnStatus) {
                for(var i=0; i<this.columns.length; i++) {
                   if(this.columns[i].attribute === key) {
                       this.columns[i].visible = columnStatus[key].visible;
                       this.columns[i].order = columnStatus[key].order;
                       this.columns[i].pinned = columnStatus[key].pinned;
                   }
                }
            }
            this.columns.sort(function(a, b){
                return a.order - b.order;
            });

            this.setTable(this.neList);
        }
    });
});
