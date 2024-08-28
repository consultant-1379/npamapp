define([
    'jscore/ext/net',
    '../utils/RestUtils'

], function (net, RestUtils) {
    'use strict';

    return {

        /**
         * Get a list of Collection objects for the Ids provided.
         */
        getCollections: function (collectionIds) {
            var urls = [], url = '/object-configuration/collections/v4/';
            collectionIds.forEach(function (collectionId) {
                urls.push({url: url + collectionId + "?includeContents=true"});
            });
            return RestUtils.sendParallelRequests(urls);
        },

        /**
         * Get a list of search queries for the saved search ids provided.
         */
        getSearchQueryForSavedSearches: function (savedSearchIds) {
            var urls = [], url = '/topologyCollections/savedSearches/';
            savedSearchIds.forEach(function (savedSearchId) {
                urls.push({url: url + savedSearchId});
            });
            return RestUtils.sendParallelRequests(urls);
        }
    };

});

