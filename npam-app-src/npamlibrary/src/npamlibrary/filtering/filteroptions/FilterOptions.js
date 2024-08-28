define([
    "widgets/ItemsControl",
    'widgets/Tooltip',
    "./FilterOptionsView"
], function (ItemsControl, Tooltip, View) {

    return ItemsControl.extend({

        View: View,

        onControlReady: function () {
            // Hard coding the options
            this.options.width = "auto";
            this.setWidth("auto");

            var items;
            switch (this.options.attributeType){
                //For 4 inventories(software, hardware, license and backup administrations).
                case 'text':
                    items = [{
                        name: "*" + '\xa0\xa0\xa0\xa0\xa0' +"Contains", //Contains
                        toolTip: "Contains"
                    },{
                        name: "=" + '\xa0\xa0\xa0\xa0\xa0' +"Equals to", //Exact equals
                        toolTip: "Equals to"
                    },{
                        name: "!=" + '\xa0\xa0\xa0\xa0' +"Not equals", //Not equals
                        toolTip: "Not equals"
                    },{
                        name: "ab*" + '\xa0\xa0' +"Starts with", //Starts with
                        toolTip: "Starts with"
                    },{
                        name: "*ab" + '\xa0\xa0' +"Ends with", //Ends with
                        toolTip: "Ends with"
                    }];
                    break;

                case 'boolean':
                    items = [{
                        name: "= Equals to", //Exact equals
                        toolTip: "Equals to"
                    }, {
                        name: "!= Not equals", //Not equals
                        toolTip: "Not equals"
                    }];
                    break;

                case 'date':
                    items = [{
                        name: "< Before", //Before
                        toolTip: "Before"
                    }, {
                        name: "> After", //After
                        toolTip: "After"
                    }];
                    break;

                //For inventory dates
                case 'nodeDate':
                    items = [{
                        name: "< Before", //Before
                        toolTip: "Before"
                    }, {
                        name: "> After", //After
                        toolTip: "After"
                    }];
                    break;

                //numbers.
                case 'number':
                    items = [{
                        name: "=" + '\xa0\xa0' +"Equals to", //Exact equals
                        toolTip: "Equals to"
                    },{
                        name: "!=" + '\xa0\xa0' +"Not equals", //Not equals
                        toolTip: "Not equals"
                    },{
                        name: "<" + '\xa0\xa0' +"Less than", //Lesser than
                        toolTip: "Less than"
                    },{
                        name: ">" + '\xa0\xa0' +"Greater than", //Greater than
                        toolTip: "Greater than"
                    }];
                    break;
                default:
                    //Apart from inventories(shm, job details, joblogs, view software packages, view license key files).
                    items = [{
                        name: "=" + '\xa0\xa0' +"Equals to", //Exact equals
                        toolTip: "Equals to"
                    },{
                        name: "!=" + '\xa0\xa0' +"Not equals", //Not equals
                        toolTip: "Not equals"
                    },{
                        name: "<" + '\xa0\xa0' +"Less than", //Lesser than
                        toolTip: "Less than"
                    },{
                        name: ">" + '\xa0\xa0' +"Greater than", //Greater than
                        toolTip: "Greater than"
                    }];
                    break;
            }
            this.setItems(items);
            this.setToolTip(items[0].toolTip);
            this.view.setSelected(items[0].name[0]);
        },

        setToolTip: function(value) {
            if(this.tooltip) {
                this.tooltip.destroy();
            }
            this.tooltip = new Tooltip({
                parent: this.getElement(),
                content: value
            });
        },

        onItemSelected: function (selectedValue) {
            this.setSelectedItem(selectedValue);
            var buttonName = selectedValue.name.split("\xa0")[0];
            this.view.setSelected(buttonName.split(" ")[0]);
            this.setToolTip(selectedValue.toolTip);
            this.trigger("change", "fromFilterOptions");
        },

        getValue: function () {
            return this.view.getSelected();
        }
    });
});