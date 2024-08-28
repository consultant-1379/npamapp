/**
 * Sets up the collections available in the Collections Tab.
 */
function getCollections() { return { "message":{ "collections":[{ "id": "281474982773730", "name": "CollectionWithMeContext", "parentId": null, "sharing": "Public", "owner": "administrator", "type": "NESTED", "subType": "LEAF", "customTopology": false, "delete": true, "update": true, "lastUpdatedTime": "1486549060716", "level": 0  }, { "id": "281474982773731", "name": "CollectionWithSubNetwork", "parentId": null, "sharing": "Public", "owner": "administrator", "type": "STANDARD", "subType": null, "customTopology": false, "delete": true, "update": true, "lastUpdatedTime": "1486549030529", "level": 0  }, { "id": "281474982773732", "name": "CollectionWithEmptySubNetwork", "parentId": "281474979168652", "sharing": "Public", "owner": "administrator", "type": "NESTED", "subType": "LEAF", "customTopology": false, "delete": true, "update": true, "lastUpdatedTime": "1486549030529", "level": 2  }, { "id": "281474982773733", "name": "CollectionWithUtranCell&EutranCellFDD", "parentId": "281474979168652", "sharing": "Public", "owner": "administrator", "type": "NESTED", "subType": "LEAF", "customTopology": false, "delete": true, "update": true, "lastUpdatedTime": "1486549030529", "level": 2  }, { "id": "281474982773734", "name": "CollectionToEditTDD&FDD&Radio", "parentId": "281474979424940", "sharing": "Public", "owner": "administrator", "type": "NESTED", "subType": "LEAF", "customTopology": false, "delete": false, "update": true, "lastUpdatedTime": "1486537224677", "level": 2  }], "status":"SUCCESS", "request":{ "user":"administrator", "requestId":"abababab-0101-2323-4545-cdcdcdcdcdcd"  }, "metadata":{ "completeResultSize": 5  } } }; }
/**
 * Provides details of collection objects contained in the collections.
 */
function getCollectionObjects() {

    var response = {
        "274379": {
            "id": "274379",
            "name": "networkelement_all",
            "owner": "administrator",
            "sharing": "private",
            "type": "LEAF",
            "timeCreated": 1692887325634,
            "timeUpdated": 1692887498739,
            "userPermissions": {
                "deletable": true,
                "updateable": true
            },
            "contentsUpdatedTime": 1692887498736,
            "contents": [
                {
                    "id": "246030",
                    "type": "NetworkElement",
                    "fdn": "NetworkElement=LTE04dg2ERBS00003",
                    "namespace": "OSS_NE_DEF",
                    "name": "LTE04dg2ERBS00003",
                    "attributes": {
                        "neType": "RadioNode"
                    }
                },
                {
                    "id": "246015",
                    "type": "NetworkElement",
                    "fdn": "NetworkElement=LTE04dg2ERBS00002",
                    "namespace": "OSS_NE_DEF",
                    "name": "LTE04dg2ERBS00002",
                    "attributes": {
                        "neType": "RadioNode"
                    }
                },
                {
                    "id": "246000",
                    "type": "NetworkElement",
                    "fdn": "NetworkElement=LTE04dg2ERBS00001",
                    "namespace": "4SS_NE_DEF",
                    "name": "LTE04dg2ERBS00001",
                    "attributes": {
                        "neType": "RadioNode"
                    }
                }
            ]
        },
        "279328": {
            "id": "279328",
            "name": "emptyCol",
            "owner": "administrator",
            "sharing": "public",
            "type": "LEAF",
            "timeCreated": 1693290159139,
            "timeUpdated": 1693290159142,
            "userPermissions": {
                "deletable": true,
                "updateable": true
            },
            "contentsUpdatedTime": 1693290159141
        },
        "5428": {
             "id": "5428",
             "name": "auto_generated_01687860538150",
             "owner": "usera",
             "sharing": "private",
             "type": "LEAF",
             "timeCreated": 1687860540774,
             "timeUpdated": 1687860541195,
             "userPermissions": {
                 "deletable": true,
                 "updateable": true
             },
             "contentsUpdatedTime": 1687860541190
        }
    };
    return response;
}

module.exports = {
    getCollections: getCollections,
    getCollectionObjects: getCollectionObjects
};