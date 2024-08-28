define([
    'jscore/ext/net',
    'jscore/base/jquery',
    'i18n!npamapp/dictionary.json',
    '../ext/Constants',
    'npamlibrary/StandardErrorMessagesUtil'
], function (net, $, Dictionary, Constants, StandardErrorMessagesUtil) {
    'use strict';
    var xmlHttpRequest;

    return {
        /**
         * An error object that all failed AJAX calls will send back
         * @typedef {Object} ErrorObject
         * @property {String} header - Header for the error message
         * @property {String} description - Body of the error message
         * @property {number} status - HTTP Status code
         */


        /**
         * Send an ajax request using net.ajax
         * @deprecated Please use sendRequestWithPromise to conform with UI SDK practices
         *
         * @param {String} requestType - GET, POST, DELETE, or PUT
         * @param {String} url - REST endpoint
         * @param {function} successCallback - Called when completed successfully, providing two parameters:
         *                                   responseData - The response from the REST call
         *                                   xhr - the xmlHttpResponse from the call
         * @param {function} errorCallback - Called when failure occurs, providing two parameters:
         *                                   {ErrorObject} msg - The formatted error from the REST call
         *                                   xhr - the xmlHttpResponse from the call
         * @param {function} timeoutCallback - Called if the request times out, providing two parameters:
         *                                   {ErrorObject} msg - The formatted error from the REST call
         *                                   xhr - the xmlHttpResponse from the call
         * @param {(String|Boolean)} contentType - the MIME type of requestData (or false to not append a header)
         * @param {Object} requestData - Data to pass in the REST call. Will be JSON stringified
         * @returns {Object} An XHR instance
         */
        sendRequest: function (requestType, url, successCallback, errorCallback, timeoutCallback, contentType, requestData) {
            return net.ajax({
                type: requestType,
                url: url,
                dataType: Constants.headerDataType.JSON,
                contentType: contentType,
                data: JSON.stringify(requestData),
                success: successCallback,
                error: function (msg, xhr) {
                    errorCallback(formatErrorMessageObject(xhr, url), xhr);
                },
                timeout: Constants.networkConfiguration.TIMEOUT,
                onTimeout: function (xhr) {
                    timeoutCallback(formatTimeoutMessageObject(xhr), xhr);
                }
            });
        },

        sendBlobRequest: function (requestType, url, successCallback, errorCallback, timeoutCallback, contentType, requestData, accept) {
            return $.ajax({
                type: requestType,
                url: url,
                contentType: contentType,
                data: JSON.stringify(requestData),
                xhrFields: {responseType: 'blob'},
                success: successCallback,
                error: errorCallback//,
//                timeout: Constants.networkConfiguration.TIMEOUT,
//                onTimeout: function (xhr) {
//                    console.log("timeout");
//                    timeoutCallback(formatTimeoutMessageObject(xhr), xhr);
//                }
            });
        },

        sendFile: function (requestType, url, successCallback, errorCallback, timeoutCallback, requestData ) {
            return net.ajax({
                type: requestType,
                url: url,
                contentType: false,
                processData: false,
                dataType: "json",
                data: requestData,
                success: function (msg, xhr) {
                    successCallback(msg, xhr);
                },
                error: function (msg, xhr) {
                    errorCallback(msg, xhr);
                }
            });
        },

        /**
         * Create a Promise object wrapping net.parallel
         * @param {String[]} urls - a list of URLs to send AJAX requests to
         * @returns {Promise} The Promise returned will not resolve or reject until all parallel requests have finished
         *                    resolve - Returns an array of response data
         *                    reject - Returns an {ErrorObject} which will always have properties: header, description, and status (HTTP status code)
         */
        sendParallelRequests: function (urls) {
            var errorOccured = false;
            var xhrResponse, errorUrl;
            return new Promise(function (resolve, reject) {
                net.parallel(
                    {
                        type: Constants.httpMethod.GET,
                        dataType: Constants.headerDataType.JSON,
                        contentType: Constants.mimeType.JSON,
                        timeout: Constants.networkConfiguration.TIMEOUT,
                        error: function handleIndividualErrors(msg, xhr, url) {
                            errorOccured = true;
                            xhrResponse = xhr;
                            errorUrl = url;

                        },
                        onTimeout: function (xhr) {
                            reject(formatTimeoutMessageObject(xhr));
                        },
                        success: function handleIndividualSuccesses() {
                            //Response for each parallel request is not handled here, instead waits for the response once all the requests are processed
                        }
                    },
                    urls,
                    function (responses) {
                        // This is executed after every parallel request is completed
                        // It returns data if at least one of the parallel call succeeds, otherwise returns an error
                        if (responses.length === 0 && errorOccured) {
                            reject(formatErrorMessageObject(xhrResponse, errorUrl));
                        } else {
                            resolve(responses);
                        }
                    },
                    {
                        alwaysExecute: true,
                        includeErrors: false
                    }
                );
            });
        },

        /**
         * Creates a Promise object wrapping an asynchronous call to net.ajax
         * @param url The REST API endpoint's URL to send the AJAX request to
         * @param data The data to send to that URL
         * @param requestType The type of rest request - GET/POST
         * @param abortBusyRequest
         * @returns {Promise} The Promise returned will either resolve or reject:
         *                    resolve - Returns the data returned from the AJAX call
         *                    reject - Returns an {ErrorObject} which will always have properties: header, description, and status (HTTP status code)
         */
        sendRequestWithPromise: function (url, data, requestType, abortBusyRequest) {
            if (abortBusyRequest) {
                abortRestCall();
            }
            return new Promise(function (resolve, reject) {
                if (!isValidRequest(url, data)) {
                    reject({
                        header: Dictionary.noCellsInlineMessageHeader,
                        description: Dictionary.noCellsInlineMessageDescription,
                        status: 400 // 400 Bad Request
                    });
                }
                xmlHttpRequest = net.ajax({
                    url: url,
                    type: requestType,
                    dataType: Constants.headerDataType.JSON,
                    contentType: Constants.mimeType.JSON,
                    data: data,
                    timeout: Constants.networkConfiguration.TIMEOUT,
                    success: function (response) {
                        resolve(response);
                    },
                    error: function (msg, xhr) {
                        //Error handling for the exteral modelInfo service is based on the status code to align with other ENM applications
                        if (url.indexOf('/modelInfo/model/') !== -1) {
                            reject(xhr);
                        } else {
                            reject(formatErrorMessageObject(xhr, url));
                        }
                    },
                    onTimeout: function (xhr) {
                        reject(formatTimeoutMessageObject(xhr));
                    }
                });
            });
        },

        isXmlRequestBusy: function () {
            if (xmlHttpRequest) {
                return xmlHttpRequest.getStatus() < 200;
            }
            return false;
        }
    };


    // --- Private functions --- //

    /**
     * Process errors returned by the AJAX request. Parses possible error messages into a common error object format
     * @param xhr A XMLHttpRequest object
     * @param [url] The url of the request
     * @returns {ErrorObject} Will always have properties: header, description, and status (HTTP status code)
     */
    function formatErrorMessageObject(xhr, url) {
        var errorObject;
        if (isRootAssociationFailed(url, xhr)) {
            errorObject = {
                header: Dictionary.inlineMessages.moTypeNotSupportedHeader,
                icon: Constants.icon.error,
                description: Dictionary.inlineMessages.moTypeNotSupportedDescription
            };
        } else if (isNetworkError(xhr)) {
            errorObject = {
                header: Dictionary.inlineMessages.noNetworkHeader,
                icon: Constants.icon.error,
                description: Dictionary.inlineMessages.noNetworkDescription
            };
        } else {
            try {
                errorObject = standardizeErrorDetailsFromJsonResponse(xhr.getStatus(), xhr.getResponseJSON());
            } catch (exception) {
                if (exception instanceof SyntaxError) { // SyntaxError will likely mean that an error thrown while reading getResponseJSON
                    var errorMessage = parseErrorsInHtmlFormat(xhr.getResponseText());
                    errorObject = {
                        header: Dictionary.inlineMessages.serviceDownHeader,
                        icon: Constants.icon.error,
                        description: formatErrorMessages(errorMessage)
                    };
                } else {
                    throw exception; // re-throw any unrelated exception
                }
            }
        }
        errorObject.status = xhr.getStatus();
        return errorObject;
    }

    function formatErrorMessages(errorMessage) {
        var messageToBeDisplayed = "";
        if (errorMessage.includes(Dictionary.inlineMessages.requestedUrlNotFound)) {
            messageToBeDisplayed = Dictionary.inlineMessages.nbiUnavailable;
        } else if (errorMessage.includes(Dictionary.inlineMessages.requestedTasksUrlNotFound)) {
            messageToBeDisplayed = Dictionary.inlineMessages.dataPersistenceServiceUnavailable;
        } else {
            messageToBeDisplayed = errorMessage;
        }
        return messageToBeDisplayed;
    }

    /**
     * Parses HTML error messages being returned from an ajax call.
     *
     * Gets the HTML response and it parses it to DOM object.
     * Retrieves the text messages from the HTML response body.
     * @param {String} responseText
     * @returns {String} The text error messages in the HTML response.
     */
    function parseErrorsInHtmlFormat(responseText) {
        var parser = new DOMParser();
        var htmlDoc = parser.parseFromString(responseText, "text/html");
        return getTextFromHtmlBody(htmlDoc.body);
    }

    /**
     * Iterates through HTML body child DOM nodes and returns text found.
     *
     * The html body may contain different child tags from error to error under which it may store the error message
     * or no tags.
     * Therefore retrieves the text from all types of child nodes.
     *
     * document.TEXT_NODE - Text nodes, representing a section of text in the document.
     * document.ELEMENT_NODE - Element nodes, representing tagged sections in the document.
     * @param {Object} body
     * @returns {String} error, a single concatenated string of all the error messages found in the html.
     */

    function getTextFromHtmlBody(body) {
        var error = '';
        var child;
        for (var i = 0; i < body.childNodes.length; i++) {
            child = body.childNodes[i];
            if (child.nodeType === document.ELEMENT_NODE) {
                error += getTextFromHtmlBody(child);
            } else if (child.nodeType === document.TEXT_NODE) {
                error += ' ' + child.nodeValue;
            }

        }
        return error;
    }

    /**
     * Parse JSON error messages that could be in a variety of forms depending on the origin of the failure.
     * Returns a default header and/or description if none were given. Note the case where the CMS request fails during execution
     * and the {@code errorMessage} in the response contains 'null'. This could happen if critical exceptions are ever
     * encountered on the server side. In this case the description will also be set to 'null'.
     * @param {Object} responseBody - An error returned from a REST call, usually obtained via xhr.getResponseJSON()
     * @returns {ErrorObject} Sets ErrorObject parameters header and description, but not status.
     */
    function standardizeErrorDetailsFromJsonResponse(status, responseBody) {
        var errorObject;
        if ( responseBody.internalErrorCode ) {
            errorObject = StandardErrorMessagesUtil.getStandardErrorMessage(status, responseBody.internalErrorCode);
            errorObject.description += " " + responseBody.errorDetails;
        } else {
            // Old SHM error management...to remove???
            if (responseBody.requestErrorMessage &&
                ((responseBody.failedMoOperations && responseBody.failedMoOperations.length === 0) ||
                   responseBody.failedMoOperations === undefined)) {
                if (responseBody.requestErrorMessage.includes(Dictionary.inlineMessages.serviceUnavailabilityMessage)) {
                    errorObject = {};
                    errorObject.header = Dictionary.inlineMessages.serviceDownHeader;
                    errorObject.description = Dictionary.inlineMessages.serviceUnavailable;
                } else if (responseBody.requestErrorMessage.includes(Dictionary.inlineMessages.dpsUnavailable)) {
                    errorObject = {};
                    errorObject.header = Dictionary.inlineMessages.serviceDownHeader;
                    errorObject.description = Dictionary.inlineMessages.dataPersistenceServiceUnavailable;
                }
            } else if (responseBody.failedMoOperations && responseBody.failedMoOperations.length > 0) {
                errorObject = handleCmsExecutionFailure(responseBody);
            } else {
                errorObject = handleNonCmsRelatedFailure(responseBody);
            }
        }
        errorObject.icon = Constants.icon.error;
        return errorObject;
    }

    /**
     * Returns a common error message object for all timeout errors
     * @param xhr A XMLHttpRequest object
     * @returns {ErrorObject} Will always have properties: header, description, and status (HTTP status code)
     */
    function formatTimeoutMessageObject(xhr) {
        return {
            header: Dictionary.inlineMessages.serviceDownHeader,
            icon: Constants.icon.error,
            description: Dictionary.inlineMessages.requestTimedOut,
            status: xhr.getStatus()
        };
    }

    function isValidRequest(url, data) {
        return (!(url === "/persistentObject/rootAssociations" && data.poList.length === 0));
    }

    // Check required to display error message when root association call fails
    function isRootAssociationFailed(url, xhr) {
        return (url === "/persistentObject/rootAssociations" && xhr.getStatus() === 404);
    }

    /**
     * Checks for a total network failure, where the ajax request couldn't reach any server at all to return a full HTTP status code
     * In this case, "0" is used as a status, and the response body is null. See: https://fetch.spec.whatwg.org/#concept-network-error
     * @param xhr - an ajax status object
     * @returns {boolean} true if the xhr status code is 0 and the response body is empty
     */
    function isNetworkError(xhr) {
        return (xhr.getStatus() === 0 && xhr.getResponseText() === '');
    }

    // Aborts any previous ajax call that is still ongoing
    function abortRestCall() {
        if (xmlHttpRequest) {
            xmlHttpRequest.abort();
        }
    }
});
