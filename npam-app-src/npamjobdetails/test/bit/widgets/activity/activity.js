/**
 * Created with IntelliJ IDEA.
 * User: tcsvina
 * Date: 4/14/16
 * Time: 6:44 PM
 * To change this template use File | Settings | File Templates.
 */
define([
    "jscore/core",
    "shmjobdetails/widgets/activity/activity",
    "jscore/ext/mvp"
], function (core, nodeActivity, mvp) {
    'use strict';

    describe("Node Activity", function () {

        describe("Methods",function(){

            var activity = [{
                "LicenseKeyFile": "erbs2key.xml",
                "activityEndTime": "2012-07-22 17:03",
                "activityName": "upgrade",
                "activityResult": "SUCCESS",
                "activitySchedule": "Immediate",
                "activityStartTime": "2012-07-22 17:01"
            }];
            var upgradeType = "update";

            var currentApp, AppWithInv;

            beforeEach(function (done) {

                AppWithInv = core.App.extend({

                    View: core.View.extend({
                        getTemplate: function() {
                            return "<div></div>";
                        }
                    }),

                    setActivity: function () {
                        this.nodeActivity = new nodeActivity({context: this.getContext()});
                        this.nodeActivity.setActivity(activity, upgradeType);
                    }
                });

                currentApp = new AppWithInv();
                done();
            });

            afterEach(function () {
                currentApp.stop();
            });

            describe('On setActivity',function(){
                it('Verifies setActivity() has been called',function(done){
                    sinon.stub(nodeActivity.prototype,"setActivity");
                    currentApp.start(document.getElementById('bitContainer'));

                    currentApp.setActivity();
                    expect(currentApp.nodeActivity.setActivity.called).to.equal(true);
                    nodeActivity.prototype.setActivity.restore();
                    done();
                });
            });
        });
    });
});