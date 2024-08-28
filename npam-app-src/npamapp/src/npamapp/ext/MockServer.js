/*global define, Promise */
define([
], function () {
    'use strict';

    /**
     * This module emulates the connection with a server while mimicking the API of net.ajax.
     *
     */
    var serverData, serverDataById;
    var serverDataFilters = {};

    function initMockData(data, resetFilter) {
        if ( !data ) {
            data = [];
        }
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

    function getDataFiltered() {
        var data = [];
        serverData.forEach(function(element){
            if (serverDataFilters.neName &&
                !element.neName.toLowerCase().includes(serverDataFilters.neName.toLowerCase() ) ) {
                return;
            }
            if ( serverDataFilters.currentUser &&
                !element.currentUser.toLowerCase().includes(serverDataFilters.currentUser.toLowerCase() ) ) {
                return;
            }
            if ( serverDataFilters.status &&
                !element.status.toLowerCase().includes(serverDataFilters.status.toLowerCase() ) ) {
                return;
            }
            if ( serverDataFilters.errorDetails &&
                !element.errorDetails.toLowerCase().includes(serverDataFilters.errorDetails.toLowerCase() ) ) {
                return;
            }
            if ( serverDataFilters.lastUpdate &&
                !element.lastUpdate.toLowerCase().includes(serverDataFilters.lastUpdate.toLowerCase() ) ) {
                return;
            }
            if ( serverDataFilters.cbrsStatus &&
                !element.cbrsStatus.toLowerCase().includes(serverDataFilters.cbrsStatus.toLowerCase() ) ) {
                return;
            }
            data.push(element);
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
            var first = "";
            var second = "";

            if ( a[attribute] )
                first = a[attribute];

            if ( b[attribute] )
                second = b[attribute];

            var comp = first.localeCompare(second);
            return sortMode === 'asc' ? comp : comp * -1;
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
