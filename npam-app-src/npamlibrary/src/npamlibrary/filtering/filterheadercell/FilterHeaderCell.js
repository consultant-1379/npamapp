
define([
    "jscore/ext/mvp",
    'jscore/core',
    "tablelib/Cell",
    "./FilterHeaderCellView",
    "../filteroptions/FilterOptions",
    "container/api",
    'i18n!npamlibrary/dictionary.json',
    "npamlibrary/filterUtil",
    "widgets/PopupDatePicker",
    "widgets/MultiSelectBox",
    'npamlibrary/constants',
    "npamlibrary/dateUtil",
], function (mvp,core, Cell, View, FilterOptions, container, libLanguage, FilterUtil, datePicker, MultiSelectBox,constants,DateUtil) {
    var typingTimer;
    return Cell.extend({

        View: View,

        onViewReady: function () {
            this.view.setPlaceHolderTxt(libLanguage.get('filterTxt'));
            this.input = this.getElement().find("input");
            this.input.addEventHandler("input", this.sendFilterEvent.bind(this));
            this.input.addEventHandler("input", this.displayCancelBtnFn.bind(this));
            this.view.hideCancelButton();
            this.view.getCancelButton().addEventHandler("click",this.clearFilterText.bind(this));
            container.getEventBus().subscribe('enableFilter',function(){
                FilterUtil.setFilterValue(true);
            }.bind(this));
            container.getEventBus().subscribe("stringFilter", function (filterValues, attribute) {
                if (filterValues && this.getColumnDefinition().attribute === attribute) {
                    this.input.setValue(filterValues.value);
                    this.displayCancelBtnFn();
                    this.filteroptions.view.setSelected(filterValues.comparator);
                }
            }.bind(this));

            this.datePicker = new datePicker({
                readOnly: true,
                showTime: true,
                labels: {
                    YYYY: libLanguage.get('popupDatePickerLabels.YYYY'),
                    MM: libLanguage.get('popupDatePickerLabels.MM'),
                    DD: libLanguage.get('popupDatePickerLabels.DD'),
                    hh: libLanguage.get('popupDatePickerLabels.hh'),
                    mm: libLanguage.get('popupDatePickerLabels.mm'),
                    ss: libLanguage.get('popupDatePickerLabels.ss'),
                    hours: libLanguage.get('popupDatePickerLabels.hours'),
                    minutes: libLanguage.get('popupDatePickerLabels.minutes'),
                    seconds: libLanguage.get('popupDatePickerLabels.seconds')
                }
            });
            this.datePicker.addEventHandler("dateselect", this.onDateChanged.bind(this));
            this.datePicker.addEventHandler("dateclear", this.sendFilterEvent.bind(this));

            container.getEventBus().subscribe("dateFilter", function (filterValues, attribute) {
                if (filterValues && this.getColumnDefinition().attribute === attribute) {
                    var selectedDate = filterValues.dateVal;
                    if (selectedDate) {
                        this.datePicker.setValue(selectedDate);
                    }
                }
            }.bind(this));


            // Filter options will provide us the dropdown with our comparator operations
            this.type = this.getColumnDefinition().attributeType;
            if(this.type === 'date') {
                this.view.showDatePicker();
                this.view.hideCancelButton();
                this.view.getInputTag().setModifier("hideInput");
                this.view.getDatePicker().setProperty("float","none");
                this.datePicker.attachTo(this.view.getDatePicker());
                //ENUM filtering for lockStatus Column
            } else if(this.type === 'enum') {
                this.view.getCancelButton();
                this.view.hideOptions().setStyle("display", "none");
                this.filterField = this.createElement("span", ["class", "eaNpamlibrary-FilterHeaderCell-enum"]);
                var lockStatusItems = localStorage.getItem("lockStatusValues").split(",");
                var items = [];
                for(var i=0; i < lockStatusItems.length; i++){
                    var list = {};
                    list.name = lockStatusItems[i];
                    list.value = lockStatusItems[i];
                    list.title = lockStatusItems[i];
                    items.push(list);
                }
                this.selectWidget = new MultiSelectBox({
                    value: items[0],
                    items: items
                });
               this.view.getWrapper().append(this.filterField);
               this.selectWidget.attachTo(this.filterField);
               this.selectWidget.setBoxSize('full');
               this.selectWidget.addEventHandler("change", this.sendFilterEvent.bind(this));

               container.getEventBus().subscribe("enumFilter", function (filters,attribute) {
                    var options = filters.value;
                    if (filters && this.getColumnDefinition().attribute === attribute) {
                        if(!this.checkForMultiSelect() && options.length===1){
                        this.selectWidget.setValue({"name": constants[options[0]], "value": options[0]});
                        } else {
                        var opts = [];
                            for(var i=0; i < options.length; i++){
                                opts.push({"name": constants[options[i]], "value": options[i]});
                            }
                            this.selectWidget.setValue(opts);
                        }
                    }
                }.bind(this));
            }else {
                this.view.hideDatePicker();
                this.view.getInputTag().removeModifier("hideInput");
            }
            this.filteroptions = new FilterOptions({
                attributeType: this.type
            });
            this.filteroptions.attachTo(this.getElement().find("div > div"));
            this.filteroptions.addEventHandler("change", this.sendFilterEvent.bind(this));
        },

        setValue: function () {
            // We don't want the default implementation to override our template
        },

        displayCancelBtnFn: function () {
            if(this.type !== 'date' && this.input.getValue().length > 0){
                this.view.showCancelButton();
            }else{
                this.view.hideCancelButton();
            }
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

        checkForMultiSelect: function(){
            var isMultiSelect = true;
             return isMultiSelect;
        },

        onDateChanged: function() {
            this.sendFilterEvent();
        },

        clearFilterText: function(){
            this.input.setValue("");
            this.input.trigger('input');
        },

        sendFilterEvent: function (calledFrom) {
            if (typingTimer) {
                clearTimeout(typingTimer);
            }
            var attr, val, comparator, dateValue, isMultiSelect;
            if (this.type === 'date') {
                if (this.datePicker && this.datePicker.getValue()) {
                    dateValue = this.datePicker.getValue();
                    val = DateUtil.getDateInServerFormat(dateValue);
                } else {
                    val = "";
                }
            } else if (this.type === 'enum') {
                val = [];
                if (this.checkForMultiSelect()) {
                    this.selectWidget.getSelectedItems().forEach(function(item){
                        val.push(item.value);
                    });
                    isMultiSelect = true;
                } else {
                    val.push(this.selectWidget.getValue().value);
                }
            }else {
                val = this.input.getValue().trim();
            }
            attr = this.getColumnDefinition().attribute;
            comparator = this.filteroptions.getValue();

            if (!(!isMultiSelect && val.length === 0 && calledFrom === "fromFilterOptions")) {
                this.getTable().trigger("filter", attr, val, comparator, dateValue, isMultiSelect);
                typingTimer = setTimeout(function () {
                    this.getTable().trigger("fetchFilterResults");
                }.bind(this), 2000);
            }
            if (FilterUtil.isfilterEnabled()) {
                FilterUtil.setFilterValue(false);
            }
            //clearTimeout(typingTimer);
        }
    });
});