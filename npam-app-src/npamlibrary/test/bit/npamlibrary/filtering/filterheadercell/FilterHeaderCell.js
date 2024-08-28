define([
    'jscore/core',
    'npamlibrary/filtering/filterheadercell/FilterHeaderCell',
    'widgets/table/Column'

], function (core, FilterHeaderCell, Cell) {
    'use strict';
    describe("FilterHeaderCell", function () {

        describe("Methods", function () {


            var currentApp, AppWithInv;

            beforeEach(function (done) {

                sinon.spy(FilterHeaderCell.prototype, "init");
                AppWithInv = core.App.extend({

                    View: core.View.extend({
                        getTemplate: function () {
                            return "<div></div>";
                        }
                    }),

                    onStart: function () {
                        var column = new Cell({definition: {
                            title: "sdkhfskd"
                        }});
                        this.FilterHeaderCell = new FilterHeaderCell({context: this.getContext(), column: column, eventBus: this.getContext().eventBus})

                    }
                });

                currentApp = new AppWithInv();
                done();
            });

            afterEach(function () {
                currentApp.stop();
                FilterHeaderCell.prototype.init.restore();

            });

            describe('On Starting FilterHeaderCell regions inside the generic App', function () {
                it('Verifies onViewReady() has been called', function () {
                    sinon.spy(FilterHeaderCell.prototype, "onViewReady");
                    currentApp.start(document.getElementById('bitContainer'));
                    expect(currentApp.FilterHeaderCell.onViewReady.callCount).to.equal(1);
                    FilterHeaderCell.prototype.onViewReady.restore();
                });

                it('Verifies setValue() has been called', function () {
                    sinon.spy(FilterHeaderCell.prototype, "setValue");
                    currentApp.start(document.getElementById('bitContainer'));
                    currentApp.FilterHeaderCell.setValue();
                    expect(currentApp.FilterHeaderCell.setValue.callCount).to.equal(1);
                    FilterHeaderCell.prototype.setValue.restore();
                });





            });
        });
    });
});
