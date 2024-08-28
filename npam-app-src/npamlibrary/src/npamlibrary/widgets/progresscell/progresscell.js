/**
 * Created with IntelliJ IDEA.
 * User: tcsmaus
 * Date: 6/9/14
 * Time: 3:38 PM
 * To change this template use File | Settings | File Templates.
 */
define([
    'tablelib/Cell',
    './progresscellview',
    'npamlibrary/constants',
    'widgets/ProgressBar'
], function (Cell, View, constants, ProgressBar) {

    return Cell.extend({

        View: View,
        value: 100,

        init: function () {
            var options = this.options;
            var attribute = options.column.attribute;
            var model = options.row.options.model;
            var value = model[attribute];
            this.statusValue = model.state;
            this.result = model.result;
            this.progressbar = new ProgressBar();
            this.progressbar.setValue(value);
        },

        setValue: function () {
            this.progressbar.attachTo(this.view.getProgress());
            this.setProgressColor(this.statusValue, this.result);
        },

        setProgressColor: function (statusValue, result) {
            if (statusValue === constants.USER_CANCELLED || (statusValue === constants.COMPLETED && result === constants.FAILED)) {
                this.progressbar.setColor(constants.RED);
            } else if (statusValue === constants.COMPLETED && result === constants.SKIPPED) {
                this.progressbar.setColor(constants.ORANGE);
            } else if (statusValue === constants.COMPLETED && result === constants.SUCCESS) {
                this.progressbar.setColor(constants.GREEN);
            } else if (statusValue === constants.RUNNING) {
                this.progressbar.setColor(constants.PALEBLUE);
            } else {
                this.view.getProgress().setStyle("display", "none");
            }
        }
    });

});