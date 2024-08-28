define([
    "jscore/core",
    "text!./rightAlignCell.html"
], function (core, template) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        setText:function(text){
            this.getElement().setText(text);
        }
    });

});
