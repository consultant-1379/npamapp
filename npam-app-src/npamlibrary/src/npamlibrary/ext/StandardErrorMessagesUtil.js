define([
    "jscore/core",
    'i18n!npamlibrary/dictionary.json'
], function (core, dictionary) {
    'use strict';

    var standardErrorCodes = {
        BAD_REQUEST_CODE: 400,
        UNAUTHORIZED: 401,
        ACCESS_DENIED_CODE: 403,
        PAGE_NOT_FOUND_CODE: 404,
        METHOD_NOT_FOUND: 405,
        UNPROCESSABLE_CONTENT: 422,
        INTERNAL_ERROR_CODE: 500,
        SERVICE_DOWN_CODE: 503,
        GATEWAY_TIMEOUT_CODE: 504,
        NETWORK_DISCONNECT: 0
    };

    var internalCodes = {
        "4000": dictionary.inlineMessages.error400Content,
        "4001": dictionary.inlineMessages.InvalidJobType,
        "4002": dictionary.inlineMessages.InvalidInputData,
        "4003": dictionary.inlineMessages.MissingEncryptionKey,
        "4100": dictionary.inlineMessages.error401Content,
        "4200": dictionary.inlineMessages.error403Content,
        "4201": dictionary.inlineMessages.NpamDisabled,
        "4300": dictionary.inlineMessages.error404Content,
        "4301": dictionary.inlineMessages.JobNameNotFound,
        "4302": dictionary.inlineMessages.JobIdNotFound,
        "4400": dictionary.inlineMessages.error422Content,
        "4401": dictionary.inlineMessages.invalidNameAttribute,
        "4402": dictionary.inlineMessages.invalidJobTypeAttribute,
        "4403": dictionary.inlineMessages.InvalidMainScheduleAttribute,
        "4404": dictionary.inlineMessages.InvalidSelectedNEsAttribute,
        "4405": dictionary.inlineMessages.InvalidJobPropertiesAttribute,
        "4406": dictionary.inlineMessages.InvalidCredentials,
        "4407": dictionary.inlineMessages.NetworkElementNotFound,
        "4408": dictionary.inlineMessages.CollectionNotFound,
        "4409": dictionary.inlineMessages.HybridCollectionNotSupported,
        "4410": dictionary.inlineMessages.CollectionNotSupported,
        "4411": dictionary.inlineMessages.SavedSearchNotSupported,
        "4412": dictionary.inlineMessages.SavedSearchNotFound,
        "4413": dictionary.inlineMessages.FileNotFound,
        "4414": dictionary.inlineMessages.JobNameAlreadyExisting,
        "4415": dictionary.inlineMessages.JobConfigurationError,
        "4416": dictionary.inlineMessages.FileEmpty,
        "4417": dictionary.inlineMessages.NEAccountIdNotSupported,
        "4418": dictionary.inlineMessages.NEAccountNotFound,
        "4419": dictionary.inlineMessages.NeNpamStatusNotSupported,
        "4420": dictionary.inlineMessages.InvalidNpamConfigAttributes,
        "4421": dictionary.inlineMessages.ImportFileError,
        "4422": dictionary.inlineMessages.InvalidEncryptionKeyAttribute,
        "4423": dictionary.inlineMessages.UnableToCancelJob,
        "4424": dictionary.inlineMessages.FileAlreadyExist,
        "5000": dictionary.inlineMessages.error500Content,
        "5001": dictionary.inlineMessages.DatabaseError,
        "5002": dictionary.inlineMessages.CryptographyDecryptError,
        "5003": dictionary.inlineMessages.CryptographyEncryptError,
        "5004": dictionary.inlineMessages.FilesystemError,
        "5005": dictionary.inlineMessages.NpamConfigDuplicated
    };

    return {
        getStandardErrorMessage: function (errorStatusCode, internalErrorCode) {
            var errorMessage = {};
            switch (errorStatusCode) {
                case standardErrorCodes.BAD_REQUEST_CODE:
                    errorMessage.header = dictionary.inlineMessages.error400Header;
                    errorMessage.description = dictionary.inlineMessages.error400Content;
                    break;

                case standardErrorCodes.UNAUTHORIZED:
                    errorMessage.header = dictionary.inlineMessages.error401Header;
                    errorMessage.description = dictionary.inlineMessages.error401Content;
                    break;

                case standardErrorCodes.ACCESS_DENIED_CODE:
                    errorMessage.header = dictionary.inlineMessages.error403Header;
                    errorMessage.description = dictionary.inlineMessages.error403Content;
                    break;

                case standardErrorCodes.PAGE_NOT_FOUND_CODE:
                    errorMessage.header = dictionary.inlineMessages.error404Header;
                    errorMessage.description = dictionary.inlineMessages.error404Content;
                    break;

                case standardErrorCodes.METHOD_NOT_FOUND:
                    errorMessage.header = dictionary.inlineMessages.error405Header;
                    errorMessage.description = dictionary.inlineMessages.error405Content;
                    break;

                case standardErrorCodes.UNPROCESSABLE_CONTENT:
                    errorMessage.header = dictionary.inlineMessages.error422Header;
                    errorMessage.description = dictionary.inlineMessages.error422Content;
                    break;

                case standardErrorCodes.INTERNAL_ERROR_CODE:
                    errorMessage.header = dictionary.inlineMessages.error500Header;
                    errorMessage.description = dictionary.inlineMessages.error500Content;
                    break;

                case standardErrorCodes.GATEWAY_TIMEOUT_CODE:
                    errorMessage.header = dictionary.inlineMessages.error504Header;
                    errorMessage.description = dictionary.inlineMessages.error504Content;
                    break;

                case standardErrorCodes.SERVICE_DOWN_CODE:
                    errorMessage.header = dictionary.inlineMessages.serviceDownHeader;
                    errorMessage.description = dictionary.inlineMessages.serviceDownContent;
                    break;

                case standardErrorCodes.NETWORK_DISCONNECT:
                    errorMessage.header = dictionary.inlineMessages.networkDisconnectHeader;
                    errorMessage.description = dictionary.inlineMessages.networkDisconnectContent;
                    break;

                default:
                    errorMessage.header = dictionary.inlineMessages.unknownServerError;
                    errorMessage.description = dictionary.inlineMessages.unknownServerContent;
                    break;
            }

            if ( internalErrorCode && internalCodes[ internalErrorCode.toString() ]) {
                errorMessage.description = internalCodes[ internalErrorCode.toString() ];
            }
            return errorMessage;
        }
    };
});