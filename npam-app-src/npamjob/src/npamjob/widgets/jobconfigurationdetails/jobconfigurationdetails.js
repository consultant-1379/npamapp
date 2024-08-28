define([
    'jscore/core',
    './jobconfigurationdetailsview',
    "npamlibrary/constants",
    'i18n!npamjob/dictionary.json',
    'i18n!npamlibrary/dictionary.json',
    'npamlibrary/dateUtil',
    'npamlibrary/displaymessage',
    'widgets/InlineMessage'
], function (core, View, constants, language, libLanguage, DateUtil, DisplayMessage, InlineMessage) {

    var PERIODIC_DIV_CLASS = "eaNpamjob-wJobConfigurationDetails-ConfigurationPeriodicDetails";
    var PERIODIC_SPAN_KEY_CLASS = "eaNpamjob-wJobConfigurationDetails-ConfigurationContent-ConfigurationPeriodicDetails-Key";
    var PERIODIC_SPAN_VALUE_CLASS = "eaNpamjob-wJobConfigurationDetails-ConfigurationContent-ConfigurationPeriodicDetails-Value";

    return core.Widget.extend({
        View: View,

        init: function (options) {
            this.options = options || {};
            this.repeatEveryMap = {};
            this.repeatEveryMap[libLanguage.get('weekly')] = libLanguage.get('weeks');
            this.repeatEveryMap[libLanguage.get('monthly')] = libLanguage.get('months');
            this.repeatEveryMap[libLanguage.get('yearly')] = libLanguage.get('years');
            this.displayErrorMessage = new DisplayMessage();
            var eventBus = this.options.eventBus;
            eventBus.subscribe("jobConfigurationEvent", this.displayConfigurationDetails.bind(this));
            eventBus.subscribe("hideContent", this.hideConfigurationContent.bind(this));
            eventBus.subscribe("jobConfigurationError", this.showErrorMsg.bind(this));
            eventBus.subscribe("noJobSelected", this.noJobSelected.bind(this));
        },

        noJobSelected: function(){
            if(this.inlineMessage){
                this.inlineMessage.destroy();
            }
            if(this.displayErrorMessage){
                this.displayErrorMessage.destroy();
            }
            this.inlineMessage = new InlineMessage({
                icon: 'infoMsgIndicator',
                header: language.get("noJobSelectedHeader"),
                description: language.get("noJobSelectedMsg")
            });
            this.inlineMessage.attachTo(this.view.getDefaultMessage());
            this.view.hideContentHolder();
            this.view.getLoaderHolder().setModifier("hidden");
            this.view.showDefaultMsg();
        },

        displayConfigurationDetails: function (response) {
            this.view.hideDefaultMsg();
            this.view.getLoaderHolder().setModifier("hidden");
            this.response = response;
            this.view.getPeriodicConfigurationHolder().setText("");
            this.showConfigurationContent();

            this.selectedNEInfo = response.selectedNEs;

            this.view.setJobHeader(response.name);
            this.view.setJobDescriptionKey(libLanguage.get('description') );
            this.view.setJobDescriptionValue(response.description);
            this.view.setJobTypeKey(language.get('jobType') );
            this.view.setJobTypeValue(response.jobType);
            this.view.setJobCreatedByKey(language.get('createdBy') );
            this.view.setJobCreatedByValue(response.owner);
            this.view.setJobCreatedOnKey(language.get('createdOn'));
            this.view.setJobCreatedOnValue(DateUtil.formatNpamDate(response.creationTime,true));

            this.view.setConfigurationHeader(language.get('scheduleConfig'));

            this.clearScheduleConfiguration();
            this.view.setConfigurationModeKey(language.get('mode'));
            this.view.setConfigurationModeValue(libLanguage[response.mainSchedule.execMode.toLowerCase()]);
            this.displayJobParameterAttributes(response.jobType, response.jobProperties);

            var scheduleProperties = response.mainSchedule.scheduleAttributes;
            var scheduleJobConfiguration = {};
            scheduleProperties.forEach( function(scheduleProp) {
                if ( scheduleProp.name === "START_DATE" ) {
                    this.setConfigurationStartTime(libLanguage.get('startTime'),
                         DateUtil.formatStartDate((scheduleProp.value),true));
                } else if ( scheduleProp.name === "REPEAT_TYPE" ) {
                    scheduleJobConfiguration.repeatType = scheduleProp.value;
                } else if ( scheduleProp.name === "REPEAT_COUNT" ) {
                    scheduleJobConfiguration.repeatCount = scheduleProp.value;
                } else if ( scheduleProp.name === "OCCURRENCES" ) {
                    scheduleJobConfiguration.occurrences = scheduleProp.value;
                } else if ( scheduleProp.name === "END_DATE" ) {
                    scheduleJobConfiguration.endDate = scheduleProp.value;
                }
            }.bind(this));

            var repeatType = scheduleJobConfiguration.repeatType;
            if (repeatType ) {
                this.createPeriodInfo(libLanguage.get('repeatType'), scheduleJobConfiguration.repeatType);

                var repeatCount = scheduleJobConfiguration.repeatCount;
                if (repeatCount ) {
                    this.createPeriodInfo(libLanguage.get('repeatEvery'), repeatCount + this.repeatEveryMap[repeatType]);
                }

                if (scheduleJobConfiguration.endDate ) {
                    this.createPeriodInfo(libLanguage.get('ends'), DateUtil.formatNpamDate(scheduleJobConfiguration.endDate, true));
                } else if (scheduleJobConfiguration.occurrences ) {
                    this.createPeriodInfo(libLanguage.get('ends'), libLanguage.get('after') + scheduleJobConfiguration.occurrences + libLanguage.get('occurrences'));
                } else {
                    this.createPeriodInfo(libLanguage.get('ends'), libLanguage.get('never'));
                }
                this.showPeriodicValues();
            } else {
                this.hidePeriodicValues();
            }
        },

        setConfigurationStartTime: function(key, value){
            this.view.setConfigurationStartTimeKey(key);
            this.view.setConfigurationStartTimeValue(value);
        },

        clearScheduleConfiguration: function (){
            this.setConfigurationStartTime('','');
        },

        getValueFromKey: function(properties, key) {
            var element = properties.find(
                            function getElement(el) {
                                return el.key === key;
                            });
            if ( element ) {
                return element.value;
            } else {
                return undefined;
            }
        },

        displayJobParameterAttributes:function(jobType, jobProperties){
            this.view.hideProperties();
            if ( jobType === constants.ROTATE_CREDENTIALS_FROM_FILE )  {
                this.view.setUsername(libLanguage.get('fileName'),  this.getValueFromKey(jobProperties, "FILENAME" ));
            } else if ( jobType === constants.ROTATE_CREDENTIALS )  {
                this.view.setUsername(libLanguage.get('username'),  this.getValueFromKey(jobProperties, "USERNAME" ), false );
                this.view.setPassword(libLanguage.get('password'),  this.getValueFromKey(jobProperties, "PASSWORD" ), true );
            }
        },

        getKey: function(activityName) {
            var key = activityName + ":";
            if(libLanguage[activityName]){
                key = libLanguage[activityName] + ":";
            }
            return key;
        },

        createPeriodInfo: function (key, value) {
            if (value !== null) {
                var element = new core.Element("div");
                element.setAttribute("class", PERIODIC_DIV_CLASS);
                var label = new core.Element("span");
                label.setAttribute("class", PERIODIC_SPAN_KEY_CLASS);
                label.setText(key + ": ");
                element.append(label);
                var valueElement = new core.Element("div");
                valueElement.setAttribute("class", PERIODIC_SPAN_VALUE_CLASS);
                valueElement.setText(value);
                element.append(valueElement);
                this.view.getPeriodicConfigurationHolder().append(element);
            }
        },

        hideConfigurationContent: function (action) {
            this.view.showDefaultMsg();
            this.view.hideContentHolder();
            this.view.setDefaultMessage(this.message);
            if(action){
                this.view.getLoaderHolder().removeModifier("hidden");
            }
        },

        showErrorMsg: function (errorBody) {
            this.view.setDefaultMessage("");
            this.displayErrorMessage.showMessage(true, errorBody.body, "error", errorBody.title);
            this.displayErrorMessage.attachTo(this.view.getDefaultMessage());
            this.view.getLoaderHolder().setModifier("hidden");
        },

        hidePeriodicValues: function () {
            this.view.hidePeriodicValues();
        },

        showPeriodicValues: function () {
            this.view.showPeriodicValues();
        },

        showConfigurationContent: function () {
            this.displayErrorMessage.detach();
            this.view.hideDefaultMsg();
            this.view.showContentHolder();
        }
    });
});
