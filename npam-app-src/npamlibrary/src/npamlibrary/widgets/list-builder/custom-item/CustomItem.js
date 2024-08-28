/*global define*/
define([
    'jscore/core',
    'uit!./_customItem.hbs'
], function (core, View) {
    'use strict';
    
    return core.Widget.extend({
        
        view: function () {
            var options = this.options,
                label = options.label,
                filter = options.filter,
                viewArgs = {
                    locked: options.locked,
                    lockReason: options.lockReason,
                    
                    warning: options.warning,
                    warningReason: options.warningReason,
                    
                    label: label,
                    icon: options.warning === true ? 'warning' : false
                };
            
            if (filter !== undefined) {
                // filter set to be case insensitive, visualization adapted to match filter
                var indexOfMatch = label.toLocaleLowerCase().indexOf(filter.toLocaleLowerCase()),
                    filterMatch = indexOfMatch !== -1;
                
                viewArgs.filter = label.substr(indexOfMatch, filter.length);
                viewArgs.filterMatch = filterMatch;
                viewArgs.preFilter = filterMatch ? label.substring(0, indexOfMatch) : undefined;
                viewArgs.postFilter = filterMatch ? label.substring(indexOfMatch + filter.length) : undefined;
            }
            
            return new View(viewArgs);
        }
    });
});
