define([
    '../widgets/resultcell/resultcell',
    'npamlibrary/newfilterheadercell',
    'i18n!npamjobdetails/dictionary.json',
    'i18n!npamlibrary/dictionary.json',
    'npamlibrary/constants'
], function (ResultCell, FilterHeaderCell, language, libLanguage, Constants) {
    return{
        columns: [
            {
                title: libLanguage.get('nodeName'),
                attribute: "neName",
                secondHeaderCellType: FilterHeaderCell,
                attributeType: Constants.TEXT,
                visible: true,
                "disableVisible": true
            },
//            {
//                title: libLanguage.get('progress'),
//                attribute: "neProgress",
//                cellType: ProgressCell,
//                secondHeaderCellType: FilterHeaderCell,
//                attributeType: Constants.NUMBER,
//                visible: true
//            },
            {
                title: language.get('status'),
                attribute: "state",
                secondHeaderCellType: FilterHeaderCell,
                attributeType: Constants.TEXT,
                visible: true
            },
            {
                title: libLanguage.get('result'),
                attribute: "result",
                cellType: ResultCell,
                secondHeaderCellType: FilterHeaderCell,
                attributeType: Constants.TEXT,
                visible: true
            },
            {
                title: libLanguage.get('startDate'),
                attribute: "startTimeI18n",
                secondHeaderCellType: FilterHeaderCell,
                attributeType: Constants.TEXT,
                visible: true
            },
            {
                title: libLanguage.get('endDate'),
                attribute: "endTimeI18n",
                secondHeaderCellType: FilterHeaderCell,
                attributeType: Constants.TEXT,
                visible: true
            },
            {
                title: libLanguage.get('errorDetails'),
                attribute: "errorDetails",
                secondHeaderCellType: FilterHeaderCell,
                attributeType: Constants.TEXT,
                visible: true
            }
        ],
        addCommonAttributesToColumns: function (columns) {
            columns.forEach(function (column) {
                column.sortable = true;
                column.resizable = true;
            });
            return columns;
        },

        getColumns: function (numberOfColumnsToBeSliced, isNoneSelInTabSetting) {
            var columns;
            columns = this.columns;
            if (isNoneSelInTabSetting) {
                this.makeInVisibleAllColumns(columns);
            }
            return this.addCommonAttributesToColumns(columns).slice(0, numberOfColumnsToBeSliced);
        },

        makeInVisibleAllColumns: function (columns) {
            columns.forEach(function (column) {
                column.visible = false;
            });
            return columns;
        }

    };
});