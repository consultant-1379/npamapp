define([
    'jscore/core',
    '../utils/RestUtils',
    './Constants'
], function (core, RestUtils, Constants) {
    var NpamConfig = function () {
        this.npamconfigdata = null;
        this.errorResponse = "";
    };

    NpamConfig.prototype.fetchAccess = function (callback) {
        var url = "npamservice/v1/npamconfigstatus";
        this.callback = callback;
        RestUtils.sendRequest(Constants.httpMethod.GET, url, this.successCallback.bind(this), this.errorCallback.bind(this));
    };

    NpamConfig.prototype.successCallback = function (data) {
        this.npamconfigdata = data;
        if (this.callback !== undefined)
            this.callback(this.npamconfigdata);
    };

    NpamConfig.prototype.errorCallback = function (data, xhr) {
        this.npamconfigdata = {};
        var response = xhr.getResponseText();
        if (typeof response === 'string' && response.indexOf('{') === 0 && response.indexOf('}') === 1) {
            this.errorResponse = Constants.npamResponse.DISABLED;
        } else {
            this.errorResponse = Constants.npamResponse.NOT_FOUND;
        }
        if (this.callback !== undefined) {
            this.callback(this.errorResponse);
        }
    };

    // Function which returns 'hasRights' boolean variable as true when user has read action else as false.
    NpamConfig.prototype.isAllowed = function (propertyName) {
        var npamconfigobj = this.npamconfigdata.find(function(obj) {
            console.log("obj.name: " + obj.name + " propertyName: " + propertyName);
            if (obj.name === propertyName) return true;
        });
        if (npamconfigobj !== undefined) {
            if (npamconfigobj.value.toLowerCase() === Constants.npamResponse.ENABLED.toLowerCase()) {
                return {hasRights: true, status: Constants.npamResponse.ENABLED};
            } else {
                return {hasRights: false, status: Constants.npamResponse.DISABLED};
            }
        } else {
            return {hasRights: false, status: Constants.npamResponse.NOT_FOUND};
        }
    };

    return NpamConfig;
});