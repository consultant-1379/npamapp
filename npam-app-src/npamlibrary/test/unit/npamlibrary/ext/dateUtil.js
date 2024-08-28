define([
    "jscore/core",
    "npamlibrary/ext/dateUtil"
], function(core, DateUtil) {
    "use strict";

    describe("Test the 'dateUtil' widget of npamlibrary", function() {

        var dateUtilWidget;
        beforeEach(function() {

            dateUtilWidget = DateUtil;
        });

        afterEach(function() {

        });

        /*it("Checks if the date value is updated as per server timezone", function() {

            var value = "07/06/2016 08:37:31 UTC";

            expect(dateUtilWidget.formatDate(value)).to.equal("Jul 6 2016 14:07:31 UTC");
        });*/

        it("Checks the condition when date is not given in correct format", function() {

            var value = "07/06";

            expect(dateUtilWidget.formatDate(value,true)).to.equal("");
        });

        it("Checks the condition when date is given as 0", function() {

            var value = 0;

            expect(dateUtilWidget.formatDate(value,true)).to.equal("");
        });
    });
});