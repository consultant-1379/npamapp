define([
    'jscore/ext/net',
    'npamlibrary/messageUtil',
    'npamlibrary/displaymessage'
], function (net,  messageUtil, displaymessage) {

    return {
        getCurrentUser: function (successCallback, errorCallback) {
            var currentUser = localStorage.getItem("currentUser");
            if (!currentUser) {
                net.ajax({
                    url: "/editprofile",
                    type: "GET",
                    dataType: "json",
                    success: function (response){
                        this.saveCurrentUser(response, successCallback);
                    }.bind(this),
                    error: function(response,xhr){
                        var errorBody = messageUtil.getErrorMessage(xhr.getStatus(), xhr.getResponseText());
                        var errorMessage = new displaymessage();
                        errorMessage.showMessage(true, errorBody.userMessage.body, "error", errorBody.userMessage.title);
                        errorCallback(errorMessage);
                    }
                });
            } else {
                successCallback();
            }
        },

        saveCurrentUser: function(response, successCallback){
            var currentUser = response.username;
            var serverName = window.location.host;
            localStorage.setItem("username", currentUser);
            localStorage.setItem("currentUser", currentUser+'-'+serverName);
            successCallback();
        },

        updateSessionStorage: function(attr1, attr2){
            var sessionData = this.getSessionData();
            if (! sessionData) {
                sessionData = {};
            }
            if(attr1){
                sessionData[attr1[0]] = attr1[1];
            }
            if(attr2){
                sessionData[attr2[0]] = attr2[1];
            }
            localStorage.setItem(localStorage.getItem("currentUser"),JSON.stringify(sessionData));
        },

        getSessionStorageAttribute: function(attribute){
            var sessionData = this.getSessionData();
            if(sessionData){
                return sessionData[attribute];
            }
            return ;
        },

        removeUser: function(){
            localStorage.removeItem("currentUser");
            localStorage.removeItem("username");
        },

        getSessionData: function(){
            var currentUser = localStorage.getItem("currentUser");
            var sessionData = JSON.parse(localStorage.getItem(currentUser));
            return sessionData;
        },

        getUserName: function() {
            return (localStorage.getItem("username"));
        }
    };
});