/*global define*/
define([
    'jscore/core',
    './ContentView'
], function (core, View) {
    'use strict';
    function attachUIElement(uiElement, parent) {
        if (uiElement instanceof core.Widget) {
            uiElement.attachTo(parent);
        } else if (uiElement instanceof core.Region) {
            uiElement.start(parent);
        }
    }

    return core.Widget.extend({
        View: View,
        onAttach: function () {

            if (this.options && this.options.body) {
                this.setBody(this.options.body);
            }
        },


        attachToBody: function (body) {
            body.attach();

        },
        setBody: function (body) {
            var bodyEl = this.view.getBody();
            attachUIElement(body, bodyEl);
        }
    });
});