/*global define, Promise*/
define([
    'jscore/ext/privateStore'
], function (PrivateStore) {
    'use strict';
    
    var _ = PrivateStore.create();
    
    function DataManager(options) {
        _(this).eventBus = options.eventBus;
        
        loadData.call(this, options.getData);
    }
    
    //-------------------------------------------------------- Private
    
    function loadData(getData) {
        /* jshint validthis:true */
        function onDataLoad(data) {
            indexData.call(this, data);
            _(this).eventBus.publish('data:loaded');
        }
        
        function onError(error) {
            console.error(error);
        }
        
        new Promise(getData)
            .then(onDataLoad.bind(this), onError);
    }
    
    function indexData(data) {
        /* jshint validthis:true */
        clearDataById.call(this);
        clearDataByParentId.call(this);
        
        data.forEach(function (item) {
            addItemToDataById.call(this, item);
            addItemToDataByParentId.call(this, item);
        }.bind(this));
    }
    
    // Data by id
    
    // data maps are objects as item.id could be string, number
    // ids mapped as key to improve performance
    // reducing the iterations for search
    
    function getDataById() {
        /* jshint validthis:true */
        return _(this).dataById;
    }
    
    function clearDataById() {
        /* jshint validthis:true */
        _(this).dataById = {};
    }
    
    function addItemToDataById(item) {
        /* jshint validthis:true */
        getDataById.call(this)[item.id] = item;
    }
    
    // Data by parent id
    
    function getDataByParentId() {
        /* jshint validthis:true */
        return _(this).dataByParentId;
    }
    
    function addItemToDataByParentId(item) {
        /* jshint validthis:true */
        var dataByParentId = getDataByParentId.call(this);
        
        if (dataByParentId[item.parent] === undefined) {
            dataByParentId[item.parent] = [];
        }
        
        dataByParentId[item.parent].push(item);
    }
    
    function clearDataByParentId() {
        /* jshint validthis:true */
        _(this).dataByParentId = {};
    }
    
    // Locked Items
    
    function _filterLockedItems(items, filterFct) {
        /* jshint validthis:true */
        var dataById = getDataById.call(this);
        
        return items.filter(function (id) {
            return filterFct(dataById[id]);
        });
    }
    
    //-------------------------------------------------------- Public
    
    function getItemById(id) {
        /* jshint validthis:true */
        return getDataById.call(this)[id];
    }
    
    function getItemsByParentId(id) {
        /* jshint validthis:true */
        return getDataByParentId.call(this)[id];
    }
    
    /**
     * Get parent of element provided
     *
     * @param item
     * @returns {object|null} parent of the item or null if root item
     */
    function getParent(item) {
        /* jshint validthis:true */
        return item && item.parent !== null ? getItemById.call(this, item.parent) : null;
    }
    
    /**
     * Trace the parent recursively to the root level.
     * traceParent(item)                // initial call
     * traceParent(hierarchy, parent)   // recursive inner iteration
     *
     * @returns {Array} array of all parents to the root level
     */
    function traceParent(options) {
        /* jshint validthis:true */
        var hierarchy = options.hierarchy || [],
            item = getItemById.call(this, options.itemId),
            parent = getParent.call(this, item);
        
        if (parent) {
            hierarchy.push(parent.id);
            
            return traceParent.call(this, {
                itemId: parent.id,
                hierarchy: hierarchy
            });
        }
        
        return hierarchy;
    }
    
    /**
     * Trace the children recursively to the leaf level.
     * traceChildren(item)                  // initial call
     * traceChildren(hierarchy, childItem)  // recursive inner iteration
     *
     * @returns {Array} array of all children to the leaf level
     */
    function traceChildren(options) {
        /* jshint validthis:true */
        var hierarchy = options.hierarchy || [],
            item = getItemById.call(this, options.itemId);
        
        if (item.children !== undefined && item.children > 0) {
            var childrenIds = getItemsByParentId.call(this, item.id).map(function (item) {
                return item.id;
            });
            
            Array.prototype.push.apply(hierarchy, childrenIds);
            
            childrenIds.forEach(function (childId) {
                traceChildren.call(this, {
                    itemId: childId,
                    hierarchy: hierarchy
                });
            }.bind(this));
        }
        
        return hierarchy;
    }
    
    // Locked Items
    
    function filterLockedItems(items) {
        /* jshint validthis:true */
        return _filterLockedItems.call(this, items, function (item) {
            return item.locked === true;
        });
    }
    
    function filterOutLockedItems(items) {
        /* jshint validthis:true */
        return _filterLockedItems.call(this, items, function (item) {
            return item.locked !== true;
        });
    }
    
    //-------------------------------------------------------- Exposed API
    
    DataManager.prototype.getDataById = getDataById;
    
    DataManager.prototype.getItemById = getItemById;
    DataManager.prototype.getItemsByParentId = getItemsByParentId;
    
    DataManager.prototype.filterOutLockedItems = filterOutLockedItems;
    DataManager.prototype.filterLockedItems = filterLockedItems;
    
    DataManager.prototype.getParent = getParent;
    DataManager.prototype.traceParent = traceParent;
    DataManager.prototype.traceChildren = traceChildren;
    
    return DataManager;
});
