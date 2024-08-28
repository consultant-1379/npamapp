define([
    "jscore/core",
    "npamlibrary/ext/columnsUtil",
    "i18n!npamlibrary/app.json",
    'npamlibrary/newfilterheadercell',
    "jscore/ext/mvp"
], function(core, ColumnsUtil, libLanguage, FilterHeaderCell, mvp) {
    "use strict";

    describe("Test the 'columnsUtil' file of npamlibrary", function() {

        var columnsUtilWidget, columns, response, responseCollection, sandbox;
        beforeEach(function() {

            sandbox = sinon.sandbox.create();

            responseCollection = new mvp.Collection();

            columns = [
                {
                    title: libLanguage.nodeName,
                    attribute: "nodeName",
                    sortable: true,
                    initialSortIcon: "asc",
                    resizable: true,
                    secondHeaderCellType: FilterHeaderCell
                },
                {
                    title: libLanguage.fingerPrint,
                    attribute: "fingerPrint",
                    sortable: true,
                    resizable: true,
                    secondHeaderCellType: FilterHeaderCell
                },
                {
                    title: libLanguage.message,
                    attribute: "message",
                    sortable: true,
                    resizable: true,
                    secondHeaderCellType: FilterHeaderCell
                },
                {
                    title: libLanguage.sequenceNumber,
                    attribute: "sequenceNumber",
                    sortable: true,
                    resizable: true,
                    secondHeaderCellType: FilterHeaderCell
                },
                {
                    title: "Installation Date of installed inventory",
                    attribute: "installationDate",
                    sortable: true,
                    dataType: "Integer",
                    resizable: true,
                    secondHeaderCellType: FilterHeaderCell
                },
                {
                    title: "Time",
                    attribute: "Time",
                    sortable: true,
                    dataType: "Integer",
                    resizable: true,
                    secondHeaderCellType: FilterHeaderCell
                },
                {
                    title: "location",
                    attribute: "location",
                    sortable: true,
                    dataType: "Integer",
                    resizable: true,
                    secondHeaderCellType: FilterHeaderCell
                }
            ];

            response = [
                {"nodeFdn": "MeContext=LTE17_ERBS00001","nodeName": "LTE17_ERBS00001","fingerPrint":"CPPRBSREF01","message":"Publisher10030117","sequenceNumber":"1000","installationDate":"2009-11-10", "time":"", "location": "India", "fdn":"Inventory=LTE17_ERBS00001,LicenseInventory=1,License=LTE17_ERBS00001_1"},
                {"nodeFdn": "MeContext=LTE17_ERBS00001","nodeName": "LTE17_ERBS00001","fingerPrint":"CPPRBSREF02","message":"Publisher10030117","sequenceNumber":"1000","installationDate":"2009-11-10", "time":"", "location": "India", "fdn":"Inventory=LTE17_ERBS00001,LicenseInventory=1,License=LTE17_ERBS00001_1"},
                {"nodeFdn": "MeContext=LTE17_ERBS00001","nodeName": "LTE17_ERBS00001","fingerPrint":"CPPRBSREF03","message":"Publisher10030117","sequenceNumber":"1000","installationDate":"2009-11-10", "time":"", "location": "India", "fdn":"Inventory=LTE17_ERBS00001,LicenseInventory=1,License=LTE17_ERBS00001_1"},
                {"nodeFdn": "MeContext=LTE17_ERBS00001","nodeName": "LTE17_ERBS00001","fingerPrint":"CPPRBSREF04","message":"Publisher10030117","sequenceNumber":"1000","installationDate":"2009-11-10", "time":"", "location": "India", "fdn":"Inventory=LTE17_ERBS00001,LicenseInventory=1,License=LTE17_ERBS00001_1"}
            ];

            responseCollection.addModel(response);

            columnsUtilWidget = ColumnsUtil;
        });

        afterEach(function() {

        });

        it("Checks the column width when maxLength is greater than 30", function() {

            columnsUtilWidget.getColumnsFromResponseObject(columns, responseCollection);

            expect(columns[4].width).to.equal("250px");
        });

        it("Checks the column width when maxLength is 0", function() {

            columnsUtilWidget.getColumnsFromResponseObject(columns, responseCollection);

            expect(columns[5].width).to.equal("80px");
        });

        it("Checks the column width when column is 'sequenceNumber'", function() {

            columnsUtilWidget.getColumnsFromResponseObject(columns, responseCollection);

            expect(columns[3].width).to.equal("200px");
        });

        it("Checks the column width when column is 'nodeName'", function() {

            columnsUtilWidget.getColumnsFromResponseObject(columns, responseCollection);

            expect(columns[0].width).to.equal("150px");
        });

        it("Checks the column width when column is 'location'", function() {

            columnsUtilWidget.getColumnsFromResponseObject(columns, responseCollection);

            expect(columns[6].width).to.equal("95px");
        });

        it("Checks the column width when column is 'message'", function() {

            columnsUtilWidget.getColumnsFromResponseObject(columns, responseCollection);

            expect(columns[2].width).to.equal("190px");
        });
    });
});