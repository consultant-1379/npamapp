/*global define, describe, it, expect */
define([
    'npamlibrary/mywidget/MyWidget'
], function (MyWidget) {
    'use strict';

    describe('MyWidget', function () {

        it('MyWidget should be defined', function () {
            expect(MyWidget).not.to.be.undefined;
        });

    });

});
