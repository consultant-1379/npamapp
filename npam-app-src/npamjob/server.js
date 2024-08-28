var jobsInfo = require('./test/resources/restMock/data/jobsInfo').getJobsInfo;
var jobsInfoColumns = require('./test/resources/restMock/data/jobsInfoColumns').getJobsInfoColumns;
var fs = require("fs");

module.exports = function (app) {
    var tableSettings = [];
    var columnSettings = [];
    var progress = 0;
    var count = 0;
    var jobscallCount = 0;
    // Work around to add javascript libraries known as pollyfill libraries
        // which are required for testing against phantomJS
        // If statement is a pollyfill workaround for Object.assign error until UI SDK is introducing fix

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

    app.post('/oss/shm/rest/job/jobs', function (req, res) {
        // remove cache to always get latest changes in the file
          delete require.cache[require.resolve('./test/resources/jobsResponse.json')];
          var jobsResponse = require('./test/resources/jobsResponse.json');
          res.status(200).send(jobsResponse);
    });

    app.post('/oss/shm/rest/job/v2/jobs', function (req, res) {
        var limit = req.body.limit;
        var offset = req.body.offset;
        var jobsResponse;
        if(limit !=50 && offset == 1){
            delete require.cache[require.resolve('./test/resources/jobsResponseV1.json')];
            jobsResponse = require('./test/resources/jobsResponseV1.json');
        }else if(offset == 11){
            delete require.cache[require.resolve('./test/resources/jobsResponseV3.json')];
            jobsResponse = require('./test/resources/jobsResponseV3.json');
        }else{
            delete require.cache[require.resolve('./test/resources/jobsResponseV2.json')];
            jobsResponse = require('./test/resources/jobsResponseV2.json');             
        }
        res.status(200).send(jobsResponse);      
    });

    app.get("/oss/shm/rest/rbac/deletejob", function (req, res) {
        res.send(200, "grant");
        //res.send(200, "grant");
    });

    app.get("/oss/shm/rest/rbac/viewjobs", function (req, res) {
        //res.send(403, "error");
        res.send(200, "grant");
    });

    app.get("/oss/shm/rest/rbac/canceljob", function (req, res) {
        //res.send(403, "error");
        res.send(200, "grant");
    });

    app.get("/oss/shm/rest/rbac/jobs/continue", function (req, res) {
        //res.send(403, "error");
        res.send(200, "grant");
    });

    app.get("/oss/shm/rest/rbac/createjob", function (req, res) {
        res.send(200, 'grant');
    });

    app.post("/oss/shm/rest/job/comment", function (req, res) {
        var response = Object.create(Object.prototype);
        var responseDate = new Date().toLocaleString();
        response = {"userName":"administrator","date":"1452267571718","comment":req.body.comment};
        if(!jobComments[req.body.jobId]) {
            jobComments[req.body.jobId] = [];
        } 
        jobComments[req.body.jobId].push(response);        
        res.send(response);
    });

    var count = 0;

    var jobComments = {};

    app.get("/oss/shm/rest/job/jobComments", function (req, res) {
        var response = Object.create(Object.prototype);
        var responseDate = new Date().toLocaleString();
        if(jobComments[req.query.mainJobId]) {
            response = jobComments[req.query.mainJobId];
        } else {
            response = []
        }        
        setTimeout(function(){
            res.status(200).send(response);
        }, 3000);
    });

    app.get("/rest/ui/settings/shm/columnsWidth", function (req, res) {                            
        res.status(200).send(columnSettings);
    });

    app.put("/rest/ui/settings/shm/columnsWidth", function (req, res) {
        var found = false;
        columnSettings.forEach(function(item, index) {
            if(item.id === req.body.id) {
                columnSettings[index] = req.body;
                found = true;
            }
        });
        if(!found) {
            columnSettings.push(req.body);
        }
        res.send(200, "ok");
        //res.send(404, "error");
    });
    
    app.get("/rest/ui/settings/shm/tableSettings", function (req, res) {
        res.status(200).send(tableSettings);
    });

    app.put("/rest/ui/settings/shm/tableSettings", function (req, res) {
        var found = false;
        tableSettings.forEach(function(item, index) {
            if(item.id === req.body.id) {
                tableSettings[index] = req.body;
                found = true;
            }
        });
        if(!found) {
            tableSettings.push(req.body);
        }
        res.send(200, "ok");
        //res.send(404, "error");
    });

    app.get("/rest/ui/settings/jobdetails/columnsWidth", function (req, res) {
        res.status(200).send(columnSettings);
    });

    app.put("/rest/ui/settings/jobdetails/columnsWidth", function (req, res) {
        var found = false;
        columnSettings.forEach(function(item, index) {
            if(item.id === req.body.id) {
                columnSettings[index] = req.body;
                found = true;
            }
        });
        if(!found) {
            columnSettings.push(req.body);
        }
        res.send(200, "ok");
        //res.send(404, "error");
    });

      app.get("/rest/ui/settings/jobdetails/tableSettings", function (req, res) {
        res.status(200).send(tableSettings);
    });

    app.put("/rest/ui/settings/jobdetails/tableSettings", function (req, res) {
        var found = false;
        tableSettings.forEach(function(item, index) {
            if(item.id === req.body.id) {
                tableSettings[index] = req.body;
                found = true;
            }
        });
        if(!found) {
            tableSettings.push(req.body);
        }
        res.send(200, "ok");
        //res.send(404, "error");
    });


    app.get("/oss/shm/rest/job/jobconfigurationdetails/:jobId", function (req, res) {
        var responseForBackup = {
            "jobName": "BackupJob_administrator_23062016171150_Duplicate",
            "description": "1234",
            "createdOn": "1466779818000",
            "jobType": "BACKUP",
            "startTime": "1466780400000",
            "mode": "Scheduled",
            "jobParams": [
                {
                    "activityInfoList": [
                        {
                            "activityName": "createcv",
                            "scheduleType": "Immediate",
                            "order": 1,
                            "jobProperties": [
                                {
                                    "key": "CV_NAME",
                                    "value": "Backup_administrator_23062016171226"
                                },
                                {
                                    "key": "CV_IDENTITY",
                                    "value": "egopvup"
                                },
                                {
                                    "key": "CV_TYPE",
                                    "value": "TEST"
                                }
                            ]
                        },
                        {
                            "activityName": "exportcv",
                            "scheduleType": "Immediate",
                            "order": 4,
                            "jobProperties": [

                            ]
                        },
                        {
                            "activityName": "setcvasstartable",
                            "scheduleType": "Immediate",
                            "order": 2,
                            "jobProperties": [

                            ]
                        },
                        {
                            "activityName": "setcvfirstinrollbacklist",
                            "scheduleType": "Immediate",
                            "order": 3,
                            "jobProperties": [

                            ]
                        }
                    ],
                    "jobProperties": [
                        {
                            "key": "STARTABLE_CV_NAME",
                            "value": "Backup_administrator_23062016171226"
                        },
                        {
                            "key": "ROLLBACK_CV_NAME",
                            "value": "Backup_administrator_23062016171226"
                        },
                        {
                            "key": "UPLOAD_CV_NAME",
                            "value": "Backup_administrator_23062016171226"
                        }
                    ],
                    "neType": "ERBS"
                },
                {
                    "activityInfoList": [
                        {
                            "activityName": "createbackup",
                            "scheduleType": "Immediate",
                            "order": 1,
                            "scheduledTime": null,
                            "jobProperties": [
                                {
                                    "key": "BACKUP_NAME",
                                    "value": "$productnumber_$productrevision_$timestamp"
                                },
                                {
                                    "key": "BACKUP_DOMAIN_TYPE",
                                    "value": "System/Systemdata"
                                }
                            ]
                        },
                        {
                            "activityName": "uploadbackup",
                            "scheduleType": "Immediate",
                            "order": 2,
                            "scheduledTime": null,
                            "jobProperties": [

                            ]
                        }
                    ],
                    "jobProperties": [
                        {
                            "key": "GENERATE_BACKUP_NAME",
                            "value": "true"
                        }
                    ],
                    "neType": "RadioNode"
                }
            ],
            "neJobProperties": [
                {
                    "neName": "MSC05__CP01",
                    "jobProperties": [
                        {
                            "key": "HIDDEN_PARAMETERS",
                            "value": "_MM_CONFIG_FILE,_REF"
                        },
                        {
                            "key": "_MM_CONFIG_FILE",
                            "value": "bsc08a.cfg"
                        },
                        {
                            "key": "_REF",
                            "value": "RELFSW99"
                        }
                    ]
                }
            ],
            "selectedNEs": {
                "collectionNames": [
                    1688849860347916
                ],
                "networkElements": [

                ],
                "savedSearchIds": [

                ],
                "neWithComponentInfo": [
                    {
                        "selectedComponenets": [
                            "MSC-DB-BSP-01__APG1",
                            "MSC-DB-BSP-01__APG2"
                        ],
                        "neName": "MSC-DB-BSP-01"
                    },
                    {
                        "selectedComponenets": [
                            "MSC16-AXE_CLUSTER",
                            "MSC16__SPX1"
                        ],
                        "neName": "MSC16"
                    },
                    {
                        "selectedComponenets": [
                            "MSC17__APG2",
                            "MSC17__SPX2"
                        ],
                        "neName": "MSC17"
                    }
                ],
                "neTypeComponentActivityDetails": [
                    {
                        "neType": "MSC-DB-BSP",
                        "componentActivities": [
                            {
                                "componentName": "MSC-DB-BSP-01__APG1",
                                "activityNames": [
                                    "createbackup",
                                    "uploadbackup"
                                ]
                            },
                            {
                                "componentName": "MSC-DB-BSP-01__APG2",
                                "activityNames": [
                                    "createbackup"
                                ]
                            }
                        ]
                    },
                    {
                        "neType": "MSC-BC-BSP",
                        "componentActivities": [
                            {
                                "componentName": "MSC16-AXE_CLUSTER",
                                "activityNames": [
                                    "createbackup",
                                    "uploadbackup"
                                ]
                            },
                            {
                                "componentName": "MSC16__SPX1",
                                "activityNames": [
                                    "createbackup"
                                ]
                            },
                            {
                                "componentName": "MSC17__APG2",
                                "activityNames": [
                                    "createbackup",
                                    "uploadbackup"
                                ]
                            },
                            {
                                "componentName": "MSC17__SPX2",
                                "activityNames": [
                                    "createbackup"
                                ]
                            }
                        ]
                    }
                ]
            },
            "owner": "administrator",
            "scheduleJobConfiguration": {
                "repeatType": "Daily",
                "repeatCount": "1",
                "repeatOn": null,
                "occurences": null,
                "endDate": "1466895600000",
                "startDate": "1466697800053"
            }
        };

        var responseForLicense = {
            "jobName": "InstallLicenseJob_egopvup_23062016112110",
            "description": "",
            "createdOn": "1466677482000",
            "jobType": "LICENSE",
            "startTime": "1466679600000",
            "mode": "Scheduled",
            "jobParams": [
                {
                    "activityInfoList": [
                        {
                            "activityName": "install",
                            "scheduleType": "Immediate",
                            "order": 1,
                            "jobProperties": [

                            ]
                        }
                    ],
                    "jobProperties": [

                    ],
                    "neType": "ERBS"
                }
            ],
            "selectedNEs": {
                "collectionNames": [

                ],
                "networkElements": [
                    {
                        "networkElementFdn": "NetworkElement=ieatnetsimv6059-01_LTE01ERBS00001",
                        "nodeRootFdn": "SubNetwork=ERBS-SUBNW-1,MeContext=ieatnetsimv6059-01_LTE01ERBS00001",
                        "platformType": "CPP",
                        "name": "ieatnetsimv6059-01_LTE01ERBS00001",
                        "neType": "ERBS",
                        "ossModelIdentity": "16B-G.1.301",
                        "nodeModelIdentity": "16B-G.1.301",
                        "neProductVersion": [
                            {
                                "revision": "G1301",
                                "identity": "CXPL16BCP1"
                            }
                        ]
                    },
                    {
                        "networkElementFdn": "NetworkElement=ieatnetsimv6059-01_LTE01ERBS00002",
                        "nodeRootFdn": "SubNetwork=ERBS-SUBNW-1,MeContext=ieatnetsimv6059-01_LTE01ERBS00002",
                        "platformType": "CPP",
                        "name": "ieatnetsimv6059-01_LTE01ERBS00002",
                        "neType": "ERBS",
                        "ossModelIdentity": "16B-G.1.301",
                        "nodeModelIdentity": "16B-G.1.301",
                        "neProductVersion": [
                            {
                                "revision": "G1301",
                                "identity": "CXPL16BCP1"
                            }
                        ]
                    },
                    {
                        "networkElementFdn": "NetworkElement=ieatnetsimv6059-01_LTE01ERBS00003",
                        "nodeRootFdn": "SubNetwork=ERBS-SUBNW-1,MeContext=ieatnetsimv6059-01_LTE01ERBS00003",
                        "platformType": "CPP",
                        "name": "ieatnetsimv6059-01_LTE01ERBS00003",
                        "neType": "ERBS",
                        "ossModelIdentity": "16B-G.1.301",
                        "nodeModelIdentity": "16B-G.1.301",
                        "neProductVersion": [
                            {
                                "revision": "G1301",
                                "identity": "CXPL16BCP1"
                            }
                        ]
                    }
                ],
                "savedSearchIds": [

                ]
            },
            "owner": "egopvup",
            "scheduleJobConfiguration": {
                "repeatType": "Daily",
                "repeatCount": "1",
                "repeatOn": null,
                "occurences": null,
                "endDate": "1466895600000",
                "startDate": "1466697800053"
            }
        };

        var responseForUpgrade = {"jobName":"UpgradeJob_shmuser1_04012019094133_Duplicate","description":"","createdOn":"1546595155436","jobType":"UPGRADE","startTime":"1546595155575","mode":"Immediate","jobParams":[{"activityInfoList":[{"activityName":"Test script","scheduleType":"Immediate","order":1,"scheduledTime":null,"jobProperties":[{"value":"N","key":"_POPUP_WINDOWS"},{"value":"false","key":"Synchronous"},{"value":"enm_test.ccf","key":"Script"},{"key":"_MM_CONFIG_FILE","value":"bsc08a.cfg"},{"key":"_REF","value":"RELFSW99"},{"key":"HIDDEN_PARAMETERS","value":"_MM_CONFIG_FILE,_REF,Synchronous"}]},{"activityName":"the same Test script","scheduleType":"Immediate","order":2,"scheduledTime":null,"jobProperties":[{"value":"N","key":"_POPUP_WINDOWS"},{"value":"true","key":"Synchronous"},{"value":"enm_test.ccf","key":"Script"},{"key":"_MM_CONFIG_FILE","value":"bsc08a.cfg"},{"key":"_REF","value":"RELFSW99"},{"key":"HIDDEN_PARAMETERS","value":"_MM_CONFIG_FILE,_REF"}]}],"jobProperties":[{"key":"SWP_NAME","value":"ENM_TEST_PACK_multi_act_A"},{"key":"productNumber","value":"multi_act"},{"key":"productRevision","value":"A"},{"key":"productName","value":"ENM TEST PACK"},{"key":"network_element","value":""},{"key":"_MM_CONFIG_FILE","value":"bsc08a.cfg"},{"key":"_REF","value":"RELFSW99"},{"key":"HIDDEN_PARAMETERS","value":"_MM_CONFIG_FILE,_REF"}],"neType":"MSC-BC-IS"}],"neJobProperties":[{"neName":"MSC05__BC01","jobProperties":[{"key":"HIDDEN_PARAMETERS","value":"_MM_CONFIG_FILE,_REF"},{"key":"_MM_CONFIG_FILE","value":"bsc08a.cfg"},{"key":"_REF","value":"RELFSW99"}]},{"neName":"MSC05__BC02","jobProperties":[{"key":"HIDDEN_PARAMETERS","value":"_MM_CONFIG_FILE,_REF"},{"key":"_MM_CONFIG_FILE","value":"bsc08a.cfg"},{"key":"_REF","value":"RELFSW99"}]},{"neName":"MSC05__CP01","jobProperties":[{"key":"HIDDEN_PARAMETERS","value":"_MM_CONFIG_FILE,_REF"},{"key":"_MM_CONFIG_FILE","value":"bsc08a.cfg"},{"key":"_REF","value":"RELFSW99"}]},{"neName":"MSC05__CP02","jobProperties":[{"key":"HIDDEN_PARAMETERS","value":"_MM_CONFIG_FILE,_REF"},{"key":"_MM_CONFIG_FILE","value":"bsc08a.cfg"},{"key":"_REF","value":"RELFSW99"}]},{"neName":"MSC05__BC03","jobProperties":[]},{"neName":"MSC05__BC04","jobProperties":[]}],"selectedNEs":{"collectionNames":[],"networkElements":[{"networkElementFdn":"NetworkElement=MSC05","nodeRootFdn":"MeContext=MSC05","platformType":"AXE","name":"MSC05","neType":"MSC-BC-IS","ossModelIdentity":"","nodeModelIdentity":"1376-328-093","neProductVersion":[{"revision":"PA01","identity":"3.0.0"}],"utcOffset":null,"timeZone":"Europe/Dublin","syncStatus":"UNSYNCHRONIZED"}],"savedSearchIds":[],"neWithComponentInfo":[{"selectedComponenets":["MSC05__BC01","MSC05__BC02","MSC05__CP01","MSC05__CP02","MSC05__BC03","MSC05__BC04"],"neName":"MSC05"}]},"neNames":["MSC05"],"skippedNeCount":0,"owner":"shmuser1","scheduleJobConfiguration":{"repeatType":null,"repeatCount":null,"repeatOn":null,"occurences":null,"endDate":null,"startDate":null,"cronExpression":null}};

        var responseForUpgradeV1 = {"jobName":"UpgradeJob_administrator_29012020142618","description":"","createdOn":"1580308030090","jobType":"UPGRADE","startTime":"1580308030334","mode":"Immediate","jobParams":[{"activityInfoList":[{"activityName":"prepare","scheduleType":"Immediate","order":1,"scheduledTime":null,"jobProperties":[]},{"activityName":"verify","scheduleType":"Immediate","order":2,"scheduledTime":null,"jobProperties":[]},{"activityName":"activate","scheduleType":"Immediate","order":3,"scheduledTime":null,"jobProperties":[]},{"activityName":"confirm","scheduleType":"Immediate","order":4,"scheduledTime":null,"jobProperties":[]}],"jobProperties":[{"key":"CXP9024418/15_SWP_NAME","value":"17ARadioNodePackage2"},{"key":"CXP9024418/15_productNumber","value":"CXP9024418/5"},{"key":"CXP9024418/15_productRevision","value":"R2CXS1"},{"key":"UPGRADETYPE","value":"SOFT"}],"neType":"RadioNode"},{"activityInfoList":[{"activityName":"prepare","scheduleType":"Immediate","order":1,"scheduledTime":null,"jobProperties":[]},{"activityName":"verify","scheduleType":"Immediate","order":2,"scheduledTime":null,"jobProperties":[]},{"activityName":"activate","scheduleType":"Immediate","order":3,"scheduledTime":null,"jobProperties":[]},{"activityName":"confirm","scheduleType":"Immediate","order":4,"scheduledTime":null,"jobProperties":[]}],"jobProperties":[{"key":"SWP_NAME","value":"CXP102051_1_R4D75"},{"key":"productNumber","value":"CXP102051/"},{"key":"productRevision","value":"R4D75"},{"key":"UPGRADETYPE","value":"SOFT"},{"key":"UCF","value":"CXP1020511_R4D75.xml"}],"neType":"ERBS"}],"neJobProperties":[],"selectedNEs":{"collectionNames":[],"networkElements":[{"networkElementFdn":"NetworkElement=LTE01dg2ERBS00001","nodeRootFdn":"ManagedElement=LTE01dg2ERBS00001","platformType":"ECIM","name":"LTE01dg2ERBS00001","neType":"RadioNode","ossModelIdentity":"19.Q4-R82A02","nodeModelIdentity":"19.Q4-R82A02","ossPrefix":"","neProductVersion":[{"revision":"R79A10","identity":"CXP9024418/6"}],"utcOffset":null,"timeZone":null,"syncStatus":"SYNCHRONIZED"}],"savedSearchIds":[],"neWithComponentInfo":null,"neTypeComponentActivityDetails":null},"neNames":["LTE01dg2ERBS00001"],"skippedNeCount":0,"owner":"administrator","scheduleJobConfiguration":{"repeatType":null,"repeatCount":null,"repeatOn":null,"occurences":null,"endDate":null,"startDate":null,"cronExpression":null}};

        var responseForUpgradeLicenseKeyFile = {"jobName":"UpgradeLicenseJob_administrator_dummy_08042021080419","description":"","createdOn":"1617896345556","jobType":"LICENSE_REQUEST","startTime":"1617896363456","mode":"Immediate","jobParams":[{"activityInfoList":[{"activityName":"request","scheduleType":"Immediate","order":2,"scheduledTime":null,"jobProperties":[]},{"activityName":"install","scheduleType":"Immediate","order":3,"scheduledTime":null,"jobProperties":[]}],"jobProperties":[{"key":"CXP9024418/15_SWP_NAME","value":"RadioNode-CXP9024418-15-R99A06"},{"key":"CXP9024418/15_productNumber","value":"CXP9024418/15"},{"key":"CXP9024418/15_productRevision","value":"R99A06"},{"key":"CXP9024418/16_SWP_NAME","value":"RadioNode R99A05 release upgrade package"},{"key":"CXP9024418/16_productNumber","value":"CXP9024418/92"},{"key":"CXP9024418/16_productRevision","value":"R99A05"},{"key":"LicenseRefreshType","value":"UpgradeLicensekeys"}],"neType":"RadioNode"}],"neJobProperties":[],"selectedNEs":{"collectionNames":[],"networkElements":[{"networkElementFdn":"NetworkElement=LTE06dg2ERBS00001","nodeRootFdn":"ManagedElement=LTE06dg2ERBS00001","platformType":"ECIM","name":"LTE06dg2ERBS00001","neType":"RadioNode","ossModelIdentity":"20.Q4-R19A30","nodeModelIdentity":"20.Q4-R19A30","ossPrefix":"","neProductVersion":[{"revision":"R19A188","identity":"CXP9024418/16"}],"utcOffset":null,"timeZone":null,"syncStatus":"SYNCHRONIZED"},{"networkElementFdn":"NetworkElement=NR01gNodeBRadio00001","nodeRootFdn":"SubNetwork=NR01gNodeBRadio00001,MeContext=NR01gNodeBRadio00001","platformType":"ECIM","name":"NR01gNodeBRadio00001","neType":"RadioNode","ossModelIdentity":"21.Q1-R23A35","nodeModelIdentity":"21.Q1-R23A35","ossPrefix":"SubNetwork=NR01gNodeBRadio00001,MeContext=NR01gNodeBRadio00001","neProductVersion":[{"revision":"R23A191","identity":"CXP9024418/15"}],"utcOffset":null,"timeZone":null,"syncStatus":"SYNCHRONIZED"}],"savedSearchIds":[],"neWithComponentInfo":null,"neTypeComponentActivityDetails":null},"neNames":["LTE06dg2ERBS00001","NR01gNodeBRadio00001"],"skippedNeCount":0,"owner":"administrator","scheduleJobConfiguration":{"repeatType":null,"repeatCount":null,"repeatOn":null,"occurences":null,"endDate":null,"startDate":null,"cronExpression":null}};

        var restoreJobConfigurationResponse = {
            "neNames": [
                "LTE02ERBS00001",
                "NE03"
            ],
            "jobName": "RestoreBackupJob_chrrom",
            "description": "",
            "createdOn": "1494225168629",
            "jobType": "RESTORE",
            "startTime": "1495580400000",
            "mode": "Scheduled",
            "jobParams": [
                {
                    "activityInfoList": [
                        {
                            "activityName": "download",
                            "scheduleType": "Scheduled",
                            "order": 1,
                            "scheduledTime": "1495753200000",
                            "jobProperties": [

                            ]
                        },
                        {
                            "activityName": "verify",
                            "scheduleType": "Immediate",
                            "order": 2,
                            "scheduledTime": null,
                            "jobProperties": [

                            ]
                        },
                        {
                            "activityName": "install",
                            "scheduleType": "Scheduled",
                            "order": 3,
                            "scheduledTime": "1495753200000",
                            "jobProperties": [
                                {
                                    "key": "INSTALL_MISSING_UPGRADE_PACKAGES",
                                    "value": "true"
                                },
                                {
                                    "key": "REPLACE_CORRUPTED_UPGRADE_PACKAGES",
                                    "value": "true"
                                }
                            ]
                        },
                        {
                            "activityName": "restore",
                            "scheduleType": "Immediate",
                            "order": 4,
                            "scheduledTime": null,
                            "jobProperties": [
                                {
                                    "key": "FORCED_RESTORE",
                                    "value": "true"
                                },
                                {
                                    "key": "AUTO_CONFIGURATION",
                                    "value": "AS_CONFIGURED"
                                }
                            ]
                        },
                        {
                            "activityName": "confirm",
                            "scheduleType": "Immediate",
                            "order": 1,
                            "scheduledTime": null,
                            "jobProperties": [

                            ]
                        },
                    ],
                    "jobProperties": [

                    ],
                    "neType": "ERBS"
                }
            ],
            "neJobProperties": [
                {
                    "neName": "LTE06ERBS00001",
                    "jobProperties": [
                        {
                            "key": "CV_LOCATION",
                            "value": "ENM"
                        },
                        {
                            "key": "CV_NAME",
                            "value": "Backup_administrator_11072016112725"
                        },
                        {
                            "key": "CV_TYPE",
                            "value": ""
                        },
                        {
                            "key": "CV_FILE_NAME",
                            "value": "Backup_administrator_11072016112725.zip"
                        }
                    ]
                },
                {
                    "neName": "NE03",
                    "jobProperties": [
                        {
                            "key": "BACKUP_LOCATION",
                            "value": "ENM"
                        },
                        {
                            "key": "BACKUP_NAME",
                            "value": "_Backup_radio_NE03_RadioNode_20160714T094517"
                        },
                        {
                            "key": "BACKUP_FILE_NAME",
                            "value": "_Backup_radio_NE03_RadioNode_20160714T094517.zip"
                        },
                        {
                            "key": "BACKUP_DOMAIN",
                            "value": null
                        },
                        {
                            "key": "BACKUP_TYPE",
                            "value": null
                        }
                    ]
                }
            ],
            "neWithComponentInfo": [
                {
                  "neName": "MSC-BC-BSP-18A-V201",
                  "selectedComponenets": [
                   "MSC-BC-BSP-18A-V201__BC01",
                   "MSC-BC-BSP-18A-V201__BC02",
                   "MSC-BC-BSP-18A-V201__BC03"
                  ]
                },
                {
                  "neName": "MSC-BC-BSP-18A-V202",
                  "selectedComponenets": [
                    "MSC-BC-BSP-18A-V201__BC21",
                   "MSC-BC-BSP-18A-V201__BC22",
                   "MSC-BC-BSP-18A-V201__BC23"
                  ]
                },
                {
                  "neName": "MSC-BC-BSP-18A-V202",
                  "selectedComponenets": [

                  ]
                }
              ],
            "selectedNEs": {
                "collectionNames": [

                ],
                "networkElements": [
                    {
                        "networkElementFdn": "NetworkElement=LTE06ERBS00001",
                        "nodeRootFdn": "MeContext=LTE06ERBS00001",
                        "platformType": "CPP",
                        "name": "LTE06ERBS00001",
                        "neType": "ERBS",
                        "ossModelIdentity": "4322-940-032",
                        "nodeModelIdentity": "4322-940-032",
                        "neProductVersion": [
                            {
                                "revision": "E1239",
                                "identity": "CXPL14BCP1"
                            }
                        ]
                    },
                    {
                        "networkElementFdn": "NetworkElement=NE03",
                        "nodeRootFdn": "SubNetwork=subnet_NE03,MeContext=NE03",
                        "platformType": "CPP",
                        "name": "NE03",
                        "neType": "ERBS",
                        "ossModelIdentity": "15B-R12EC",
                        "nodeModelIdentity": "3618-638-932",
                        "neProductVersion": [
                            {
                                "revision": "R14XS",
                                "identity": "CXP9024418/1"
                            },
                            {
                                "revision": "R50L01",
                                "identity": "CXS101289"
                            },
                            {
                                "revision": "R14XS",
                                "identity": "CXP9024418/1"
                            }
                        ]
                    }
                ],
                "savedSearchIds": [

                ]

            },
            "owner": "administrator",
            "skippedNeCount" : 1,
            "scheduleJobConfiguration": {
                "repeatType": null,
                "repeatCount": null,
                "repeatOn": null,
                "occurences": null,
                "endDate": null,
                "startDate": "1495580400000"
            }
        };

        if(req.params.jobId === "72294") {
            res.status(200).send(responseForUpgradeV1);
        } else if (req.params.jobId === "28178783478012912" || req.params.jobId === "28178783478012917") {
            res.status(200).send(responseForUpgrade);
        } else if(req.params.jobId === "28178783478012927"){
            res.status(200).send(responseForUpgradeLicenseKeyFile);
        }else {
            res.status(200).send(responseForBackup);
        }
    });

    var neJobLogs = require('./test/resources/restMock/data/joblogs').getJobLogs;

    app.post('/oss/shm/rest/job/joblog', function (req, res) {
        var req = req.body;
        console.log(req);
        var localNeJobLogs = [];
        var response = Object.create(Object.prototype);
        var offset = req.offset;
        var limit = req.limit;
        var payload = req.body;
        var sortBy = req.sortBy;
        var orderBy = req.orderBy;
        var sortOrder = 1;
        if (req.orderBy === "asc")
            sortOrder = -1;

        localNeJobLogs.push.apply(localNeJobLogs, neJobLogs);

        var totalCount = localNeJobLogs.length;

        localNeJobLogs = sortByKey(localNeJobLogs, sortBy);

        function sortByKey(array, key) {
            return array.sort(function (a, b) {
                var x = a[key];
                var y = b[key];
                var result = ((x < y) ? -1 : ((x > y) ? 1 : 0));
                return result * sortOrder;
            });
        }

        localNeJobLogs = localNeJobLogs.splice(offset - 1, limit - (offset - 1));
        response.totalCount = totalCount;
        response.result = localNeJobLogs;
        res.send(response);
    });

    app.post("/oss/shm/rest/job/progress", function (req, res) {

        var response = [];

        var payload = req.body;
        progress += 10;
        payload.forEach(function (jobId) {
            var progressDetails = Object.create(Object.prototype);
            progressDetails.progress = progress;
            progressDetails.id = jobId;
            if (progress === 100) {
                progressDetails.state = "COMPLETED";
                progressDetails.result = "SUCCESS";
            } else {
                progressDetails.state = "COMPLETED";
                progressDetails.result = "FAILED";
            }
            response.push(progressDetails);
        });

        setTimeout(function () {
            res.send(response);
        }, 1000);
    });

    app.post("/oss/shm/rest/job/delete", function (req, res) {
        var response = Object.create(Object.prototype);
        response.message = "Packages successfully deleted : 1";
        response.status = "success";
        setInterval(function () {
            res.send(response);

        }, 3000);

    });

    app.post("/oss/shm/rest/job/cancelJobs", function (req, res) {
        var response = Object.create(Object.prototype);
        response.message = "Packages successfully canceled : 1";
        response.status = "success";
        res.send(response);
        //res.send(500, "Database not available");
    });

    app.post("/oss/shm/rest/job/jobs/continue", function (req, res) {
        var response = Object.create(Object.prototype);
        response.message = "Ne level job Successfully Continued!!";
        response.status = "success";
        res.send(response);
        //res.send(500, "Database not available");
    });

    app.post("/oss/shm/rest/job/comment", function (req, res) {
        var response;
        res.send(response);
        //res.send(500, "Database not available");
    });

    app.get("/oss/shm/rest/serverTime/getTimeOffset", function (req, res) {
        var offset = "+1";
        var expectedServerTime = '{ "date":' + getDate(offset) + ',' +
            '"offset":3600000,' +
            '"serverLocation":"Europe/London"}';
        res.set('Content-Type', 'application/json');
        res.send(expectedServerTime);
    });

    app.get("/oss/shm/rest/inventory/rbac/viewinventory", function (req, res) {
        res.send(200, "error");
    });

    app.get('/editprofile', function (req, res) {
        res.status(200).send({"username":"administrator"});
    });

    app.get('/oss/shm/rest/rbac/importfile', function (req, res) {
        res.send(200,"grant");
    });

    app.get("/oss/shm/rest/job/template/:jobName",function(req, res) {
        var status = 404;
        var responseText = {"id": "jobTemplate", "message": "job with name does not exist"};

        res.status(status).send(responseText);
    });

    app.post("/oss/shm/rest/job/networkelementids", function (req, res) {
        res.status(200).send({"poIdList":[2040015,2040000],"message":"Requested Network Element Poid's Found","code":0});
    });
}

function getDate(offset) {

    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    var nd = new Date(utc + (3600000 * offset));

    return nd.getTime();
}