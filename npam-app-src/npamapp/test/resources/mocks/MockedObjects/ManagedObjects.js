function getAllManagedObjects () {
    var nodes = require('./Nodes');
    var subnets = require('./SubNetworks');

    var managedObjectsByPoId = {
        // Nodes that will be under the "networkelement_all" collection
        '39097':  {
            "mibRootName": "LTE11dg2ERBS00003",
            "name": "LTE11dg2ERBS00003",
            "type": "NetworkElement",
            "poId": 39097,
            "id": "39097",
            "fdn": "NetworkElement=LTE11dg2ERBS00003",
            "namespace": null,
            "namespaceVersion": null,
            "neType": null,
            "neVersion": null,
            "attributes": null,
            "networkDetails": null,
            "writeSupported": false
        },
        '39120':  {
            "mibRootName": "LTE11dg2ERBS00004",
            "name": "LTE11dg2ERBS00004",
            "type": "NetworkElement",
            "poId": 39120,
            "id": "39120",
            "fdn": "NetworkElement=LTE11dg2ERBS00004",
            "namespace": null,
            "namespaceVersion": null,
            "neType": null,
            "neVersion": null,
            "attributes": null,
            "networkDetails": null,
            "writeSupported": false
        },
        '39285':  {
            "mibRootName": "LTE11dg2ERBS00005",
            "name": "LTE11dg2ERBS00005",
            "type": "NetworkElement",
            "poId": 39285,
            "id": "39285",
            "fdn": "NetworkElement=LTE11dg2ERBS00005",
            "namespace": null,
            "namespaceVersion": null,
            "neType": null,
            "neVersion": null,
            "attributes": null,
            "networkDetails": null,
            "writeSupported": false
        },
        '39086': {
            "mibRootName": "LTE11dg2ERBS00002",
            "name": "LTE11dg2ERBS00002",
            "type": "NetworkElement",
            "poId": 39086,
            "id": "39086",
            "fdn": "NetworkElement=LTE11dg2ERBS00002",
            "namespace": null,
            "namespaceVersion": null,
            "neType": null,
            "neVersion": null,
            "attributes": null,
            "networkDetails": null,
            "writeSupported": false
        },
        '39075': {
            "mibRootName": "LTE11dg2ERBS00001",
            "name": "LTE11dg2ERBS00001",
            "type": "NetworkElement",
            "poId": 39075,
            "id": "39075",
            "fdn": "NetworkElement=LTE11dg2ERBS00001",
            "namespace": null,
            "namespaceVersion": null,
            "neType": null,
            "neVersion": null,
            "attributes": null,
            "networkDetails": null,
            "writeSupported": false
        },
        // Nodes that will be under the "All other nodes" container
        '281474977571234': {
            'id': '281474977571234',
            'moName': 'NR_Node',
            'moType': 'MeContext',
            'poId': '281474977571234',
            'mibRootName': 'NR_Node',
            'parentRDN': '',
            'fullMoType': 'MeContext',
            'attributes': {
                'neType': 'RadioNode'
            },
            'cmSyncStatus': 'SYNCHRONIZED'
        },
        '281474977571235': {
            'id': '281474977571235',
            'moName': 'NR_MultiNode',
            'moType': 'MeContext',
            'poId': '281474977571235',
            'mibRootName': 'NR_MultiNode',
            'parentRDN': '',
            'fullMoType': 'MeContext',
            'attributes': {
                'neType': 'RadioNode'
            },
            'cmSyncStatus': 'SYNCHRONIZED'
        },
        '281474977570673': {
            'id': '281474977570673',
            'moName': 'RADIO_Node',
            'moType': 'MeContext',
            'poId': '281474977570673',
            'mibRootName': 'RADIO_Node',
            'parentRDN': '',
            'fullMoType': 'MeContext',
            'attributes': {
                'neType': 'RadioNode'
            },
            'cmSyncStatus': 'SYNCHRONIZED'
        },
        '281474977570699': {
            'id': '281474977570699',
            'moName': 'NO_CELLS_NODE_NR',
            'moType': 'MeContext',
            'poId': '281474977570699',
            'mibRootName': 'NO_CELLS_NODE_NR',
            'parentRDN': '',
            'fullMoType': 'MeContext',
            'fdn': "MeContext=NO_CELLS_NODE_NR",
            'attributes': {
                'neType': 'RadioNode'
            },
            'cmSyncStatus': 'SYNCHRONIZED'
        },

        '281474977403525': {
            'id': '281474977403525',
            'moName': 'Simple_Subnet',
            'moType': 'SubNetwork',
            'poId': '281474977403525',
            'mibRootName': '',
            'parentRDN': '',
            'fullMoType': 'SubNetwork',
            'attributes': {},
            'cmSyncStatus': ''
        },
        '281474977403526': {
            'id': '281474977403526',
            'moName': 'Faulty_Subnet',
            'moType': 'SubNetwork',
            'poId': '281474977403526',
            'mibRootName': '',
            'parentRDN': 'SubNetwork=Messages_Subnet',
            'fullMoType': 'SubNetwork',
            'attributes': {},
            'cmSyncStatus': ''
        },
        '281474977403528': {
            'id': '281474977403528',
            'moName': 'Parent_Subnet',
            'moType': 'SubNetwork',
            'poId': '281474977403528',
            'mibRootName': '',
            'parentRDN': '',
            'fullMoType': 'SubNetwork',
            'attributes': {},
            'cmSyncStatus': ''
        },
        '281474977403529': {
            'id': '281474977403529',
            'moName': 'Child_Subnet',
            'moType': 'SubNetwork',
            'poId': '281474977403529',
            'mibRootName': '',
            'parentRDN': 'SubNetwork=Parent_Subnet',
            'fullMoType': 'SubNetwork',
            'attributes': {},
            'cmSyncStatus': ''
        },
        '281474977454951': {
            'id': '281474977454951',
            'moName': 'Messages_Subnet',
            'moType': 'SubNetwork',
            'poId': '281474977454951',
            'mibRootName': '',
            'parentRDN': '',
            'fullMoType': 'SubNetwork',
            'attributes': {},
            'cmSyncStatus': ''
        },
        '281474978975876': {
            'id': '281474978975876',
            'moName': 'Cell_Subnet',
            'moType': 'SubNetwork',
            'poId': '281474978975876',
            'mibRootName': '',
            'parentRDN': '',
            'fullMoType': 'SubNetwork',
            'attributes': {},
            'cmSyncStatus': ''
        },
//        '281474910000005': {
//            'id': '281474910000005',
//            'moName': 'Cell_Subnet',
//            'moType': 'SubNetwork',
//            'poId': '281474978975876',
//            'mibRootName': '',
//            'parentRDN': '',
//            'fullMoType': 'SubNetwork',
//            'attributes': {},
//            'cmSyncStatus': ''
//        },
    };

    var poId;

    // Lte Nodes that will be placed under subnets
    for (var i = 1; i <= nodes.LTE_NODES_UNDER_SUBNETS_SPECS.totalNumOfNodes; ++i) {
        poId = '' + (nodes.LTE_NODES_UNDER_SUBNETS_SPECS.startingPoId + i);
        managedObjectsByPoId[poId] = {
            'id': poId,
            'moName': nodes.LTE_NODES_UNDER_SUBNETS_SPECS.namePrefix + i,
            'moType': 'MeContext',
            'poId': poId,
            'mibRootName': nodes.LTE_NODES_UNDER_SUBNETS_SPECS.namePrefix + i,
            'fullMoType': 'MeContext',
            'attributes': {},
            'cmSyncStatus': 'SYNCHRONIZED'
        };
        if (i <= 3) {
            managedObjectsByPoId[poId]['parentRDN'] = 'SubNetwork=' + subnets.SUBNET_SPECS.PARENT_SUBNET.name;
        } else if (i <= 7) {
            managedObjectsByPoId[poId]['parentRDN'] = 'SubNetwork=' + subnets.SUBNET_SPECS.CHILD_SUBNET.name;
        } else if (i <= 9) {
            managedObjectsByPoId[poId]['parentRDN'] = 'SubNetwork=' + subnets.SUBNET_SPECS.SIMPLE_SUBNET.name;
        } else {
            managedObjectsByPoId[poId]['parentRDN'] = '';
        }
    }

    // Wcdma Nodes that will be placed under subnets
    for (var j = 1; j <= nodes.WCDMA_NODES_UNDER_SUBNETS_SPECS.totalNumOfNodes; ++j) {
        poId = '' + (nodes.WCDMA_NODES_UNDER_SUBNETS_SPECS.startingPoId + j);
        managedObjectsByPoId[poId] = {
            'id': poId,
            'moName': nodes.WCDMA_NODES_UNDER_SUBNETS_SPECS.namePrefix + j,
            'moType': 'MeContext',
            'poId': poId,
            'mibRootName': nodes.WCDMA_NODES_UNDER_SUBNETS_SPECS.namePrefix + j,
            'fullMoType': 'MeContext',
            'attributes': {},
            'cmSyncStatus': 'SYNCHRONIZED'
        };
        if (j == 1) {
            managedObjectsByPoId[poId]['parentRDN'] = 'SubNetwork=' + subnets.SUBNET_SPECS.PARENT_SUBNET.name;
        } else {
            managedObjectsByPoId[poId]['parentRDN'] = 'SubNetwork=' + subnets.SUBNET_SPECS.SIMPLE_SUBNET.name;
        }
    }

    for (var j = 1; j <= nodes.GSM_NODES_UNDER_SUBNETS_SPECS.totalNumOfNodes; ++j) {
        poId = '' + (nodes.GSM_NODES_UNDER_SUBNETS_SPECS.startingPoId + j);
        managedObjectsByPoId[poId] = {
            'id': poId,
            'moName': nodes.GSM_NODES_UNDER_SUBNETS_SPECS.namePrefix + j,
            'moType': 'MeContext',
            'poId': poId,
            'mibRootName': nodes.GSM_NODES_UNDER_SUBNETS_SPECS.namePrefix + j,
            'fullMoType': 'MeContext',
            'attributes': {},
            'cmSyncStatus': 'SYNCHRONIZED'
        };
        if (j == 1) {
            managedObjectsByPoId[poId]['parentRDN'] = 'SubNetwork=' + subnets.SUBNET_SPECS.PARENT_SUBNET.name;
        } else {
            managedObjectsByPoId[poId]['parentRDN'] = 'SubNetwork=' + subnets.SUBNET_SPECS.SIMPLE_SUBNET.name;
        }
    }

    // NRM Nodes that will be placed under subnets
    for (var k = 1; k <= nodes.NR_NODES_UNDER_SUBNETS_SPECS.totalNumOfNodes; ++k) {
        poId = '' + (nodes.NR_NODES_UNDER_SUBNETS_SPECS.startingPoId + k);
        managedObjectsByPoId[poId] = {
            'id': poId,
            'moName': nodes.NR_NODES_UNDER_SUBNETS_SPECS.namePrefix + k,
            'moType': 'MeContext',
            'poId': poId,
            'mibRootName': nodes.NR_NODES_UNDER_SUBNETS_SPECS.namePrefix + k,
            'fullMoType': 'MeContext',
            'attributes': {},
            'cmSyncStatus': 'SYNCHRONIZED'
        };
        if (k == 1) {
            managedObjectsByPoId[poId]['parentRDN'] = 'SubNetwork=' + subnets.SUBNET_SPECS.PARENT_SUBNET.name;
        } else {
            managedObjectsByPoId[poId]['parentRDN'] = 'SubNetwork=' + subnets.SUBNET_SPECS.SIMPLE_SUBNET.name;
        }
    }
    return managedObjectsByPoId;
}

function getGNBCUCPFFunction() {
    return {
        "moDetails":[{
            "modelInfo":{
                "targetTypeAttribute":"",
                "namespace":"GNBCUCP",
                "namespaceVersion":"11.14.0"
            },
            "moTypes":{
                "GNBCUCPFunction":[{
                    "nodeName":"NR01gNodeBRadio00002",
                    "poId":"83824450"
                }]
            }
        }],
        "attributesOrder":[],
        "attributeMappings":[{
            "moType":"GNBCUCPFunction",
             "attributeNames":[]
        }],
        "metadata":{
            "MAX_UI_CACHE_SIZE":100000,
            "RESULT_SET_TOTAL_SIZE":1,
            "INFO_MESSAGE":0,
            "SORTABLE":true
        }
    }
}
module.exports = {
    getAllManagedObjects: getAllManagedObjects,
    getGNBCUCPFFunction: getGNBCUCPFFunction
};
