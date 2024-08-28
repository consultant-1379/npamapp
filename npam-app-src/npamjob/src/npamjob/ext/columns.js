define([
    'i18n!npamjob/dictionary.json'
], function (language) {
    return{
        columns: [
            {
                "title": language.get("columnHeaders.jobName"),
                "attribute": "jobName"
            },
            {
                "title": language.get("columnHeaders.jobType"),
                "attribute": "jobType"
            },
            {
                "title": language.get("columnHeaders.createdBy"),
                "attribute": "createdBy"
            },
            {
                "title": language.get("columnHeaders.totalNoOfNEs"),
                "attribute": "totalNoOfNEs"
            },
            {
                "title": language.get("columnHeaders.progress"),
                "attribute": "progress"
            },
            {
                "title": language.get("columnHeaders.status"),
                "attribute": "status"
            },
            {
                "title": language.get("columnHeaders.result"),
                "attribute": "result"
            },
            {
                "title": language.get("columnHeaders.startDate"),
                "attribute": "startTime"
            },
            {
                "title": language.get("columnHeaders.endDate"),
                "attribute": "endTime"
            }
        ]
    };
});