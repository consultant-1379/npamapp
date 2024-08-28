module.exports = [
    {
        "neJobId": 1,
        "neNodeName": "eNodeB 1",
        "neActivity":"Install",
        "neProgress":0,
        "neStatus":"RUNNING",
        "neResult":"",
        "neStartDate":"1436450157710",
        "neEndDate":"1436450158122",
        "lastLogMessage": "Progress Info : Action Name=EXPORT ProgressPercentage=100 State=FINISHED Result=SUCCESS Progress Information=FINISHED",
        "neComments": "",
        "neJobConfiguration":{"CV Name":"cvname_ERBS00001"},
        "nodeType": "ERBS",
        "activityDetailsList":[
            {
                "activityName":"Install",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"SUCCESS",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"Upgrade",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"FAILED",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"SWAdjust",
                "activitySchedule":"Manual",
                "activityStartTime":"",
                "activityEndTime":"",
                "activityResult":null,
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            }]
    },
    {
        "neJobId": 2,
        "neNodeName": "eNodeB 2",
        "neActivity":"Verify",
        "neProgress":100,
        "neStatus":"COMPLETED",
        "neResult":"SUCCESS",
        "neStartDate":"1436261373693",
        "neEndDate":"1436261373693",
        "lastLogMessage": "Progress Info : Action Name=EXPORT ProgressPercentage=100 State=FINISHED Result=SUCCESS Progress Information=FINISHED",
        "neComments": "",
        "nodeType": "ERBS",
        "activityDetailsList":[
            {
                "activityName":"Install",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436261373693",
                "activityEndTime":"1436261373693",
                "activityResult":"SUCCESS" ,
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"Upgrade",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436261373693",
                "activityEndTime":"1436261373693",
                "activityResult":"FAILED",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"SWAdjust",
                "activitySchedule":"Manual",
                "activityStartTime":"",
                "activityEndTime":"",
                "activityResult":"",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            }]
    },
    {
        "neJobId":3,
        "neNodeName": "eNodeB 3",
        "neActivity":"Verify",
        "neProgress":100,
        "neStatus":"COMPLETED",
        "neResult":"SUCCESS",
        "neStartDate":"1436450157710",
        "neEndDate":"1436450158122",
        "lastLogMessage": "Progress Info : Action Name=EXPORT ProgressPercentage=100 State=FINISHED Result=SUCCESS Progress Information=FINISHED",
        "neComments": "",
        "nodeType": "ERBS",
        "activityDetailsList":[
            {
                "activityName":"Install",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436261373693",
                "activityResult":"SUCCESS",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"Upgrade",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436261373693",
                "activityResult":"FAILED",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"SWAdjust",
                "activitySchedule":"Manual",
                "activityStartTime":"",
                "activityEndTime":"",
                "activityResult":"",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            }]
    },
    {
        "neJobId": 4,
        "neNodeName": "eNodeB 4",
        "neActivity":"Verify",
        "neProgress":100,
        "neStatus":"COMPLETED",
        "neResult":"SUCCESS",
        "neStartDate":"1436450157710",
        "neEndDate":"1436450158122",
        "lastLogMessage": "Progress Info : Action Name=EXPORT ProgressPercentage=100 State=FINISHED Result=SUCCESS Progress Information=FINISHED",
        "neComments": "",
        "nodeType": "ERBS",
        "activityDetailsList":[
            {
                "activityName":"Install",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436261373693",
                "activityResult":"SUCCESS" ,
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"Upgrade",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436261373693",
                "activityResult":"FAILED" ,
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"SWAdjust",
                "activitySchedule":"Manual",
                "activityStartTime":"",
                "activityEndTime":"",
                "activityResult":"",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            }]
    },
    {
        "neJobId": 5,
        "neNodeName": "eNodeB 5",
        "neActivity":"Upgrade",
        "neProgress":75,
        "neStatus":"CANCELLED",
        "neResult":"SKIPPED",
        "neStartDate":"1436450157710",
        "neEndDate":"1436450158122",
        "lastLogMessage": "Progress Info : Action Name=EXPORT ProgressPercentage=100 State=FINISHED Result=SUCCESS Progress Information=FINISHED",
        "neComments": "A User Comment",
        "nodeType": "ERBS",
        "activityDetailsList":[
            {
                "activityName":"Install",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"SUCCESS",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"Upgrade",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"FAILED",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"SWAdjust",
                "activitySchedule":"Manual",
                "activityStartTime":"",
                "activityEndTime":"",
                "activityResult":"",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            }]
    },
    {
        "neJobId": 6,
        "neNodeName": "eNodeB 6",
        "neActivity":"Install",
        "neProgress":0,
        "neStatus":"CREATED",
        "neResult":"",
        "neStartDate":"1436450157710",
        "neEndDate":"",
        "lastLogMessage": "Progress Info : Action Name=EXPORT ProgressPercentage=100 State=FINISHED Result=SUCCESS Progress Information=FINISHED",
        "neComments": "",
        "nodeType": "ERBS",
        "activityDetailsList":[
            {
                "activityName":"Install",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"SUCCESS",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"Upgrade",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"FAILED",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"SWAdjust",
                "activitySchedule":"Manual",
                "activityStartTime":"",
                "activityEndTime":"",
                "activityResult":"",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            }]
    },
    {
        "neJobId": 7,
        "neNodeName": "eNodeB 7",
        "neActivity":"Upgrade",
        "neProgress":95,
        "neStatus":"WAIT_FOR_USER_INPUT",
        "neResult":"",
        "neStartDate":"1436450157710",
        "neEndDate":"",
        "lastLogMessage": "Progress Info : Action Name=EXPORT ProgressPercentage=100 State=FINISHED Result=SUCCESS Progress Information=FINISHED",
        "neComments": "",
        "nodeType": "ERBS",
        "activityDetailsList":[
            {
                "activityName":"Install",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"SUCCESS",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"Upgrade",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"FAILED",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"SWAdjust",
                "activitySchedule":"Manual",
                "activityStartTime":"",
                "activityEndTime":"",
                "activityResult":"",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            }]
    },
    {
        "neJobId": 8,
        "neNodeName": "eNodeB 8",
        "neActivity":"",
        "neProgress":50,
        "neStatus":"COMPLETED",
        "neResult":"FAILED",
        "neStartDate":"1501656623986",
        "neEndDate":"1501656633831",
        "lastLogMessage": "unable to proceed",
        "neComments": "",
        "nodeType": "ERBS",
        "activityDetailsList":[
            {
                "activityName":"prepare",
                "activitySchedule":null,
                "activityStartTime":null,
                "activityEndTime":null,
                "activityResult":null,
                "activityConfiguration": null
            },
            {
                "activityName":"verify",
                "activitySchedule":null,
                "activityStartTime":null,
                "activityEndTime":null,
                "activityResult":null,
                "activityConfiguration": null
            }]
    },
    {
        "neJobId": 9,
        "neNodeName": "eNodeB 9",
        "neActivity":"Install",
        "neProgress":0,
        "neStatus":"SCHEDULED",
        "neResult":"",
        "neStartDate":"1436450157710",
        "neEndDate":"",
        "lastLogMessage": "Progress Info : Action Name=EXPORT ProgressPercentage=100 State=FINISHED Result=SUCCESS Progress Information=FINISHED",
        "neComments": "",
        "nodeType": "ERBS",
        "activityDetailsList":[
            {
                "activityName":"Install",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"SUCCESS",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"Upgrade",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"FAILED",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"SWAdjust",
                "activitySchedule":"Manual",
                "activityStartTime":"",
                "activityEndTime":"",
                "activityResult":"",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            }]
    },
    {
        "neJobId": 10,
        "neNodeName": "eNodeB 10",
        "neActivity":"Verify",
        "neProgress":100,
        "neStatus":"COMPLETED",
        "neResult":"SUCCESS",
        "neStartDate":"1436450157710",
        "neEndDate":"1436450158122",
        "lastLogMessage": "Progress Info : Action Name=EXPORT ProgressPercentage=100 State=FINISHED Result=SUCCESS Progress Information=FINISHED",
        "neComments": "",
        "nodeType": "ERBS",
        "activityDetailsList":[
            {
                "activityName":"Install",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"SUCCESS",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"Upgrade",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"FAILED",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"SWAdjust",
                "activitySchedule":"Manual",
                "activityStartTime":"",
                "activityEndTime":"",
                "activityResult":"",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            }]
    },
    {
        "neJobId": 11,
        "neNodeName": "eNodeB 11",
        "neActivity":null,
        "neProgress":100,
        "neStatus":"COMPLETED",
        "neResult":"SKIPPED",
        "neStartDate":"1501656623943",
        "neEndDate":"1501656623943",
        "lastLogMessage": "Unsupported node model",
        "neComments": "",
        "nodeType": "ERBS",
        "activityDetailsList":[]
    },
    {
        "neJobId": 12,
        "neNodeName": "eNodeB 12",
        "neActivity":"Verify",
        "neProgress":100,
        "neStatus":"COMPLETED",
        "neResult":"SUCCESS",
        "neStartDate":"1436450157710",
        "neEndDate":"1436450158122",
        "lastLogMessage": "Progress Info : Action Name=EXPORT ProgressPercentage=100 State=FINISHED Result=SUCCESS Progress Information=FINISHED",
        "neComments": "",
        "nodeType": "ERBS",
        "activityDetailsList":[
            {
                "activityName":"Install",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"SUCCESS" ,
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"Upgrade",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"FAILED",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"SWAdjust",
                "activitySchedule":"Manual",
                "activityStartTime":"",
                "activityEndTime":"",
                "activityResult":"",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            }]
    },
    {
        "neJobId":13,
        "neNodeName": "eNodeB 13",
        "neActivity":"Verify",
        "neProgress":100,
        "neStatus":"COMPLETED",
        "neResult":"SUCCESS",
        "neStartDate":"1436450157710",
        "neEndDate":"1436450158122",
        "lastLogMessage": "Progress Info : Action Name=EXPORT ProgressPercentage=100 State=FINISHED Result=SUCCESS Progress Information=FINISHED",
        "neComments": "",
        "nodeType": "ERBS",
        "activityDetailsList":[
            {
                "activityName":"Install",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"SUCCESS",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"Upgrade",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"FAILED",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"SWAdjust",
                "activitySchedule":"Manual",
                "activityStartTime":"",
                "activityEndTime":"",
                "activityResult":"",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            }]
    },
    {
        "neJobId": 14,
        "neNodeName": "eNodeB 14",
        "neActivity":"Verify",
        "neProgress":100,
        "neStatus":"COMPLETED",
        "neResult":"SUCCESS",
        "neStartDate":"1436450157710",
        "neEndDate":"1436450158122",
        "lastLogMessage": "Progress Info : Action Name=EXPORT ProgressPercentage=100 State=FINISHED Result=SUCCESS Progress Information=FINISHED",
        "neComments": "",
        "nodeType": "ERBS",
        "activityDetailsList":[
            {
                "activityName":"Install",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"SUCCESS" ,
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"Upgrade",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"FAILED" ,
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"SWAdjust",
                "activitySchedule":"Manual",
                "activityStartTime":"",
                "activityEndTime":"",
                "activityResult":"",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            }]
    },
    {
        "neJobId": 15,
        "neNodeName": "eNodeB 15",
        "neActivity":"Upgrade",
        "neProgress":75,
        "neStatus":"CANCELLED",
        "neResult":"SKIPPED",
        "neStartDate":"1436450157710",
        "neEndDate":"1436450158122",
        "lastLogMessage": "Progress Info : Action Name=EXPORT ProgressPercentage=100 State=FINISHED Result=SUCCESS Progress Information=FINISHED",
        "neComments": "A User Comment",
        "nodeType": "ERBS",
        "activityDetailsList":[
            {
                "activityName":"Install",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"SUCCESS",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"Upgrade",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"FAILED",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"SWAdjust",
                "activitySchedule":"Manual",
                "activityStartTime":"",
                "activityEndTime":"",
                "activityResult":"",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            }]
    },
    {
        "neJobId": 16,
        "neNodeName": "eNodeB 16",
        "neActivity":"Install",
        "neProgress":0,
        "neStatus":"CREATED",
        "neResult":"",
        "neStartDate":"1436450157710",
        "neEndDate":"",
        "lastLogMessage": "Progress Info : Action Name=EXPORT ProgressPercentage=100 State=FINISHED Result=SUCCESS Progress Information=FINISHED",
        "neComments": "",
        "nodeType": "ERBS",
        "activityDetailsList":[
            {
                "activityName":"Install",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"SUCCESS",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"Upgrade",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"FAILED",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"SWAdjust",
                "activitySchedule":"Manual",
                "activityStartTime":"",
                "activityEndTime":"",
                "activityResult":"",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            }]
    },
    {
        "neJobId": 17,
        "neNodeName": "eNodeB 17",
        "neActivity":"Upgrade",
        "neProgress":95,
        "neStatus":"WAIT_FOR_USER_INPUT",
        "neResult":"",
        "neStartDate":"1436450157710",
        "neEndDate":"",
        "lastLogMessage": "Progress Info : Action Name=EXPORT ProgressPercentage=100 State=FINISHED Result=SUCCESS Progress Information=FINISHED",
        "neComments": "",
        "nodeType": "ERBS",
        "activityDetailsList":[
            {
                "activityName":"Install",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"SUCCESS",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"Upgrade",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"FAILED",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"SWAdjust",
                "activitySchedule":"Manual",
                "activityStartTime":"",
                "activityEndTime":"",
                "activityResult":"",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            }]
    },
    {
        "neJobId": 18,
        "neNodeName": "eNodeB 18",
        "neActivity":"Upgrade",
        "neProgress":100,
        "neStatus":"COMPLETED",
        "neResult":"SUCCESS",
        "neStartDate":"1436450157710",
        "neEndDate":"",
        "lastLogMessage": "Progress Info : Action Name=EXPORT ProgressPercentage=100 State=FINISHED Result=SUCCESS Progress Information=FINISHED",
        "neComments": "",
        "nodeType": "ERBS",
        "activityDetailsList":[
            {
                "activityName":"Install",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"SUCCESS",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"Upgrade",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"FAILED",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"SWAdjust",
                "activitySchedule":"Manual",
                "activityStartTime":"",
                "activityEndTime":"",
                "activityResult":"",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            }]
    },
    {
        "neJobId": 19,
        "neNodeName": "eNodeB 19",
        "neActivity":"Install",
        "neProgress":0,
        "neStatus":"SCHEDULED",
        "neResult":"",
        "neStartDate":"1436450157710",
        "neEndDate":"",
        "lastLogMessage": null,
        "neComments": "",
        "nodeType": "ERBS",
        "activityDetailsList":[
            {
                "activityName":"Install",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"SUCCESS",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"Upgrade",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"FAILED",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"SWAdjust",
                "activitySchedule":"Manual",
                "activityStartTime":"",
                "activityEndTime":"",
                "activityResult":"",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            }]
    },
    {
        "neJobId": 20,
        "neNodeName": "eNodeB 20",
        "neActivity":"Verify",
        "neProgress":100,
        "neStatus":"COMPLETED",
        "neResult":"SUCCESS",
        "neStartDate":"1436450157710",
        "neEndDate":"1436450158122",
        "lastLogMessage": " ",
        "neComments": "",
        "nodeType": "ERBS",
        "activityDetailsList":[
            {
                "activityName":"Install",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"SUCCESS",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"Upgrade",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"FAILED",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"SWAdjust",
                "activitySchedule":"Manual",
                "activityStartTime":"",
                "activityEndTime":"",
                "activityResult":"",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            }]
    },
    {
        "neJobId": 21,
        "neNodeName": "GSM02BSC01",
        "neProgress": 0.0,
        "neStatus": "WAIT_FOR_SCRIPT_INPUT",
        "neResult": null,
        "neStartDate": "",
        "neEndDate": "",
        "neActivity": " ",
        "neJobConfiguration": {
        },
        "activityDetailsList": [
          {
            "activityName": "EPB1 Update",
            "activitySchedule": null,
            "activityScheduleTime": null,
            "activityStartTime": null,
            "activityEndTime": null,
            "activityProgress": null,
            "activityResult": null,
            "activityOrder": 1,
            "activityConfiguration": null,
            "activityJobIdAsString": "281474987901360"
          }
        ],
        "lastLogMessage": "",
        "nodeType": "BSC",
        "neJobIdAsLong": 21
      },
      {
        "neJobId": 22,
        "neNodeName": "MSC-DB-01",
        "neProgress": 0.0,
        "neStatus": "USER_INTERRUPTED",
        "neResult": null,
        "neStartDate": "",
        "neEndDate": "",
        "neActivity": " ",
        "neJobConfiguration": null,
        "activityDetailsList": [
          {
            "activityName": "Health Check",
            "activitySchedule": null,
            "activityScheduleTime": null,
            "activityStartTime": null,
            "activityEndTime": null,
            "activityProgress": null,
            "activityResult": null,
            "activityOrder": 1,
            "activityConfiguration": null,
            "activityJobIdAsString": "281474987901764"
          }
        ],
        "lastLogMessage": "",
        "nodeType": "MSC-DB",
        "neJobIdAsLong":22      },
      {
        "neJobId": 23,
        "neNodeName": "MSC-BC-BSP-18A-V202-AXE_CLUSTER",
        "neProgress": 0.0,
        "neStatus": "COMPLETED",
        "neResult": null,
        "neStartDate": "",
        "neEndDate": "",
        "neActivity": " ",
        "neJobConfiguration": null,
        "activityDetailsList": [
          {
            "activityName": "Health Check",
            "activitySchedule": null,
            "activityScheduleTime": null,
            "activityStartTime": null,
            "activityEndTime": null,
            "activityProgress": null,
            "activityResult": null,
            "activityOrder": 1,
            "activityConfiguration": null,
            "activityJobIdAsString": "281474987906014"
          }
        ],
        "lastLogMessage": "",
        "nodeType": "MSC-DB",
        "neJobIdAsLong":23      },
      {
        "neJobId": 24,
        "neNodeName": "HLR-FE-IS-18A-V201-AXE_cluster",
        "neProgress": 0.0,
        "neStatus": "CREATED",
        "neResult": null,
        "neStartDate": "",
        "neEndDate": "",
        "neActivity": " ",
        "neJobConfiguration": {
        },
        "activityDetailsList": [
          {
            "activityName": "Health Check",
            "activitySchedule": null,
            "activityScheduleTime": null,
            "activityStartTime": null,
            "activityEndTime": null,
            "activityProgress": null,
            "activityResult": null,
            "activityOrder": 1,
            "activityConfiguration": null,
            "activityJobIdAsString": "281474987906262"
          }
        ],
        "lastLogMessage": "",
        "nodeType": "HLR-FE",
        "neJobIdAsLong":24      },
      {
        "neJobId": 25,
        "neNodeName": "HLR-FE-IS-18A-V201_BC01",
        "neProgress": 0.0,
        "neStatus": "RUNNING",
        "neResult": null,
        "neStartDate": "",
        "neEndDate": "",
        "neActivity": " ",
        "neJobConfiguration": {
        },
        "activityDetailsList": [
          {
            "activityName": "Health Check",
            "activitySchedule": null,
            "activityScheduleTime": null,
            "activityStartTime": null,
            "activityEndTime": null,
            "activityProgress": null,
            "activityResult": null,
            "activityOrder": 1,
            "activityConfiguration": null,
            "activityJobIdAsString": "281474987906450"
          }
        ],
        "lastLogMessage": "",
        "nodeType": "HLR-FE",
        "neJobIdAsLong":25      },
        {
        "neJobId": 26,
        "neNodeName": "NR01gNodeBRadio00001",
        "neActivity":"Install",
        "neProgress":0,
        "neStatus":"WAIT_FOR_USER_INPUT",
        "neResult":"",
        "neStartDate":"1436450157710",
        "neEndDate":"1436450158122",
        "lastLogMessage": "Progress Info : Action Name=EXPORT ProgressPercentage=100 State=FINISHED Result=SUCCESS Progress Information=FINISHED",
        "neComments": "",
        "neJobConfiguration":{},
        "nodeType": "RadioNode",
        "activityDetailsList":[
            {
                "activityName":"Install",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"SUCCESS",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            },
            {
                "activityName":"Upgrade",
                "activitySchedule":"Immediate",
                "activityStartTime":"1436450157796",
                "activityEndTime":"1436450158002",
                "activityResult":"FAILED",
                "activityConfiguration": {
                    "LicenseKeyFile": "erbs2key.xml"
                }
            }]
    },
];