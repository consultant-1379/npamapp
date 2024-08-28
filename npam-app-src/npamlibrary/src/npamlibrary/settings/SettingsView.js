define([
    'jscore/core',
    'text!./settings.html',
    'styles!./settings.less'
], function (core, template, styles) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },
        setApplyLabel: function(txt) {
            this.getElement().find(".eaNpamlibrary-wSettings-ApplyButton").setText(txt);
        },
        setCancelLabel: function(txt) {
            this.getElement().find(".eaNpamlibrary-wSettings-CancelButton").setText(txt);
        },
        getStyle: function() {
            return styles;
        },
        addApplyClickHandler: function(fn){
            return this.getElement().find(".eaNpamlibrary-wSettings-ApplyButton").addEventHandler("click", fn);
        },
        addCancelClickHandler: function(fn){
            return this.getElement().find(".eaNpamlibrary-wSettings-CancelButton").addEventHandler("click", fn);
        }

    });

});
