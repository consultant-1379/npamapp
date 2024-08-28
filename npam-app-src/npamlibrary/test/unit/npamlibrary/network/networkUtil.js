define([
    "jscore/core",
    'npamlibrary/ext/networkUtil',
    'applib/LaunchContext'
], function (core, networkUtil, LaunchContext) {
    'use strict';

    describe("npamlibrary/ext/networkUtil.js", function () {
        var sandbox, objectUnderTest;
        beforeEach(function(){
            sandbox = sinon.sandbox.create();
            objectUnderTest = new Object(networkUtil);
            objectUnderTest.parent = '';
            window.location.hash = 'npam/page';
        });
        afterEach(function(){
            sandbox.restore();
            objectUnderTest = undefined;
        });
        describe("loadNodesHandler()", function () {
            describe("given queryString", function () {
                describe("with invalid value", function () {
                    ['',undefined,null,{},[],'-1',0].forEach(function(testCase) {
                        describe("launchContextId="+testCase, function () {
                            it("then do not call fetchNodesFromLaunchContext", function () {
                                // ARRANGE
                                sandbox.stub(objectUnderTest, 'fetchNodesFromLaunchContext');
                                // ACT
                                objectUnderTest.loadNodesHandler('launchContextId='+testCase);
                                // ASSERT
                                expect(objectUnderTest.fetchNodesFromLaunchContext.callCount).to.equal(0);
                            });
                        });
                    });
                });
                describe("with valid value", function () {
                    [123456789,'123456789','1'].forEach(function(testCase) {
                        describe("launchContextId="+testCase, function () {
                            it("then call fetchNodesFromLaunchContext with value "+testCase, function () {
                                // ARRANGE
                                sandbox.stub(objectUnderTest, 'fetchNodesFromLaunchContext');
                                // ACT
                                objectUnderTest.loadNodesHandler('launchContextId='+testCase);
                                // ASSERT
                                expect(objectUnderTest.fetchNodesFromLaunchContext.callCount).to.equal(1);
                            });
                        });
                    });
                });
            });
        });
        describe("fetchNodesFromLaunchContext()", function () {
            var eventBusStub;
            beforeEach(function(){
                eventBusStub = sinon.createStubInstance(core.EventBus);
                objectUnderTest.parent = {
                    getEventBus: function() {
                        return eventBusStub;
                    }
                };
                sandbox.stub(objectUnderTest, 'addResponseToPoIdsList');
                sandbox.stub(objectUnderTest, 'checkAjaxCountAndLoadData');
            });
            describe("given launchContextId", function () {
                [123456789,'123456789','1'].forEach(function(testCase) {
                    describe("with value = "+testCase, function () {
                        describe("then call LaunchContext.get", function() {
                            describe("when get returns an empty array", function() {
                                it("then publish a loadNodesFromNetExCompleteEvent", function() {
                                    // ARRANGE
                                    var data = {
                                        contents: [] //empty
                                    };
                                    sandbox.stub(LaunchContext, 'get', function(id, callback, errback){
                                        callback(data);
                                    });
                                    // ACT
                                    objectUnderTest.fetchNodesFromLaunchContext();
                                    // ASSERT
                                    expect(objectUnderTest.addResponseToPoIdsList.callCount).to.equal(0);
                                    expect(objectUnderTest.addResponseToPoIdsList.callCount).to.equal(0);
                                    expect(eventBusStub.publish.callCount).to.equal(1);
                                    expect(eventBusStub.publish.getCall(0).args[0]).to.equal('loadNodesFromNetExCompleteEvent');
                                });
                            });
                            describe("when get returns an error", function() {
                                it("then reset the URL", function() {
                                    // ARRANGE
                                    sandbox.stub(LaunchContext, 'get', function(id, callback, errback){
                                        errback();
                                    });
                                    window.location.hash = window.location.hash + '/loadNodes?launchContextId=12345';
                                    // ACT
                                    objectUnderTest.fetchNodesFromLaunchContext();
                                    // ASSERT
                                    expect(objectUnderTest.addResponseToPoIdsList.callCount).to.equal(0);
                                    expect(objectUnderTest.addResponseToPoIdsList.callCount).to.equal(0);
                                    expect(eventBusStub.publish.callCount).to.equal(0);
                                    expect(window.location.hash).to.equal('#npam/page');
                                });
                            });
                            describe("when get returns an valid array", function() {
                                it("then call addResponseToPoIdsList() and checkAjaxCountAndLoadData()", function() {
                                    // ARRANGE
                                    var data = {
                                        contents: [{}] //not empty
                                    };
                                    sandbox.stub(LaunchContext, 'get', function(id, callback, errback){
                                        callback(data);
                                    });
                                    // ACT
                                    objectUnderTest.fetchNodesFromLaunchContext();
                                    // ASSERT
                                    expect(objectUnderTest.addResponseToPoIdsList.callCount).to.equal(1);
                                    expect(objectUnderTest.addResponseToPoIdsList.getCall(0).args[0]).to.equal(data.contents);
                                    expect(objectUnderTest.addResponseToPoIdsList.getCall(0).args[1]).to.equal(true);
                                    expect(objectUnderTest.addResponseToPoIdsList.callCount).to.equal(1);
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});