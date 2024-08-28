define([
    'jscore/core',
    './createTableview',
    'container/api',
    'widgets/SelectBox',
    'widgets/Pagination',
    'widgets/Button',
    'tablelib/Table',
    'tablelib/plugins/Selection',
    'tablelib/plugins/StickyHeader',
    'tablelib/plugins/ResizableHeader',
    'tablelib/plugins/StickyScrollbar',
    'tablelib/plugins/SortableHeader',
    'tablelib/plugins/SecondHeader',
    'tablelib/plugins/RowEvents',
    '../ext/columns',
    'i18n!npamlibrary/dictionary.json',
    'npamlibrary/serverUtil',
    'tablelib/plugins/SmartTooltips',
    'npamlibrary/filterUtil',
    'npamlibrary/npamCommonUtil',
    'npamlibrary/displaymessage',
    'npamlibrary/messageUtil',
    'npamlibrary/i18NumberUtil'
], function (core, View, container, SelectBox, Pagination, Button, Table, Selection, StickyHeader, ResizableHeader, StickyScrollbar, SortableHeader, SecondHeader, RowEvents, Columns, libLanguage, ServerUtil, SmartTooltips, FilterUtil, CommonUtil, DisplayMessage, MessageUtil, i18nNumber) {

    return core.Widget.extend({

        View: View,

        init: function (data, isOtherObject, eventBus) {
            this.selectedNodes = {};
            this.filters = {};
            this.mode = "asc";
            this.attribute = "name";
            this.data = data;
            this.sortTable(this.mode,this.attribute);
            this.initializeTable(isOtherObject);
            this.pageLimitInitialization();
            this.paginationInitialization();
            this.isFilterApplied = false;
            this.eventBus = eventBus;
        },

        onViewReady: function () {
            this.table.attachTo(this.view.getTableHolder());
            this.view.setLimitLabelText(libLanguage.get('show'));
            this.pageLimit.attachTo(this.view.getPageLimitHolder());
            this.pagination.attachTo(this.view.getPaginationHolder());
//            this.view.getClearSelectionLink().addEventHandler('click', this.clearSelection.bind(this));
//            this.view.getClearSelectionLink().addEventHandler("keydown", function(evt){
//                if(evt.originalEvent.keyCode === 13){
//                    this.view.getClearSelectionLink().trigger("click");
//                }
//            }.bind(this));
        },

        initializeTable: function (isOtherObject) {
            this.table = new Table({
                plugins: [
                    new RowEvents({
                        events: ["contextmenu"]
                    }),
                    new StickyScrollbar(),
//                    new Selection({
//                        checkboxes: isOtherObject,
//                        selectableRows: isOtherObject,
//                        multiselect: isOtherObject,
//                        bind: isOtherObject
//                    }),
                    new ResizableHeader(),
                    new SortableHeader(),
                    new SecondHeader(),
                    new SmartTooltips()
                ],
                columns: Columns.columns
            });
            this.table.setSortIcon("asc", "name");
            this.table.setData(this.data);
            this.table.addEventHandler("filter", this.filterTableData.bind(this, true));
            this.table.addEventHandler("sort", this.sortAndBuildTable.bind(this));
            if (isOtherObject) {
                this.initializeTableEvents();
            }
            this.isOtherObject = isOtherObject;
        },

        isOtherAccordian: function() {
           return this.isOtherObject;
        },

        getTableData: function () {
            return this.data;
        },

        updateTable: function (data) {
            for (var i = 0; i < data.length; i++) {
                this.addModels(data[i]);
            }
            this.sortTable(this.mode,this.attribute);
            this.resetTable();
        },

        addModels: function (model) {
            if (!this.isFdnExist(this.data, model.networkElementFdn, 'json')) {
                this.data.push(model);
            }
        },

        isFdnExist: function (collection, fdn, type) {
            for (var i in collection) {
                if (type === 'json') {
                    if (collection[i].networkElementFdn === fdn) return true;
                }
                if (collection[i] === fdn) return true;
            }
            return false;
        },

        initializeTableEvents: function () {
            this.actions = [
                               {
                                   name: libLanguage.get('removeSelected'),
                                   type: "button",
                                   action: this.deleteNodes.bind(this)

                               }
                           ];
            this.table.addEventHandler('rowselectend', this.rowSelectEndHandler.bind(this));
            this.table.addEventHandler("rowevents:contextmenu", this.showRightClickOptions.bind(this));
        },

        deleteNodes: function() {
            this.eventBus.publish('updateTable');
            this.setSelectedRowCount();
        },

        pageLimitInitialization: function () {
            var defaultVal = {name: '50', value: 50, title: '50'};
            this.pageLimit = new SelectBox({
                value: defaultVal,
                items: [
                    {name: '10', value: 10, title: '10'},
                    defaultVal,
                    {name: '100', value: 100, title: '100'}
                ]
            });
            this.pageLimit.setWidth("75px");
            this.pageLimit.setModifier("width", "mini");
            this.pageLimit.addEventHandler("change", function () {
                this.buildPaginatedData(true);
                this.changeLimit = false;
            }.bind(this));
        },

        paginationInitialization: function () {
            this.pagination = new Pagination({
                pages: 1,
                selectedPage: 1
            });
            this.pagination.addEventHandler("pagechange", function () {
                if(!this.changeLimit) {
                    this.buildPaginatedData(false);
                }
            }.bind(this));
        },

        removeSelectedNodes: function () {
            var checkedRows = [];
            this.data.forEach(function (model) {
                var fdn = model.networkElementFdn;
                if (Object.keys(this.selectedNodes).indexOf(fdn) > -1) {
                    checkedRows.push(model);
                    delete this.selectedNodes[fdn];
                }
            }.bind(this));
            checkedRows.forEach(function (row) {
                for (var i = 0; i < this.data.length; i++) {
                    if (this.data[i].networkElementFdn === row.networkElementFdn) {
                        this.data.splice(i, 1);
                    }
                }
            }.bind(this));
            this.resetTable();
            this.eventBus.publish('topsection:leavecontext');
        },

        resetTable: function() {
            if (this.data.length === 0) {
                this.table.detach();
                this.view.hideHeader();
                this.paginatedData = [];
            } else {
                this.buildPaginatedData(false);
            }
        },

        showRightClickOptions: function (row, e) {
            var selectedRows = this.table.getSelectedRows();
            if (selectedRows.indexOf(row) === -1 && !e.originalEvent.ctrlKey) {
                this.table.unselectAllRows();
                this.table.selectRows(function (r) {
                    return (r === row);
                });
            }
            contextEvent = e;
            this.prepareContextActionsAndPublish();
        },

        prepareContextActionsAndPublish: function () {
            if (contextEvent) {
                var selectedRows = this.table.getSelectedRows();
                if (selectedRows.length > 0) {
                    container.getEventBus().publish("contextmenu:show", contextEvent, this.actions);
                } else {
                    container.getEventBus().publish("contextmenu:hide");
                }
            }
        },

        rowSelectEndHandler: function () {
            this.table.getRows().forEach(function (row) {
                var fdn = row.getData().networkElementFdn;
                if (row._isSelected) {
                    if (!this.isFdnExist(Object.keys(this.selectedNodes), fdn, 'array')) {
                        this.selectedNodes[fdn] = true;
                    }
                } else {
                    delete this.selectedNodes[fdn];
                }
            }.bind(this));
            this.publishActions(Object.keys(this.selectedNodes));
            this.hideRightClick();
            this.setSelectedRowCount();
        },

        hideRightClick: function () {
            container.getEventBus().publish("contextmenu:hide");
            contextEvent = null;
        },

        publishActions: function(data) {
            if (data.length > 0) {
                this.eventBus.publish('topsection:contextactions', this.actions);
            } else {
                this.eventBus.publish('topsection:leavecontext');
            }
        },

        clearSelection: function() {
            if(Object.keys(this.selectedNodes).length > 0) {
                this.eventBus.publish('topsection:leavecontext');
                 this.selectedNodes = {};
                this.table.unselectAllRows();

            }
            this.showSelectedForOtherObjects();
        },

        sortAndBuildTable: function(sortMode, sortAttr) {
            this.sortTable(sortMode, sortAttr);
            this.buildPaginatedData(false);
        },

        sortTable: function (sortMode, sortAttr) {
            this.mode = sortMode;
            this.attribute = sortAttr;
            sortMode = sortMode === "asc" ? -1 : 1;
            this.data.sort(function (a, b) {
                if (a[sortAttr] < b[sortAttr]) {
                    return 1 * sortMode;
                } else if (a[sortAttr] > b[sortAttr]) {
                    return -1 * sortMode;
                } else {
                    return 0;
                }
            });
        },

        checkRows: function() {
            if (Object.keys(this.selectedNodes).length > 0) {
                this.table.selectRows(function (row) {
                    return this.selectedNodes[row.getData().networkElementFdn];
                }.bind(this));
            }
        },

        buildPaginatedData: function (resetPagination) {
            var lower, upper, currentPage = 1;
            var rowsPerPage = this.pageLimit.getValue().value;
            var totalCollectionLength = this.data.length;

            if (rowsPerPage > totalCollectionLength || rowsPerPage === totalCollectionLength) {
                  this.view.getPaginationHolder().removeModifier("show");
                  this.view.getPaginationHolder().setModifier("hide");
            } else {
                  this.changeLimit = true;
                  var totalRecords = Math.ceil(totalCollectionLength / rowsPerPage);
                  this.pagination.setPages(totalRecords);
                  CommonUtil.adjustPaginationWidth(totalRecords, this.view);
                  this.view.getPaginationHolder().removeModifier("hide");
                  this.view.getPaginationHolder().setModifier("show");
            }
            if (resetPagination) {
                this.changeLimit = true;
                this.pagination.setPage(1);
            } else {
                currentPage = this.pagination.getSelectedPage() > Math.ceil(totalCollectionLength / rowsPerPage) ? this.pagination.getSelectedPage() - 1 : this.pagination.getSelectedPage();
            }
            lower = (currentPage * rowsPerPage) - (rowsPerPage - 1);
            upper = (lower) + (rowsPerPage - 1);

            if (upper > totalCollectionLength) {
                this.view.getNodesDisplayed().setText("Total (" + i18nNumber.getNumber(lower) + " - " + i18nNumber.getNumber(totalCollectionLength) + libLanguage.get('of') + i18nNumber.getNumber(totalCollectionLength) + ")");
            } else {
                this.view.getNodesDisplayed().setText("Total (" + i18nNumber.getNumber(lower) + " - " + i18nNumber.getNumber(upper) + libLanguage.get('of') + i18nNumber.getNumber(totalCollectionLength) + ")");
            }
            if(!this.isOtherObject){
                this.view.hideSelectedRowCount();
            }
            this.lower = (currentPage * rowsPerPage) - rowsPerPage;
            this.upper = (currentPage * rowsPerPage);
            this.paginatedData = this.data.slice(this.lower, this.upper);
            this.loadData();
            this.changeLimit = false;
        },

        getFdns: function(data) {
           var fdns = [];
           data.forEach(function(item) {
                if(item.activeSoftware === 'loading' || item.activeSoftware.indexOf('ERROR') > -1) {
                    fdns.push(item.networkElementFdn);
                }
           });
           return fdns;
        },

        asynchronousFunction: function (groupID, response) {
            this.renderValues(groupID, response.softwareVersions, response.unsupportedNodes, true, libLanguage.get('noResponseMsgHeader'));
        },

        renderValues: function(groupID, softwareVersions, unsupportedNodes, fetchStatus, errorTitle) {
            this.paginatedData = this.data.slice(this.lower, this.upper);
            this.loadData();
            this.fdnGroup[groupID].fetch = fetchStatus;
        },

        loadData: function() {
            this.filterTableData(false);
        },

        loadErrorMessage: function(groupID, response, xhr) {
            var errorTitle = MessageUtil.getErrorMessage(xhr.getStatus(), xhr.getResponseText()).userMessage.title;
            this.renderValues(groupID, [], {}, true, errorTitle);
            for(var i=0; i < this.data.length; i++) {
                if(this.data[i].activeSoftware === "loading" && this.fdnGroup[groupID].fdns.indexOf("NetworkElement="+this.data[i].name) > -1) {
                    this.data[i].activeSoftware = 'ERROR|'+errorTitle;
                }
            }
            this.paginatedData = this.data.slice(this.lower, this.upper);
            this.loadData();
        },

        filterTableData: function (isFilter, attr, value, comparator) {
            if (attr !== undefined) {
                this.filters[attr] = {comparator: comparator, value: value};
            }
            var models = [];
            var nodeDetails = this.data;
            Object.keys(nodeDetails).forEach(function (fdn) {
                models.push(nodeDetails[fdn]);
            });
            for (var key in this.filters) {
                if (key !== 'checkbox') {
                    models = FilterUtil.filterCollection(models, key, this.filters[key]);
                }
            }
            this.showSelectedForOtherObjects();
            var pageLimit = this.pageLimit.getValue().value, totalRecords = models.length;
            if(pageLimit >= totalRecords) {
                this.changeLimit = true;
                this.pagination.setPage(1);
            }
            var selectedPage = this.pagination.getSelectedPage();
            this.table.setData(models.slice((selectedPage - 1 ) * pageLimit, selectedPage * pageLimit));

            this.redrawSelectedOfTotalAndPagination(totalRecords, pageLimit);
            this.checkRows();
            this.publishActions(Object.keys(this.selectedNodes));
            if (value && value.length === 0) {
                delete this.filters[attr];
            }
            this.isFilterApplied = Object.keys(this.filters).length > 0;
            if(isFilter){
               this.clearSelection();
            }
        },

        redrawSelectedOfTotalAndPagination: function (totalRecords, pageLimit) {
            //Detach and hide the empty records message and it's div.
            if(this.displayEmptyRecordsMessage) {
                this.view.hideEmptyRecordsMessageHolder();
                this.displayEmptyRecordsMessage.detach();
            }
            //Modify the selected of total, in parallel with applied filters.
            var selectedOfTotalText = totalRecords;
            if (totalRecords === 0) {
                this.view.hidePageSizeSelect();
                this.view.showEmptyRecordsMessageHolder();
                this.displayEmptyRecordsMessage = CommonUtil.getEmptyRecordsMessage();
                this.displayEmptyRecordsMessage.attachTo(this.view.getEmptyMessageHolder());
            } else {
                this.view.showPageSizeSelect();
                this.view.showSelectedOfTotal();
                selectedOfTotalText = CommonUtil.getSelectedOfTotal(totalRecords, pageLimit, this.pagination.getSelectedPage());
                this.showSelectedForOtherObjects();
            }
            this.setTextForSelectedOfTotal(selectedOfTotalText);


            //Show or hide the pagination according to the filter results
            if (pageLimit >= totalRecords) {
               this.view.getPaginationHolder().removeModifier("show");
               this.view.getPaginationHolder().setModifier("hide");
            } else {
               this.view.getPaginationHolder().removeModifier("hide");
               this.view.getPaginationHolder().setModifier("show");
               var totalPages = Math.ceil(totalRecords / pageLimit);
               this.pagination.setPages(totalPages);
               CommonUtil.adjustPaginationWidth(totalPages, this.view);
            }
            this.changeLimit = false;
        },

        setTextForSelectedOfTotal: function (text) {
            this.view.getNodesDisplayed().setText(libLanguage.get('total') + " (" + text + ")");
        },

        getSelectedNodes: function() {
            return this.selectedNodes;
        },

        publishContextActions: function(){
            this.eventBus.publish('topsection:contextactions', this.actions);
        },

        showSelectedForOtherObjects: function(){
            if(this.isOtherObject){
                this.setSelectedRowCount();
            } else{
                this.view.hideSelectedRowCount();
            }
        },

        setSelectedRowCount: function(){
            // TORF-670644 Selected Count should not be visible
//            this.view.showSelectedRowCount();
//            this.view.setSelectedRowCount(libLanguage.get('selected') +"("+i18nNumber.getNumber(Object.keys(this.selectedNodes).length)+")");
            this.hideorShowClear(Object.keys(this.selectedNodes).length);
        },
        hideorShowClear: function(count){
            if(count===0){
                this.view.hideClearSelection();
            }
            else{
                this.view.setClearText();
                this.view.showClearSelection();
            }
        }
    });

});