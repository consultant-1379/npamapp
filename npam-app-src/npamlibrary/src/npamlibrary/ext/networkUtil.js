define([
    'npamlibrary/serverUtil',
    'i18n!npamlibrary/dictionary.json',
    'jscore/ext/mvp',
    'jscore/ext/locationController',
    'applib/LaunchContext',
    'npamlibrary/loadNodesDialog',
    'widgets/Dialog',
    'npamlibrary/sessionStorageUtil',
    'npamlibrary/constants',
    'npamlibrary/restUrls'
], function (ServerUtil, libLanguage, mvp, LocationController, LaunchContext, LoadNodesDialog, Dialog, sessionStorageUtil, Constants, RestUrls) {

    return {
        reset: function() {
            /*
             * requestCount, successResponseCount and errorResponseCount are used for checking if all /getPosByPoIds requests are processed
             * or not before proceeding to populate ne's in network panel and publishing them to inventory applications.
             * */
            this.requestCount = 0;
            this.successResponseCount = 0;
            this.errorResponseCount = 0;
            this.retryCount = 0;
            /*
             * count and collectionIdsOrSavedSearchIdsLength is used for checking if all collections or savedSearch requests are processed
             * or not before proceeding to fetch /rootAssociations of all network elements.
             * */
            this.count = 0;
            this.collectionIdsOrSavedSearchIdsLength = 0;
        },

        getLocationController: function(){
            if (!this.locationController) {
                this.locationController = new LocationController();
            }
            return this.locationController;
        },

        locationChangeHandler: function (parent, hash) {
            this.reset();

            /*
            * network.js class is the parent for this class
            * */
            this.parent = parent;
            var appName = sessionStorageUtil.getSessionStorageAttribute("comeFrom");
            var nodes = sessionStorageUtil.getSessionStorageAttribute("nodes");
            if(appName !== "jobSummary") {
                if (hash.indexOf("loadNodes?") > -1) {
                    /*
                    * This flow will be initiated when returned from network explorer.
                    * */
                    this.loadNodesHandler(hash.split("loadNodes?")[1]);
                } else {
                    /*
                    * This flow will be initiated when navigated from any of another inventory application.
                    * */
                    this.parent.nodesObject = {};
                    if (nodes) {
                        var nodesLength = nodes.length;
                        if(nodesLength > 0) {
                            this.fetchAvailableNodes(nodes);
                        } else if(nodesLength === 0) {
                            this.parent.loadData();
                        }
                    }
                }
            } else {
                this.parent.nodesObject = {};
                this.poIdsList = [];
                if(nodes.collectionIds && nodes.collectionIds.length > 0) {
                    this.collectionIdsOrSavedSearchIdsLength += nodes.collectionIds.length;
                    this.doCollectionsCall(nodes.collectionIds);
                }
                if(nodes.savedSearchIds && nodes.savedSearchIds.length > 0) {
                    this.collectionIdsOrSavedSearchIdsLength += nodes.savedSearchIds.length;
                    this.doSavedSearchCall(nodes.savedSearchIds);
                }
                if(nodes.networkElements && nodes.networkElements.length > 0) {
                    this.loadNetworkElements(nodes.networkElements);
                }
                sessionStorageUtil.updateSessionStorage(["comeFrom",'']);
            }
        },

        fetchAvailableNodes: function(nodes) {
            if(nodes.length > 0) {
                var payload = this.getNeNames(nodes);
                if (this.parent.getEventBus) {
                    this.parent.getEventBus().publish("loadNodesFromNetExEvent");
                }
                this.options = {
                    type: 'POST',
                    url: RestUrls.inventoryFilterURL,
                    success: this.listOfAvailableNodes.bind(this),
                    error: this.errorCallBack.bind(this, Constants.FROM_ANOTHER_INV),
                    dataType: 'json',
                    contentType: 'application/json',
                    data : JSON.stringify(payload)
                };
                this.sendRestCall();
            } else {
                this.parent.clearList();
            }
        },

        publishErrorToInventories: function(error, xhr) {
            this.parent.getEventBus().publish("onErrorWhileReceivingNeNames", error, xhr, 'externalCall');
        },

        getNeNames: function(nodes) {
            var urlHash = window.location.hash.split("/");
            var appName = urlHash[urlHash.length - 1];
            var neNames = {networkElements:[]};
            switch(appName) {
                case "createneaccountjob":
                    neNames.context = "NeAccountJob_workflowPrefix";
                     break;
                case "importhousekeeping":
                    neNames.context = "ImportHousekeepingJob_workflowPrefix";
                    break;
                default:
                    neNames.context = "";
            }

            nodes.forEach(function(node){
                neNames.networkElements.push(node.name);
            });

            return neNames;
        },

        listOfAvailableNodes: function(response) {
            var supportedNWElements = response.availableNes;
            if(supportedNWElements) {
                if (supportedNWElements.length === 0 && this.parent.getEventBus) {
                    this.parent.getEventBus().publish("loadNodesFromNetExCompleteEvent");
                } else {
                    this.addSupportedNesToNodesObject(supportedNWElements);
                }
            }
        },

        addSupportedNesToNodesObject: function (supportedNes) {
            supportedNes.forEach(function(networkElement) {
                this.parent.nodesObject[networkElement.name] = networkElement.networkElementFdn;
            }.bind(this));
            this.parent.loadData();
        },

        loadNetworkElements : function(nodes){
            if (nodes && nodes.length >0 ){
                for(var i in nodes) {
                    var networkElement = nodes[i];
                    this.parent.nodesObject[networkElement.name] = networkElement.networkElementFdn;
                }
                if(this.collectionIdsOrSavedSearchIdsLength === 0) {
                    this.parent.loadData();
                }
            } else {
                this.parent.showDisplayMessage();
            }
        },

        loadNodesHandler: function (queryString) {
            if(this.parent.getEventBus) {
                this.parent.getEventBus().publish("loadNodesFromNetExEvent");
            }
            queryString = queryString.split("&");
            queryString = queryString[0].split("=");
            var keyword = queryString[0];
            var values = queryString[1].split(",");
            this.poIdsList = [];
            this.collectionIdsOrSavedSearchIdsLength = values.length;
            if(keyword.indexOf("collections") > -1){
                this.doCollectionsCall(values);
            } else if(keyword.indexOf("savedsearches") > -1) {
                this.doSavedSearchCall(values);
            } else if (keyword.indexOf("launchContextId") > -1 && values.length > 0 && values[0] > 0) {
                this.fetchNodesFromLaunchContext(values[0]);
            }
        },

        fetchNodesFromLaunchContext: function (launchContextId) {
            var newHash = window.location.hash.split('/loadNodes?')[0];
            newHash = newHash ? newHash : window.location.hash;
            newHash = newHash.substring(1);
            LaunchContext.get(launchContextId,
                function (data) {
                    this.getLocationController().setLocation(newHash, true, true);
                    if (data.contents && data.contents.length > 0) {
                        this.addResponseToPoIdsList(data.contents, true);
                        this.checkAjaxCountAndLoadData();
                    } else {
                        this.parent.getEventBus().publish("loadNodesFromNetExCompleteEvent");
                    }
                }.bind(this),
                function() {
                    this.getLocationController().setLocation(newHash, true, true);
                    // this.parent.getEventBus().publish("loadNodesFromNetExCompleteEvent");
                }.bind(this));
        },

        doCollectionsCall: function (collectionIds) {
            for (var i in collectionIds) {
                this.fetchStaticCollections(collectionIds[i]);
            }
        },

        doSavedSearchCall: function (savedSearchIds) {
            for (var i in savedSearchIds) {
                this.fetchSavedSearches(savedSearchIds[i]);
            }
        },

        doNetworkObjectsCall: function(networkObjects) {
            this.poIdsList.push.apply(this.poIdsList, networkObjects);
            this.checkAjaxCountAndLoadData();
        },

        fetchStaticCollections: function (collectionId) {
            this.options = {
                type: 'GET',
                url: RestUrls.collectionsURL + collectionId +'?includeContents=true',
                success: this.retrievePoIds.bind(this),
                error: this.errorCallBack.bind(this, Constants.FROM_COLLECTIONS_OR_SAVEDSEARCH),
                dataType: 'json',
                contentType: 'application/json',
            };
            this.sendRestCall();
        },

        fetchSavedSearches: function (savedSearchId) {
            this.options = {
                type: 'GET',
                url: RestUrls.savedSearchURL + savedSearchId,
                success: this.retrieveSavedSearchQuery.bind(this),
                error: this.errorCallBack.bind(this, Constants.FROM_COLLECTIONS_OR_SAVEDSEARCH)
            };
            this.sendRestCall();
        },

        retrieveSavedSearchQuery: function (response) {
            var savedSearchInfo = JSON.parse(response);
            this.options = {
                type: 'GET',
                url: RestUrls.savedSearchQueryURL + encodeURIComponent(savedSearchInfo.searchQuery),
                success: this.getNEObjectsInSavedSearch.bind(this),
                error: this.errorCallBack.bind(this, Constants.FROM_COLLECTIONS_OR_SAVEDSEARCH)
            };
            this.sendRestCall();
        },

        getNEObjectsInSavedSearch: function (response) {
            if(JSON.parse(response).length > 0){
                this.addResponseToPoIdsList(response, false);
                this.checkAjaxCountAndLoadData();
            }else{
                this.showErrorDialog = true;
                this.checkAjaxCountAndLoadData();
                this.parent.getEventBus().publish("loadNodesFromNetExCompleteEvent");
                this.errorHandlingForUnSuppMoTypes(libLanguage.get('emptySavedSearchHeader'), libLanguage.get('emptySavedSearchContent'), libLanguage.get('emptySavedSearchOptContent'));
            }
        },

        checkAjaxCountAndLoadData: function () {
            this.count++;
            if(this.count === this.collectionIdsOrSavedSearchIdsLength && this.poIdsList.length > 0) {
                this.getRootAssociationsInBatches();
            }
        },

        areMosUnSupported:function(xhr){
            try {
                var xhrResponseJson = xhr.getResponseJSON();
                if(xhrResponseJson.errorCode) {
                    return this.checkErrorCode(xhrResponseJson.errorCode);
                }
                return {};
            } catch(exception) {
                return {};
            }
        },

        checkErrorCode: function (errorCode) {
            var errorBody = {};
            switch (errorCode) {
                case -1:
                    errorBody.header = libLanguage.get('unSupportedMoHeader');
                    errorBody.content = libLanguage.get('unknownError_content');
                    break;
                case 1001:
                    errorBody.header = libLanguage.get('unSupportedMoHeader');
                    errorBody.content = libLanguage.get('internalServer_content');
                    break;
                case 1002:
                    errorBody.header = libLanguage.get('unSupportedMoHeader');
                    errorBody.content = libLanguage.get('dpsNotAvail_content');
                    break;
                case 403:
                    errorBody.header = libLanguage.get('unSupportedMoHeader');
                    errorBody.content = libLanguage.get('poInvalid_content');
                    break;
                case 10009:
                    errorBody.header = libLanguage.get('unSupportedMoHeader');
                    errorBody.content = libLanguage.get('fdnInvalid_content');
                    break;
                case 1000:
                    errorBody.header = libLanguage.get('unSupportedMoHeader');
                    errorBody.content = libLanguage.get('unSupportedMoContent');
                    errorBody.optionalContent =libLanguage.get('unSupportedMoOptionalContent');
                    break;
                case 10008:
                    errorBody.header = libLanguage.get('unSupportedMoHeader');
                    errorBody.content = libLanguage.get('attributeNotFound_content');
                    break;
                case 10011:
                    errorBody.header = libLanguage.get('unSupportedMoHeader');
                    errorBody.content = libLanguage.get('nullRelativeDepth_content');
                    break;
                case 10012:
                    errorBody.header = libLanguage.get('unSupportedMoHeader');
                    errorBody.content = libLanguage.get('badNetworkObjReq_content');
                    break;
                case 10013:
                    errorBody.header = libLanguage.get('unSupportedMoHeader');
                    errorBody.content = libLanguage.get('badNetworkObjReq_content');
                    break;
                case 10014:
                    errorBody.header = libLanguage.get('unSupportedMoHeader');
                    errorBody.content = libLanguage.get('unableToConnectDB_content');
                    break;
                case 10015:
                    errorBody.header = libLanguage.get('unSupportedMoHeader');
                    errorBody.content = libLanguage.get('accessDenied_content');
                    errorBody.optionalContent = libLanguage.get('accessDenied_optionalContent');
                    break;
                case 10016:
                    errorBody.header = libLanguage.get('unSupportedMoHeader');
                    errorBody.content = libLanguage.get('queryTimeout_content');
                    break;
                case 10017:
                    errorBody.header = libLanguage.get('unSupportedMoHeader');
                    errorBody.content = libLanguage.get('nodeBusy_content');
                    break;
                case 10018:
                    errorBody.header = libLanguage.get('unSupportedMoHeader');
                    errorBody.content = libLanguage.get('validInput_content');
                    break;
                case 10019:
                    errorBody.header = libLanguage.get('unSupportedMoHeader');
                    errorBody.content = libLanguage.get('modelTypeNotFound_content');
                    break;
            }
            return errorBody;
        },


        onErrorForRootAssociationsAndGetPosByPoIds: function(response, xhr) {
            var dialogContent = this.areMosUnSupported(xhr);
            if (Object.keys(dialogContent).length !== 0 ) {
                this.errorHandlingForUnSuppMoTypes(dialogContent.header, dialogContent.content, dialogContent.optionalContent);
            } else {
                this.publishErrorToInventories(response, xhr);
            }
            if (this.parent.getEventBus) {
                this.parent.getEventBus().publish("loadNodesFromNetExCompleteEvent");
            }
        },

        errorHandlingForUnSuppMoTypes: function(header, content, optContent) {
            this.parent.setErrorPopup(header, content, optContent);
            this.parent.showPopup();
        },

        retrievePoIds: function (response) {
            if(response.contents && response.contents.length > 0){
                this.addResponseToPoIdsList(response.contents, true);
                this.checkAjaxCountAndLoadData();
            }else{
                this.showErrorDialog = true;
                this.checkAjaxCountAndLoadData();
                this.parent.getEventBus().publish("loadNodesFromNetExCompleteEvent");
                this.errorHandlingForUnSuppMoTypes(libLanguage.get('emptyCollectionHeader'), libLanguage.get('emptyCollectionContent'), libLanguage.get('emptyCollectionOptContent'));
            }
        },

        getRootAssociationsInBatches: function () {
            var count = 1, nePoIdsList = [];
            this.poIdBatchList = [];
            if(this.poIdsList.length > Constants.REQUEST_BATCH_SIZE) {
                this.poIdsList.forEach(function (poId, index) {
                     nePoIdsList.push(poId);
                    /*
                    * Batches will be triggered in one of the two cases,
                    * 1.) count reaches to batch size,
                    * 2.) index reaches to poIdList length - this condition is for final batch.
                    * */
                    if(count === Constants.REQUEST_BATCH_SIZE || index === (this.poIdsList.length - 1)) {
                        this.poIdBatchList.push(nePoIdsList);
                        nePoIdsList = [];
                        count = 0;
                    }
                    count++;
                }.bind(this));
                this.triggerNextBatchCall(0);
            } else {
                this.fetchRootAssociations(this.poIdsList);
            }
        },

        triggerNextBatchCall: function (index) {
            this.fetchRootAssociations(this.poIdBatchList[index]);
        },

        /*
        * On retrieving collection or savedSearch content, the respective success callbacks are invoked.
        * From them, response is passed to addResponseToPoIdsList to add poIds to poIdsList array.
        * For collections response, poId can be obtained from key "id".
        * For savedSearch response, poId can be obtained from key "poId".
        * isCollection flag determines if the object from collection or savedSearch.
        * */
        addResponseToPoIdsList: function (response, isCollection) {
            if(!isCollection) {
                response = JSON.parse(response);
            }
            response.forEach(function (obj) {
                var poId = obj.id || obj.poId;
                this.poIdsList.push(poId);
            }.bind(this));
        },

        fetchRootAssociations: function (poIdsList) {
            this.options = {
                type: 'POST',
                url: RestUrls.rootAssociationsURL,
                success: this.getNEs.bind(this),
                error: this.errorCallBack.bind(this, Constants.FROM_ROOT_ASSOCIATIONS),
                dataType: 'json',
                contentType: 'application/json',
                data : JSON.stringify({ "poList": poIdsList })
            };
            this.sendRestCall();
        },

        sendRestCall: function() {
            ServerUtil.sendRestCall(
                this.options.type,
                this.options.url,
                this.options.success,
                this.options.error,
                this.options.dataType,
                this.options.contentType,
                this.options.data
            );
        },

        getNEs: function (response) {
            if (Object.keys(this.parent.nodesObject).length > 0 && this.parent.hideDisplayMessage) {
                this.parent.hideDisplayMessage();
            }
            var nePoIdsList = [];
            response.forEach(function (neObj) {
                nePoIdsList.push(neObj.id);
            });
            this.fetchPosByPoIds(nePoIdsList);
        },

        fetchPosByPoIds: function (poIdList) {
            var payload = {
                "poList": poIdList,
                "attributeMappings": [{
                    "moType":"NetworkElement",
                    "attributeNames": [
                        "neType"
                    ]
                }]
            };
            this.requestCount++;
            this.options = {
                type: 'POST',
                url: RestUrls.getPosByPoIds,
                success: this.prepareFinalCollection.bind(this),
                error: this.errorCallBack.bind(this, Constants.FROM_GET_POS_BY_POIDS),
                dataType: 'json',
                contentType: 'application/json',
                data : JSON.stringify(payload)
            };
            this.sendRestCall();
        },

        prepareFinalCollection: function (response) {
            this.successResponseCount++;
            response.forEach(function (neObj) {
                this.parent.nodesObject[neObj.moName] = neObj.moType + '=' + neObj.moName;
            }.bind(this));
            this.checkToLoadData();
        },

        checkToLoadData: function () {
            if((this.poIdsList.length <= Constants.REQUEST_BATCH_SIZE) || ((this.poIdBatchList.length === this.successResponseCount) && (this.errorResponseCount === 0))) {
                this.requestCount = 0;
                this.successResponseCount = 0;
                this.errorResponseCount = 0;
                this.parent.loadData();
            } else {
                this.triggerNextBatchCall(this.successResponseCount);
            }
        },

        errorCallBack: function (fromRestCall, response, xhr) {
            if (this.timerToBeCleared) {
                clearTimeout(this.timerToBeCleared);
            }
            if (this.retryCount >= 2) {
                this.retryCount = 0;
                switch(fromRestCall) {
                    case Constants.FROM_ANOTHER_INV:
                    case Constants.FROM_COLLECTIONS_OR_SAVEDSEARCH:
                        this.publishErrorToInventories(response, xhr);
                        break;
                    case Constants.FROM_ROOT_ASSOCIATIONS:
                        this.onErrorForRootAssociationsAndGetPosByPoIds(response, xhr);
                        break;
                    case Constants.FROM_GET_POS_BY_POIDS:
                        this.errorResponseCount++;
                        this.onErrorForRootAssociationsAndGetPosByPoIds(response, xhr);
                        break;
                }
            } else {
                this.retryCount++;
                this.timerToBeCleared = setTimeout(function () {
                    this.sendRestCall();
                }.bind(this), 5000);
            }
        },

        onScopingPanelSelect: function(scope) {
            this.reset();

            if(this.parent.getEventBus) {
                this.parent.getEventBus().publish("loadNodesFromNetExEvent");
            }
            this.poIdsList = [];

            if (scope.collections.length > 0) {
                this.collectionIdsOrSavedSearchIdsLength = scope.collections.length;
                this.doCollectionsCall(scope.collections);
            }
            if (scope.networkObjects.length > 0) {
                // 1 because of checkAjaxCountAndLoadData
                this.collectionIdsOrSavedSearchIdsLength = 1;
                this.doNetworkObjectsCall(scope.networkObjects);
            }
            if (scope.savedSearches.length > 0) {
                this.collectionIdsOrSavedSearchIdsLength = scope.savedSearches.length;
                this.doSavedSearchCall(scope.savedSearches);
            }
        }
    };
});
