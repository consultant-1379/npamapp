define([
    'jscore/core',
    'text!./tablesettings.html',
    'styles!./tablesettings.less'
], function (core, template, styles) {

    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return styles;
        }
    });

});
