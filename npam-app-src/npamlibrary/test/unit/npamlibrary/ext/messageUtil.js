define([
    "jscore/core",
    "npamlibrary/ext/messageUtil"
], function(core, MessageUtil) {
    "use strict";

    describe("Test the 'MessageUtil' of npamlibrary", function() {

        var messageUtilWidget, errorCode, responseMsg;
        beforeEach(function() {

            messageUtilWidget = MessageUtil;
        });

        afterEach(function() {

        });

        it("Checks the condition when 404 error occurs", function() {

            errorCode = 404;
            responseMsg = {};

            expect(messageUtilWidget.getErrorMessage(errorCode, responseMsg).userMessage.body).to.equal("The requested resource is not available");
            expect(messageUtilWidget.getErrorMessage(errorCode, responseMsg).userMessage.title).to.equal("404: Not Found");
        });

        it("Checks the condition when 504 error occurs", function() {

            errorCode = 504;
            responseMsg = {};

            expect(messageUtilWidget.getErrorMessage(errorCode, responseMsg).userMessage.body).to.equal("The server didn\'t respond in time");
            expect(messageUtilWidget.getErrorMessage(errorCode, responseMsg).userMessage.title).to.equal("504: Gateway Time-out");
        });

        it("Checks the condition when 500 error occurs for database issues", function() {

            errorCode = 500;
            responseMsg = "Database not available";

            expect(messageUtilWidget.getErrorMessage(errorCode, responseMsg).userMessage.body).to.equal("There is an issue with Database Service, please try after sometime.");
            expect(messageUtilWidget.getErrorMessage(errorCode, responseMsg).userMessage.title).to.equal("Could not connect to Database.");
        });

        it("Checks the condition when 500 error occurs for workflow service issues", function() {

            errorCode = 500;
            responseMsg = "Service is unavailable.";

            expect(messageUtilWidget.getErrorMessage(errorCode, responseMsg).userMessage.body).to.equal("Unknown server error Occurred in the system. Please contact your system administrator");
            expect(messageUtilWidget.getErrorMessage(errorCode, responseMsg).userMessage.title).to.equal("500: Unknown server error");
        });

        it("Checks the condition when 500 error occurs for some unknown issues", function() {

            errorCode = 500;
            responseMsg = "unknown error";

            expect(messageUtilWidget.getErrorMessage(errorCode, responseMsg).userMessage.body).to.equal("Unknown server error Occurred in the system. Please contact your system administrator");
            expect(messageUtilWidget.getErrorMessage(errorCode, responseMsg).userMessage.title).to.equal("500: Unknown server error");
        });

        it("Checks the condition when 500 error occurs for some unknown issues", function() {

            errorCode = 403;
            responseMsg = "";

            expect(messageUtilWidget.getErrorMessage(errorCode, responseMsg).userMessage.body).to.equal("Currently the service is down. Please try after sometime");
            expect(messageUtilWidget.getErrorMessage(errorCode, responseMsg).userMessage.title).to.equal("Service is down");
        });
    });
});