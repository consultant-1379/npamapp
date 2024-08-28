define([
    'jscore/core',
    'npamjobdetails/Npamjobdetails',
    "npamjobdetails/regions/mejobdetails/mejobdetails"
], function (core, Npamjobdetails, MeJobDetails) {
    'use strict';

    describe('Npamjobdetails', function () {

        it('Npamjobdetails should be defined', function () {
            expect(Npamjobdetails).not.to.be.undefined;
        });

    });

    describe('Npamjobdetails', function () {
        var options = {
            breadcrumb: [{
                name: "ENM",
                url: "#launcher"
            }, {
                name: "Software Hardware Manager",
                url: "#shm",
                children: [{
                    name: "Backup Administration",
                    url: "#shm/backupadministration"
                }, {
                    name: "Hardware Administration",
                    url: "#shm/hardwareadministration"
                }, {
                    name: "Job Details",
                    url: "#shm/jobdetails/1"
                }, {
                    name: "License Administration",
                    url: "#shm/licenseadministration"
                }, {
                    name: "Software Administration",
                    url: "#shm/softwareadministration"
                }]
            }, {
                name: "Job Details",
                url: "#shm/jobdetails",
                children: [{
                    name: "Job Logs",
                    url: "#shm/jobdetails/joblogs/1"
                }]
            }],
            namespace: "shm/jobdetails",
            properties: {
                parent: "shm",
                script: "npamjobdetails/Npamjobdetails",
                title: "Job Details",
                children: [{
                    app: "shmjoblogs",
                    url: "joblogs"
                }],
                helpMode: {},
                i18N: {
                    locales: ["en-us"]
                }
            }
        };

        it('Verifying onStart() has been called',function(done){
            sinon.stub(Npamjobdetails.prototype, "onStart");
            var currentApp = new Npamjobdetails();
            currentApp.start(core.Element.wrap(document.getElementById("bitContainer")));
            expect(currentApp.onStart.callCount).to.equal(1);
            Npamjobdetails.prototype.onStart.restore();
            currentApp.stop();
            done();
        });

        it('Verifying panelEvents() has been called',function(done){
            sinon.spy(Npamjobdetails.prototype,"panelEvents");
            sinon.spy(Npamjobdetails.prototype,"loadRightPanel");
            var currentApp = new Npamjobdetails(options);
            currentApp.start(core.Element.wrap(document.getElementById("bitContainer")));
            currentApp.loadApplication();
            currentApp.panelEvents('tableSettings');
            expect(currentApp.loadRightPanel.callCount).to.equal(1);
            Npamjobdetails.prototype.panelEvents.restore();
            Npamjobdetails.prototype.loadRightPanel.restore();
            currentApp.stop();
            done();
        });

        it('Verifying nodeActivities has been called',function(done){
            var Context = {
                eventBus: {
                    publish: function() {},
                    subscribe: function() {}
                }
            };
            Npamjobdetails.prototype.meJobDetails =  new MeJobDetails({
                context: Context
            });
            sinon.spy(Npamjobdetails.prototype,"panelEvents");
            sinon.spy(Npamjobdetails.prototype,"loadRightPanel");
            var currentApp = new Npamjobdetails(options);
            currentApp.start(core.Element.wrap(document.getElementById("bitContainer")));
            currentApp.panelEvents('nodeActivities');
            expect(currentApp.loadRightPanel.callCount).to.equal(1);
            Npamjobdetails.prototype.panelEvents.restore();
            Npamjobdetails.prototype.loadRightPanel.restore();
            currentApp.stop();
            done();
        });

        it('Verifying showcomments() has been called',function(done){
            var currentApp = new Npamjobdetails(options);
            var context = {
                eventBus: {
                    publish: function() {
                    },
                    subscribe: function() {
                    }
                }
            };
            sinon.spy(Npamjobdetails.prototype,"panelEvents");
            sinon.spy(Npamjobdetails.prototype,"loadRightPanel");
            currentApp.meJobDetails = new MeJobDetails({
                context: context
            });
            currentApp.start(core.Element.wrap(document.getElementById("bitContainer")));
            currentApp.panelEvents('jobComments');
            expect(currentApp.loadRightPanel.callCount).to.equal(1);
            Npamjobdetails.prototype.panelEvents.restore();
            Npamjobdetails.prototype.loadRightPanel.restore();
            currentApp.stop();
            done();
        });
    });
});
