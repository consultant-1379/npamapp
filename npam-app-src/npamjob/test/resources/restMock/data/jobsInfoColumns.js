function getJobsInfoColumns() {
    return [
        {
            "title": "Job Name",
            "attribute": "jobName"
        },
        {
            "title": "Job Type",
            "attribute": "jobType"
        },
        {
            "title": "Created By",
            "attribute": "createdBy"
        },
        {
            "title": "No Of Nodes",
            "attribute": "totalNoOfNEs"

        },
        {
            "title": "Progress",
            "attribute": "progress"
        },
        {
            "title": "Status",
            "attribute": "status"
        },
        {
            "title": "Result",
            "attribute": "result"
        },
        {
            "title": "Start Date",
            "attribute": "startTime"
        },
        {
            "title": "End Date",
            "attribute": "endTime"
        }
    ];
}
module.exports = {
    getJobsInfoColumns: getJobsInfoColumns()
};