define([
    'npamlibrary/newfilterheadercell',
    'i18n!npamlibrary/dictionary.json',
    'npamlibrary/constants',
    'npamlibrary/progresscell',
], function (FilterHeaderCell, libLanguage, Constants, Progresscell) {
    return {
        columns : [
            {
                title: libLanguage.get('jobName'),
                attribute: "name",
                initialSortIcon: "asc",
                attributeType: Constants.TEXT,
                visible: true,
                "disableVisible": true
            },
            {
                title: libLanguage.get('jobType'),
                attribute: "jobType",
                attributeType: Constants.TEXT,
                visible: true
            },
            {
                title: libLanguage.get('createdBy'),
                attribute: "owner",
                attributeType: Constants.TEXT,
                visible: true
            },
            {
                title: libLanguage.get('noOfNodes'),
                attribute: "numberOfNetworkElements",
                attributeType: Constants.NUMBER,
                visible: true
            },
            {
                title: libLanguage.get('progress'),
                attribute: "progressPercentage",
                attributeType: Constants.NUMBER,
                cellType: Progresscell,
                visible: true
            },
            {
                title: libLanguage.get('status'),
                attribute: "state",
                dataType: "Integer",
                attributeType: Constants.TEXT,
                visible: true
            },
            {
                title: libLanguage.get('result'),
                attribute: "result",
                attributeType: Constants.TEXT,
                visible: true
            },
            {
                title: libLanguage.get('errorDetails'),
                attribute: "errorDetails",
                attributeType: Constants.TEXT,
                visible: false
            },
            {
                title: libLanguage.get('startDate'),
                attribute: "startTimeI18n",
                dataType: "Integer",
                attributeType: Constants.DATE,
                visible: true
            },
            {
                title: libLanguage.get('endDate'),
                attribute: "endTimeI18n",
                dataType: "Integer",
                attributeType: Constants.DATE,
                visible: true
            }
        ],

        addCommonAttributesToColumns: function() {
            this.columns.forEach(function(column){
                column.sortable = true;
                column.resizable = true;
                column.secondHeaderCellType = FilterHeaderCell;
            });
            return this.columns;
        },

        getColumns: function (numberOfColumnsToBeSliced, isNoneSelInTabSetting) {
            var columns;
            columns = this.columns;
            if(isNoneSelInTabSetting) {
                this.makeInVisibleAllColumns(columns);
            }
            return this.addCommonAttributesToColumns(columns).slice(0, numberOfColumnsToBeSliced);
        },

        makeInVisibleAllColumns: function(columns) {
            columns.forEach(function(column){
                column.visible = false;
            });
            return columns;
        }
    };
});
