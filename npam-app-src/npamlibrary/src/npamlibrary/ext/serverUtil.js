
define([
 'jscore/ext/net'
], function (net) {

    return {
        sendRestCall: function(type, url, successCallBack, errorCallBack, dataType, contentType, data) {
            var xhr = net.ajax({
                type: type,
                url: url,
                success: successCallBack,
                error: errorCallBack,
                dataType: dataType,
                contentType: contentType,
                data: data
            });
            return xhr;
        },

        rbacCheck: function(resource, successCallBack, errorCallBack) {
            this.sendRestCall('GET', '/oss/uiaccesscontrol/resources/'+resource+'/actions', successCallBack, errorCallBack);
        }
    };
});
