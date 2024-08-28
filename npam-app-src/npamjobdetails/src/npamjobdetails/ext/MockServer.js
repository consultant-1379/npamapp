/*global define, Promise */
define(['npamlibrary/constants'
], function (Constants) {
    'use strict';

    /**
     * This module emulates the connection with a server while mimicking the API of net.ajax.
     *
     */
    var serverData, serverDataById;
    var serverDataFilters = {};

    function initMockData(data, resetFilter) {
        data.forEach(function(obj, index) { obj.id = index.toString(); });
        serverData = data;
        serverDataById = {};
        if ( resetFilter ) {
            serverDataFilters = {};
        }

        serverData.forEach(function (item, index) {
            serverData[index] = item;
            serverDataById[item.id] = item;
        });
    }

    function setFilter(filters) {
        serverDataFilters = filters;
    }

    function textIsOkWithFilter(textCS, filterOperator, filterTextCS) {
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

    function getDataFiltered() {
        var data = [];

        serverData.forEach(function(element){
            var skip = false;
            serverDataFilters.forEach(function(filter) {
                var columnName = filter.columnName;
                var filterOperator = filter.filterOperator;
                var filterText = filter.filterText;

                if (columnName === 'neName' && !textIsOkWithFilter(element.neName, filterOperator, filterText)) {
                    skip = true;
                }
                if (columnName === 'state' && !textIsOkWithFilter(element.state, filterOperator, filterText)) {
                    skip = true;
                }
                if (columnName === 'result' && !textIsOkWithFilter(element.result, filterOperator, filterText)) {
                    skip = true;
                }
                if (columnName === 'startTime' && !textIsOkWithFilter(element.startTime, filterOperator, filterText)) {
                    skip = true;
                }
                if (columnName === 'endTime' && !textIsOkWithFilter(element.endTime, filterOperator, filterText)) {
                    skip = true;
                }
                if (columnName === 'errorDetails' && !textIsOkWithFilter(element.errorDetails, filterOperator, filterText)) {
                    skip = true;
                }
            });
            if ( !skip ) {
                data.push(element);
            }
        });

        return data;
    }

    function getAllData() {
        return serverData.slice();
    }

    //-----------------------------------------------------------------

    function checkCurrentSortingWithRequestSorting(options) {
        /*jshint validthis:true */
        if (!this.serverSortAttr && !this.serverSortMode || (this.serverSortAttr !== options.sortAttr || this.serverSortMode !== options.sortMode)) {
            sortData(options.sortAttr, options.sortMode);

            this.serverSortAttr = options.sortAttr;
            this.serverSortMode = options.sortMode;
        }
    }

    function sortData(attribute, sortMode) {
        var sortFunc = function (a, b) {
            var attr1, attr2;

            // in the table we display startTimeI18N attribute but in some cases this attribute cannot be used
            // to get a valid Date
            // So to sort the rows we use the "not internationalized" startTime attribute
            if ( attribute === 'startTimeI18N' )
                attribute = 'startTime';
            if ( attribute === 'endTimeI18N' )
                attribute = 'endTime';

            if ( attribute === 'startTime' || attribute === 'endTime' ) {
                if (!a[attribute] || a[attribute] === Constants.NA) {
                    attr1 = 0;
                } else {
                    try {
                        attr1 = new Date(a[attribute]).getTime();
                    } catch(errorDetails) {
                        attr1 = 0;
                    }
                }

                if (!b[attribute] || b[attribute] === Constants.NA) {
                    attr2 = 0;
                } else {
                    try {
                        attr2 = new Date(b[attribute]).getTime();
                    } catch(errorDetails) {
                        attr2 = 0;
                   }
                }
            } else {
                attr1 = (a[attribute] ? a[attribute] : "");
                attr2 = (b[attribute] ? b[attribute] : "");
            }

            if ( attr1 > attr2)
                if ( sortMode === 'desc')
                    return -1;
                else
                    return 1;
            else if ( attr1 < attr2)
                if ( sortMode === 'desc')
                    return 1;
                else
                    return -1;
            else
                return 0;
        };

        if (attribute === 'id') {
            sortFunc = function (a, b) {
                return sortMode === 'asc' ? a[attribute] - b[attribute] : b[attribute] - a[attribute];
            };
        }

        serverData.sort(sortFunc);
    }

    function getDataSegment(start, end) {
        return getDataFiltered().slice(start, end);
    }

    //----------------------------------------------------------------- Exposed Mock Server API

    function getDataLength() {
        return getDataFiltered().length;
    }

    function getIds(options) {
        /*jshint validthis:true */
        checkCurrentSortingWithRequestSorting.call(this, options);

        var startItem = serverDataById[options.startId],
            endItem = serverDataById[options.endId],
            indexA = getDataFiltered().indexOf(startItem),
            indexB = getDataFiltered().indexOf(endItem),

            // based on the current sort mode, the index can be reversed
            // the data is stored in an array (ascending order indexes)
            sortedIndexes = [indexA, indexB].sort(function (a, b) {  return a - b;});

        options.success(
            getDataSegment(sortedIndexes[0], sortedIndexes[1] + 1).map(function (item) {
                return item.id;
            })
        );
    }

    function getAllIds(options) {
        /*jshint validthis:true */
        checkCurrentSortingWithRequestSorting.call(this, options);

        options.success(
            getDataFiltered().map(function (item) {
                return item.id;
            })
        );
    }

    function getData(options) {
        /*jshint validthis:true */
        checkCurrentSortingWithRequestSorting.call(this, options);

        options.success({
            data: getDataSegment(options.index, options.index + options.length),
            length: getDataFiltered().length
        });
    }

    function compareString(filterValue, itemValue) {
        return itemValue.toLocaleLowerCase().indexOf(filterValue.toLocaleLowerCase()) !== -1;
    }


    return {
        getData: getData,
        getIds: getIds,
        getAllIds: getAllIds,
        getDataLength: getDataLength,
        initMockData: initMockData,
        setFilter: setFilter,
        getAllData: getAllData
    };
});
