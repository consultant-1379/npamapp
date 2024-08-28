/**
 * Created with IntelliJ IDEA.
 * User: tcsande
 * Date: 5/19/14
 * Time: 1:08 PM
 * To change this template use File | Settings | File Templates.
 */
define([
    "jscore/core",
    "npamlibrary/displaymessage/displaymessage"
], function(core,displaymessage ) {

    describe('Test the Display Message widget',function(){

        var displaymessageWidget, sandbox, modifierStub, elementStub, viewStub;

        beforeEach(function(done){
            sandbox = sinon.sandbox.create();
            modifierStub ={
                setText:function(){}
            };
            elementStub = {
                find:function(){
                    return modifierStub;
                }
            };
            viewStub={
                getElement: function(){
                    return elementStub;
                }
            };
            displaymessageWidget = new displaymessage();
//            displaymessageWidget.view=viewStub;
            sandbox.spy(modifierStub,'setText');
            sandbox.spy(displaymessageWidget, 'setHeading', function(){

            });
            sandbox.spy(displaymessageWidget, 'setDescription', function(){

            });
            sandbox.spy(displaymessageWidget, 'setCenterPanelDescription', function(){

            });
            done();
        });

        afterEach(function(done){
            sandbox.restore();
            done();
        });


        it('checks Heading is showing as assigned to SetHeading()',function(){
            displaymessageWidget.setHeading("abc");
            expect(displaymessageWidget.setHeading.callCount).to.equal(1);
            expect(displaymessageWidget.view.getElement().find(".eanpamlibrary-wInventoryDetails-DisplayMessage-Heading").getText()).to.equal("abc");
        });

        it('checks Description is showing as assigned to setDescription()',function(){
            displaymessageWidget.setDescription("description");
            expect(displaymessageWidget.setDescription.callCount).to.equal(1);
            expect(displaymessageWidget.view.getElement().find(".eanpamlibrary-wInventoryDetails-DisplayMessage-Description").getText()).to.equal("description");
        });

        it("checks the conditions when setLevel is dialogInfo", function() {
            displaymessageWidget.setLevel("dialogInfo");
            expect(displaymessageWidget.view.getElement().find(".ebIcon").hasModifier("dialogInfo")).to.equal(true);
            expect(displaymessageWidget.view.getElement().find(".ebIcon").hasModifier("warning")).to.equal(false);
            expect(displaymessageWidget.view.getElement().find(".ebIcon").hasModifier("error")).to.equal(false);
        });

        it("checks the conditions when setLevel is warning", function() {
            displaymessageWidget.setLevel("warning");
            expect(displaymessageWidget.view.getElement().find(".ebIcon").hasModifier("dialogInfo")).to.equal(false);
            expect(displaymessageWidget.view.getElement().find(".ebIcon").hasModifier("warning")).to.equal(true);
            expect(displaymessageWidget.view.getElement().find(".ebIcon").hasModifier("error")).to.equal(false);
        });

        it("checks the conditions when setLevel is error", function() {
            displaymessageWidget.setLevel("error");
            expect(displaymessageWidget.view.getElement().find(".ebIcon").hasModifier("dialogInfo")).to.equal(false);
            expect(displaymessageWidget.view.getElement().find(".ebIcon").hasModifier("warning")).to.equal(false);
            expect(displaymessageWidget.view.getElement().find(".ebIcon").hasModifier("error")).to.equal(true);
        });

        it("checks center panel description is showing as assigned to setCenterPanelDescription()", function() {
            displaymessageWidget.setCenterPanelDescription("CenterPanelDescription");
            expect(displaymessageWidget.view.getElement().find(".eanpamlibrary-wInventoryDetails-DisplayMessage-top").getStyle("display")).to.equal("");
            expect(displaymessageWidget.view.getElement().find(".eanpamlibrary-wInventoryDetails-DisplayMessage-top").getStyle("display")).to.equal("");
            expect(displaymessageWidget.view.getElement().find(".eanpamlibrary-wInventoryDetails-DisplayMessage-DescriptionLeft").hasModifier("bordernone")).to.equal(true);
            expect(displaymessageWidget.view.getElement().find(".eanpamlibrary-wInventoryDetails-DisplayMessage-DescriptionLeft").getText()).to.equal("CenterPanelDescription")
        });

    });
});