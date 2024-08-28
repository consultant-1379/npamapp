define([
    'jscore/ext/net',
    'npamlibrary/messageUtil',
    'npamlibrary/displaymessage'
], function (net, messageUtil, displaymessage) {

    return {

        init: function (successCallback, errorCallback, url) {
            if (!sessionStorage.getItem('npam-serverTime')) {
                this.triggerServerTimeCall(successCallback, errorCallback, url);
            } else {
                if (successCallback) {
                    successCallback();
                }
            }
        },

        getServerOffset: function () {
            var serverTimeJson = sessionStorage.getItem('npam-serverTime');
            if (serverTimeJson !== null) {
                var serverTime = JSON.parse(serverTimeJson);
                var totalOffsetInMillis = (serverTime.utcOffset * 3600 * 1000) + this.getLocalOffset();
                return totalOffsetInMillis;
            } else {
                throw new Error("Server time offset hasn't been loaded.");
            }
        },

        getLocalOffset: function () {
            var localOffsetInMillis = new Date().getTimezoneOffset() * 60 * 1000;
            return localOffsetInMillis;
        },

        getServerLocation: function () {
            var serverTimeJson = sessionStorage.getItem('npam-serverTime');
            var serverTime = JSON.parse(serverTimeJson);
            if(serverTime) {
                var serverLocation = serverTime.serverLocation;
                return serverLocation;
            }
            return null;
        },

        triggerServerTimeCall: function (successCallback, errorCallback) {
            net.ajax({
                url: "/rest/system/time",
                type: "GET",
                dataType: "json",
                success: function (serverTime) {
                    this.setServerTime(successCallback, serverTime);
                }.bind(this),
                error: function (error, xhr) {
                    this.loadErrorMessage(errorCallback, error, xhr);
                }.bind(this)
            });
        },

        setServerTime: function(successCallback, serverTime){
            sessionStorage.setItem('npam-serverTime', JSON.stringify(serverTime));
            if (successCallback) {
                successCallback();
            }
        },

        loadErrorMessage: function(errorCallback, response, xhr){
            var errorBody = messageUtil.getErrorMessage(xhr.getStatus(), xhr.getResponseText());
            var errorMessage = new displaymessage();
            errorMessage.showMessage(true, errorBody.userMessage.body, "error", errorBody.userMessage.title);
            errorCallback(errorMessage);
        },

        getServerDate: function () {
            var serverTime = JSON.parse(sessionStorage.getItem("npam-serverTime"));
            if(serverTime){
                return serverTime.timestamp + this.getServerOffset();
            }
        }
    };
});