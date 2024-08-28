/*global define, describe, it, expect */
define([
    'jscore/core',
    'npamJob/Npamjob'
], function (core, Npamjob) {
    'use strict';

    describe('Npamjob', function () {
        it('Npamjob should be defined', function () {
            expect(Npamjob).not.to.be.undefined;
        });

    });

    describe('Npamjob', function () {
        it('Verifying onStart() has been called',function(done){
            sinon.spy(Npamjob.prototype,"onStart");
            var sandbox = sinon.sandbox.create();
            var currentApp = new Npamjob({breadcrumb:[]});
            currentApp.start(core.Element.wrap(document.getElementById("bitContainer")));
            expect(currentApp.onStart.callCount).to.equal(1);
            Npamjob.prototype.onStart.restore();
            currentApp.stop();
            done();
        });

        it('Verifying onAppCalled() has been called',function(done){
            var sandbox = sinon.sandbox.create();
            sinon.spy(Npamjob.prototype,"onAppCalled");
            var currentApp = new Npamjob({breadcrumb:[]});
            currentApp.start(core.Element.wrap(document.getElementById("bitContainer")));
            expect(currentApp.onAppCalled.callCount).to.equal(1);
            Npamjob.prototype.onAppCalled.restore();
            currentApp.stop();
            done();
        });

        it('Verifying showtablesettings() has been called',function(done){
            var sandbox = sinon.sandbox.create();
            sinon.spy(Npamjob.prototype,"panelEvents");
            sinon.spy(Npamjob.prototype,"loadRightPanel");
            var currentApp = new Npamjob({breadcrumb:[]});
            currentApp.start(core.Element.wrap(document.getElementById("bitContainer")));
            currentApp.panelEvents('tableSettings');
            expect(currentApp.loadRightPanel.callCount).to.equal(1);
            Npamjob.prototype.panelEvents.restore();
            Npamjob.prototype.loadRightPanel.restore();
            currentApp.stop();
            done();
        });

        it('Verifying showsummary() has been called',function(done){
            var sandbox = sinon.sandbox.create();
            sinon.spy(Npamjob.prototype,"panelEvents");
            sinon.spy(Npamjob.prototype,"loadRightPanel");
            var currentApp = new Npamjob({breadcrumb:[]});
            currentApp.start(core.Element.wrap(document.getElementById("bitContainer")));
            currentApp.panelEvents('jobSummary');
            expect(currentApp.loadRightPanel.callCount).to.equal(1);
            Npamjob.prototype.panelEvents.restore();
            Npamjob.prototype.loadRightPanel.restore();
            currentApp.stop();
            done();
        });

//        it('Verifying showAccessDenied() has been called',function(done){
//            var sandbox = sinon.sandbox.create();
//            sinon.spy(Npamjob.prototype,"showAccessDenied");
//            var currentApp = new Npamjob({breadcrumb:[]});
//            currentApp.start(core.Element.wrap(document.getElementById("bitContainer")));
//            var server = sinon.fakeServer.create();
//            currentApp.onAppCalled();
//            server.respondWith("GET", "/oss/shm/rest/rbac/viewjobs",
//                [403,{},'response']);
//            server.respond();
//            expect(currentApp.showAccessDenied.callCount).to.equal(1);
//            Webpush.subscribe.restore();
//            server.restore();
//            done();
//        });
    });

});
