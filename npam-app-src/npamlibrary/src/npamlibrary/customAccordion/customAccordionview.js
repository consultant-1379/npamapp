/*global define*/
define([
    'jscore/core',
    'text!./customAccordion.html',
    'styles!./customAccordion.less'
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