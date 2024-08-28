define([
    'jscore/core',
    'jscore/ext/privateStore',
    'widgets/InfoPopup',
    'uit!./labelwidget.html'
], function(core, PrivateStore, InfoPopup, View) {

    var _ = PrivateStore.create();

    return core.Widget.extend({

        init: function(options) {
            this.options.required = this.options.required || 'false';
            this.disabled = this.options.disabled || false;
            this.hidePassword = true;
        },

        view: function() {
            return new View(this.options);
        },

        onViewReady: function() {
            if (this.disabled) {
                this.view.getElement().find('.ebLabel-text').setAttribute('disabled');
                this.view.getElement().find('.ebInput').setAttribute('disabled');
                this.view.getElement().find('.eaNpamlibrary-wLabelWidget-eye').setAttribute('disabled');
                this.view.getElement().find('.eaNpamlibrary-wLabelWidget-extension').setAttribute('disabled');
            }
            if (this.options.required === true) {
                this.view.getElement().find('.ebLabel-text').setModifier("required");
            }
            if (this.options.placeholder) {
                this.view.getElement().find('.ebInput').setAttribute('placeholder', this.options.placeholder);
            }
            if (this.options.type && this.options.type === 'password') {
                this.view.getElement().find('.ebInput').setAttribute('type','password');
                this.view.getElement().find('.eaNpamlibrary-wLabelWidget-eye').setModifier("eye");
                this.view.getElement().find('.eaNpamlibrary-wLabelWidget-eye').addEventHandler('click', this.showPassword.bind(this));
            } else {
                this.view.getElement().find('.eaNpamlibrary-wLabelWidget-rInputMessage').setStyle('display', 'none');
            }
            if (this.options.maxlength) {
                this.view.getElement().find('.ebInput').setAttribute('maxlength', this.options.maxlength);
            }
            if (this.options.extension) {
                this.view.getElement().find('.eaNpamlibrary-wLabelWidget-extension').setText(this.options.extension);
            } else {
                this.view.getElement().find('.eaNpamlibrary-wLabelWidget-extension').setModifier('hide');
            }
            if (this.options.info) {
                this.infoPopup = new InfoPopup({icon: 'info', width: "325px", persistent: true,
                    content: this.options.info.content});
                this.infoPopup.attachTo(this.view.getElement().find(".eaNpamlibrary-wLabelWidget-infoButton"));
            }
            this.view.getElement().find('.ebInput').addEventHandler('input', function(e) {this.trigger('input', this.getValue());}.bind(this));
            this.view.getElement().find('.ebInput').addEventHandler('change', function(e) {this.trigger('input', this.getValue());}.bind(this));
        },

        getValue: function() {
            return this.view.getElement().find('.ebInput').getValue();
        },

        getValueAndExtension: function() {
            var value = this.view.getElement().find('.ebInput').getValue();
            if (value.length === 0) {
                return '';
            } else {
                return this.view.getElement().find('.ebInput').getValue() + this.view.getElement().find('.eaNpamlibrary-wLabelWidget-extension').getText();
            }
        },

        enable: function() {
            if(this.disabled) {
                this.view.getElement().find('.ebLabel-text').removeAttribute('disabled');
                this.view.getElement().find('.ebInput').removeAttribute('disabled');
                this.view.getElement().find('.eaNpamlibrary-wLabelWidget-eye').removeAttribute('disabled');
                this.view.getElement().find('.eaNpamlibrary-wLabelWidget-extension').removeAttribute('disabled');
                this.view.getElement().find('.eaNpamlibrary-wLabelWidget-eye').removeStyle('opacity');
                if (this.infoPopup) {
                    this.infoPopup.enable();
                }
                this.disabled = false;
            }
        },

        disable: function() {
            if(!this.disabled) {
                this.view.getElement().find('.ebLabel-text').setAttribute('disabled');
                this.view.getElement().find('.ebInput').setAttribute('disabled');
                this.view.getElement().find('.eaNpamlibrary-wLabelWidget-eye').setAttribute('disabled');
                this.view.getElement().find('.eaNpamlibrary-wLabelWidget-extension').setAttribute('disabled');
                this.view.getElement().find('.eaNpamlibrary-wLabelWidget-eye').setStyle('opacity', '0.3');
                this.view.getElement().find('.ebInput').setValue('');
                this.unsetError();
                if (this.infoPopup) {
                    this.infoPopup.disable();
                }
                this.disabled = true;
            }
        },

        showPassword: function() {
            if ( !this.disabled ) {
                if (this.hidePassword) {
                    this.view.getElement().find('.ebInput').setAttribute('type','');
                    this.view.getElement().find('.eaNpamlibrary-wLabelWidget-eye').removeModifier("eye");
                    this.view.getElement().find('.eaNpamlibrary-wLabelWidget-eye').setModifier("eyeLine");
                    this.hidePassword = false;
                } else {
                    this.view.getElement().find('.ebInput').setAttribute('type','password');
                    this.view.getElement().find('.eaNpamlibrary-wLabelWidget-eye').removeModifier("eyeLine");
                    this.view.getElement().find('.eaNpamlibrary-wLabelWidget-eye').setModifier("eye");
                    this.hidePassword = true;
                }
            }
        },

        changeExtension: function (newExtension) {
            if (!this.disabled) {
                this.view.getElement().find('.eaNpamlibrary-wLabelWidget-extension').setText(newExtension);
            }
        },

        setError: function(errorMessage) {
            this.view.getElement().find('.ebInput-statusError').setText(errorMessage);
            this.view.getElement().find('.eaNpamlibrary-wLabelWidget-rInputMessage').setAttribute("class", "eaNpamlibrary-wLabelWidget-rInputMessage ebInput-status_error");
        },

        unsetError: function(){
            this.view.getElement().find('.ebInput-statusError').setText("");
            this.view.getElement().find('.eaNpamlibrary-wLabelWidget-rInputMessage').setAttribute("class", "eaNpamlibrary-wLabelWidget-rInputMessage");
        }
    });
});
