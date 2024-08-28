var mockJob = [
    {"jobInstanceId":73077,"name":"jobPaola","state":"RUNNING","result":"","startTime":"2023-04-15 09:07:38+0000","endTime":"", "jobType":"ROTATE_NE_ACCOUNT_CREDENTIALS_AUTOGENERATED","numberOfNetworkElements":3, "progressPercentage":20.0,"errorDetails":"","owner":"administrator"},
    {"jobInstanceId":73076,"name":"jobPaola","state":"COMPLETED","result":"","startTime":"2023-04-14 09:07:38+0000","endTime":"2023-04-14 09:07:40+0000", "jobType":"ROTATE_NE_ACCOUNT_CREDENTIALS_AUTOGENERATED","numberOfNetworkElements":3, "progressPercentage":100.0,"errorDetails":"","owner":"administrator"}, 
    {"jobInstanceId":73075,"name":"jobPaola","state":"COMPLETED","result":"","startTime":"2023-04-13 09:07:38+0000","endTime":"2023-04-13 09:07:39+0000", "jobType":"ROTATE_NE_ACCOUNT_CREDENTIALS_AUTOGENERATED","numberOfNetworkElements":3, "progressPercentage":30.0,"errorDetails":"Unsync","owner":"administrator"}, 
    {"jobInstanceId":73001,"name":"jobEnable","state":"COMPLETED","result":"SUCCESS", "startTime":"2023-04-13 09:07:38+0000","endTime":"2023-04-13 09:07:48+0000", "jobType":"CREATE_NE_ACCOUNT","numberOfNetworkElements":1, "progressPercentage":100.0,"errorDetails":"","owner":"administrator"},
    {"jobInstanceId":73005,"name":"jobUpdatePwd","state":"SCHEDULED","result":"", "startTime":"2023-04-14 09:14:29+0000","endTime":"2023-04-13 09:10:04+0000", "jobType":"ROTATE_NE_ACCOUNT_CREDENTIALS","numberOfNetworkElements":0, "progressPercentage":0.0,"errorDetails":"","owner":"administrator"},
    {"jobInstanceId":73007,"name":"jobUpdateAutoPwd","state":"SCHEDULED","result":"", "startTime":"2023-04-14 09:14:29+0000","endTime":"", "jobType":"ROTATE_NE_ACCOUNT_CREDENTIALS_AUTOGENERATED","numberOfNetworkElements":0, "progressPercentage":0.0,"errorDetails":"","owner":"administrator"},
    {"jobInstanceId":73008,"name":"jobUpdateAutoPwd","state":"COMPLETED","result":"", "startTime":"2023-04-14 09:14:29+0000","endTime":"2023-04-13 09:10:04+0000", "jobType":"ROTATE_NE_ACCOUNT_CREDENTIALS_AUTOGENERATED","numberOfNetworkElements":0, "progressPercentage":0.0,"errorDetails":"Database Error","owner":"administrator"},
    {"jobInstanceId":73009,"name":"jobImportFilePwd","state":"COMPLETED","result":"SUCCESS", "startTime":"2023-04-13 09:09:52+0000","endTime":"2023-04-13 09:09:53+0000", "jobType":"ROTATE_NE_ACCOUNT_CREDENTIALS_FROM_FILE","numberOfNetworkElements":1, "progressPercentage":100.0,"errorDetails":"","owner":"administrator"}];

var jobInstanceNextId = 100001;

var jobStatus = ["SCHEDULED", "RUNNING", "COMPLETED"];

function getDefaultJobs() {
    return mockJob;
}

function addJob(jobName, startTime, jobType) {
    var job = {"jobInstanceId": jobInstanceNextId, "name": jobName, "state":"SCHEDULED","result":"", "startTime":startTime, "endTime":"", "jobType":jobType, "numberOfNetworkElements":0,"progressPercentage":0.0,"errorDetails":"","owner":"administrator"};
    mockJob.push(job); 
    jobInstanceNextId++;
};

function cancelJob(jobName) {
    console.log("CancelJob: " + jobName);
    var jobToReturn = mockJob.filter(function (job) {
        console.log(job);
        console.log(job.name === jobName && job.state === "SCHEDULED")
        return (job.name === jobName && job.state === "SCHEDULED");});
    console.log(jobToReturn);
    if (!jobToReturn || jobToReturn.length === 0) {
        return false;
    } else {
        jobToReturn[0].state = "USER_CANCELLED";
    }
    return true;
};

function getJobs(jobName) {
    var mockJobForName = mockJob.filter(function (job) {return job.name === jobName;});
    console.log("getJobs: " + jobName);
    mockJobForName.forEach(function(job) {
        if (job.state === 'RUNNING') {
            job.progressPercentage = job.progressPercentage + 10;
            console.log(job);
        }
    });
    return mockJobForName;
}


function get1000NEAccounts() {
    var jobs = [];
    for (var i = 0; i < 500; i++) {
        var obj1 = {"jobInstanceId": i*10+1, "name": "jobName" + i*10, "state": "COMPLETED", "result": "SUCCESS", "startTime":"2023-04-13 09:07:38+0000", "endTime":"2023-04-13 09:08:38+0000", "jobType":"ROTATE_NE_ACCOUNT_CREDENTIALS_AUTOGENERATED","numberOfNetworkElements":3, "progressPercentage":100.0,"errorDetails":"","owner":"administrator"};
        var obj2 = {"jobInstanceId": i*10+1, "name": "jobName" + i*10, "state": "SCHEDULED", "result": "SUCCESS", "startTime":"2023-04-14 09:07:38+0000", "endTime":"", "jobType":"ROTATE_NE_ACCOUNT_CREDENTIALS_AUTOGENERATED","numberOfNetworkElements":3, "progressPercentage":0.0,"errorDetails":"","owner":"administrator"};
        jobs.push(obj1);
        jobs.pusn(obj2);
    }
    return jobs;
}

module.exports = {
    getDefaultJobs: getDefaultJobs,
    getJobs: getJobs,
    get1000NEAccounts: get1000NEAccounts,
    addJob: addJob,
    cancelJob: cancelJob
};
