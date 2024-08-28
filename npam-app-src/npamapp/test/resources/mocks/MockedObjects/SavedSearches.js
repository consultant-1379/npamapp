/**
 * Sets up the SavedSearches available in the Saved Searches Tab.
 */
function getSavedSearches() {
    return [
        {"poId":"274378","name":"005","searchQuery":"LTE11dg2ERBS00005","attributes":{"lastUpdated":1692887202704,"searchQuery":"LTE11dg2ERBS00005","name":"005","timeCreated":1692887202704,"category":"Private","userId":"administrator"},"deletable":true,"update":true,"delete":true,"type":"SavedSearch"},
        {"poId":"274411","name":"NEs","searchQuery":"networkelement","attributes":{"lastUpdated":1692887817612,"searchQuery":"networkelement","name":"NEs","timeCreated":1692887817612,"category":"Private","userId":"administrator"},"deletable":true,"update":true,"delete":true,"type":"SavedSearch"},
        {"poId":"281224","name":"emptySearch","searchQuery":"LTE23*","attributes":{"lastUpdated":1693384966648,"searchQuery":"LTE23*","name":"emptySearch","timeCreated":1693384966648,"category":"Private","userId":"administrator"},"deletable":true,"update":true,"delete":true,"type":"SavedSearch"}]
}

/**
 * Provides details of objects contained in the Saved Search.
 */
function getSavedSearchObjects() {
    return {
        "poId": "274411",
        "name": "NEs",
        "searchQuery": "networkelement",
        "attributes": {
            "searchQuery": "networkelement",
            "name": "NEs",
            "category": "Private",
            "userId": "administrator"
        },
        "deletable": true,
        "update": true,
        "delete": true,
        "type": "SavedSearch"
    };
}


module.exports = {
    getSavedSearches: getSavedSearches,
    getSavedSearchObjects: getSavedSearchObjects
};