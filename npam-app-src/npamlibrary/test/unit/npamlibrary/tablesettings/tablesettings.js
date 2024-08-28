/**
 * Created with IntelliJ IDEA.
 * User: tcsvina
 * Date: 8/11/15
 * Time: 4:56 PM
 * To change this template use File | Settings | File Templates.
 */

define([
    "jscore/core",
    "npamlibrary/tablesettings/tablesettings"
], function(core, tablesettings) {
    'use strict';

    describe("Tests the tablesettings widget", function(){
        var tableSettingsWidget, columns, sandbox, eventBusStub;
        beforeEach(function(){
            var options = {};
            sandbox = sinon.sandbox.create();
            eventBusStub = {
                publish: function () {
                }
            };
            sandbox.spy(eventBusStub, 'publish');
            sandbox.stub(tablesettings.prototype, "getEventBus", function () {
                return eventBusStub;
            });
            columns = [
                {
                    title: "Node Name",
                    attribute: "nodeName",
                    sortable: true,
                    initialSortIcon: "asc",
                    resizable: true
                },
                {
                    title: "Name",
                    attribute: "name",
                    sortable: true,
                    initialSortIcon: "asc",
                    resizable: true
                },
                {
                    title: "Product No",
                    attribute: "docNumber",
                    sortable: true,
                    resizable: true
                },
                {
                    title: "Revision",
                    attribute: "docRev",
                    sortable: true,
                    resizable: true
                },
                {
                    title: "Type",
                    attribute: "type",
                    sortable: true,
                    resizable: true
                },
                {
                    title: "State",
                    attribute: "status",
                    sortable: true,
                    resizable: true,
                    visible: true
                }
            ];
            options.columns = columns
            tableSettingsWidget = new tablesettings (options);

        });

        afterEach(function(){
           sandbox.restore();
        });

        it("checks default columns are showing or not while all columns deselected from table settings", function(){
            columns = [];
            tableSettingsWidget.controlIfSelectedNone(columns);
            expect(eventBusStub.publish.callCount).to.equal(1);
            expect(eventBusStub.publish.getCall(0).calledWith('showDefaultColumns')).to.equal(true);

        });

        it("checks updating the columns or not while select and deselect the columns from table settings", function(){
            tableSettingsWidget.controlIfSelectedNone(columns);
            expect(eventBusStub.publish.callCount).to.equal(1);
            expect(eventBusStub.publish.getCall(0).calledWith('updatecolumns')).to.equal(true);
        });

    });

});