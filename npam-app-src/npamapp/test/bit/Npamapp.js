/*global define, describe, before, after, beforeEach, afterEach, it, expect */
define([
    'npamapp/Npamapp'
], function (Npamapp) {
    'use strict';

    describe('Npamapp', function () {

        it('Sample BIT test', function () {
            expect(Npamapp).not.to.be.undefined;
        });

    });

});
