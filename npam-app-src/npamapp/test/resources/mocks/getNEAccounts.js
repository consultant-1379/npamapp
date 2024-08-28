var mockNeAccountStatus = [
    {"name": "RN_Node_1", "status": "CONFIGURED", "neStatus": "MANAGED", "errorDetails":"", "cbrsStatus": "CONFIGURED", "cbrsErrorDetails": ""},
    {"name": "RN_Node_2", "status": "DETACHED", "neStatus": "MANAGED", "errorDetails":"Warning: bohh", "cbrsStatus": "DETACHED", "cbrsErrorDetails": "Warning: booh"},
    {"name": "RN_Node_3", "status": "ONGOING", "neStatus": "MANAGED", "errorDetails":""},
    {"name": "RN_Node_4", "status": "FAILED", "neStatus": "MANAGED", "errorDetails":"Error: Booh"},
    {"name": "RN_Node_5", "status": "DETACHED", "neStatus": "NOT_MANAGED", "errorDetails":""},
    {"name": "RN_Node_6", "status": "PLANNED", "neStatus": "MANAGED", "errorDetails": "", "cbrsStatus": "DETACHED", "cbrsErrorDetails": "Warning: booh"},
    {"name": "RN_Node_7", "neStatus": "MANAGED"},
    {"name": "RN_Node_8", "status": "FAILED", "neStatus": "MANAGED", "errorDetails":""},
    {"name": "RN_Node_9", "status": "CONFIGURED", "neStatus": "MANAGED", "errorDetails":""},
    {"name": "NR_Node", "neStatus": "NOT_MANAGED"},
    {"name": "NR_MultiNode", "neStatus": "MANAGED"}
];

function getDefaultNEAccounts(neNames) {
    var neAccounts = [];

    neNames.forEach(function (neName) {
        var obj = {
            "neName":neName,
            "currentUser": "User"+neName,
            "networkElementAccountId": "1",
            "status":"CONFIGURED",
            "errorDetails":"No Errors",
            "lastUpdate":"2022-11-30"
        }
//        var objCBRS = {
//            "neName":"",
//            "currentUser": "",
//            "networkElementAccountId": "2",
//            "status":"CONFIGURED",
//            "errorDetails":"No Errors",
//            "lastUpdate":"2022-11-30"
//        }
        neAccounts.push(obj);
//        if ( neAccounts.length % 2) {
//            neAccounts.push(objCBRS);
//        }
    });
    return neAccounts;
}

function getAllStatusNEAccounts(neNames) {
    var neAccounts = [];

    neNames.forEach(function (neName) {
        var obj1 = {"neName": neName, "neAccounts": []};
        var mockNeStatus =  mockNeAccountStatus.find(function(e) { return e.name === neName;});
        if (mockNeStatus) {
            obj1.neNpamStatus = mockNeStatus.neStatus;
            if (mockNeStatus.status) {
              var obj = {
                  "neName":neName,
                  "currentUser": "User"+neName,
                  "id": "1",
                  "status":mockNeStatus.status,
                  "errorDetails": mockNeStatus.errorDetails,
                  "lastUpdate":"2022-11-30"
              }
              obj1.neAccounts.push(obj);
            }
            if (mockNeStatus.cbrsStatus) {
                var obj = {
                    "neName":neName,
                    "currentUser": "",
                    "id": "2",
                    "status":mockNeStatus.cbrsStatus,
                    "errorDetails": mockNeStatus.cbrsErrorDetails,
                    "lastUpdate":"2022-11-30"
                }
                obj1.neAccounts.push(obj);
             }
        } else {
            obj1.neNpamStatus = "NOT_SUPPORTED";
        }
        neAccounts.push(obj1);
    });
    console.log(neAccounts);
    return neAccounts;
}

function getNEAccountsInCollection(collectionNames) {
    var neAccounts_networkelement_all = [
                     {
                         "neName": "LTE04dg2ERBS00001",
                         "neNpamStatus": "MANAGED",
                         "neAccounts": [
                             {
                                 "neName": "LTE04dg2ERBS00001",
                                 "currentUser": "LTE04dg2ERBS00001",
                                 "id": "1",
                                 "errorDetails": "",
                                 "status": "CONFIGURED",
                                 "lastUpdate": "2023-08-29 06:43:26+0000"
                             },
                             {
                                 "neName": "LTE04dg2ERBS00001",
                                 "currentUser": "",
                                 "id": "2",
                                 "errorDetails": "",
                                 "status": "CONFIGURED",
                                 "lastUpdate": "2023-08-29 06:43:27+0000"
                             }
                         ]
                     },
                     {
                         "neName": "LTE04dg2ERBS00003",
                         "neNpamStatus": "MANAGED",
                         "neAccounts": [
                             {
                                 "neName": "LTE04dg2ERBS00003",
                                 "currentUser": "LTE04dg2ERBS00003",
                                 "id": "1",
                                 "errorDetails": "",
                                 "status": "CONFIGURED",
                                 "lastUpdate": "2023-08-29 06:43:26+0000"
                             },
                             {
                                 "neName": "LTE04dg2ERBS00003",
                                 "currentUser": "",
                                 "id": "2",
                                 "errorDetails": "",
                                 "status": "CONFIGURED",
                                 "lastUpdate": "2023-08-29 06:43:27+0000"
                             }
                         ]
                     },
                     {
                         "neName": "LTE04dg2ERBS00002",
                         "neNpamStatus": "MANAGED",
                         "neAccounts": [
                             {
                                 "neName": "LTE04dg2ERBS00002",
                                 "currentUser": "LTE04dg2ERBS00002",
                                 "id": "1",
                                 "errorDetails": "",
                                 "status": "CONFIGURED",
                                 "lastUpdate": "2023-08-29 06:43:26+0000"
                             },
                             {
                                 "neName": "LTE04dg2ERBS00002",
                                 "currentUser": "",
                                 "id": "2",
                                 "errorDetails": "",
                                 "status": "CONFIGURED",
                                 "lastUpdate": "2023-08-29 06:43:26+0000"
                             }
                         ]
                     },
                     {
                         "neName": "LTE04dg2ERBS00005",
                         "neNpamStatus": "NOT_MANAGED",
                         "neAccounts": [
                             {
                                 "neName": "LTE04dg2ERBS00005",
                                 "currentUser": "LTE04dg2ERBS00005",
                                 "id": "1",
                                 "errorDetails": "",
                                 "status": "CONFIGURED",
                                 "lastUpdate": "2023-08-29 06:43:26+0000"
                             },
                             {
                                 "neName": "LTE04dg2ERBS00005",
                                 "currentUser": "",
                                 "id": "2",
                                 "errorDetails": "",
                                 "status": "CONFIGURED",
                                 "lastUpdate": "2023-08-29 06:43:27+0000"
                             }
                         ]
                     },
                     {
                         "neName": "LTE04dg2ERBS00004",
                         "neNpamStatus": "MANAGED",
                         "neAccounts": [
                             {
                                 "neName": "LTE04dg2ERBS00004",
                                 "currentUser": "LTE04dg2ERBS00004",
                                 "id": "1",
                                 "errorDetails": "",
                                 "status": "CONFIGURED",
                                 "lastUpdate": "2023-08-29 06:43:26+0000"
                             },
                             {
                                 "neName": "LTE04dg2ERBS00004",
                                 "currentUser": "",
                                 "id": "2",
                                 "errorDetails": "",
                                 "status": "CONFIGURED",
                                 "lastUpdate": "2023-08-29 06:43:27+0000"
                             }
                         ]
                     }];


    var neAccounts = [];
    collectionNames.forEach(function (collectionName) {
        if ( collectionName === "networkelement_all") {
            neAccounts_networkelement_all.forEach(function (el) {
                neAccounts.push(el);
            });
        }
    });
    console.log(neAccounts);
    return neAccounts;
}

function getNEAccountsInSavedSearch(savedSearchIds) {
    var neAccounts_NEs = [
        {"neName":"LTE04dg2ERBS00001","neNpamStatus":"MANAGED","neAccounts":[{"neName":"LTE04dg2ERBS00001","currentUser":"LTE04dg2ERBS00001","id":"1","errorDetails":"","status":"CONFIGURED","lastUpdate":"2023-08-29 06:43:26+0000"},{"neName":"LTE04dg2ERBS00001","currentUser":"","id":"2","errorDetails":"","status":"CONFIGURED","lastUpdate":"2023-08-29 06:43:27+0000"}]},
        {"neName":"LTE04dg2ERBS00003","neNpamStatus":"NOT_MANAGED","neAccounts":[{"neName":"LTE04dg2ERBS00003","currentUser":"LTE04dg2ERBS00003","id":"1","errorDetails":"","status":"CONFIGURED","lastUpdate":"2023-08-29 06:43:26+0000"},{"neName":"LTE04dg2ERBS00003","currentUser":"","id":"2","errorDetails":"","status":"CONFIGURED","lastUpdate":"2023-08-29 06:43:27+0000"}]},
        {"neName":"LTE04dg2ERBS00002","neNpamStatus":"MANAGED","neAccounts":[{"neName":"LTE04dg2ERBS00002","currentUser":"LTE04dg2ERBS00002","id":"1","errorDetails":"","status":"CONFIGURED","lastUpdate":"2023-08-29 06:43:26+0000"},{"neName":"LTE04dg2ERBS00002","currentUser":"","id":"2","errorDetails":"","status":"CONFIGURED","lastUpdate":"2023-08-29 06:43:26+0000"}]}
        ];

    var neAccounts = [];
    savedSearchIds.forEach(function (savedSearchid) {
        if ( savedSearchid === "NEs") {
            neAccounts_NEs.forEach(function (el) {
                neAccounts.push(el);
            });
        }
    });
    return neAccounts;
}

function get25000NEAccounts() {
    var neAccounts = [];
    for (var i = 0; i < 25000; i++) {
        var obj1 = {"neName": "NetworkElement" + i, "neNpamStatus": "MANAGED", "neAccounts": []};
        var obj = {
            "neName":"NetworkElement" + i,
            "currentUser": "User" + i,
            "id": "1",
            "status":"CONFIGURED",
            "errorDetails":"No Errors",
            "lastUpdate":"2022-11-30"
        }
        obj1.neAccounts.push(obj);
        neAccounts.push(obj1);
    }
    return neAccounts;
}

module.exports = {
    getDefaultNEAccounts: getDefaultNEAccounts,
    get25000NEAccounts: get25000NEAccounts,
    getAllStatusNEAccounts: getAllStatusNEAccounts,
    getNEAccountsInCollection: getNEAccountsInCollection,
    getNEAccountsInSavedSearch: getNEAccountsInSavedSearch
};
