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
            if (serverDataFilters.neName && !element.neName.includes(serverDataFilters.neName ) ) {
                return;
            }
            if ( serverDataFilters.currentUser && !element.currentUser.includes(serverDataFilters.currentUser ) ) {
                return;
            }
            if ( serverDataFilters.status && !element.status.includes(serverDataFilters.status ) ) {
                return;
            }
            if ( serverDataFilters.errorDetails && !element.errorDetails.includes(serverDataFilters.errorDetails ) ) {
                return;
            }
            if ( serverDataFilters.lastUpdate && !element.lastUpdate .includes(serverDataFilters.lastUpdate ) ) {
                return;
            }
            if ( serverDataFilters.cbrsStatus && !element.cbrsStatus.includes(serverDataFilters.cbrsStatus ) ) {
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
