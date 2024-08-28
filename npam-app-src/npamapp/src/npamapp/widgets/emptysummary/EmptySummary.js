define([
    'jscore/core',
    './EmptySummaryView',
    'i18n!npamapp/dictionary.json'
], function(core, View, Dictionary ) {
    return core.Widget.extend({
        view: function () {
            return new View({
                dictionary : Dictionary,
                message: this.options.message
            });
        }
    });
});
