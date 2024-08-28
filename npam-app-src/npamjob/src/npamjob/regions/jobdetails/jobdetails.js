define([
    'jscore/core',
    './jobdetailsview',
    './columns',
    'npamlibrary/columnsUtil',
    'jscore/ext/mvp',
    'npamlibrary/constants',
    "widgets/Dialog",
    "npamlibrary/accessdenied" ,
    "npamlibrary/displaymessage",
    "npamlibrary/filterUtil",
    'tablelib/Table',
    'tablelib/plugins/Selection',
    'tablelib/plugins/StickyHeader',
    'tablelib/plugins/ResizableHeader',
    'tablelib/plugins/StickyScrollbar',
    'tablelib/plugins/SecondHeader',
    'tablelib/plugins/SortableHeader',
    'i18n!npamjob/dictionary.json',
    'i18n!npamlibrary/dictionary.json',
    'tablelib/plugins/RowEvents',
    "container/api",
    'npamlibrary/serverUtil',
    "npamlibrary/dateUtil",
    'npamlibrary/jobsColumn',
    'npamlibrary/npamCommonUtil',
    'npamlibrary/restUrls',
    'npamlibrary/i18NumberUtil',
    "jscore/ext/net",
    'tablelib/plugins/PinColumns',
    'tablelib/plugins/SmartTooltips',
    'npamlibrary/sessionStorageUtil',
    'npamlibrary/StandardErrorMessagesUtil'
], function (core, View, Columns, ColumnsUtil, mvp, Constants, Dialog, AccessDeniedDialog, DisplayMessage, FilterUtil,
             Table, Selection, StickyHeader, ResizableHeader, StickyScrollbar, SecondHeader, SortableHeader,
             language, libLanguage, RowEvents, container, ServerUtil, DateUtil, jobsColumn, npamCommonUtil,
             RestUrls, i18nNumber, net, PinColumns, SmartTooltips, sessionStorageUtil, StandardErrorMessagesUtil ) {
    var defaultColumns = 11,xhr;

    return core.Region.extend({
        View: View,
        appName: "npamjob",

        init: function (options) {
            this.mainPageHolder = options.pageHolder;
            this.currentJobPoId = "";
            this.accessDeniedDialog = new AccessDeniedDialog();
            this.jobDetailsTableCollection = new mvp.Collection();
            this.offset = 0;
            this.resetSelectedValues();
            this.filters = {};
            this.displayErrorMessage = new DisplayMessage();
            this.cancelDialog = this.createDialog(libLanguage.get('cancel'), this.cancelJobs, libLanguage.get('cancel') + ' ' + libLanguage.get('job'));
            this.getEventBus().subscribe("updatecolumns", this.updateColumns.bind(this));
            this.getEventBus().subscribe("noColSelected", this.noColSelected.bind(this));
            this.getEventBus().subscribe("jobnodedetails:restrictAccessEvent", this.restrictAccess.bind(this));
            this.getEventBus().publish("noJobSelected");
            this.oldErrorBody = {};
            this.isPageLoaded = true;
            this.restCalled = false;
            this.setIntId = 0;
            this.selectedJobs = [];
            this.attributeMapper = jobsColumn.getColumnNames();

            /*
             * Based on the retry count value, the number of retries will be made for /jobs rest call in case of any error response.
             * */
            this.retryCount = 0;
            this.maintainFilters = false;
            this.setColumns = Columns.getColumns();
            this.defaultColumns = Columns.getColumns(defaultColumns);
        },

        applyFilters: function () {
            FilterUtil.applyFilters(this.filters, this.setColumns, this.view.getElement());
        },

        getFilterValuesAsList: function () {
            return FilterUtil.getFilterValuesAsList(this.filters);
        },

        setIsTableSettingShown: function (value) {
            this.isTableSettingShown = value;
        },

        createDialog: function (header, fn, btn) {
            var widget = new Dialog({
                type: 'warning',
                header: libLanguage.get('dialogueJobHeader').replace("<replace>", header),
                buttons: [
                    {caption: btn, color: 'darkBlue', action: fn.bind(this)},
                    {caption: libLanguage.get('cancel'), action: function () {
                        widget.hide();
                    }.bind(this)}
                ],
                visible: false
            });
            this.changeActions = true;
            return widget;
        },

        getColumnsFromResponse: function (response, sortBy, orderBy) {
            this.defaultColumns = ColumnsUtil.getColumnsFromResponseObject(Columns.columns, response.result, sortBy, orderBy, true);
        },

        onStart: function () {
            this.initializePreferences();
            this.hideRightClick();
            this.addObjectsToDom();
            this.hasNoColSelMsg = false;

            this.view.getTableSettings().addEventHandler("click", function(){
                this.getEventBus().publish('layouts:panelaction', Constants.TABLESETTINGS);
            }.bind(this));

            this.view.getClearSelectionLink().addEventHandler('keydown', function(event){
                if(event.originalEvent.keyCode === 13){
                    this.view.getClearSelectionLink().trigger("click");
                }
            }.bind(this));
            this.view.getClearSelectionLink().addEventHandler('click', this.clearMenu.bind(this));

            this.view.getFiltersClearSelectionLink().addEventHandler("keydown", function(evt){
                if(evt.originalEvent.keyCode === 13){
                    this.view.getFiltersClearSelectionLink().trigger("click");
                }
            }.bind(this));
            this.view.getFiltersClearSelectionLink().addEventHandler("click", this.clearFilters.bind(this));
        },

        addObjectsToDom: function () {
            this.view.setHeader(libLanguage.get('jobs'));
            this.view.setSelectionHeader(libLanguage.get('selected'));
            this.view.getTableSettings().setAttribute("title",libLanguage.get('tableSettings'));
        },

        noColSelected: function () {
            this.getEventBus().publish("noneSelected", this.defaultColumns);
            this.showNoColSelMsg();
            this.hideAllSections();
            this.view.hideSelectedJobsOfTotalHolder();
            this.hasNoColSelMsg = true;
        },

        updateColumns: function (columns){
            this.setColumns = columns;
            this.getColumnWidths();
            this.hasNoColSelMsg = false;                    
            this.hideErrorMessage();
            this.jobsInfoPreferences.flag = false;
            this.showAllSections();
        },

        //Initialize Job information attributes
        initializePreferences: function () {
            this.jobsInfoPreferences = {
                "sortBy": "startTime",
                "orderBy": "desc",
                "flag": false
            };
        },

        //fetchJobs: method Fetches the main Npam list jobs
        fetchJobs: function () {
            this.hideErrorMessage();
            if (this.hasNoColSelMsg) {
                this.showNoColSelMsg();
            } else {
                this.view.showLoadingAnimation();
            }

            if (!this.flag || (!this.jobsTable && this.errorStatus !== this.newerrorStatus)) {
                this.flag = true;
            }

            if (this.getFilterValuesAsList().length > 0) {
                this.isFilterApplied = true;
            }else{
                this.view.hideFiltersAppliedHolder();
            }

            net.ajax({
                type: 'GET',
                url: "/npamservice/v1/job/list",
                dataType: "json",
                contentType: "application/json",
                success: this.onJobsReceived.bind(this),
                error: this.onErrorReceived.bind(this)
            });
        },

        filterJobs: function () {
            var data = [];

            if (this.jobsTable && this.jobDetailsTableCollection.toJSON().length > 0) {
                this.jobDetailsTableCollection.toJSON().forEach(function (el) {
                    var toBeExcluded = false;
                    this.getFilterValuesAsList().forEach(function (filterEl) {
                        var varType = typeof(el[filterEl.columnName]);
                        if ( varType === 'string') {
                            if ( !this.textIsOkWithFilter(el[filterEl.columnName], filterEl.filterOperator, filterEl.filterText)) {
                                toBeExcluded = true;
                                return;
                            }
                        } else if ( varType === 'number') {
                            if ( (el[filterEl.columnName] !== Number(filterEl.filterText)) ) {
                                toBeExcluded = true;
                                return;
                            }
                        } else {
                            console.log("FILTER NOT MANAGED " + varType);
                        }
                    }.bind(this));
                    if ( !toBeExcluded ) {
                        console.log(el);
                        data.push(el);
                    }
                }.bind(this));

                var sortedData = data.slice().sort( function(a, b) {
                    var value1, value2;

                    if ( this.jobsInfoPreferences.sortBy === 'startTimeI18n' ) {
                        try {
                           value1 = new Date(a.startTime).getTime();
                           value2 = new Date(b.startTime).getTime();
                        } catch(errorDetails) {
                            value1 = 0;
                            value2 = 0;
                        }
                    } else if ( this.jobsInfoPreferences.sortBy === 'endTimeI18n' ) {
                        try {
                           value1 = new Date(a.endTime).getTime();
                           value2 = new Date(b.endTime).getTime();
                        } catch(errorDetails) {
                            value1 = 0;
                            value2 = 0;
                        }
                    } else {
                        value1 = a[this.jobsInfoPreferences.sortBy];
                        value2 = b[this.jobsInfoPreferences.sortBy];
                    }

                    if ( value1 > value2)
                        if ( this.jobsInfoPreferences.orderBy === 'desc')
                            return -1;
                        else
                            return 1;
                    else if ( value1 < value2)
                        if ( this.jobsInfoPreferences.orderBy === 'desc')
                            return 1;
                        else
                            return -1;
                    else
                        return 0;
                }.bind(this));

                FilterUtil.enableOrDisableFilterTextBox(true, this.view.getElement());
                this.jobsTable.setData(sortedData);
            }
            this.view.hideLoadingAnimation();
//            this.attachTableAndShow();
        },

        //showErrorMessage: method show the error msg when there is an issue with the web service or when server not responding
        showErrorMessage: function (errorBody, errorStatus) {
            this.newerrorStatus = errorStatus;
            //The below condition satisfied only when there is a changes in error status code
            if (this.errorStatus !== this.newerrorStatus || this.oldErrorBody !== errorBody) {
                this.errorStatus = this.newerrorStatus;
                this.oldErrorBody = errorBody;
                this.jobDetailsTableCollection.setModels([]);
                this.displayErrorMessage.showMessage(true, errorBody, "error", errorStatus);
                this.view.showErrorMessageHolder();
                this.displayErrorMessage.attachTo(this.view.getErrorMessageHolder());
                this.getEventBus().publish("showTableSettings", false, this.setColumns);
                this.hideAllSections();
                this.view.hideLoadingAnimation();
            }
        },

        //showNoJobsMsg: method show when there are no job during the fetch
        showNoJobsMsg: function () {
            if (this.jobsTable) {
                this.jobsTable.detach();
            }

            if (this.displayErrorMessage) {
                this.displayErrorMessage.detach();
            }

            this.displayErrorMessage.showMessage(true, "", "dialogInfo", libLanguage.get('noJobAvailable').replace("<replace>", (libLanguage.get('jobs')).toLowerCase()));
            this.displayErrorMessage.attachTo(this.view.getErrorMessageHolder());
            this.view.showErrorMessageHolder();
            this.getEventBus().publish("showTableSettings", false, this.setColumns);
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
            this.view.showSelectedJobsOfTotalHolder();
            this.view.setSelectedOfTotal("(" + text + ")");
            this.view.setSelectedCount(i18nNumber.getNumber(this.selectedJobsArray.length));
        },

        //onJobsReceived: method called when there is a true response from the server
        onJobsReceived: function (response) {
            if (response === undefined || response.length === 0) {
                this.showOrHideRowActions();
                this.getEventBus().publish("loadTableSettingEvent", false);
                if (this.getFilterValuesAsList().length > 0) {
                    if (this.hasNoColSelMsg) {
                        this.showNoColSelMsg();
                        this.hideAllSections();
                        this.getEventBus().publish("loadTableSettingEvent", true);
                    } else {
                        this.displayEmptyTable(response);
                        this.showEmptyRecordsMessage();
                    }
                } else {
                    this.view.hideSelectionCountHolder();
                    this.view.hideClearSelection();
                    this.showNoJobsMsg();
                }
                this.enableFilterEvent();
                this.view.hideLoadingAnimation();
            } else {
                this.getEventBus().publish("loadTableSettingEvent", true);
                this.errorStatus = undefined;
                this.hideErrorMessage();
                this.clearPreviousJobs();
                this.addModelsToJobDetailsCollection(response);

                if (this.jobsTable && this.jobsTable.getData().length > 0) {
                    this.jobsTable.setData(this.jobDetailsTableCollection.toJSON());
                    this.attachTableAndShow();
                } else {
                    this.createTable(response);
                }

                this.totalCount = response.length;
                this.view.showSelectionCountHolder();
                this.getOffSetAndLimit(response.length, this.offset, response.length);
                if (this.contextEvent !== null && this.rightClickFlag === true) {
                    this.prepareContextActionsAndPublish();
                }
                if (this.hasNoColSelMsg) {
                    this.showNoColSelMsg();
                    this.hideAllSections();
                } else {
                    this.getEventBus().publish("showTableSettings", true, this.setColumns);
                    this.applyFilters();
                }
                this.enableFilterEvent();                            
            }
            this.isPageLoaded = true;
            this.restCalled = false;
        },

        showOrHideRowActions: function () {
            if (this.jobsTable) {
                this.getEventBus().publish('topsection:leavecontext');
            }
        },

        displayEmptyTable: function (response) {
            this.clearPreviousJobs();
            if (response) {
                this.createTable(response);
            } else {
                if ( this.jobsTable ) {
                    this.jobsTable.setData([]);
                    this.jobsTable.attach();
                }
            }
            this.applyFilters();
            this.getEventBus().publish("showTableSettings", false, this.setColumns);
            this.enableFilterEvent();
        },

        //getOffSetAndLimit: method sets the offset and limit on every user action so that the updated details are sent along with the fetch rest call
        getOffSetAndLimit: function (totalRows, OffSet, totalCount) {
            var offset = OffSet, limit = offset + totalRows - 1;
            var txt = i18nNumber.getNumber(offset) + " - " + i18nNumber.getNumber(limit) + libLanguage.get('of') + i18nNumber.getNumber(totalCount);
            this.setTextForSelectedOfTotal(txt);
        },

        showNoColSelMsg: function () {
            this.displayErrorMessage.showMessage(true, libLanguage.get('noColSelContent'), "dialogInfo", libLanguage.get('noColSelTitle'));
            this.displayErrorMessage.attachTo(this.view.getErrorMessageHolder());
            this.view.showErrorMessageHolder();
        },

        hideAllSections: function () {
            if (this.jobsTable) {
                this.jobsTable.detach();
            }
            this.view.hideSelectionCountHolder();
            this.view.hideClearSelection();
            this.getEventBus().publish('topsection:leavecontext');
        },

        hideErrorMessage: function () {
            if (this.displayEmptyRecordsMessage) {
                this.displayEmptyRecordsMessage.detach();
            }
            this.displayErrorMessage.detach();
            this.view.hideErrorMessageHolder();
        },

        showAllSections: function () {
            this.view.showSelectionCountHolder();
        },

        //clearPreviousJobs: method is used to clear the previous collection in-order to load the new table collection
        clearPreviousJobs: function () {
            var models = [];
            this.jobDetailsTableCollection.each(function (model) {
                models.push(model);
            }.bind(this));
            this.jobDetailsTableCollection.removeModel(models, {silent: false});
        },

        //addModelsToJobDetailsCollection: method will prepare models into a collection
        addModelsToJobDetailsCollection: function (jobs) {
            jobs.forEach(function (job) {
                job.startTimeI18n = DateUtil.formatNpamDate(job.startTime, true);
                job.endTimeI18n = DateUtil.formatNpamDate(job.endTime, true);
                job.totalNoOfNEs = i18nNumber.getNumber(job.totalNoOfNEs);

                this.jobDetailsTableCollection.addModel(job);
            }.bind(this));
        },

       getColumnWidths: function () {
            ServerUtil.sendRestCall(
                'GET',
                RestUrls.getSavedColumnSettings.replace("appName", this.appName),
                this.initColumnWidths.bind(this),
                this.errorFetchingColumnWidths.bind(this),
                'json',
                'application/json'
            );
       },

        initColumnWidths: function (colWidth) {
            this.savedColumnWidth = {};
            colWidth.forEach(function (table) {
                if (table.id === "jobsTable") {
                    table.value = JSON.parse(table.value);
                    this.savedColumnWidth = table;
                }
            }.bind(this));
            this.updateColumnWidths();
        },

        errorFetchingColumnWidths: function () {
            this.createTable();
        },

        updateColumnWidths: function () {
            if (Object.keys(this.savedColumnWidth).length > 0) {
                for (var i = 0; i < this.setColumns.length; i++) {
                    if (this.savedColumnWidth.value[this.setColumns[i].attribute]) {
                        this.setColumns[i].width = this.savedColumnWidth.value[this.setColumns[i].attribute];
                    }
                }
            }
            this.initTable();
            if (this.checkForNoColumns()) {
                this.noColSelected();
            } else {
                this.hideNoColSelMsg();
            }
        },

        hideNoColSelMsg: function () {
             this.displayErrorMessage.detach();
        },

        checkForNoColumns: function () {
            var count = 0;
            this.setColumns.forEach(function (model) {
                if (model.visible === true) {
                    count++;
                }
            });
            return count === 0 ? true : false;
        },

        saveColumnWidth: function (column) {
            var found = false;
            var payload = this.savedColumnWidth;
            if (payload.id === "jobsTable") {
                if (typeof(payload.value) === 'string') {
                    payload.value = JSON.parse(payload.value);
                }
                payload.value[column.attribute] = column.width;
                payload.value = JSON.stringify(payload.value);
                found = true;
            }
            if (!found) {
                payload.id = "jobsTable";
                payload.value = this.getColumnWidth(column);
            }
            ServerUtil.sendRestCall(
                'PUT',
                RestUrls.getSavedColumnSettings.replace("appName", this.appName),
                '',
                '',
                'json',
                'application/json',
                JSON.stringify(payload)
            );
        },

        getColumnWidth: function (column) {
            var value = {};
            value[column.attribute] = column.width;
            return JSON.stringify(value);
        },

        //createTable: method will initialize the table instance
        createTable: function (response) {
            if (response && response.length > 0) {
                ColumnsUtil.getColumnsFromResponseObject(this.setColumns ? this.setColumns : Columns.columns, response, this.jobsInfoPreferences.sortBy, this.jobsInfoPreferences.orderBy, true, this.appName, "jobsTable", function(data) {
                    this.setColumns = data;                    
                    this.getColumnWidths();                    
                }.bind(this), this.defaultColumns);                         
            } else {
                this.initTable();
            }
        },

        initTable: function () {
            if (this.jobsTable) {
                this.jobsTable.destroy();
            }
            this.jobsTable = new Table({
                plugins: [
                    new RowEvents({
                        events: [/*"dblclick",*/ "contextmenu", "click"]
                    }),
                    new PinColumns(),
                    new SmartTooltips(),
                    new StickyScrollbar(),
                    new Selection({
                        checkboxes: true,
                        selectableRows: true,
                        multiselect: true,
                        bind: true
                    }),
                    new ResizableHeader(),
                    new SortableHeader(),
                    new SecondHeader()
                ],
                tooltips: true,
                data: this.jobDetailsTableCollection.toJSON(),
                columns: this.setColumns
            });

            this.jobsTable.setSortIcon(this.jobsInfoPreferences.orderBy, this.jobsInfoPreferences.sortBy);
            this.filterJobs();

            this.jobsTable.addEventHandler("sort", this.jobsTableSortHandler.bind(this));
            this.jobsTable.addEventHandler("rowselectend", this.onJobSelected.bind(this));
            this.jobsTable.addEventHandler("check", this.hideRightClick.bind(this));
            this.jobsTable.addEventHandler("filter", function (attr, val, comparator, dateValue) {
                this.hideRightClick();
                this.filters = FilterUtil.removeExistingFilters(this.filters, attr);
                this.filters[attr] = {
                    value: val,
                    comparator: comparator,
                    dateVal: dateValue
                };
            }.bind(this));
            this.jobsTable.addEventHandler("fetchFilterResults", function () {
                if (this.getFilterValuesAsList().length === 0) {
                    this.enableFilterEvent();
                }
                if (this.isFilterApplied || this.getFilterValuesAsList().length > 0) {
                    this.view.showLoadingAnimation();
                    this.view.showFiltersAppliedHolder();
                    this.view.setFiltersAppliedText();
                    this.view.setFiltersAppliedClearText();
                    this.isFilterApplied = false;
                    FilterUtil.enableOrDisableFilterTextBox(false, this.view.getElement());
                    this.clearMenu();
                }
                this.filterJobs();
            }.bind(this));
            this.jobsTable.addEventHandler("columnresize", this.saveColumnWidth.bind(this));
            //this.jobsTable.addEventHandler("rowevents:dblclick", this.onJobSelected.bind(this));
            this.jobsTable.addEventHandler("rowevents:click", function () {
                this.hideRightClick();
            }.bind(this));
            this.attachTableAndShow();
        },

        attachTableAndShow: function() {           
            this.prepareRightClick();
            if (this.selectedJobsArray.length > 0) {
                this.persistSelection();
                this.getEventBus().publish('topsection:contextactions', this.actions);
            } else {
               this.getEventBus().publish("noJobSelected");
//                this.getEventBus().publish("jobDetails:removeComponentsTab");
            }
            this.jobsTable.attachTo(this.view.getJobsTablePlaceholder());
            this.applyFilters();
            this.filterJobs();

            this.view.hideLoadingAnimation();
        },

        enableFilterEvent: function () {
            container.getEventBus().publish("enableFilter");
        },

        hideRightClick: function () {
            container.getEventBus().publish("contextmenu:hide");
            this.contextEvent = null;
            this.rightClickFlag = false;
        },

        prepareRightClick: function () {
            this.jobsTable.addEventHandler("rowevents:contextmenu", function (row, e) {
                // If there is any row selected then show context menu
                this.contextEvent = e;
                if (this.selectedJobsArrayOfModels.indexOf(row) === -1 && !e.originalEvent.ctrlKey && !row.getCells()[0].isChecked()) {
                    this.jobsTable.unselectAllRows();
                    this.jobsTable.selectRows(function (r) {
                        return (r === row);
                    });
                }
                this.onJobSelected();
                this.rightClickFlag = true;
                this.prepareContextActionsAndPublish();
            }.bind(this));
        },

        prepareContextActionsAndPublish: function () {
            if (this.contextEvent) {
                if (this.selectedJobsArrayOfModels.length > 0) {
                    var actions = [];
                    this.actions.forEach(function (action) {
                        if (action.length > 0) {
                            action.forEach(function (obj) {
                                actions.push(obj);
                            });
                        } else {
                            actions.push(action);
                        }
                    });
                    container.getEventBus().publish("contextmenu:show", this.contextEvent, actions);
                } else {
                    container.getEventBus().publish("contextmenu:hide");
                }
            }
        },

        //jobsTableSortHandler: method is called when the user perform sort operation on the table
        jobsTableSortHandler: function (order, column) {
            this.hideRightClick();
            this.jobsInfoPreferences.orderBy = order;
            this.jobsInfoPreferences.sortBy = column;
            this.filterJobs();
        },

        //onErrorReceived: method is called when the ajax function ends into error loop
        onErrorReceived: function(error,xhr) {
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

            switch(errorCode) {
                case 200:
                    window.location.reload();
                    break;

                case 403:
                    this.accessDeniedDialog.show();
                    break;

                default:
                    this.showErrorMessage(errorMessage.description + "</br>" + details, errorMessage.header);
                    this.displayEmptyTable();
                    break;
            }
        },

        //onJobSelected: method is called when the user selected the job(s) in the table
        onJobSelected: function (selectedRow, event) {
            this.maintainSelection(selectedRow, event);
            if (this.selectedJobsArray[0] !== undefined) {
                this.previousSelectedJobs = this.selectedJobsArray[0];
            }
            this.prepareContextActionsAndPublish();
        },

        //findAndReplaceEntries: method will return true or false based on the existance
        findAndReplaceEntries: function (data) {
            var isFound = false;
            for (var i = 0; i < this.selectedJobsArray.length; i++) {
                if (this.selectedJobsArray[i] === data.jobInstanceId) {
                    isFound = true;
                    break;
                }
            }
            if (!isFound) {
                this.selectedJobsArray.splice(i, 1, data.jobInstanceId);
            }
            this.selectedJobsArrayOfModels.splice(i, 1, data);
        },

        //maintainSelection: in the below method the whole selections are been maintained and populated on page change
        maintainSelection: function (selectedRow, event) {
            console.log("selectedRow");
            console.log(selectedRow);
            if (event && event.originalEvent && event.originalEvent.type === "dblclick") {
                this.resetSelectedValues();
                this.selectedJobsArray.push(selectedRow.getData().jobInstanceId);
                this.selectedJobsArrayOfModels.push(selectedRow.getData());
                if (this.selectedJobsArray[0] === undefined) {
                    this.selectedJobsArray[0] = this.previousSelectedJobs;
                }
                this.jobsTable.unselectAllRows();
                this.jobsTable.checkRows(function (row) {
                    return (this.selectedJobsArray[0] === row.getData().jobInstanceId) ? true : false;
                }.bind(this));
                this.maintainFilters = true;
                // Publish Job data form NE JOB Details app
                // TODO Passare dati alla NE Job
                var attribute = ["selectedJobsArrayOfModels",this.selectedJobsArrayOfModels[0]];
                sessionStorageUtil.updateSessionStorage(attribute);
                window.location.hash = Constants.JOB_DETAILS_LINK + "/" + this.selectedJobsArrayOfModels[0].jobInstanceId;
            } else {
                this.jobsTable.getRows().forEach(function (row) {
                    if (row.getCells()[0].isChecked()) {
                        this.findAndReplaceEntries(row.getData());
                    } else {
                        this.selectedJobsArray.forEach(function (element, index) {
                            if (element === row.getData().jobInstanceId) {
                                this.selectedJobsArray.splice(index, 1);
                                this.selectedJobsArrayOfModels.splice(index, 1);
                            }
                        }.bind(this));
                    }
                }.bind(this));
                this.prepareRowRelatedActions(this.selectedJobsArrayOfModels);
                if (this.selectedJobsArray.length > 0) {
                    this.selectedJobs = this.selectedJobsArray;
                    // TODO check parametri
                    this.fetchJobConfigurationDetails(this.selectedJobsArrayOfModels[0].name);
                    if(this.changeActions) {
                        this.getEventBus().publish('topsection:contextactions', this.actions);
                    }
                } else {
                    this.clearMenu();
                    this.getEventBus().publish("noJobSelected");
                }
            }

            if (this.hasNoColSelMsg) {
                this.hideAllSections();
            } else {
                this.view.showSelectionCountHolder();
                this.view.setSelectedJobsOfTotal(i18nNumber.getNumber(this.selectedJobsArray.length));
            }
        },

        //persistSelection: method will highlight the rows which are been selected
        persistSelection: function () {
            this.jobsTable.checkRows(function (row) {
                return this.selectedJobsArray.indexOf(row.getData().jobInstanceId) > -1;
            }.bind(this));
            this.maintainSelection();
        },

        //prepareRowRelatedActions: method will prepare the array of actions based on the selection on each row in the table
        prepareRowRelatedActions: function (rows) {

            if (rows.length === 1 ) {
                var greyedOut = true;

                if ( rows[0].state === 'RUNNING' ||
                     rows[0].state === 'COMPLETED' ||
                     rows[0].state === 'PARTIALLY_COMPLETED') {
                    greyedOut = false;
                }

                this.actions = [
                            [{
                                name: language.get('jobDetails'), type: "button",
                                disabled: greyedOut,
                                action: function () {
                                    this.maintainFilters = true;
                                    this.hideRightClick();
                                    var attribute = ["selectedJobsArrayOfModels",this.selectedJobsArrayOfModels[0]];
                                    sessionStorageUtil.updateSessionStorage(attribute);
                                    window.location.hash = Constants.JOB_DETAILS_LINK + "/" + this.selectedJobsArrayOfModels[0].jobInstanceId;
                                }.bind(this)
                            }],
                            [{
                                type: 'button',
                                icon: Constants.icon.refresh,
                                name: "Refresh",
                                caption: libLanguage.get('contextActions.refresh'),
                                action: function () {
                                    this.fetchJobs();
                                }.bind(this)
                            }]
                        ];
            }

            if (rows.length === 1 && rows[0].state === 'SCHEDULED') {
                this.actions.push(
                        [{
                            name: libLanguage.get('cancel'), type: "button", icon: "stop",
                            action: function () {
                                this.hideRightClick();
                                this.dialogHandler(this.cancelDialog, libLanguage.get('cancel'));
                            }.bind(this)
                        }]

                );
            }
        },

        restrictAccess: function (response, xhr) {
            this.view.hideLoadingAnimation();
            switch (xhr.getStatus()) {
                case 403:
                    this.accessDeniedDialog.show();
                    break;
            }
        },

        //clearMenu: method will bring back the default action and close the right panel if it is open and reinitialize the primary variables
        clearMenu: function () {
            this.resetSelectedValues();
            this.previous = "";
            this.actions = [];
            if (this.jobsTable) {
                this.jobsTable.unselectAllRows();
            }
            this.getEventBus().publish('topsection:leavecontext');
            this.hideRightClick();
            this.view.setSelectedCount(i18nNumber.getNumber(this.selectedJobsArray.length));
        },

        clearFilters: function () {
            this.filters = {};
            this.clearMenu();
            var allFilterInputs = this.getElement().findAll("input");
            var cancelButtons = this.getElement().findAll(".eanpamlibrary-FilterHeaderCell-cancelButton");
//            var datePickerCancel = this.getElement().find(".elWidgets-PopupDatePicker-cancelButton");
            for (var i = 0; i < allFilterInputs.length; i++) {
                allFilterInputs[i].setValue("");
                if(cancelButtons[i] && cancelButtons[i]!== null){
                    cancelButtons[i].setAttribute("style","display:none");
                }
            }
//            if(datePickerCancel){
//                datePickerCancel.setAttribute("style","display:none");
//            }
            FilterUtil.enableOrDisableFilterTextBox(true, this.view.getElement());
            this.view.hideFiltersAppliedHolder();
            this.filterJobs();
        },

        dialogHandler: function (dialog, value) {
            var content = (libLanguage.get('confirmJobParagragh').replace("<replace>", value));
            if (libLanguage.get('cancel') === value) {
                content = libLanguage.get('cancelJobParagragh');
            }
            dialog.setContent(content);
            dialog.show();
        },

        // cancelJobs: method will called when the user perform Cancel action on the jobs
        cancelJobs: function () {
            this.cancelDialog.hide();
            ServerUtil.sendRestCall('POST', 'npamservice/v1/job/cancel/'+this.selectedJobsArrayOfModels[0].name,
                                    this.onJobsCanceled.bind(this), this.onJobsError.bind(this), 'json', 'application/json',
                                    JSON.stringify(this.selectedJobsArray));
        },

        //onJobsCanceled: method will called when there is a success scenario on cancel jobs
        onJobsCanceled: function (response) {
            this.fetchJobs();
            if ( this.selectedJobsArrayOfModels.length > 0  ) {
                this.getEventBus().publish("jobNotificationEvent", "success",
                     libLanguage.get('jobCancelled').replace("<replace>", this.selectedJobsArrayOfModels[0].name), true);
            }
        },

        onJobsError: function (response, xhr) {
            var internalErrorCode;
            var details = "";
            try {
                internalErrorCode = xhr.getResponseJSON().internalErrorCode;
                details = xhr.getResponseJSON().errorDetails.replace(/\n/g, "<br />");
            } catch(e) {
                //JSON parse error, this is not json (or JSON isn't in your browser)
                details = "";
            }
            var errorMessage = StandardErrorMessagesUtil.getStandardErrorMessage(xhr.getStatus(), internalErrorCode);

            if (xhr.getStatus() === 403) {
                this.accessDeniedDialog.show();
            } else {

                var displayErrorMessage = new DisplayMessage();

                var dialogWidget = new Dialog({
                    header: errorMessage.header,
                    content: displayErrorMessage,
                    buttons: [{ caption: libLanguage.get('buttons.close'),
                                action: function () {
                                    dialogWidget.hide();
                                }
                             }]
                });
                dialogWidget.show();
                displayErrorMessage.showMessage( true, "", "error", errorMessage.description);
//                if (xhr.getStatus()) {
//                    this.showErrorMessage(errorBody, xhr.getStatus());
//                } else {
//                    this.getEventBus().publish("jobNotificationEvent", "error", errorMessage.description + " " + details, true);
//                    this.getEventBus().publish("jobNotificationEvent", "error", libLanguage.get('noResponseMsgHeader'), true);
//                }
            }
        },

        loadErrorMessage: function (response, xhr) {
            this.isJobSummarySuccess = false;
            var errorCode = xhr.getStatus();

            if (errorCode === 403) {
                this.accessDeniedDialog.show();
            }

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

            this.getEventBus().publish("jobConfigurationError", errorBody);
            this.view.hideLoadingAnimation();
        },

        //fetchJobConfigurationDetails: method called to get the job configuration details which will be displayed on the right panel
        fetchJobConfigurationDetails: function (jobName) {
            if (xhr) {
                xhr.abort();
            }
            xhr = ServerUtil.sendRestCall('GET', 'npamservice/v1/job/configuration/'+ jobName,
                                           this.showJobConfigurationDetailsHandler.bind(this),
                                           this.loadErrorMessage.bind(this));
        },

        //showJobConfigurationDetailsHandler: method called the there is a success scenario which fetching job configurations details
        showJobConfigurationDetailsHandler: function (response) {
            var jobSummaryResponse = JSON.parse(response);
            this.getEventBus().publish("jobConfigurationEvent", jobSummaryResponse);
        },

//        addNeTypeToArray: function(array, neType) {
//            if(array.indexOf(neType) === -1) {
//                array.push(neType);
//            }
//            return array;
//        },
//
//        showNodeDetails: function (response) {
//            if (response.key === this.uniqueKey) {
//                this.respCount++;
//                if (response.isSuccess) {
//                    this.getEventBus().publish("jobdetails:showNodeDetailsEvent", response.callbackResponse, response.name, response.neTypes, response.groupType);
//                    response.neTypes.forEach(function(neType) {
//                        this.totalNeTypes = this.addNeTypeToArray(this.totalNeTypes, neType);
//                    }.bind(this));
//                } else {
//                    this.getEventBus().publish("jobdetails:NodeDetailsError", response.errorResponse, response.callbackResponse);
//                }
//                this.publishShowNodes();
//            }
//        },

//        publishShowNodes: function () {
//            // only when all the accordions are created , the node details panel is displayed
//            if (this.accCount === this.respCount) {
//                this.getEventBus().publish("jobdetails:showNodesContent");
//                var missingNeTypes = [];
//                this.totalNeTypes.forEach(function(neType) {
//                    if(this.configurationNeTypes.indexOf(neType) === -1) {
//                        missingNeTypes.push(neType);
//                    }
//                }.bind(this));
//                if(missingNeTypes.length > 0) {
//                    this.getEventBus().publish("jobConfiguration:missingNeTypes", missingNeTypes);
//                }
//            }
//        },

//        destroyTable: function () {
//            if (this.jobsTable) {
//                this.jobsTable.destroy();
//            }
//        },

//        destroyPagination: function () {
//            if (this.jobsInfoPagination) {
//                this.jobsInfoPagination.destroy();
//            }
//        },

//        destroyTableandPagination: function () {
//            this.destroyTable();
////            this.destroyPagination();
//        },

        resetSelectedValues: function () {
            this.selectedJobsArray = [];
            this.selectedJobsArrayOfModels = [];
        },

        textIsOkWithFilter: function(textCS, filterOperator, filterTextCS) {
            var text = textCS.toLowerCase();
            var filterText = filterTextCS.toLowerCase();

            if ( filterOperator === "=" ) { //Exact equals
                return text === filterText;
            } else if ( filterOperator === "!=" ) { //Not equals
                return text !== filterText;
            } else if ( filterOperator === "ab*" ) { //Starts with
                return text.startsWith(filterText);
            } else if ( filterOperator === "*ab" ) {  //Ends with
                return text.endsWith(filterText);
            } else { //Contains
                return text.includes(filterText);
            }
        }
    });
});
