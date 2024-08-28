define([
    'jscore/core',
    'npamlibrary/comments/comment/comment',
    "jscore/ext/mvp",
    'i18n!npamlibrary/dictionary.json'
], function (core, Comment, mvp, libLanguage) {
    'use strict';

    describe("Tests the Add Comment functionality", function () {

        var commentsRegion, sandbox;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            commentsRegion = new Comment();
        });

        afterEach(function () {
            sandbox.restore();
        });

        it("Checks the Add Comment button disabled by default when job comments are not entered", function() {
            expect(commentsRegion.view.getButton().getAttribute("disabled")).to.equal("disabled");
        });

        it("Checks the Add Comment button enabled when job comments are entered", function() {
            commentsRegion.view.getTextArea().setProperty("value", "Added Comment");
            commentsRegion.view.getTextArea().trigger("input");
            expect(commentsRegion.view.getButton().getAttribute("disabled")).to.equal(undefined);
        });

        it("Checks the Add Comment button disabled when job comments are not entered", function() {
            commentsRegion.view.getTextArea().setProperty("value", "Added Comment");
            commentsRegion.view.getTextArea().trigger("input");
            expect(commentsRegion.view.getButton().getAttribute("disabled")).to.equal(undefined);

            commentsRegion.view.getTextArea().setProperty("value", "");
            commentsRegion.view.getTextArea().trigger("input");
            expect(commentsRegion.view.getButton().getAttribute("disabled")).to.equal("disabled");
        });
    });
});
