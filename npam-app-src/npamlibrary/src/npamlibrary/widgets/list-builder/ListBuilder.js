/*global define*/
define([
    'jscore/core',
    'jscore/ext/privateStore',
    './list-tree/ListTree',
    './utils/DataGroupManager',
    'uit!./_listBuilder.hbs'
], function (core, PrivateStore, ListTree, DataGroupManager, View) {
    'use strict';

    var _ = PrivateStore.create();

    return core.Widget.extend({

        SOURCE_SELECT: 'source:select',
        DESTINATION_SELECT: 'destination:select',
        ADD: 'add',
        ADD_ALL: 'addAll',
        REMOVE: 'remove',
        REMOVE_ALL: 'removeAll',

        view: function () {
            var options = this.options,
                menu = options.menu,
                isSourceWithTitle = options.source && options.source.labels && options.source.labels.title !== undefined,
                isDestinationWithTitle = options.destination && options.destination.labels && options.destination.labels.title !== undefined;

            return new View({
                // margin on tree or menu to keep the alignment when either side have a title
                menuTopMargin: isSourceWithTitle || isDestinationWithTitle,
                sourceTopMargin: !isSourceWithTitle && isDestinationWithTitle,
                destinationTopMargin: !isDestinationWithTitle && isSourceWithTitle,
                menuOptions: {
                    labels: {
                        // i18n API
                        add: menu.add,
                        addAll: menu.addAll,
                        remove: menu.remove,
                        removeAll: menu.removeAll
                    }
                }
            });
        },

        init: function () {
            _(this).eventBus = new core.EventBus();
            _(this).currentSourceSelection = [];
            _(this).currentDestinationSelection = [];
        },

        onViewReady: function () {
            var options = this.options,
                sourceOptions = options.source !== undefined ? options.source : {},
                destinationOptions = options.destination !== undefined ? options.destination : {};

            // subscribe to the event before as the DataGroupManager calls getData at the init phase
            _(this).eventBus.subscribe('data:ready', function () {
                _(this).resizeEvtId = core.Window.addEventHandler('resize', onResize.bind(this));

                this.view.findById('loader').remove();

                initializeMenu.call(this);
                initializeSource.call(this);
                initializeDestination.call(this);

                if (options.enabled === false) {
                    this.setEnabled(options.enabled);
                }
            }.bind(this));

            _(this).dataGroupManager = new DataGroupManager({
                filter: {
                    source: sourceOptions.filter,
                    destination: destinationOptions.filter
                },
                items: {
                    destination: destinationOptions.items
                },
                getData: options.getData,
                eventBus: _(this).eventBus
            });
        },

        getSourceItemsIds: function () {
            return getDataGroupManager.call(this).getSourceItemsIds();
        },

        getDestinationItemsIds: function () {
            return getDataGroupManager.call(this).getDestinationItemsIds();
        },

        onDestroy: function () {
            core.Window.removeEventHandler(_(this).resizeEvtId);
        },

        setEnabled: function (isEnabled) {
            isEnabled = isEnabled !== false;

            if (_(this).source !== undefined) {
                _(this).source.setEnabled(isEnabled);
            }

            if (_(this).destination !== undefined) {
                _(this).destination.setEnabled(isEnabled);
            }

            _(this).menu.enableMenuItem({
                add: isEnabled,
                addAll: isEnabled,
                remove: isEnabled,
                removeAll: isEnabled
            });
        }
    });

    //------------------------------------------------------------ Source

    function initializeSource() {
        /* jshint validthis:true */
        var options = this.options,
            sourceOptions = options.source !== undefined ? options.source : {},
            dataGroupManager = getDataGroupManager.call(this),
            source = new ListTree({
                getIds: function (queries, resolve, reject) {
                    dataGroupManager.getSourceData(queries, resolve, reject, true);
                },
                itemType: sourceOptions.itemType,
                labels: sourceOptions.labels,
                totalRootItems: dataGroupManager.getSourceTotalRootItems(),
                getData: dataGroupManager.getSourceData.bind(dataGroupManager)
            });

        source.attachTo(this.view.findById('sourceTreeHolder'));
        source.addEventHandler(ListTree.prototype.ITEM_SELECT, onSourceItemSelect.bind(this));
        source.addEventHandler(ListTree.prototype.FILTER_CHANGE, onSourceFilterChange.bind(this));
        _(this).source = source;
    }

    function redrawSource(options) {
        /* jshint validthis:true */
        options = options || {};

        var totalRootItems = getDataGroupManager.call(this).getSourceTotalRootItems();

        redrawList(_(this).source, totalRootItems, options);
    }

    function onSourceItemSelect(selectedIds) {
        /* jshint validthis:true */
        _(this).currentSourceSelection = getDataGroupManager.call(this).filterOutLockedItems(selectedIds);

        configureMenu.call(this);

        this.trigger(this.SOURCE_SELECT, selectedIds);
    }

    function onSourceFilterChange(filter) {
        /* jshint validthis:true */

        getDataGroupManager.call(this).applyFilterToSource(filter);

        redrawSource.call(this);
        configureMenu.call(this);
    }

    function getCurrentSourceSelection() {
        /* jshint validthis:true */
        return _(this).currentSourceSelection;
    }

    //------------------------------------------------------------ Destination

    function initializeDestination() {
        /* jshint validthis:true */
        var options = this.options,
            destinationOptions = options.destination !== undefined ? options.destination : {},
            dataGroupManager = getDataGroupManager.call(this),
            destination = new ListTree({
                getIds: function (queries, resolve, reject) {
                    dataGroupManager.getDestinationData(queries, resolve, reject, true);
                },
                itemType: destinationOptions.itemType,
                labels: destinationOptions.labels,
                totalRootItems: dataGroupManager.getDestinationTotalRootItems(),
                getData: dataGroupManager.getDestinationData.bind(dataGroupManager)
            });

        destination.attachTo(this.view.findById('destinationTreeHolder'));
        destination.addEventHandler(ListTree.prototype.ITEM_SELECT, onDestinationItemSelect.bind(this));
        destination.addEventHandler(ListTree.prototype.FILTER_CHANGE, onDestinationFilterChange.bind(this));
        _(this).destination = destination;
    }

    function redrawDestination(options) {
        /* jshint validthis:true */
        options = options || {};

        var totalRootItems = getDataGroupManager.call(this).getDestinationTotalRootItems();

        redrawList(_(this).destination, totalRootItems, options);
    }

    function onDestinationItemSelect(selectedIds) {
        /* jshint validthis:true */
        _(this).currentDestinationSelection = getDataGroupManager.call(this).filterOutLockedItems(selectedIds);

        configureMenu.call(this);

        this.trigger(this.DESTINATION_SELECT, selectedIds);
    }

    function onDestinationFilterChange(filter) {
        /* jshint validthis:true */

        getDataGroupManager.call(this).applyFilterToDestination(filter);

        redrawDestination.call(this);
        configureMenu.call(this);
    }

    function getCurrentDestinationSelection() {
        /* jshint validthis:true */
        return _(this).currentDestinationSelection;
    }

    //------------------------------------------------------------ Menu events

    function initializeMenu() {
        /* jshint validthis:true */
        var menu = this.view.findById('menu'),
            dataGroupManager = getDataGroupManager.call(this);

        menu.enableMenuItem({
            add: false,
            addAll: dataGroupManager.getSourceTotalRootItems() > 0,
            remove: false,
            removeAll: dataGroupManager.getDestinationTotalRootItems() > 0
        });

        menu.addEventHandler(menu.MENU_ADD, onAdd.bind(this));
        menu.addEventHandler(menu.MENU_ADD_ALL, onAddAll.bind(this));

        menu.addEventHandler(menu.MENU_REMOVE, onRemove.bind(this));
        menu.addEventHandler(menu.MENU_REMOVE_ALL, onRemoveAll.bind(this));

        _(this).menu = menu;
    }

    function configureMenu() {
        /* jshint validthis:true */
        var dataGroupManager = getDataGroupManager.call(this),
            isSourceFiltered = dataGroupManager.getSourceFilter() !== undefined,
            isDestinationFiltered = dataGroupManager.getDestinationFilter() !== undefined,
            isSourceEmpty = dataGroupManager.getSourceTotalRootItems() === 0,
            isDestinationEmpty = dataGroupManager.getDestinationTotalRootItems() === 0;

        _(this).menu.enableMenuItem({
            add: getCurrentSourceSelection.call(this).length > 0,
            addAll: !isSourceFiltered && !isSourceEmpty,
            remove: getCurrentDestinationSelection.call(this).length > 0,
            removeAll: !isDestinationFiltered && !isDestinationEmpty
        });
    }

    function onAdd() {
        /* jshint validthis:true */
        getDataGroupManager.call(this).moveItems(_(this).currentSourceSelection, undefined);
        this.trigger(this.ADD, _(this).currentSourceSelection);

        _(this).currentSourceSelection = [];

        redrawFullList.call(this);
    }

    function onRemove() {
        /* jshint validthis:true */
        getDataGroupManager.call(this).moveItems(undefined, _(this).currentDestinationSelection);
        this.trigger(this.REMOVE, _(this).currentDestinationSelection);

        _(this).currentDestinationSelection = [];

        redrawFullList.call(this);
    }

    function onAddAll() {
        /* jshint validthis:true */
        getDataGroupManager.call(this).moveItems('all', undefined);
        this.trigger(this.ADD_ALL);

        _(this).currentSourceSelection = [];

        redrawFullList.call(this);
    }

    function onRemoveAll() {
        /* jshint validthis:true */
        getDataGroupManager.call(this).moveItems(undefined, 'all');
        this.trigger(this.REMOVE_ALL);

        _(this).currentDestinationSelection = [];

        redrawFullList.call(this);
    }

    //-------------------------------------------- Global

    function getDataGroupManager() {
        /* jshint validthis:true */
        return _(this).dataGroupManager;
    }

    function redrawList(list, rootItems, options) {
        options = options || {};

        list.setTotalRootItems(rootItems);
        list.updateListTitle();

        list.unselectAll();
        list.redraw({
            force: options.force
        });
    }

    function redrawFullList() {
        /* jshint validthis:true */
        redrawSource.call(this, {force: true});
        redrawDestination.call(this, {force: true});

        configureMenu.call(this);
    }

    function onResize() {
        /* jshint validthis:true */
        if (_(this).source !== undefined) {
            _(this).source.redraw();
        }

        if (_(this).destination !== undefined) {
            _(this).destination.redraw();
        }
    }
});
