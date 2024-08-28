define([
    "jscore/core",
    "jscore/ext/mvp",
    "npamcreateneaccountjob/finish/finish",
    'layouts/TopSection',
    "widgets/Dialog"
], function(core, mvp, Finish, TopSection, Dialog) {
    "use strict";

    describe("Test the 'Summary' step of createneaccountsjob", function() {

        var finishStep, model, sandbox, triggerStub, activitySchedules;
        beforeEach(function() {

             model = new mvp.Model();

            sandbox = sinon.sandbox.create();
            triggerStub = {
                trigger : function(){}
            };

            finishStep = new Finish(model);
        });

        afterEach(function() {

        });

        it("Checks if all the job details are displayed when page gets loaded", function() {

            finishStep.model.setAttribute("JobName", "jobName");

            expect(finishStep.view.getJobName().getText()).to.equal("jobName Job Summary");
        });

        it("When job execution type is immediate, then Schedule property should be displayed as execute immediately", function() {

            finishStep.model.setAttribute("mainSchedule", {"execMode": "IMMEDIATE", "scheduleAttributes": []});

            finishStep.setScheduleValue("Define job and execute immediately");

            expect(finishStep.view.getSchedule().getText()).to.equal("Define job and execute immediately");
        });

        it("When job execution type is manual, then Schedule property should be displayed as execute later", function() {

            finishStep.model.setAttribute("mainSchedule", {"execMode": "IMMEDIATE", "scheduleAttributes": []});

            finishStep.setScheduleValue("Define job and execute later");

            expect(finishStep.view.getSchedule().getText()).to.equal("Define job and execute later");
        });
    });
});