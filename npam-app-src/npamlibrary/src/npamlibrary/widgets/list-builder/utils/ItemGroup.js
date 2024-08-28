/*global define*/
define([
    'jscore/ext/privateStore'
], function (PrivateStore) {
    'use strict';
    
    var _ = PrivateStore.create();
    
    function ItemGroup(options) {
        _(this).dataManager = options.dataManager;
        
        setGroupData.call(this, options.items || {});
        setGroupFilterFct.call(this, options.filter);
        clearBackupGroupItemsById.call(this);
    }
    
    //-------------------------------------------------------- Private
    
    // Data structure and mapping
    
    function setGroupData(dataById, options) {
        options = options || {};
        /* jshint validthis:true */
        // ids mapped as index to improve performance
        // reducing the iterations for search
        var groupItemsById = {},
            groupLockedItemsById = {},
            totalRootItems = 0;
        
        Object.keys(dataById).forEach(function (itemId) {
            var item = dataById[itemId];
            
            groupItemsById[itemId] = item;
            
            if (item.parent === null) {
                totalRootItems++;
            }
            
            if (item.locked === true) {
                groupLockedItemsById[itemId] = item;
            }
        });
        
        setGroupItemsById.call(this, groupItemsById);
        setGroupTotalRootItems.call(this, totalRootItems);
        
        if (options.lockUpdate !== false) {
            setGroupLockedItemsById.call(this, groupLockedItemsById);
        }
    }
    
    function getDataManager() {
        /* jshint validthis:true */
        return _(this).dataManager;
    }
    
    // data by id
    
    function getGroupItemsById() {
        /* jshint validthis:true */
        // ids mapped as index to improve performance
        // reducing the iterations for search
        return _(this).groupItemsById;
    }
    
    function setGroupItemsById(groupItemsById) {
        /* jshint validthis:true */
        _(this).groupItemsById = groupItemsById;
    }
    
    // locked items
    
    function getGroupLockedItemsById() {
        /* jshint validthis:true */
        return _(this).groupLockedItemsById;
    }
    
    function setGroupLockedItemsById(groupLockedItemsById) {
        /* jshint validthis:true */
        _(this).groupLockedItemsById = groupLockedItemsById;
    }
    
    // cached / backup data
    
    function getBackupGroupItemsById() {
        /* jshint validthis:true */
        return _(this).groupItemsByIdBackup;
    }
    
    function backupGroupItemsById() {
        /* jshint validthis:true */
        _(this).groupItemsByIdBackup = getGroupItemsById.call(this);
    }
    
    function clearBackupGroupItemsById() {
        /* jshint validthis:true */
        _(this).groupItemsByIdBackup = {};
    }
    
    function restoreGroupItemsById() {
        /* jshint validthis:true */
        setGroupData.call(this, _(this).groupItemsByIdBackup, {lockUpdate: false});
    }
    
    // total root items
    
    function setGroupTotalRootItems(totalRootItems) {
        /* jshint validthis:true */
        _(this).groupTotalRootItems = totalRootItems;
    }
    
    function incrementGroupTotalRootItems() {
        /* jshint validthis:true */
        _(this).groupTotalRootItems++;
    }
    
    function decrementGroupTotalRootItems() {
        /* jshint validthis:true */
        _(this).groupTotalRootItems--;
    }
    
    /**
     * Add a single item to the items by id map.
     * Increment the groupTotalRootItems when the item is a root item.
     * @param id
     * @param options
     */
    function addSingleItem(id, options) {
        /* jshint validthis:true */
        options = options || {};
        
        var groupItemsById = getGroupItemsById.call(this),
            currentFilter = getGroupFilter.call(this),
            item = getDataManager.call(this).getItemById(id),
        // update the item if not already present in the data-set
            isItemAdded = groupItemsById[id] === undefined
            ;
        
        // clone the item and add the filter info
        if (currentFilter !== undefined) {
            var backupItemsById = getBackupGroupItemsById.call(this);
            backupItemsById[id] = item;
            
            item = cloneItem(item);
            item.filter = currentFilter;
        }
        
        if (options.lockUpdate === true && item && item.locked === true) {
            getGroupLockedItemsById.call(this)[id] = item;
        }
        
        groupItemsById[id] = item;
        
        // skip if already present in data-set
        if (isItemAdded && item && item.parent === null) {
            incrementGroupTotalRootItems.call(this);
        }
    }
    
    function removeSingleItem(id, options) {
        /* jshint validthis:true */
        options = options || {};
        
        var groupItemsById = getGroupItemsById.call(this),
        // update the item if already present in the data-set
            isItemRemoved = groupItemsById[id] !== undefined,
            item = groupItemsById[id];
        
        if (options.preserveBackup !== true && getGroupFilter.call(this) !== undefined) {
            // remove the item from the filter
            var backupItemsById = getBackupGroupItemsById.call(this);
            delete backupItemsById[id];
        }
        
        // skip if not present in data-set
        if (item === undefined) {
            return;
        }
        
        if (options.lockUpdate === true && item.locked === true) {
            var lockedItemsById = getGroupLockedItemsById.call(this);
            delete lockedItemsById[id];
        }
        
        // remove from the original and filtered data-set
        delete groupItemsById[id];
        
        if (isItemRemoved && item.parent === null) {
            decrementGroupTotalRootItems.call(this);
        }
    }
    
    function calculateItemsTree(itemIds, options) {
        /* jshint validthis:true */
        options = options || {};
        
        var dataManager = getDataManager.call(this),
            groupItemsByIdBackup = getBackupGroupItemsById.call(this),
        // take the data from the group data set when the add is used to show filtered data
            isDataFromGroupDataSet = options.filter === true,
            parentIdsMap = {},
            itemIdsMap = {},
            childrenIdsMap = {};
        
        itemIds.forEach(function (itemId) {
            // skip when the item has been added as a children of another item
            // in this case, both the parent and children have been already added
            if (childrenIdsMap[itemId] !== undefined) {
                return;
            }
            
            itemIdsMap[itemId] = itemId;
            
            var isDefinedInGroup = groupItemsByIdBackup[itemId] !== undefined,
                item = isDataFromGroupDataSet && isDefinedInGroup ? groupItemsByIdBackup[itemId] : dataManager.getItemById(itemId);
            if (item && item.parent !== null) {
                var parents = dataManager.traceParent({itemId: itemId});
                
                parents.forEach(function (parentId) {
                    // use id as index to prevent duplicates
                    parentIdsMap[parentId] = parentId;
                });
            }
            
            if (item && item.children !== undefined && item.children > 0) {
                var childrenIds = dataManager.traceChildren({itemId: itemId});
                
                // reduce the ids to the ids present in the group data set
                if (isDataFromGroupDataSet) {
                    childrenIds = childrenIds.filter(function (itemId) {
                        return groupItemsByIdBackup[itemId] !== undefined;
                    });
                }
                
                childrenIds.forEach(function (childId) {
                    // use id as index to prevent duplicates
                    childrenIdsMap[childId] = childId;
                })
                ;
            }
        });
        
        return {
            parents: Object.keys(parentIdsMap),
            items: Object.keys(itemIdsMap),
            children: Object.keys(childrenIdsMap)
        };
    }
    
    function cloneItem(item) {
        /* jshint validthis:true */
        return JSON.parse(JSON.stringify(item));
    }
    
    // Filter
    
    function getGroupFilterFct() {
        /* jshint validthis:true */
        return _(this).groupFilterFct;
    }
    
    function setGroupFilterFct(filterFct) {
        /* jshint validthis:true */
        var tmpFct;
        
        if (typeof filterFct === 'function') {
            _(this).customFilter = true;
            tmpFct = filterFct;
        }
        else if (filterFct !== undefined && filterFct.caseSensitive === false) {
            tmpFct = function (item, filter) {
                var lowerCaseLabel = item.label.toLocaleLowerCase(),
                    lowerCaseFilter = filter.toLocaleLowerCase();
                
                return lowerCaseLabel.indexOf(lowerCaseFilter) !== -1;
            };
        }
        else {
            tmpFct = function (item, filter) {
                return item.label.indexOf(filter) !== -1;
            };
        }
        
        _(this).groupFilterFct = tmpFct;
    }
    
    function isCustomFilterFct() {
        /* jshint validthis:true */
        return _(this).customFilter === true;
    }
    
    function getGroupFilter() {
        /* jshint validthis:true */
        return _(this).groupFilter;
    }
    
    function setGroupFilter(filter) {
        /* jshint validthis:true */
        _(this).groupFilter = filter;
    }
    
    //-------------------------------------------------------- Public
    
    function getGroupTotalRootItems() {
        /* jshint validthis:true */
        return _(this).groupTotalRootItems;
    }
    
    function queryGroupData(queries, resolve, idsOnly) {
        /* jshint validthis:true */
        var dataSetById = getGroupItemsById.call(this),
            dataManager = getDataManager.call(this),
            output = [];
        
        queries.forEach(function (query) {
            // performance improvement,
            // parent indexed by id with list of direct children
            var filteredItems = dataManager.getItemsByParentId(query.parent)
                .filter(function (obj) {
                    return dataSetById[obj.id] !== undefined;
                })
                .map(function (obj) {
                    // retrieve the item from the data set
                    // as it may contain an altered version of the item with a lower child count
                    return idsOnly ? obj.id : dataSetById[obj.id];
                });
            
            output.push({
                parent: query.parent,
                items: filteredItems.splice(query.offset, query.limit)
            });
        });
        
        resolve(JSON.parse(JSON.stringify(output)));
    }
    
    function getGroupItemsIds() {
        /* jshint validthis:true */
        var dataById = getGroupFilter.call(this) !== undefined ? getBackupGroupItemsById.call(this) : getGroupItemsById.call(this);
        
        return Object.keys(dataById);
    }
    
    function addItems(itemIdsToAdd, options) {
        /* jshint validthis:true */
        options = options || {};
        
        var dataManager = getDataManager.call(this),
            groupItemsById = getGroupItemsById.call(this),
            itemsTree = calculateItemsTree.call(this, itemIdsToAdd, options),
            wrappedAdd = function (item) {
                addSingleItem.call(this, item, options);
            }.bind(this);
        
        // items requested to be added and their related items e.g. parents, children
        itemsTree.parents.forEach(wrappedAdd);
        itemsTree.items.forEach(wrappedAdd);
        itemsTree.children.forEach(wrappedAdd);
        
        // update the number of children for each added/updated parent having a child moved
        itemsTree.parents.forEach(function (id) {
            var item = groupItemsById[id],
                childCount = 0;
            
            // count the number of child items present in the data-set
            dataManager.getItemsByParentId(id).forEach(function (childItem) {
                if (groupItemsById[childItem.id] !== undefined) {
                    childCount++;
                }
            });
            
            // keep an altered copy only if child count is different
            if (item.children !== childCount) {
                var clonedItem = cloneItem(item);
                clonedItem.children = childCount;
                groupItemsById[id] = clonedItem;
            }
            
        }.bind(this));
        
        var currentFilter = getGroupFilter.call(this);
        
        if (options.filter !== true && currentFilter !== undefined) {
            applyFilter.call(this, currentFilter);
        }
    }
    
    function removeItems(itemIdsToRemove, options) {
        /* jshint validthis:true */
        options = options || {};
        
        var dataManager = getDataManager.call(this),
            groupItemsById = getGroupItemsById.call(this),
            itemsTree = calculateItemsTree.call(this, itemIdsToRemove),
            parentItemIdsToUpdate = itemsTree.parents,
            processedItems = itemsTree.parents.concat(itemsTree.items, itemsTree.children),
            countChildInDataSet = function (dataSet, id) {
                var childCount = 0;
                
                dataManager.getItemsByParentId(id).forEach(function (childItem) {
                    if (dataSet[childItem.id] !== undefined) {
                        childCount++;
                    }
                });
                
                return childCount;
            },
            mergeNoDuplicate = function (arrayA, arrayB) {
                arrayA.forEach(function (itemId) {
                    if (arrayB.indexOf(itemId) === -1) {
                        arrayB.push(itemId);
                    }
                });
            },
            wrappedRemove = function (item) {
                removeSingleItem.call(this, item, options);
            }.bind(this);
        
        // items requested to be removed and their children
        itemsTree.items.forEach(wrappedRemove);
        itemsTree.children.forEach(wrappedRemove);
        
        // while loop as more content can be added
        // update the number of children for each removed/updated parent having a child moved
        while (parentItemIdsToUpdate.length !== 0) {
            var id = parentItemIdsToUpdate.pop(),
            // get item from group data first,
            // could have filter info, else, get from dataManager
                item = groupItemsById[id] || dataManager.getItemById(id),
                childCount = countChildInDataSet(groupItemsById, id);
            
            if (childCount === 0) {
                var countInBackup = countChildInDataSet(getBackupGroupItemsById.call(this), id);
                //-------------------------------------------------------------
                // delete the parent element when its child count has reached 0
                removeSingleItem.call(this, id, {
                    preserveBackup: countInBackup - childCount !== 0,
                    lockUpdate: options.lockUpdate
                });
                //-------------------------------------------------------------
                
                // as we remove the item,
                // we need to reprocess the parent to update childCount and verify parent is not last children too
                mergeNoDuplicate(dataManager.traceParent({itemId: id}), parentItemIdsToUpdate);
            }
            else if (item.children !== childCount) {
                // keep an altered copy only if child count is different
                var clonedItem = cloneItem(item);
                clonedItem.children = childCount;
                groupItemsById[id] = clonedItem;
                
                if (getGroupFilter.call(this) !== undefined) {
                    // update the item on the backup list too
                    var backedUpItem = getBackupGroupItemsById.call(this)[id];
                    
                    if (backedUpItem !== undefined) {
                        backedUpItem.children = childCount;
                    }
                }
            }
        }
        
        return processedItems;
    }
    
    function addAllItems() {
        /* jshint validthis:true */
        setGroupData.call(this, getDataManager.call(this).getDataById(), {lockUpdate: false});
        if (getGroupFilter.call(this) !== undefined) {
            // when filtered data, update the old backup with the new data set
            backupGroupItemsById.call(this);
        }
    }
    
    function removeAllItems(options) {
        /* jshint validthis:true */
        options = options || {};
        // removeAll virtually processes all the items
        var groupData = getGroupFilter.call(this) !== undefined ? getBackupGroupItemsById.call(this) : getGroupItemsById.call(this),
            processedItems = Object.keys(groupData);
        
        setGroupData.call(this, {}, {lockUpdate: false});
        
        if (options.clearBackup !== false) {
            clearBackupGroupItemsById.call(this);
        }
        
        return processedItems;
    }
    
    function applyFilter(filter) {
        /* jshint validthis:true */
        filter = filter ? filter : undefined;
        
        var previousFilter = getGroupFilter.call(this);
        
        setGroupFilter.call(this, filter);
        
        // create a backup copy of all the items on the data set,
        // then filter the group data set
        if (previousFilter === undefined) {
            backupGroupItemsById.call(this);
        }
        
        if (filter !== undefined) {
            var filterFct = getGroupFilterFct.call(this),
            // when a custom filter function is set, use the full data set
                isCustomFilter = isCustomFilterFct.call(this),
                isFilterNarrowing = previousFilter !== undefined && filter.indexOf(previousFilter) !== -1,
            /* jshint laxbreak:true*/
                dataSet = !isCustomFilter && isFilterNarrowing
                    // when the new filter is a subset of the previous filter,
                    // use previously generated data-set
                    ? getGroupItemsById.call(this)
                    // when the new filter is broader OR custom filter function is used, use the full data-set
                    : getBackupGroupItemsById.call(this),
            /* jshint laxbreak:false*/
                filteredItemIds = Object.keys(dataSet)
                    .filter(function (id) {
                        return filterFct(dataSet[id], filter);
                    });
            
            removeAllItems.call(this, {clearBackup: false});
            // add all the items matching the filter to the list
            addItems.call(this, filteredItemIds, {filter: true});
        }
        else {
            restoreGroupItemsById.call(this);
            clearBackupGroupItemsById.call(this);
        }
    }
    
    //-------------------------------------------------------- Exposed API
    
    ItemGroup.prototype.queryGroupData = queryGroupData;
    ItemGroup.prototype.getGroupItemsIds = getGroupItemsIds;
    
    ItemGroup.prototype.getGroupLockedItemsById = getGroupLockedItemsById;
    ItemGroup.prototype.getGroupTotalRootItems = getGroupTotalRootItems;
    
    ItemGroup.prototype.getGroupFilter = getGroupFilter;
    ItemGroup.prototype.applyFilter = applyFilter;
    
    ItemGroup.prototype.addItems = addItems;
    ItemGroup.prototype.addAllItems = addAllItems;
    
    ItemGroup.prototype.removeItems = removeItems;
    ItemGroup.prototype.removeAllItems = removeAllItems;
    
    // testing only
    ItemGroup.prototype._getGroupItemsById = getGroupItemsById;
    ItemGroup.prototype._getBackupGroupItemsById = getBackupGroupItemsById;
    
    return ItemGroup;
});
