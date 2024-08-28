/**
 * This module clones column.js and adds a checkbox cell to start of it.
 * Returns: array of JSON object, representing the columns used by the table in Results.js.
 */
 define([
    'npamlibrary/newfilterheadercell',
    'npamlibrary/constants',
    'npamlibrary/jobname',
    'npamlibrary/progresscell',
    'npamlibrary/resultcell',
    'npamlibrary/serverUtil',
    'npamlibrary/restUrls'
], function (FilterHeaderCell, Constants, JobName, ProgressCell, ResultCell, ServerUtil, RestUrls) {

    return {

        getValueLengthOfACell: function (cellValue) {
            return cellValue ? cellValue.length : 0;
        },

        setMaxValueLength: function (currentColumn, characterLength) {
            if (!( 'maxValueLength' in currentColumn ) || (currentColumn.maxValueLength < characterLength)) {
                currentColumn.maxValueLength = characterLength;
            }
        },

        giveMaxValueToColumnsBasedOnSingleDataObject: function (defaultColumns, singleObject) {
            for (var j = 0; j < defaultColumns.length; j++) {
                var singleObjectAttributeValue;
                if (singleObject.getAttribute) {
                    singleObjectAttributeValue = singleObject.getAttribute(defaultColumns[j].attribute);
                }
                else {
                    singleObjectAttributeValue = singleObject[defaultColumns[j].attribute];//singleObject.getAttribute(defaultColumns[j].attribute);
                }

                if (singleObjectAttributeValue) {
                    singleObjectAttributeValue = singleObjectAttributeValue.toString();
                }
                var singleObjectAttributeValueLength = this.getValueLengthOfACell(singleObjectAttributeValue);
                var currentDefaultColumn = defaultColumns[j];
                this.setMaxValueLength(currentDefaultColumn, singleObjectAttributeValueLength);
            }
        },

        addCellType: function (column, Type, isDateType, isNumberType) {
            var attributeType = Constants.TEXT;
            if (isNumberType) {
                attributeType = Constants.NUMBER;
                column.dataType = "Integer";
//            } else if (isDateType) {
//                attributeType = Constants.DATE;
            }
            if (Type)
                column.cellType = Type;
            column.attributeType = attributeType;
        },

        addWidthToColumns: function (columns, isDynamicCol) {
            for (var i = 0; i < columns.length; i++) {
                columns[i].secondHeaderCellType = FilterHeaderCell;
                columns[i].resizable = true;
                var columnAttribute = columns[i].attribute;
                var columnWidth;
                if (isDynamicCol && columnAttribute === "jobName") {
                    this.addCellType(columns[i], JobName);
                } else if (isDynamicCol && columnAttribute === "createdBy") {
                    this.addCellType(columns[i]);
                }
                if (columnAttribute.indexOf("Date") > -1 || columnAttribute.indexOf("Time") > -1 || columnAttribute === "keyFile") {
                    columnWidth = "200px";
                    if (isDynamicCol) {
                        this.addCellType(columns[i], null, true);
                    }
                } else if (columnAttribute.toLowerCase().indexOf("result") > -1) {
                    columnWidth = "100px";
                    if (isDynamicCol) {
                        this.addCellType(columns[i], ResultCell);
                    }
                } else if (columnAttribute === "totalNoOfNEs") {
                    columnWidth = '120px';
                    if (isDynamicCol) {
                        this.addCellType(columns[i], null, false, true);
                    }
                } else if (columnAttribute === "jobType") {
                    columnWidth = '115px';
                    if (isDynamicCol) {
                        this.addCellType(columns[i], null, false, false);
                    }
                } else if (columnAttribute === "status") {
                    columnWidth = '160px';
                    if (isDynamicCol) {
                        this.addCellType(columns[i]);
                    }
                } else if (columnAttribute.toLowerCase().indexOf("progressPercentage") > -1) {
                    columnWidth = "175px";
                    if (isDynamicCol) {
                        this.addCellType(columns[i], ProgressCell, false, true);
                    }
                } else {
                    var maxValueLength = columns[i].maxValueLength;
                    var titleLength = columns[i].title ? columns[i].title.length : 0;
                    var maxOverallLength = !maxValueLength || (maxValueLength < titleLength) ? titleLength : maxValueLength;
                    if (maxOverallLength <= 6) {
                        maxOverallLength = 6;
                    }
                    var visibleColumns = this.getVisibleColumns(columns);
                    if (maxOverallLength >= 30) {
                        if (columnAttribute !== "message") {
                            if (visibleColumns.length >= 4) {
                                columnWidth = '250px';
                            } else {
                                columnWidth = '400px';
                            }
                        } else if (columnAttribute === "message") {
                            columnWidth = (8 * (maxOverallLength + 2)) + 'px';
                        }
                    } else {
                        if (columnAttribute === "parent") {
                            columnWidth = (11 * (maxOverallLength + 3)) + 'px';
                        } else {
                            columnWidth = (11 * (maxOverallLength + 2)) + 'px';
                        }
                    }
                }
                columns[i].width = columnWidth;
            }
        },

        getColumnsFromResponseObject: function (columns, responseData, sortBy, orderBy, isDynamicCol, appName, tableId, callback, defaultColumns) {
            if(columns) {
                if (responseData.each) {
                    responseData.each(function (model) {
                        this.giveMaxValueToColumnsBasedOnSingleDataObject(columns, model);
                    }.bind(this));
                } else {
                    for (var i = 0; i < responseData.length; i++) {
                        this.giveMaxValueToColumnsBasedOnSingleDataObject(columns, responseData[i]);
                    }
                }
                isDynamicCol = isDynamicCol || false;
                this.addWidthToColumns(columns, isDynamicCol);
                this.addSortingToColumns(columns, sortBy, orderBy);
                if(callback) {
                    this.updateColumnsFromServer(columns, appName, tableId, callback, defaultColumns);
                } else {
                    this.addVisibleToColumns(columns);
                    return columns;
                }
            }
        },

        addVisibleToColumns: function(columns) {
            for (var i = 0; i < columns.length; i++) {
              if(!columns[i].visible && columns[i].visible !== false) {
                  columns[i].visible = true;
              }
            }
        },

        updateColumnsFromServer: function (columns, appName, tableId, cb, defaultColumns) {
            ServerUtil.sendRestCall(
                'GET',
                RestUrls.getSavedTableSettings.replace("appName", appName),
                function(data){
                    this.onColumnsReceived(data, columns, tableId, cb, defaultColumns);
                }.bind(this),
                this.errorFetchingColumns.bind(this, cb, defaultColumns),
                'json',
                'application/json'
            );
        },

        errorFetchingColumns: function (callback, defaultColumns) {
            callback(defaultColumns);
        },

        onColumnsReceived: function (response, columns, tableId, callback, defaultColumns) {
            if (response.length > 0) {
                columns = this.updateColumns(columns, tableId, response);
                callback(columns);
            } else {
                if(defaultColumns) {
                    callback(defaultColumns);
                } else {
                    callback(columns);
                }
            }
        },

        updateColumns: function (columns, tableId, response) {
            var columnStatus;
            response.forEach(function (table) {
                if (table.id === tableId) {
                    columnStatus = JSON.parse(table.value);
                }
            }.bind(this));
            for (var key in columnStatus) {
                for (var i = 0; i < columns.length; i++) {
                    if (columns[i].attribute === key) {
                        columns[i].visible = columnStatus[key].visible;
                        columns[i].order = columnStatus[key].order;
                        columns[i].pinned = columnStatus[key].pinned;
                    }
                }
            }
            columns.sort(function(a, b){
                return a.order - b.order;
            });
            return columns;
        },

        getVisibleColumns: function (tableColumns) {
            var visibleColumns = [];
            tableColumns.forEach(function (column) {
                if (column.visible) {
                    visibleColumns.push(column);
                }
            });
            return visibleColumns;
        },

        makeInVisibleAllColumns: function (columns) {
            columns.forEach(function (column) {
                column.visible = false;
            });
            return columns;
        },

        addSortingToColumns: function (columns, sortBy, orderBy) {
            for (var i = 0; i < columns.length; i++) {
                if (columns[i].attribute === sortBy)
                    columns[i].initialSortIcon = orderBy;
                columns[i].sortable = true;
            }
        },

        getSortByValue: function (preferencesObj) {
            var sortBy = preferencesObj.sortBy;
            if (sortBy === "fdn") {
                sortBy = "nodeName";
            }
            return sortBy;
        }
    };
});
