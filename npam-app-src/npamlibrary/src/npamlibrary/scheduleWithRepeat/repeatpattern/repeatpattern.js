/**
 * Created with IntelliJ IDEA.
 * User: tcsyako
 * Date: 9/23/14
 * Time: 2:50 PM
 * To change this template use File | Settings | File Templates.
 */
define([
    'jscore/core',
    './repeatpatternView',
    'widgets/SelectBox',
    "widgets/PopupDatePicker",
    'i18n!npamlibrary/dictionary.json',
    'npamlibrary/dateUtil'
], function (core, View, SelectBox, PopupDatePicker, libLanguage, DateUtil) {

    return core.Widget.extend({

        View: View,

        init: function () {
            this.repeatSelectBoxValues = {
//                Daily: {
//                    name: libLanguage.get('daily'), value: 'Daily', title: libLanguage.get('daily'), action: this.repeatDaily.bind(this)
//                },
                Weekly: {
                    name: libLanguage.get('weekly'), value: 'Weekly', title: libLanguage.get('weekly'), action: this.repeatWeekly.bind(this)
                },
                Monthly: {
                    name: libLanguage.get('monthly'), value: 'Monthly', title: libLanguage.get('monthly'), action: this.repeatMonthly.bind(this)
                },
                Yearly: {
                    name: libLanguage.get('yearly'), value: 'Yearly', title: libLanguage.get('yearly'), action: this.repeatYearly.bind(this)
                }
            };
            this.repeatTypeSelectBox = new SelectBox({
                value: {
                    name: libLanguage.get('selectRepeatPattern'),
                    value: 'Select Repeat Pattern type',
                    title: libLanguage.get('selectRepeatPattern'),
                    action: function () {
                    }
                },
                items: [
//                    this.repeatSelectBoxValues.Daily,
                    this.repeatSelectBoxValues.Weekly,
                    this.repeatSelectBoxValues.Monthly,
                    this.repeatSelectBoxValues.Yearly
                ]
            });

            this.repeatAttributes = Object.create(Object.prototype);

            this.repeatTypeSelectBox.onItemSelected = function (selectedVal) {
                if (selectedVal.value !== this.getValue().value) {
                    this.setValue(selectedVal);
                    this.getElement().trigger('change');
                }
                selectedVal.action();
            };

            this.dateTimePicker = new PopupDatePicker({
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
        },

        onViewReady: function () {
            this.repeatPeriodTextBox = this.view.getRepeatPeriodTextBox();
            this.endAfterOccurrencesTextBox = this.view.getEndAfterOccurrencesTextBox();
            this.deactivateRepeatCheckbox();
            this.repeatTypeSelectBox.attachTo(this.view.getRepeatTypeSelectBox());
            this.view.getEndNever().addEventHandler("click", this.onSelectingNever.bind(this));
            this.view.getEndAfter().addEventHandler("click", this.activateTextBox.bind(this));
            this.view.getEndOn().addEventHandler("click", this.attachEndPopupDatePicker.bind(this));
            this.view.getRepeatCheckbox().addEventHandler("click", this.toggleRepeatOptions.bind(this));
            this.repeatPeriodTextBox.addEventHandler("keyup", this.validateTextBox.bind(this, this.repeatPeriodTextBox));
            this.endAfterOccurrencesTextBox.addEventHandler("keyup", this.validateTextBox.bind(this, this.endAfterOccurrencesTextBox));
            this.disableAll();
        },

        defaultOptions: function () {
            this.view.setRepeatHeading(libLanguage.get('repeatHeading'));
            this.view.setRepeatPattern(libLanguage.get('repeatPattern'));
            this.view.setRepeatsLabel(libLanguage.get('repeats'));
            this.view.setRepeatEvery(libLanguage.get('repeatEvery'));
            this.view.setRepeatPeriodType(libLanguage.get('repeatPeriodType'));
//            this.view.setRepeatsOn(libLanguage.get('repeats') + " " + libLanguage.get('on'));
//            this.view.setMondayLabel(libLanguage.get('daysOfWeek[0]'));
//            this.view.setTuesdayLabel(libLanguage.get('daysOfWeek[1]'));
//            this.view.setWednesdayLabel(libLanguage.get('daysOfWeek[2]'));
//            this.view.setThursdayLabel(libLanguage.get('daysOfWeek[3]'));
//            this.view.setFridayLabel(libLanguage.get('daysOfWeek[4]'));
//            this.view.setSaturdayLabel(libLanguage.get('daysOfWeek[5]'));
//            this.view.setSundayLabel(libLanguage.get('daysOfWeek[6]'));
            this.view.setEndsLabel(libLanguage.get('ends'));
            this.view.setNeverLabel(libLanguage.get('never'));
            this.view.setAfterLabel(libLanguage.get('after'));
            this.view.setOccurrencesLabel(libLanguage.get('occurrences'));
            this.view.setOnLabel(libLanguage.get('on'));
        },

        disableAll: function () {
            this.view.getRepeatTitle().setStyle("color", "grey");
            this.view.getRepeatSelectBoxLabel().setStyle("color", "grey");
            this.view.getRepeatTitleUnderLine().setStyle("color", "grey");
            this.view.getRepeatPeriodLabel().setStyle("color", "grey");
            this.view.getRepeatPeriodType().setStyle("color", "grey");
//            this.view.getRepeatWeekDayLabel().setStyle("color", "grey");
            this.view.getEndLabel().setStyle("color", "grey");
            this.endAfterOccurrencesTextBox.setAttribute("disabled", "");
            this.view.getEndAfterText().setStyle("color", "grey");
            this.repeatTypeSelectBox.disable();
            this.repeatPeriodTextBox.setAttribute("disabled", "");
//            this.disableWeekdayCheckboxes();
            this.disableEndOptions();
            this.dateTimePicker.detach();
            this.repeatTypeSelectBox.setValue({name: libLanguage.get('selectRepeatPattern'),value: 'Select Repeat Pattern type',title: libLanguage.get('selectRepeatPattern')});
//            this.view.getRepeatWeekDayHolder().setStyle("display", "initial");
            this.defaultOptions();
            this.view.getEndOn().setProperty('checked', false);
            this.view.getEndAfter().setProperty('checked', false);
            this.view.getEndNever().setProperty('checked', false);
            this.repeatPeriodTextBox.setValue("");
            this.endAfterOccurrencesTextBox.setValue("");
//            this.unCheckWeekdayCheckboxes();
            this.repeatType = "";
            this.endType = "";
        },

        showErrorType: function () {
            this.view.showErrorType().setAttribute("style", "display:none");
        },

        enableAll: function () {
            this.view.getRepeatTitle().setStyle("color", "black");
            this.view.getRepeatSelectBoxLabel().setStyle("color", "black");
            this.view.getRepeatTitleUnderLine().setStyle("color", "black");
            this.view.getRepeatPeriodLabel().setStyle("color", "black");
            this.view.getRepeatPeriodType().setStyle("color", "black");
//            this.view.getRepeatWeekDayLabel().setStyle("color", "black");
            this.view.getEndLabel().setStyle("color", "black");
            this.view.getEndAfterText().setStyle("color", "black");
            this.repeatTypeSelectBox.enable();
            if (this.repeatTypeSelectBox.getValue().value !== "Select Repeat Pattern type") {
                this.repeatTypeSelectBox.getValue().action();
            }
            if (this.view.getEndAfter().getProperty("checked")) {
                this.activateTextBox();
            }
            if (this.view.getEndOn().getProperty("checked")) {
                this.attachEndPopupDatePicker();
            }
        },

        activateRepeatCheckbox: function () {
            this.view.getRepeatCheckbox().removeAttribute("disabled", "");
            this.toggleRepeatOptions();
        },

        deactivateRepeatCheckbox: function () {
            this.view.getRepeatCheckbox().setProperty("checked", false);
            this.view.getRepeatCheckbox().setAttribute("disabled", "");
            this.disableAll();
        },

        toggleRepeatOptions: function () {
            if (this.view.getRepeatCheckbox().getProperty("checked")) {
                this.enableAll();
            }
            else {
                this.disableAll();
                this.view.showErrorType().setAttribute("style", "display:none");
            }
        },

        setDuplicateJobValuesToRepeatWidget: function (repeatScheduleConfigurations) {
            //Get repeat pattern configurations.
            this.duplicateScheduleConfigurations = repeatScheduleConfigurations;

            //Enable the Repeat check box.
            this.view.getRepeatCheckbox().setProperty("checked", true);

            //Set the value to repeats select box, Ex: Weekly, Daily... etc
            this.repeatTypeSelectBox.setValue(this.repeatSelectBoxValues[this.duplicateScheduleConfigurations.repeatType]);
            this.repeatTypeSelectBox.getValue().action();

            //Set the value to repeat every text box.
            this.repeatPeriodTextBox.setValue(this.duplicateScheduleConfigurations.repeatCount);

            //Get the repeat on list, iterate over it, based on the numbers present in repeat on list, check the respective checkboxes in DOM.
//            var repeatOn = this.duplicateScheduleConfigurations.repeatOn;
//            if (repeatOn !== null) {
//                for (var i = 0; i < repeatOn.length; i++) {
//                    switch (repeatOn[i]) {
//                        case "1":
//                            this.checkRepeatedDays('firstbox');
//                            break;
//                        case "2":
//                            this.checkRepeatedDays('secondbox');
//                            break;
//                        case "3":
//                            this.checkRepeatedDays('thirdbox');
//                            break;
//                        case "4":
//                            this.checkRepeatedDays('fourthbox');
//                            break;
//                        case "5":
//                            this.checkRepeatedDays('fifthbox');
//                            break;
//                        case "6":
//                            this.checkRepeatedDays('sixthbox');
//                            break;
//                        case "7":
//                            this.checkRepeatedDays('seventhbox');
//                            break;
//                    }
//                }
//            }

            /*
             * Get the occurrences,
             * if it not null, check the 'After' radio button and set the occurrences to text box
             * else, check if end date is null
             *           TRUE: check the 'Never' radio button
             *           FALSE: check the 'On' radio button and set the date in to popup date picker
             * */
            var occurrences = this.duplicateScheduleConfigurations.occurences;
            if (occurrences !== null) {
                this.view.getEndAfter().trigger('click');
                this.endAfterOccurrencesTextBox.setValue(occurrences);
                this.endAfterOccurrencesTextBox.trigger('keyup');
            } else {
                var endDate = this.duplicateScheduleConfigurations.endDate;
                if (endDate === null) {
                    this.view.getEndNever().trigger('click');
                } else {
                    this.view.getEndOn().trigger('click');
                    endDate = DateUtil.formatDate(endDate, true);
                    this.dateTimePicker.setValue(endDate);
                    this.dateTimePicker.trigger('dateselect');
                }
            }
        },

//        checkRepeatedDays: function (day) {
//            this.view.getSpecificDayElement(day).trigger('click');
//        },

//        disableWeekdayCheckboxes: function () {
//            var checkboxHolders = this.view.getRepeatWeekDayCheckboxes().children();
//            for (var i = 0; i < checkboxHolders.length; i++) {
//                var weekdayCheckbox = (checkboxHolders[i].children())[0];
//                weekdayCheckbox.setAttribute("disabled", "");
//                weekdayCheckbox.removeAttribute("checked");
//            }
//        },
//
//        enableWeekdayCheckboxes: function () {
//            var checkboxHolders = this.view.getRepeatWeekDayCheckboxes().children();
//            for (var i = 0; i < checkboxHolders.length; i++) {
//                var weekdayCheckbox = (checkboxHolders[i].children())[0];
//                weekdayCheckbox.removeAttribute("disabled", "");
//            }
//        },
//
//        unCheckWeekdayCheckboxes: function () {
//            var checkboxHolders = this.view.getRepeatWeekDayCheckboxes().children();
//            for (var i = 0; i < checkboxHolders.length; i++) {
//                var weekdayCheckbox = (checkboxHolders[i].children())[0];
//                weekdayCheckbox.setProperty('checked', false);
//            }
//        },

        disableEndOptions: function () {
            this.view.getEndNever().setAttribute("disabled", "");
            this.view.getEndAfter().setAttribute("disabled", "");
            this.view.getEndOn().setAttribute("disabled", "");
        },

        enableEndOptions: function () {
            this.view.getEndNever().removeAttribute("disabled", "");
            this.view.getEndAfter().removeAttribute("disabled", "");
            this.view.getEndOn().removeAttribute("disabled", "");
        },

        repeatDaily: function () {
            this.resetRepeatValues(libLanguage.get('days'), libLanguage.get('minAndMaxDays'), "999", "Daily");
        },

        repeatWeekly: function () {
            this.resetRepeatValues(libLanguage.get('weeks'), libLanguage.get('minAndMaxWeeks'), "106", "Weekly");
        },

        repeatMonthly: function () {
            this.resetRepeatValues(libLanguage.get('months'), libLanguage.get('minAndMaxMonths'), "24", "Monthly");
        },

        repeatYearly: function () {
            this.resetRepeatValues(libLanguage.get('years'), libLanguage.get('minAndMaxYears'), "3", "Yearly");
        },

        resetRepeatValues: function (repeatLabel, maxTxt, maxVal, repeatType) {
            if (this.repeatType !== repeatType) {
                this.repeatPeriodTextBox.removeAttribute("disabled", "");
                this.view.getRepeatPeriodTextBox().setValue("");
                this.enableEndOptions();
                this.resetEndValues();
                this.endAfterOccurrencesTextBox.setValue("");
                this.endAfterOccurrencesTextBox.setAttribute("disabled", "");
                this.view.getEndOn().setProperty('checked', false);
                this.view.getEndAfter().setProperty('checked', false);
                this.view.getEndNever().setProperty('checked', false);
//                this.view.getRepeatWeekDayHolder().setStyle("display", "none");
                this.view.getRepeatPeriodType().setText(repeatLabel);
                this.view.getRepeatMaxLengthInfo().setText(maxTxt);
                this.view.getRepeatPeriodTextBox().setAttribute("max", maxVal);
                this.repeatAttributes.repeatType = repeatType;
                this.view.getRepeatPeriodTextBox().trigger("input");
//                if(repeatType === "Weekly") {
//                    this.view.getRepeatWeekDayHolder().setStyle("display", "initial");
//                    this.enableWeekdayCheckboxes();
//                } else {
//                    this.unCheckWeekdayCheckboxes();
//                }
                this.repeatType = repeatType;
            }
        },

        onSelectingNever: function () {
            this.resetEndValues("Never");
        },

        activateTextBox: function () {
            this.resetEndValues("After");
        },

        attachEndPopupDatePicker: function () {
            this.resetEndValues("On");
        },

        resetEndValues: function (endType) {
            if (this.endType !== endType) {
                this.endAfterOccurrencesTextBox.setAttribute("disabled", "");
                this.endAfterOccurrencesTextBox.setValue("");
                this.view.showErrorType().setStyle("display", "none");
                this.dateTimePicker.detach();
                this.repeatAttributes.endType = endType;
                if(endType === "After") {
                    this.endAfterOccurrencesTextBox.removeAttribute("disabled", "");
                    this.view.getEndAfterMaxLengthInfo().setText(libLanguage.get('minAndMaxOccurrence'));
                    this.view.getEndAfterOccurrencesTextBox().setAttribute("max", "10");
                } else if(endType === "On") {
                    this.dateTimePicker.clear();
                    this.view.getEndAfterOccurrencesTextBox().setValue("");
                    this.dateTimePicker.attachTo(this.view.getRepeatEndOnDateTime());
                }
                this.endType = endType;
            }
        },

        validateTextBox: function (element) {
            var maxValue = Number(element.getAttribute("max"));
            var value = Math.round(element.getValue());
            if (value === "" || value < 1) {
                element.setValue("");
            } else if (value > maxValue) {
                element.setValue(maxValue);
            } else {
                element.setValue(value);
            }
        }
    });
});
