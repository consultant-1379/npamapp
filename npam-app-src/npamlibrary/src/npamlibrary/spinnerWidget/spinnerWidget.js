define([
    'jscore/core',
    './spinnerWidgetView',
    'widgets/Spinner',
    'widgets/InfoPopup',
    'i18n!npamlibrary/dictionary.json'
], function (core, View, Spinner, InfoPopup, libLanguage) {

    return core.Widget.extend({

        View: View,

        init: function(options, eventBus) {
            this.options = options;
            this.isSelectable = options.isSelectable;
            this.isSelected = false;
            this.changeValue = false;
            if(options.defaultValue === null) {
                this.defaultValue = 0;
            } else {
                this.defaultValue = options.defaultValue.toString();
            }
            this.eventBus = eventBus;
        },

        onViewReady: function() {
            this.createSpinner();
        },

        createSpinner: function () {
            if (this.options.prompt === libLanguage.NumberTGsActivatedParallel){
                var str = this.options.pattern.split("=",3);
                this.maxValue = str[2];
                this.spinner = new Spinner({
                    max: this.maxValue,
                    value: this.defaultValue
                });
            }else{
                this.spinner = new Spinner({
                    max:50,
                    value: this.defaultValue
                });
            }
            if(this.options.platform === "ECIM" || this.options.platform === "AXE") {
                this.publishData(this.defaultValue);
            }
            this.spinner.attachTo(this.view.getSpinnerHolder());
            this.spinner.addEventHandler("change", this.onChangeSpinner.bind(this, true));
            if(this.options.platform === "AXE" && this.options.jobtype === "backup_housekeeping"){
                var spinnerLabel = this.options.title.split("_").pop();
                this.view.setSpinnerTitleWidth();
                this.view.setSpinnerTitle(spinnerLabel);
            }else {
                this.view.setSpinnerTitle(libLanguage[this.options.title]);
            }
            if(this.options.isSelectable) {
                this.createCheckBox();
                this.spinner.disable();
            }
            if (this.options.prompt !== "Number of TGs activated in parallel"){
                return this.setInfoPopup();
            }
        },

        setInfoPopup:function(){
                this.infoPopup = new InfoPopup({
                width: "230px",
                content: libLanguage[this.options.title+"_info"]
                });
                this.infoPopup.attachTo(this.view.getInfoPopUpHolder());
        },

        onChangeSpinner: function(isSelected, spinnerValue) {
            if(this.getCheckBox()) {
                this.options.title = this.getCheckBox().getProperty("name");
            }
           this.changeValue = false;
           if(spinnerValue > 0) {
                this.changeValue = true;
           }
           this.eventBus.publish("validateAccordions");
           this.publishData(spinnerValue, isSelected);
        },

        publishData: function(spinnerValue, isSelected) {
            this.eventBus.publish("ActivitiesData", this.getActivitiesData());
            this.eventBus.publish("Configuration", this.getConfigurationsData(spinnerValue, isSelected));
        },

       getActivitiesData: function() {
            return  { platformType : this.options.platform,
                      neType : this.options.neType,
                      activityName : this.options.activityName,
                      execMode : 'IMMEDIATE',
                      order : this.options.order,
                      status : this.getStatus()
                    };
        },

        getConfigurationsData: function(changeValue, isSelected) {
            return  { neType : this.options.neType,
                      key : this.options.title,
                      value : changeValue.toString(),
                      isSelected : isSelected
                    };
        },

        getStatus: function() {
            if((this.isSelectable && this.isSelected) || !this.isSelectable) {
                return true;
            }
            return false;
        },

        resetStatus: function() {
            this.isSelected = false;
            this.changeValue = false;
        },

        createCheckBox: function () {
            var element = this.createElement("input", ["class", "ebCheckbox eaNpambackuphousekeeping-activity-checkbox"], ["type", "checkbox"]);
            var checkbox = this.createElement("span", ["class", "ebCheckbox-inputStatus"]);
            element.setAttribute("disabled","disabled");
            element.setAttribute("name",this.options.title);
            this.appendElementToView(element);
            this.appendElementToView(checkbox);
            this.getCheckBox().addEventHandler("click", this.onCheckBoxClicked.bind(this));
        },

        onCheckBoxClicked: function() {
            var ischecked = this.getCheckBox().getProperty("checked");
            var checkedTitle = this.getCheckBox().getProperty("name");
            this.options.title = checkedTitle;
            this.spinner.disable();
            this.spinner.setValue(this.defaultValue);
            if(ischecked) {
                this.spinner.enable();
            }
            this.isSelected = ischecked;
            this.eventBus.publish("validateAccordions");
            this.onChangeSpinner(this.isSelected, this.spinner.getValue());
        },

        getCheckBox: function() {
            return this.view.getCheckBox();
        },

        createElement: function (elementType, attr1, attr2) {
            var element = new core.Element(elementType);
            if (attr1) {
                element.setAttribute(attr1[0], attr1[1]);
            }
            if (attr2) {
                element.setAttribute(attr2[0], attr2[1]);
            }
            return element;
        },

        appendElementToView: function (element) {
            this.view.getCheckBoxHolder().append(element);
        },

        enable: function() {
            this.getCheckBox().removeAttribute("disabled");
        },

        disableAndResetValues: function() {
            this.getCheckBox().setAttribute("disabled","disabled");
            this.getCheckBox().setProperty("checked", false);
            this.spinner.disable();
            this.spinner.setValue(this.defaultValue);
            this.resetStatus();
        }

    });
});