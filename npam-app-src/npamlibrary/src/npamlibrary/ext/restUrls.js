/* This is a kind of properties file and will be used to store all the rest call strings.*/
define([
], function () {
    return {
        //Jobdetails,
//        jobDetailsWithFiltersURL: "/oss/shm/rest/job/filteredJobDetails",
//        jobDetailsURL: "/oss/shm/rest/job/jobdetails",
//        downloadInventoryURL:"/oss/shm/rest/inventory/downloadInventory",
//        exportProgressURL : "/oss/shm/rest/inventory/inventoryExportProgress/",
//        exportInventoryURL :"oss/shm/rest/inventory/exportInventory",
//        mainJobsContinueURL: "/oss/shm/rest/job/jobs/continue",
//        mainJobsContinueRbacURL: '/oss/shm/rest/rbac/jobs/continue',
//        viewInventoryRbacURL : '/oss/shm/rest/inventory/rbac/viewinventory',
//        createJobURL : '/oss/shm/rest/job',

        //Shm create upgrade job:
//        swPkgsSearch: '/oss/shm/rest/softwarePackage/search',
//        swPkgsValidateURL: "/oss/shm/rest/softwarePackage/validate",
//        swPkgsSearchWithVersionV1: '/oss/shm/rest/softwarePackage/v1/search',
//        swPkgsSearchWithVersionV2: '/oss/shm/rest/softwarePackage/v2/search',
//
//        //SHM
//        rbacCheckForCreateJobs: "/oss/shm/rest/rbac/createjob",
//        jobconfigurationdetails: "/oss/shm/rest/job/jobconfigurationdetails/",

        //Shm restore backupjob:
//        backupItemsURL: "/oss/shm/rest/inventory/backupItems",
//
//        activitiesURL: '/oss/shm/rest/jobs/activityData',

        //SHM job details
//        neJobsContinue: "/oss/shm/rest/rbac/nejobs/continue",
//        cancelJob: "/oss/shm/rest/rbac/canceljob",
//        openOpsGui: "/oss/shm/rest/rbac/launch-ops-gui",
//        getNetworkElementIds:"/oss/shm/rest/job/networkelementids",

        //Job name Validation
        jobNameValidation:'/npamservice/v1/job/list/',
        importFileListUrl:'npamservice/v1/job/import/filelist',

        //SHM inventory URL's
//        inventoryFilterURL: "/oss/shm/rest/inventory/neNames/filter",
        collectionsURL: "/object-configuration/collections/v4/",
        savedSearchURL: "/topologyCollections/savedSearches/",
        savedSearchQueryURL: "/managedObjects/query?searchQuery=",
        rootAssociationsURL: "/persistentObject/rootAssociations",
        getPosByPoIds: "/managedObjects/getPosByPoIds",

        getSavedColumnSettings: "/rest/ui/settings/appName/columnsWidth",
        getSavedTableSettings: "/rest/ui/settings/appName/tableSettings",
//        nfvolist: "/oss/shm/rest/job/nfvolist",
//        backupConfigurationDetails: "/oss/shm/rest/inventory/nodeBackupConfiguration",
//        swpkgDeleteURL: "/oss/shm/rest/softwarePackage/deletesoftwarepackages",
//        licenseKeys: "/oss/shm/rest/license/files",
//        requestLicensesFile : "/oss/shm/rest/inventory/v1/lrf-supported-fdns",
//
//        referredbackups: "/oss/shm/rest/inventory/v1/upgradepackage/referred-backups",
//        referredupgradepackages: "/oss/shm/rest/inventory/v1/upgradepackage/referred-upgradepackages",
//
//        jobFilterURL: "/oss/shm/rest/neNames/filter",
//        jobFilterVersionV1URL: "/oss/shm/rest/neNames/v1/filter",
//        validateEnBGnBAssociations: "/oss/shm/rest/softwarePackage/validateEnBGnBAssociations",
//        getSoftwareVersionsV1URL: "/oss/shm/rest/inventory/v1/softwareVersions",
//        getSoftwareInventoryUniqueId: "/oss/shm/rest/inventory/softwareVersionsInventory",
//        getUpgradePackageV1URL: "/oss/shm/rest/inventory/upgradepackage/v1/list",
//        getUpgradePackageUniqueId: "/oss/shm/rest/inventory/upgradepackage/v1/upgradepackageinventory",
//        getLicenseSummariesV1URL: "/oss/shm/rest/inventory/v1/licenseSummaries",
//        getLicenseInventoryUniqueId: "/oss/shm/rest/inventory/licenseSummariesInventory",
//        getHardwareItemsV1URL: "/oss/shm/rest/inventory/v1/hardwareItems",
//        getHardwareInventoryUniqueId: "/oss/shm/rest/inventory/hardwareItemsInventory",
//        getBackupInventoryUniqueId: "/oss/shm/rest/inventory/backupInventory",
//        getBackupsV1URL: "/oss/shm/rest/inventory/v1/backupItems",
//
//        // Available Software package for import
//        availableSoftwarePackagesForImport: "/oss/shm/rest/softwarePackage/list",
//        importSoftwarePackageFromServer: "/oss/shm/rest/softwarePackage/v2/importPackageFromNeSoftwareStore/",

        // Download Release Notes
//        downloadReleaseNotesForImportedPackages : "/oss/shm/rest/softwarePackage/v2/release-notes-for-imported-package/",
//        downloadReleaseNotesFromNeSoftwareStore : "/oss/shm/rest/softwarePackage/v1/release-notes-from-ne-software-store/",
//
//        // GSM related restcalls
//        getPlatformsURL : "/oss/shm/rest/job/platforms",
//        axeNodeTopology: "/oss/shm/rest/inventory/axe-node-topology",
//        axeNodeTopologyVerV1URL: "/oss/shm/rest/inventory/v1/axe-node-topology",
//        getsupportedNesURL : "/oss/shm/rest/job/getSupportedNes",
//        winfiolBackupPositioning: "/oss/shm/rest/inventory/axe-node-inventory",

        //view License Files
//        deleteLicenseFile : "/oss/shm/rest/licensekeyfiles/delete",
//        importedKeyFilesLevel1 : "/oss/shm/rest/license/importedFiles",
//        importedKeyFilesLevel2 : "/oss/shm/rest/license/importedFileDetail",
//
//        //Request License
//        licensekeypoids:"/oss/shm/rest/inventory/v1/licensekeypoids",
//        getLicenseKeyList: "/oss/shm/rest/inventory/v1/license-key-data",
//        lrfProgress: "/oss/shm/rest/inventory/v1/lrfProgress/",
//        createLrf: "/oss/shm/rest/inventory/v1/newLrf",
//        downloadLrfURL:"/oss/shm/rest/inventory/v1/downloadLrf/",
//
//        //Validate install license key files
//        validateRestCall: "/oss/shm/rest/license/validate",
//        fetchAndValidateLicenseKeyFiles: "/oss/shm/rest/license/fetchAndValidateLicenseKeyFiles/",
//        rbacCheckForLicenseKeyDetails: "/oss/shm/rest/rbac/licensekeyValidation",
//
//        //Import software packages
//        softwareAutoImport : "/oss/shm/rest/softwarePackage/get-ne-software-store-auto-import-info",
//        importAllSoftwarePackages : "/oss/shm/rest/softwarePackage/auto-import-package-from-ne-softwareStore",
//        SwPkgDeleteV2:"/oss/shm/rest/softwarePackage/v2/delete"
    };
});
