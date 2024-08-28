/*******************************************************************************
 * COPYRIGHT Ericsson 2024
 *
 *
 *
 * The copyright to the computer program(s) herein is the property of
 *
 * Ericsson Inc. The programs may be used and/or copied only with written
 *
 * permission from Ericsson Inc. or in accordance with the terms and
 *
 * conditions stipulated in the agreement/contract under which the
 *
 * program(s) have been supplied.
 ******************************************************************************/

define([], function () {
    return {
        npamApp: "npam-app",
        npamManagementGui: "neaccount",
        npamManagementPwd: "neaccount_pwd",
        npamManagementImport: "neaccount_import",
        npamManagementExport: "neaccount_export",
        npamManagementJob: "neaccount_job",


        httpMethod: {
            GET: 'GET',
            POST: 'POST',
            PUT: 'PUT'
        },

        networkConfiguration: {
            TIMEOUT: 55000 // 55 secs
        },

        neType: {
            erbs: 'ERBS',
            radioNode: 'RadioNode',
            pico: 'MSRBS_V1',
            rnc: 'RNC',
            bsc: 'BSC'
        },

        color: {
            ERROR: '#e32119',
            ERROR_FOREGROUND: '#ffffff',
            YELLOW: '#fcd666',
            GREY: '#e6e6e6',
            ericssonBrandAsset: {
                BLUE: 'darkBlue',
                ORANGE: 'orange',
                RED: 'red'
            }
        },

        dialogType: {
            DEFAULT: 'default',
            ERROR: 'error',
            WARNING: 'warning',
            INFO: 'infoMsgIndicator'
        },

        authorizationResponse: {
            AUTHORIZED: 'Authorized',
            UNAUTHORIZED: 'Unauthorized',
            NOT_FOUND: 'Not Found'
        },

        npamResponse: {
            ENABLED: 'Enabled',
            DISABLED: 'Disabled',
            NOT_FOUND: 'Not Found'
        },

        managedObjectType: {
            MANAGEDELEMENT: "ManagedElement",
            MECONTEXT: "MeContext",
            SUBNETWORK: 'SubNetwork',
        },

        mimeType: {
            JSON: 'application/json'
        },

        headerDataType: {
            JSON: 'json'
        },

        urlFlags: {
            loadingScreen: "loadingScreen",
            errorOccurred: "errorOccurred"
        },

        icon: {
            edit: 'edit',
            delete: 'delete',
            refresh: 'refresh',
            export: 'export',
            error: 'error'
        },

        cbrsDisableWarningMsg: "Warning: CBRS status not aligned with NPAM configuration. Please run Update NE Accounts Configuration to resolve",
        missingCbrsWarningMsg: "Warning: missing CBRS Coordinators. Click Update NE Accounts Configuration to resolve",
        missingNeAccountWarningMsg: "Warning: missing NE Account. Click Update NE Accounts Configuration to resolve",
    };
});