define([
    'jscore/ext/net',
    '../utils/RestUtils',
    './Constants'

], function (net, RestUtils,Constants) {
    'use strict';

    return {

        /**
         * Fetches the Persistent Objects (POs) for the Ids provided.
         */
        getPersistentObjects: function (poIds) {
            var requestData = {"poList": poIds};
            return RestUtils.sendRequestWithPromise("/managedObjects/getPosByPoIds", JSON.stringify(requestData), Constants.httpMethod.POST);
        },

        /**
         * Fetches the Persistent Objects (POs) for each search query provided.
         */
        getPosForSearchQuery: function (searchQueryList) {
            var urls = [], url = '/managedObjects/query?searchQuery=';
            searchQueryList.forEach(function (queryParam) {
                urls.push({url: url + encodeURIComponent(queryParam)});
            });
            return RestUtils.sendParallelRequests(urls);
        }
    };

});

