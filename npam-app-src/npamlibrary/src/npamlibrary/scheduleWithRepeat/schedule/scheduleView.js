/*global define*/
define([
    'jscore/core',
    'text!./schedule.html'
], function (core, template) {
    'use strict';

    return core.View.extend({

        getTemplate: function () {
            return template;
        }//,
//        getScheduleOptionsHolder: function () {
//            return this.getElement().find('.eaNpamlibrary-wScheduleJob-scheduleOptionsSelectBox');
//        }
    });

});
