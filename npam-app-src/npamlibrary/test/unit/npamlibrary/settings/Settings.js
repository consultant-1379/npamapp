/**
 * Created with IntelliJ IDEA.
 * User: tcsvina
 * Date: 8/11/15
 * Time: 7:04 PM
 * To change this template use File | Settings | File Templates.
 */

define([
    "jscore/core",
    "npamlibrary/settings/Settings",
    'tablelib/TableSettings'
], function(core, Settings, TableSettings ) {
    'use strict';

    describe("Tests the settings widget", function(){
        var sandbox, columns, settingsWidget;
        beforeEach(function(){
            var options = {};
            sandbox = sinon.sandbox.create();
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
            options.columns = columns;
            settingsWidget = new Settings(options);
//            settingsWidget.tableSettings = new TableSettings();
            /*sandbox.stub(settingsWidget, "checkAll");
            sandbox.stub(settingsWidget.tableSettings, "setCheckboxes");*/
        });

        afterEach(function(){
            sandbox.restore();

        });

        it("checks all columns checked while click on select type ALL", function(){
            settingsWidget.checkAll();
            for (var i = 0; i<columns.length; i++) {
                expect(settingsWidget.tableSettings.normalItems[i].view.getCheckbox().getProperty("checked")).to.equal(true);
            }
        });

        it("checks all columns un-checked while click on select type NONE", function(){
            settingsWidget.checkNone();
            for (var i = 0; i<columns.length; i++) {
                expect(settingsWidget.tableSettings.normalItems[i].view.getCheckbox().getProperty("checked")).to.equal(false);
            }
        })

    });

});
