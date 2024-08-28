/**
 * Created by tcsgovu on 19-Jun-15.
 */
define([
    "jscore/core",
    'i18n!npamlibrary/dictionary.json',
    'npamlibrary/constants'
], function (core, libLanguage, Constants) {

    return {
        getErrorMessage: function (errorStatusCode, responseMessage) {
            var errorBody;
            switch (errorStatusCode) {
                case Constants.PAGE_NOT_FOUND_CODE:
                    if(responseMessage === Constants.noJobIdResponseText){
                        errorBody = {
                            userMessage: {
                                title: libLanguage.get('noJobFound'),
                                body: libLanguage.get('jobNotAvail')
                            }
                        };
                    } else {
                        errorBody = {
                            userMessage: {
                                title: libLanguage.get('error404Header'),
                                body: libLanguage.get('error404Content')
                            }
                        };
                    }
                    break;

                case Constants.BAD_REQUEST:
                    if(responseMessage.indexOf("filter") > -1) {
                        errorBody = {
                            userMessage: {
                                title: libLanguage.get('invalidSearch') ,
                                body: responseMessage + libLanguage.get('tryAgain')
                            }
                        };
                    } else {
                        errorBody = {
                            userMessage: {
                                title: libLanguage.get('badRequestTitle'),
                                body: libLanguage.get('badRequestBody')
                            }
                        };
                    }
                    break;

                case Constants.FORBIDDEN_CODE:
                    errorBody = {
                        userMessage: {
                            title: libLanguage.get('accessDenied'),
                            body: libLanguage.get('accessDeniedContent')
                        }
                    };
                    break;

                case Constants.GATEWAY_TIMEOUT_CODE:
                    errorBody = {
                        userMessage: {
                            title: libLanguage.get('error504Header'),
                            body: libLanguage.get('error504Content')
                        }
                    };
                    break;
                case Constants.INTERNAL_ERROR_CODE:
                    //This case will check only for database(versant) connection lost exception.
                    //If response message, let's say is HTML, 'if' loop will be skipped and a default message for 500 error code will be displayed in UI.
                    if (responseMessage === Constants.DATABASEERROR) {
                        errorBody = {
                            userMessage: {
                                title: libLanguage.get('databaseErrorHeader'),
                                body: libLanguage.get('databaseErrorParagraph')
                            }
                        };
                        break;
                    } else if(responseMessage.indexOf("Workflow") > -1) {
                        errorBody = {
                            userMessage: {
                                title: libLanguage.get('workFlowServiceError'),
                                body: libLanguage.get('workFlowServiceparagraph')
                            }
                        };
                        break;
                    } else if(responseMessage.indexOf("Unknown Exception") > -1) {
                        errorBody = {
                            userMessage: {
                                title: libLanguage.get('unknownExceptionTitle'),
                                body: libLanguage.get('unknownExceptionContent')
                            }
                        };
                        break;
                    } else if(responseMessage.indexOf("not reachable") > -1) {
                        errorBody = {
                            userMessage: {
                                title: libLanguage.get('nodeNotReachable'),
                                body: libLanguage.get('nodeNotReachableParagraph')
                            }
                        };
                        break;
                    } else if(responseMessage.indexOf("while retrieving") > -1) {
                        errorBody = {
                            userMessage: {
                                title: libLanguage.get('errorWhileRetrieving'),
                                body: libLanguage.get('errorWhileRetrievingParagraph')
                            }
                        };
                        break;
                    } else if (responseMessage !== null && responseMessage.trim() !== "") {
                        errorBody = {
                            userMessage: {
                                title: libLanguage.get('internalError'),
                                body: responseMessage
                            }
                        };
                        break;
                    } else {
                        errorBody = {
                            userMessage: {
                                title: libLanguage.get('serviceDownHeader'),
                                body: libLanguage.get('serviceDownContent')
                            }
                        };
                    }
                        break;

                case Constants.SERVICE_DOWN_CODE:
                    errorBody = {
                        userMessage: {
                            title: libLanguage.get('serviceDownHeader'),
                            body: libLanguage.get('serviceDownContent')
                        }
                    };
                    break;
                default:
                    errorBody = {
                        userMessage: {
                            title: libLanguage.get('error500Header')+libLanguage.get('unknownServerError'),
                            body: libLanguage.get('unknownServerError')+libLanguage.get('error500Content')
                        }
                    };
            }
            return errorBody;
        }
    };
});