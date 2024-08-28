/**
 * Created by xgopvup on 15-Feb-16.
 */
define([
    'container/api',
    'i18n!npamlibrary/dictionary.json'
], function (containerApi, libLanguage) {
    var inputFilterText = ".eaNpamlibrary-FilterHeaderCell-input";
    var inputFilterOption = ".eaNpamlibrary-FilterOptions";

    var enableFilter = true;

    return {
        applyFilters: function (filters, tableColumns, domElement) {
            var visibleColumns = this.getVisibleColumns(tableColumns);
            if(filters) {
                this.enableOrDisableFilterTextBox(true, domElement);
                Object.keys(filters).forEach(function (columnNameFromFilter) {
                    for (var index = 0; index < visibleColumns.length; index++) {
                        var filterValue = filters[columnNameFromFilter].value;
                        if (visibleColumns[index].attributeType === "date") {
                            containerApi.getEventBus().publish("dateFilter", filters[columnNameFromFilter], columnNameFromFilter);
                        }
                        if(visibleColumns[index].attributeType === "enum") {
                            containerApi.getEventBus().publish("enumFilter", filters[columnNameFromFilter], columnNameFromFilter);
                            break;
                        }
                        if (visibleColumns[index].attribute === columnNameFromFilter) {
                            containerApi.getEventBus().publish("stringFilter", filters[columnNameFromFilter], columnNameFromFilter);
                            break;
                        }
                    }
                });
            }
        },

        applyFiltersSwPkgs: function (filters, tableColumns, domElement) {
            var visibleColumns = this.getVisibleColumns(tableColumns);
            if(filters) {
                this.enableOrDisableFilterTextBox(true, domElement);
                Object.keys(filters).forEach(function (columnNameFromFilter) {
                    for (var index = 0; index < visibleColumns.length; index+=1) {
                        var found = false;
                        if (visibleColumns[index].attribute === columnNameFromFilter) {
                            if (visibleColumns[index].attributeType === "enum") {
                                containerApi.getEventBus().publish("enumFilter", filters[columnNameFromFilter], columnNameFromFilter);
                                found = true;
                            }
                            else if (visibleColumns[index].attributeType === "date") {
                                containerApi.getEventBus().publish("dateFilter", filters[columnNameFromFilter], columnNameFromFilter);
                                found = true;
                            }
                            else if (visibleColumns[index].attributeType === "text") {
                                containerApi.getEventBus().publish("stringFilter", filters[columnNameFromFilter], columnNameFromFilter);
                                found = true;
                            }                            
                        }
                        if (found) {
                            break;
                        }
                    }
                });
            }
        },

        /*
         * User should not be given access to enter any text once filter query is triggered to server.
         * So, we're manually disabling the table's filter text box.
         * */
        enableOrDisableFilterTextBox: function (toBeEnabled, domElement) {
            domElement.findAll(inputFilterText).forEach(function (inputElement) {
                if(toBeEnabled) {
                    inputElement.setProperty("disabled", false);
                } else {
                    inputElement.setProperty("disabled", true);
                }
            });
        },

        setFilterValue: function(filterValue) {
            enableFilter = filterValue;
        },

        isfilterEnabled: function() {
            return enableFilter;
        },

        getVisibleColumns: function (tableColumns) {
            var visibleColumns = [];
            if(tableColumns !== undefined) {
                tableColumns.forEach(function (column) {
                    if(column.visible) {
                        visibleColumns.push(column);
                    }
                });
            }
            return visibleColumns;
        },

        getFilterValuesAsList: function (filtersMap) {
            if(filtersMap.status !== undefined){
                if(filtersMap.status.isMultiSelect)
                   filtersMap.status.comparator = "=";
               }
            var filters = [];
            for (var key in filtersMap) {
                var value = filtersMap[key].value;
                if(filtersMap[key].isMultiSelect){
                    filtersMap[key].comparator = "=";
                }
                if(key !== "lockStatus" && value !== "") {
                    filters.push({
                        columnName: key,
                        filterOperator: filtersMap[key].comparator,
                        filterText: value
                    });
                }
                if(key === "lockStatus" && value[0]&& value[0].length>0) {
                    for(var i=0; i<value.length; i++){
                        filters.push({
                            columnName: key,
                            filterOperator: filtersMap[key].comparator,
                            filterText: value[i]
                        });
                    }
                }
            }
            return filters;
        },

        //filterCollection: method returns the filter result which again populated on table
        filterCollection: function(collection, attribute, filter) {
            var output = [];
            collection.forEach(function(model) {
                if (filter.dateValue) {
                    if (this.compare(filter.comparator, Date.parse(model[attribute]), Date.parse(filter.value), true)) {
                        output.push(model);
                    }
                } else if (toString.call(model[attribute]) === '[object String]') {
                    if (this.compare(filter.comparator, model[attribute].toUpperCase(), filter.value.toUpperCase())) {
                        output.push(model);
                    }
                } else if (this.compare(filter.comparator, model[attribute], filter.value)) {
                    output.push(model);
                }
            }.bind(this));
            return output;
        },
      
        //compare: method assigns comparator options for filters 
        compare: function(comparator, a, b, dateValue) {
            var selectingValue = a || "";
            var item;
            if (a) {
                item = a[0] ? a[0] : a;
            } else {
                item = "";
            }
            if (a && item && item.value) {
                if (item.location === "ENM" && item.fileName) {
                    selectingValue = item.fileName;
                } else {
                    selectingValue = item.value;
                }
            } else if (selectingValue.length === 0 && typeof(selectingValue) === 'object') {
                selectingValue = libLanguage.get('noBackupsFound');
            }
            var str1 = String(selectingValue).toLowerCase();
            var str2 = String(b).toLowerCase();
            var result = str1.indexOf(str2);
            if (b === "") {
                return true;
            }
            var flag = true;
            switch (comparator) {
                case '*':
                    flag = result >= 0;
                    break;
                case '=':
                    flag = str1 === str2;
                    break;
                case '<':
                    if (dateValue) {
                        flag = a < b;
                        break;
                    }
                    flag = parseInt(str1) < parseInt(str2);
                    break;
                case '>':
                    if (dateValue) {
                        flag = a > b;
                        break;
                    }
                    flag = parseInt(str1) > parseInt(str2);
                    break;
                case '!=':
                    flag = str1 !== str2;
                    break;
                case 'ab*':
                    flag = str1.startsWith(str2);
                    break;
                case '*ab':
                    flag = str1.endsWith(str2);
                    break;
            }
            return flag;
        },

        enableFilterEvent: function () {
            containerApi.getEventBus().publish("enableFilter");
        },

        removeExistingFilters: function(filters, attr) {
            if (filters && (Object.keys(filters)).indexOf(attr)> -1 ){
                delete filters[attr];
            }
            return filters;
        }
    };
});