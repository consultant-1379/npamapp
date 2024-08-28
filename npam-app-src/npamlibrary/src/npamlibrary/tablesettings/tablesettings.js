define([
    'jscore/core',
    './tablesettingsView',
    '../settings/Settings',
    'npamlibrary/serverUtil',
    'npamlibrary/restUrls',
    'container/api'
], function (core, View, Settings, ServerUtil, RestUrls, container) {

    return core.Region.extend({

        View: View,

        init: function (options) {
            this.columns = options.columns;
            this.appName = options.appName;
            this.tableId = options.tableId;
        },

        updateTableSettingsFromRegion: function(columns) {
            this.columns = columns;
            this.getSavedTableSettings();
        },

        onStart: function () {
            this.getSavedTableSettings();
        },

        buildSettings: function() {
            if(this.settings) this.settings.destroy();
            this.settings = new Settings({context: this.getContext(), columns: this.columns});
            this.settings.attachTo(this.getElement());
            this.settings.addApplyHandle(function () {
                this.controlIfSelectedNone(this.settings.tableSettings.getUpdatedColumns());
                this.getEventBus().publish("rightStatus", false);
            }.bind(this));
            this.settings.addCancelHandle(function () {
                container.getEventBus().publish('flyout:hide');
                this.getEventBus().publish('layouts:closerightpanel');
            }.bind(this));
        },

        getSavedTableSettings : function() {
           if(this.appName){
                ServerUtil.sendRestCall(
                           'GET',
                           RestUrls.getSavedTableSettings.replace("appName",this.appName),
                           this.setTableSettings.bind(this),
                           this.errorFetchingSettings.bind(this),
                           'json',
                           'application/json'
                );
           } else {
                this.setTableSettings();
           }

        },

        setTableSettings: function(response) {
            if(response && response.length > 0) {
                this.updateColumns(response);
            }
            this.buildSettings();
        },

        errorFetchingSettings: function() {
            this.buildSettings();
        },

        updateColumns: function(response) {
            var columnStatus;
            response.forEach(function(table) {
                if(table.id === this.tableId) {
                    columnStatus = JSON.parse(table.value);
                }
            }.bind(this));
            for(var key in columnStatus) {
                for(var i=0; i<this.columns.length; i++) {
                   if(this.columns[i].attribute === key) {
                       this.columns[i].visible = columnStatus[key].visible;
                       this.columns[i].order = columnStatus[key].order;
                       this.columns[i].pinned = columnStatus[key].pinned;
                   }
                }
            }
            this.columns.sort(function(a, b){
                return a.order - b.order;
            });
        },

        controlIfSelectedNone: function (columns) {
            var count = 0;
            var cloned = [];
            columns.forEach(function (col) {
                var clone = {};
                for (var prop in col) {
                    clone[prop] = col[prop];
                }
                cloned.push(clone);
            });
            cloned.forEach(function (model) {
                if (model.visible === true) {
                    count++;
                }
            });
            this.saveTableSettings(cloned, count === 0? true : false);
        },

        saveTableSettings: function(columns, noColSelected) {

            if(this.appName){
            var payload = {};
                        payload.id = this.tableId;
                        payload.value = this.getColumnStatus(columns);
                        ServerUtil.sendRestCall(
                            'PUT',
                            RestUrls.getSavedTableSettings.replace("appName",this.appName),
                            this.publishColumns.bind(this, columns, noColSelected),
                            this.publishColumns.bind(this, columns, noColSelected),
                            'text/plain',
                            'application/json',
                            JSON.stringify(payload)
                        );
            }
            else {
            this.publishColumns(columns, noColSelected);
            }

        },

        publishColumns: function(columns, noColSelected) {
            if(noColSelected) {
                this.getEventBus().publish("noColSelected", columns);
            } else {
                this.getEventBus().publish('updatecolumns', columns);
            }
            this.getEventBus().publish('layouts:closerightpanel');
            container.getEventBus().publish('flyout:hide');
        },

        getColumnStatus: function(columns) {
            var value = {};
            columns.forEach(function(col, index) {
                value[col.attribute] = this.getColValues(col, index+1);
            }.bind(this));
            return JSON.stringify(value);
        },

        getColValues: function(col, order) {
            var obj = {};
            obj.visible = col.visible;
            obj.order = order;
            obj.pinned = col.pinned;
            return obj;
        },

        setHeader: function (value) {
            this.view.setHeader(value);
        },

        hideHeader: function () {
            this.view.hideHeader();
        }
    });
});
