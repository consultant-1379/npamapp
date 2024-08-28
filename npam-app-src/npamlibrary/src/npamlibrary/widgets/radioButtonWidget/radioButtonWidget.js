define([
    'jscore/core',
    'jscore/ext/privateStore',
    'uit!./radiobuttonwidget.html'
], function(core, PrivateStore, View) {

    var _ = PrivateStore.create();

    return core.Widget.extend({

        init: function(options) {
            this.options.type = this.options.type || 'radio';
        },

        view: function() {
            return new View(this.options);
        },

        onViewReady: function() {
            _(this).inputElements = this.view.getElement().findAll('.eaNpamlibrary-wRadioButtonWidget-input');
            _(this).inputElements[0].addEventHandler('click', function() {
                if(_(this).inputElements[0].getAttribute('disabled') === undefined) {
                    this.trigger('change', this.getValue());
                }
             }.bind(this));

             _(this).inputElements[1].addEventHandler('click', function() {
                 if(_(this).inputElements[1].getAttribute('disabled') === undefined) {
                  this.trigger('change', this.getValue());
                 }
              }.bind(this));
        },

        setValue: function(value) {
            this.view.getElement().find('[value="' + value+'"]').setProperty('checked', true);
        },

        getValue: function() {
            var result;
            _(this).inputElements.forEach(function(input) {
                if (input.getProperty('checked')) {
                    result = input.getAttribute('value');
                }
            });
            return result;
        },

        enable: function() {
            _(this).inputElements.forEach(function(input) {
                input.removeAttribute('disabled');
            });
        },

        disable: function(options) {
            _(this).inputElements.forEach(function(input) {
                input.setAttribute('disabled','disabled');
            });
        },

        addOnClick: function(value, method) {
            this.view.getElement().find('.eaNpamlibrary-wRadioButtonWidget-input-' + value).addEventHandler('click', method);
        },

        isEnabled: function(value) {
            if(this.view.getElement().find('[value="' + value+'"]').getAttribute('disabled') === undefined) {
                return true;
            } else {
                return false;
            }
        }
    });
});
