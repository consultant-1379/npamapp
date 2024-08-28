/**
 * Created with IntelliJ IDEA.
 * User: tcsdivc
 * Date: 2/11/15
 * Time: 4:57 PM
 * To change this template use File | Settings | File Templates.
 */

define([
    "jscore/core",
    "npamlibrary/accessdenied/accessdenied",
    'widgets/Dialog'
], function(core,accessdenied, Dialog) {
    'use strict';

    describe('Access Denied Widget',function(){

        var accessDeniedWidget, sandbox;

        beforeEach(function(){
            accessDeniedWidget = new accessdenied();
            sandbox = sinon.sandbox.create();
            accessDeniedWidget.dialog = new Dialog();
            sandbox.spy(accessDeniedWidget.dialog, "show");
        });

        afterEach(function(){

        });

        it("checks dialog box is showing in show function", function(){
            accessDeniedWidget.show();
            expect(accessDeniedWidget.dialog.visible).to.equal(true);
            expect(accessDeniedWidget.dialog.show.callCount).to.equal(1);
        });
    });
});
