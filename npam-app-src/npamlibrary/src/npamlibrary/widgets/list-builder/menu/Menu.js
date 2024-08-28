/*global define*/
define([
    'jscore/core',
    'jscore/ext/privateStore',
    './item/Item',
    'uit!./_menu.hbs'
], function (core, PrivateStore, Item, View) {
    'use strict';
    
    var _ = PrivateStore.create();
    
    return core.Widget.extend({
        
        View: View,
        
        MENU_ADD: 'menu:add',
        MENU_ADD_ALL: 'menu:add-all',
        MENU_REMOVE: 'menu:remove',
        MENU_REMOVE_ALL: 'menu:remove-all',
        
        init: function () {
            _(this).itemMap = {};
        },
        onViewReady: function () {
            var options = this.options,
                labels = options.labels || {},
                menuItems = [{
                    name: 'add',
                    icon: 'rightArrow',
                    action: buildCallBack.call(this, this.MENU_ADD),
                    title: labels.add || 'Add'
                }, {
                    name: 'addAll',
                    icon: 'nextArrow',
                    action: buildCallBack.call(this, this.MENU_ADD_ALL),
                    title: labels.addAll || 'Add all'
                }, {
                    name: 'remove',
                    icon: 'leftArrow',
                    action: buildCallBack.call(this, this.MENU_REMOVE),
                    title: labels.remove || 'Remove'
                }, {
                    name: 'removeAll',
                    icon: 'prevArrow',
                    action: buildCallBack.call(this, this.MENU_REMOVE_ALL),
                    title: labels.removeAll || 'Remove all'
                }];
            
            menuItems
                .forEach(addMenuItem.bind(this));
        },
        enableMenuItem: function (options) {
            var itemMap = _(this).itemMap;
            
            Object.keys(options).forEach(function (key) {
                var menuItem = itemMap[key];
                
                if (menuItem !== undefined) {
                    menuItem.enable(options[key]);
                }
            });
        }
    });
    
    function addMenuItem(options) {
        /* jshint validthis:true */
        var item = new Item(options);
        item.attachTo(this.getElement());
        
        _(this).itemMap[options.name] = item;
    }
    
    function buildCallBack(name) {
        /* jshint validthis:true */
        return function () {
            this.trigger(name);
        }.bind(this);
    }
    
});
