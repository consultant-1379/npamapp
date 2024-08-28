define([
    'jscore/core',
    'shmjobdetails/regions/comments/comments'

], function (core, comments) {
    'use strict';

    describe("Comments", function () {

        describe("Methods",function(){
            var currentApp, AppWithInv;

            beforeEach(function (done) {
                sinon.spy(comments.prototype,"init");
                AppWithInv = core.App.extend({

                    View: core.View.extend({
                        getTemplate: function() {
                            return "<div></div>";
                        }
                    }),

                    onStart: function () {
                        this.comments = new comments({context: this.getContext()});
                        this.comments.start(this.getElement());
                    }
                });

                currentApp = new AppWithInv();
                done();
            });

            afterEach(function () {
                comments.prototype.init.restore();
                currentApp.stop();
            });

            describe('On Starting Comments regions inside the generic App',function(){

                it('Verifies onStart() has been called',function(){
                    sinon.spy(comments.prototype,"onStart");
                    currentApp.start(document.getElementById('bitContainer'));
                    expect(currentApp.comments.onStart.callCount).to.equal(1);
                    comments.prototype.onStart.restore();
                });

                /*it('Verifies setJobId() has been called on subscribing setJobId',function(){
                    sinon.spy(comments.prototype,"setJobId");
                    currentApp.start(document.getElementById('bitContainer'));
                    currentApp.getContext().eventBus.subscribe("setJobId");
                    expect(currentApp.comments.setJobId.callCount).to.equal(1);
                    comments.prototype.setJobId.restore();
                });*/
            });

        });
    });
});