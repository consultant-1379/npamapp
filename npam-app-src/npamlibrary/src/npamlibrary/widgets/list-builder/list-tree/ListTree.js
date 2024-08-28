/*global define*/
define([
    'jscore/core',
    'jscore/ext/privateStore',
    'dataviz/Tree',
    'uit!./_listTree.hbs'
], function (core, PrivateStore, Tree, View) {
    'use strict';
    
    var _ = PrivateStore.create();
    
    return core.Widget.extend({
        
        view: function () {
            var labels = this.options.labels,
                typeOfTitle = typeof labels.title;
            
            return new View({
                hasTitle: typeOfTitle === 'string' || typeOfTitle === 'function',
                labels: {
                    title: typeOfTitle === 'string' ? labels.title : '',
                    filter: labels.filter
                }
            });
        },
        
        ITEM_SELECT: 'item:select',
        FILTER_CHANGE: 'filter:change',
        
        onViewReady: function () {
            this.updateListTitle();
            this.setTotalRootItems(this.options.totalRootItems);
            
            initializeTree.call(this);
            initializeFilter.call(this);
        },
        
        setTotalRootItems: function (totalRootItems) {
            if (_(this).totalRootItems !== totalRootItems) {
                _(this).totalRootItems = totalRootItems;
                
                if (_(this).tree !== undefined) {
                    _(this).tree.destroy();
                    delete _(this).tree;
                }
            }
        },
        
        updateListTitle: function () {
            if (typeof this.options.labels.title === 'function') {
                this.view.findById('listTitle').setText(this.options.labels.title());
            }
        },
        
        unselectAll: function () {
            if (_(this).tree !== undefined) {
                _(this).tree.unselectAll();
            }
        },
        
        redraw: function (options) {
            options = options || {};
            
            if (options.force === true && _(this).tree !== undefined) {
                _(this).tree.destroy();
                delete _(this).tree;
            }
            
            if (_(this).tree === undefined) {
                initializeTree.call(this);
            }
            else {
                _(this).tree.redraw();
            }
        },
        
        setEnabled: function (isEnabled) {
            this.view.findById('filter').setAttribute('disabled', !isEnabled);
            var element = this.getElement();
            
            if (!isEnabled) {
                element.setModifier('disabled');
            }
            else {
                element.removeModifier('disabled');
            }
        }
    });
    
    function initializeFilter() {
        /* jshint validthis:true */
        var filterInput = this.view.findById('filter'),
            filterIcon = this.view.findById('filterIcon'),
            onFilterChange = function () {
                // unselect the item when the filter change.
                // prevents having any selection hidden by filtering
                this.unselectAll();
                
                if (currentTimeout !== undefined) {
                    clearTimeout(currentTimeout);
                }
                
                // defer the event to allow the user to filter on key input
                // use of timeout to reduce the impact on data processing
                currentTimeout = setTimeout(function () {
                    var filterStr = filterInput.getValue();
                    
                    filterIcon.setStyle({display: filterStr !== '' ? 'block' : 'none'});
                    
                    this.trigger(this.FILTER_CHANGE, filterStr);
                }.bind(this), 500);
            }.bind(this),
            currentTimeout;
        
        filterInput.addEventHandler('input', onFilterChange);
        filterIcon.addEventHandler('click', function () {
            filterInput.setValue('');
            filterInput.focus();
            onFilterChange();
        });
    }
    
    function initializeTree() {
        /* jshint validthis:true */
        // no need to create the tree when the count of root items is 0
        if (_(this).totalRootItems === 0) {
            return;
        }
        
        var options = this.options,itemsElement,
            tree = new Tree({
                itemType: options.itemType,
                getData: options.getData,
                getIds: options.getIds,
                totalRootItems: _(this).totalRootItems,
                selectable: true,
                multiselect: true,
                checkboxes: true,
                bindselect: true,
            });
        
        tree.addEventHandler('selectend', onItemSelect.bind(this));
        tree.attachTo(this.view.findById('tree'));
        itemsElement = this.view.getElement().find('.elDataviz-Tree-items');
        itemsElement.setStyle('display', 'grid');
        resize(tree);
        
        _(this).tree = tree;
    }
    
    function onItemSelect(selectedIds) {
        /* jshint validthis:true */
        this.trigger(this.ITEM_SELECT, selectedIds);
    }
    
    function resize(tree) {
        requestAnimationFrame(function() {
            tree.redraw();
        });
    }
    
});
