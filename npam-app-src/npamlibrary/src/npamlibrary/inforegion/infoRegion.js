define([
    "jscore/core",
    "npamlibrary/SectionNotification",
    'i18n!npamlibrary/dictionary.json',
    'widgets/InlineMessage'
], function (core, SectionNotification, libLanguage, InlineMessage) {

    return core.Region.extend({
        init: function (options) {
            this.isInfoMsg = options.isInfoMsg;
            this.isLkfMsg = options.isLkfMsg;
            this.desc = libLanguage.get('infoDescription').replace("<replace>", options.appName);
            this.lkfDesc = libLanguage.get('LKFDescription');
        },
        onStart: function () {
            if (this.notification) {
                this.notification.destroy();
            }
            if(this.isInfoMsg) {
                this.createInfoNotification();
            } else if(this.isLkfMsg){
               this.createLKFInfoNotification();
            } else {
                this.createErrorNotification();
            }
            this.getElement().setStyle("margin-top", "10px");
            this.notification.attachTo(this.getElement());
        },

        createInfoNotification: function() {
            this.notification = new SectionNotification({
                icon: "dialogInfo",
                title: libLanguage.get('infoTitle'),
                description: this.desc,
                isError: false
            });
        },

        createLKFInfoNotification: function() {
            this.notification = new InlineMessage({
                icon: "dialogInfo",
                header: libLanguage.get('LKFinfoTitle'),
                description: this.lkfDesc,
                isError: false
            });
        },


        createErrorNotification: function() {
            this.notification = new SectionNotification({
                icon: "error",
                title: libLanguage.get('accessDenied'),
                description: libLanguage.get('accessDeniedContent'),
                isError: true
            });
        }
    });

});