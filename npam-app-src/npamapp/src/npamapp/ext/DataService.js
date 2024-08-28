/*global define, Promise */
define([
    './MockServer',
    './MockServerUnmanaged'
], function (MockServer, MockServerUnmanaged) {
    
    //----------------------------------------------------------------- Exposed Service API
    function getDataLength() {
        return this.mockServer.getDataLength();
    }

    function getAllData() {
        return this.mockServer.getAllData();
    }

    function setData(data, resetFilter) {
        this.mockServer.initMockData(data, resetFilter);
    }

    function setFilter(filters) {
        this.mockServer.setFilter(filters);
    }

    function loadData(index, length, sortAttr, sortMode) {
        /*jshint validthis:true */
        return new Promise(function (resolve, reject) {
            this.mockServer.getData({
                sortAttr: sortAttr,
                sortMode: sortMode,
                index: index,
                length: length,
                success: function (res) {
                    resolve({
                        data: res.data,
                        totalLength: res.length
                    });
                }.bind(this),
                error: reject
            });
        }.bind(this));
    }

    function getIds(a, b, sortAttr, sortMode) {
        /*jshint validthis:true */
        return new Promise(function (resolve, reject) {
            var aIsBeforeB = (a < b),
                startId = aIsBeforeB ? a : b,
                endId = aIsBeforeB ? b : a;
                this.mockServer.getIds({
                    sortAttr: sortAttr,
                    sortMode: sortMode,
                    startId: startId,
                    endId: endId,
                    success: resolve,
                    error: reject
                });

        }.bind(this));
    }

    function getAllIds(sortAttr, sortMode) {
        /*jshint validthis:true */
        return new Promise(function (resolve, reject) {
            this.mockServer.getAllIds({
                sortAttr: sortAttr,
                sortMode: sortMode,
                success: resolve,
                error: reject
            });
        }.bind(this));
    }

    function DataService(dataServiceType) {
        if (dataServiceType === 'managed') {
           this.mockServer = MockServer;
        } else {
            this.mockServer = MockServerUnmanaged;
        }
        this.getDataLength = getDataLength;
        this.loadData = loadData;
        this.setData = setData;
        this.setFilter = setFilter;
        this.getIds = getIds;
        this.getAllIds = getAllIds;
        this.getAllData = getAllData;
    }

    return DataService;
});
