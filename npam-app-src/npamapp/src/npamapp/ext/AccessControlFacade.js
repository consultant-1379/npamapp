define([
    'jscore/core',
    '../utils/RestUtils',
    './Constants'
], function (core, RestUtils, Constants) {
    var AccessControl = function (resource) {
        this.accesscontroldata = null;
        this.resource = resource;
        this.errorResponse = "";
    };

    AccessControl.prototype.fetchAccessRights = function (callback) {
        var url;
        this.callback = callback;
        if (this.resource !== undefined) {
            url = "/oss/uiaccesscontrol/resources/" + this.resource + "/actions";

        } else {
            url = "/oss/uiaccesscontrol/resources";
        }
        RestUtils.sendRequest(Constants.httpMethod.GET, url, this.successCallback.bind(this), this.errorCallback.bind(this));
    };

    AccessControl.prototype.successCallback = function (data) {
        this.accesscontroldata = data;
        if (this.callback !== undefined)
            this.callback(this.accesscontroldata);
    };

    AccessControl.prototype.errorCallback = function (data, xhr) {
        this.accesscontroldata = {};
        var response = xhr.getResponseText();
        if (typeof response === 'string' && response.indexOf('{') === 0 && response.indexOf('}') === 1) {
            this.errorResponse = Constants.authorizationResponse.UNAUTHORIZED;
        } else {
            this.errorResponse = Constants.authorizationResponse.NOT_FOUND;
        }
        if (this.callback !== undefined) {
            this.callback(this.errorResponse);
        }
    };

    // Function which returns 'hasRights' boolean variable as true when user has read action else as false.
    AccessControl.prototype.isAllowed = function (action) {
        if (this.accesscontroldata.actions !== undefined) {
            //check for partial rights
            if (this.accesscontroldata.actions.indexOf(action) > -1) {
                return {hasRights: true, status: Constants.authorizationResponse.AUTHORIZED};
            } else {
                return {hasRights: false, status: Constants.authorizationResponse.UNAUTHORIZED};
            }
        } else {
            return {hasRights: false, status: this.errorResponse};
        }
    };

    // Function which returns 'hasRights' boolean variable as true when user has read action else as false.
    AccessControl.prototype.isAllowed = function (pResource, action) {
        var resourceObj = this.accesscontroldata.find(function (obj){
            if (obj.resource !== undefined) {
                if (obj.resource === pResource) {
                    return true;
                }
            }
        });
        if (resourceObj !== undefined) {
            if (resourceObj.actions !== undefined) {
                if (resourceObj.actions.indexOf(action) > -1) {
                    return {hasRights: true, status: Constants.authorizationResponse.AUTHORIZED};
                } else {
                    return {hasRights: false, status: Constants.authorizationResponse.UNAUTHORIZED};
                }
            } else {
                return {hasRights: false, status: this.errorResponse};
            }
        } else {
            return {hasRights: false, status: Constants.authorizationResponse.UNAUTHORIZED};
        }
    };
    return AccessControl;
});
