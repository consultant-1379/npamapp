/*******************************************************************************
 * COPYRIGHT Ericsson 2024
 *
 *
 *
 * The copyright to the computer program(s) herein is the property of
 *
 * Ericsson Inc. The programs may be used and/or copied only with written
 *
 * permission from Ericsson Inc. or in accordance with the terms and
 *
 * conditions stipulated in the agreement/contract under which the
 *
 * program(s) have been supplied.
 ******************************************************************************/

define([
    'jscore/core',
    './SummaryRegionView',
    'i18n!npamapp/dictionary.json',
    '../../widgets/emptysummary/EmptySummary',
    '../../widgets/neaccountsummary/NeAccountSummary'
], function(core, View, Dictionary, EmptySummary, NeAccountSummary ) {
    return core.Region.extend({
        view: function () {
           // handlebar's comparator
            return new View({
                dictionary : Dictionary
            });
        },

        init: function(options) {
            this.dataArray = options.data;
            this.context = options.context;
        },

        onStart: function(options) {
            this.updateDetails(options);
            this.addEventHandlers();
        },

        updateDetails: function(options) {
            if (this.panelSummary) {
                this.panelSummary.destroy();
            }

            if ( this.dataArray.length !== 0 ) {
                var neAccount = this.dataArray.filter( function(element){
                                    return (element.id === "1" );
                                }.bind(this));
                if ( neAccount.length !== 1 ) {
                    neAccount = this.dataArray;
                }

                var cbrs = this.dataArray.filter( function(element){
                                    return (element.id === "2" );
                                }.bind(this));
                if ( cbrs.length === 1 ) {
                    neAccount[0].cbrsStatus = cbrs[0].status;
                    neAccount[0].cbrsErrorDetails = cbrs[0].errorDetails;
                    neAccount[0].cbrsLastUpdate = cbrs[0].lastUpdate;
                } else if ( cbrs.length > 1 ) {
                    // Error
                }

                if (!neAccount[0].status) {
                    this.panelSummary = new EmptySummary({"message": Dictionary.summary.noNEAccount + neAccount[0].neName});
                } else {
                  this.panelSummary = new NeAccountSummary({
                                            context: this.context,
                                            data: neAccount[0]
                                        });
                }
            } else {
                this.panelSummary = new EmptySummary({"message": Dictionary.summary.empty});
            }
            this.panelSummary.attachTo(this.view.getSummaryPanel());
        },

        addEventHandlers: function() {
            //if new sessions values has came update number - hide loader show value number
            this.context.eventBus.subscribe('summaryregion:update', function(data) {
                this.dataArray = data;
                this.updateDetails();
            }.bind(this));
        }
    });
});
