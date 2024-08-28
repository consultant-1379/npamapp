define([
    'jscore/core',
    'npamlibrary/filtering/filteroptions/FilterOptions'

], function (core, FilterOptions) {
    'use strict';
    describe("FilterOptions", function () {

        describe("Methods", function () {


            var currentApp, AppWithInv;

            beforeEach(function (done) {

                sinon.spy(FilterOptions.prototype, "init");
                AppWithInv = core.App.extend({

                    View: core.View.extend({
                        getTemplate: function () {
                            return "<div></div>";
                        }
                    }),

                    onStart: function () {

                        this.FilterOptions = new FilterOptions({context: this.getContext()});

                    }
                });

                currentApp = new AppWithInv();
                done();
            });

            afterEach(function () {
                currentApp.stop();
                FilterOptions.prototype.init.restore();

            });

            describe('On Starting FilterOptions regions inside the generic App', function () {
                it('Verifies onControlReady() has been called', function () {
                    sinon.spy(FilterOptions.prototype, "onControlReady");
                    currentApp.start(document.getElementById('bitContainer'));
                    expect(currentApp.FilterOptions.onControlReady.callCount).to.equal(1);
                    FilterOptions.prototype.onControlReady.restore();
                });

                it('Verifies onItemSelected() has been called', function () {

                    sinon.stub(FilterOptions.prototype, "onItemSelected");
                    currentApp.start(document.getElementById('bitContainer'));
                    currentApp.FilterOptions.onItemSelected();
                    expect(currentApp.FilterOptions.onItemSelected.callCount).to.equal(1);
                    FilterOptions.prototype.onItemSelected.restore();
                });

                it('Verifies getValue() has been called', function () {

                    sinon.stub(FilterOptions.prototype, "getValue");
                    currentApp.start(document.getElementById('bitContainer'));
                    currentApp.FilterOptions.getValue();
                    expect(currentApp.FilterOptions.getValue.callCount).to.equal(1);
                    FilterOptions.prototype.getValue.restore();
                });

            });
        });
    });
});



