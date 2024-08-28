define([
    'jscore/core',
    'text!./jobdetails.html',
    'styles!./jobdetails.less',
    'i18n!npamlibrary/dictionary.json'
], function (core, template, styles, libLanguage) {

    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return styles;
        },

        setHeader: function (text) {
            this.getElement().find('.eaNpamjob-rJobDetails-SectionHeading-header').setText(text);
        },

        setSelectionHeader: function (text) {
            this.getElement().find('.eaNpamjob-rJobDetails-SelectedHeading').setText(text);
        },

        getJobsTablePlaceholder: function () {
            return this.getElement().find('.eaNpamjob-rJobDetails-jobsTablePlaceholder');
        },

        getLoadingAnimation: function () {
            return this.getElement().find('.eaNpamjob-rJobDetails-loadingAnimation');
        },

        showLoadingAnimation: function () {
            this.getLoadingAnimation().removeModifier('hidden');
        },

        hideLoadingAnimation: function () {
            this.getLoadingAnimation().setModifier('hidden');
        },

        getTableDivHeader: function() {
            return this.getElement().find('.eaNpamjob-rJobDetails-Header');
        },

        // added to hide the title header until data is rendered on SHM main page
        hideTableDivHeader: function () {
            this.getTableDivHeader().setAttribute("style","display:none");
        },

        showTableDivHeader: function () {
            this.getTableDivHeader().setAttribute("style","display:inline-block");
        },

//        getPaginationHolder: function () {
//            return this.getElement().find(".eaNpamjob-rJobDetails-paginationHolder");
//        },
//
//        getPageLimitHolder: function () {
//            return this.getElement().find(".eaNpamjob-rJobDetails-pageSizeSelectHolder");
//        },

//        getFooter: function () {
//            return this.getElement().find(".eaNpamjob-rJobDetails-footer");
//        },

//        getPageSizeSelect: function () {
//            return this.getElement().find(".eaNpamjob-rJobDetails-pageSizeSelect");
//        },

//        hidePageSizeSelect: function () {
//            this.getPageSizeSelect().setAttribute("style","display:none");
//        },

//        showPageSizeSelect: function () {
//            this.getPageSizeSelect().setAttribute("style","display:block");
//        },

        getSelectedOfTotal: function() {
            return this.getElement().find('.eaNpamjob-rJobDetails-SelectedOfTotal');
        },

        setSelectedOfTotal: function (selectedOfTotal) {
            this.getSelectedOfTotal().setText(selectedOfTotal);
        },

        hideSelectedOfTotalHolder: function () {
            this.getSelectedOfTotal().setAttribute("style","display:none");
        },

        getFiltersAppliedHolder: function(){
            return this.getElement().find(".eaNpamjob-rJobDetails-filtersAppliedHolder");
        },

        showFiltersAppliedHolder: function(){
            this.getFiltersAppliedHolder().setAttribute("style","display:block");
        },

        hideFiltersAppliedHolder: function(){
            this.getFiltersAppliedHolder().setAttribute("style","display:none");
        },

        setFiltersAppliedText: function () {
            this.getElement().find('.eaNpamjob-rJobDetails-filtersAppliedLabel').setText(libLanguage.get('filtersApplied'));
        },

        showSelectedOfTotalHolder: function () {
            this.getSelectedOfTotal().setAttribute("style","display:inline-block");
        },

        getSelectedJobsOfTotal: function() {
            return this.getElement().find('.eaNpamjob-rJobDetails-TotalSelected');
        },

        setSelectedJobsOfTotal: function (selectedOfTotal) {
            this.getSelectedJobsOfTotal().setText("("+selectedOfTotal+")");
            if(selectedOfTotal===0){
                this.hideClearSelection();
            }
            else{
                this.setClearText();
                this.showClearSelection();
            }
        },

        getClearSelectionLink: function(){
            return this.getElement().find(".eaNpamjob-rJobDetails-clearSelection-link");
        },

        getClearSelection: function(){
            return this.getElement().find(".eaNpamjob-rJobDetails-clearSelection");
        },

        hideClearSelection: function(){
            this.getClearSelection().setAttribute("style","display:none");
        },

        setClearText: function() {
           this.getElement().find(".eaNpamjob-rJobDetails-clearSelection-separator").setText("-");
           this.getClearSelectionLink().setText(libLanguage.get('clear'));
        },

        getFiltersClearSelectionLink: function(){
            return this.getElement().find(".eaNpamjob-rJobDetails-filtersClearSelection-link");
        },

        setFiltersAppliedClearText: function() {
            this.getElement().find(".eaNpamjob-rJobDetails-filtersClearSelection-separator").setText("-");
            this.getFiltersClearSelectionLink().setText(libLanguage.get('clear'));
        },

        showClearSelection: function(){
            this.getClearSelection().setAttribute("style","display:inline-block");
        },

        hideSelectedJobsOfTotalHolder: function () {
            this.getSelectedJobsOfTotal().setAttribute("style","display:none");
        },

        showSelectedJobsOfTotalHolder: function () {
            this.getSelectedJobsOfTotal().setAttribute("style","display:inline-block");
        },

        getSelectHeader: function() {
            return this.getElement().find('.eaNpamjob-rJobDetails-SelectedHeading');
        },

        hideSelectionHeader: function () {
            this.getSelectHeader().setAttribute("style","display:none");
        },

        showSelectionHeader: function () {
            this.getSelectHeader().setAttribute("style","display:inline-block");
        },

        getJobDetailsHeader: function(){
            return this.getElement().find(".eaNpamjob-rJobDetails-Header");
        },

        getErrorMessageHolder: function(){
            return this.getElement().find(".eaNpamjob-rJobDetails-errorMessage");
        },

        hideErrorMessageHolder: function(){
            this.getElement().find(".eaNpamjob-rJobDetails-errorMessage").setAttribute("style","display:none");
        },

        showErrorMessageHolder: function(){
            this.getElement().find(".eaNpamjob-rJobDetails-errorMessage").setAttribute("style","display:block");
        },

//        setLimitLabelText: function(txt) {
//            return this.getElement().find(".eaNpamjob-rJobDetails-pageSizeSelectLabel").setText(txt);
//        },

        setSelectedCount: function(count) {
            this.showSelectedOfTotalHolder();
            this.showSelectionHeader();
            this.setSelectedJobsOfTotal(count);
        },

        hideSelectionCountHolder: function() {
            this.hideSelectedOfTotalHolder();
            this.hideSelectionHeader();
//            this.hidePageSizeSelect();
            this.hideSelectedJobsOfTotalHolder();
        },

        showSelectionCountHolder: function () {
            this.showSelectedOfTotalHolder();
//            this.showPageSizeSelect();
            this.showSelectionHeader();
            this.showSelectedJobsOfTotalHolder();
        },

        getTableSettings: function () {
            return this.getElement().find(".eaNpamjob-rJobDetails-TableSettings");
        }
    });

});
