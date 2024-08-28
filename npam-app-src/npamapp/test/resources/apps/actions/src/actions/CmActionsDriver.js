define([
    'jscore/core',
    'jscore/ext/net',
    'layouts/TopSection',
    'tablelib/Table',
    'tablelib/plugins/Selection',
    'actionlibrary/ActionLibrary'
], function (core, net, TopSection, Table, Selection, ActionLibrary) {
    /**
     * Action test app
     *
     * A simple app that demonstrates the behavior of an application that uses the ActionLibrary
     * https://arm1s11-eiffel004.eiffel.gic.ericsson.se:8443/nexus/content/sites/tor/applib/latest/api/classes/ActionLibrary.html
     *
     * How it works:
     * * The action bar presents a list of predetermined actions
     * * "Results for <MO type>" creates a table with a list of that MO type, taken from the topology search service
     * * Selecting one or more MO type dispatches that selection to the Action Service to locate any matching Actions
     * * The list of matching Actions is returned, and put into context in the Action Bar
     * * Selecting an Action then executes that Action with the selected data.
     */
    return core.App.extend({
        onStart: function () {
            var searchActions = ["SubNetwork", "MeContext", "ENodeBFunction"].map(function(moType){
               return {
                   name: 'Results for ' + moType,
                   type: 'button',
                   action: function() {
                       this.getSearchData(moType);
                   }.bind(this)
               };
            }.bind(this));
            var defaultActions = searchActions; //.concat as needed
            this.topSection = new TopSection({
                context: this.getContext(),
                breadcrumb: this.options.breadcrumb,
                title: this.options.properties.title,
                defaultActions: defaultActions
            });
            this.topSection.attachTo(this.getElement());
        },

        /**
         * Perform a search on Topology Search Service
         * @param identifier
         */
        getSearchData: function(identifier) {
            net.ajax({
                url: '/managedObjects/search?query=' + identifier,
                dataType: 'json',
                success: function(searchData){
                    this.showTable(searchData);
                }.bind(this)
            });
        },

        /**
         * Show a table for the given data
         * @param results the results data
         */
        showTable: function(results) {
            if (this.table) this.table.detach(this.getElement());
            this.table = new Table({
                columns: ['id','type'].map(function(attribute){
                    return {title: attribute, attribute: attribute};
                }),
                data: results.objects,
                plugins: [
                    new Selection({
                        checkboxes: true,
                        selectableRows: true,
                        multiselect: true,
                        bind: true
                    })
                ]
            });
            this.table.addEventHandler('rowselectend', this.onRowSelect, this);
            this.topSection.setContent(this.table);
        },

        /**
         * Callback fired on row selection
         * @param rows
         */
        onRowSelect: function(rows){
            var selectedIds = rows.map(function(row){
                var data = row.getData();
                return Object.keys(data).reduce(function(sum, key) {
                    sum[key] = data[key];
                    return sum;
                }, {});
            });
            if (selectedIds.length === 0) {
                this.getEventBus().publish('topsection:leavecontext', []);
                return;
            }
            this.getActions(selectedIds, function(actions){
                this.getEventBus().publish('topsection:contextactions', actions);
            }.bind(this));
        },

        /**
         * Contact the Actions Service to retrieve matching Actions
         * @param objects the user selection
         * @param callback What to do on completion
         */
        getActions: function(objects, callback) {
            var metaObject = ActionLibrary.createMetaObject(
                'networkexplorer',
                'ManagedObject',
                objects
            );
            ActionLibrary.getAvailableActions(metaObject)
                .then(function(returnedActions) {
                    // Transform Action (Framework -> Bar)
                    var transformedActions = this.transformActions(returnedActions, objects);
                    callback(transformedActions);
                }.bind(this)).catch(function() {
                    console.error('No action found');
                    callback([]);
                });
        },

        /**
         * Reformat Actions into objects required by UISDK TopSection / ContextMenu
         */
        transformActions: function(returnedActions, objects) {
            return returnedActions.map(function(action) {
                var resultAction = {
                    category: action.category,
                    actionBarOnly: action.actionBarOnly,
                    type: 'button',
                    name: action.defaultLabel,
                    action: function() {
                        this.launchAction(action, objects);
                    }.bind(this)
                };
                if (action.icon) {
                    resultAction.icon = action.icon;
                }
                return resultAction;
            }.bind(this));
        },

        /**
         * Execute the Action
         * @param action an Action object to execute
         * @param objects the user selection
         */
        launchAction: function(action, objects) {
            ActionLibrary.executeAction(action, objects, {
                onReady: function () {},
                onProgress: function () {},
                onComplete: function () {},
                onFail: function () {}
            });
        }
    });

});
