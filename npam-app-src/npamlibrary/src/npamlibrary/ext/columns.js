define(['npamlibrary/newfilterheadercell',
        'i18n!npamlibrary/dictionary.json',
        'npamlibrary/constants'
], function (FilterHeaderCell, libLanguage, Constants) {
    return{
        columns: [
            {
                "title": libLanguage.get('nodeName'),
                "attribute": "name",
                sortable: true,
                resizable: true,
                width: "330px",
                secondHeaderCellType: FilterHeaderCell,
                attributeType: Constants.TEXT
            },
            {
                "title": libLanguage.get('type'),
                "attribute": "neType",
                sortable: true,
                resizable: true,
                width: "225px",
                secondHeaderCellType: FilterHeaderCell,
                attributeType: Constants.TEXT
            },
            {
                "title": libLanguage.get('syncStatus'),
                "attribute": "syncStatus",
                sortable: true,
                resizable: true,
                width: "225px",
                secondHeaderCellType: FilterHeaderCell,
                attributeType: Constants.TEXT
            }
        ]
    };
});