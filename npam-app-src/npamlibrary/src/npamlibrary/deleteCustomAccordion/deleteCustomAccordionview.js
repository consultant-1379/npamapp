/*global define*/
define([
    'jscore/core',
    'text!./deleteCustomAccordion.html',
    'styles!./deleteCustomAccordion.less'
], function (core, template, style) {

    'use strict';

    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return style;
        }
    });
});