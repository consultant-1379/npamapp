// Basic guidelines to add a new SubNet
// 1. Create a new const with the subnet's properties (e.g. copy SIMPLE_SUBNET)
//        See Nodes.js to create more nodes-under-subnets for your new subnet, and add those to the "childrens" property
// 2. Add the new const to PARENT_SUBNETS to display it at the root of the topology tree, or to CHILD_SUBNETS if it's nest under another subnet
// 3. In ManagedObjects.js, add a new entry for the subnet (e.g. copy Simple_Subnet). See Child_Subnet for how to nest it

var nodes = require('./Nodes');

// A subnet that will contain no objects
const EMPTY_SUBNET = {
    poId: '281474977403524',
    name: 'Empty_Subnet',
    moType: 'SubNetwork',
    neType: null,
    noOfChildren: 0,
    childrens: null
};

// A subnet that will contain only nodes
const SIMPLE_SUBNET = {
    poId: '281474977403525',
    name: 'Simple_Subnet',
    moType: 'SubNetwork',
    neType: null,
    noOfChildren: 4,
    childrens: nodes.buildNodeTree([nodes.LTE_NODES_UNDER_SUBNETS[7], nodes.NR_NODES_UNDER_SUBNETS[8],nodes.WCDMA_NODES_UNDER_SUBNETS[1],nodes.GSM_NODES_UNDER_SUBNETS[0]])
};

// A subnet that will send a 500 Server Error when it is accessed through /persistentObject/network/ via its PO ID
const FAULTY_SUBNET = {
    poId: '281474977403526',
    name: 'Faulty_Subnet',
    moType: 'SubNetwork',
    neType: null,
    noOfChildren: 0,
    childrens: null
};
// A generic subnet whose purpose is to be the child of another
const CHILD_SUBNET = {
    poId: '281474977403529',
    name: 'Child_Subnet',
    moType: 'SubNetwork',
    neType: null,
    noOfChildren: 4,
    childrens: nodes.buildNodeTree([nodes.NR_NODES_UNDER_SUBNETS[3], nodes.NR_NODES_UNDER_SUBNETS[6],nodes.LTE_NODES_UNDER_SUBNETS[5], nodes.LTE_NODES_UNDER_SUBNETS[6]])
};
// A subnet that will contain both nodes and subnets
const PARENT_SUBNET = {
    poId: '281474977403528',
    name: 'Parent_Subnet',
    moType: 'SubNetwork',
    neType: null,
    noOfChildren: 5,
    childrens: buildSubnetTree([CHILD_SUBNET]).concat(nodes.buildNodeTree([nodes.NR_NODES_UNDER_SUBNETS[0], nodes.NR_NODES_UNDER_SUBNETS[1], nodes.NR_NODES_UNDER_SUBNETS[4], nodes.LTE_NODES_UNDER_SUBNETS[2], nodes.WCDMA_NODES_UNDER_SUBNETS[0]]))
};
// A subnet that will hold the various subnets and nodes which simply display different message in the UI
const MESSAGES_SUBNET = {
    poId: '281474977454951',
    name: 'Messages_Subnet',
    moType: 'SubNetwork',
    neType: null,
    noOfChildren: 2 + nodes.MESSAGES_NODES.length,
    childrens: nodes.buildNodeTree(nodes.MESSAGES_NODES).concat(buildSubnetTree([EMPTY_SUBNET, FAULTY_SUBNET]))
};


// [ERBS_NODE , ERBS_MANAGEDELEMENT, ENODEBFUNCTION, EUTRANCELLFDD,NBIOTCELL] Subnets of Cell hierarchy of LTE(ERBS) Node
const ENODEBFUNCTION = {
    poId: '281474978975879',
    name: '1',
    moType: 'ENodeBFunction',
    neType: null
};

const ERBS_MANAGEDELEMENT = {
    poId: '281474978975878',
    name: '1',
    moType: 'ManagedElement',
    neType: 'ERBS',
    noOfChildren: 1,
    childrens: buildSubnetTree([ENODEBFUNCTION])
};

const ERBS_NODE = {
    poId: '281474978975877',
    name: 'ERBS_Node',
    moType: 'MeContext',
    neType: 'ERBS',
    noOfChildren: 1,
    childrens: buildSubnetTree([ERBS_MANAGEDELEMENT])
};

// [RNC_NODE , RNC_MANAGEDELEMENT , RNCFUNCTION ] Subnets of cell Hierarchy of WCDMA(RNC) node
const RNCFUNCTION = {
    poId: '281474978975883',
    name: '1',
    moType: 'RncFunction',
    neType: null
};

const RNC_MANAGEDELEMENT = {
    poId: '281474978975882',
    name: '1',
    moType: 'ManagedElement',
    neType: 'RNC',
    noOfChildren: 1,
    childrens: buildSubnetTree([RNCFUNCTION])
};

const RNC_NODE = {
    poId: '281474978975881',
    name: 'RNC_Node',
    moType: 'MeContext',
    neType: 'RNC',
    noOfChildren: 1,
    childrens: buildSubnetTree([RNC_MANAGEDELEMENT])
};

// [NR_NODE, NR_MANAGEDELEMENT, GNBDUFUNCTION, NRCELLDU] Subnets of Cell hierarchy of NR(Radio) Node
const GNBDUFUNCTION = {
    poId: '281471238975877',
    name: '1',
    moType: 'GNBDUFunction',
    neType: null
};

const NR_MANAGEDELEMENT = {
    poId: '281471238975876',
    name: '1',
    moType: 'ManagedElement',
    neType: 'RadioNode',
    noOfChildren: 1,
    childrens: buildSubnetTree([GNBDUFUNCTION])
};

const NR_NODE = {
    poId: '281471238975875',
    name: 'NR_Node',
    moType: 'MeContext',
    neType: 'RadioNode',
    noOfChildren: 1,
    childrens: buildSubnetTree([NR_MANAGEDELEMENT])
};
// The subnets that will be in the root of the Scoping Panel
const PARENT_SUBNETS = [SIMPLE_SUBNET, PARENT_SUBNET, MESSAGES_SUBNET];
// The subnets that will be nested under others, and therefore not visible in the root of the Scoping Panel
const CHILD_SUBNETS = [CHILD_SUBNET, EMPTY_SUBNET, FAULTY_SUBNET];

const ALL_SUBNETS = PARENT_SUBNETS.concat(CHILD_SUBNETS);

const NODE_SUBNETS = PARENT_SUBNETS.concat(CHILD_SUBNETS);


function buildSubnetTree(subnetworks) {
    return subnetworks.map(function (subnetwork) {
        return {
            id: subnetwork.poId,
            moName: subnetwork.name,
            moType: subnetwork.moType,
            iconType: '',
            neType: subnetwork.neType,
            poId: subnetwork.poId,
            noOfChildrens: subnetwork.noOfChildren,
            childrens: subnetwork.childrens,
            syncStatus: ''
        };
    });
}

module.exports = {
    buildSubnetTree: buildSubnetTree,

    // Minimal data to be shared publicly to other mock data providers (such as server.js and MangedObjects.js)
    SUBNET_SPECS: {
        EMPTY_SUBNET: { name: EMPTY_SUBNET.name, poId: EMPTY_SUBNET.poId, noOfChildren: EMPTY_SUBNET.noOfChildren },
        SIMPLE_SUBNET: { name: SIMPLE_SUBNET.name, poId: SIMPLE_SUBNET.poId, noOfChildren: SIMPLE_SUBNET.noOfChildren },
        CHILD_SUBNET: { name: CHILD_SUBNET.name, poId: CHILD_SUBNET.poId, noOfChildren: CHILD_SUBNET.noOfChildren },
        FAULTY_SUBNET: { name: FAULTY_SUBNET.name, poId: FAULTY_SUBNET.poId, noOfChildren: FAULTY_SUBNET.noOfChildren },
        PARENT_SUBNET: { name: PARENT_SUBNET.name, poId: PARENT_SUBNET.poId, noOfChildren: PARENT_SUBNET.noOfChildren },
        MESSAGES_SUBNET: { name: MESSAGES_SUBNET.name, poId: MESSAGES_SUBNET.poId, noOfChildren: MESSAGES_SUBNET.noOfChildren }

    },

    // The raw data to be kept protected under MockedObjects.js
    ALL_SUBNETS: ALL_SUBNETS,
    PARENT_SUBNETS: PARENT_SUBNETS,
    NODE_SUBNETS: NODE_SUBNETS
};
