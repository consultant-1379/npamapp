/*global define, Promise */
define([
    './mockServer'
], function (mockServer) {
    'use strict';

    function isSegmentInBuffer(start, end) {
        /*jshint validthis:true */
        for (var index = start; index < end; index++) {
            if (this.buffer[index] === undefined) {
                return false;
            }
        }
        return true;
    }

    function getSegmentFromBuffer(start, end) {
        /*jshint validthis:true */
        var data = [];
        for (var bufferIndex = start, dataIndex = 0; bufferIndex < end; bufferIndex++, dataIndex++) {
            data[dataIndex] = this.buffer[bufferIndex];
        }

        return data;
    }

    function wipeBufferData() {
        /*jshint validthis:true */
        this.buffer = {};
        this.bufferItemIndexById = {};
    }

    function bufferData(data, index, length) {
        /*jshint validthis:true */
        for (var bufferIndex = index, dataIndex = 0; dataIndex < length; bufferIndex++, dataIndex++) {
            var item = data[dataIndex];

            if (item) {
                this.buffer[bufferIndex] = item;
                this.bufferItemIndexById[item.id] = bufferIndex;
            }
        }
    }

    function getBufferedIndexesFromIds(ids) {
        /*jshint validthis:true */
        var bufferItemIndexById = this.bufferItemIndexById;

        return ids.map(function (id) {
            return bufferItemIndexById[id];
        }).filter(function (index) {
            return index !== undefined;
        });
    }

    //----------------------------------------------------------------- Exposed Service API

    function getDataLength() {
        return new Promise(function (resolve, reject) {
            mockServer.getDataLength({
                success: resolve,
                error: reject
            });
        });
    }

    function loadData(index, length, sortAttr, sortMode) {
        /*jshint validthis:true */
        return new Promise(function (resolve, reject) {
            var dataConfig = this.dataConfig,
                bufferConfig = this.bufferConfig,
                start = index,
                end = index + length;

            // If the sort options are different then clear buffer
            if (sortAttr && sortMode && (sortAttr !== dataConfig.sortAttr || sortMode !== dataConfig.sortMode)) {
                wipeBufferData.call(this);
            }

            dataConfig.sortAttr = sortAttr;
            dataConfig.sortMode = sortMode;
            if (isSegmentInBuffer.call(this, start, end, dataConfig.totalLength)) {
                // data is present in the buffer, respond directly
                resolve({
                    data: getSegmentFromBuffer.call(this, start, end),
                    totalLength: dataConfig.totalLength
                });
            }
            else {
                // need to load data and update the buffer
                // set the buffer to start X items before requested index
                var bufferedIndex = Math.max(index - length * bufferConfig.coeff, 0),
                // set the buffer length to include X items more than the requested length
                    bufferedLength = Math.max(length * bufferConfig.coeff * 2, bufferConfig.minLength);

                mockServer.getData({
                    sortAttr: dataConfig.sortAttr,
                    sortMode: dataConfig.sortMode,
                    index: bufferedIndex,
                    length: bufferedLength,
                    success: function (res) {
                        dataConfig.totalLength = res.length;
                        // wipe to avoid accumulating the data
                        wipeBufferData.call(this);
                        bufferData.call(this, res.data, bufferedIndex, bufferedLength);
                        var finalEnd = dataConfig.totalLength < end ? dataConfig.totalLength : end;
                        resolve({
                            data: getSegmentFromBuffer.call(this, start, finalEnd),
                            totalLength: dataConfig.totalLength
                        });
                    }.bind(this),
                    error: reject
                });
            }
        }.bind(this));
    }
	
	function setCompleteData(data) {
        mockServer.setCompleteData(data);
    }

    //-----------------------------------------------------------------

    var dataService = {

        init: function () {
            this.buffer = {};
            this.bufferItemIndexById = {};

            this.bufferConfig = {
                coeff: 5,
                minLength: 20
            };

            this.dataConfig = {
                totalLength: 0
            };
        },
		setCompleteData: setCompleteData,
        getDataLength: getDataLength,
        loadData: loadData
    };

    dataService.init();

    return dataService;
});