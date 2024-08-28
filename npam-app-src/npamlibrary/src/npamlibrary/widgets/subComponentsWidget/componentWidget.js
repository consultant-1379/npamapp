/*global define*/
define([
    'jscore/core',
    '../list-builder/utils/DataService',
    '../list-builder/custom-item/CustomItem',
    'uit!./_componentWidget.hbs',
    'i18n!npamlibrary/dictionary.json'
], function (core, dataService, CustomItem, View, dictionary) {
    'use strict';

    return core.Widget.extend({

        view: function () {
            return new View({
                listOptions: {
                    getData: dataService.getData,
                    //enabled: false,                 // default true
                    source: {
                        itemType: CustomItem,
                        filter: {
                            caseSensitive: false    // default true
                        },
                        labels: {
                            filter: dictionary.list.header.typeToFind,
                            title: function () {
                                return dictionary.list.header.availableElements + ' (' + this.getComponentsCount(this.view.findById('listBuilder').getSourceItemsIds()) + ')';
                            }.bind(this)
                        }
                    },
                    menu: {
                        labels: dictionary.list.menu
                    },
                    destination: {
                        items: this.items,
                        filter: {
                            caseSensitive: false    // default true
                        },
                        itemType: CustomItem,
                        labels: {
                            filter: dictionary.list.header.typeToFind,
                            title: function () {
                                return dictionary.list.header.selectedElements + ' (' + this.getComponentsCount(this.view.findById('listBuilder').getDestinationItemsIds()) + ')';
                            }.bind(this)
                        }
                    }
                }
            });
        },

        init: function(options) {
            this.eventBus = options.eventBus;
            this.model = options.model;
            this.isOldJob = options.isOldJob;
            this.oldJobComponentList = options.oldJobComponentList;
            this.nodeTopology = options.nodeTopology;
            this.componentData = dataService.setData(options.nodeTopology);
            this.selectedcomponent = [];
            this.appName = options.appName;
            this.prepareListBuilderItems();
        },

        onViewReady: function () {
            this.listBuilder = this.view.findById('listBuilder');
            this.listBuilder.addEventHandler(this.listBuilder.ADD, this.selectedcompIds.bind(this));
            this.listBuilder.addEventHandler(this.listBuilder.ADD_ALL, this.selectedcompIds.bind(this));
            this.listBuilder.addEventHandler(this.listBuilder.REMOVE, this.selectedcompIds.bind(this));
            this.listBuilder.addEventHandler(this.listBuilder.REMOVE_ALL, this.selectedcompIds.bind(this));
            this.selectedcompIds(undefined, this.items);
        },

        prepareListBuilderItems: function() {
            var oldJobParentNodeName = [];
            var newlyAddedtoOldjob = false;
            var oldJobDefaultClusterID = [];
            var selectedIds = [];
            if (!this.isOldJob && this.oldJobComponentList.length === 0) {
                this.items = dataService.defaultaxecluster(this.appName);
            } else if (this.oldJobComponentList) {
                for (var i=0; i<this.oldJobComponentList.length; i++) {
                    this.items = dataService.oldJobSelection(this.oldJobComponentList[i], selectedIds);
                    var oldJobParentNode = this.oldJobComponentList[i].split("__")[0];
                    if(!oldJobParentNodeName.includes(oldJobParentNode)) {
                        oldJobParentNodeName.push(oldJobParentNode);
                    }
                }
            }

            if (this.isOldJob && this.nodeTopology.length > 0 ) {
                if (this.oldJobComponentList.length > 0 && oldJobParentNodeName.length > 0) {
                    for(var k=0; k<this.nodeTopology.length; k++) {
                        if (!oldJobParentNodeName.includes(this.nodeTopology[k].nodeName)) {
                           oldJobDefaultClusterID = dataService.defaultClusterOldJob(this.nodeTopology[k]);
                        }
                    }
                } else {
                    this.items = dataService.defaultaxecluster();
                }
            }

            if (oldJobDefaultClusterID.length > 0) {
                for (var l=0; l<oldJobDefaultClusterID.length; l++) {
                    if (!this.items.includes(oldJobDefaultClusterID[l])) {
                        this.items.push(oldJobDefaultClusterID[l]);
                    }
                }
            }
            if (Object.keys(this.model.getAttribute("SelectedComponentBackup")).length > 0){
                this.getExistingSavedTopologyData(this.model.getAttribute("SelectedComponentBackup"));
            }
        },

        selectedcompIds: function(a,selectedIds) {
            if (selectedIds) {
                selectedIds = selectedIds;
            } else {
                selectedIds = this.listBuilder.getDestinationItemsIds();
            }
            this.selectedcomponent = [];
            for(var i=0; i<this.componentData.length; i++) {
                for (var j=0; j<selectedIds.length; j++){
                    if ((this.componentData[i].id === parseInt(selectedIds[j]) ) && (this.componentData[i].netype)) {
                        this.selectedcomponent.push(this.componentData[i]);
                    }
                }
            }
            this.getSelComps(this.selectedcomponent);
        },

        getSelComps: function(components) {
            var componentObj = {};
            for (var node in components) {
                var component = components[node];
                var neType = component.netype;
                var parent = component.parent;
                var nodename = component.nodename;
                var cpname = component.label;
                if (parent !== null) {
                    if(!componentObj[neType]) {
                        componentObj[neType] = {
                            "neNames" : { }
                        };
                        componentObj[neType].neNames[nodename] = [cpname];
                    } else if( !componentObj[neType].neNames[nodename])  {
                        componentObj[neType].neNames[nodename] = [cpname];
                    } else {
                        componentObj[neType].neNames[nodename].push(cpname);
                    }
                }
            }
            this.eventBus.publish("validateComponent", componentObj,this.nodeTopology);
            this.model.setAttribute('selectedComponentDetails', componentObj);
            this.eventBus.publish("componentsModified");
        },

        getComponentsCount: function(ids){
            var count = 0;
            for(var i=0; i<this.componentData.length; i++) {
                for (var j=0; j<ids.length; j++){
                    if ((this.componentData[i].id === parseInt(ids[j]) ) && (this.componentData[i].children === 0 )) {
                        count++;
                    }
                }
            }
            return count;
        },

        getExistingSavedTopologyData: function(selectedComponentBackup) {
            for(var i=0; i<this.componentData.length; i++) {
                var cpNetype = this.componentData[i].netype;
                var cpname = this.componentData[i].label;
                if(selectedComponentBackup[cpNetype] && selectedComponentBackup[cpNetype].neNames[cpname]) {
                    var nodeNames = selectedComponentBackup[cpNetype].neNames[cpname];
                    for (var l=0; l<this.componentData.length; l++){
                        if ((nodeNames.indexOf(this.componentData[l].label) > -1) && (this.componentData[l].netype === cpNetype) && (this.componentData[l].nodename === cpname)) {
                            var selectedId = this.componentData[l].id;
                            if (!this.items.includes(selectedId)){
                                this.items.push(selectedId);
                            }
                       }
                    }
                }
            }
        }
    });

});
