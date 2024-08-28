/**
 * Created with IntelliJ IDEA.
 * User: tcsande
 * Date: 5/13/14
 * Time: 5:40 PM
 * To change this template use File | Settings | File Templates.
 */
define([
    'jscore/core',
    'npamlibrary/displaymessage/displaymessage'
], function (core, displaymessage)  {
    'use strict';

    describe("display message", function() {

        it('Verifies init() has been called', function(){
            sinon.spy(displaymessage.prototype,"init");
            currentApp.start(document.getElementById('bitContainer'));
            expect(displaymessage.prototype.init.callCount).to.equal(1);
        });

        var currentApp, AppWithDisplayMessage;

        beforeEach(function (done) {

            AppWithDisplayMessage = core.App.extend({

                View: core.View.extend({
                    getTemplate: function() {
                        return "<div></div>";
                    }
                }),

                onStart: function () {
                    this.displaymessage = new displaymessage(this.getEventBus());
                    this.displaymessage.attachTo(this.getElement());
                }
            });

            currentApp = new AppWithDisplayMessage();
            done();
        });

        afterEach(function () {
            currentApp.stop();
        });

        describe('On setHeading',function(){
            it('Verifies setHeading() has been called',function(done){
                sinon.spy(displaymessage.prototype,"setHeading");
                currentApp.start(document.getElementById('bitContainer'));
                currentApp.displaymessage.setHeading();
                expect(currentApp.displaymessage.setHeading.called).to.equal(true);
                displaymessage.prototype.setHeading.restore();
                done();
            });
        });

        describe('On setDescription',function(){
            it('Verifies setDescription() has been called',function(done){
                sinon.spy(displaymessage.prototype,"setDescription");
                currentApp.start(document.getElementById('bitContainer'));
                currentApp.displaymessage.setDescription();
                expect(currentApp.displaymessage.setDescription.called).to.equal(true);
                displaymessage.prototype.setDescription.restore();
                done();
            });
        });

        describe('On setLevel',function(){
            it('Verifies setLevel() has been called',function(done){
                sinon.spy(displaymessage.prototype,"setLevel");
                currentApp.start(document.getElementById('bitContainer'));
                currentApp.displaymessage.setLevel();
                expect(currentApp.displaymessage.setLevel.called).to.equal(true);
                displaymessage.prototype.setLevel.restore();
                done();
            });
        });

    });
});
