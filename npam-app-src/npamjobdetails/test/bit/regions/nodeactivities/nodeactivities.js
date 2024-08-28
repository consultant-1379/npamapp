
define([
    "jscore/core",
    "shmjobdetails/regions/nodeactivities/nodeactivities",
    "jscore/ext/mvp"
], function (core, nodeActivities, mvp) {
    'use strict';

    describe("Node Activities", function () {

        describe("Methods",function(){

            var response = {
                    "result":
                        {
                            "neJobId": 1,
                            "neNodeName": "eNodeB 1",
                            "neActivity":"Install",
                            "neProgress":0,
                            "neStatus":"RUNNING",
                            "neResult":"",
                            "neStartDate":"2012-07-22 17:01",
                            "neEndDate":"",
                            "neComments": "",
                            "activityDetailsList":[
                                {
                                    "activityName":"Install",
                                    "activitySchedule":"Immediate",
                                    "activityStartTime":"2012-07-22 17:01",
                                    "activityEndTime":"2012-07-22 17:03",
                                    "activityResult":"SUCCESS"
                                },
                                {
                                    "activityName":"Upgrade",
                                    "activitySchedule":"Immediate",
                                    "activityStartTime":"2012-08-22 17:01",
                                    "activityEndTime":"2012-08-22 17:03",
                                    "activityResult":"FAILED"
                                },
                                {
                                    "activityName":"SWAdjust",
                                    "activitySchedule":"Manual",
                                    "activityStartTime":"",
                                    "activityEndTime":"",
                                    "activityResult":""
                                }
                            ]
                        }
            };


            var currentApp, AppWithInv;

            beforeEach(function (done) {

                AppWithInv = core.App.extend({

                    View: core.View.extend({
                        getTemplate: function() {
                            return "<div></div>";
                        }
                    }),

                    onStart: function () {
                        this.nodeActivities = new nodeActivities({context: this.getContext()});
                        this.nodeActivities.start(this.getElement());
                    }
                });

                currentApp = new AppWithInv();
                done();
            });

            afterEach(function () {
                currentApp.stop();
            });

            describe('On publishing onStart',function(){
                it('Verifies onStart() has been called',function(done){
                    sinon.spy(nodeActivities.prototype,"onStart");
                    currentApp.start(document.getElementById('bitContainer'));

                    currentApp.nodeActivities.onStart();
                    expect(currentApp.nodeActivities.onStart.called).to.equal(true);
                    nodeActivities.prototype.onStart.restore();
                    done();
                });

            });
        });
    });
});