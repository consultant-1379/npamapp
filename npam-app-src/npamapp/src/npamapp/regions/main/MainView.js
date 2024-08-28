define([
    'jscore/core',
    'text!./Main.html',
    'styles!./Main.less'
], function (core, template, styles) {

    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return styles;
        },

        getUserMessagePlaceholder: function () {
            return this.getElement().find('.eaNpamapp-rMain-userMessagePlaceholder');
        },

        getNeAccountTabHolder: function() {
            return this.getElement().find('.eaNpamapp-rMain-neAccountTabPlaceholder');
        }
    });

});