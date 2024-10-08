/**
 different constants have been defined here for ease of access to all the applications
 */

define([
], function () {
    return {
        "true": "true",
        "false": "false",

        //Response Constants
        "STATUS": "status",
        "RESULT": "result",
        "RESTFAILED":"Rest Call Failed",

        //Job Status/State Constants

        "Scheduled": "Scheduled",
        "ScheduleTime": "Schedule Time",
        "MANUAL": "MANUAL",
        "Manual_dropdown": "Manual",
        "Immediate_dropdown": "Immediate",
        "Schedule_dropdown": "SCHEDULED",
        "WAITING": "WAIT_FOR_USER_INPUT",
        "WAIT_FOR_USER_INPUT": "WAIT_FOR_USER_INPUT",
        "OPS_INPUT": "Open OPS GUI",
        "WAIT_FOR_SCRIPT_INPUT": "WAIT_FOR_SCRIPT_INPUT",
        "CANCELLED": "CANCELLED",
        "CANCELLING": "CANCELLING",
        "FINISHED": "FINISHED",
        "SYSTEM_CANCELLED": "SYSTEM CANCELLED",
        "SYSTEM_CANCELLING": "SYSTEM CANCELLING",
        "INTERRUPTED": "INTERRUPTED",

        //Job-Rotation
        "AUTO_CRED": "auto",
        "MAN_CRED": "man",
        "FILE_CRED":"file",
        "CREDENTIALS": "credentials",

        //Jobs
        "CREATENEACCOUNTJOB": "createNeAccountsJob",
        "DETACHNEACCOUNTJOB": "detachNeAccountsJob",
        "ROTATENEACCOUNTJOB": "rotateNeAccountsJob",
        "CHECKNEACCOUNTCONFIGJOB": "checkNeAccountConfigJob",

        //Job type Constants
        "ROTATE_CREDENTIALS": "ROTATE_NE_ACCOUNT_CREDENTIALS",
        "ROTATE_CREDENTIALS_AUTO_PWD": "ROTATE_NE_ACCOUNT_CREDENTIALS_AUTOGENERATED",
        "ROTATE_CREDENTIALS_FROM_FILE" : "ROTATE_NE_ACCOUNT_CREDENTIALS_FROM_FILE",
        "CREATE_NE_ACCOUNT" : "CREATE_NE_ACCOUNT",
        "DETACH_NE_ACCOUNT" : "DETACH_NE_ACCOUNT",
        "CHECK_NE_ACCOUNT_CONFIG" : "CHECK_AND_UPDATE_NE_ACCOUNT_CONFIGURATION",

        //Job state
        "CREATED": "CREATED",
        "SCHEDULED": "SCHEDULED",
        "SUBMITTED": "SUBMITTED",
        "RUNNING": "RUNNING",
        "COMPLETED": "COMPLETED",
        "USER_CANCELLED": "USER_CANCELLED",
        "PARTIALLY_COMPLETED": "PARTIALLY_COMPLETED",

        //Job Result Constants
        "SUCCESS": "SUCCESS",
        "FAILED": "FAILED",
        "SKIPPED": "SKIPPED",
        "TICK": "tick",

        //Color Constants
        "DARK_GREY": "darkGrey",
        "BLUE": "blue",
        "GREEN": "green",
        "RED": "red",
        "PALEBLUE": "paleBlue",
        "DARKGREEN": "darkGreen",
        "YELLOW": "yellow",
        "ORANGE": "orange",
        "PURPLE": "purple",
        "EMPTY": "empty",

        //Job type Constants
        "DATABASEERROR": "Database not available",
        "MAIN_PAGE": "mainPage",
        "SUB_PAGE": "subPage",
        "DELETE": "delete",
        "ERROR": "error",
        "CREATE": "create",
        "STARTDATE": "START_DATE",

        //Links to navigate to other
        "NEACCOUNTS_LINK": "#npamapp",
        "JOB_LIST_LINK": "#npamapp/npamjob",
        "CREATE_NE_ACCOUNTS_LINK": "#npamapp/npamcreateneaccountjob",
        "DETACH_NE_ACCOUNTS_LINK": "#npamapp/npamdeleteneaccountjob",
        "ROTATE_NE_ACCOUNTS_LINK": "#npamapp/npamrotateneaccountjob",
        "CHECK_NE_ACCOUNTS_CONFIG_LINK": "#npamapp/npamcheckneaccountconfigjob",
        "JOB_DETAILS_LINK": "#npamapp/npamjob/npamjobdetails",

        icon: {
            edit: 'edit',
            delete: 'delete',
            refresh: 'refresh',
            export: 'export',
            error: 'error'
        },

        "NETWORK": "Network",
        "TABLESETTINGS": "tableSettings",
        "AVAILABLE_PACKAGES_TABLESETTINGS": "availablePackagesTableSettings",
        "JOBSUMMARY": "jobSummary",
        "NODE_CONFIGURATION": "nodeConfiguration",
        "NODEACTIVITIES": "nodeActivities",
        "showDetails": "showDetails",
        "INPUT_TYPE_RADIO": "RADIO_BUTTON",
        "NODE": "NODE",

        //Error constants
        "PAGE_NOT_FOUND_CODE": 404,
        "INTERNAL_ERROR_CODE": 500,
        "GATEWAY_TIMEOUT_CODE": 504,
        "SERVICE_DOWN_CODE": 503,
        "BAD_REQUEST": 400,
        "FORBIDDEN_CODE": 403,


        //Job configuration attributes.
        "INSTALL": "install",
        "IMMEDIATE": "IMMEDIATE",
        "CV_NAME": "CV_NAME",
        "CV_IDENTITY": "CV_IDENTITY",
        "STARTABLE_CV_NAME": "STARTABLE_CV_NAME",
        "ROLLBACK_CV_NAME": "ROLLBACK_CV_NAME",
        "UPLOAD_CV_NAME": "UPLOAD_CV_NAME",
        "WARNING": "WARNING",
        "ENM": "ENM",
        "CV_TYPE": "CV_TYPE",
        "PARTIAL_SUCCESS": "Partial Success",
        "ERBS": "ERBS",
        "VIEW_DETAILS": "ViewDetails",
        "REQUEST": "REQUEST",

        "RESTART_INFO": "restartInfo",
        "RESTART_REASON": "restartReason",
        "RESTART_RANK": "restartRank",
        "MANUAL_RESTART":"Manual Restart",
        "ROTATE":"Rotate",
        "OVERWRITE":"Overwrite",
        "PASSWORD":"Password",
        "USERLABEL":"Userlabel",
        "ENCRYPT_BACKUP":"Encrypt Backup",

        //Data types for columns.
        "TEXT": "text",
        "NUMBER": "number",
        "DATE": "date",
        "nodeDate": "nodeDate",
        "BOOLEAN": "boolean",
        "ENUM": "enum",

        "DOWNLOADED": "DOWNLOADED",
        "jobName": "jobName",
        "npamcreateneaccountjob_jobName": "CreateNEAccountJob_",
        "npamdeleteneaccountjob_jobName": "DetachNEAccountJob_",
        "npamrotateneaccountjob_jobName": "RotateNEAccountJob_",
        "npamcheckneaccountconfigjob_jobName": "CheckNEAccountConfigJob_",

        //Icon constants.
        "dialogInfoIcon": "dialogInfo",
        "JOB_CONFIGURATION": "/oss/shm/rest/job/jobconfigurationdetails/",
        "SOFTWARE": "SOFTWARE",
        "HARDWARE": "HARDWARE",
        "EXPORT_COMPLETED": "COMPLETED",
        "EXPORT_COMPLETED_NODATA": "COMPLETED_NODATA",
        "CSV": "csv",
        "JOB_NAME_VALIDATION_PATTERN": /[^A-Za-z0-9._-]/,
        "PASSWORD_VALIDATION_CHARS_PATTERN": /^[A-Za-z0-9!#$%&()*+,\-.:<=>?@\[\]^_`\{\|\}~]+[A-Za-z0-9!#$%&()*+,\-.:<=>?@\[\]^_`\{|\}~]$/, // " and ' are not accepted
        "PASSWORD_VALIDATION_2DIGITS_PATTERN": /(?=(.*[\d]){2})/,
        "PASSWORD_VALIDATION_3UPPER_PATTERN": /(?=(.*[A-Z]){3})/,
        "PASSWORD_VALIDATION_3LOWER_PATTERN": /(?=(.*[a-z]){3})/,
        "PASSWORD_VALIDATION_SPECIAL_PATTERN": /[!#$%&()*+,\-.:<=>?@\[\]^_`\{\|\}~]/, // " and ' are not accepted
        "duplicateJob": "Duplicate Job",
        "CONTINUE": "CONTINUE",
        "CANCEL": "CANCEL",
        "CREATEJOB": "CREATEJOB",
        "JOBLOGS": "JOBLOGS",
        "CLEARSELECTION": "CLEARSELECTION",
        "VIEW_INVENTORY": "/oss/shm/rest/inventory/rbac/viewinventory",
        "UNSUPPORTED_ERROR": "Error",
        "NODEROOTNOTFOUND": "Cannot find any node root",
        "VALIDATEDETAILS": "Validate Details",

        //Constants for unavailable data during duplicate job creation or new job creation from job details application.
        "NODES": "NODES",
        "COLLECTIONS": "COLLECTIONS",
        "SAVED_SEARCHES": "SAVED_SEARCHES",
        "DUPLICATE": "_Duplicate",

        //Constants for Upgrade Job Creation
        "Collection": "Collection",
        "SavedSearch": "SavedSearch",
        "otherObjects": "otherObjects",
        "loading": "loading",

        //NetworkUtil constants.
        "REQUEST_BATCH_SIZE": 250,
        "VALIDATION_REQUEST_BATCH_SIZE": 1000,
        "FROM_COLLECTIONS_OR_SAVEDSEARCH": "FROM_COLLECTIONS_OR_SAVEDSEARCH",
        "FROM_ROOT_ASSOCIATIONS": "FROM_ROOT_ASSOCIATIONS",
        "FROM_GET_POS_BY_POIDS": "FROM_GET_POS_BY_POIDS",
        "FROM_ANOTHER_INV": "FROM_ANOTHER_INV",
        "NODERESTART": "NODERESTART",
        "noJobIdResponseText": "No Job found with the given Job id",
        "ONBOARD": "ONBOARD",
        "OnBoardJob": "OnboardJob",
        "OtherObjects": "Other Objects",
        "DELETESOTWAREPACKAGE": "DELETE_SOFTWAREPACKAGE",
        "SUCCESSvRAN": "successvRAN",

         //Unsupported node messages
        "Upgrade Packages view is not supported for this node" : "UPNotSupported",
        "Unsupported node model" : "unSupportedNodeModel",
        "Database not available" : "DBNotAvailable",
        "Node model information not available": "nodeInfoNotFound",
        "Second level inventory data is not applicable for this node.": "2ndLevelInvNotSupported",
        "Fragment Not Supported": "FragmentNotSupported",

        "NA": "NA",
        "RefBkups": "Referred Backups",
        "RefPkgs": "Referred Packages",
        "IOExceptionForFileUpload": "Error while uploading software package. Check the network connectivity and the disk space on file system.",
        "Cluster": "CLUSTER",

    };
});
