
define([
    'i18n!npamlibrary/dictionary.json'
], function (libLanguage) {

    return {

        getColumnNames: function() {
            return {
                jobName: libLanguage.get('jobName'),
                jobType:  libLanguage.get('jobType'),
                createdBy: libLanguage.get('createdBy'),
                totalNoOfNEs: libLanguage.get('noOfNodes'),
                progress: libLanguage.get('progress'),
                status: libLanguage.get('status'),
                result: libLanguage.get('result'),
                errorDetails: libLanguage.get('errorDetails'),
                creationDate: libLanguage.get('creationDate'),
                startDate: libLanguage.get('startDate'),
                endDate: libLanguage.get('endDate'),

                neNodeName:libLanguage.get('nodeName'),
                neActivity:libLanguage.get('currentactivity'),
                neProgress: libLanguage.get('progress'),
                neStatus: libLanguage.get('status'),
                neResult: libLanguage.get('result'),
                neStartDate: libLanguage.get('startDate'),
                neEndDate: libLanguage.get('endDate'),
                neName: libLanguage.get('nodeName'),
                entryTime: libLanguage.get('time'),
                message: libLanguage.get('message'),
                name: libLanguage.get('name'),
                neType: libLanguage.get('neType'),
                importDate: libLanguage.get('importedDate'),
                importedBy: libLanguage.get('importedBy'),
                nodeName: libLanguage.get('nodeName'),
                fingerPrint: libLanguage.get('fingerPrint'),
                importedOn: libLanguage.get('importedDate'),
                keyId: libLanguage.get('keyId'),
                description: libLanguage.get('description')
            };
        }

    };
});
