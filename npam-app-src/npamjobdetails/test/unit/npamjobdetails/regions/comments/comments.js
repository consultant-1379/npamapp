define([
    "jscore/core",
    "shmjobdetails/regions/comments/comments"
], function(core, Comments) {
    "use strict";

    describe("Test the 'Comments' region of shmjobdetails app", function() {

        var commentsRegion, options, server;
        beforeEach(function() {

            server = sinon.fakeServer.create();

            options = {
                context: {
                    eventBus: {
                        publish: function() {},
                        subscribe: function() {},
                        unsubscribe: function() {}
                    }
                }
            };

            commentsRegion = new Comments(options);
        });

        afterEach(function() {

            server.restore();
        });

        it("Checks the default condition when jobComments gets attached", function() {

            expect(commentsRegion.options).to.equal(options);
        });

        it("Checks if the comment gets added when a comment is written and added to the comments section", function() {

            var comment = {
                comment: "hello",
                date: "Mon Sep 14 2015 14:25:37 GMT+0530 (India Standard Time)",
                userName: "user1"
            };

            commentsRegion.displayComments(comment);

            var addedComment = commentsRegion.commentData._collection.models[0].attributes;

            expect(addedComment.commentText).to.equal("hello");
            expect(addedComment.operatorName).to.equal("user1");
        });

        it("Checks if empty comments section is displayed when emptyCommentsEvent is triggered", function() {

            var response = null;
            var comment = {};

            commentsRegion.displayComments(comment);

            var addedComment = commentsRegion.commentData._collection.models[0].attributes;

            commentsRegion.showComments(response);

            expect(commentsRegion.commentData.toJSON().length).to.equal(0);
        });

        it("When a new comment is added, rest call should be triggered and if it is success, comment should be added", function() {

            var comment = {
                comment: "hello",
                date: "Mon Sep 14 2015 14:25:37 GMT+0530 (India Standard Time)",
                userName: "user1"
            };

            commentsRegion.jobId = 3;
            commentsRegion.buildCommentPayload("hello");

            commentsRegion.updateCommentAction(comment);

            server.respondWith("POST", "/oss/shm/rest/job/comment", [200, { "Content-Type": "application/json" },JSON.stringify({})]);
            server.respond();

            expect(commentsRegion.commentData.toJSON().length).to.equal(1);
        });
    });
});