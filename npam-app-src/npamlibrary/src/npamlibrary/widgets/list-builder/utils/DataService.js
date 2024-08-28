/*global define*/
define(function () {
    'use strict';

    var data = [];
    var clusterIds = [];

    return {
        getData: function (resolve, reject) {
            resolve(data);
        },

        setData: function(userData) {
            var finalData = [];
            if(userData.length > 0) {
               var id = 0;
                for(var i=0; i<userData.length; i++) {
                    if(userData[i].components.length > 0) {
                        var obj = {};
                        obj.label = userData[i].nodeName;
                        obj.parent = null;
                        obj.id = id;
                        obj.children = userData[i].components.length + 1;
                        obj.netype = userData[i].neType;
                        obj.nodename = userData[i].nodeName;
                        finalData.push(obj);
                        var mainParentId = id;
                        id++;
                        if(userData[i].axeClusterName){
                            obj = {};
                            obj.label = userData[i].axeClusterName;
                            obj.parent = mainParentId;
                            obj.id = id;
                            obj.children = 0;
                            obj.netype = userData[i].neType;
                            obj.nodename = userData[i].nodeName;
                            finalData.push(obj);
                            id++;
                        }
                        for(var j=0; j<userData[i].components.length; j++) {
                            if (userData[i].components[j].cpNames.length >0) {
                                obj = {};
                                obj.label = userData[i].components[j].name;
                                obj.parent = mainParentId;
                                obj.id = id;
                                obj.children = userData[i].components[j].cpNames.length;
                                finalData.push(obj);
                                var subParentId = id;
                                id++;
                                for(var k=0; k<userData[i].components[j].cpNames.length; k++) {
                                    obj = {};
                                    obj.label = userData[i].components[j].cpNames[k];
                                    obj.parent = subParentId;
                                    obj.id = id;
                                    obj.children = 0;
                                    obj.netype = userData[i].neType;
                                    obj.nodename = userData[i].nodeName;
                                    finalData.push(obj);
                                    id++;
                                }  
                            }
                        }
                    }
                }
            }
            data = finalData;
            return data;
        },

        defaultaxecluster: function(appName) {
            var clusterIds = [];
            if(appName === "createupgradejob"){
                for(var i=0; i<data.length; i++) {
                    var nodename = data[i].label;
                    var axeClusterName = nodename.split("_").splice(-1);
                    if (axeClusterName.toString() === "CLUSTER"){
                        clusterIds.push(data[i].id);
                    }
                }
            }
            return clusterIds;
        },

        defaultClusterOldJob: function(node) {
            var axeClusterName = node.axeClusterName;
            for(var i=0; i<data.length; i++) {
                if (data[i].nodename === node.nodeName && data[i].label === axeClusterName && !clusterIds.includes(data[i].id)) {
                    clusterIds.push(data[i].id);
                }
            }
            return clusterIds;
        },

        oldJobSelection: function(compName, selectedIds) {
            var selectedCompName = compName.split("__");
            var parentName = selectedCompName[0];
            var componentname = selectedCompName[1];
            for(var i=0; i<data.length; i++) {
                if (!compName.includes("CLUSTER")) {
                    if (data[i].nodename === parentName && data[i].label === componentname && !selectedIds.includes(data[i].id)) {
                        selectedIds.push(data[i].id);
                    }
                } else {
                    if (data[i].label === compName && !selectedIds.includes(data[i].id)) {
                        selectedIds.push(data[i].id);
                    }
                }
            }
            return selectedIds;
        }
    };
});
