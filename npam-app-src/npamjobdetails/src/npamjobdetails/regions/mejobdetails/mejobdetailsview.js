define([
    'jscore/core',
    "text!./mejobdetails.html",
    "styles!./mejobdetails.less",
    "i18n!npamlibrary/dictionary.json"
], function(core, template, style, libLanguage) {

    return core.View.extend({

        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },

        setJobName: function(jobName) {
            this.getElement().find('.eaNpamjobdetails-rMeJobDetails-Header').setText(jobName);
        },

        setLimitLabelText: function(txt) {
            this.getElement().find(".eaNpamjobdetails-rMeJobDetails-pageSizeSelectLabel").setText(txt);
        },

        setEndTimelabel: function(txt) {
            this.getElement().find(".eaNpamjobdetails-rMeJobDetails-EndTimelabel").setText(txt);
        },

//        setDescriptionlabel: function(txt) {
//            this.getElement().find(".eaNpamjobdetails-rMeJobDetails-Descriptionlabel").setText(txt);
//        },

        setStartTimelabel: function(txt) {
            this.getElement().find(".eaNpamjobdetails-rMeJobDetails-StartTimelabel").setText(txt);
        },

        setStatuslabel: function(txt) {
            this.getElement().find(".eaNpamjobdetails-rMeJobDetails-Statuslabel").setText(txt);
        },

        setNodeProgresslabel: function(txt) {
            this.getElement().find(".eaNpamjobdetails-rMeJobDetails-ActivityHeaderContentlabel").setText(txt);
        },

        setOveralProgresslabel: function(txt) {
            this.getElement().find(".eaNpamjobdetails-rMeJobDetails-Progresslabel").setText(txt);
        },

        setResultlabel: function(txt) {
            this.getElement().find(".eaNpamjobdetails-rMeJobDetails-Resultlabel").setText(txt);
        },

        setCreatedlabel: function(txt) {
            this.getElement().find(".eaNpamjobdetails-rMeJobDetails-CreatedBylabel").setText(txt);
        },

        setTypelabel: function(txt) {
            this.getElement().find(".eaNpamjobdetails-rMeJobDetails-Typelabel").setText(txt);
        },

        setCreatedBy: function(createdBy) {
            this.getElement().find('.eaNpamjobdetails-rMeJobDetails-createdByValue').setText(createdBy);
        },

        hideMeJobTableHolder: function() {
            this.getMeJobTableHolder().setAttribute("style", "display:none");
        },

        showMeJobTableHolder: function() {
            this.getMeJobTableHolder().setAttribute("style", "display:block");
        },

        getLabel: function() {
            return this.getElement().find(".eaNpamjobdetails-rMeJobDetails-Progress-Value");
        },

        setStatus: function(status) {
            this.getElement().find('.eaNpamjobdetails-rMeJobDetails-statusValue').setText(status);
        },

        hidePageLimitHolder: function() {
            this.getPageLimitHolder().setAttribute("style", "display:none");
        },

        showPageLimitHolder: function() {
            this.getPageLimitHolder().setAttribute("style", "display:inline-block");
        },

        setType: function(type) {
            this.getElement().find('.eaNpamjobdetails-rMeJobDetails-jobTypeValue').setText(type);
        },

        setResultMessage: function(resultValue) {
            this.getElement().find('.eaNpamjobdetails-rMeJobDetails-resultValue').setText(resultValue);
        },

        getResultIcon: function() {
            return this.getElement().find('.eaNpamjobdetails-rMeJobDetails-resultIcon');
        },

        setStartTime: function(startTime) {
            this.getElement().find('.eaNpamjobdetails-rMeJobDetails-startTimeValue').setText(startTime);
        },

        setEndTime: function(endTime) {
            this.getElement().find('.eaNpamjobdetails-rMeJobDetails-endTimeValue').setText(endTime);
        },

//        setdescription: function(description) {
//            this.getElement().find('.eaNpamjobdetails-rMeJobDetails-descriptionValue').setText(description);
//        },

        getSelectedOfTotal: function() {
            return this.getElement().find('.eaNpamjobdetails-rMeJobDetails-SelectedOfTotal');
        },

        setSelectedOfTotal: function(selectedOfTotal) {
            this.getElement().find('.eaNpamjobdetails-rMeJobDetails-SelectedOfTotal').setText(selectedOfTotal);
        },

        showSelectedOfTotal: function() {
            this.getSelectedOfTotal().setAttribute("style", "display:inline-block;");
        },

        hideSelectedOfTotal: function() {
            this.getSelectedOfTotal().setAttribute("style", "display:none");
        },

        getSelectedRowsCountHolder: function() {
            return this.getElement().find(".eaNpamjobdetails-rMeJobDetails-SelectedCount");
        },

        hideSelectedCount: function() {
            this.getSelectedRowsCountHolder().setAttribute("style", "display:none");
        },

        showSelectedCount: function() {
            this.getSelectedRowsCountHolder().setAttribute("style", "display:inline");
        },

        getFiltersAppliedHolder: function(){
            return this.getElement().find(".eaNpamjobdetails-rMeJobDetails-filtersAppliedHolder");
        },

        showFiltersAppliedHolder: function(){
            this.getFiltersAppliedHolder().setAttribute("style","display:inline;width:30%");
        },

        hideFiltersAppliedHolder: function(){
            this.getFiltersAppliedHolder().setAttribute("style","display:none");
        },

        setFiltersAppliedText: function () {
            this.getElement().find('.eaNpamjobdetails-rMeJobDetails-filtersAppliedLabel').setText(libLanguage.get('filtersApplied'));
        },

        getFiltersClearSelectionLink: function(){
            return this.getElement().find(".eaNpamjobdetails-rMeJobDetails-filtersClearSelection-link");
        },

        setFiltersAppliedClearText: function() {
            this.getElement().find(".eaNpamjobdetails-rMeJobDetails-filtersClearSelection-separator").setText("-");
            this.getFiltersClearSelectionLink().setText(libLanguage.get('clear'));
        },

        getMeJobTableHolder: function() {
            return this.getElement().find('.eaNpamjobdetails-rMeJobDetails-Content');
        },

        getPaginationHolder: function() {
            return this.getElement().find(".eaNpamjobdetails-rMeJobDetails-paginationHolder");
        },

        hideMeJobPaginationHolder: function() {
            this.getPaginationHolder().setAttribute("style", "display:none");
        },

        showMeJobPaginationHolder: function() {
            this.getPaginationHolder().setAttribute("style", "display:inline-block");
        },

        getPageLimitHolder: function() {
            return this.getElement().find(".eaNpamjobdetails-rMeJobDetails-pageSizeSelectHolder");
        },

        getFooter: function() {
            return this.getElement().find(".eaNpamjobdetails-rMeJobDetails-footer");
        },

        getPageSizeSelect: function() {
            return this.getElement().find(".eaNpamjobdetails-rMeJobDetails-pageSizeSelect");
        },

        hidePageSizeSelect: function() {
            this.getPageSizeSelect().setAttribute("style", "display:none");
        },

        showPageSizeSelect: function() {
            this.getPageSizeSelect().setAttribute("style", "display:block");
        },
        getLoadingAnimation: function() {
            return this.getElement().find('.eaNpamjobdetails-loadingAnimation');
        },

        showLoadingAnimation: function() {
            this.getLoadingAnimation().removeModifier('hidden');
        },

        hideLoadingAnimation: function() {
            this.getLoadingAnimation().setModifier('hidden');
        },

        getTotalPageElement: function() {
            return this.getElement().find(".eaNpamjobdetails-rMeJobDetails");
        },

        getProgress: function() {
            return this.getElement().find(".eaNpamjobdetails-rMeJobDetails-Progress-Bar");
        },

        getErrorMessageHolder: function() {
            return this.getElement().find(".eaNpamjobdetails-rMeJobDetails-errorMessage");
        },

        hideErrorMessageHolder: function() {
            this.getErrorMessageHolder().setAttribute("style", "display:none");
        },

        showErrorMessageHolder: function() {
            this.getErrorMessageHolder().setAttribute("style", "display:block");
        },

        getTable: function() {
            return this.getElement().find(".eaNpamjobdetails-rMeJobDetails-ActivityDetails");
        },

        showTable: function() {
            this.getTable().setAttribute("style", "visibility:visible; height:100%;");
        },

        hideTable: function() {
            this.getTable().setAttribute("style", "visibility:hidden; height:0px;");
        },

        getTopSection: function() {
            return this.getElement().find(".eaNpamjobdetails-rMeJobDetails-topSection");
        },

        hideTopSection: function() {
            this.getTopSection().setAttribute("style", "display:none");
        },

        showTopSection: function() {
            this.getTopSection().setAttribute("style", "display:block");
        },

        getInputFields: function() {
            return this.getElement().findAll(".eaNpamlibrary-FilterHeaderCell-input");
        },

        getTableSettings: function() {
            return this.getElement().find(".eaNpamjobdetails-rMeJobDetails-TableSettings");
        }
    });
});