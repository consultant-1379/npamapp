/*global define*/
define([
    'jscore/core',
    'uit!./_item.hbs'
], function (core, View) {
    'use strict';
    
    return core.Widget.extend({
        
        view: function () {
            return new View(this.options);
        },
        
        onViewReady: function () {
            this.getElement().addEventHandler('click', this.options.action);
        },
        
        enable: function (status) {
            var button = this.getElement(),
                icon = this.view.findById('icon');
            
            if (!status) {
                button.setModifier('disabled');
                icon.setModifier('disabled');
            }
            else {
                button.removeModifier('disabled');
                icon.removeModifier('disabled');
            }
        }
    });
});
