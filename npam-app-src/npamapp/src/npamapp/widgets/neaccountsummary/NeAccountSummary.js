define([
    'jscore/core',
    'jscore/ext/utils/base/underscore',
    './NeAccountSummaryView',
    'i18n!npamapp/dictionary.json',
    'npamlibrary/dateUtil'
], function(core, _, View, Dictionary, DateUtil ) {
    return core.Widget.extend({
        view: function () {
           // handlebar's comparator
            return new View({
                dictionary : Dictionary,
                summaryNodeData : this.summaryNodeData,
                summaryMaintenanceUserData : this.summaryMaintenanceUserData,
                summaryCbrsData: this.summaryCbrsData
            });
        },

        init: function(options) {
            this.fillPanel(options.data);
        },

        fillPanel: function(data) {
             this.summaryNodeData = {};
             this.summaryNodeData.neName = data.neName || "N/A";
             this.summaryNodeData.ipAddress = data.ipAddress || "N/A";

             this.summaryMaintenanceUserData = {};
             this.summaryMaintenanceUserData.currentUser = data.currentUser || "N/A";
             if (data.currentPswd !== undefined) {
                 this.summaryMaintenanceUserData.password = data.currentPswd || "N/A";
             }
             this.summaryMaintenanceUserData.status = data.status || "N/A";
             this.summaryMaintenanceUserData.errorDetails = data.errorDetails || "N/A";
             this.summaryMaintenanceUserData.lastUpdate = DateUtil.formatNpamDate(data.lastUpdate, true) || "N/A";

             this.summaryCbrsData = {};
             if ( data.cbrsStatus ) {
                this.displayCbrsSection = true;

                 this.summaryCbrsData.status = data.cbrsStatus;
                 this.summaryCbrsData.errorDetails = data.cbrsErrorDetails || "N/A";
                 this.summaryCbrsData.lastUpdate = DateUtil.formatNpamDate(data.cbrsLastUpdate, true) || "N/A";
             } else {
                this.displayCbrsSection = false;
             }
        },

        onViewReady: function () {
            if ( this.displayCbrsSection ) {
                this.view.showCBRSHeader();
            } else {
                this.view.hideCBRSHeader();
            }
            this.setClickHandlerForEyes();
        },

        setClickHandlerForEyes: function() {
            var eyeElements = this.view.getElement().findAll('.eaNpamapp-NeAccountSummary-eye');
            eyeElements.forEach( function(element){
                var allClasses = element.getAttribute('class').split(' ');
                var eyeFieldEl = _.filter( allClasses, function(s) {
                    return s.indexOf("-field") !== -1;
                });

                if (eyeFieldEl.length !== 0 ) {
                    var valueEl = eyeFieldEl[0].slice(0, eyeFieldEl[0].length - "-field".length ); // remove -field to get value el

                    var passwordValueHtml =  this.view.getElement().find("."+valueEl);
                    var passwordValueEye  = this.view.getElement().find("."+eyeFieldEl);

                    passwordValueEye.setModifier("eye");
                    passwordValueEye.addEventHandler('click', function (e) {
                        if ( passwordValueHtml.hasModifier("password") ) {
                            passwordValueHtml.setText(this.summaryMaintenanceUserData.password);
                            passwordValueHtml.removeModifier("password");
                            passwordValueEye.removeModifier("eye");
                            passwordValueEye.setModifier("eyeLine");
                        } else {
                            passwordValueHtml.setText("******");
                            passwordValueHtml.setModifier("password");
                            passwordValueEye.removeModifier("eyeLine");
                            passwordValueEye.setModifier("eye");
                        }
                    }.bind(this));
                }
            }.bind(this));
        }
    });
});
