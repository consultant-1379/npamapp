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

define([
    '../utils/RestUtils',
    './Constants'
], function (RestUtils, Constants) {
    'use strict';

    var neAccountsUrl = "/npamservice/v1/neaccount";
    var neAccountDetailsUrl = "/npamservice/v1/neaccount/details";
    var neAccountExportsUrl = "/npamservice/v1/neaccount/export?id=1";
    var modelServiceUrl = "/managedObjects/getPosByPoIds";
    var neAccountImportsUrl = "/npamservice/v1/job/import/file";
    var neAccountRotateUrl = "/npamservice/v1/job/create";


    return {

        /**
         * Constructs and sends a REST request to get NEAccounts of the nodes/collections/saved search provided.
         *
         * @param {Array} list of NEs/Collections/SavedSearch name
         *
         * @return {@code XMLHttpRequest} neList
         */
        readNeAccounts: function (neList, collectionList, savedSearchList) {
            var requestData = {
                "selectedNEs": {
                    "neNames":neList,
                    "collectionNames":collectionList,
                    "savedSearchIds":savedSearchList
                }
            };

            return RestUtils.sendRequestWithPromise(neAccountsUrl, JSON.stringify(requestData), Constants.httpMethod.POST);
        },

        /**
         * Constructs and sends a REST request to read NE Account Details of the node provided.
         *
         * @param NE name
         *
         * @return {@code XMLHttpRequest} object
         */
        readNeAccountDetails: function (neName) {
            var url = neAccountDetailsUrl + '/' + neName + "?id=1";
            return RestUtils.sendRequestWithPromise(url, "", Constants.httpMethod.GET);
        },

        /**
         * Constructs and sends a REST request to export NE Account of all or the node provided.
         *
         * @param filename, passkey, selectedNENames
         *
         * @return {@code XMLHttpRequest} object
         */
        exportNeAccount: function (filename, passkey, selectedNENames, successCallback, errorCallback) {
            var requestData = {};
            if (passkey && passkey.length > 0) {
                requestData.encryptionKey = passkey;
            }
            if (selectedNENames.length > 0) {
                var selectedNEs = {};
                selectedNEs.neNames = selectedNENames;
                selectedNEs.collectionNames = [];
                selectedNEs.savedSearchIds = [];
                requestData.selectedNEs = selectedNEs;
            }
            return RestUtils.sendBlobRequest(Constants.httpMethod.POST, neAccountExportsUrl, successCallback, errorCallback, errorCallback, "application/json", requestData, "application/octet-stream");
        },

        importNeAccount: function (filename, overwrite, successCallback, errorCallback) {
            var data = new FormData();
            data.append("File", filename);
            var neAccountImportsUrlTmp = neAccountImportsUrl;
            if ( overwrite ) {
                neAccountImportsUrlTmp += "?overwrite=true";
            }
            return RestUtils.sendFile(Constants.httpMethod.POST, neAccountImportsUrlTmp, successCallback, errorCallback, errorCallback, data);
        },

        rotateNeAccount: function (filename, successCallback, errorCallback) {
            var currentDate = new Date();

            var data = {};
            data.name = filename + "_" + currentDate.getTime();
            data.description = "";
            data.jobType = "ROTATE_NE_ACCOUNT_CREDENTIALS_FROM_FILE";
            data.mainSchedule = {"scheduleAttributes":[],"execMode":"IMMEDIATE"};
            data.jobProperties = [{"key":"FILENAME", "value":filename}];
            data.selectedNEs = {"neNames":[],"collectionNames":[],"savedSearchIds":[]};

            return RestUtils.sendRequest(Constants.httpMethod.POST, neAccountRotateUrl, successCallback, errorCallback,
                                          errorCallback, "application/json", data);
        },

        /**
         * Constructs and sends a REST request to get the node name and neType.
         * This call is made only when there are no cells and if the netype is BSC only.
         *
         * @return {@code XMLHttpRequest} object
         */

        getPosByIds: function (poId) {
            var requestData = {
                "poList": poId,
                "defaultMappings": ["syncStatus"],
                "attributeMappings": [{
                    "moType": "MeContext", "attributeNames": ["neType"]
                },
                    {
                        "moType": "ManagedElement", "attributeNames": ["neType"]
                    }]
            };
            return RestUtils.sendRequestWithPromise(modelServiceUrl, JSON.stringify(requestData), Constants.httpMethod.POST);
        }
    };
});
