var accessRights = require("./test/resources/mocks/AccessRights");
var neAccounts = require("./test/resources/mocks/getNEAccounts");
var jobs = require("./test/resources/mocks/getJobs");
var mockedObjects = require("./test/resources/mocks/MockedObjects");
var persistenObjectStub = require('./test/resources/mocks/MockedObjects/PersistentObjects');


var fs = require("fs");
var bodyParser = require('body-parser');
var exportedActions = fs.readFileSync('launcher/metadata/npamapp/npamapp.json').toString();
var exportedNEAccounts = fs.readFileSync('neAccountsToExport.enc');
var exportedNEAccountsPT = fs.readFileSync('neAccountsToExport.csv');
var userSettings = [];
var userSettingsFailure = false;
var tableSettingsFailure = false;

// Variables used for groovy tests
var httpStatus = 200;
var httpJsonError = {"userMessage":"usermessage",
                     "internalErrorCode":5000,
                     "errorDetails":"errorDetails"};
var customNpamCapabilities = [];


module.exports = function (app) {
    app.use(bodyParser.json()); // for parsing application/json

    // Work around to add javascript libraries known as pollyfill libraries
    // which are required for testing against phantomJS
    // If statement is a pollyfill workaround for Object.assign error until UI SDK is introducing
    app.get('/', function (req, res) {
        res.send(fs.readFileSync('.cdt/index.html').toString().replace(
            '</head>',
            '<script>'
            + 'var files = [ "Bind.js", "Promise.js", "Array.js", "Number.js", '
            + '"String.js", "MapSetCommon.js", "RequestAnimationFrame.js", "WeakMap.js"];'
            + 'files.forEach(function(file) {'
            + 'var script = document.createElement("script");'
            + 'script.src = "node_modules/cdt-serve/test_framework/polyfills/" + file;'
            + 'document.head.appendChild(script);'
            + '});'
            + 'if (typeof Object.assign != "function") {'
            + 'Object.assign = function(target, varArgs) { "use strict";'
            + ' if (target == null) { '
            + ' throw new TypeError("Cannot convert undefined or null to object");}'
            + 'var to = Object(target);'
            + 'for (var index = 1; index < arguments.length; index++) {'
            + 'var nextSource = arguments[index];'
            + 'if (nextSource != null) {'
            + ' for (var nextKey in nextSource) {'
            + '  if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {'
            + '   to[nextKey] = nextSource[nextKey];'
            + ' }'
            + '}'
            + '}'
            + '}'
            + ' return to;'
            + '};'
            + '}'
            + '</script>'
            + '</head>'));
    });

    // --- Scoping Panel end-points --- //
    app.get('/persistentObject/network/281474977570699', function(req,res){
        var response = persistenObjectStub.getNrNodeDetails();
        res.status(200).send(response);
    });

     app.get('/persistentObject/network/281474977571234', function(req,res){
        var response = persistenObjectStub.getNrNodeDetails();
        res.status(200).send(response);
     });

    app.get('/persistentObject/network/134893488', function(req,res){
        var response = persistenObjectStub.getNrChildNodeDetails();
        res.status(200).send(response);
    });

    app.get('/persistentObject/network/-1', function (req, res) {
        res.status(200).send({
            "treeNodes": mockedObjects.buildSubnetTree(mockedObjects.getAllParentSubnets())
        })
    });

    app.get('/persistentObject/network/-2', function (req, res) {
        res.status(200).send({
            "treeNodes": mockedObjects.buildNodeTree(mockedObjects.getAllOtherNodes())
        })
    });

    app.get('/persistentObject/network/:poId', function (req, res) {
        res.status(200).send({
            treeNodes: mockedObjects.getSubnetTreeByPoId(req.params.poId)
        });
    });

    app.post('/persistentObject/network/poids', function (req, res) {
        var nodeItems = [];
        mockedObjects.getAllSubnetsAndNodes().forEach(function (node) {
            if (req.body.poids.indexOf(node.poId) !== -1) {
                nodeItems.push(node);
            }
        });
        res.status(200).send({
            "treeNodes": mockedObjects.buildNodeTree(nodeItems)
        });
    });

    // TODO This should be programmed in a generic way
    app.get('/persistentObject/fdn/:fdn', function (req, res) {
        var response = mockedObjects.getAllPersistentObjects();
        res.status(200).send(response[req.params.fdn]);
    });

    // --- Network Explorer endpoints --- //

// Mock Data is implemented only for MO types "SubNetwork", "MeContext", "ENodeBFunction" in search tab
    app.get('/managedObjects/search(/v[2-9])?', function (req, res) {
        var objectList = mockedObjects.getQueryObjects(req.query.query);
        var response = buildManagedObjectsQueryResponse(objectList);
        res.status(200).send(response);
    });



// Mock Data is implemented only for MO types "SubNetwork", "MeContext", "ENodeBFunction" in savedsearches tab
    app.get('/managedObjects/query', function (req, res) {
        // Get a list of query objects to get their PoIDs
        var savedSearchObjects = mockedObjects.getQueryObjects(req.query.searchQuery);
        // Find the query results within ManagedObjects
        var allMangedObjects = mockedObjects.getAllManagedObjects();
        var queryResultOfManagedObjects = savedSearchObjects.map(function (savedSearchObject) {
            if (allMangedObjects[savedSearchObject.poId] !== undefined) {
                return allMangedObjects[savedSearchObject.poId];
            } else {
                throw new Error("Mocked server configuration error: An object with poId '" + savedSearchObject.poId + "' was expected to exist within ManagedObject.js.");
            }
        });
        res.status(200).send(queryResultOfManagedObjects);
    });

    app.get('/managedObjects/query?searchQuery=networkelement', function (req, res) {
        var queryResult = [
            {"id":"246000","poId":"246000","moType":"NetworkElement","mibRootName":"LTE04dg2ERBS00001","parentRDN":null,"moName":"LTE04dg2ERBS00001","fullMoType":"NetworkElement","attributes":{"neType":"RadioNode"},"radioAccessTechnology":null,"managementState":null},
            {"id":"246015","poId":"246015","moType":"NetworkElement","mibRootName":"LTE04dg2ERBS00002","parentRDN":null,"moName":"LTE04dg2ERBS00002","fullMoType":"NetworkElement","attributes":{"neType":"RadioNode"},"radioAccessTechnology":null,"managementState":null},
            {"id":"246030","poId":"246030","moType":"NetworkElement","mibRootName":"LTE04dg2ERBS00003","parentRDN":null,"moName":"LTE04dg2ERBS00003","fullMoType":"NetworkElement","attributes":{"neType":"RadioNode"},"radioAccessTechnology":null,"managementState":null},
            {"id":"246045","poId":"246045","moType":"NetworkElement","mibRootName":"LTE04dg2ERBS00004","parentRDN":null,"moName":"LTE04dg2ERBS00004","fullMoType":"NetworkElement","attributes":{"neType":"RadioNode"},"radioAccessTechnology":null,"managementState":null},
            {"id":"246060","poId":"246060","moType":"NetworkElement","mibRootName":"LTE04dg2ERBS00005","parentRDN":null,"moName":"LTE04dg2ERBS00005","fullMoType":"NetworkElement","attributes":{"neType":"RadioNode"},"radioAccessTechnology":null,"managementState":null}];
        res.status(200).send(queryResult);
    });

    app.post('/object-configuration/collections/v3/search', function (req, res) {
        res.status(200).send({
            "requestId": "abababab-0101-2323-4545-cdcdcdcdcdcd",
            "requestTime": '"' + new Date().getTime() + '"'
        });
    });

    app.get('/object-configuration/collections/v3/search/abababab-0101-2323-4545-cdcdcdcdcdcd', function (req, res) {
        res.status(200).send(mockedObjects.getCollections())
    });

    app.post('/object-configuration/collections/search/v4', function (req, res) {
        res.status(200).send([
            {
                "id": "279328",
                "name": "emptyCol",
                "owner": "administrator",
                "sharing": "Public",
                "isRemove": false,
                "moveFlag": false,
                "uniqueFlag": false,
                "type": "LEAF",
                "timeCreated": 1693290159139,
                "timeUpdated": 1693290159142,
                "lastRefreshTime": 1693290159141,
                "userPermissions": {
                    "deletable": true,
                    "updateable": true
                },
                "remove": false
            },
            {
                "id": "274379",
                "name": "networkelement_all",
                "owner": "administrator",
                "sharing": "Private",
                "isRemove": false,
                "moveFlag": false,
                "uniqueFlag": false,
                "type": "LEAF",
                "timeCreated": 1692887325634,
                "timeUpdated": 1692887498739,
                "lastRefreshTime": 1692887498736,
                "userPermissions": {
                    "deletable": true,
                    "updateable": true
                },
                "remove": false
            }
            ]);
    });

    app.get('/object-configuration/collections/v4', function (req, res) {
        res.status(200).send(mockedObjects.getCollections())
    });

    app.get('/object-configuration/collections/v4/:collectionId', function (req, res) {
        var objects = mockedObjects.getCollectionObjects();
        res.status(200).send(objects[req.params.collectionId])
    });

    app.get('/topologyCollections/savedSearches', function (req, res) {
        res.status(200).send(mockedObjects.getSavedSearches())
    });

    app.get('/topologyCollections/savedSearches/:savedSearchId', function (req, res) {
        var objects = mockedObjects.getSavedSearchObjects();
        res.status(200).send(objects)
    });

// Helper administration endpoint
    app.get('/editprofile', function (req, res) {
        res.status(200).send({"username": "NPAM_Administrator"});
    });

    app.get('/oss/idm/usermanagement/users/NPAM_Administrator/privileges', function (req, res) {
        res.status(200).send({"user": "NPAM_Administrator"});
    });

// System Time
    app.get('/rest/system/time', function (req, res) {
        var date = new Date();
        var myDate = {};
        myDate.timestamp = date.getTime();
        myDate.utcOffset = 0 - (date.getTimezoneOffset() / 60);
        var splittedDate = date.toTimeString().split(' ');
        myDate.timezone = splittedDate[1];
        myDate.serverLocation = Intl.DateTimeFormat().resolvedOptions().timeZone;
        console.log(myDate);
        //res.status(200).send({"timestamp":1679501613248,"utcOffset":0.0,"timezone":"GMT","serverLocation":"Europe/Dublin"});
        res.status(200).send(myDate);
    });

    app.get('/rest/ui/settings/networkexplorer/favorites', function (req, res) {
        res.status(200).send([]);
    });

    app.get('/rest/ui/settings/neAccount/tableSettings', function (req, res) {
        var response = [
                           {
                               "id": "neAccountTable",
                               "value": "{\"status\":{\"visible\":true,\"order\":1,\"pinned\":true},\"errorDetails\":{\"visible\":true,\"order\":2,\"pinned\":true},\"lastUpdate\":{\"visible\":true,\"order\":3,\"pinned\":true},\"neName\":{\"visible\":true,\"order\":4,\"pinned\":true},\"cbrsStatus\":{\"visible\":true,\"order\":5,\"pinned\":false},\"cbrsErrorDetails\":{\"visible\":false,\"order\":6,\"pinned\":false}}",
                               "created": 1690815590363,
                               "lastUpdated": 1691482513715
                           }
                       ];
        res.status(200).send(response);
    });

// internal endpoint for groovy tests
    app.put('/editNpamCapabilities', function (req, res) {
        console.log("Set capabilities:  " + JSON.stringify(req.body) );
        customNpamCapabilities = req.body
        res.status(200).send("New capabilities saved");
    });

    app.get('/oss/uiaccesscontrol/resources', function (req, res) {
        var response =  customNpamCapabilities;
        if ( !response.length ) {
            response = accessRights.getDefaultAccessRightsForNpam;
            console.log("getDefaultAccessRightsForNpam " + JSON.stringify(response) );
        }
        Array.prototype.push.apply(response,accessRights.getAccessRightsForScopingPanel);
        res.status(200).send(response);
    });

    // the body contains status and internalErrorCode
    app.put('/setHttpError', function (req, res) {
        console.log("Set httpErrors:  " + JSON.stringify(req.body) );
        httpStatus = req.body.status;
        if ( httpStatus !== 200 ) {
            httpJsonError = {"userMessage":"usermessage",
                             "internalErrorCode":req.body.internalErrorCode,
                             "errorDetails":"errorDetails"};
            res.status(200).send("httpErrors saved");
         }  else {
            res.status(200).send("httpErrors cleared");
        }
    });

// --- Access Control --- //
    app.get('/oss/uiaccesscontrol/resources/user_mgmt/actions', function (req, res) {
        res.status(200).send("{\"resource\":\"user_mgmt\",\"actions\":[\"create\",\"delete\",\"read\",\"update\"]}");
    });

    app.get("/oss/uiaccesscontrol/resources/neaccount_job/actions",function(req, res){
        res.send({"resource":"neaccount_job","actions":["read","create"]});
    });

    app.get('/oss/uiaccesscontrol/resources/persistentobjectservice/actions', function (req, res) {
        res.status(200).send("{\"resource\":\"persistentobjectservice\",\"actions\":[\"read\"]}");
    });

    app.get('/oss/uiaccesscontrol/resources/topologySearchService/actions', function (req, res) {
        res.status(200).send("{\"resource\":\"topologySearchService\",\"actions\":[\"read\"]}");
    });

    app.get('/oss/uiaccesscontrol/resources/Collections_Public/actions', function (req, res) {
        res.status(200).send("{\"resource\":\"Collections_Public\",\"actions\":[\"create\",\"delete\",\"read\",\"update\"]}");
    });

    app.get('/oss/uiaccesscontrol/resources/Collections_Private/actions', function (req, res) {
        res.status(200).send("{\"resource\":\"Collections_Private\",\"actions\":[\"create\",\"delete\",\"read\",\"update\"]}");
    });

    app.get('/oss/uiaccesscontrol/resources/CollectionsOthers_Public/actions', function (req, res) {
        res.status(200).send("{\"resource\":\"CollectionsOthers_Public\",\"actions\":[\"create\",\"delete\",\"read\",\"update\"]}");
    });

    app.get('/oss/uiaccesscontrol/resources/SavedSearch_Public/actions', function (req, res) {
        res.status(200).send("{\"resource\":\"SavedSearch_Public\",\"actions\":[\"read\",\"update\",\"delete\"]}");
    });

    app.get('/oss/uiaccesscontrol/resources/SavedSearch_Private/actions', function (req, res) {
        res.status(200).send("{\"resource\":\"SavedSearch_Private\",\"actions\":[\"read\",\"update\",\"delete\"]}");
    });

    app.get('/oss/uiaccesscontrol/resources/SavedSearchOthers_Public/actions', function (req, res) {
        res.status(200).send("{\"resource\":\"SavedSearchOthers_Public\",\"actions\":[\"read\",\"update\",\"delete\"]}");
    });

// neaccount endpoints
    app.get('/npamservice/v1/npamconfigstatus', function (req, res) {
         res.status(200).send([
             {"name":"npam", "value":"enabled"},
             {"name":"cbrs", "value":"enabled"}
         ]);
     });

    app.post('/npamservice/v1/neaccount', function (req, res) {
        if ( httpStatus === 200 ) {
            if ( req.body.selectedNEs.neNames.includes("all")) {
                res.status(200).send(neAccounts.get25000NEAccounts());
            } else if ( req.body.selectedNEs.collectionNames.length !== 0) {
                res.status(200).send(neAccounts.getNEAccountsInCollection(req.body.selectedNEs.collectionNames));
            } else if ( req.body.selectedNEs.savedSearchIds.length !== 0) {
                res.status(200).send(neAccounts.getNEAccountsInSavedSearch(req.body.selectedNEs.savedSearchIds));
            } else {
                res.status(200).send(neAccounts.getAllStatusNEAccounts(req.body.selectedNEs.neNames));
            }
        } else {
            res.status(httpStatus).send(httpJsonError);
        }
    });

    app.get('/npamservice/v1/neaccount/details/:neName', function (req, res) {
        if ( httpStatus === 200 ) {
            console.log("QUERY id=" + req.query.id);
            var resp =  [{"neName": req.params.neName, "currentUser": req.params.neName, "id":"1",
                          "status":"IN_PROGRESS", "errorDetails":"NE not in synch", "lastUpdate":"2022-11-30",
                          "ipAddress":"0.0.0.0", "currentPswd":"5VS.S3[<GLH6"}]
            if ( req.params.neName === "RN_Node_9" ) {
                resp.push({"neName": req.params.neName, "currentUser": "", "id":"2",
                           "status":"IN_PROGRESS", "errorDetails":"CBRS details", "lastUpdate":"2022-12-30",
                           "ipAddress":"0.0.0.0", "currentPswd":""});
            }
            res.status(200).send(resp);
        } else {
            res.status(httpStatus).send(httpJsonError);
        }
    });


    app.post('/npamservice/v1/neaccount/export', function(req, res) {
        if ( httpStatus === 200 ) {
            console.log("Export Query id=" + req.query.id);
            res.header('content-type', 'application/octet-stream');
            if (!req.body.encryptionKey) {
                res.header('content-disposition', 'attachment; filename="exportNeAccounts.csv"');
                res.status(200).send(exportedNEAccounts);
            } else {
                res.header('content-disposition', 'attachment; filename="exportNeAccounts.enc"');
                res.status(200).send(exportedNEAccounts);
            }
            res.status(200).send(exportedNEAccounts);
        } else {
            res.status(httpStatus).send(httpJsonError);
        }
    });

   /* JOBS mocks */
    app.get('/npamservice/v1/job/list/:jobName', function (req, res) {
        if ( httpStatus === 200 ) {
           var jobsToReturn = jobs.getJobs(req.params.jobName);
           console.log(jobsToReturn);
           if (!jobsToReturn || jobsToReturn.length === 0) {
               res.send(404, JSON.stringify({"userMessage":{"title":"Object Not Found","body":"Job does not exist."},"internalErrorCode":10007}));
           } else {
               res.status(200).send(jobsToReturn);
           }
        } else {
            res.status(httpStatus).send(httpJsonError);
        }
    });

    app.post('/npamservice/v1/job/create', function (req, res) {
        if ( httpStatus === 200 ) {
            var startDate = new Date();
            if (req.body.mainSchedule.execMode === "SCHEDULED") {
                var startDateAttr = req.body.mainSchedule.scheduleAttributes.find(function(attr) { return (attr.name === "START_DATE");});
                startDate = startDateAttr.value;
            }
            jobs.addJob(req.body.name, startDate, req.body.jobType);
            res.status(200).send({"name": req.body.name});
        } else {
            res.status(httpStatus).send(httpJsonError);
        }
    });

    app.get('/npamservice/v1/job/list', function (req, res) {
        if ( httpStatus === 200 ) {
            res.send(200, JSON.stringify(jobs.getDefaultJobs()));
        } else {
            res.status(httpStatus).send(httpJsonError);
        }
    });

    var jobDetailsResp = {"name":"jobEnable","description":"","jobType":"CREATE_NE_ACCOUNT","jobProperties":[],
                          "selectedNEs":{"collectionNames":[],"neNames":["LTE11dg2ERBS00001"],"savedSearchIds":[]},
                          "mainSchedule":{"execMode":"IMMEDIATE","scheduleAttributes":[],"periodic":false,"wrongNonPeriodic":false,"wrongImmediate":false},
                          "owner":"administrator"};

    app.get('/npamservice/v1/job/configuration/:jobname', function (req, res) {
        if ( httpStatus === 200 ) {
            res.send(200, JSON.stringify(jobDetailsResp));
        } else {
            res.status(httpStatus).send(httpJsonError);
        }
    });

    app.post('/npamservice/v1/job/cancel/:jobName', function (req, res) {
        if ( httpStatus === 200 ) {
            if (jobs.cancelJob(req.param.jobName)) {
               res.status(200).send( req.params.neName + " correctly deleted." );
            } else {
               res.status(422).send(httpJsonError);
            }
        } else {
            res.status(httpStatus).send(httpJsonError);
        }
    });

    var jobNeDetailsRespEl = {"neName":"LTE11dg2ERBS0","state":"COMPLETED","startTime":"2023-04-13 09:07:38+0000",
                             "endTime":"2023-04-13 09:07:48+0000","result":"SUCCESS","errorDetails":""};

    app.get('/npamservice/v1/job/nedetails/:jobInstanceId', function (req, res) {
        var jobNeDetailsResp = [];

        for (  i = 0; i < 1000; i++ ) {
            var el = {};

           el.neName = "LTE11dg2ERBS0" + i.toString().padStart(4, "0");
           el.state = "COMPLETED";
           el.startTime = "2023-04-13 09:07:38+0000";
           el.endTime = "2023-04-13 09:07:38+0000";
           el.result = "SUCCESS";
           el.errorDetails = "";

           jobNeDetailsResp.push(el);
        }

        if ( httpStatus === 200 ) {
            res.send(200, JSON.stringify(jobNeDetailsResp));
        } else {
            res.status(httpStatus).send(httpJsonError);
        }

    });

    app.post('/npamservice/v1/job/import/file', function(req, res) {
        res.status(200).send({result:"File alice.csv correctly imported."});
    });

    app.get('/npamservice/v1/job/import/filelist', function(req, res) {
        var fileList = [];
        fileList.push("alice.csv");
        fileList.push("peter.csv");
        res.status(200).send(fileList);
    });



   /* CREATE JOBS mocks */
//   var staticCollections = require('./test/resources/restMock/data/staticCollections');
//   var savedSearches = require('./test/resources/restMock/data/savedSearches');
//   var staticCollectionsArray = [];
//   staticCollectionsArray.push(require('./test/resources/restMock/data/staticCollections/collection1'));
//   staticCollectionsArray.push(require('./test/resources/restMock/data/staticCollections/collection2'));
//   staticCollectionsArray.push(require('./test/resources/restMock/data/staticCollections/collection3'));
//   staticCollectionsArray.push(require('./test/resources/restMock/data/staticCollections/collection4'));
//   staticCollectionsArray.push(require('./test/resources/restMock/data/staticCollections/collection5'));
//   staticCollectionsArray.push(require('./test/resources/restMock/data/staticCollections/collection6'));
//   staticCollectionsArray.push(require('./test/resources/restMock/data/staticCollections/collection7'));
//   staticCollectionsArray.push(require('./test/resources/restMock/data/staticCollections/collection8'));
//   var savedSearchesArray = [];
//   savedSearchesArray.push(require('./test/resources/restMock/data/savedSearches/savedSearch1'));
//   savedSearchesArray.push(require('./test/resources/restMock/data/savedSearches/savedSearch2'));
//   savedSearchesArray.push(require('./test/resources/restMock/data/savedSearches/savedSearch3'));
//   savedSearchesArray.push(require('./test/resources/restMock/data/savedSearches/savedSearch4'));
//   savedSearchesArray.push(require('./test/resources/restMock/data/savedSearches/savedSearch5'));
//   savedSearchesArray.push(require('./test/resources/restMock/data/savedSearches/savedSearch6'));
//   savedSearchesArray.push(require('./test/resources/restMock/data/savedSearches/savedSearch7'));
//   savedSearchesArray.push(require('./test/resources/restMock/data/savedSearches/savedSearch8'));

//   var fdnSearchArray = [];
//   fdnSearchArray.push(require('./test/resources/restMock/data/MeContext=ERBS1'));
//   var typeSearchArray = [];
//   typeSearchArray.push(require('./test/resources/restMock/data/type_MeContext'));
//   typeSearchArray.push(require('./test/resources/restMock/data/type_ManagedElement'));
//   var errorInTypeSearchArray = [];
//   errorInTypeSearchArray.push({
//       type: 'MkvContext',
//       json: require('./test/resources/restMock/data/type_MkvContext')
//   });
//   typeSearchArray.push(require('./test/resources/restMock/data/type_ManagedElement'));

//   module.exports = function(app) {

//       function createCollection(postData, poId) {
//           var newCollection = {
//               "details": {
//                   "poId": poId,
//                   "type": "Collection",
//                   "namespace": "OSS_TOP",
//                   "namespaceVersion": "1.0.1",
//                   "attributes": {
//                       "category": "ToplogyCollection",
//                       "userId": "testuser",
//                       "name": postData.name,
//                       "moList": postData.moList,
//                       "timeCreated": "1383216271628",
//                       "entityAddressPoId": null
//                   }
//               },
//               "poList": []
//           };
//           postData.moList.forEach(function (poId) {
//               newCollection.poList.push({
//                   "poId": poId,
//                   "version": null,
//                   "namespace": null,
//                   "type": "EUtranCellFDD",
//                   "attributes": {
//                       "physicalLayerSubCellId": 0,
//                       "earfcnul": 20175,
//                       "cellId": 23,
//                       "physicalLayerCellIdGroup": 161,
//                       "earfcndl": 2175
//                   },
//                   "fdn": "MeContext=ERBS1,ManagedElement=1,ENodeBFunction=1,EUtranCellFDD=Cell11",
//                   "name": "Cell11",
//                   "children": [],
//                   "level": 3,
//                   "associations": {},
//                   "entityAddressInfo": null,
//                   "parent": null
//               });
//           });
//       }

//       app.get("/topologyCollections/savedSearches/:collectionId", function(req, res) {
//           var collectionId = req.params.collectionId;
//           for(var i = 0; i < savedSearchNameAndType.length; i++) {
//               var managedElementCollection = savedSearchNameAndType[i];
//               if(managedElementCollection[collectionId] !== undefined) {
//                   res.send(managedElementCollection[collectionId]);
//                   break;
//               }
//           }
//           res.send(404, JSON.stringify({"userMessage":{"title":"Object Not Found","body":"Collection does not exist."},"internalErrorCode":10007}));
//   //        res.send(500, JSON.stringify({"userMessage":{"title":"Unknown Exception","body":"An unknown server error has occurred. Please check your input or try again later."},"internalErrorCode":0}));
//       });


//       app.get('/topologyCollections/savedSearches', function (req, res) {
//           setTimeout(function () {
//               res.set('Content-Type', 'application/json');
//               res.send(JSON.stringify(savedSearches));
//           }, Math.floor(Math.random() * 2000) + 300);
//       });

       app.post('/topologyCollections/savedSearches', function (req, res) {
           setTimeout(function () {
               res.send(201, '' + Math.floor(Math.random() * 1000000000000) + 1);
           }, Math.floor(Math.random() * 2000) + 300);
       });

//       savedSearchesArray.forEach(function(savedSearch) {
//           app.get('/topologyCollections/savedSearches/' + savedSearch.poId, function (req, res) {
//               res.set('Content-Type', 'application/json');
//               res.send(JSON.stringify(savedSearch));
//           });
//       });

//       fdnSearchArray.forEach(function(moList) {
//           app.get('/managedObjects/' + moList[0].fdn, function (req, res) {
//               res.set('Content-Type', 'application/json');
//               res.send(JSON.stringify(moList));
//           });
//       });

//       errorInTypeSearchArray.forEach(function(moList) {
//           app.get('/managedObjects/types/' + moList.type, function (req, res) {
//               res.set('Content-Type', 'application/json');
//               res.send(500, JSON.stringify(moList.json));
//           })
//       });


//       var savedSearchNameAndType = [
//           {
//               "281474977177259" : {"type":"SavedSearch","poId":"281474977177259","name":"Nodes","searchQuery":"nodes","attributes":{"category":"Public","name":"Nodes","userId":"administrator","searchQuery":"nodes","timeCreated":"1440769431529"},"deletable":false}
//           }
//       ];

//       var searchQuery = [{"moName":"SGSN-15B-NE01","moType":"NetworkElement","poId":"281474988247732","mibRootName":"SGSN-15B-NE01"
//           ,"parentRDN":"","attributes":{}},{"moName":"TEST11","moType":"NetworkElement","poId":"281474976810801"
//           ,"mibRootName":"TEST11","parentRDN":"","attributes":{}},{"moName":"SGSN-15B-NE02","moType":"NetworkElement"
//           ,"poId":"281474988244065","mibRootName":"SGSN-15B-NE02","parentRDN":"","attributes":{}},{"moName":"SGSN-15B-NE04"
//           ,"moType":"NetworkElement","poId":"281474976810621","mibRootName":"SGSN-15B-NE04","parentRDN":"","attributes"
//               :{}},{"moName":"SGSN-15B-NE53","moType":"NetworkElement","poId":"281474977254988","mibRootName":"SGSN-15B-NE53"
//           ,"parentRDN":"","attributes":{}},{"moName":"TEST12","moType":"NetworkElement","poId":"281474987501762"
//           ,"mibRootName":"TEST12","parentRDN":"","attributes":{}},{"moName":"SGSN-15B-NE52","moType":"NetworkElement"
//           ,"poId":"281474976810538","mibRootName":"SGSN-15B-NE52","parentRDN":"","attributes":{}}];

//       var moMap = [
//           {
//               "MeContext=LTE17_ERBS00001":[{"moName":"LTE17_ERBS00001","moType":"MeContext","poId":"281474976734219","mibRootName":null,"parentRDN":null,"attributes":{"MeContextId":"MERBS04","lostSynchronization":"SYNC_ON_DEMAND","neType":"ENODEB","generationCounter":"2","userLabel":null,"mirrorSynchronizationStatus":"SYNCHRONIZED"}}]
//           },
//           {
//               "MeContext=LTE17_ERBS00002":[{"moName":"LTE17_ERBS00002","moType":"MeContext","poId":"281474976734223","mibRootName":null,"parentRDN":null,"attributes":{"MeContextId":"MERBS04","lostSynchronization":"SYNC_ON_DEMAND","neType":"ENODEB","generationCounter":"2","userLabel":null,"mirrorSynchronizationStatus":"SYNCHRONIZED"}}]
//           },
//           {
//               "MeContext=LTE17_ERBS00003":[{"moName":"LTE17_ERBS00003","moType":"MeContext","poId":"281474976734227","mibRootName":null,"parentRDN":null,"attributes":{"MeContextId":"MERBS04","lostSynchronization":"SYNC_ON_DEMAND","neType":"ENODEB","generationCounter":"2","userLabel":null,"mirrorSynchronizationStatus":"SYNCHRONIZED"}}]
//           },
//           {
//               "MeContext=LTE17_ERBS00004":[{"moName":"LTE17_ERBS00004","moType":"MeContext","poId":"281474976734231","mibRootName":null,"parentRDN":null,"attributes":{"MeContextId":"MERBS04","lostSynchronization":"SYNC_ON_DEMAND","neType":"ENODEB","generationCounter":"2","userLabel":null,"mirrorSynchronizationStatus":"SYNCHRONIZED"}}]
//           },
//           {
//               "MeContext=LTE17_ERBS00005":[{"moName":"LTE17_ERBS00005","moType":"MeContext","poId":"281474976734235","mibRootName":null,"parentRDN":null,"attributes":{"MeContextId":"MERBS04","lostSynchronization":"SYNC_ON_DEMAND","neType":"ENODEB","generationCounter":"2","userLabel":null,"mirrorSynchronizationStatus":"SYNCHRONIZED"}}]
//           }
//       ];

//       app.get("/managedObjects/:fdn", function(req, res) {
//
//           var fdn = req.params.fdn;
//           for(var i = 0; i < moMap.length; i++) {
//               var moCollection = moMap[i];
//               if(moCollection[fdn] !== undefined) {
//                   res.send(moCollection[fdn]);
//                   break;
//               }
//           }
//           res.send("error");
//       });



    //TODO inizio mock da verificare
    app.post('/persistentObject/rootAssociations', function (req, res) {
        var rootAssociations = [];
        if (req.body.poList.length == 5) { // Collections
            rootAssociations = [
            {"name":"LTE04dg2ERBS00002","type":"NetworkElement","poId":246015,"id":"246015","fdn":"NetworkElement=LTE04dg2ERBS00002","namespace":null,"namespaceVersion":null,"neType":null,"neVersion":null,"attributes":null,"networkDetails":null,"writeSupported":false},
            {"name":"LTE04dg2ERBS00001","type":"NetworkElement","poId":246000,"id":"246000","fdn":"NetworkElement=LTE04dg2ERBS00001","namespace":null,"namespaceVersion":null,"neType":null,"neVersion":null,"attributes":null,"networkDetails":null,"writeSupported":false},
            {"name":"LTE04dg2ERBS00003","type":"NetworkElement","poId":246030,"id":"246030","fdn":"NetworkElement=LTE04dg2ERBS00003","namespace":null,"namespaceVersion":null,"neType":null,"neVersion":null,"attributes":null,"networkDetails":null,"writeSupported":false},
            {"name":"LTE04dg2ERBS00004","type":"NetworkElement","poId":246045,"id":"246045","fdn":"NetworkElement=LTE04dg2ERBS00004","namespace":null,"namespaceVersion":null,"neType":null,"neVersion":null,"attributes":null,"networkDetails":null,"writeSupported":false},
            {"name":"LTE04dg2ERBS00005","type":"NetworkElement","poId":246060,"id":"246060","fdn":"NetworkElement=LTE04dg2ERBS00005","namespace":null,"namespaceVersion":null,"neType":null,"neVersion":null,"attributes":null,"networkDetails":null,"writeSupported":false}];
        } else {    // SavedSearches
            rootAssociations = [
                {"name":"LTE04dg2ERBS00002","type":"NetworkElement","poId":246015,"id":"246015","fdn":"NetworkElement=LTE04dg2ERBS00002","namespace":null,"namespaceVersion":null,"neType":null,"neVersion":null,"attributes":null,"networkDetails":null,"writeSupported":false},
                {"name":"LTE04dg2ERBS00001","type":"NetworkElement","poId":246000,"id":"246000","fdn":"NetworkElement=LTE04dg2ERBS00001","namespace":null,"namespaceVersion":null,"neType":null,"neVersion":null,"attributes":null,"networkDetails":null,"writeSupported":false},
                {"name":"LTE04dg2ERBS00003","type":"NetworkElement","poId":246030,"id":"246030","fdn":"NetworkElement=LTE04dg2ERBS00003","namespace":null,"namespaceVersion":null,"neType":null,"neVersion":null,"attributes":null,"networkDetails":null,"writeSupported":false}];
        }

/*var rootAssociations = [];
        console.log("dentro rootAssociations" );
        var posData = mockedObjects.getAllManagedObjects();

        req.body.poList.forEach(function (poId) {
            console.log("poID = " + poId );
            for (var resPoId in posData) {
                if (resPoId === poId) {
                    console.log("poID name = " + posData[resPoId].mibRootName );
                    rootAssociations.push({ "name":posData[resPoId].mibRootName,
                                            "type":"NetworkElement",
                                            "poId":resPoId,
                                            "id":resPoId,
                                            "fdn":"NetworkElement="+posData[resPoId].mibRootName,
                                            "namespace":null,
                                            "namespaceVersion":null,
                                            "neType": null,
                                            "neVersion": null,
                                            "attributes": null,
                                            "networkDetails": null,
                                            "writeSupported": false
                                        });
                    break;
                }
               }
           });*/
            res.setHeader("content-type", "application/json");
            res.status(200).send(rootAssociations);
       });

       app.post('/managedObjects/getPosByPoIds', function (req, res) {
           if (req.body.poList.length > 0 && req.body.poList[0] === "246015") {   // Collections and SavedSearches cases
               var tempList = [];
               if (req.body.poList.length === 3) {  // collections
                   tempList = [
                       {
                           "id": "246015",
                           "moName": "LTE04dg2ERBS00002",
                           "moType": "NetworkElement",
                           "poId": "246015",
                           "mibRootName": "LTE04dg2ERBS00002",
                           "parentRDN": "",
                           "fullMoType": "NetworkElement",
                           "cmSyncStatus": "SYNCHRONIZED",
                           "managementState": null,
                           "radioAccessTechnology": null,
                           "attributes": {"platformType": null, "neType": "RadioNode"},
                           "fdn": "NetworkElement=LTE04dg2ERBS00002",
                           "ossModelIdentity": null,
                           "parentNeType": null,
                           "cnfType": null
                       },{
                           "id": "246000",
                           "moName": "LTE04dg2ERBS00001",
                           "moType": "NetworkElement",
                           "poId": "246000",
                           "mibRootName": "LTE04dg2ERBS00001",
                           "parentRDN": "",
                           "fullMoType": "NetworkElement",
                           "cmSyncStatus": "SYNCHRONIZED",
                           "managementState": null,
                           "radioAccessTechnology": null,
                           "attributes": {"platformType": null, "neType": "RadioNode"},
                           "fdn": "NetworkElement=LTE04dg2ERBS00001",
                           "ossModelIdentity": null,
                           "parentNeType": null,
                           "cnfType": null
                       },{
                           "id": "246030",
                           "moName": "LTE04dg2ERBS00003",
                           "moType": "NetworkElement",
                           "poId": "246030",
                           "mibRootName": "LTE04dg2ERBS00003",
                           "parentRDN": "",
                           "fullMoType": "NetworkElement",
                           "cmSyncStatus": "SYNCHRONIZED",
                           "managementState": null,
                           "radioAccessTechnology": null,
                           "attributes": {"platformType": null, "neType": "RadioNode"},
                           "fdn": "NetworkElement=LTE04dg2ERBS00003",
                           "ossModelIdentity": null,
                           "parentNeType": null,
                           "cnfType": null
                       },{
                           "id": "246045",
                           "moName": "LTE04dg2ERBS00004",
                           "moType": "NetworkElement",
                           "poId": "246045",
                           "mibRootName": "LTE04dg2ERBS00004",
                           "parentRDN": "",
                           "fullMoType": "NetworkElement",
                           "cmSyncStatus": "SYNCHRONIZED",
                           "managementState": null,
                           "radioAccessTechnology": null,
                           "attributes": {"platformType": null, "neType": "RadioNode"},
                           "fdn": "NetworkElement=LTE04dg2ERBS00004",
                           "ossModelIdentity": null,
                           "parentNeType": null,
                           "cnfType": null
                       },{
                           "id": "246060",
                           "moName": "LTE04dg2ERBS00005",
                           "moType": "NetworkElement",
                           "poId": "246060",
                           "mibRootName": "LTE04dg2ERBS00005",
                           "parentRDN": "",
                           "fullMoType": "NetworkElement",
                           "cmSyncStatus": "SYNCHRONIZED",
                           "managementState": null,
                           "radioAccessTechnology": null,
                           "attributes": {"platformType": null, "neType": "RadioNode"},
                           "fdn": "NetworkElement=LTE04dg2ERBS00005",
                           "ossModelIdentity": null,
                           "parentNeType": null,
                           "cnfType": null
                       }];
               } else { // savedSearches
                   tempList = [
                       {
                           "id": "246000",
                           "moName": "LTE04dg2ERBS00001",
                           "moType": "NetworkElement",
                           "poId": "246000",
                           "mibRootName": "LTE04dg2ERBS00001",
                           "parentRDN": "",
                           "fullMoType": "NetworkElement",
                           "cmSyncStatus": "SYNCHRONIZED",
                           "managementState": null,
                           "radioAccessTechnology": null,
                           "attributes": {"platformType": null, "neType": "RadioNode"},
                           "fdn": "NetworkElement=LTE04dg2ERBS00001",
                           "ossModelIdentity": null,
                           "parentNeType": null,
                           "cnfType": null
                       },
                       {
                           "id": "246030",
                           "moName": "LTE04dg2ERBS00003",
                           "moType": "NetworkElement",
                           "poId": "246030",
                           "mibRootName": "LTE04dg2ERBS00003",
                           "parentRDN": "",
                           "fullMoType": "NetworkElement",
                           "cmSyncStatus": "SYNCHRONIZED",
                           "managementState": null,
                           "radioAccessTechnology": null,
                           "attributes": {"platformType": null, "neType": "RadioNode"},
                           "fdn": "NetworkElement=LTE04dg2ERBS00003",
                           "ossModelIdentity": null,
                           "parentNeType": null,
                           "cnfType": null
                       }];
               }
               res.status(200).send(tempList);
           } else { // Others
               var posData = mockedObjects.getAllManagedObjects();
               var tempList = [];
               req.body.poList.forEach(function (poId) {
                   for (var resPoId in posData) {
                       if (resPoId === poId) {
                           // Add moName, moType, fullMoType and cmSyncStatus
                           posData[resPoId].moName = posData[resPoId].mibRootName;
                           posData[resPoId].moType = "NetworkElement";
                           posData[resPoId].fullMoType = "NetworkElement";
                           posData[resPoId].cmSyncStatus = "SYNCHRONIZED";
                           tempList.push(posData[resPoId]);
                           break;
                       }
                   }
               });
               res.status(200).send(tempList);
           }
       });
};

// --- Utility functions --- //
function buildManagedObjectsQueryResponse(managedObjects) {
    var objectsList = [];
    managedObjects.forEach(function (managedObject) {
        if ((managedObject.name !== "Unsupported_Node") && (managedObject.name !== 'NR_MultiNode')) {
            objectsList.push({
                "id": managedObject.poId,
                "type": managedObject.moType
            });
        }
    });

    var managedObjectsQueryResponse =
        {
            "objects": objectsList,
            "attributes": [],
            "attributeMappings": [],
            "metadata": {
                "SORTABLE": true,
                "RESULT_SET_TOTAL_SIZE": objectsList.length,
                "MAX_UI_CACHE_SIZE": 100000,
                "INFO_MESSAGE": 0
            }
        };

    return managedObjectsQueryResponse;
}
