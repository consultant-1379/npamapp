define([
    "jscore/ext/mvp"
], function (mvp) {

    'use strict';

    return mvp.Model.extend({
        url: "/npamservice/v1/job/list"
    });

});