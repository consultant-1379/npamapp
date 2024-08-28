define([
    'npamlibrary/serverDateUtil',
    'i18n/AdvancedDateTime',
    'i18n!npamlibrary/dictionary.json',
    'npamlibrary/constants',
],
    function (ServerDateUtil, AdvancedDateTime, libLanguage, Constants) {
        var format = "DTSZ";

        return {

            formatDate: function (date, isServerDate) {
                if (date === Constants.NA) {
                    return Constants.NA;
                }
                date = Number(date);
                if (!date || isNaN(date) || date === 0) {
                    return "";
                } else if (isServerDate) {
                    return AdvancedDateTime(date).tz(ServerDateUtil.getServerLocation()).format(format);
                }
                return AdvancedDateTime(date).format(format);
            },

            formatNpamDate: function (date, isServerDate) {
                if (!date || date === Constants.NA) {
                    return Constants.NA;
                }

                try {
                    newDate = new Date(date);
                } catch (error) {
                    return date;
                }

                if (isServerDate) {
                    return AdvancedDateTime(newDate).tz(ServerDateUtil.getServerLocation()).format(format);
                }
                return AdvancedDateTime(newDate).format(format);
            },

            formatStartDate: function(date, isServerDate){
                if (!date || date === Constants.NA) {
                    return Constants.NA;
                }

                if (isServerDate) {
                    return AdvancedDateTime.createFromTimeZone(date, ServerDateUtil.getServerLocation()).format(format);
                }
                return AdvancedDateTime(date).format(format);
            },

            getStartDateValue: function(date, isServerDate){
                if (!date || date === Constants.NA) {
                    return Constants.NA;
                }

                if (isServerDate) {
                    return AdvancedDateTime.createFromTimeZone(date, ServerDateUtil.getServerLocation()).value();
                }
                return AdvancedDateTime(date).value();
            },

            getFormattedInventoryDate: function (date, isServerDate) {
                if (date === Constants.NA) {
                    return Constants.NA;
                }
                date = Number(date);
                if (isNaN(date)) {
                    return "";
                } else if (isServerDate) {
                    return AdvancedDateTime(date).tz(ServerDateUtil.getServerLocation()).format(format);
                }
                return AdvancedDateTime(date).format(format);
            },

            getServerDateTime: function() {
                var serverDate = new Date(ServerDateUtil.getServerDate());
                return this.formatTo2DigitNumber(serverDate.getDate())+""+this.formatTo2DigitNumber(serverDate.getMonth()+ 1)+""+serverDate.getFullYear()+""+this.formatTo2DigitNumber(serverDate.getHours())+""+this.formatTo2DigitNumber(serverDate.getMinutes())+""+this.formatTo2DigitNumber(serverDate.getSeconds());
            },

            getFormattedScheduleDate: function (date) {
                if (date) {
                    var timeZoneFromDate = date.toString().split(" ");
                    var formattedDate = date.getFullYear() + "-" + this.formatTo2DigitNumber(date.getMonth() + 1) + "-" + this.formatTo2DigitNumber(date.getDate());
                    var formattedTime = this.formatTo2DigitNumber(date.getHours()) + ":" + this.formatTo2DigitNumber(date.getMinutes()) + ":" + this.formatTo2DigitNumber(date.getSeconds());
//                    var timeZone = timeZoneFromDate[5];
                    return formattedDate + " " + formattedTime /*+ " " + timeZone*/;
                }
            },

            formatTo2DigitNumber: function (number) {
                return (number < 10) ? "0" + number : number;
            },

            compareDate: function (date1, date2) {
                return ((date1 - date2) > 0);
            },

            getCurrentDate: function () {
                var dateForJobName = new Date();
                return (this.formatTo2DigitNumber(dateForJobName.getDate()) + "" + this.formatTo2DigitNumber((dateForJobName.getMonth() + 1)) + "" + dateForJobName.getFullYear() + "" + this.formatTo2DigitNumber(dateForJobName.getHours()) + "" + this.formatTo2DigitNumber(dateForJobName.getMinutes()) + "" + this.formatTo2DigitNumber(dateForJobName.getSeconds()));
            },
            /*Formatting selected date to send to server in YYYY-MM-DD hh:mm:ss*/
            getDateInServerFormat: function (dateSelected) {
                if (dateSelected) {
                    return (dateSelected.getFullYear() + "-" + this.formatTo2DigitNumber((dateSelected.getMonth() + 1)) + "-" + this.formatTo2DigitNumber(dateSelected.getDate()) + " " + this.formatTo2DigitNumber(dateSelected.getHours()) + ":" + this.formatTo2DigitNumber(dateSelected.getMinutes()) + ":" + this.formatTo2DigitNumber(dateSelected.getSeconds()));
                }
            },
            /*Setting selected date to filter field in browser locale*/
            getDateObj: function (dateReceived) {
                if (dateReceived && dateReceived !== "") {
                    var uiDate = new Date(AdvancedDateTime(dateReceived).value());
                    return uiDate;
                } else {
                    return "";
                }
            }

        };
    });
