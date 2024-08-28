define([
    "jscore/core",
    "template!./PopUpDialog.html",
    "styles!./PopUpDialog.less"
], function (core, template, styles) {
    'use strict';

    return core.View.extend({
        getTemplate: function() {
            return template(this.options);
        },

        getStyle: function () {
            return styles;
        }

    });
});

