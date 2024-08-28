define([
    'jscore/core',
    './mejobdetailsview',
    'widgets/Pagination',
    '../jobscollections/collection',
    './../../ext/mejobcolumns',
    './../../ext/DataService',
    'npamlibrary/constants',
    'widgets/SelectBox',
    'widgets/Dialog',
    'npamlibrary/accessdenied',
    "npamlibrary/filterUtil",
    'jscore/ext/mvp',
    'tablelib/Table',
    'tablelib/plugins/Selection',
    'tablelib/plugins/StickyHeader',
    'tablelib/plugins/ResizableHeader',
    'tablelib/plugins/StickyScrollbar',
    'tablelib/plugins/SecondHeader',
    'tablelib/plugins/SortableHeader',
    'widgets/ProgressBar',
    'npamlibrary/columnsUtil',
    'npamlibrary/displaymessage',
    'i18n!npamjobdetails/dictionary.json',
    'i18n!npamlibrary/dictionary.json',
    'npamlibrary/StandardErrorMessagesUtil',
    'tablelib/plugins/RowEvents',
    "container/api",
    'npamlibrary/serverUtil',
    "npamlibrary/dateUtil",
    'tablelib/plugins/SmartTooltips',
    'npamlibrary/restUrls',
    'npamlibrary/jobsColumn',
    'npamlibrary/npamCommonUtil',
    'npamlibrary/sessionStorageUtil',
    'npamlibrary/i18NumberUtil',
    'npamlibrary/selectionWidget',
    'jscore/ext/net',
    'tablelib/plugins/PinColumns'
], function (core, View, Pagination, Collection, Columns, DataService, Constants, SelectBox, Dialog, AccessDeniedDialog,
             FilterUtil, mvp, Table, Selection, StickyHeader, ResizableHeader, StickyScrollbar, SecondHeader,
             SortableHeader, ProgressBar, columnsUtil, displayMessage, language, libLanguage, StandardErrorMessagesUtil, RowEvents,
             container, ServerUtil, DateUtil, SmartTooltips, RestUrls, jobsColumn, npamCommonUtil, sessionStorageUtil,
             i18nNumber, SelectionWidget, net, PinColumns) {
    var defaultColumns = 7;

    return core.Region.extend({
        View: View,
        pageSize: 10,

        init: function (options) {
            this.options = options;
            this.dataService = new DataService();
            this.accessDeniedDialog = new AccessDeniedDialog();
            this.progressbar = new ProgressBar();
            this.offSet = 0;
            this.resetSelectedValues();
            this.filters = {};
            this.columns = Columns.getColumns();
            this.defaultColumns = Columns.getColumns(defaultColumns);
            this.meJobCollectionSet = new Collection();
            this.initializePreferences();
            this.meJobDetailsPagination = this.createPagination(1, 1);
            this.meJobDetailsPagination.selectedPage = 1;
            this.errorDialog = this.createErrorDialog("error", language.get('noPoidsFoundHeader'), language.get('noPoidsFound'));
            this.displayErrorMessage = new displayMessage();
            this.isPageLoaded = true;
            this.hasNoColSelMsg = false;
            this.attributeMapper = jobsColumn.getColumnNames();
            this.selectionWidget = new SelectionWidget();
            this.selectionWidget.addSelectAllClickHandler(this.selectAllClick.bind(this));
            this.selectionWidget.addClearAllClickHandler(this.clearMenu.bind(this));
            this.appName = options.appName;
            this.selectedJobDetails = sessionStorageUtil.getSessionStorageAttribute("selectedJobsArrayOfModels");
        },

        selectAllClick: function() {
            this.selectAllClicked = true;
            this.fetchMeJobDetails();
        },

        createErrorDialog: function (type,header,text) {
            var widget = new Dialog({
                type: type,
                header: header,
                content: text,
                buttons: [
                    {caption: libLanguage.get('ok'),color: 'darkBlue', action: function () {
                            widget.hide();
                    }.bind(this)}
                ],
                visible: false
            });
            return widget;
        },

        onStart: function () {
            //this.selectedJobDetails = sessionStorageUtil.getSessionStorageAttribute("selectedJobsArrayOfModels");
            this.getUserDetails();
            this.initTable();
            npamCommonUtil.adjustPaginationWidth(this.pagesCount, this.view);
            this.initialShowSelectbox();
            this.pageLimit.attachTo(this.view.getPageLimitHolder());
            this.progressbar.attachTo(this.view.getProgress());
            this.meJobDetailsTable.attachTo(this.view.getMeJobTableHolder());
            this.addObjectsToDom();
            this.subscribeForEvents();
            this.view.getTableSettings().addEventHandler("click", function(){
               this.getEventBus().publish('layouts:panelaction', Constants.TABLESETTINGS);
            }.bind(this));
            this.view.hideSelectedCount();
            this.selectionWidget.attachTo(this.view.getSelectedRowsCountHolder());
            this.view.getFiltersClearSelectionLink().addEventHandler("click", this.clearFilters.bind(this));
        },

        clearFilters: function () {
            this.filters = {};
            this.clearMenu();
            var allFilterInputs = this.getElement().findAll("input");
            var cancelButtons = this.getElement().findAll(".eaNpamlibrary-FilterHeaderCell-cancelButton");
            for (var i = 0; i < allFilterInputs.length; i++) {
                allFilterInputs[i].setValue("");
                if(cancelButtons[i] && cancelButtons[i]!== null){
                    cancelButtons[i].setAttribute("style","display:none");
                }
            }
            this.view.hideFiltersAppliedHolder();
            this.fetchMeJobDetails();
        },

        getUserDetails: function() {
            this.getUser().then(function(data) {
               this.userObj = data;
            }.bind(this),
            function(data) {
               console.log("Error in getUser: Could not get user.");
            });
        },

        setSelectedRowsCount: function (count) {
            if(count === 0) {
                this.view.hideSelectedCount();
                this.selectionWidget.detach();
            } else {
                this.view.showSelectedCount();
                this.setSelectionWidgetTxt(count);
                this.selectionWidget.attach();
            }
        },

        setSelectionWidgetTxt: function(count) {
            this.selectionWidget.setSelectionWidget(count, this.totalCount, this.isAllselectedInCurrentpage);
        },

        subscribeForEvents: function () {
            this.getEventBus().subscribe("updatecolumns", this.updateColumns.bind(this));
            this.getEventBus().subscribe("noColSelected", this.noColSelected.bind(this));
        },

        addObjectsToDom: function () {
            this.view.setLimitLabelText(libLanguage.get('show'));

            this.view.setEndTimelabel(language.get('endTime'));
            this.view.setStartTimelabel(libLanguage.get('startTime'));
            this.view.setNodeProgresslabel(language.get('nodeProgress'));
            this.view.setResultlabel(libLanguage.get('result'));
            this.view.setStatuslabel(language.get('status'));
            this.view.setTypelabel(libLanguage.get('jobType'));
            this.view.setOveralProgresslabel(language.get('overallJobProgress'));
            this.view.setCreatedlabel(language.get('createdBy'));
            this.view.getTableSettings().setAttribute("title",libLanguage.get('tableSettings'));
        },

        noColSelected: function () {
            this.showNoColSelMsg();
            this.hideAllSections();
        },

        updateColumns: function (columns) {
            this.columns = columns;
            this.meJobDetailsTable.destroy();
            this.getColumnWidths();
            this.meJobDetailsTable.attachTo(this.view.getMeJobTableHolder());
            if (this.selectedJobsArray.length > 0) {
                 this.persistSelection();
            }
            this.applyFilters();
            this.hasNoColSelMsg = false;
            this.hideNoColSelMsg();
            this.showAllSections();
            this.hidePagination();
        },

        createTable: function (updateColumns) {
            if (!updateColumns) {
                columnsUtil.getColumnsFromResponseObject(this.columns, this.meJobCollectionSet, this.meJobPreferences.sortBy,
                            this.meJobPreferences.orderBy, false, this.appName, "nodeProgressTable", function (data) {
                    this.columns = data;
                    this.getColumnWidths();
                }.bind(this), this.defaultColumns);
            } else {
                this.initTable();
            }
        },

        getColumnWidths: function () {
            ServerUtil.sendRestCall( 'GET', RestUrls.getSavedColumnSettings.replace("appName", this.appName),
                this.initColumnWidths.bind(this), this.errorFetchingColumnWidths.bind(this), 'json', 'application/json');
        },

        initColumnWidths: function (colWidth) {
            this.savedColumnWidth = {};
            colWidth.forEach(function (table) {
                if (table.id === "nodeProgressTable") {
                    table.value = JSON.parse(table.value);
                    this.savedColumnWidth = table;
                }
            }.bind(this));
            this.updateColumnWidths();
        },

        errorFetchingColumnWidths: function () {
            this.initTable();
        },

        updateColumnWidths: function () {
            if (Object.keys(this.savedColumnWidth).length > 0) {
                for (var i = 0; i < this.columns.length; i++) {
                    if (this.savedColumnWidth.value[this.columns[i].attribute]) {
                        this.columns[i].width = this.savedColumnWidth.value[this.columns[i].attribute];
                    }
                }
            }
            this.initTable();
            this.applyFilters();
            if (this.checkForNoColumns()) {
                this.noColSelected();
            } else {
                this.hideNoColSelMsg();
            }
        },

        checkForNoColumns: function () {
            var count = 0;
            this.columns.forEach(function (model) {
                if (model.visible === true) {
                    count++;
                }
            });
            return count === 0 ? true : false;
        },

        saveColumnWidth: function (column) {
            // return new Promise (function(){
                var found = false;
                var payload = this.savedColumnWidth;
                if (payload.id === "nodeProgressTable") {
                    if (typeof (payload.value) === 'string') {
                        payload.value = JSON.parse(payload.value);
                    }
                    payload.value[column.attribute] = column.width;
                    payload.value = JSON.stringify(payload.value);
                    found = true;
                }
                if (!found) {
                    payload.id = "nodeProgressTable";
                    payload.value = this.getColumnWidth(column);
                }
                ServerUtil.sendRestCall( 'PUT', RestUrls.getSavedColumnSettings.replace("appName", this.appName),
                    '', '', 'json', 'application/json', JSON.stringify(payload) );
        },

        getColumnWidth: function (column) {
            var value = {};
            value[column.attribute] = column.width;
            return JSON.stringify(value);
        },

        initialShowSelectbox: function () {
            this.pageSize = 10;
            this.pageLimit = new SelectBox({
                value: {name: '10', value: 10, title: '10'},
                items: [
                    {name: '10', value: 10, title: '10'},
                    {name: '50', value: 50, title: '50'},
                    {name: '100', value: 100, title: '100'}
                ]
            });
            this.pageLimit.setWidth("75px");
            this.pageLimit.setModifier("width", "mini");
            this.pageLimit.addEventHandler("change", this.resetMainPageSize.bind(this));
            this.pageLimit.disable();
        },

        resetMainPageSize: function () {
            this.hideRightClick();
            this.pageSize = this.pageLimit.getValue().value;
            this.meJobDetailsPagination.selectedPage = 1;
            this.view.showLoadingAnimation();
            this.fetchMeJobDetails();
        },

        initTable: function () {
            if (this.meJobDetailsTable) {
                this.meJobDetailsTable.destroy();
            }
            this.meJobDetailsTable = new Table({
                plugins: [
                    new RowEvents({
                        events: ["dblclick", "contextmenu", "click"]
                    }),
                    new PinColumns(),
                    new StickyScrollbar(),
                    new Selection({
                        checkboxes: false,
                        selectableRows: true,
                        multiselect: true,
                        bind: true
                    }),
                    new ResizableHeader(),
                    new SortableHeader(),
                    new SecondHeader(),
                    new SmartTooltips()
                ],
                data: this.meJobCollectionSet.toJSON(),
                columns: this.columns
            });
            this.meJobDetailsTable.setSortIcon(this.meJobPreferences.orderBy, this.meJobPreferences.sortBy);
            this.meJobDetailsTable.addEventHandler("columnresize", this.saveColumnWidth.bind(this));
            this.meJobDetailsTable.addEventHandler("sort", this.meJobDetailsTableSortHandler.bind(this));
            this.meJobDetailsTable.addEventHandler("rowselectend", this.onJobSelected.bind(this));
            this.meJobDetailsTable.addEventHandler("rowevents:dblclick", this.onJobSelected.bind(this));
            this.meJobDetailsTable.addEventHandler("check", this.hideRightClick.bind(this));
            this.meJobDetailsTable.addEventHandler("rowevents:click", this.hideRightClick.bind(this));

            this.meJobDetailsTable.addEventHandler("filter", function (attr, val, comparator, dateValue) {
                this.hideRightClick();
                this.filters = FilterUtil.removeExistingFilters(this.filters, attr);
                this.filters[attr] = {
                    value: val,
                    comparator: comparator,
                    dateVal: dateValue
                };
            }.bind(this));

            //To fetch filtered data 2 seconds after entering the filter criteria.
            this.meJobDetailsTable.addEventHandler("fetchFilterResults", function () {
                var filtersLength = this.getFilterValuesAsList().length;
                if ( filtersLength > 0) {
                    this.view.showLoadingAnimation();
                    this.view.showFiltersAppliedHolder();
                    this.view.setFiltersAppliedText();
                    this.view.setFiltersAppliedClearText();
                    FilterUtil.enableOrDisableFilterTextBox(false, this.view.getElement());
                    this.clearMenu();
                    this.meJobDetailsPagination.selectedPage = 1;
                } else {
                    this.enableFilters();
                }
                this.fetchMeJobDetails();
            }.bind(this));

            this.meJobDetailsTable.getElement().setAttribute("style", "overflow-y: auto");
            this.meJobDetailsTable.attachTo(this.view.getMeJobTableHolder());
//            this.prepareRightClick();
            this.persistSelection();
        },

        getFilterValuesAsList: function () {
            return FilterUtil.getFilterValuesAsList(this.filters);
        },

        hideRightClick: function () {
            container.getEventBus().publish("contextmenu:hide");
            this.contextEvent = null;
            this.rightClickFlag = false;
        },

//        prepareRightClick: function () {
//            this.meJobDetailsTable.addEventHandler("rowevents:contextmenu", function (row, e) {
//                // If there is any row selected then show context menu
//                if (this.selectedJobsArrayOfModels.indexOf(row) === -1 && !e.originalEvent.ctrlKey && !row.getCells()[0].isChecked()) {
//                    this.meJobDetailsTable.unselectAllRows();
//                    this.meJobDetailsTable.selectRows(function (r) {
//                        return (r === row);
//                    });
//                }
//                this.onJobSelected(row, null);
//                this.rightClickFlag = true;
//                this.contextEvent = e;
//                this.prepareContextActionsAndPublish();
//            }.bind(this));
//        },

//        prepareContextActionsAndPublish: function () {
//            if (this.contextEvent) {
//                if (this.selectedJobsArrayOfModels.length > 0) {
//                    var actions = [];
//                    this.actions.forEach(function (action) {
//                        if (action.length > 0) {
//                            action.forEach(function (obj) {
//                                if(obj.value !== Constants.CREATEJOB){
//                                    actions.push(obj);
//                                }
//                            });
//                        } else {
//                            actions.push(action);
//                        }
//                    });
//                    container.getEventBus().publish("contextmenu:show", this.contextEvent, actions);
//                } else {
//                    container.getEventBus().publish("contextmenu:hide");
//                }
//            }
//        },

        parseJobIdIntoRequest: function (jobId) {
            this.view.getTotalPageElement().setAttribute("style", "visibility:hidden");
            this.view.hideTable();
            this.displayErrorMessage.detach();
            if (this.jobId !== jobId) {
                this.jobId = jobId;
                this.clearMenu();
            }
            this.setJobDetails(this.selectedJobDetails);
            this.fetchNpamJobDetails();
//            this.fetchMeJobDetails(true);
        },

        onJobSelected: function (row, isSelected) {
            if(!this.persistSelectionStatus) {
                this.selectAllClicked = false;
            } else {
                this.persistSelectionStatus = false;
            }
            this.maintainSelection(row, isSelected);
//            this.prepareContextActionsAndPublish();
        },

        meJobDetailsTableSortHandler: function (order, column) {
            this.sortingFlag = true;
            this.hideRightClick();
            this.meJobPreferences.orderBy = order;
            this.meJobPreferences.sortBy = column;
            this.fetchMeJobDetails();
        },

        fetchMeJobDetails: function ( initializeData ) {
            if( this.hasNoColSelMsg ){
                this.showNoColSelMsg();
            } else {
                this.view.showLoadingAnimation();
                this.view.hidePageSizeSelect();
            }

            this.clearPreviousMeJobDetails();

            if ( initializeData ) {
                this.view.hideFiltersAppliedHolder();
                if(!this.hasNoColSelMsg){
                    this.hideErrorMessage();
                }
                if (this.xhr) {
                    this.xhr.abort();
                }
                this.xhr = ServerUtil.sendRestCall("GET", "/npamservice/v1/job/nedetails/"+this.jobId,
                                                               this.onMeJobDetailsResponse.bind(this), this.loadErrorMessage.bind(this),
                                                               'json', 'application/json'/*, payload*/);
            } else {
                this.applyFilteringToDataService();
            }
        },

        onMeJobDetailsResponse: function (response) {
            this.dataService.setData(response, true);
//            this.totalCount = response.length;
            this.applyFilteringToDataService();
        },

        applyFilteringToDataService: function () {
            var payload = this.buildMeJobPayload( this.meJobDetailsPagination.selectedPage,
                                                  this.meJobPreferences.sortBy,
                                                  this.meJobPreferences.orderBy);
            this.dataService.setFilter(this.getFilterValuesAsList());
            this.dataService.loadData(payload.offset, this.pageSize /*payload.limit*/, payload.sortBy, payload.orderBy)
                                    .then(this.onMeJobDetailsReceived.bind(this));
        },


        buildMeJobPayload: function (pageNumber, sortBy, orderBy) {
            if (!pageNumber) {
                pageNumber = 1;
            }
            this.offSet = this.pageSize * (pageNumber - 1) + 1;
            var payload = {
                offset: this.offSet,
                limit: this.offSet + this.pageSize - 1,
                sortBy: sortBy,
                orderBy: orderBy
            };
            if(this.selectAllClicked) {
                payload.selectAll = true;
            }
            return payload;
        },

        //showNoJobsMsg: method show when there are no job during the fetch
        showNoJobsMsg: function () {
            this.displayErrorMessage.detach();
            this.displayErrorMessage.showMessage(true, libLanguage.get('noResultsFoundContent'), "dialogInfo", libLanguage.get('noResultsFoundHeader'));
            this.displayErrorMessage.attachTo(this.view.getErrorMessageHolder());
            this.clearMenu();
            this.hideTableandRightPanel();
        },

        hideTableandRightPanel: function () {
            this.view.hideSelectedOfTotal();
            this.view.hideSelectedCount();
            this.view.hidePageSizeSelect();
            this.hidePagination();
            this.getEventBus().publish("showTableSettings", false);
            this.getEventBus().publish('layouts:closerightpanel');
        },

        displayEmptyTable: function () {
            this.showTable();
            this.initTable();
            this.applyFilters();
            this.getEventBus().publish("showTableSettings", false);
            this.getEventBus().publish("closeRightPanel");
            this.enableFilters();
        },

        showTable: function () {
            this.view.showTable();
        },

        showHeader: function () {
            this.view.showSelectedOfTotal();
            this.view.showPageSizeSelect();
        },

        showPagination: function () {
            this.view.showMeJobPaginationHolder();
        },

        hidePagination: function () {
            this.view.hideMeJobPaginationHolder();
        },

        hidePageLimitHolder: function () {
            this.view.hidePageLimitHolder();
        },

        showPageLimitHolder: function () {
            this.view.showPageLimitHolder();
        },

        hideMeJobTableHolder: function () {
            this.view.hideMeJobTableHolder();
        },

        showMeJobTableHolder: function () {
            this.view.showMeJobTableHolder();
        },

        hideErrorMessage: function () {
            if (this.displayEmptyRecordsMessage) {
                this.displayEmptyRecordsMessage.detach();
            }
            this.displayErrorMessage.detach();
            this.view.hideErrorMessageHolder();
        },

        showEmptyRecordsMessage: function () {
            //Detach and hide the empty records message and it's div.
            this.hideErrorMessage();
            this.view.showErrorMessageHolder();
            //prepare an empty records message and attach it below the table.
            this.displayEmptyRecordsMessage = npamCommonUtil.getEmptyRecordsMessage();
            this.displayEmptyRecordsMessage.attachTo(this.view.getErrorMessageHolder());
            //Modify the selected of total, in parallel with applied filters.
            this.setTextForSelectedOfTotal(0);
        },

        setTextForSelectedOfTotal: function (text) {
            this.view.showSelectedOfTotal();
            this.view.setSelectedOfTotal("(" + text + ")");
        },

        onMeJobDetailsReceived: function (response) {
            if (typeof(response) === undefined) {
                this.view.hideTopSection();
                this.getEventBus().publish("loadTableSettingEvent", false);
            } else {
                this.view.showTopSection();
                this.setJobDetails(this.selectedJobDetails);
                this.view.getTotalPageElement().setAttribute("style", "visibility:visible");

                if (response.data.length === 0 ) {
                    if (this.getFilterValuesAsList().length > 0) {
                        this.displayEmptyTable();
                        this.showEmptyRecordsMessage();
                        this.showOrHideRowActions();
                    } else {
                        this.showNoJobsMsg();
                        this.view.hideSelectedOfTotal();
                        this.view.hideSelectedCount();
                    }
                    this.view.hidePageSizeSelect();
                    this.hidePagination();

                    if (this.selectedJobDetails.state === Constants.SCHEDULED) {
                        this.hideMeJobTableHolder();
                        this.view.hideSelectedCount();
                        this.view.showTable();
                        var date = DateUtil.formatNpamDate(response.startTime, true);
                        this.displayErrorMessage.showMessage(true, libLanguage.get('scheduledJobMessage') + date, "dialogInfo", libLanguage.get('nodeInfoMessage'));
                    }
                    this.view.showErrorMessageHolder();
                    this.hidePageLimitHolder();
                } else {
                    this.isAllselectedInCurrentpage = false;
                    this.totalCount = response.totalLength;
                    this.totalRows = response.data.length;
                    this.getEventBus().publish("showTableSettings", true);
                    this.getEventBus().publish("loadTableSettingEvent", true);
                    this.buildTableData(response.data);
                }
            }
            this.isPageLoaded = true;
            this.view.hideLoadingAnimation();
        },

        showOrHideRowActions: function () {
            if (this.selectedJobsArray.length === 0) {
                this.getEventBus().publish('topsection:leavecontext');
            }
        },

        applyFilters: function () {
            FilterUtil.applyFilters(this.filters, this.columns, this.view.getElement());
        },

        showNoColSelMsg: function () {
            this.displayErrorMessage.showMessage(true, libLanguage.get('noColSelContent'), "dialogInfo", libLanguage.get('noColSelTitle'));
            this.displayErrorMessage.attachTo(this.view.getErrorMessageHolder());
            this.view.showErrorMessageHolder();
        },

        hideAllSections: function () {
            this.hideHeaderSection();
            this.view.hideSelectedCount();
            this.hasNoColSelMsg = true;
            this.meJobDetailsTable.detach();
            this.getEventBus().publish('topsection:leavecontext');
        },

        hideNoColSelMsg: function () {
            this.displayErrorMessage.detach();
        },

        showAllSections: function () {
            this.showHeaderSection();
        },

        hideHeaderSection: function () {
            this.view.getPaginationHolder().setStyle("display", "none");
            this.view.hideSelectedOfTotal();
            this.view.hideSelectedCount();
            this.view.hidePageSizeSelect();
        },

        showHeaderSection: function () {
            this.showHeader();
            this.view.getPaginationHolder().setStyle("display", "inline-block");
            this.meJobDetailsPagination.attachTo(this.view.getPaginationHolder());
        },

//        clearInputFields: function () {
//            var inputList = this.view.getInputFields();
//            for (var i = 0; i < inputList.length; i++) {
//                inputList[i].setValue("");
//            }
//            this.filters = {};
//        },

        clearPreviousMeJobDetails: function () {
            var models = [];
            this.meJobCollectionSet.each(function (model) {
                models.push(model);
            }.bind(this));
            this.meJobCollectionSet.removeModel(models, {silent: false});
        },

        setJobDetails: function (jobDetails) {
            this.jobName = jobDetails.name;
            this.view.setJobName(jobDetails.name);
            this.view.setCreatedBy(jobDetails.owner);
            this.setJobProgress(jobDetails.progressPercentage, jobDetails.state, jobDetails.result);
            var jobStatus = jobDetails.state;
            jobStatus = Constants[jobStatus] ? Constants[jobStatus] : jobStatus;
            this.view.setStatus(jobStatus);
            this.view.setType(jobDetails.jobType);
            this.jobType = jobDetails.jobType;
            this.setJobResult(jobDetails.result);
            this.view.setStartTime(DateUtil.formatNpamDate(jobDetails.startTime, true));
            this.view.setEndTime(DateUtil.formatNpamDate(jobDetails.endTime, true));
        },

        setJobProgress: function (value, statusValue, result) {
            this.progressbar.setValue(value);
            this.view.getProgress().setStyle("display", "inline-block");

            if (statusValue === Constants.USER_CANCELLED ) {
                this.progressbar.setColor(Constants.RED);
            } else if ( statusValue === Constants.COMPLETED && result === Constants.FAILED ) {
                this.progressbar.setColor(Constants.RED);
            } else if (statusValue === Constants.PARTIALLY_COMPLETED) {
                this.progressbar.setColor(Constants.ORANGE);
            } else if (statusValue === Constants.RUNNING) {
                this.progressbar.setColor(Constants.PALEBLUE);
            } else if (statusValue === Constants.COMPLETED && result === Constants.SUCCESS) {
                this.progressbar.setColor(Constants.GREEN);
            } else {
                this.view.getProgress().setStyle("display", "none");
            }
        },

        setJobResult: function (result) {
            this.view.getResultIcon().setAttribute("class", "ebIcon eaNpamjobdetails-rMeJobDetails-resultIcon");
            switch (result) {
                case "SUCCESS":
                    this.status = "Success";
                    this.icon = "tick";
                    break;
                case "FAILED":
                    this.status = "Failed";
                    this.icon = "error";
                    break;
                case "SKIPPED":
                    this.status = "Skipped";
                    this.icon = "warning";
                    break;
                case "":
                    this.status = "";
                    this.icon = "";
                    break;
            }
            this.view.setResultMessage(this.status);
            this.view.getResultIcon().setModifier(this.icon);
        },

        buildTableData: function(meJobs) {
            meJobs.forEach(function (meJob) {
                meJob.startTimeI18n = DateUtil.formatNpamDate(meJob.startTime, true);
                meJob.endTimeI18n = DateUtil.formatNpamDate(meJob.endTime, true);
                this.meJobCollectionSet.addModel(meJob);
            }.bind(this));
            this.getJobDetailtable();
            this.view.hideLoadingAnimation();
        },

        getJobDetailtable: function() {
            this.showTable();
            this.showHeader();
            this.showPagination();
            this.showMeJobTableHolder();
            this.showPageLimitHolder();
            this.getOffSetAndLimit(this.totalRows, this.offSet, this.totalCount);
            this.pageLimit.enable();
            if (this.totalCount <= this.pageSize) {
                this.meJobDetailsPagination.detach();
                this.meJobPreferences.flag = true;
            } else {
                this.redrawPaginationForMeJobDetails(this.totalCount);
                this.meJobDetailsPagination.attachTo(this.view.getPaginationHolder());
            }
            this.hideErrorMessage();
            if (this.sortingFlag) {
                this.meJobDetailsTable.setData(this.meJobCollectionSet.toJSON());
                this.sortingFlag = false;
            } else {
                this.createTable(false);
                this.view.hideErrorMessageHolder();
            }
            this.applyFilters();
//            if (this.contextEvent !== null && this.rightClickFlag === true) {
//                this.prepareContextActionsAndPublish();
//            }
            if (this.selectedJobsArray.length > 0) {
                this.persistSelection();
            } else {
                this.getEventBus().publish("noMeJobDetailSelected");
            }
            if (this.hasNoColSelMsg) {
                this.showNoColSelMsg();
                this.hideAllSections();
            }else{
                this.getEventBus().publish("showTableSettings", true);
            }
            this.enableFilters();
            this.showOrHideRowActions();
        },

        redrawPaginationForMeJobDetails: function (totalCount) {
            this.pagesCount = Math.ceil(totalCount / this.pageSize);
            if (this.meJobDetailsPagination) {
               this.meJobDetailsPagination.destroy();
               this.meJobPreferences.flag = true;
            }
            npamCommonUtil.adjustPaginationWidth(this.pagesCount, this.view);
            this.meJobDetailsPagination = this.createPagination(this.pagesCount, this.meJobDetailsPagination.selectedPage);
        },

        createPagination: function (pages, selectedPage) {
            var widget = new Pagination({
                pages: pages,
                selectedPage: selectedPage,
                onPageChange: function (pageNumber) {
                    widget.selectedPage = pageNumber;
                    if (!this.meJobPreferences.flag) {
                        this.view.showLoadingAnimation();
                        this.fetchMeJobDetails();
                    }
                    this.meJobPreferences.flag = false;
                }.bind(this)
            });
            return widget;
        },

        getOffSetAndLimit: function (totalRows, OffSet, totalCount) {
            var limit = OffSet + totalRows - 1;
            this.setTextForSelectedOfTotal(i18nNumber.getNumber(OffSet) + " - " + i18nNumber.getNumber(limit) + libLanguage.get('of') + i18nNumber.getNumber(totalCount));
        },

        maintainSelection: function (Selectedrow, event) {
            this.isAllselectedInCurrentpage = false;
            var totalRowsCurrentPage = this.meJobDetailsTable.getRows().length;
            var currentPageSelectedCount = 0;
            if (event && event.originalEvent && event.originalEvent.type === "dblclick") {
                if (this.selectedJobsArray[0] === undefined || this.selectedJobsArray[0] === null) {
                    this.selectedJobsArray = this.previousSelectedJobs;
                }
                this.resetSelectedValues();
                this.selectedJobsArray.push(Selectedrow.getData().neJobId);
                this.selectedJobsArrayOfModels.push(Selectedrow.getData());
                this.meJobDetailsTable.unselectAllRows();
                this.meJobDetailsTable.checkRows(function (row) {
                    return (this.selectedJobsArray[0] === row.getData().neJobId) ? true : false;
                }.bind(this));
                window.location.hash = Constants.SHM_JOB_LOGS_LINK + "/" + this.jobId + "/" + this.selectedJobsArray;
            } else {
                var rows = this.meJobDetailsTable.getRows();
                rows.forEach(function (row) {
                    if (row.getCells()[0].isChecked()) {
                        this.findAndReplaceEntries(row.getData());
                        currentPageSelectedCount++;
                    } else {
                        for (var i = 0; i < this.selectedJobsArray.length; i++) {
                            if (this.selectedJobsArray[i] === row.getData().neJobId) {
                                this.selectedJobsArray.splice(i, 1);
                                this.selectedJobsArrayOfModels.splice(i, 1);
                                this.selectedJobNames.splice(i,1);
                                break;  //once the row is spliced, the for loop needs to be terminated.
                            }
                        }
                    }
                }.bind(this));
                if (this.selectedJobsArray.length > 0) {
                    if (Selectedrow && this.selectedJobsArray !== Selectedrow[0]) {
                        this.previous = Selectedrow[0];
                    }
                    if(this.changeActions) {
                        this.getEventBus().publish('topsection:contextactions', this.actions);
                    }
                } else {
                    this.clearMenu();
                    this.selectedJobNames = [];
                    this.getEventBus().publish("noMeJobDetailSelected");
                }
            }
            if(this.hasNoColSelMsg) {
                this.hideAllSections();
            }
            if(totalRowsCurrentPage === currentPageSelectedCount) {
                this.isAllselectedInCurrentpage = true;
            }
            this.setSelectedRowsCount(this.selectedJobsArray.length);
        },

        findAndReplaceEntries: function (model) {
            this.selectedJobNames = [];
            var isFound = false;
            for (var i = 0; i < this.selectedJobsArray.length; i++) {
                if (this.selectedJobsArray[i] === model.neJobId) {
                    isFound = true;
                    break;
                }
            }
            if (!isFound) {
                this.selectedJobsArray.splice(i, 1, model.neJobId);
            }
            this.selectedJobsArrayOfModels.splice(i, 1, model);

            var selectedRowData = this.selectedJobsArrayOfModels;
            selectedRowData.forEach(function (nodeName) {
                this.selectedJobNames.push(nodeName.neNodeName);
            }.bind(this));
        },

        getUser: function(){
           return new Promise(function (resolve, reject) {
                   net.ajax({
                   url: "/editprofile",
                   type: "GET",
                   dataType: "json",
                   success: resolve,
                   error: reject
               });
           });
        },

        persistSelection: function () {
            this.meJobDetailsTable.checkRows(function (row) {
                return this.selectedJobsArray.indexOf(row.getData().neJobId) > -1;
            }.bind(this));
            this.persistSelectionStatus = true;
        },

        setIsTableSettingShown: function (value) {
            this.isTableSettingShown = value;
            if (this.jobsTable) {
                this.jobsTable.detach();
            }
            this.jobsTable = undefined;
            if (value) this.fetchMeJobDetails();
        },

        clearMenu: function () {
            this.resetSelectedValues();
            this.previous = "";
            this.selectAllClicked = false;
            if (this.meJobDetailsTable) {
                this.meJobDetailsTable.unselectAllRows();
            }
            this.getEventBus().publish('topsection:leavecontext');
            this.hideRightClick();
            this.setSelectedRowsCount(0);
        },

        showErrorMessage: function (errorBody) {
            this.displayErrorMessage.detach();
            this.displayErrorMessage.showMessage(true, errorBody.userMessage.body, "error", errorBody.userMessage.title);
            this.view.showErrorMessageHolder();
            this.displayErrorMessage.attachTo(this.view.getErrorMessageHolder());
            this.view.hideLoadingAnimation();
        },

        loadErrorMessage: function (response, xhr) {
            this.hideTableandRightPanel();
            this.view.hidePageSizeSelect();
            this.isPageLoaded = true;

            var errorCode = xhr.getStatus();
            var internalErrorCode;
            var details = "";
            try {
                internalErrorCode = xhr.getResponseJSON().internalErrorCode;
                details = xhr.getResponseJSON().errorDetails.replace(/\n/g, "<br />");
            } catch(e) {
                //JSON parse error, this is not json (or JSON isn't in your browser)
                details = "";
            }
            var errorMessage = StandardErrorMessagesUtil.getStandardErrorMessage(errorCode, internalErrorCode);
            var errorBody = {};
            errorBody.body = errorMessage.description + "</br>" + details;
            errorBody.title = errorMessage.header;

            switch (errorCode) {
                case 403:
                    this.accessDeniedDialog.show();
                    break;
                case 204:
                    this.view.hideTopSection();
                    break;
                default:
                    this.getEventBus().publish('errorMsgForDefaultCases', errorBody);
                    this.view.hideLoadingAnimation();
                    break;
            }
        },

//        defaultErrorHandling: function (errorBody) {
//            this.getEventBus().publish("jobNotificationEvent", "warning", libLanguage.get('retrying'));
//            this.displayErrorMessage.detach();
//            this.view.hideLoadingAnimation();
//        },

        onJobsError: function (response, xhr) {
            if (xhr.getStatus() === 403) {
                this.accessDeniedDialog.show();
            } else {
                var messageToBePublished;
                if (xhr.getStatus() === 500 && xhr.getResponseText() === Constants.DATABASEERROR) {
                    messageToBePublished = libLanguage.get('databaseErrorParagraph');
                } else {
                    messageToBePublished = libLanguage.get('noResponseMsgHeader');
                }
                this.getEventBus().publish("jobNotificationEvent", "error", messageToBePublished);
            }
        },

        enableFilters: function () {
            FilterUtil.enableFilterEvent();
        },

        allowAccess: function () {
            var nodes = [];
            this.selectedJobsArrayOfModels.forEach(function (neModel) {
                nodes.push({
                    name: neModel.neNodeName
                });
            });
            var attribute1 = ["selectedNodes", []];
            var attribute2 = ["nodes", nodes];
            sessionStorageUtil.updateSessionStorage(attribute1, attribute2);
            window.location.hash = this.hashValue;
        },

        initializePreferences: function () {
            this.meJobPreferences = {
                "sortBy": "startTime",
                "orderBy": "desc",
                "flag": true
            };
        },

        resetSelectedValues: function () {
            this.selectedJobsArray = [];
            this.selectedJobsArrayOfModels = [];
        },

        fetchNpamJobDetails: function () {
            if ( this.jobName ) {
                this.view.showLoadingAnimation();
                if (this.xhr) {
                    this.xhr.abort();
                }
                this.xhr = ServerUtil.sendRestCall("GET", "/npamservice/v1/job/list/"+this.jobName,
                                                   this.onNpamJobDetailsResponse.bind(this),
                                                   this.loadErrorMessage.bind(this),
                                                   'json', 'application/json');
            }
        },

        onNpamJobDetailsResponse: function (response) {
            var filteredResponse = response.filter(function(el) {
                return el.jobInstanceId === parseInt(this.jobId);
            }.bind(this));

            if (filteredResponse.length > 0 ) {
                this.selectedJobDetails = filteredResponse[0];
            }
            this.fetchMeJobDetails(true);
        },

        refreshNeJobDetails: function() {
//            this.clearFilters();
            this.fetchNpamJobDetails();
        }
    });
});
