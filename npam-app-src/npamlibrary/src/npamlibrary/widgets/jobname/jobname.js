define([
    "tablelib/Cell",
    "./jobnameview",
    'i18n!npamlibrary/dictionary.json',
    'npamlibrary/constants'
], function (Cell, View, libLanguage, Constants) {

    return Cell.extend({

        View: View,

        iconTextAndBgColorPair: {"U": "#964083", "B": "#00625F", "D": "#00625F", "R": "#0066B3", "L": "#1D1D1B", "N": "#ff7600", "O": "#ff4a14"},

        setValue: function (value) {

            this.view.setCellLeftPadding("0");

            var jobType = this.getRow().getData().jobType;
            var ch = jobType.charAt(0);
            var iconBgColor = jobType.indexOf("UPGRADE") > -1 ? "#964083" : this.iconTextAndBgColorPair[ch];
            if(jobType === Constants.LICENSE_REFRESH) {
                iconBgColor = "#964008";
            }
            this.view.setIconTooltip(jobType + libLanguage.get('job'));
            this.view.setIconText(ch);
            this.view.setIconBgColor(iconBgColor);

            if(this.getRow().getData().periodic){
                if(jobType === Constants.BACKUP){
                    this.view.setJobAsperiodic(libLanguage.get('scheduleBkjob'));
                } else if(jobType === Constants.NODERESTART){
                    this.view.setJobAsperiodic(libLanguage.get('periodicRestartJob'));
                } else {
                    this.view.setJobAsperiodic(libLanguage.get('periodicHouseKeepingJob'));
                }
            }

            this.view.setJobName(value);
        }
    });
});