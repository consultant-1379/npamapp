/**
 * Created with IntelliJ IDEA.
 * User: tcsande
 * Date: 5/19/14
 * Time: 1:14 PM
 * To change this template use File | Settings | File Templates.
 */
define([
    "jscore/core",
    "npamlibrary/quicksettings/quicksettings",
    "npamlibrary/quicksettings/quicksettingsview"
], function(core,quicksettings,quicksettingsview ) {
    'use strict';

    describe('Quick Settings',function(){

        it('quicksettings is defined.', function() {
            expect(quicksettings).to.be.defined;
        });

    });

    describe('Quick Settings View',function(){

        it('quicksettingsview is defined.', function() {
            expect(quicksettingsview).to.be.defined;
        });

    });

    describe('Methods', function(){

        describe('rowSelected()',function(){

            var quicksettingsProto, sandbox, modifierStub, elementStub, viewStub;

            beforeEach(function(done){
                sandbox = sinon.sandbox.create();

                modifierStub ={
                    setModifier:function(){},
                    removeModifier: function(){},
                    setText:function(){}
                };

                elementStub = {
                    find:function(){
                        return modifierStub;
                    }
                };

                viewStub={
                    getConfigureButtonInfoPopUp: function(){
                        return modifierStub;
                    },

                    getQuickSettingsHeading: function(){
                        return modifierStub;
                    },

                    getQuickSettingsIcon: function(){
                        return modifierStub;
                    },
                    getSelectedDetails: function(){
                        return modifierStub;
                    },

                    setTotalSelectedCount: function(){},
                    setTotalCount: function(){},
                    getConfigureButton: function(){},
                    getConfigureTableHolder: function(){},
                    getCancelButton: function(){},
                    getOkButton: function(){}
                };

                quicksettingsProto = new quicksettings();
                quicksettingsProto.view=viewStub;

                sandbox.spy(modifierStub,'setText');
                sandbox.spy(modifierStub,'removeModifier');
                sandbox.spy(modifierStub,'setModifier');

                sandbox.spy(viewStub,'setTotalSelectedCount');
                sandbox.spy(viewStub,'setTotalCount');
                sandbox.spy(viewStub,'getConfigureButton');
                sandbox.spy(viewStub,'getConfigureTableHolder');
                sandbox.spy(viewStub,'getCancelButton');
                sandbox.spy(viewStub,'getOkButton');
                done();
            });

            afterEach(function(done){
                sandbox.restore();
                done();
            });

            it('checks setTotalSelectedCount() is called on view',function(){
                quicksettingsProto.rowSelected();
                expect(viewStub.setTotalSelectedCount.callCount).to.equal(1);
            });

            it('checks setTotalSelectedCount() is called on view and totalSelected is incremented',function(){
                quicksettingsProto.rowSelected();
                expect(quicksettingsProto.totalSelected).to.equal(1);
            });

        });

        describe('rowDeSelected()',function(){

            var quicksettingsProto, sandbox, modifierStub, elementStub, viewStub;

            beforeEach(function(done){
                sandbox = sinon.sandbox.create();

                modifierStub ={
                    setModifier:function(){},
                    removeModifier: function(){},
                    setText:function(){}
                };

                elementStub = {
                    find:function(){
                        return modifierStub;
                    }
                };

                viewStub={
                    getConfigureButtonInfoPopUp: function(){
                        return modifierStub;
                    },

                    getQuickSettingsHeading: function(){
                        return modifierStub;
                    },

                    getQuickSettingsIcon: function(){
                        return modifierStub;
                    },
                    getSelectedDetails: function(){
                        return modifierStub;
                    },

                    setTotalSelectedCount: function(){},
                    setTotalCount: function(){},
                    getConfigureButton: function(){},
                    getConfigureTableHolder: function(){},
                    getCancelButton: function(){},
                    getOkButton: function(){}
                };

                quicksettingsProto = new quicksettings();
                quicksettingsProto.view=viewStub;

                sandbox.spy(modifierStub,'setText');
                sandbox.spy(modifierStub,'removeModifier');
                sandbox.spy(modifierStub,'setModifier');

                sandbox.spy(viewStub,'setTotalSelectedCount');
                sandbox.spy(viewStub,'setTotalCount');
                sandbox.spy(viewStub,'getConfigureButton');
                sandbox.spy(viewStub,'getConfigureTableHolder');
                sandbox.spy(viewStub,'getCancelButton');
                sandbox.spy(viewStub,'getOkButton');
                done();
            });

            afterEach(function(done){
                sandbox.restore();
                done();
            });

            it('checks setTotalSelectedCount() is called on view',function(){
                quicksettingsProto.rowDeSelected();
                expect(viewStub.setTotalSelectedCount.callCount).to.equal(1);
            });

            it('checks setTotalSelectedCount() is called on view and totalSelected is decremented',function(){
                quicksettingsProto.totalSelected = 3;
                quicksettingsProto.rowDeSelected();
                expect(quicksettingsProto.totalSelected).to.equal(2);
            });

        });


        describe('setTotalCount()',function(){

            var quicksettingsProto, sandbox, modifierStub, elementStub, viewStub;

            beforeEach(function(done){
                sandbox = sinon.sandbox.create();

                modifierStub ={
                    setModifier:function(){},
                    removeModifier: function(){},
                    setText:function(){}
                };

                elementStub = {
                    find:function(){
                        return modifierStub;
                    }
                };

                viewStub={
                    getConfigureButtonInfoPopUp: function(){
                        return modifierStub;
                    },

                    getQuickSettingsHeading: function(){
                        return modifierStub;
                    },

                    getQuickSettingsIcon: function(){
                        return modifierStub;
                    },
                    getSelectedDetails: function(){
                        return modifierStub;
                    },

                    setTotalSelectedCount: function(){},
                    setTotalCount: function(){},
                    getConfigureButton: function(){},
                    getConfigureTableHolder: function(){},
                    getCancelButton: function(){},
                    getOkButton: function(){}
                };

                quicksettingsProto = new quicksettings();
                quicksettingsProto.view=viewStub;

                sandbox.spy(modifierStub,'setText');
                sandbox.spy(modifierStub,'removeModifier');
                sandbox.spy(modifierStub,'setModifier');

                sandbox.spy(viewStub,'setTotalSelectedCount');
                sandbox.spy(viewStub,'setTotalCount');
                sandbox.spy(viewStub,'getConfigureButton');
                sandbox.spy(viewStub,'getConfigureTableHolder');
                sandbox.spy(viewStub,'getCancelButton');
                sandbox.spy(viewStub,'getOkButton');
                done();
            });

            afterEach(function(done){
                sandbox.restore();
                done();
            });

            it('checks setTotalCount() is called on view',function(){
                quicksettingsProto.setTotalCount(1);
                expect(viewStub.setTotalCount.callCount).to.equal(1);
            });

            it('checks the arguments passed to setTotalCount() called on view',function(){
                quicksettingsProto.setTotalCount(1);
                expect(viewStub.setTotalCount.calledWith(1)).to.equal(true);
            });

        });



        describe('getConfigureButton()',function(){

            var quicksettingsProto, sandbox, modifierStub, elementStub, viewStub;

            beforeEach(function(done){
                sandbox = sinon.sandbox.create();

                modifierStub ={
                    setModifier:function(){},
                    removeModifier: function(){},
                    setText:function(){}
                };

                elementStub = {
                    find:function(){
                        return modifierStub;
                    }
                };

                viewStub={
                    getConfigureButtonInfoPopUp: function(){
                        return modifierStub;
                    },

                    getQuickSettingsHeading: function(){
                        return modifierStub;
                    },

                    getQuickSettingsIcon: function(){
                        return modifierStub;
                    },
                    getSelectedDetails: function(){
                        return modifierStub;
                    },

                    setTotalSelectedCount: function(){},
                    setTotalCount: function(){},
                    getConfigureButton: function(){},
                    getConfigureTableHolder: function(){},
                    getCancelButton: function(){},
                    getOkButton: function(){}
                };

                quicksettingsProto = new quicksettings();
                quicksettingsProto.view=viewStub;

                sandbox.spy(modifierStub,'setText');
                sandbox.spy(modifierStub,'removeModifier');
                sandbox.spy(modifierStub,'setModifier');

                sandbox.spy(viewStub,'setTotalSelectedCount');
                sandbox.spy(viewStub,'setTotalCount');
                sandbox.spy(viewStub,'getConfigureButton');
                sandbox.spy(viewStub,'getConfigureTableHolder');
                sandbox.spy(viewStub,'getCancelButton');
                sandbox.spy(viewStub,'getOkButton');
                done();
            });

            afterEach(function(done){
                sandbox.restore();
                done();
            });

            it('checks getConfigureButton() is called on view',function(){
                quicksettingsProto.getConfigureButton();
                expect(viewStub.getConfigureButton.callCount).to.equal(1);
            });

        });

        describe('getConfigureTableHolder()',function(){

            var quicksettingsProto, sandbox, modifierStub, elementStub, viewStub;

            beforeEach(function(done){
                sandbox = sinon.sandbox.create();

                modifierStub ={
                    setModifier:function(){},
                    removeModifier: function(){},
                    setText:function(){}
                };

                elementStub = {
                    find:function(){
                        return modifierStub;
                    }
                };

                viewStub={
                    getConfigureButtonInfoPopUp: function(){
                        return modifierStub;
                    },

                    getQuickSettingsHeading: function(){
                        return modifierStub;
                    },

                    getQuickSettingsIcon: function(){
                        return modifierStub;
                    },
                    getSelectedDetails: function(){
                        return modifierStub;
                    },

                    setTotalSelectedCount: function(){},
                    setTotalCount: function(){},
                    getConfigureButton: function(){},
                    getConfigureTableHolder: function(){},
                    getCancelButton: function(){},
                    getOkButton: function(){}
                };

                quicksettingsProto = new quicksettings();
                quicksettingsProto.view=viewStub;

                sandbox.spy(modifierStub,'setText');
                sandbox.spy(modifierStub,'removeModifier');
                sandbox.spy(modifierStub,'setModifier');

                sandbox.spy(viewStub,'setTotalSelectedCount');
                sandbox.spy(viewStub,'setTotalCount');
                sandbox.spy(viewStub,'getConfigureButton');
                sandbox.spy(viewStub,'getConfigureTableHolder');
                sandbox.spy(viewStub,'getCancelButton');
                sandbox.spy(viewStub,'getOkButton');
                done();
            });

            afterEach(function(done){
                sandbox.restore();
                done();
            });

            it('checks getConfigureTableHolder() is called on view',function(){
                quicksettingsProto.getConfigureTableHolder();
                expect(viewStub.getConfigureTableHolder.callCount).to.equal(1);
            });

        });


        describe('getCancelButton()',function(){

            var quicksettingsProto, sandbox, modifierStub, elementStub, viewStub;

            beforeEach(function(done){
                sandbox = sinon.sandbox.create();

                modifierStub ={
                    setModifier:function(){},
                    removeModifier: function(){},
                    setText:function(){}
                };

                elementStub = {
                    find:function(){
                        return modifierStub;
                    }
                };

                viewStub={
                    getConfigureButtonInfoPopUp: function(){
                        return modifierStub;
                    },

                    getQuickSettingsHeading: function(){
                        return modifierStub;
                    },

                    getQuickSettingsIcon: function(){
                        return modifierStub;
                    },
                    getSelectedDetails: function(){
                        return modifierStub;
                    },

                    setTotalSelectedCount: function(){},
                    setTotalCount: function(){},
                    getConfigureButton: function(){},
                    getConfigureTableHolder: function(){},
                    getCancelButton: function(){},
                    getOkButton: function(){}
                };

                quicksettingsProto = new quicksettings();
                quicksettingsProto.view=viewStub;

                sandbox.spy(modifierStub,'setText');
                sandbox.spy(modifierStub,'removeModifier');
                sandbox.spy(modifierStub,'setModifier');

                sandbox.spy(viewStub,'setTotalSelectedCount');
                sandbox.spy(viewStub,'setTotalCount');
                sandbox.spy(viewStub,'getConfigureButton');
                sandbox.spy(viewStub,'getConfigureTableHolder');
                sandbox.spy(viewStub,'getCancelButton');
                sandbox.spy(viewStub,'getOkButton');
                done();
            });

            afterEach(function(done){
                sandbox.restore();
                done();
            });

            it('checks getCancelButton() is called on view',function(){
                quicksettingsProto.getCancelButton();
                expect(viewStub.getCancelButton.callCount).to.equal(1);
            });

        });



        describe('getOkButton()',function(){

            var quicksettingsProto, sandbox, modifierStub, elementStub, viewStub;

            beforeEach(function(done){
                sandbox = sinon.sandbox.create();

                modifierStub ={
                    setModifier:function(){},
                    removeModifier: function(){},
                    setText:function(){}
                };

                elementStub = {
                    find:function(){
                        return modifierStub;
                    }
                };

                viewStub={
                    getConfigureButtonInfoPopUp: function(){
                        return modifierStub;
                    },

                    getQuickSettingsHeading: function(){
                        return modifierStub;
                    },

                    getQuickSettingsIcon: function(){
                        return modifierStub;
                    },
                    getSelectedDetails: function(){
                        return modifierStub;
                    },

                    setTotalSelectedCount: function(){},
                    setTotalCount: function(){},
                    getConfigureButton: function(){},
                    getConfigureTableHolder: function(){},
                    getCancelButton: function(){},
                    getOkButton: function(){}
                };

                quicksettingsProto = new quicksettings();
                quicksettingsProto.view=viewStub;

                sandbox.spy(modifierStub,'setText');
                sandbox.spy(modifierStub,'removeModifier');
                sandbox.spy(modifierStub,'setModifier');

                sandbox.spy(viewStub,'setTotalSelectedCount');
                sandbox.spy(viewStub,'setTotalCount');
                sandbox.spy(viewStub,'getConfigureButton');
                sandbox.spy(viewStub,'getConfigureTableHolder');
                sandbox.spy(viewStub,'getCancelButton');
                sandbox.spy(viewStub,'getOkButton');
                done();
            });

            afterEach(function(done){
                sandbox.restore();
                done();
            });

            it('checks getOkButton() is called on view',function(){
                quicksettingsProto.getOkButton();
                expect(viewStub.getOkButton.callCount).to.equal(1);
            });

        });

        describe('setQuickSettingsHeading()',function(){

            var quicksettingsProto, sandbox, modifierStub, elementStub, viewStub;

            beforeEach(function(done){
                sandbox = sinon.sandbox.create();

                modifierStub ={
                    setModifier:function(){},
                    removeModifier: function(){},
                    setText:function(){}
                };

                elementStub = {
                    find:function(){
                        return modifierStub;
                    }
                };

                viewStub={
                    getConfigureButtonInfoPopUp: function(){
                        return modifierStub;
                    },

                    getQuickSettingsHeading: function(){
                        return modifierStub;
                    },

                    getQuickSettingsIcon: function(){
                        return modifierStub;
                    },
                    getSelectedDetails: function(){
                        return modifierStub;
                    },

                    setTotalSelectedCount: function(){},
                    setTotalCount: function(){},
                    getConfigureButton: function(){},
                    getConfigureTableHolder: function(){},
                    getCancelButton: function(){},
                    getOkButton: function(){}
                };

                quicksettingsProto = new quicksettings();
                quicksettingsProto.view=viewStub;

                sandbox.spy(modifierStub,'setText');
                sandbox.spy(modifierStub,'removeModifier');
                sandbox.spy(modifierStub,'setModifier');

                sandbox.spy(viewStub,'setTotalSelectedCount');
                sandbox.spy(viewStub,'setTotalCount');
                sandbox.spy(viewStub,'getConfigureButton');
                sandbox.spy(viewStub,'getConfigureTableHolder');
                sandbox.spy(viewStub,'getCancelButton');
                sandbox.spy(viewStub,'getOkButton');
                done();
            });

            afterEach(function(done){
                sandbox.restore();
                done();
            });

            it('checks setText() is called on getQuickSettingsHeading',function(){
                quicksettingsProto.setQuickSettingsHeading("abc");
                expect(modifierStub.setText.callCount).to.equal(1);
            });

            it('checks arguments passed to setText() called on getQuickSettingsHeading',function(){
                quicksettingsProto.setQuickSettingsHeading("abc");
                expect(modifierStub.setText.calledWith("abc")).to.equal(true);
            });

        });

        describe('hideQuickSettingsIcon()',function(){

            var quicksettingsProto, sandbox, modifierStub, elementStub, viewStub;

            beforeEach(function(done){
                sandbox = sinon.sandbox.create();

                modifierStub ={
                    setModifier:function(){},
                    removeModifier: function(){},
                    setText:function(){}
                };

                elementStub = {
                    find:function(){
                        return modifierStub;
                    }
                };

                viewStub={
                    getConfigureButtonInfoPopUp: function(){
                        return modifierStub;
                    },

                    getQuickSettingsHeading: function(){
                        return modifierStub;
                    },

                    getQuickSettingsIcon: function(){
                        return modifierStub;
                    },
                    getSelectedDetails: function(){
                        return modifierStub;
                    },

                    setTotalSelectedCount: function(){},
                    setTotalCount: function(){},
                    getConfigureButton: function(){},
                    getConfigureTableHolder: function(){},
                    getCancelButton: function(){},
                    getOkButton: function(){}
                };

                quicksettingsProto = new quicksettings();
                quicksettingsProto.view=viewStub;

                sandbox.spy(modifierStub,'setText');
                sandbox.spy(modifierStub,'removeModifier');
                sandbox.spy(modifierStub,'setModifier');

                sandbox.spy(viewStub,'setTotalSelectedCount');
                sandbox.spy(viewStub,'setTotalCount');
                sandbox.spy(viewStub,'getConfigureButton');
                sandbox.spy(viewStub,'getConfigureTableHolder');
                sandbox.spy(viewStub,'getCancelButton');
                sandbox.spy(viewStub,'getOkButton');
                done();
            });

            afterEach(function(done){
                sandbox.restore();
                done();
            });

            it('checks removeModifier() is called on getQuickSettingsIcon',function(){
                quicksettingsProto.hideQuickSettingsIcon();
                expect(modifierStub.removeModifier.callCount).to.equal(1);
            });

            it('checks the arguments passed to removeModifier() called on getQuickSettingsIcon',function(){
                quicksettingsProto.hideQuickSettingsIcon();
                expect(modifierStub.removeModifier.calledWith("show")).to.equal(true);
            });

            it('checks setModifier() is called on getQuickSettingsIcon',function(){
                quicksettingsProto.hideQuickSettingsIcon();
                expect(modifierStub.setModifier.callCount).to.equal(1);
            });

            it('checks the arguments passed to setModifier() called on getQuickSettingsIcon',function(){
                quicksettingsProto.hideQuickSettingsIcon();
                expect(modifierStub.setModifier.calledWith("hide")).to.equal(true);
            });

        });

        describe('showSelectedDetails()',function(){

            var quicksettingsProto, sandbox, modifierStub, elementStub, viewStub;

            beforeEach(function(done){
                sandbox = sinon.sandbox.create();

                modifierStub ={
                    setModifier:function(){},
                    removeModifier: function(){},
                    setText:function(){}
                };

                elementStub = {
                    find:function(){
                        return modifierStub;
                    }
                };

                viewStub={
                    getConfigureButtonInfoPopUp: function(){
                        return modifierStub;
                    },

                    getQuickSettingsHeading: function(){
                        return modifierStub;
                    },

                    getQuickSettingsIcon: function(){
                        return modifierStub;
                    },
                    getSelectedDetails: function(){
                        return modifierStub;
                    },

                    setTotalSelectedCount: function(){},
                    setTotalCount: function(){},
                    getConfigureButton: function(){},
                    getConfigureTableHolder: function(){},
                    getCancelButton: function(){},
                    getOkButton: function(){}
                };

                quicksettingsProto = new quicksettings();
                quicksettingsProto.view=viewStub;

                sandbox.spy(modifierStub,'setText');
                sandbox.spy(modifierStub,'removeModifier');
                sandbox.spy(modifierStub,'setModifier');

                sandbox.spy(viewStub,'setTotalSelectedCount');
                sandbox.spy(viewStub,'setTotalCount');
                sandbox.spy(viewStub,'getConfigureButton');
                sandbox.spy(viewStub,'getConfigureTableHolder');
                sandbox.spy(viewStub,'getCancelButton');
                sandbox.spy(viewStub,'getOkButton');
                done();
            });

            afterEach(function(done){
                sandbox.restore();
                done();
            });

            it('checks removeModifier() is called on getSelectedDetails',function(){
                quicksettingsProto.showSelectedDetails();
                expect(modifierStub.removeModifier.callCount).to.equal(1);
            });

            it('checks the arguments passed to removeModifier() called on getSelectedDetails',function(){
                quicksettingsProto.showSelectedDetails();
                expect(modifierStub.removeModifier.calledWith("hide")).to.equal(true);
            });

            it('checks setModifier() is called on getSelectedDetails',function(){
                quicksettingsProto.showSelectedDetails();
                expect(modifierStub.setModifier.callCount).to.equal(1);
            });

            it('checks the arguments passed to setModifier() called on getSelectedDetails',function(){
                quicksettingsProto.showSelectedDetails();
                expect(modifierStub.setModifier.calledWith("show")).to.equal(true);
            });

        });

        describe('hideSelectedDetails()',function(){

            var quicksettingsProto, sandbox, modifierStub, elementStub, viewStub;

            beforeEach(function(done){
                sandbox = sinon.sandbox.create();

                modifierStub ={
                    setModifier:function(){},
                    removeModifier: function(){},
                    setText:function(){}
                };

                elementStub = {
                    find:function(){
                        return modifierStub;
                    }
                };

                viewStub={
                    getConfigureButtonInfoPopUp: function(){
                        return modifierStub;
                    },

                    getQuickSettingsHeading: function(){
                        return modifierStub;
                    },

                    getQuickSettingsIcon: function(){
                        return modifierStub;
                    },
                    getSelectedDetails: function(){
                        return modifierStub;
                    },

                    setTotalSelectedCount: function(){},
                    setTotalCount: function(){},
                    getConfigureButton: function(){},
                    getConfigureTableHolder: function(){},
                    getCancelButton: function(){},
                    getOkButton: function(){}
                };

                quicksettingsProto = new quicksettings();
                quicksettingsProto.view=viewStub;

                sandbox.spy(modifierStub,'setText');
                sandbox.spy(modifierStub,'removeModifier');
                sandbox.spy(modifierStub,'setModifier');

                sandbox.spy(viewStub,'setTotalSelectedCount');
                sandbox.spy(viewStub,'setTotalCount');
                sandbox.spy(viewStub,'getConfigureButton');
                sandbox.spy(viewStub,'getConfigureTableHolder');
                sandbox.spy(viewStub,'getCancelButton');
                sandbox.spy(viewStub,'getOkButton');
                done();
            });

            afterEach(function(done){
                sandbox.restore();
                done();
            });

            it('checks removeModifier() is called on getSelectedDetails',function(){
                quicksettingsProto.hideSelectedDetails();
                expect(modifierStub.removeModifier.callCount).to.equal(1);
            });

            it('checks the arguments passed to removeModifier() called on getSelectedDetails',function(){
                quicksettingsProto.hideSelectedDetails();
                expect(modifierStub.removeModifier.calledWith("show")).to.equal(true);
            });

            it('checks setModifier() is called on getSelectedDetails',function(){
                quicksettingsProto.hideSelectedDetails();
                expect(modifierStub.setModifier.callCount).to.equal(1);
            });

            it('checks the arguments passed to setModifier() called on getSelectedDetails',function(){
                quicksettingsProto.hideSelectedDetails();
                expect(modifierStub.setModifier.calledWith("hide")).to.equal(true);
            });

        });


        describe('resetSelectedCount()',function(){

            var quicksettingsProto, sandbox, modifierStub, elementStub, viewStub;

            beforeEach(function(done){
                sandbox = sinon.sandbox.create();

                modifierStub ={
                    setModifier:function(){},
                    removeModifier: function(){},
                    setText:function(){}
                };

                elementStub = {
                    find:function(){
                        return modifierStub;
                    }
                };

                viewStub={
                    getConfigureButtonInfoPopUp: function(){
                        return modifierStub;
                    },

                    getQuickSettingsHeading: function(){
                        return modifierStub;
                    },

                    getQuickSettingsIcon: function(){
                        return modifierStub;
                    },
                    getSelectedDetails: function(){
                        return modifierStub;
                    },

                    setTotalSelectedCount: function(){},
                    setTotalCount: function(){},
                    getConfigureButton: function(){},
                    getConfigureTableHolder: function(){},
                    getCancelButton: function(){},
                    getOkButton: function(){}
                };

                quicksettingsProto = new quicksettings();
                quicksettingsProto.view=viewStub;

                sandbox.spy(modifierStub,'setText');
                sandbox.spy(modifierStub,'removeModifier');
                sandbox.spy(modifierStub,'setModifier');

                sandbox.spy(viewStub,'setTotalSelectedCount');
                sandbox.spy(viewStub,'setTotalCount');
                sandbox.spy(viewStub,'getConfigureButton');
                sandbox.spy(viewStub,'getConfigureTableHolder');
                sandbox.spy(viewStub,'getCancelButton');
                sandbox.spy(viewStub,'getOkButton');
                done();
            });

            afterEach(function(done){
                sandbox.restore();
                done();
            });

            it('checks setTotalSelectedCount() is called on view',function(){
                quicksettingsProto.resetSelectedCount();
                expect(viewStub.setTotalSelectedCount.callCount).to.equal(1);
            });

            it('checks arguments passed to setTotalSelectedCount() called on view',function(){
                quicksettingsProto.resetSelectedCount();
                expect(viewStub.setTotalSelectedCount.calledWith(0)).to.equal(true);
            });

            it('checks totalSelected is reset to 0',function(){
                quicksettingsProto.resetSelectedCount();
                expect(quicksettingsProto.totalSelected).to.equal(0);
            });

        });
    });
 });
