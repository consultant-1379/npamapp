define([
    'jscore/core',
    'template!./EmptySummary.hbs',
    'styles!./EmptySummary.less',
    'i18n!npamapp/dictionary.json'
], function (core, template, styles, dictionary) {

    return core.View.extend({

        getTemplate: function () {
            return template(this.options, {
                helpers: {
                    getKeyFromi18N: function(key) {
                        return dictionary.summary[key];
                    }
                }
            });
        },

        getStyle: function () {
            return styles;
        }
    });
});