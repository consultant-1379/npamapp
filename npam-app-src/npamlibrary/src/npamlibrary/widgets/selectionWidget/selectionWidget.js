define([
    'jscore/core',
    './selectionWidgetview',
    'i18n!npamlibrary/dictionary.json',
    'npamlibrary/i18NumberUtil'
], function (core, View, libLanguage, i18nNumber) {

    return core.Widget.extend({

        View: View,

        addSelectAllClickHandler: function (fn) {
            this.view.addSelectAllClickHandler(fn);
        },

        addClearAllClickHandler: function (fn) {
            this.view.addClearAllClickHandler(fn);
        },

        setSelectionWidget: function(selectedCount, totalCount, isAllSelectedInCurrentPage) {
            if(selectedCount !== totalCount) {
                this.prepareSelectedRowsInfo(selectedCount, false);
                if(selectedCount < totalCount && !isAllSelectedInCurrentPage) {
                    this.showClearSelectionLink();
                } else if(isAllSelectedInCurrentPage && selectedCount !== totalCount) {
                    this.showSelectAllLink(totalCount);
                }
            } else {
                this.prepareSelectedRowsInfo(selectedCount, true);
                this.showClearSelectionLink();
            }
        },

        prepareSelectedRowsInfo: function(selectedCount, isAllSelected) {
            var txt = '';
            if(selectedCount === 1) {
                txt = i18nNumber.getNumber(selectedCount)+ " " +libLanguage.get('rowSelected');
            } else if(isAllSelected) {
                txt = libLanguage.get('all')+" "+i18nNumber.getNumber(selectedCount)+ " " +libLanguage.get('rowsSelected');
            } else {
                txt = i18nNumber.getNumber(selectedCount)+ " " +libLanguage.get('rowsSelected');
            }
            this.view.setSelectedRowsTxt(txt);
        },

        showSelectAllLink: function(totalCount) {
            this.view.setClearSelectionTxt('');
            var txt = libLanguage.get('selectAll')+" "+totalCount+" "+libLanguage.get('onAllPages');
            this.view.setSelectAllTxt(txt);
        },

        showClearSelectionLink: function() {
            this.view.setSelectAllTxt('');
            this.view.setClearSelectionTxt(libLanguage.get('clearSelection')+".");
        }
    });
});