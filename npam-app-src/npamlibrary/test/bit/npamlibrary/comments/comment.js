define([
    'jscore/core',
    'npamlibrary/comments/comment/comment',
    "jscore/ext/mvp",
    'i18n!npamlibrary/dictionary.json'
], function (core, Comment, mvp, libLanguage) {
    'use strict';

    describe("Tests the Add Comment components are attaching to the view", function () {

        var commentsRegion, sandbox;

        beforeEach(function() {
            sandbox = sinon.sandbox.create();
            commentsRegion = new Comment();
        });

        afterEach(function () {
            sandbox.restore();
        });

        it("Checks the Add Comment button name and placeholder of text area", function() {
            expect(commentsRegion.view.getButton().getText()).to.equal("Add Comment");
            expect(commentsRegion.view.getTextArea().getProperty("placeholder")).to.equal("Enter Comment");
            expect(commentsRegion.view.getButton().getAttribute("disabled")).to.equal("disabled");
        });
    });
});
