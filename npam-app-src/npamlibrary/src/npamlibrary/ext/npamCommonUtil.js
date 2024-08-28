/**
 * Created by egopvup on 03-May-16.
 */

define([
    'i18n!npamlibrary/dictionary.json',
    'npamlibrary/displaymessage',
    'npamlibrary/constants',
    'npamlibrary/InfoRegion',
    'npamlibrary/i18NumberUtil',
    "widgets/Tooltip",
    'npamlibrary/serverUtil',
    'npamlibrary/restUrls'

], function (libLanguage, DisplayMessage, Constants, InfoRegion, i18nNumber, Tooltip, serverUtil, RestUrls) {
    return {
        getSelectedOfTotal: function (totalRecords, pageLimit, selectedPage) {
            var lower = pageLimit * (selectedPage -1) + 1, upper = pageLimit * selectedPage;
            if(pageLimit > totalRecords) {
                upper = selectedPage * totalRecords;
            }
            if(upper > totalRecords){
                upper = totalRecords;
            }
            return (i18nNumber.getNumber(lower) + " - " + i18nNumber.getNumber(upper) + libLanguage.get('of') + i18nNumber.getNumber(totalRecords));
        },

        getEmptyRecordsMessage: function () {
            var displayEmptyRecordsMessage = new DisplayMessage();
            displayEmptyRecordsMessage.showMessage(true, libLanguage.get('modifyFilters'), Constants.dialogInfoIcon, libLanguage.get('noResultsFound'));
            return displayEmptyRecordsMessage;
        },

        getInfoRegion: function(options) {
            return new InfoRegion(options);
        },

        getColumnAttributeType: function(columns,sortAttr){
            for(var i = 0 ; i <= columns.length; i++){
                if(columns[i].attribute === sortAttr){
                   return columns[i].attributeType;
                }
            }
        },

        finishJobCreation: function () {
            this.isFinishBtnClicked = true;
            serverUtil.sendRestCall('GET', RestUrls.jobNameValidation + this.model.getAttribute("JobName"), this.invalidJobName.bind(this,libLanguage.get('differentJob')), this.validJobName.bind(this));
        },

        scheduleDateValidation: function () {
            this.validateAndGetServerTime();
            this.isFinishBtnClicked = false;
            this.isLeavePage = true;
        },

        createTooltip: function(toolTipWidget, element, value) {
            if(toolTipWidget) {
                toolTipWidget.destroy();
            }
            if(value.length > 0){
               var toolTip = new Tooltip({
                    parent : element,
                    contentText: value
               });
               toolTip.attachTo(element);
               return toolTip;
            }
        },

        onStepChange: function () {
            if (this.wizard.getActiveStep() === 0 && this.step1.isOtherObject && Object.keys(this.step1.isOtherObject.accContent.getSelectedNodes()).length > 0) {
                this.step1.isOtherObject.accContent.publishContextActions();
            } else {
                this.getEventBus().publish('topsection:leavecontext');
            }
            if (this.wizard.getActiveStep() !== 0 && this.model.getAttribute("isFirstStepModified")) {
                this.model.setAttribute("isFirstStepModified", false);
            }
            if(this.wizard.getActiveStep() === 2 && this.model.getAttribute("secondStepModified")) {

                this.model.setAttribute("secondStepModified",false);
            }
        },


        adjustPaginationWidth: function (pagesCount, appView, isSubItem) {
            var pages = pagesCount, paginationHolder, footerWidth;
            if(isSubItem){
                paginationHolder = appView.getSubItemsPaginationHolder();
            } else {
                paginationHolder = appView.getPaginationHolder();
            }
            footerWidth = appView.getFooter().getProperty('offsetWidth');

            if (!pages || pages === 1 || footerWidth === 0) {
                return;
            }

            var paginationBestWidth = Math.min(500, 30 * (pages + 2) + pages + 8),
                selectLabelWidth = appView.getPageSizeSelect().getProperty('offsetWidth'),
                pageSelectWidth = selectLabelWidth + 100;

            if (paginationBestWidth + pageSelectWidth >= footerWidth) {
                paginationHolder.setStyle({'flex-basis': '100%'});
                paginationHolder.setStyle({'max-width': 'initial'});
                paginationHolder.setModifier('fullWidth');
            }
            else {
                paginationHolder.setStyle({'flex-basis': paginationBestWidth + 'px'});
                paginationHolder.removeStyle('max-width');
                paginationHolder.removeModifier('fullWidth');
            }
        }
    };
});
