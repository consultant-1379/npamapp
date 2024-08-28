/**
 * Created with IntelliJ IDEA.
 * User: tcsdivc
 * Date: 2/11/15
 * Time: 4:17 PM
 * To change this template use File | Settings | File Templates.
 */



define([
    'jscore/core',
    'npamlibrary/tablesettings/tablesettings'
], function (core, tablesettings)  {
    'use strict';

    describe("tablesettings", function (){


        var currentApp, AppWithTableSettings;

        beforeEach(function (done) {

            AppWithTableSettings = core.App.extend({

                View: core.View.extend({
                    getTemplate: function() {
                        return "<div></div>";
                    }
                }),

                onStart: function () {
                    this.tablesettings = new tablesettings(this.options);
                }
            });

            currentApp = new AppWithTableSettings();
            done();
        });

        afterEach(function () {
            currentApp.stop();
        });

        describe('On Table Settings widget inside the generic App',function(){

            it('Verifies init() has been called',function(done){
                sinon.spy(tablesettings.prototype,"init");
                currentApp.start(document.getElementById('bitContainer'));
                expect(currentApp.tablesettings.init.called).to.equal(true);
                tablesettings.prototype.init.restore();
                done();

            });

            it('Verifies onStart() has been called',function(done){
                sinon.stub(tablesettings.prototype,"onStart");
                currentApp.start(document.getElementById('bitContainer'));
                currentApp.tablesettings.onStart();
                expect(currentApp.tablesettings.onStart.called).to.equal(true);
                tablesettings.prototype.onStart.restore();
                done();

            });

            it('Verifies controlIfSelectedNone() has been called',function(done){
                sinon.stub(tablesettings.prototype,"controlIfSelectedNone");
                currentApp.start(document.getElementById('bitContainer'));
                currentApp.tablesettings.controlIfSelectedNone();
                expect(currentApp.tablesettings.controlIfSelectedNone.called).to.equal(true);
                tablesettings.prototype.controlIfSelectedNone.restore();
                done();

            });

            it('Verifies setHeader() has been called',function(done){
                sinon.stub(tablesettings.prototype,"setHeader");
                currentApp.start(document.getElementById('bitContainer'));
                currentApp.tablesettings.setHeader();
                expect(currentApp.tablesettings.setHeader.called).to.equal(true);
                tablesettings.prototype.setHeader.restore();
                done();

            });

            it('Verifies hideHeader() has been called',function(done){
                sinon.stub(tablesettings.prototype,"hideHeader");
                currentApp.start(document.getElementById('bitContainer'));
                currentApp.tablesettings.hideHeader();
                expect(currentApp.tablesettings.hideHeader.called).to.equal(true);
                tablesettings.prototype.hideHeader.restore();
                done();

            });

        });




    });
});

