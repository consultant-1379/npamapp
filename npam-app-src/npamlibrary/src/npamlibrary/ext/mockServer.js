/*global define, Promise */
define([

], function () {
    'use strict';

    /**
     * This module emulates the connection with a server while mimicking the API of net.ajax.
     *
     * /!\ The module was designed to run exclusively with the example e.g. no shared references.
     */

    var serverData,
        serverDataById;

    function setCompleteData(data) {
		serverData = data;
        serverDataById = {};

        serverData.forEach(function (item, index) {
            serverData[index] = item;
            serverDataById[item.id] = item;
        });
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
            var comp = a[attribute].localeCompare(b[attribute]);
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
        return serverData.slice(start, end);
    }

    //----------------------------------------------------------------- Exposed Mock Server API

    function getDataLength(options) {
        options.success(serverData.length);
    }

    function getData(options) {
        /*jshint validthis:true */
        // cancel any pending request
        if (this.lastRequestTimeout !== undefined) {
            clearTimeout(this.lastRequestTimeout);
        }

        this.lastRequestTimeout = setTimeout(function () {
            checkCurrentSortingWithRequestSorting.call(this, options);

            delete  this.lastRequestTimeout;

            options.success({
                data: getDataSegment(options.index, options.index + options.length),
                length: serverData.length
            });
        }.bind(this), 500);
    }


    return {
		setCompleteData: setCompleteData,
        getData: getData,
        getDataLength: getDataLength
    };
});