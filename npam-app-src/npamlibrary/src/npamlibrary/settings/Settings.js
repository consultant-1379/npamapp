define([
    'jscore/core',
    './SettingsView',
    'tablelib/TableSettings',
    'i18n!npamlibrary/dictionary.json'
], function (core, View, TableSettings, libLanguage) {

    return core.Widget.extend({

        View: View,

        init: function (options) {
            this.columns = options.columns;
        },

        onViewReady: function () {
            this.tableSettings = new TableSettings({
                columns: this.columns,
                selectDeselectAll: {
                    labels: {
                        select: libLanguage.get('select'),
                        all: libLanguage.get('all'),
                        none:libLanguage.get('none')
                    }
                },
                showPins: true
            });
            this.tableSettings.attachTo(this.view.getElement().find('.eaNpamlibrary-wSettings-TableSettings'));
            this.view.setApplyLabel(libLanguage.get('apply'));
            this.view.setCancelLabel(libLanguage.get('cancel'));

        },
        addApplyHandle: function (fn) {
            this.view.addApplyClickHandler(fn);
        },
        addCancelHandle: function (fn) {
            this.view.addCancelClickHandler(fn);
        }
    });
});