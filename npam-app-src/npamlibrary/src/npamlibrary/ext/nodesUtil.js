define(['jscore/core',
    'npamlibrary/serverUtil',
    'npamlibrary/restUrls',
    'npamlibrary/constants'
], function (core, ServerUtil, restUrls, Constants) {

    return core.Widget.extend({

        init: function (uniqueKey, owner, poIds, callback) {
            this.fetchCollectionAndSavedSearches(uniqueKey, owner, poIds, callback);
        },

        fetchCollectionAndSavedSearches: function(uniqueKey, owner, poIds, callback) {
            this.poIds = poIds;
            this.startCount = 0;
            if(this.poIds.length > 0) {
                if(this.poIds[0].type === 'col') {
                    this.fetchStaticCollections(uniqueKey,owner,this.poIds[0].poId,callback);
                } else {
                    this.fetchSavedSearches(uniqueKey,owner,this.poIds[0].poId,callback);
                }
            }
        },

        fetchStaticCollections: function (uniqueKey, owner, poId, callback) {
            this.initCountAndCollection();
            ServerUtil.sendRestCall('GET', '/object-configuration/collections/v4/'+ poId +'?includeContents=true', this.getCollectionInfo.bind(this, uniqueKey, owner, callback, poId), this.prepareErrorObject.bind(this, uniqueKey, poId, owner, callback), 'json');
        },

        initCountAndCollection: function () {
            this.successResponseCount = 0;
            this.errorResponseCount = 0;
            this.finalArray = [];
        },

        getCollectionInfo: function(uniqueKey, owner, callback, poId, response) {
            if(!response.contents){
                callback({
                    key:uniqueKey,
                    name: response.name,
                    callbackResponse: [],
                    isSuccess: true
                });
            }
            else{
                this.getRootAssociations(uniqueKey, owner, callback, response.name, "Collection", response.id, response);
            }
        },

        getPrivateCollection: function (uniqueKey, poId, owner, callback) {
            ServerUtil.sendRestCall('GET', '/oss/shm/rest/job/collections?jobOwner='+owner+'&collectionId='+ poId, this.getPrivateCollNodes.bind(this,uniqueKey, owner, callback), this.prepareErrorObject.bind(this, uniqueKey, poId, owner, callback));
        },

        getPrivateCollNodes: function (uniqueKey, owner, callback, response) {
            if (typeof(response) === 'string') {
                response = JSON.parse(response);
            }
            if(response.managedObjectsIDs.length === 0){
                callback({
                    key: uniqueKey,
                    name: response.name,
                    callbackResponse: [],
                    isSuccess: true
                });
            } else {
                this.getRootAssociations(uniqueKey, owner, callback, response.name, "PrivateCollection" , response.collectionId, response);
            }
        },

        fetchSavedSearches: function (uniqueKey,owner, poId, callback) {
            this.initCountAndCollection();
            ServerUtil.sendRestCall('GET', '/topologyCollections/savedSearches/' + poId, this.getNodesFromSavedSearches.bind(this,uniqueKey, owner, callback), this.prepareErrorObject.bind(this, uniqueKey, poId, owner, callback));
        },

        getNodesFromSavedSearches: function (uniqueKey,owner, callback, response) {
            var savedSearchInfo = JSON.parse(response);
            ServerUtil.sendRestCall('GET', '/managedObjects/query?searchQuery=' + encodeURIComponent(savedSearchInfo.searchQuery), this.getRootAssociations.bind(this, uniqueKey, owner, callback, savedSearchInfo.name, savedSearchInfo.type, savedSearchInfo.poId), this.prepareErrorObject.bind(this, uniqueKey, savedSearchInfo.poId, owner, callback));
        },

        getPrivateSavedSearches: function (uniqueKey,poId,owner,callback) {
            ServerUtil.sendRestCall('GET', '/oss/shm/rest/job/savedsearches?jobOwner='+owner+'&savedSearchId='+ poId, this.getPrivSavedSearchNodes.bind(this, uniqueKey,owner,poId,callback), this.prepareErrorObject.bind(this, uniqueKey, poId, owner, callback));
        },

        getPrivSavedSearchNodes: function (uniqueKey,owner,poId, callback, response) {
            if (typeof(response) === 'string') {
                response = JSON.parse(response);
            }
            ServerUtil.sendRestCall('GET', '/managedObjects/query?searchQuery=' + response.query, this.getRootAssociations.bind(this,uniqueKey, owner, callback, response.name, "PrivateSavedSearch" ,poId), this.prepareErrorObject.bind(this, uniqueKey, poId, owner, callback));
        },

        getRootAssociations: function (uniqueKey, owner, callback, name, type, poId, response) {
            if (typeof(response) === 'string') {
                response = JSON.parse(response);
            }
            this.poIdList = [];
            if(type === "Collection") {
                var objects = response.contents;
                if(objects){
                    objects.forEach(function (model) {
                        var poId = model.id;
                        if (!this.hasPoId(this.poIdList, poId)) {
                            this.poIdList.push(poId);
                        }
                    }.bind(this));
                }
            }
            else if (type==="PrivateCollection"){
                this.poIdList = response.managedObjectsIDs;
            }else {
                response.forEach(function (model) {
                    var poId = model.poId;
                    if (!this.hasPoId(this.poIdList, poId)) {
                        this.poIdList.push(poId);
                    }
                }.bind(this));
            }
            this.getRootAssociationsInBatches(uniqueKey, owner, callback, name, type, poId, response);
        },

        getRootAssociationsInBatches: function (uniqueKey, owner, callback, name, type, poId, response) {
            var count = 1, nePoIdsList = [];
            this.poIdBatchList = [];
            if (this.poIdList.length > Constants.REQUEST_BATCH_SIZE) {
                this.poIdList.forEach(function (poId, index) {
                    nePoIdsList.push(poId);
                    /*
                     * Batches will be triggered in one of the two cases,
                     * 1.) count reaches to batch size,
                     * 2.) index reaches to poIdList length - this condition is for final batch.
                     * */
                    if (count === Constants.REQUEST_BATCH_SIZE || index === (this.poIdList.length - 1)) {
                        this.poIdBatchList.push(nePoIdsList);
                        nePoIdsList = [];
                        count = 0;
                    }
                    count++;
                }.bind(this));
                this.triggerNextBatchCall(uniqueKey, this.successResponseCount, poId, owner, callback, name, type);
            } else {
                this.fetchRootAssociations(uniqueKey, owner, callback, name, this.poIdList, poId, type);
            }
        },

        triggerNextBatchCall: function (uniqueKey, index, poId, owner, callback, name, groupType) {
            this.fetchRootAssociations(uniqueKey, owner, callback, name, this.poIdBatchList[index], poId, groupType);
        },

        fetchRootAssociations: function (uniqueKey, owner, callback, name, poIdsList, poId, groupType) {
            this.options = {
                type: 'POST',
                url: restUrls.rootAssociationsURL,
                success: this.getPoById.bind(this, uniqueKey, owner, callback, name, poId, groupType),
                error: this.prepareErrorObject.bind(this, uniqueKey, poId, owner, callback),
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({ "poList": poIdsList })
            };
            this.sendRestCall();
        },

        sendRestCall: function () {
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

        getPoById: function (uniqueKey, owner, callback, name, poId, groupType, response) {
            var poList = [];
            response.forEach(function (model) {
                poList.push(model.poId);
            });
            var payload = {
                "attributeMappings": [
                    {
                        "moType": "NetworkElement",
                        "attributeNames": ["neType", "platformType"]
                    }
                ],
                "poList": poList
            };
            this.options = {
                type: 'POST',
                url: restUrls.getPosByPoIds,
                success: this.prepareCollection.bind(this, uniqueKey, owner, callback, name, poId, groupType),
                error: this.prepareErrorObject.bind(this, uniqueKey, poId, owner, callback),
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(payload)
            };
            this.sendRestCall();
        },

        prepareCollection: function(uniqueKey, owner, callback, name, poId, groupType, response){
            this.successResponseCount++;
            response.forEach(function(obj){
                this.finalArray.push(obj);
            }.bind(this));
            if((poId === "") || (this.poIdList.length <= Constants.REQUEST_BATCH_SIZE) || ((this.poIdBatchList.length === this.successResponseCount))){
                this.prepareResponseObject(uniqueKey, owner, callback, name, poId, groupType, this.finalArray);
                this.pickNextnetExSet(uniqueKey,owner, callback);
            }
            else{
                this.triggerNextBatchCall(uniqueKey, this.successResponseCount, poId, owner, callback, name, groupType);
            }
        },

        prepareResponseObject: function (uniqueKey, owner, callback, name, poId, groupType, response) {
            var nodesArray = [], neTypes = [];
            response.forEach(function (model) {
                var neType = model.attributes.neType;
                nodesArray.push({
                    name: model.moName,
                    neType: neType
                });
                if(neTypes.indexOf(neType) === -1) {
                    neTypes.push(neType);
                }
            }.bind(this));

            callback({
                key: uniqueKey,
                name: name,
                callbackResponse: nodesArray,
                isSuccess: true,
                neTypes: neTypes,
                groupType: groupType
            });
        },

        prepareErrorObject: function (uniqueKey, poId, owner, callback, response, xhr) {
            if(xhr.getStatus() === 403 && poId && owner){
                var responseText = xhr.getResponseJSON();
                if(responseText.userMessage.title === "Private Collection"){
                    this.getPrivateCollection(uniqueKey,poId,owner,callback);
                }
                else {
                    this.getPrivateSavedSearches(uniqueKey,poId,owner,callback);
                }
            }
            else {
                callback({
                    key:uniqueKey,
                    errorResponse:response,
                    callbackResponse: xhr,
                    isSuccess: false
                });
            }
            this.pickNextnetExSet(uniqueKey, owner, callback);
        },

        pickNextnetExSet: function (uniqueKey, owner, callback) {
            this.startCount++;
            if (this.startCount !== this.poIds.length && this.poIds.length !== 0) {
                if (this.poIds[this.startCount].type === 'col') {
                    this.fetchStaticCollections(uniqueKey,owner, this.poIds[this.startCount].poId, callback);
                } else {
                    this.fetchSavedSearches(uniqueKey,owner,this.poIds[this.startCount].poId,callback);
                }
            }
        },

        hasPoId: function (array, poId) {
            if (array.indexOf(poId) > -1) {
                return true;
            }
            return false;
        }
    });
});