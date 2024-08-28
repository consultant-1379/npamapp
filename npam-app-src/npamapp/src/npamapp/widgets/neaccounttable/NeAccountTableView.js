define([
    'jscore/core',
    'template!./NeAccountTable.hbs',
    'styles!./NeAccountTable.less',
    'i18n!npamapp/dictionary.json'
], function (core, template, styles, dictionary) {

    return core.View.extend({

        getTemplate: function () {
            return template(this.options,
                    {
            });
        },

        getStyle: function () {
            return styles;
        },
        
        getNeAccountTableHolder: function() {
            return this.getElement().find(".eaNpamapp-NeAccountTable-TableHolder");
        },
        
        getCount: function() {
            return this.getElement().find(".eaNpamapp-NeAccountTable-SectionHeading-count");
        },
        
        getSelected: function() {
            return this.getElement().find(".eaNpamapp-NeAccountTable-SectionHeading-selected-label");
        },
        
        getTableSettings: function() {
            return this.getElement().find(".eaNpamapp-NeAccountTable-SectionHeading-tableSettings");
        },
        
        getClearSelectionLink: function() {
            return this.getElement().find(".eaNpamapp-NeAccountTable-SectionHeading-selected-clear-link");
        },
        
        getClearSelectionSeparetor: function() {
            return this.getElement().find(".eaNpamapp-NeAccountTable-SectionHeading-selected-clear-separator");
        }

    });
});
