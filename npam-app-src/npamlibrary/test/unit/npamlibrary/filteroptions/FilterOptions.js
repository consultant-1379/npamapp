define([
    'jscore/core',
    'npamlibrary/filteroptions/FilterOptions'

], function (core, FilterOptions) {
    'use strict';
    describe("FilterOptions", function () {

        describe("Methods", function () {


            describe('onControlReady()', function () {

                var filteroptions, viewStub, sandbox;

                beforeEach(function (done) {

                    sandbox = sinon.sandbox.create();
                    viewStub = {
                        setSelected: function (val) {

                        }
                    };
                    filteroptions = new FilterOptions();
                    sandbox.spy(viewStub, "setSelected");
                    filteroptions.view = viewStub;
                    filteroptions.onControlReady();
                    done();
                });

                afterEach(function (done) {
                    sandbox.restore();
                    done();
                });

                it("checks setSelected has been called", function () {
                    expect(viewStub.setSelected.callCount).to.equal(1);
                });

            });

            describe('onItemSelected()', function () {

                var filteroptions, viewStub, sandbox;

                beforeEach(function (done) {

                    sandbox = sinon.sandbox.create();
                    viewStub = {
                        setSelected: function (val) {

                        }
                    };
                    filteroptions = new FilterOptions();
                    sandbox.spy(viewStub, "setSelected");
                    sandbox.spy(FilterOptions.prototype, "trigger");
                    filteroptions.view = viewStub;
                    filteroptions.onItemSelected({name: "haskdh"});
                    done();
                });

                afterEach(function (done) {
                    sandbox.restore();
                    done();
                });

                it("checks setSelected has been called", function () {
                    expect(viewStub.setSelected.callCount).to.equal(1);
                });
                it("checks trigger has been called", function () {
                    expect(FilterOptions.prototype.trigger.callCount).to.equal(1);
                });

            });

            describe('getValue()', function () {

                var filteroptions, viewStub, sandbox;

                beforeEach(function (done) {

                    sandbox = sinon.sandbox.create();
                    viewStub = {
                        getSelected: function (val) {

                        }
                    };
                    filteroptions = new FilterOptions();
                    sandbox.spy(viewStub, "getSelected");
                    filteroptions.view = viewStub;
                    filteroptions.getValue();
                    done();
                });

                afterEach(function (done) {
                    sandbox.restore();
                    done();
                });

                it("checks setSelected has been called", function () {
                    expect(viewStub.getSelected.callCount).to.equal(1);
                });

            });

        });
    });
});



