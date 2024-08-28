// Basic guidelines to add a new node under the "All Other Nodes" folder:
// 1. Create a constant with its poId, name, neType, etc. (e.g. duplicate "ERBS_NODE")
// 2. Add it to the exported NODE_SPECS object
// 3. Add it to the exported OTHER_NODES array
// 4. In ManagedObjects.js, add it to the managedObjectsByPoId data structure (e.g. duplicate the sub-object for "ERBS_Node")
// 5a. For a Node that will have a changeable admin state: In CellDataHolder.js::resetDataStore(), add a line for each
//          desired customized cell, and call buildExtraCells to add extra automatically up to noOfCells
// 5b. For a Node that will not have a changeable admin state: In CmsReadCellsDataResponseStub.js::readCellAttributes(),
//          add an else-if block for the new node (e.g. duplicate FIXED_RESPONSE_NODE's block)

// Basic guidelines to add a new node under a Subnet:
// 1. Increase the NODES_UNDER_SUBNETS_NUM constant
// 2. In SubNetworks.js, add the new array items from NODES_UNDER_SUBNETS[] into the "childrens" item for the proper subnet
// 3. In MangedObjects.js, in the for loop assigning nodes-under-subnets, modify the if-else blocks assigning "parentRDN"

// LTE Nodes that will be placed under Subnets
const LTE_NODES_UNDER_SUBNETS_NAME_PREFIX = "Lte_Node_";
const LTE_NODES_UNDER_SUBNETS_STARTING_POID = 281474970000000;
const LTE_NODES_UNDER_SUBNETS_NUM = 9;
const LTE_NODES_UNDER_SUBNETS_NETYPE = "ERBS";

// WCDMA Nodes that will be placed under Subnets
const WCDMA_NODES_UNDER_SUBNETS_NAME_PREFIX = "Wcdma_Node_";
const WCDMA_NODES_UNDER_SUBNETS_STARTING_POID = 281474980000000;
const WCDMA_NODES_UNDER_SUBNETS_NUM = 4;
const WCDMA_NODES_UNDER_SUBNETS_NETYPE = "RNC";

// GSM Nodes that will be placed under Subnets
const GSM_NODES_UNDER_SUBNETS_NAME_PREFIX = "Gsm_Node_";
const GSM_NODES_UNDER_SUBNETS_STARTING_POID = 281474990000000;
const GSM_NODES_UNDER_SUBNETS_NUM = 1;
const GSM_NODES_UNDER_SUBNETS_NETYPE = "BSC";

// NR Nodes that will be placed under Subnets
const NR_NODES_UNDER_SUBNETS_NAME_PREFIX = "RN_Node_";
const NR_NODES_UNDER_SUBNETS_STARTING_POID = 281474910000000;
const NR_NODES_UNDER_SUBNETS_NUM = 10;
const NR_NODES_UNDER_SUBNETS_NETYPE = "RadioNode";

// Build subnet LTE node objects
var LTE_NODES_UNDER_SUBNETS = [];
for (var i = 1; i <= LTE_NODES_UNDER_SUBNETS_NUM; ++i) {
    LTE_NODES_UNDER_SUBNETS.push({
        poId: "" + (LTE_NODES_UNDER_SUBNETS_STARTING_POID + i),
        name: LTE_NODES_UNDER_SUBNETS_NAME_PREFIX + i,
        moType: "MeContext",
        neType: LTE_NODES_UNDER_SUBNETS_NETYPE
    });
}
// Build subnet WCDMA node objects
var WCDMA_NODES_UNDER_SUBNETS = [];
for (var j = 1; j <= WCDMA_NODES_UNDER_SUBNETS_NUM; ++j) {
    WCDMA_NODES_UNDER_SUBNETS.push({
        poId: "" + (WCDMA_NODES_UNDER_SUBNETS_STARTING_POID + j),
        name: WCDMA_NODES_UNDER_SUBNETS_NAME_PREFIX + j,
        moType: "MeContext",
        neType: WCDMA_NODES_UNDER_SUBNETS_NETYPE
    });
}

// Build subnet GSM node objects
var GSM_NODES_UNDER_SUBNETS = [];
for (var k = 1; k <= GSM_NODES_UNDER_SUBNETS_NUM; ++k) {
    GSM_NODES_UNDER_SUBNETS.push({
        poId: "" + (GSM_NODES_UNDER_SUBNETS_STARTING_POID + k),
        name: GSM_NODES_UNDER_SUBNETS_NAME_PREFIX + k,
        moType: "MeContext",
        neType: GSM_NODES_UNDER_SUBNETS_NETYPE
    });
}

// Build subnet NR node objects
var NR_NODES_UNDER_SUBNETS = [];
for (var k = 1; k <= NR_NODES_UNDER_SUBNETS_NUM; ++k) {
    NR_NODES_UNDER_SUBNETS.push({
        poId: "" + (NR_NODES_UNDER_SUBNETS_STARTING_POID + k),
        name: NR_NODES_UNDER_SUBNETS_NAME_PREFIX + k,
        moType: "MeContext",
        neType: NR_NODES_UNDER_SUBNETS_NETYPE
    });
}
// Nodes that will be under the "All other nodes" container
// An ERBS node
const ERBS_NODE = {
    poId: '281474977570671',
    name: 'ERBS_Node',
    moType: 'MeContext',
    neType: 'ERBS'
};

// A PICO node
const PICO_NODE = {
    poId: '281474977570672',
    name: 'PICO_Node',
    moType: 'MeContext',
    neType: 'MSRBS_V1'
};

// A RADIO node
var RADIO_NODE = {
    poId: '281474977570673',
    name: 'RADIO_Node',
    moType: 'MeContext',
    neType: 'RadioNode'
};

var eutran_and_utran = {
    poId: '281474979478836',
    name: 'RADIO_Node',
    moType: 'EUtranCellFDD',
    neType: 'RNC'
};

//A RNC Node
const RNC_NODE = {
    poId: '281474977570674',
    name: 'RNC_NODE',
    moType: 'MeContext',
    neType: 'RNC'
};

const BSC_NODE = {
    poId: '281474979292761',
    name: 'BSC_NODE',
    moType: 'MeContext',
    neType: 'BSC'
};

//A RBS Node
var RBS_NODE = {
    poId: '281474977570675',
    name: 'RBS_NODE',
    moType: 'MeContext',
    neType: 'RBS'
};

// NRCell that is visible after expanding the CELL-Hierarchy of NR_NODE
const NR_NODE = {
    poId: '281474977571234',
    name: 'NR_Node',
    moType: 'MeContext',
    neType: 'RadioNode'
};

const NR_MULTIRATNODE = {
    poId: '281474977571235',
    name: 'NR_MultiNode',
    moType: 'MeContext',
    neType: 'RadioNode',
    radioAccessTechnology: ["4G", "5G"]
};

const vBSC_NODE = {
	    poId: '400024',
	    name: 'vBSC_NODE',
	    moType: 'MeContext',
	    neType: 'vBSC'
	};

// A node that should not be shown in Cell Management
const UNSUPPORTED_NODE = {
    poId: '281474977570681',
    name: 'Unsupported_Node',
    moType: 'MeContext',
    neType: 'C3PO',
    noOfCells: 0
};

// A node that awaits for signals on special URLs to complete its operations
const MANUAL_REFRESH_AND_TIMEOUT_FAILURES_NODE = {
    poId: '281474994236845',
    name: 'Manual_Refresh_And_Timeout_Failures_Node',
    moType: 'MeContext',
    neType: 'RadioNode',
    noOfCells: 1
};

const OTHER_NODES = [ERBS_NODE, NR_NODE, PICO_NODE, RADIO_NODE, RNC_NODE, RBS_NODE, UNSUPPORTED_NODE, MANUAL_REFRESH_AND_TIMEOUT_FAILURES_NODE, BSC_NODE,  NR_MULTIRATNODE, vBSC_NODE];

// Nodes that exist simply to display messages in the UI. Will be grouped under a subnet
// A node designed to fail "early during the CMS request", and returns a 400 Bad Request error, with the message "I have a bad feeling about this..."
const ALPHA_FAULTY_NODE = {
    poId: '281474977570682',
    name: 'Alpha_Faulty_Node',
    moType: 'MeContext',
    neType: 'RadioNode',
    noOfCells: 0
};

// A node which fails "even before the request hits CMS", and returns a 404 Not Found, with the message "Total disaster - resource not found!"
const BETA_FAULTY_NODE = {
    poId: '281474977570683',
    name: 'Beta_Faulty_Node',
    moType: 'MeContext',
    neType: 'RadioNode',
    noOfCells: 0
};

// A node which fails "after the request hits CMS" and returns a 500 Internal Error, with the reason for failure "Node is not managed by ENM"
const GAMMA_FAULTY_NODE = {
    poId: '281474977570684',
    name: 'Gamma_Faulty_Node',
    moType: 'MeContext',
    neType: 'RadioNode',
    noOfCells: 0
};

// A node which fails "after the request hits CMS" and returns a 500 Internal Error", with the reason for failure "Node is not managed by ENM"
const DELTA_FAULTY_NODE = {
    poId: '281474977570685',
    name: 'Delta_Faulty_Node',
    moType: 'MeContext',
    neType: 'RadioNode',
    noOfCells: 0
};

// A node which fails "after the request hits CMS" and returns a 500 Internal Error", with the reason for failure "DPS failure"
const EPSILON_FAULTY_NODE = {
    poId: '281474977570686',
    name: 'Epsilon_Faulty_Node',
    moType: 'MeContext',
    neType: 'RadioNode',
    noOfCells: 0
};

// A node with no EUtranCells inside
const NO_CELLS_NODE = {
    poId: '281474977570680',
    name: 'No_Cells_Node',
    moType: 'MeContext',
    neType: 'ERBS',
    noOfCells: 0
};

const NO_CELLS_NODE_NR = {
    poId: '281474977570699',
    name: 'No_Cells_Node_Nr',
    moType: 'MeContext',
    neType: 'RadioNode',
    noOfCells: 0
};

const MESSAGES_NODES = [NO_CELLS_NODE, ALPHA_FAULTY_NODE, BETA_FAULTY_NODE, GAMMA_FAULTY_NODE, DELTA_FAULTY_NODE, EPSILON_FAULTY_NODE, NO_CELLS_NODE_NR];
const MECONTEXT_NODES = LTE_NODES_UNDER_SUBNETS.concat(WCDMA_NODES_UNDER_SUBNETS).concat(OTHER_NODES);
const ALL_NODES = LTE_NODES_UNDER_SUBNETS.concat(WCDMA_NODES_UNDER_SUBNETS).concat(OTHER_NODES).concat(MESSAGES_NODES).concat(GSM_NODES_UNDER_SUBNETS).concat(NR_NODES_UNDER_SUBNETS);

function buildNodeTree(nodes) {
    return nodes.map(function (node) {
        return {
            id: node.poId,
            name: node.name,
            moName: node.name,
            moType: node.moType,
            noOfCells: node.noOfCells,
            iconType: '',
            neType: node.neType,
            childrens: null,
            syncStatus: '',
            radioAccessTechnology: node.radioAccessTechnology
        };
    });
}


module.exports = {
    buildNodeTree: buildNodeTree,
    // Minimal data to be shared publicly to other mock data providers (such as server.js and MangedObjects.js)
    NODE_SPECS: {
        ERBS_NODE: {
            name: ERBS_NODE.name,
            poId: ERBS_NODE.poId,
            noOfCells: ERBS_NODE.noOfCells,
            neType: ERBS_NODE.neType
        },
        NR_NODE: {
            name: NR_NODE.name,
            poId: NR_NODE.poId,
            noOfCells: NR_NODE.noOfCells,
            neType: NR_NODE.neType
        },
        NR_MULTIRATNODE: {
            name: NR_MULTIRATNODE.name,
            poId: NR_MULTIRATNODE.poId,
            noOfCells: NR_MULTIRATNODE.noOfCells,
            neType: NR_MULTIRATNODE.neType
        },
         vBSC_NODE: {
          name: vBSC_NODE.name,
          poId: vBSC_NODE.poId,
	      noOfCells: vBSC_NODE.noOfCells,
          neType: vBSC_NODE.neType
        },
        PICO_NODE: {
            name: PICO_NODE.name,
            poId: PICO_NODE.poId,
            noOfCells: PICO_NODE.noOfCells,
            neType: PICO_NODE.neType
        },
        RADIO_NODE: {
            name: RADIO_NODE.name,
            poId: RADIO_NODE.poId,
            noOfCells: RADIO_NODE.noOfCells,
            neType: RADIO_NODE.neType
        },
        RNC_NODE: {name: RNC_NODE.name, poId: RNC_NODE.poId, noOfCells: RNC_NODE.noOfCells, neType: RNC_NODE.neType},
        RBS_NODE: {name: RBS_NODE.name, poId: RBS_NODE.poId, noOfCells: RBS_NODE.noOfCells, neType: RBS_NODE.neType},
        BSC_NODE: {name: BSC_NODE.name, poId: BSC_NODE.poId, noOfCells: BSC_NODE.noOfCells, neType: BSC_NODE.neType},
        UNSUPPORTED_NODE: {
            name: UNSUPPORTED_NODE.name,
            poId: UNSUPPORTED_NODE.poId,
            noOfCells: UNSUPPORTED_NODE.noOfCells,
            neType: UNSUPPORTED_NODE.neType
        },
        MANUAL_REFRESH_AND_TIMEOUT_FAILURES_NODE: {
            name: MANUAL_REFRESH_AND_TIMEOUT_FAILURES_NODE.name,
            poId: MANUAL_REFRESH_AND_TIMEOUT_FAILURES_NODE.poId,
            noOfCells: MANUAL_REFRESH_AND_TIMEOUT_FAILURES_NODE.noOfCells,
            neType: MANUAL_REFRESH_AND_TIMEOUT_FAILURES_NODE.neType
        },
        ALPHA_FAULTY_NODE: {
            name: ALPHA_FAULTY_NODE.name,
            poId: ALPHA_FAULTY_NODE.poId,
            noOfCells: ALPHA_FAULTY_NODE.noOfCells,
            neType: ALPHA_FAULTY_NODE.neType
        },
        BETA_FAULTY_NODE: {
            name: BETA_FAULTY_NODE.name,
            poId: BETA_FAULTY_NODE.poId,
            noOfCells: BETA_FAULTY_NODE.noOfCells,
            neType: BETA_FAULTY_NODE.neType
        },
        GAMMA_FAULTY_NODE: {
            name: GAMMA_FAULTY_NODE.name,
            poId: GAMMA_FAULTY_NODE.poId,
            noOfCells: GAMMA_FAULTY_NODE.noOfCells,
            neType: GAMMA_FAULTY_NODE.neType
        },
        DELTA_FAULTY_NODE: {
            name: DELTA_FAULTY_NODE.name,
            poId: DELTA_FAULTY_NODE.poId,
            noOfCells: DELTA_FAULTY_NODE.noOfCells,
            neType: DELTA_FAULTY_NODE.neType
        },
        EPSILON_FAULTY_NODE: {
            name: EPSILON_FAULTY_NODE.name,
            poId: EPSILON_FAULTY_NODE.poId,
            noOfCells: EPSILON_FAULTY_NODE.noOfCells,
            neType: EPSILON_FAULTY_NODE.neType
        }

    },
    LTE_NODES_UNDER_SUBNETS_SPECS: {
        namePrefix: LTE_NODES_UNDER_SUBNETS_NAME_PREFIX,
        startingPoId: LTE_NODES_UNDER_SUBNETS_STARTING_POID,
        totalNumOfNodes: LTE_NODES_UNDER_SUBNETS_NUM,
        neType: LTE_NODES_UNDER_SUBNETS_NETYPE
    },

    WCDMA_NODES_UNDER_SUBNETS_SPECS: {
        namePrefix: WCDMA_NODES_UNDER_SUBNETS_NAME_PREFIX,
        startingPoId: WCDMA_NODES_UNDER_SUBNETS_STARTING_POID,
        totalNumOfNodes: WCDMA_NODES_UNDER_SUBNETS_NUM,
        neType: WCDMA_NODES_UNDER_SUBNETS_NETYPE
    },

    GSM_NODES_UNDER_SUBNETS_SPECS: {
        namePrefix: GSM_NODES_UNDER_SUBNETS_NAME_PREFIX,
        startingPoId: GSM_NODES_UNDER_SUBNETS_STARTING_POID,
        totalNumOfNodes: GSM_NODES_UNDER_SUBNETS_NUM,
        neType: GSM_NODES_UNDER_SUBNETS_NETYPE
    },

    NR_NODES_UNDER_SUBNETS_SPECS: {
        namePrefix: NR_NODES_UNDER_SUBNETS_NAME_PREFIX,
        startingPoId: NR_NODES_UNDER_SUBNETS_STARTING_POID,
        totalNumOfNodes: NR_NODES_UNDER_SUBNETS_NUM,
        neType: NR_NODES_UNDER_SUBNETS_NETYPE
    },

    // The raw data to be kept protected under MockedObjects.js
    ALL_NODES: ALL_NODES,
    OTHER_NODES: OTHER_NODES,
    LTE_NODES_UNDER_SUBNETS: LTE_NODES_UNDER_SUBNETS,
    WCDMA_NODES_UNDER_SUBNETS: WCDMA_NODES_UNDER_SUBNETS,
    GSM_NODES_UNDER_SUBNETS: GSM_NODES_UNDER_SUBNETS,
    NR_NODES_UNDER_SUBNETS: NR_NODES_UNDER_SUBNETS,
    MESSAGES_NODES: MESSAGES_NODES,
    NODES_FOR_SEARCH_RADIO: [RADIO_NODE],
    MECONTEXT_NODES: MECONTEXT_NODES
};
