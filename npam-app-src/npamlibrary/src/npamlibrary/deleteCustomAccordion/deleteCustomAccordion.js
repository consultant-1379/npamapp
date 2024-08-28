define([
    'jscore/core',
    './deleteCustomAccordionview',
    'widgets/Accordion',
    'container/api',
    'i18n!npamlibrary/dictionary.json'
], function (core, View, Accordion, container, libLanguage) {
    var accordion;
    return core.Widget.extend({

        View: View,

        init: function (options) {
            this.attr = options;
            this.content = options.accordionData;

            this.createAccordion(options.title);
            this.attachDelBtn();
        },

        createAccordion: function(name) {
            this.accordion  = new Accordion({
                title: name,
                content: this.content
            });
        },

        getAttributes: function() {
            return this.attr;
        },

        createAccTitle: function(type) {
            this.appendElement(this.createHTMLElement('span',type));
        },

        appendElement: function(el) {
            this.accordion.getElement().find(".ebAccordion-title").append(el);
        },

        createHTMLElement: function(tag, text) {
            var el = new core.Element(tag);
            el.setText(text);
            return el;
        },

        attachDelBtn: function() {
            var i = new core.Element("i");
            i.setAttribute("style", "float:right; margin-right:8px;");
            i.setAttribute("class", "ebIcon  ebIcon_delete");
            var toolTipTitle = document.getElementsByClassName("ebIcon_delete");
            toolTipTitle.title = this.options.type;
            if(toolTipTitle.title === "Collection" || toolTipTitle.title === "SavedSearch"){
                i.setAttribute("title", libLanguage.get("removeSpecific") +toolTipTitle.title);
            } else {
                i.setAttribute("title", libLanguage.get("removeAll"));
            }
            this.appendElement(i);
            /*click EVent for Accodion Delete*/
            this.getAccordionDeleteIcon().addEventHandler('click', function(){
               this.options.eventBus.publish("deletecustomevent", this.content);
               this.options.callBackFn({
                nodeName: this.attr.poId,
                isOtherObject: this.attr.title === libLanguage.get('otherObjects') ? true : false
               });
               this.accordion.detach();
            }.bind(this));
        },

        getAccordionDeleteIcon: function() {
            return this.accordion.getElement().find(".ebIcon_delete");
        },

        onViewReady: function () {
            this.accordion.attachTo(this.view.getElement());
        },

        getContent: function() {
            return this.content;
        },

        updateTable: function(data) {
            this.content.updateTable(data);
        },
        getTableDataLength: function() {
           return (this.content._rows.length)-1;
        }

    });

});