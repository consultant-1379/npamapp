/**
 * Created with IntelliJ IDEA.
 * User: tcsrohc
 * Date: 7/15/14
 * Time: 4:27 PM
 * To change this template use File | Settings | File Templates.
 */
define([
    "jscore/core",
    "shmjobdetails/regions/mejobdetails/mejobdetails",
    "shmjobdetails/Shmjobdetails"
], function (core, meJobDetails, shmJobDetails) {
    'use strict';

    describe("NE Job Details", function () {

        describe("Methods", function () {

            var response, currentApp, AppWithInv, server, options, sandbox;

            sandbox = sinon.sandbox.create();

            /*
             * Any change in this response object's neDeatils result object values, respective test cases also needs to be modified.
             * */
            response = {
                "jobDetails": {
                    "jobName": "Banagher Upgrade",
                    "jobCreatedBy": "nmuser1",
                    "jobProgress": 55,
                    "jobStatus": "RUNNING",
                    "jobType": "Upgrade",
                    "jobResult": "",
                    "jobStartTime": "2013-07-22 17:01",
                    "jobEndTime": ""
                },
                "neDetails": {
                    "totalCount": 16,
                    "result": [
                        {
                            "neJobId": 1,
                            "neNodeName": "eNodeB 1",
                            "neActivity": "Install",
                            "neProgress": 0,
                            "neStatus": "RUNNING",
                            "neResult": "",
                            "neStartDate": "2012-07-22 17:01",
                            "neEndDate": "",
                            "neComments": "",
                            "activityDetailsList": [
                                {
                                    "activityName": "Install",
                                    "activitySchedule": "Immediate",
                                    "activityStartTime": "2012-07-22 17:01",
                                    "activityEndTime": "2012-07-22 17:03",
                                    "activityResult": "SUCCESS"
                                },
                                {
                                    "activityName": "Upgrade",
                                    "activitySchedule": "Immediate",
                                    "activityStartTime": "2012-08-22 17:01",
                                    "activityEndTime": "2012-08-22 17:03",
                                    "activityResult": "FAILED"
                                },
                                {
                                    "activityName": "SWAdjust",
                                    "activitySchedule": "Manual",
                                    "activityStartTime": "",
                                    "activityEndTime": "",
                                    "activityResult": ""
                                }
                            ]
                        },
                        {
                            "neJobId": 2,
                            "neNodeName": "eNodeB 2",
                            "neActivity": "Verify",
                            "neProgress": 100,
                            "neStatus": "COMPLETED",
                            "neResult": "SUCCESS",
                            "neStartDate": "2013-02-22 17:01",
                            "neEndDate": "2013-07-22 17:02",
                            "neComments": "",
                            "activityDetailsList": [
                                {
                                    "activityName": "Install",
                                    "activitySchedule": "Immediate",
                                    "activityStartTime": "2012-07-22 17:01",
                                    "activityEndTime": "2012-07-22 17:03",
                                    "activityResult": "SUCCESS"
                                },
                                {
                                    "activityName": "Upgrade",
                                    "activitySchedule": "Immediate",
                                    "activityStartTime": "2012-08-22 17:01",
                                    "activityEndTime": "2012-08-22 17:03",
                                    "activityResult": "FAILED"
                                },
                                {
                                    "activityName": "SWAdjust",
                                    "activitySchedule": "Manual",
                                    "activityStartTime": "",
                                    "activityEndTime": "",
                                    "activityResult": ""
                                }
                            ]
                        },
                        {
                            "neJobId": 3,
                            "neNodeName": "eNodeB 3",
                            "neActivity": "Verify",
                            "neProgress": 100,
                            "neStatus": "COMPLETED",
                            "neResult": "SUCCESS",
                            "neStartDate": "2012-02-22 17:01",
                            "neEndDate": "2013-07-22 17:02",
                            "neComments": "",
                            "activityDetailsList": [
                                {
                                    "activityName": "Install",
                                    "activitySchedule": "Immediate",
                                    "activityStartTime": "2012-07-22 17:01",
                                    "activityEndTime": "2012-07-22 17:03",
                                    "activityResult": "SUCCESS"
                                },
                                {
                                    "activityName": "Upgrade",
                                    "activitySchedule": "Immediate",
                                    "activityStartTime": "2012-08-22 17:01",
                                    "activityEndTime": "2012-08-22 17:03",
                                    "activityResult": "FAILED"
                                },
                                {
                                    "activityName": "SWAdjust",
                                    "activitySchedule": "Manual",
                                    "activityStartTime": "",
                                    "activityEndTime": "",
                                    "activityResult": ""
                                }
                            ]
                        },
                        {
                            "neJobId": 3,
                            "neNodeName": "eNodeB 4",
                            "neActivity": "Verify",
                            "neProgress": 100,
                            "neStatus": "COMPLETED",
                            "neResult": "SUCCESS",
                            "neStartDate": "2011-07-22 17:01",
                            "neEndDate": "2013-07-22 17:02",
                            "neComments": "",
                            "activityDetailsList": [
                                {
                                    "activityName": "Install",
                                    "activitySchedule": "Immediate",
                                    "activityStartTime": "2012-07-22 17:01",
                                    "activityEndTime": "2012-07-22 17:03",
                                    "activityResult": "SUCCESS"
                                },
                                {
                                    "activityName": "Upgrade",
                                    "activitySchedule": "Immediate",
                                    "activityStartTime": "2012-08-22 17:01",
                                    "activityEndTime": "2012-08-22 17:03",
                                    "activityResult": "FAILED"
                                },
                                {
                                    "activityName": "SWAdjust",
                                    "activitySchedule": "Manual",
                                    "activityStartTime": "",
                                    "activityEndTime": "",
                                    "activityResult": ""
                                }
                            ]
                        },
                        {
                            "neJobId": 4,
                            "neNodeName": "eNodeB 5",
                            "neActivity": "Upgrade",
                            "neProgress": 75,
                            "neStatus": "CANCELLED",
                            "neResult": "SKIPPED",
                            "neStartDate": "2013-04-22 17:01",
                            "neEndDate": "2013-07-22 17:02",
                            "neComments": "A User Comment",
                            "activityDetailsList": [
                                {
                                    "activityName": "Install",
                                    "activitySchedule": "Immediate",
                                    "activityStartTime": "2012-07-22 17:01",
                                    "activityEndTime": "2012-07-22 17:03",
                                    "activityResult": "SUCCESS"
                                },
                                {
                                    "activityName": "Upgrade",
                                    "activitySchedule": "Immediate",
                                    "activityStartTime": "2012-08-22 17:01",
                                    "activityEndTime": "2012-08-22 17:03",
                                    "activityResult": "FAILED"
                                },
                                {
                                    "activityName": "SWAdjust",
                                    "activitySchedule": "Manual",
                                    "activityStartTime": "",
                                    "activityEndTime": "",
                                    "activityResult": ""
                                }
                            ]
                        },
                        {
                            "neJobId": 5,
                            "neNodeName": "eNodeB 6",
                            "neActivity": "Install",
                            "neProgress": 0,
                            "neStatus": "CREATED",
                            "neResult": "",
                            "neStartDate": "2013-07-12 17:01",
                            "neEndDate": "",
                            "neComments": "",
                            "activityDetailsList": [
                                {
                                    "activityName": "Install",
                                    "activitySchedule": "Immediate",
                                    "activityStartTime": "2012-07-22 17:01",
                                    "activityEndTime": "2012-07-22 17:03",
                                    "activityResult": "SUCCESS"
                                },
                                {
                                    "activityName": "Upgrade",
                                    "activitySchedule": "Immediate",
                                    "activityStartTime": "2012-08-22 17:01",
                                    "activityEndTime": "2012-08-22 17:03",
                                    "activityResult": "FAILED"
                                },
                                {
                                    "activityName": "SWAdjust",
                                    "activitySchedule": "Manual",
                                    "activityStartTime": "",
                                    "activityEndTime": "",
                                    "activityResult": ""
                                }
                            ]
                        },
                        {
                            "neJobId": 6,
                            "neNodeName": "eNodeB 7",
                            "neActivity": "Upgrade",
                            "neProgress": 95,
                            "neStatus": "WAIT_FOR_USER_INPUT",
                            "neResult": "",
                            "neStartDate": "2010-03-22 17:01",
                            "neEndDate": "",
                            "neComments": "",
                            "activityDetailsList": [
                                {
                                    "activityName": "Install",
                                    "activitySchedule": "Immediate",
                                    "activityStartTime": "2012-07-22 17:01",
                                    "activityEndTime": "2012-07-22 17:03",
                                    "activityResult": "SUCCESS"
                                },
                                {
                                    "activityName": "Upgrade",
                                    "activitySchedule": "Immediate",
                                    "activityStartTime": "2012-08-22 17:01",
                                    "activityEndTime": "2012-08-22 17:03",
                                    "activityResult": "FAILED"
                                },
                                {
                                    "activityName": "SWAdjust",
                                    "activitySchedule": "Manual",
                                    "activityStartTime": "",
                                    "activityEndTime": "",
                                    "activityResult": ""
                                }
                            ]
                        },
                        {
                            "neJobId": 7,
                            "neNodeName": "eNodeB 8",
                            "neActivity": "Upgrade",
                            "neProgress": 100,
                            "neStatus": "COMPLETED",
                            "neResult": "SUCCESS",
                            "neStartDate": "2001-07-22 17:01",
                            "neEndDate": "",
                            "neComments": "",
                            "activityDetailsList": [
                                {
                                    "activityName": "Install",
                                    "activitySchedule": "Immediate",
                                    "activityStartTime": "2012-07-22 17:01",
                                    "activityEndTime": "2012-07-22 17:03",
                                    "activityResult": "SUCCESS"
                                },
                                {
                                    "activityName": "Upgrade",
                                    "activitySchedule": "Immediate",
                                    "activityStartTime": "2012-08-22 17:01",
                                    "activityEndTime": "2012-08-22 17:03",
                                    "activityResult": "FAILED"
                                },
                                {
                                    "activityName": "SWAdjust",
                                    "activitySchedule": "Manual",
                                    "activityStartTime": "",
                                    "activityEndTime": "",
                                    "activityResult": ""
                                }
                            ]
                        },
                        {
                            "neJobId": 8,
                            "neNodeName": "eNodeB 9",
                            "neActivity": "Install",
                            "neProgress": 0,
                            "neStatus": "SCHEDULED",
                            "neResult": "",
                            "neStartDate": "2013-06-22 17:01",
                            "neEndDate": "",
                            "neComments": "",
                            "activityDetailsList": [
                                {
                                    "activityName": "Install",
                                    "activitySchedule": "Immediate",
                                    "activityStartTime": "2012-07-22 17:01",
                                    "activityEndTime": "2012-07-22 17:03",
                                    "activityResult": "SUCCESS"
                                },
                                {
                                    "activityName": "Upgrade",
                                    "activitySchedule": "Immediate",
                                    "activityStartTime": "2012-08-22 17:01",
                                    "activityEndTime": "2012-08-22 17:03",
                                    "activityResult": "FAILED"
                                },
                                {
                                    "activityName": "SWAdjust",
                                    "activitySchedule": "Manual",
                                    "activityStartTime": "",
                                    "activityEndTime": "",
                                    "activityResult": ""
                                }
                            ]
                        },
                        {
                            "neJobId": 9,
                            "neNodeName": "eNodeB 10",
                            "neActivity": "Verify",
                            "neProgress": 100,
                            "neStatus": "COMPLETED",
                            "neResult": "SUCCESS",
                            "neStartDate": "2013-12-22 17:01",
                            "neEndDate": "2013-07-22 17:02",
                            "neComments": "",
                            "activityDetailsList": [
                                {
                                    "activityName": "Install",
                                    "activitySchedule": "Immediate",
                                    "activityStartTime": "2012-07-22 17:01",
                                    "activityEndTime": "2012-07-22 17:03",
                                    "activityResult": "SUCCESS"
                                },
                                {
                                    "activityName": "Upgrade",
                                    "activitySchedule": "Immediate",
                                    "activityStartTime": "2012-08-22 17:01",
                                    "activityEndTime": "2012-08-22 17:03",
                                    "activityResult": "FAILED"
                                },
                                {
                                    "activityName": "SWAdjust",
                                    "activitySchedule": "Manual",
                                    "activityStartTime": "",
                                    "activityEndTime": "",
                                    "activityResult": ""
                                }
                            ]
                        },
                        {
                            "neJobId": 10,
                            "neNodeName": "eNodeB 11",
                            "neActivity": "Verify",
                            "neProgress": 100,
                            "neStatus": "COMPLETED",
                            "neResult": "SUCCESS",
                            "neStartDate": "2013-07-21 17:01",
                            "neEndDate": "2013-07-22 17:02",
                            "neComments": "",
                            "activityDetailsList": [
                                {
                                    "activityName": "Install",
                                    "activitySchedule": "Immediate",
                                    "activityStartTime": "2012-07-22 17:01",
                                    "activityEndTime": "2012-07-22 17:03",
                                    "activityResult": "SUCCESS"
                                },
                                {
                                    "activityName": "Upgrade",
                                    "activitySchedule": "Immediate",
                                    "activityStartTime": "2012-08-22 17:01",
                                    "activityEndTime": "2012-08-22 17:03",
                                    "activityResult": "FAILED"
                                },
                                {
                                    "activityName": "SWAdjust",
                                    "activitySchedule": "Manual",
                                    "activityStartTime": "",
                                    "activityEndTime": "",
                                    "activityResult": ""
                                }
                            ]
                        },
                        {
                            "neJobId": 11,
                            "neNodeName": "eNodeB 12",
                            "neActivity": "Verify",
                            "neProgress": 100,
                            "neStatus": "COMPLETED",
                            "neResult": "SUCCESS",
                            "neStartDate": "2003-07-22 17:01",
                            "neEndDate": "2013-07-22 17:02",
                            "neComments": "",
                            "activityDetailsList": [
                                {
                                    "activityName": "Install",
                                    "activitySchedule": "Immediate",
                                    "activityStartTime": "2012-07-22 17:01",
                                    "activityEndTime": "2012-07-22 17:03",
                                    "activityResult": "SUCCESS"
                                },
                                {
                                    "activityName": "Upgrade",
                                    "activitySchedule": "Immediate",
                                    "activityStartTime": "2012-08-22 17:01",
                                    "activityEndTime": "2012-08-22 17:03",
                                    "activityResult": "FAILED"
                                },
                                {
                                    "activityName": "SWAdjust",
                                    "activitySchedule": "Manual",
                                    "activityStartTime": "",
                                    "activityEndTime": "",
                                    "activityResult": ""
                                }
                            ]
                        },
                        {
                            "neJobId": 12,
                            "neNodeName": "eNodeB 13",
                            "neActivity": "Upgrade",
                            "neProgress": 75,
                            "neStatus": "CANCELLED",
                            "neResult": "SKIPPED",
                            "neStartDate": "2003-17-22 17:01",
                            "neEndDate": "2013-07-22 17:02",
                            "neComments": "A User Comment",
                            "activityDetailsList": [
                                {
                                    "activityName": "Install",
                                    "activitySchedule": "Immediate",
                                    "activityStartTime": "2012-07-22 17:01",
                                    "activityEndTime": "2012-07-22 17:03",
                                    "activityResult": "SUCCESS"
                                },
                                {
                                    "activityName": "Upgrade",
                                    "activitySchedule": "Immediate",
                                    "activityStartTime": "2012-08-22 17:01",
                                    "activityEndTime": "2012-08-22 17:03",
                                    "activityResult": "FAILED"
                                },
                                {
                                    "activityName": "SWAdjust",
                                    "activitySchedule": "Manual",
                                    "activityStartTime": "",
                                    "activityEndTime": "",
                                    "activityResult": ""
                                }
                            ]
                        },
                        {
                            "neJobId": 13,
                            "neNodeName": "eNodeB 14",
                            "neActivity": "Install",
                            "neProgress": 0,
                            "neStatus": "SUBMITTED",
                            "neResult": "",
                            "neStartDate": "2003-07-02 17:01",
                            "neEndDate": "",
                            "neComments": "",
                            "activityDetailsList": [
                                {
                                    "activityName": "Install",
                                    "activitySchedule": "Immediate",
                                    "activityStartTime": "2012-07-22 17:01",
                                    "activityEndTime": "2012-07-22 17:03",
                                    "activityResult": "SUCCESS"
                                },
                                {
                                    "activityName": "Upgrade",
                                    "activitySchedule": "Immediate",
                                    "activityStartTime": "2012-08-22 17:01",
                                    "activityEndTime": "2012-08-22 17:03",
                                    "activityResult": "FAILED"
                                },
                                {
                                    "activityName": "SWAdjust",
                                    "activitySchedule": "Manual",
                                    "activityStartTime": "",
                                    "activityEndTime": "",
                                    "activityResult": ""
                                }
                            ]
                        },
                        {
                            "neJobId": 14,
                            "neNodeName": "eNodeB 15",
                            "neActivity": "Upgrade",
                            "neProgress": 80,
                            "neStatus": "COMPLETED",
                            "neResult": "FAILED",
                            "neStartDate": "2007-07-22 17:01",
                            "neEndDate": "",
                            "neComments": "",
                            "activityDetailsList": [
                                {
                                    "activityName": "Install",
                                    "activitySchedule": "Immediate",
                                    "activityStartTime": "2012-07-22 17:01",
                                    "activityEndTime": "2012-07-22 17:03",
                                    "activityResult": "SUCCESS"
                                },
                                {
                                    "activityName": "Upgrade",
                                    "activitySchedule": "Immediate",
                                    "activityStartTime": "2012-08-22 17:01",
                                    "activityEndTime": "2012-08-22 17:03",
                                    "activityResult": "FAILED"
                                },
                                {
                                    "activityName": "SWAdjust",
                                    "activitySchedule": "Manual",
                                    "activityStartTime": "",
                                    "activityEndTime": "",
                                    "activityResult": ""
                                }
                            ]
                        },
                        {
                            "neJobId": 15,
                            "neNodeName": "eNodeB 16",
                            "neActivity": "Upgrade",
                            "neProgress": 99,
                            "neStatus": "CANCELLING",
                            "neResult": "",
                            "neStartDate": "2013-07-22 17:01",
                            "neEndDate": "",
                            "neComments": "",
                            "activityDetailsList": [
                                {
                                    "activityName": "Install",
                                    "activitySchedule": "Immediate",
                                    "activityStartTime": "2012-07-22 17:01",
                                    "activityEndTime": "2012-07-22 17:03",
                                    "activityResult": "SUCCESS"
                                },
                                {
                                    "activityName": "Upgrade",
                                    "activitySchedule": "Immediate",
                                    "activityStartTime": "2012-08-22 17:01",
                                    "activityEndTime": "2012-08-22 17:03",
                                    "activityResult": "FAILED"
                                },
                                {
                                    "activityName": "SWAdjust",
                                    "activitySchedule": "Manual",
                                    "activityStartTime": "",
                                    "activityEndTime": "",
                                    "activityResult": ""
                                }
                            ]
                        }
                    ]
                }
            };

            options = {
                breadcrumb: [
                    {
                        name: "ENM",
                        url: "#launcher"
                    },
                    {
                        name: "Software Hardware Manager",
                        url: "#shm",
                        children: [
                            {
                                name: "Backup Administration",
                                url: "#shm/backupadministration"
                            },
                            {
                                name: "Hardware Administration",
                                url: "#shm/hardwareadministration"
                            },
                            {
                                name: "Job Details",
                                url: "#shm/jobdetails/1"
                            },
                            {
                                name: "License Administration",
                                url: "#shm/licenseadministration"
                            },
                            {
                                name: "Software Administration",
                                url: "#shm/softwareadministration"
                            }
                        ]
                    },
                    {
                        name: "Job Details",
                        url: "#shm/jobdetails",
                        children: [
                            {
                                name: "Job Logs",
                                url: "#shm/jobdetails/joblogs/1"
                            }
                        ]
                    }
                ],
                namespace: "shm/jobdetails",
                properties: {
                    parent: "shm",
                    script: "shmjobdetails/Shmjobdetails",
                    title: "Job Details",
                    children: [
                        {
                            app: "shmjoblogs",
                            url: "joblogs"
                        }
                    ],
                    helpMode: {},
                    i18N: {
                        locales: ["en-us"]
                    }
                }
            };

            beforeEach(function (done) {
                AppWithInv = core.App.extend({

                    View: core.View.extend({
                        getTemplate: function () {
                            return "<div></div>";
                        }
                    }),

                    onStart: function () {
                        var mainApp = new shmJobDetails({
                            context: this.getContext,
                            breadcrumb: options.breadcrumb,
                            namespace: options.namespace
                        });
                        mainApp.getEventBus = function () {
                            return {
                                context: function () {
                                },
                                subscribe: function () {
                                },
                                publish: function () {
                                }
                            }
                        };
                        mainApp.getContext = function () {
                            return {
                                eventBus: {
                                    subscribe: function () {
                                    },
                                    publish: function () {
                                    }
                                },
                                _addComponent: function () {
                                }
                            };
                        };
                        mainApp.slidingPanels = {
                            isShown: function (param) {
                                return false;
                            }
                        };

                        this.meJobDetails = new meJobDetails({
                            context: this.getContext(),
                            mainApp: mainApp,
                            header: 'Job Details'
                        });
                        this.meJobDetails.start(this.getElement());
                    }
                });

                currentApp = new AppWithInv();
                server = sinon.fakeServer.create();
                done();
            });

            afterEach(function () {
                server.restore();
                currentApp.stop();
            });

            it('Verifies init() has been called', function (done) {
                sinon.spy(meJobDetails.prototype, "init");
                currentApp.start(document.getElementById('bitContainer'));
                expect(currentApp.meJobDetails.init.called).to.equal(true);
                meJobDetails.prototype.init.restore();
                done();
            });

            it('Verifies onStart() has been called', function (done) {
                sinon.spy(meJobDetails.prototype, "onStart");
                currentApp.start(document.getElementById('bitContainer'));
                expect(currentApp.meJobDetails.onStart.called).to.equal(true);
                meJobDetails.prototype.onStart.restore();
                done();
            });


            it('Verifies meJobDetailsTableSortHandler() has been called', function (done) {
                sinon.stub(meJobDetails.prototype, "meJobDetailsTableSortHandler");
                currentApp.start(document.getElementById('bitContainer'));
                var column = "neNodeName";
                var order = "asc";
                currentApp.meJobDetails.meJobDetailsTableSortHandler(column, order);
                expect(currentApp.meJobDetails.meJobDetailsTableSortHandler.calledWith(column, order)).to.equal(true);
                meJobDetails.prototype.meJobDetailsTableSortHandler.restore();
                done();
            });


            it('Verifies parseJobIdIntoRequest() has been called', function (done) {
                sinon.stub(meJobDetails.prototype, "parseJobIdIntoRequest");
                currentApp.start(document.getElementById('bitContainer'));
                var jobId = 123;
                currentApp.meJobDetails.parseJobIdIntoRequest(jobId);
                expect(currentApp.meJobDetails.parseJobIdIntoRequest.calledWith(jobId)).to.equal(true);
                meJobDetails.prototype.parseJobIdIntoRequest.restore();
                done();
            });


            it('Verifies fetchMeJobDetails() has been called', function (done) {
                sinon.stub(meJobDetails.prototype, "fetchMeJobDetails");
                currentApp.start(document.getElementById('bitContainer'));
                currentApp.meJobDetails.fetchMeJobDetails();
                expect(currentApp.meJobDetails.fetchMeJobDetails.called).to.equal(true);
                meJobDetails.prototype.fetchMeJobDetails.restore();
                done();
            });


            it('Verifies buildMeJobPayload() has been called', function (done) {
                sinon.spy(meJobDetails.prototype, "buildMeJobPayload");
                currentApp.start(document.getElementById('bitContainer'));
                var pageNumber = 1;
                var sortBy = "neNodeName";
                var orderBy = "asc";
                currentApp.meJobDetails.buildMeJobPayload(pageNumber, sortBy, orderBy);
                expect(currentApp.meJobDetails.buildMeJobPayload.calledWith(pageNumber, sortBy, orderBy)).to.equal(true);
                meJobDetails.prototype.buildMeJobPayload.restore();
                done();
            });


            it('Verifies clearPreviousMeJobDetails() has been called', function (done) {
                sinon.spy(meJobDetails.prototype, "clearPreviousMeJobDetails");
                currentApp.start(document.getElementById('bitContainer'));

                currentApp.meJobDetails.clearPreviousMeJobDetails();
                expect(currentApp.meJobDetails.clearPreviousMeJobDetails.called).to.equal(true);
                meJobDetails.prototype.clearPreviousMeJobDetails.restore();
                done();
            });


            it('Verifies setJobDetails() has been called', function (done) {
                sinon.spy(meJobDetails.prototype, "setJobDetails");
                currentApp.start(document.getElementById('bitContainer'));

                currentApp.meJobDetails.setJobDetails(response.jobDetails);
                expect(currentApp.meJobDetails.setJobDetails.calledWith(response.jobDetails)).to.equal(true);
                meJobDetails.prototype.setJobDetails.restore();
                done();
            });

            it('Verifies setJobProgress() has been called', function (done) {
                sinon.spy(meJobDetails.prototype, "setJobProgress");
                currentApp.start(document.getElementById('bitContainer'));

                currentApp.meJobDetails.setJobProgress(response.jobDetails);
                expect(currentApp.meJobDetails.setJobProgress.calledWith(response.jobDetails)).to.equal(true);
                meJobDetails.prototype.setJobProgress.restore();
                done();
            });

            it('Verifies setJobResult() has been called', function (done) {
                sinon.spy(meJobDetails.prototype, "setJobResult");
                currentApp.start(document.getElementById('bitContainer'));

                currentApp.meJobDetails.setJobResult(response.jobDetails);
                expect(currentApp.meJobDetails.setJobResult.calledWith(response.jobDetails)).to.equal(true);
                meJobDetails.prototype.setJobResult.restore();
                done();
            });

            it('Verifies redrawPaginationForMeJobDetails() has been called', function (done) {
                sinon.spy(meJobDetails.prototype, "redrawPaginationForMeJobDetails");
                currentApp.start(document.getElementById('bitContainer'));

                currentApp.meJobDetails.redrawPaginationForMeJobDetails(response.neDetails.totalCount);
                expect(currentApp.meJobDetails.redrawPaginationForMeJobDetails.calledWith(response.neDetails.totalCount)).to.equal(true);
                meJobDetails.prototype.redrawPaginationForMeJobDetails.restore();
                done();
            });


            it('Verifies getOffSetAndLimit() has been called', function (done) {
                sinon.spy(meJobDetails.prototype, "getOffSetAndLimit");
                currentApp.start(document.getElementById('bitContainer'));
                var totalRows = 10;
                var Offset = 1;
                var totalCount = 10;
                currentApp.meJobDetails.getOffSetAndLimit(totalRows, Offset, totalCount);
                expect(currentApp.meJobDetails.getOffSetAndLimit.calledWith(totalRows, Offset, totalCount)).to.equal(true);
                meJobDetails.prototype.getOffSetAndLimit.restore();
                done();
            });

            it('Verifies clearMenu() has been called', function (done) {
                sinon.spy(meJobDetails.prototype, "clearMenu");
                currentApp.start(document.getElementById('bitContainer'));
                currentApp.meJobDetails.clearMenu();
                expect(currentApp.meJobDetails.clearMenu.called).to.equal(true);
                meJobDetails.prototype.clearMenu.restore();
                done();
            });

            it('Verifies context actions when 3 rows are selected.', function (done) {
                sandbox.stub(meJobDetails.prototype, "subscribeWebpush");
                currentApp.start(core.Element.wrap(document.querySelector('#bitContainer')));

                /*
                * Pass some value to parseJobIdIntoRequest method so that rest call
                * will be triggered and response will be returned from fakeServer.
                * */

                currentApp.meJobDetails.parseJobIdIntoRequest(1);
                server.requests[0].respond(
                    200,
                    {
                        "Content-Type": "application/json"
                    },
                    JSON.stringify(response)
                );

                /*
                * neJobId: state
                * 1 : RUNNING
                * 4 : CANCELLED
                * 15 : CANCELLING
                * */

                var idsToBeSelected = {
                    1: true,
                    4: true,
                    15: true
                };

                currentApp.meJobDetails.meJobDetailsTable.checkRows(function (row) {
                    return idsToBeSelected[row.options.model.neJobId];
                });

                setTimeout(function () {
                    expect(currentApp.meJobDetails.meJobDetailsTable.getData().length).to.equal(16);
                    expect(currentApp.meJobDetails.selectedJobsArray.length).to.equal(3);
                    expect(currentApp.meJobDetails.selectedJobsArrayOfModels.length).to.equal(3);
                    expect(currentApp.meJobDetails.actions.length).to.equal(2);
                    expect(currentApp.meJobDetails.actions[0][0].options.caption).to.equal("Create a Job");
                    meJobDetails.prototype.subscribeWebpush.restore();
                    done();
                }, 100);
            });

            it("Verifies quick action bar actions when some rows are selected and de selected.", function (done) {
                currentApp.start(core.Element.wrap(document.querySelector('#bitContainer')));

                sandbox.stub(meJobDetails.prototype, "subscribeWebpush");
                /*
                 * Pass some value to parseJobIdIntoRequest method so that rest call
                 * will be triggered and response will be returned from fakeServer
                 * */
                currentApp.meJobDetails.parseJobIdIntoRequest(5);
                server.requests[0].respond(
                    200,
                    {
                        "Content-Type": "application/json"
                    },
                    JSON.stringify(response)
                );

                /*15th job is in completed state.*/
                var idsToBeSelected = {15: true};
                currentApp.meJobDetails.meJobDetailsTable.checkRows(function (row) {
                    return idsToBeSelected[row.options.model.neJobId];
                });
                setTimeout(function () {
                    expect(currentApp.meJobDetails.actions.length).to.equal(2);
                    expect(currentApp.meJobDetails.actions[0].length).to.equal(2);
                    expect(currentApp.meJobDetails.actions[0][0].type).to.equal("dropdown");
                    expect(currentApp.meJobDetails.actions[0][0].options.caption).to.equal("Create a Job");
                    expect(currentApp.meJobDetails.actions[0][0].options.items.length).to.equal(4);
                    expect(currentApp.meJobDetails.actions[0][1].name).to.equal("Node Activities");
                    expect(currentApp.meJobDetails.actions[1][0].name).to.equal("View Job Logs");
                    expect(currentApp.meJobDetails.actions[1][1].name).to.equal("Clear Selection");

                    var pageLimitValue = {
                        name: 10,
                        value: 10,
                        title: 10
                    };
                    currentApp.meJobDetails.pageLimit.setValue(pageLimitValue);
                    currentApp.meJobDetails.pageLimit.trigger("change");
                    var remainingResult = response.neDetails.result.splice(pageLimitValue.value, response.neDetails.result.length - pageLimitValue.value);
                    server.requests[1].respond(
                        200,
                        {
                            "Content-Type": "application/json"
                        },
                        JSON.stringify(response)
                    );
                    expect(currentApp.meJobDetails.meJobDetailsTable.getData().length).to.equal(10);
                    expect(currentApp.meJobDetails.actions.length).to.equal(2);
                    expect(currentApp.meJobDetails.actions[0].length).to.equal(2);
                    expect(currentApp.meJobDetails.actions[0][0].type).to.equal("dropdown");
                    expect(currentApp.meJobDetails.actions[0][0].options.caption).to.equal("Create a Job");
                    expect(currentApp.meJobDetails.meJobDetailsTable.getSelectedRows().length).to.equal(0);
                    expect(currentApp.meJobDetails.selectedJobsArray.length).to.equal(1);
                    expect(currentApp.meJobDetails.selectedJobsArrayOfModels.length).to.equal(1);
                    currentApp.meJobDetails.meJobDetailsPagination.nextPage();
                    response.neDetails.result = remainingResult;
                    server.requests[2].respond(
                        200,
                        {
                            "Content-Type": "application/json"
                        },
                        JSON.stringify(response)
                    );

                    expect(currentApp.meJobDetails.actions[0][0].type).to.equal("dropdown");
                    expect(currentApp.meJobDetails.meJobDetailsTable.getSelectedRows().length).to.equal(1);
                    expect(currentApp.meJobDetails.selectedJobsArray.length).to.equal(1);
                    expect(currentApp.meJobDetails.selectedJobsArrayOfModels.length).to.equal(1);

                    currentApp.meJobDetails.meJobDetailsTable.unselectAllRows();
                    setTimeout(function () {
                        expect(currentApp.meJobDetails.selectedJobsArray.length).to.equal(0);
                        expect(currentApp.meJobDetails.meJobDetailsTable.getSelectedRows().length).to.equal(0);
                        expect(currentApp.meJobDetails.actions.length).to.equal(0);
                        meJobDetails.prototype.subscribeWebpush.restore();
                        done();
                    }, 50);
                }, 200);
            });
        });
    });
});

