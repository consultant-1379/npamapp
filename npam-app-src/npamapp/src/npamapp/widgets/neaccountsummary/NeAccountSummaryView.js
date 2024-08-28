define([
    'jscore/core',
    'template!./NeAccountSummary.hbs',
    'styles!./NeAccountSummary.less',
    'i18n!npamapp/dictionary.json'
], function (core,  template, styles, dictionary) {

   return core.View.extend({
        getTemplate: function () {
            return template(this.options, {
                helpers: {
                    getKeyFromi18N: function(key) {
                        return dictionary.summary[key];
                    },
                    if_password: function(key, value) {
                        escapeValue = value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
                                               .replace(/"/g, "&quot;").replace(/'/g, "&#039;");

                        if ( key.includes("password") && value !== "********") {
                            return '<span class="eaNpamapp-NeAccountSummary-value_password eaNpamapp-NeAccountSummary-'+key+'-value ebText">*****</span>'+
                                   '<i class="ebIcon eaNpamapp-NeAccountSummary-eye eaNpamapp-NeAccountSummary-'+key+'-value-field"></i>';
                        } else {
                            return '<span class="eaNpamapp-NeAccountSummary-value eaNpamapp-NeAccountSummary-'+key+'-value ebText">'+escapeValue+'</span>';
                        }
                    }
                }
            });
        },

        getStyle: function () {
            return styles;
        },

        getElementPanel: function(el) {
            return this.getElement().find(el);
        },

        getCBRSHeader: function () {
            return this.getElement().find('.eaNpamapp-NeAccountSummary-cbrs-header');
        },

        hideCBRSHeader: function () {
             this.getCBRSHeader().setModifier("hidden");
        },

        showCBRSHeader: function () {
            if ( this.getCBRSHeader().hasModifier("hidden") ) {
                this.getCBRSHeader().setModifier("hidden");
            }
        }
    });
});
