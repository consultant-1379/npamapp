
/**
 * Created with IntelliJ IDEA.
 * User: tcsdivc
 * Date: 2/11/15
 * Time: 3:08 PM
 * To change this template use File | Settings | File Templates.*/

define([
    'jscore/core',
    'npamlibrary/accessdenied/accessdenied'
], function (core, accessdenied)  {
    'use strict';

    describe("accessdenied", function (){

        it('Verifies init() has been called', function(){
            sinon.spy(accessdenied.prototype,"init");
            currentApp.start(document.getElementById('bitContainer'));
            expect(accessdenied.prototype.init.callCount).to.equal(1);
        });

        var currentApp, AppWithAccessDenied;

        beforeEach(function (done) {

            AppWithAccessDenied = core.App.extend({

                View: core.View.extend({
                    getTemplate: function() {
                        return "<div></div>";
                    }
                }),

                onStart: function () {
                    this.accessdenied = new accessdenied();
                    this.accessdenied.attachTo(this.getElement());
                }
            });

            currentApp = new AppWithAccessDenied();
            done();
        });

        afterEach(function () {
            currentApp.stop();
        });

        describe('On Access Denined widget inside the generic App',function(){

            it('Verifies show() has been called',function(done){
                sinon.spy(accessdenied.prototype,"show");
                currentApp.start(document.getElementById('bitContainer'));
                currentApp.accessdenied.show();
                expect(currentApp.accessdenied.show.called).to.equal(true);
                accessdenied.prototype.show.restore();
                done();

            });

        });




    });
});
