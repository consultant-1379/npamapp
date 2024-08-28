var subnets = require('./MockedObjects/SubNetworks');
var nodes = require('./MockedObjects/Nodes');
var managedObjects = require('./MockedObjects/ManagedObjects');
var persistentObjects = require('./MockedObjects/PersistentObjects');
var collections = require('./MockedObjects/Collections');
var savedSearches = require('./MockedObjects/SavedSearches');

/**
 * This file encapsulates all mocked objects for the testing server, such as the objects within Nodes.js, SubNetworks.js, and CellDataHolder.js
 */
module.exports = {
    // Make the limited set of data about objects public
    NODE_SPECS: nodes.NODE_SPECS,
    LTE_NODES_UNDER_SUBNETS_SPECS: nodes.LTE_NODES_UNDER_SUBNETS_SPECS,
    WCDMA_NODES_UNDER_SUBNETS_SPECS: nodes.WCDMA_NODES_UNDER_SUBNETS_SPECS,
    GSM_NODES_UNDER_SUBNETS_SPECS: nodes.GSM_NODES_UNDER_SUBNETS_SPECS,
    NR_NODES_UNDER_SUBNETS_SPECS: nodes.NR_NODES_UNDER_SUBNETS_SPECS,
    SUBNET_SPECS: subnets.SUBNET_SPECS,

    /**
     * @return an array containing all mocked LTE
     */
    getAllNodes: function getAllNodes() {
        return nodes.ALL_NODES;
    },

    /**
     * @return an array containing all mocked Subnets
     */
    getAllSubnets: function getAllSubnets() {
        return subnets.ALL_SUBNETS;
    },

    /**
     * @return an array containing only those mocked subnets that should be visible from the Scoping Panel root (i.e. not nested under another subnet)
     */
    getAllParentSubnets: function getAllParentSubnets() {
        return subnets.PARENT_SUBNETS;
    },

    /**
     * @return an array containing all mocked LTE nodes to be added under the 'All Other Nodes' folder in the scoping
     * panel.
     */

    getAllOtherNodes: function () {
        return nodes.OTHER_NODES;
    },

    /**
     * @return an array containing all mocked subnets and nodes
     */
    getAllSubnetsAndNodes: function () {
        return (nodes.ALL_NODES).concat(subnets.ALL_SUBNETS);
    },

    /**
     * @return a Map of mock LTE node POs that can be used in a REST response.
     */
    buildNodeTree: function (nodeList) {
        console.log("");
        return nodes.buildNodeTree(nodeList);
    },

    /**
     * @return a Map of mock subnets that can be used in a REST response.
     */
    buildSubnetTree: function (subnetList) {
        return subnets.buildSubnetTree(subnetList);
    },

    getAllManagedObjects: managedObjects.getAllManagedObjects,
    getAllPersistentObjects: persistentObjects.getAllPersistentObjects,
    getCollections: collections.getCollections,
    getCollectionObjects: collections.getCollectionObjects,
    getSavedSearches: savedSearches.getSavedSearches,
    getSavedSearchObjects: savedSearches.getSavedSearchObjects,

    getQueryObjects: function getQueryObjects(queryString) {
        switch (queryString.toUpperCase()) {
            case "SUBNETWORK" :
                return subnets.NODE_SUBNETS;
                break;
            case "MECONTEXT"  :
                return nodes.MECONTEXT_NODES;
                break;
            case "RADIO_NODE" :
                return nodes.NODES_FOR_SEARCH_RADIO;
                break;
            case "NETWORKELEMENT":
                return [
                    {"id":"39075","poId":"39075","moType":"NetworkElement","mibRootName":"LTE11dg2ERBS00001","parentRDN":null,"moName":"LTE11dg2ERBS00001","fullMoType":"NetworkElement","attributes":{"neType":"RadioNode","networkFunctions":"[ENodeB]"},"radioAccessTechnology":null,"managementState":null},
                    {"id":"39086","poId":"39086","moType":"NetworkElement","mibRootName":"LTE11dg2ERBS00002","parentRDN":null,"moName":"LTE11dg2ERBS00002","fullMoType":"NetworkElement","attributes":{"neType":"RadioNode","networkFunctions":"[ENodeB]"},"radioAccessTechnology":null,"managementState":null},
                    {"id":"39097","poId":"39097","moType":"NetworkElement","mibRootName":"LTE11dg2ERBS00003","parentRDN":null,"moName":"LTE11dg2ERBS00003","fullMoType":"NetworkElement","attributes":{"neType":"RadioNode","networkFunctions":"[ENodeB]"},"radioAccessTechnology":null,"managementState":null},
                    {"id":"39120","poId":"39120","moType":"NetworkElement","mibRootName":"LTE11dg2ERBS00004","parentRDN":null,"moName":"LTE11dg2ERBS00004","fullMoType":"NetworkElement","attributes":{"neType":"RadioNode","networkFunctions":"[ENodeB]"},"radioAccessTechnology":null,"managementState":null},
                    {"id":"39285","poId":"39285","moType":"NetworkElement","mibRootName":"LTE11dg2ERBS00005","parentRDN":null,"moName":"LTE11dg2ERBS00005","fullMoType":"NetworkElement","attributes":{"neType":"RadioNode","networkFunctions":"[ENodeB]"},"radioAccessTechnology":null,"managementState":null}
                    ];
                break;
            default :
                throw new Error("Query '" + queryString + "' is not supported by the mocked server.");
        }
    },

    getSubnetTreeByPoId: function getSubnetTreeByPoId(poId) {
        if (poId === subnets.SUBNET_SPECS.FAULTY_SUBNET.poId) {
            throw "Faulty subnet";
        }

        return subnets.buildSubnetTree((subnets.ALL_SUBNETS).filter(function (item) {
            return item.poId === poId;
        }));
    },

    holdResponseInLimbo: function holdResponseInLimbo(fdn, response, status, body) {
        console.log("Holding response in limbo");
        responsesInLimbo[fdn] = {response: response, status: status, body: body};
    },

    executeResponseInLimbo: function executeResponseInLimbo(fdn) {
        var storedRes;
        if ((storedRes = responsesInLimbo[fdn]) !== undefined) {
            console.log("Found stored response");
            storedRes.response.status(storedRes.status).send(storedRes.body); // Use the stored Express.js response object to send a delayed http respose
            delete responsesInLimbo[fdn]; // Properly remove the key from the map
        }
        // No error action is taken if that FDN did not have a request stored
    }
};

var responsesInLimbo = {};
