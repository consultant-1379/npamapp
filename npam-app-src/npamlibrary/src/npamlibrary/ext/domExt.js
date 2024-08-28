/*global define, navigator, window */
define([
    'jscore/core',
    'jscore/base/jquery'
], function (core, $) {
    'use strict';

    function getResult(el) {
        var $el = $(el);
        var result = $el.data('element');

        if (!result) {
            result = core.Element.wrap(el);
            $el.data('element', result);
        }
        return result;
    }

    function checkBrowser() {
        var browser;
        if (navigator.userAgent.indexOf('Firefox') !== -1 &&
            parseFloat(navigator.userAgent.substring(navigator.userAgent.indexOf('Firefox') + 8)) >= 3.6) {//Firefox
            browser = 'Firefox';
        } else if (!!(navigator.userAgent.match(/Trident/) && !navigator.userAgent.match(/MSIE/))) {//IE
            browser = 'MSIE';
        } else {
            browser = 'WebKit';

        }
        return browser;
    }

    var transitionEventNames = {
            'WebKit': 'webkitTransitionEnd',
            'Firefox': 'transitionend',
            'MSIE': 'transitionend'
        },
        animEndEventNames = {
            'WebKit': 'webkitAnimationEnd',
            'Firefox': 'animationend',
            'MSIE': 'animationend'
        };
    return {
        //Transition Event Name
        transitionEventName: transitionEventNames[checkBrowser()],
        // animation end event name
        animEndEventName: animEndEventNames[checkBrowser()],
        prepend: function (element, previous) {
            var prev = previous._getHTMLElement(),
                el = element._getHTMLElement();
            $(prev).prepend(el);
        },
        after: function (element, previous) {
            var prev = previous._getHTMLElement(),
                el = element._getHTMLElement();
            $(prev).after(el);
        },
        before: function (element, previous) {
            var prev = previous._getHTMLElement(),
                el = element._getHTMLElement();
            $(prev).before(el);
        },
        replaceWithEmpty: function (element) {
            $(element._getHTMLElement()).replaceWith("<ul class='eaNpamlibrary-selectionList-list'><li class='eaNpamlibrary-selectionList-item'></li></ul>");
        },
        replaceWith: function (element, replace) {
            $(element._getHTMLElement()).replaceWith(replace._getHTMLElement());
        },
        closest: function (element, selector) {
            var el = (element._getHTMLElement) ? element._getHTMLElement() : element,
                newElement = $(el).closest(selector);
            if (newElement !== undefined) {
                return getResult(newElement);
            }
        },
        offset: function (element) {
            return $(element._getHTMLElement()).offset();
        },
        position: function (element) {
            return $(element._getHTMLElement()).position();
        },
        width: function (element) {
            return $(element._getHTMLElement()).width();
        },
        /**
         * Returns window width and height of the browser window
         *
         * @method getWindowDimensions
         * @returns {{width: Number, height: Number}}
         */
        getWindowDimensions: function () {
            return {
                width: window.innerWidth,
                height: window.innerHeight
            };
        }

    };
});