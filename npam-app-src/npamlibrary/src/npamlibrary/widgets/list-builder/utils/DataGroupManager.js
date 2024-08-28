/*global define*/
define([
    'jscore/ext/privateStore',
    './DataManager',
    './ItemGroup'
], function (PrivateStore, DataManager, ItemGroup) {
    'use strict';
    
    var _ = PrivateStore.create();
    
    function DataGroupManager(options) {
        
        initializeDataManager.call(this, options);
        
        options.eventBus.subscribe('data:loaded', function () {
            // as we can have the same parent element in both source and destination
            // need to have individual list instead of one filter
            initializeSourceGroup.call(this, options);
            initializeDestinationGroup.call(this, options);
            
            options.eventBus.publish('data:ready');
        }.bind(this));
    }
    
    //-------------------------------------------------------- Private
    
    function initializeDataManager(options) {
        /* jshint validthis:true */
        _(this).dataManager = new DataManager({
            eventBus: options.eventBus,
            getData: options.getData
        });
    }
    
    function getDataManager() {
        /* jshint validthis:true */
        return _(this).dataManager;
    }
    
    function initializeSourceGroup(options) {
        /* jshint validthis:true */
        var dataManager = getDataManager.call(this),
            itemsInDestination = options.items.destination;
        
        _(this).sourceGroup = new ItemGroup({
            dataManager: dataManager,
            filter: options.filter.source,
            items: dataManager.getDataById()
        });
        
        if (itemsInDestination !== undefined && itemsInDestination.length !== 0) {
            _(this).sourceGroup.removeItems(itemsInDestination, {lockUpdate: true});
        }
    }
    
    function initializeDestinationGroup(options) {
        /* jshint validthis:true */
        var itemsInDestination = options.items.destination;
        
        _(this).destinationGroup = new ItemGroup({
            dataManager: getDataManager.call(this),
            filter: options.filter.destination
        });
        
        if (itemsInDestination !== undefined && itemsInDestination.length !== 0) {
            _(this).destinationGroup.addItems(itemsInDestination, {lockUpdate: true});
        }
    }
    
    function getSourceGroup() {
        /* jshint validthis:true */
        return _(this).sourceGroup;
    }
    
    function getDestinationGroup() {
        /* jshint validthis:true */
        return _(this).destinationGroup;
    }
    
    function restoreGroupLockedItems(fromSourceToDestination, processedItems) {
        /* jshint validthis:true */
        var sourceGroup = getSourceGroup.call(this),
            destinationGroup = getDestinationGroup.call(this),
            groupToRestore = fromSourceToDestination ? sourceGroup : destinationGroup,
            groupToReduce = fromSourceToDestination ? destinationGroup : sourceGroup,
            groupLockedItems = groupToRestore.getGroupLockedItemsById(),
            idsOfItemsToRestore;
        
        if (Object.keys(groupLockedItems).length !== 0) {
            idsOfItemsToRestore = processedItems.filter(function (lockedItemId) {
                return groupLockedItems[lockedItemId] !== undefined;
            });
        }
        
        if (idsOfItemsToRestore !== undefined && idsOfItemsToRestore.length !== 0) {
            groupToRestore.addItems(idsOfItemsToRestore);
            groupToReduce.removeItems(idsOfItemsToRestore);
        }
    }
    
    //-------------------------------------------------------- Public
    
    // Root items
    
    function getSourceTotalRootItems() {
        /* jshint validthis:true */
        return getSourceGroup.call(this).getGroupTotalRootItems();
    }
    
    function getDestinationTotalRootItems() {
        /* jshint validthis:true */
        return getDestinationGroup.call(this).getGroupTotalRootItems();
    }
    
    // Data
    
    function getSourceData(queries, resolve, reject, idsOnly) {
        /* jshint validthis:true */
        getSourceGroup.call(this).queryGroupData(queries, resolve, idsOnly);
    }
    
    function getDestinationData(queries, resolve, reject, idsOnly) {
        /* jshint validthis:true */
        getDestinationGroup.call(this).queryGroupData(queries, resolve, idsOnly);
    }
    
    // Items ids
    
    function getSourceItemsIds() {
        /* jshint validthis:true */
        return getSourceGroup.call(this).getGroupItemsIds();
    }
    
    function getDestinationItemsIds() {
        /* jshint validthis:true */
        return getDestinationGroup.call(this).getGroupItemsIds();
    }
    
    // filter
    
    function getSourceFilter() {
        /* jshint validthis:true */
        return getSourceGroup.call(this).getGroupFilter();
    }
    
    function applyFilterToSource(filter) {
        /* jshint validthis:true */
        getSourceGroup.call(this).applyFilter(filter);
    }
    
    function getDestinationFilter() {
        /* jshint validthis:true */
        return getDestinationGroup.call(this).getGroupFilter();
    }
    
    function applyFilterToDestination(filter) {
        /* jshint validthis:true */
        getDestinationGroup.call(this).applyFilter(filter);
    }
    
    /**
     * Add the parent hierarchy for each element,
     * keep the parent on both sides unless it has no child left
     *
     * @param fromSource
     * @param fromDestination
     */
    function moveItems(fromSource, fromDestination) {
        /* jshint validthis:true */
        var sourceGroup = getSourceGroup.call(this),
            destinationGroup = getDestinationGroup.call(this),
            fromSourceToDestination = true,
            processedItems;
        
        if (fromSource === 'all') {
            // all items moved from source to destination
            destinationGroup.addAllItems();
            processedItems = sourceGroup.removeAllItems();
        }
        else if (fromDestination === 'all') {
            // all items moved from destination to source
            sourceGroup.addAllItems();
            processedItems = destinationGroup.removeAllItems();
            fromSourceToDestination = false;
        }
        else if (fromSource !== undefined && fromSource.length !== 0) {
            // items moved from source to destination
            destinationGroup.addItems(fromSource);
            processedItems = sourceGroup.removeItems(fromSource);
        }
        else if (fromDestination !== undefined && fromDestination.length !== 0) {
            // items moved from destination to source
            sourceGroup.addItems(fromDestination);
            processedItems = destinationGroup.removeItems(fromDestination);
            fromSourceToDestination = false;
        }
        
        restoreGroupLockedItems.call(this, fromSourceToDestination, processedItems);
        
        var sourceFilter = this.getSourceFilter(),
            destinationFilter = this.getDestinationFilter();
        
        if (sourceFilter !== undefined) {
            applyFilterToSource.call(this, sourceFilter);
        }
        
        if (destinationFilter !== undefined) {
            applyFilterToDestination.call(this, destinationFilter);
        }
    }
    
    function filterOutLockedItems(items) {
        /* jshint validthis:true */
        return getDataManager.call(this).filterOutLockedItems(items);
    }
    
    //-------------------------------------------------------- Exposed API
    
    // source
    DataGroupManager.prototype.getSourceGroup = getSourceGroup;
    DataGroupManager.prototype.getSourceItemsIds = getSourceItemsIds;
    DataGroupManager.prototype.getSourceTotalRootItems = getSourceTotalRootItems;
    DataGroupManager.prototype.getSourceData = getSourceData;
    
    DataGroupManager.prototype.applyFilterToSource = applyFilterToSource;
    DataGroupManager.prototype.getSourceFilter = getSourceFilter;
    
    // destination
    DataGroupManager.prototype.getDestinationGroup = getDestinationGroup;
    DataGroupManager.prototype.getDestinationItemsIds = getDestinationItemsIds;
    DataGroupManager.prototype.getDestinationTotalRootItems = getDestinationTotalRootItems;
    DataGroupManager.prototype.getDestinationData = getDestinationData;
    
    DataGroupManager.prototype.applyFilterToDestination = applyFilterToDestination;
    DataGroupManager.prototype.getDestinationFilter = getDestinationFilter;
    
    // global
    DataGroupManager.prototype.moveItems = moveItems;
    DataGroupManager.prototype.filterOutLockedItems = filterOutLockedItems;
    
    return DataGroupManager;
});
