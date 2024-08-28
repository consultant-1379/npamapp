/*global define */
define([
    'jscore/core',
    'template!./_content.html',
    'styles!./_content.less'
], function (core, template, styles) {
    'use strict';
    var NAME = '.eaNpamlibrary-content-';
    return core.View.extend({
        getTemplate: function () {
            return template();
        },
        getStyle: function () {
            return styles;
        },

        getBody: function () {
            return this.getElement().find(NAME + 'body');
        }

    });

});
