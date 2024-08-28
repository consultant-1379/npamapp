define([
    "jscore/core",
    "Npamdeleteneaccountjob/finish/finish",
    "jscore/ext/mvp"

], function (core, Finish, mvp) {
    'use strict';

    describe("Finish", function () {

        describe("Methods",function(){

            var currentApp, AppWithInv;
            beforeEach(function (done) {

                AppWithInv = core.App.extend({

                    View: core.View.extend({
                        getTemplate: function() {
                            return "<div></div>";
                        }
                    }),

                    onStart: function () {
                        this.Finish = new Finish(new mvp.Model());
                    }

                });

                currentApp = new AppWithInv();
                done();
            });

            afterEach(function () {
                currentApp.stop();
            });

            it('Verifies init() has been called',function(done){
                sinon.spy(Finish.prototype,"init");
                currentApp.start(document.getElementById('bitContainer'));
                expect(currentApp.Finish.init.called).to.equal(true);
                Finish.prototype.init.restore();
                done();
            });

            it('Verifies onViewReady() has been called',function(done){
                sinon.spy(Finish.prototype,"onViewReady");
                currentApp.start(document.getElementById('bitContainer'));
                expect(currentApp.Finish.onViewReady.called).to.equal(true);
                Finish.prototype.onViewReady.restore();
                done();
            });

        });
    });
});
