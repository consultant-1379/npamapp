define([
    'jscore/core',
    'jscore/ext/mvp',
    'jscore/ext/net',
    'jscore/ext/locationController',
    'jscore/ext/utils',
    "container/api",
    'applib/LaunchContext',
    'layouts/WizardStep',
    './detailsNodeselectionView',
    'scopingpanel/TopologyButton',
    'npamlibrary/serverUtil',
    'widgets/table/CheckboxCell',
    'widgets/table/CheckboxHeaderCell',
    'tablelib/plugins/SecondHeader',
    'i18n!npamlibrary/dictionary.json',
    'tablelib/plugins/RowEvents',
    "widgets/InfoPopup",
    'npamlibrary/customAccordion',
    'npamlibrary/loadNodesDialog',
    'npamlibrary/loadUsecaseDialog',
    'npamlibrary/createTable',
    'npamlibrary/messageUtil',
    'npamlibrary/displaymessage',
    'widgets/Notification',
    'npamlibrary/constants',
    'npamlibrary/dateUtil',
    'npamlibrary/serverDateUtil',
    'npamlibrary/sessionStorageUtil',
    'npamlibrary/restUrls',
    'widgets/Dialog',
    'npamlibrary/unavailableJobDataDialog',
    'npamlibrary/i18NumberUtil',
    "npamlibrary/npamCommonUtil",
    'widgets/SelectionList',
    "npamlibrary/subComponentsWidget"
], function (core, mvp, Net, LocationController, Utils, container, LaunchContext, WizardStep,
             View, TopologyButton, ServerUtil,
             CheckboxCell, CheckboxHeaderCell, SecondHeader, libLanguage, RowEvents, InfoPopup,
             customAccordion, LoadNodesDialog, LoadUsecaseDialog, createTable, MessageUtil, DisplayMessage,
             Notification, Constants, dateUtil, serverDateUtil, sessionStorageUtil, restUrls, Dialog,
             unavailableJobDataDialog, i18nNumber, CommonUtil, SelectionList,
             SubComponentsWidget ) {
    var jobName, isJobNameValid, mode, attribute, topologyButton, isFilterApplied, filters, poIdAndCollectionTypeMap, contextEvent, xhr, inputTimer , appName;

    return WizardStep.extend({
        title: libLanguage.get('jobDetailstitle'),
        View: View,

        init: function (mainApp) {
            this.responseCache = {};
            this.responseCacheStorage = {};
            this.mainApp = mainApp;
            this.id = 0;
            this.accordions = {};
            this.poIds = [];
            this.finalCollection = {};
            this.supportedNes = [];
            this.unSupportedNes = [];
            this.unSupportedNesByPoId = {};
            this.map = [];
            this.oldJobComponentList = [];
            this.oldJobComponentActivities = [];
            this.model = this.mainApp.model;
            this.model.setAttribute("nodeDetails", []);
            this.model.setAttribute("isFirstStepModified", true);
            this.model.setAttribute("nodesModified", false);
            this.model.setAttribute("disableScheduleAndSummarySteps", false);
            this.model.setAttribute('JobDescription', '');
            this.retryCount = 0;
            this.tooltip = undefined;
            this.validateNext = true;
            this.isNenameFound = true;
            attribute = "nodeName";
            isFilterApplied = false;
            filters = {};
            poIdAndCollectionTypeMap = {};
            isJobNameValid = false;
            topologyButton = new TopologyButton({
                context: this.mainApp.getContext(),
                multiselect: true,
                restrictions: {
                    nodeLevel: true,
                    neType: {
                        neTypes: ['RadioNode'],
                        filter: 'whitelist'
                    }
                }
            });
            this.infoPopup = new InfoPopup({
                width: "300px",
                content: libLanguage.get('defaultMsg')
            });
            this.displayErrorMessage = new DisplayMessage();
            this.infoNotification = new Notification({
                label: libLanguage.get('schedule'),
                content: 'info',
                color: 'paleBlue',
                autoDismiss: false,
                icon: 'info'
            });
            this.mainApp.getEventBus().subscribe('validateComponent', this.validateComponent.bind(this));
            this.mainApp.getEventBus().subscribe('updateTable', this.deleteNodes.bind(this));

            /*resetNeAndCollectionObject: will reset the value of neAndCollectionObject, when it was returned from network explorer.*/
            this.mainApp.getEventBus().subscribe('resetNeAndCollectionObject', this.resetNeCollectionObject.bind(this));
            this.scopingPanelEventId = this.mainApp.getEventBus().subscribe(TopologyButton.events.SELECT, this.onScopingPanelSelect.bind(this));

            //This flag is set to true, if the job is being duplicated.
            this.isOldJob = false;
            //For collections or saved searches, in scenario of duplicate job creation.
            this.isCollectionNotExists = false;
            this.isSavedSearchNotExists = false;
            //If any individual network element is not available when job is being duplicated.
            this.isNeNotExists = false;
            this.unavailableNEs = [];
            //If any of the previously used packages are not available, they'll be gathered and stored in following variable.
            this.isPreviousUPNotExists = false;

            this.isComeFromJobDetails = false;
            //prepares a dialog to display error msgs related to collections / saved searches
            this.prepareErrorDialog();

            /*
             * ne and collection and saved search variable which will store the otherobjects, collections or saved searches.
             * Ex value: {
             *   "otherObjects": {
             *       type: "otherObjects",
             *       neList: [<neObjects list>]
             *   },
             *   <collectionId1>: {
             *       type: "collection",
             *       neList: [<neObjects list>]
             *   },
             *   <savedSearchId1>: {
             *       type: "savedSearch",
             *       neList: [<neObjects list>]
             *   },
             *   <collectionId2>: {
             *       type: "collection",
             *       neList: [<neObjects list>]
             *   },
             * }*/
            this.neAndCollectionObject = {};
            this.isBackToFirstStep = false;

            this.locationController = new LocationController();
//            this.filterUrlVersioning = {
//                'FilterRest': [restUrls.jobFilterVersionV1URL, restUrls.jobFilterURL]
//            };
            this.mainApp.getEventBus().subscribe('componentsModified', this.whenComponentsModified.bind(this));
            this.loadCounter=0;
            this.startCount=0;

            this.response4gCacheParent = {};
            this.response5gCacheParent = {};
            this.isAxePlatform = true;
        },

        whenComponentsModified: function() {
            this.model.setAttribute("isComoponentModified", true);
            this.model.setAttribute("disableScheduleAndSummarySteps", true);
            this.validateNext = false;
            this.revalidate();
            this.validateNext = true;
            this.revalidate();
        },

        onDestroy: function() {
            this.mainApp.getEventBus().unsubscribe(this.scopingPanelEventId);
        },

        deleteNodes: function () {
            this.updateTableData();
        },

        onViewReady: function () {
            this.view.getSelectionHeader().setText(libLanguage.get('resource'));
//TORF-670644            topologyButton.attachTo(this.view.getTopologySelectionButtonHolder());
//TORF-670644            var divTopLeft = this.view.divTopLeft();
//TORF-670644            this.infoPopup.attachTo(divTopLeft);
//TORF-670644            this.view.getPopUpHolder().append(divTopLeft);
            this.view.getJobDescription().addEventHandler("change", function () {
                this.model.setAttribute('JobDescription', this.view.getJobDescription().getValue());
            }.bind(this));
            this.view.getJobNameHolder().addEventHandler("input", this.validateJobName.bind(this));
            this.view.setPlaceHolder(libLanguage.get('jobName'), libLanguage.get('jobDescription'));
            this.validateAndGetServerTime();
            this.addObjectsToDom();
            this.selectionList();
        },

        refreshView: function () {
            console.log("wrong refreshView");
        },

        addObjectsToDom: function () {
            this.view.setProcessDescription(libLanguage.get('processDescription'));
            this.view.setJobName(libLanguage.get('jobName'));
            this.view.setJobNameMaxText(libLanguage.get('jobNameMaxLimit'));
            this.view.setJobDesc(libLanguage.get('jobDescription'));
            this.view.setJobDescMaxText(libLanguage.get('jobDescMaxLimit'));
            this.view.setErrorMsg(libLanguage.get('errorMsg'));

            this.infoNotification.attachTo(this.view.getInfoHolder());
            this.infoNotification.setLabel(libLanguage.get('neAccountsJobInfoMessage'));
            this.view.hideComponentContent();
        },

        onAttach: function () {
            this.model.trigger("change:detachNotification");
            this.model.setAttribute("inValidationStep", true);
            this.backToFirstStepFromOtherStep();
        },

        backToFirstStepFromOtherStep: function(){
            if(!this.model.getAttribute("isFirstStepModified")){
                this.isBackToFirstStep = true;
            }
        },

        isValid: function () {
            if(this.getWizard() && this.getWizard().getActiveStep() === this.id) {
                this.setPoIdsAndNeNames();
            }
            var totalNodes = this.getTotalSelectedNodes();
            container.getEventBus().publish("collectionChangeEvent");
            if (!isJobNameValid) {
                return false;
            }
            if(totalNodes.length > 0 && this.totalNodes.length === this.unSupportedNes.length) {
                return false;
            }
            return (totalNodes.length > 0 && jobName.length > 0 && this.validateNext && this.isNenameFound);
        },

        //TODO check formatSupportedNesResponse start
//        formatSupportedNesResponse: function(supportedNesPayload,totalNodes,poId) {
//            return new Promise(function(resolve,reject) {
//                ServerUtil.sendRestCall(
//                    'POST',
//                    restUrls.getsupportedNesURL,
//                    this.successSupportedNe.bind(this,resolve,totalNodes,poId),
//                    this.onErrorWhileReceivingFilteredData.bind(this, poId, reject),
//                    'json',
//                    'application/json',
//                    JSON.stringify(supportedNesPayload)
//                  );
//            }.bind(this));
//        },

//        successSupportedNe:function(resolve,totalNodes,poId,response) {
//            if(response.UnSupportedNes.length > 0) {
//                var isAlreadyAvailable = false;
//                var isAvailableInpoIdArray = false;
//                if( poId && !this.unSupportedNesByPoId[poId]) {
//                    this.unSupportedNesByPoId[poId] = [];
//                } else if(!poId && !this.unSupportedNesByPoId.OtherObjects) {
//                    this.unSupportedNesByPoId.OtherObjects = [];
//                }
//                for(var x = 0; x < response.UnSupportedNes.length;x++) {
//                    for(var i = 0; i < this.unSupportedNes.length; i++) {
//                        if(this.unSupportedNes[i] === response.UnSupportedNes[x].name) {
//                            isAlreadyAvailable = true;
//                        }
//                    }
//                    if(poId) {
//                        for(var j = 0; j < this.unSupportedNesByPoId[poId].length; j++) {
//                            if(this.unSupportedNesByPoId[poId][j] === response.UnSupportedNes[x].name) {
//                                isAvailableInpoIdArray = true;
//                            }
//                        }
//                    } else {
//                        for(var k =0; k < this.unSupportedNesByPoId.OtherObjects.length; k++ ) {
//                            if(this.unSupportedNesByPoId.OtherObjects[k] === response.UnSupportedNes[x].name) {
//                                isAvailableInpoIdArray = true;
//                            }
//                        }
//                    }
//                    if(!isAlreadyAvailable) {
//                        this.unSupportedNes.push(response.UnSupportedNes[x].name);
//                    }
//
//                    if(!isAvailableInpoIdArray) {
//                        if(poId) {
//                            this.unSupportedNesByPoId[poId].push(response.UnSupportedNes[x].name);
//                        } else if(!poId) {
//                            this.unSupportedNesByPoId.OtherObjects.push(response.UnSupportedNes[x].name);
//                        }
//                    }
//                }
//            }
//            if(response.SupportedNes.length > 0) {
//                for(var y = 0; y < response.SupportedNes.length;y++) {
//                    this.supportedNes.push(response.SupportedNes[y].name);
//                }
//            }
//            resolve();
//        },
        //TODO check formatSupportedNesResponse end

        isNotAvailableInAnyOtherPoId: function(checkNeName, poId) {
            var count = 0;
            if (this.unSupportedNesByPoId.OtherObjects) {
                for(var k =0; k < this.unSupportedNesByPoId.OtherObjects.length; k++ ) {
                    if(this.unSupportedNesByPoId.OtherObjects[k] === checkNeName) {
                        count++;
                    }
                }
            }
            if ( this.poIds.length > 0) {
                for(var i = 0; i < this.poIds.length; i++) {
                    if(this.poIds[i] && this.unSupportedNesByPoId[this.poIds[i].poId]) {
                        for(var j = 0; j < this.unSupportedNesByPoId[this.poIds[i].poId].length; j++) {
                            if(this.unSupportedNesByPoId[this.poIds[i].poId][j] === checkNeName) {
                                count++;
                            }
                        }
                    }
                }
            }
            if(count === 1) {
                return true;
            } else {
                return false;
            }
        },

        setPoIdsAndNeNames: function () {
            var collectionNames = [];
            var savedSearches = [];
            var otherObjects = [];
            for (var i in this.accordions) {
                var attr = this.accordions[i].getAttributes();
                if (attr.type === 'Collection') {
                    collectionNames.push(attr.name);
                } else if (attr.type === 'SavedSearch') {
                    savedSearches.push(attr.name);
                } else {
                    otherObjects = otherObjects.concat(this.accordions[i].getTableData());
                }
            }
            /*
             * Below snippet will be useful if any node is removed using Remove Selected button which will present in quick action bar.
             * */
            if (this.neAndCollectionObject.otherObjects) {
                this.neAndCollectionObject.otherObjects.neList = otherObjects;
            }
            this.model.setAttribute("collectionNames", collectionNames);
            this.model.setAttribute("savedSearches", savedSearches);
            this.model.setAttribute("otherObjects", otherObjects);
            /*
             * Currently: neAndCollectionObject is being used only in 2nd and 3rd steps of create upgrade job,
             * This is to allow modifications on ne / collection / SS objects present in neAndCollectionObject of model,
             * The modifications will be done in following scenarios:
             * 1.) If any package is unavailable specific to a neType of nodes.
             * 2.) On validation(3rd step of create upgrade job), if any node is on the same software level.
             * */
             this.model.setAttribute("neAndCollectionObject", this.neAndCollectionObject);
        },

        getTotalSelectedNodes: function () {
            var totalNodes = [];
            var otherObjects = this.model.getAttribute("otherObjects");
            this.totalNodes = [];
            for (var i in this.accordions) {
                if (totalNodes.length === 0) {
                    totalNodes = totalNodes.concat(this.accordions[i].getTableData());
                    this.totalNodes = this.totalNodes.concat(this.accordions[i].getTableData());
                } else {
                    totalNodes = this.checkDuplicatesAndUpdate(this.accordions[i].getTableData(), totalNodes, this.totalNodes);
                }
            }

            //removing the unsupported nodes from totalNodes so that on second step only supported nodes should reach
            if (this.unSupportedNes.length > 0) {
                for(var b=0;b< this.unSupportedNes.length;b++){
                    for(var a =0;a< totalNodes.length;a++){
                        if(this.unSupportedNes[b]===totalNodes[a].name){
                            totalNodes.splice(a,1);
                        }
                    }
                }
            }
            this.model.setAttribute("nodeDetails", totalNodes);
            this.model.setAttribute("otherObjects", otherObjects);
            return totalNodes;
        },

        checkDuplicatesAndUpdate: function (array1, array2, firstAccNodes) {
            array1.forEach(function (item) {
                var duplicate = false;
                for (var i = 0; i < array2.length; i++) {
                    if (array2[i].name === item.name) {
                        duplicate = true;
                        break;
                    }
                }
                if (!duplicate) {
                    array2.push(item);
                    firstAccNodes.push(item);
                }
            });
            this.totalNodes = firstAccNodes;
            return array2;
        },

//        createNewModel: function (model, response, nodeDetails) {
//            model.neType = (!model.neType) ? "" : model.neType;
//            nodeDetails[model.networkElementFdn] = model;
//            return nodeDetails[model.networkElementFdn];
//        },

        validateJobName: function () {
            if (inputTimer) {
                this.view.showLoading();
                clearTimeout(inputTimer);
            }

            isJobNameValid = false;
            jobName = this.view.getJobName();
            this.view.setJobNameText(jobName);
            this.tooltip = CommonUtil.createTooltip(this.tooltip, this.view.getJobNameHolder(), jobName);

            if (this.isJobNameInvalid()) {
                this.dontProceedToNextStep(libLanguage.get('jobNameInvalidMsg'));
                this.view.hideLoading();
            } else {
                this.view.hideErrorMessageForJobName();
                if (jobName.length > 0) {
                    if (jobName.length > 150) {
                        this.dontProceedToNextStep(libLanguage.get('jobNameExceeds'));
                    } else {
                        inputTimer = setTimeout(function () {
                            ServerUtil.sendRestCall('GET', restUrls.jobNameValidation + jobName, this.dontProceedToNextStep.bind(this, libLanguage.get('differentJob')), this.proceedToNextStep.bind(this));
                        }.bind(this), 2000);
                        this.proceedToNextStep();
                    }
                } else {
                    isJobNameValid = false;
                    this.view.hideLoading();
                }
                this.revalidate();
            }
        },

        isJobNameInvalid: function () {
            //If any new characters are added in JOB_NAME_VALIDATION_PATTERN, Make sure getJobName() is also modified.
            return (Constants.JOB_NAME_VALIDATION_PATTERN.test(jobName));
        },

        proceedToNextStep: function (response, xhr) {
//            if (xhr.getStatus() === 404) {
//                try {
//                    JSON.parse(xhr.getResponseText());
                    this.view.hideErrorMessageForJobName();
                    this.model.setAttribute('JobName', jobName);
                    isJobNameValid = true;
                    this.revalidate();
//                } catch (e) {
//                    console.log('Exceptions while parsing the jobName response?');
//                    //display cannot proceed dialog
//                }
//            } else if (xhr.getStatus() === 500 && xhr.getResponseText() === Constants.DATABASEERROR) {
//                isJobNameValid = true;
//                this.view.setInputErrorMsgForJobName(libLanguage.get('databaseErrorParagraph'));
//                this.view.showErrorMessageForJobName();
//            }
            this.view.hideLoading();
        },

        dontProceedToNextStep: function (modifiedJobName) {
            this.view.setInputErrorMsgForJobName(modifiedJobName);
            this.view.showErrorMessageForJobName();
            isJobNameValid = false;
            this.revalidate();
            this.view.hideLoading();
        },

        populateJobName: function (jobName) {
            if (this.mainApp.appName) {
                this.view.getJobNameHolder().setValue(jobName ? jobName : this.getJobName());
            }
            this.view.getJobNameHolder().trigger("input");
        },

        getJobName: function () {
            var appNameNhash = "#" + this.mainApp.appName;
            var appName = "npamcreateneaccountjob";
            var jobTitle = "";
            switch (appNameNhash) {
                case Constants.CREATE_NE_ACCOUNTS_LINK:
                    appName = "npamcreateneaccountjob";
                    jobTitle = libLanguage.get('createneaccountsjobTitle');
                    break;
                case Constants.DETACH_NE_ACCOUNTS_LINK:
                    appName = "npamdeleteneaccountjob";
                    jobTitle = libLanguage.get('detachneaccountsjobTitle');
                    break;
                case Constants.ROTATE_NE_ACCOUNTS_LINK:
                    appName = "npamrotateneaccountjob";
                    jobTitle = libLanguage.get('rotateneaccountsjobTitle');
                    break;
                case Constants.CHECK_NE_ACCOUNTS_CONFIG_LINK:
                    appName = "npamcheckneaccountconfigjob";
                    jobTitle = libLanguage.get('checkneaccountsconfigjobTitle');
                    break;
            }
            localStorage.setItem("jobTitle", jobTitle);

            //If userName contains any characters otherthan (a-zA-Z0-9-_.). Then, those characters will be replaced by "_".
            var userName = sessionStorageUtil.getUserName().replace(/[^a-zA-Z0-9-_.]/g, "_");
            return (Constants[appName + "_" + Constants.jobName] + userName + "_" + dateUtil.getServerDateTime());
        },

        validateAndGetServerTime: function () {
            serverDateUtil.triggerServerTimeCall(this.populateJobName.bind(this), this.showFailureMessage.bind(this));
        },

        showFailureMessage: function (errorMessage) {
            if(this.displayErrorMessage){
                this.displayErrorMessage.detach();
            }
            if (errorMessage) {
                this.displayErrorMessage = errorMessage;
                this.displayErrorMessage.attachTo(this.view.getElement());
            }
        },

        locationChangeHandler: function (hash) {
            this.isComeFromJobDetails = false;
            var currentUser = localStorage.getItem("currentUser");
            var sessionData = JSON.parse(localStorage.getItem(currentUser));

            if (hash.indexOf("loadNodes?") > -1) {
                this.loadNodesHandler(hash.split("loadNodes?")[1]);
            } else if (!(hash.match("loadNodes"))) {
                var comeFrom = sessionData.comeFrom;
                var comeFromInv = ["npamapp","npamapp/jobdetails"];

                for (var i = 0; i < comeFromInv.length; i++) {
                    if (sessionData && comeFrom && (comeFromInv[i] === comeFrom)) {
                        var collections = sessionData.collections;
                        var savedSearches = sessionData.savedSearches;
                        if (collections.length) {
                            collections.forEach(function(poid) {
                                    this.poIds.push({
                                        'type': 'col',
                                        'poId': poid
                                    });
                            }.bind(this));
                            this.fetchCollections(this.poIds[0].poId);
                        } else if (savedSearches.length) {
                            savedSearches.forEach(function(poid) {
                                this.poIds.push({
                                    'type': 'ss',
                                    'poId': poid
                                });
                            }.bind(this));
                            this.fetchSavedSearches(this.poIds[0].poId);
                        } else {
                            var selectedNodes = sessionData.selectedNodes;
                            var nodes = sessionData.nodes;
                            this.poIds.push({'type': 'col', 'poId': undefined});

                            if (comeFrom === "npamapp/jobdetails") {
                                selectedNodes = nodes;
                                this.isComeFromJobDetails = true;
                            }
                            if (nodes) {
                                this.mainApp.showLoadingAnimation();
                                this.validateNodes(selectedNodes);
                            }
                        }
                    }
                }
                this.revalidate();
            }
        },

        listOfAvailableNodes: function (requestData, response) {
            var filterRequestData;
            if(Array.isArray(requestData)) {
                filterRequestData = requestData;
            } else {
                filterRequestData = requestData.networkElements;
            }
            this.mainApp.hideLoadingAnimation();
            var supportedNodes = response.supportedNes;
            this.findUnavailableNodes(filterRequestData, supportedNodes);
        },

        validateNodes: function (selectedNodes) {
            this.mainApp.showLoadingAnimation();
            this.initCountAndCollection();
            this.model.setAttribute("nodeDetails", []);
            this.prepareAccName(libLanguage.get('otherObjects'), "", undefined);

            // To create a key value pair of type otherObjects
            this.createNeAndCollectionOrSSObject(Constants.OtherObjects, []);
            if (selectedNodes && selectedNodes.length > 0) {
                this.prepareCollection(true, undefined, this.getFdnList({'motype': selectedNodes}));
            } else {
                this.mainApp.hideLoadingAnimation();
            }
        },

        loadNodesHandler: function (queryString) {
            this.startCount = 0;
            this.endCount = 0;
            var parameters = {};
            queryString = queryString.split("&");
            for (var i in queryString) {
                var keyValuePair = queryString[i].split("=");
                parameters[keyValuePair[0]] = keyValuePair[1];
            }
            if (parameters.collections) {
                parameters.collections.split(",").forEach(function(poid) {
                    this.poIds.push({
                        'type': 'col',
                        'poId': poid
                    });
                }.bind(this));
                this.fetchCollections(this.poIds[0].poId);
            } else if (parameters.savedsearches) {
                parameters.savedsearches.split(",").forEach(function(poid) {
                    this.poIds.push({
                        'type': 'ss',
                        'poId': poid
                    });
                }.bind(this));
                this.fetchSavedSearches(this.poIds[0].poId);
            } else if (parameters.launchContextId) {
                var newHash = window.location.hash.split('/loadNodes?')[0];
                newHash = newHash ? newHash : window.location.hash;
                newHash = newHash.substring(1);
                LaunchContext.get(parameters.launchContextId,
                    function () {
                        this.getNodesFromLaunchContext(parameters.launchContextId, newHash);
                    }.bind(this),
                    function() {
                        this.locationController.setLocation(newHash, true, true);
                    }.bind(this));
            }
        },

        showErrorMessage: function (errorBody) {
            this.displayErrorMessage.detach();
            this.displayErrorMessage.showMessage(true, errorBody.userMessage.body, "error", errorBody.userMessage.title);
            this.displayErrorMessage.attachTo(this.view.getErrorMessageHolder());
        },

        loadErrorMessage: function (poId, returnedObject, response, xhr) {
            if (this.isOldJob && poId) {
                this.findUnavailableCollectionsOrSavedSearches(poId, xhr);
            } else {
                this.mainApp.hideLoadingAnimation();
                this.revalidate();
                var status = xhr.getStatus();
                switch (status) {
                    case 403:
                        this.accessDeniedDialog.show();
                        break;
                    /*
                     * When session timed out,  initially a 302 response code is coming,
                     * This 302 in turn triggering one more GET rest call to navigate to login page with response code 200.
                     * With the help of this response code we're navigating to login page and coming back to the current page.
                     * */
                    case 200:
                        window.location.reload();
                        break;
                    case 404:
//                        if(returnedObject === 0) {
//                            var v0PayLoadData = this.requestPayLoad;
//                            ServerUtil.sendRestCall(
//                                'POST',
//                                this.filterUrlVersioning.FilterRest[1],
//                                this.listOfAvailableNodes.bind(this, v0PayLoadData),
//                                this.loadErrorMessage.bind(this, undefined, undefined),
//                                'json',
//                                'application/json',
//                                JSON.stringify(v0PayLoadData)
//                            );
//                        } else {
                            this.setPopUpContent(libLanguage.get('noCollectionTitle'), libLanguage.get('noCollectionContent'));
                            this.showPopUp();
//                        }
                        break;
                    default:
                        var errorBody = MessageUtil.getErrorMessage(status, xhr.getResponseText());
                        var errorBodyResponse = JSON.parse(errorBody.userMessage.body);
                        this.setPopUpContent(errorBody.userMessage.title, errorBodyResponse.userMessage.body);
                        this.showPopUp();
                }
            }
        },

        clearSetTimeout: function () {
            if (this.stopTimeout) {
                window.clearTimeout(this.stopTimeout);
            }
        },

        checkErrorCode: function (xhr) {
            var errorCode = xhr.getResponseJSON().errorCode || 0;
            var detail = xhr.getResponseJSON().detail || '';
            var errorBody = {};
            if (libLanguage.get('persistentObject') && libLanguage.get('persistentObject')[errorCode.toString()]) {
                errorBody.header = libLanguage.get('persistentObject').title;
                errorBody.content = libLanguage.get('persistentObject')[errorCode.toString()].body;
            } else {
                errorBody.header = libLanguage.get('unSupportedMoHeader');
                errorBody.content = libLanguage.get('unknownError_content');
            }
            return errorBody;
        },

        onErrorWhileReceivingFilteredData: function (poId, response, xhr) {
            this.mainApp.hideLoadingAnimation();
            var dialogContent = this.checkErrorCode(xhr);
            if (xhr.getStatus() === 200) {
                window.location.reload();
            } else if (xhr.getStatus() === 404) {
                this.validateNext = false;
                this.setPopUpContent(dialogContent.header, dialogContent.content, dialogContent.optionalContent);
                this.showPopUp();
                if (Object.keys(this.accordions).length > 0) {
                    this.validateNext = true;
                }
                this.revalidate();
            } else {
                this.clearSetTimeout();
                if (this.retryCount >= 2) {
                    this.retryCount = 0;
                    this.validateNext = false;
                    this.errorResponseCount++;
                    if (this.accordions) {
                        this.view.hideAccordionHolderDiv();
                    }
                    this.mainApp.getEventBus().publish("detachRetryNotification");
                    this.loadErrorMessage(undefined, undefined, response, xhr);
                } else {
                    this.retryCount++;
                    this.mainApp.getEventBus().publish("attachRetryNotification");
                    this.stopTimeout = setTimeout(function () {
                        this.sendRestCall();
                    }.bind(this), 5000);
                }
            }
        },

//        errorHandlingForUnSuppMoTypes: function () {
//            var errorBody = {
//                userMessage: {
//                    body: libLanguage.get('selectedMOsNotValid'),
//                    title: libLanguage.get('invalidNWObj')
//                }
//            };
//            var hashValue = window.location.hash;
//            if ((hashValue && hashValue.indexOf("/") > -1)) {
//                var loadNodes = (hashValue.split("/"))[1];
//                if (loadNodes && loadNodes.indexOf("?") > -1) {
//                    var selectedCollections = loadNodes.split("?")[1];
//                    if (selectedCollections && selectedCollections.indexOf("=") > -1) {
//                        var keyword = selectedCollections.split("=");
//                        if (keyword[0] === "savedsearches") {
//                            errorBody.userMessage.title = libLanguage.get('invalidSavedSearch');
//                        } else if (keyword[0] === "collections" && keyword[1].indexOf("generatedCollection") === -1) {
//                            errorBody.userMessage.title = libLanguage.get('invalidCollection');
//                        }
//                    }
//                }
//            }
//            this.showErrorMessage(errorBody);
//        },

        fetchCollections: function (colPoId) {
            if(colPoId) {
                this.initCountAndCollection();
                this.mainApp.showLoadingAnimation();
                this.model.setAttribute("nodeDetails", []);
                this.type = Constants.Collection;
                ServerUtil.sendRestCall(
                    'GET',
                    '/object-configuration/collections/v4/' + colPoId +'?includeContents=true',
                    this.getNodesFromCollection.bind(this, colPoId),
                    this.loadErrorMessage.bind(this, colPoId, undefined),
                    'json'
                );
            } else {
                this.triggerFilterCall(this.jobTemplateInfo.neNames);
            }
        },

        fetchSavedSearches: function (ssPoId) {
            this.initCountAndCollection();
            this.mainApp.showLoadingAnimation();
            this.model.setAttribute("nodeDetails", []);
           
             this.type = Constants.SavedSearch;
            ServerUtil.sendRestCall(
                'GET',
                '/topologyCollections/savedSearches/' + ssPoId,
                this.getNodesFromSavedSearches.bind(this, ssPoId),
                this.loadErrorMessage.bind(this, ssPoId, undefined)
            );
        },

        initCountAndCollection: function () {
            this.successResponseCount = 0;
            this.errorResponseCount = 0;
            this.finalColData = [];
        },

        getNodesFromSavedSearches: function (ssPoId, response) {
            var savedSearchInfo = JSON.parse(response);
            this.type = 'savedSearch';

            ServerUtil.sendRestCall(
                'GET',
                '/managedObjects/query?searchQuery=' + encodeURIComponent(savedSearchInfo.searchQuery),
                this.getRootAssociations.bind(this, savedSearchInfo.name, savedSearchInfo.type, savedSearchInfo.poId, false),
                this.loadErrorMessage.bind(this, ssPoId, undefined),
                'json'
            );
            this.savedSearchName = savedSearchInfo.name;
        },

        getNodesFromCollection: function (colPoId, response) {
            if (this.displayErrorMessage) {
                this.displayErrorMessage.detach();
            }
            var name, type;
            if (response.name.indexOf("auto_generated") > -1) {
                name = libLanguage.get('otherObjects');
                type = '';
                /******Workaround added for local mock data and for adding auto generated collections as otherobjects**********/
                for(var i=0;i<this.poIds.length; i++){
                    if(this.poIds[i].poId === colPoId){
                    this.poIds[i].poId = undefined;
                    colPoId = undefined;
                    break;
                    }
                }
                /*********Workaround ends*********************/
            } else {
                name = response.name;
                type = 'Collection';
            }

            if (response.objects && response.objects.length > 0) {
                this.getRootAssociations(name, type, colPoId, true, response.objects);
            }else if (response.contents && response.contents.length > 0) {
                this.getRootAssociations(name, type, colPoId, true, response.contents);
            } else {
                this.mainApp.hideLoadingAnimation();
                this.setPopUpContent(libLanguage.get('emptyCollectionHeader'), libLanguage.get('emptyCollectionContent'), libLanguage.get('emptyCollectionOptContent'));
                this.showPopUp();
            }
            this.collectionsName = name;
        },

        getNodesFromLaunchContext: function (launchContextId, newHash) {
            this.initCountAndCollection();
            this.mainApp.showLoadingAnimation();
            this.model.setAttribute("nodeDetails", []);
           
           
            this.type = '';
            LaunchContext.get(launchContextId, function (data) {
                this.locationController.setLocation(newHash, true, true);
                if (data.contents && data.contents.length > 0) {
                        this.poIds.push({
                                  'type': 'col',
                                  'poId': undefined
                                });
                    this.getRootAssociations(libLanguage.get('otherObjects'), this.type, undefined, true, data.contents);
                } else {
                    this.mainApp.hideLoadingAnimation();
                }
            }.bind(this), function() {
                this.locationController.setLocation(newHash, true, true);
                this.mainApp.hideLoadingAnimation();
            }.bind(this));
        },

        getRootAssociations: function (name, type, poId, isCollection, objects) {
            this.mainApp.showLoadingAnimation();
            if (Object.keys(this.accordions).length > 0) {
                this.validateNext = true;
            }
            this.filterInput = objects;
            this.prepareAccName(name, type, poId);
            // To create a key value pair of type otherObjects or Coll or SS based on type variable.
            this.createNeAndCollectionOrSSObject(type, poId);
            this.poIdsList = [];
            this.filterInput.forEach(function (model) {
                var id;
                if (isCollection) {
                    id = model.id;
                } else {
                    id = model.poId;
                }
                if (!this.hasPoId(id)) {
                    this.poIdsList.push(id);
                }
            }.bind(this));
            this.getRootAssociationsInBatches(poId);
           
           
            this.revalidate();
        },

        getRootAssociationsInBatches: function (poId) {
            var count = 1, nePoIdsList = [];
            this.poIdBatchList = [];
            if (this.poIdsList.length > Constants.REQUEST_BATCH_SIZE) {
                this.poIdsList.forEach(function (poId, index) {
                    nePoIdsList.push(poId);
                    /*
                     * Batches will be triggered in one of the two cases,
                     * 1.) count reaches to batch size,
                     * 2.) index reaches to poIdList length - this condition is for final batch.
                     * */
                    if (count === Constants.REQUEST_BATCH_SIZE || index === (this.poIdsList.length - 1)) {
                        this.poIdBatchList.push(nePoIdsList);
                        nePoIdsList = [];
                        count = 0;
                    }
                    count++;
                }.bind(this));
                 this.triggerNextBatchCall(0, poId);
            } else {
                this.fetchRootAssociations(this.poIdsList, poId);
            }
        },

        triggerNextBatchCall: function (index, poId) {
            this.fetchRootAssociations(this.poIdBatchList[index], poId);
        },

        fetchRootAssociations: function (poIdsList, poId) {
            this.options = {
                type: 'POST',
                url: restUrls.rootAssociationsURL,
                success: this.getPoById.bind(this, poId),
                error: this.onErrorWhileReceivingFilteredData.bind(this, poId),
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({ "poList": poIdsList })
            };

            this.sendRestCall();
        },

        sendRestCall: function () {
            ServerUtil.sendRestCall(
                this.options.type,
                this.options.url,
                this.options.success,
                this.options.error,
                this.options.dataType,
                this.options.contentType,
                this.options.data
            );
        },

        prepareErrorDialog: function () {
            this.collectionErrors = new Dialog({
                type: 'error',
                optionalContent: "",
                buttons: [
                    {
                        caption: libLanguage.get('ok'),
                        color: 'darkBlue',
                        action: function () {
                            this.hidePopup();
                            this.pickNextnetExSet();
                        }.bind(this)
                    }
                ]
            });
        },

        hidePopup: function () {
            this.collectionErrors.hide();
        },

        showPopUp: function () {
            this.collectionErrors.show();
        },

        setPopUpContent: function (header, content, optContent) {
            this.collectionErrors.setHeader(header);
            this.collectionErrors.setContent(content);
            this.collectionErrors.setOptionalContent(optContent);
        },

        prepareAccName: function (name, type, poId) {
            var attr = {
                "name": name,
                "type": type,
                "poId": poId
            };
            this.map[poId] = {name: name, attr: attr};
        },

        hasPoId: function (poId) {
            if (this.poIdsList.indexOf(poId) > -1) {
                return true;
            }
            return false;
        },

        getFdns: function (response) {
            var fdns = [];
            response.forEach(function (mo) {
                var fdn;
                if (mo.fdn === undefined) {
                    fdn = mo.moType + "=" + mo.moName;
                    if (mo.parentRDN.length > 0) {
                        fdn = mo.parentRDN + "," + fdn;
                    }
                } else {
                    fdn = mo.fdn;
                }
                fdns.push(fdn);
            });
            return fdns;
        },

        getPoById: function (poId, response) {
            this.clearSetTimeout();
            this.mainApp.getEventBus().publish("detachRetryNotification");
            this.retryCount = 0;
            if (this.displayErrorMessage) {
                this.displayErrorMessage.detach();
            }

            var payload = {
                "attributeMappings": [
                    {
                        "moType": "NetworkElement",
                        "attributeNames": ["neType", "platformType"]
                    }
                ],
                "defaultMappings": ["syncStatus"],
                "poList": this.getPoList(response)
            };

            this.options = {
                type: 'POST',
                url: restUrls.getPosByPoIds,
                success: this.prepareCollection.bind(this, false, poId),
                error: this.onErrorWhileReceivingFilteredData.bind(this, poId),
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(payload)
            };
            this.sendRestCall();

            if(response.length > 0){
                for(var i = 0; i < response.length;i++) {
                    this.supportedNes.push(response[i].name);
                }
                this.revalidate();
            }
            this.view.showAccordionHolderDiv();
            this.validateNext = true;
            this.revalidate();
        },

        getPoList: function (response) {
            var poList = [];
            response.forEach(function (model) {
                poList.push(model.id);
            });
            return poList;
        },

        getFdnList: function (supportedNodes) {
            var data = [];
            Object.keys(supportedNodes).forEach(function (moType) {
                for (var i = 0; i < supportedNodes[moType].length; i++) {
                    data.push(supportedNodes[moType][i]);
                }
            }.bind(this));
            return data;
        },

        prepareCollection: function(isNodesFromOtherApps, poId, response) {
            var neListForCollOrSS = [];
            for (var i = 0; i < response.length; i++) {
                var platformType, neType, networkElementFdn, nodeName, syncStatus;
                if (isNodesFromOtherApps) {
                    platformType = response[i].platformType;
                    neType = response[i].neType;
                    networkElementFdn = response[i].networkElementFdn;
                    nodeName = response[i].name;
                    syncStatus = response[i].syncStatus;
                } else {
                    platformType = response[i].attributes? response[i].attributes.platformType : '';
                    neType = response[i].attributes? response[i].attributes.neType : '';
                    networkElementFdn = response[i].moType + '=' + response[i].moName;
                    nodeName = response[i].moName;
                    syncStatus = response[i].cmSyncStatus;
                }
                var data = {
                    "poId": response[i].poId,
                    "name": nodeName,
                    "networkElementFdn": networkElementFdn,
                    "platformType": platformType,
                    "neType": neType,
                    "syncStatus": syncStatus
                };
                if (!this.isFdnExistInCollection(poId,data.networkElementFdn)) {
                    data.activeSoftware = Constants.loading;
                    neListForCollOrSS.push(data);
                    this.finalColData.push(data);
                }
                if(this.type === Constants.otherObjects) {
                    this.finalCollection[this.type]= this.finalColData;
                } else {
                    this.finalCollection[poId]= this.finalColData;
                }
            }
                this.checkNesAndCollectionObject(neListForCollOrSS, isNodesFromOtherApps, poId);
        },

        proceedToPrepareAcc: function(){
            for(var poId in this.finalCollection){
                if(poId === "otherObjects" ){
                    poId = undefined;
                }
                this.prepareAccordion(poId);
            }
            this.verifyAccordionToggle();
        },

        removeFinalColData: function (nodesForRemove,isOtherObject) {
            if(isOtherObject ){
                for (var networkElement in nodesForRemove[undefined]) {
                  for(var i = 0; i < this.finalCollection.otherObjects.length; i++) {
                    if(networkElement === this.finalCollection.otherObjects[i].networkElementFdn.split("=")[1]) {
                      this.finalCollection.otherObjects.splice(i, 1);
                    }
                  }
                }
            }else{
                for (var poId in nodesForRemove) {
                    delete  this.finalCollection[poId];
                }
            }

        },

        checkNesAndCollectionObject: function (neListForCollOrSS, isNodesFromOtherApps, poId) {
            if (neListForCollOrSS.length > 0) {
                if (this.type === Constants.otherObjects) {
                    this.neAndCollectionObject[this.type].neList = this.neAndCollectionObject[this.type].neList.concat(neListForCollOrSS);
                } else {
                    this.neAndCollectionObject[poId].neList = this.neAndCollectionObject[poId].neList.concat(neListForCollOrSS);
                }
            }
            this.successResponseCount++;
            this.checkToLoadData(poId);
        },

        checkToLoadData: function (poId) {

            if (this.poIdsList === undefined ||(this.poIdsList && (this.poIdsList.length <= Constants.REQUEST_BATCH_SIZE)) || ((this.poIdBatchList.length === this.successResponseCount) && (this.errorResponseCount === 0))) {
                this.mainApp.hideLoadingAnimation();
                this.requestCount = 0;
                this.loadData(poId);
                this.initCountAndCollection();
            } else {
              this.triggerNextBatchCall(this.successResponseCount, poId);
            }
          },

        displayError: function (errorMessage) {
            if(this.displayErrorMessage){
              this.displayErrorMessage.detach();
            }
            if (errorMessage) {
              this.displayErrorMessage.showMessage(true, errorMessage.userMessage.body, "error", errorMessage.userMessage.title);
              this.mainApp.hideLoadingAnimation();
              this.displayErrorMessage.attachTo(this.view.getElement());
            }
        },

        isFdnExistInCollection: function (poId,fdn) {
            for (var i in this.finalCollection[poId]) {
                if (this.finalCollection[poId][i].networkElementFdn === fdn) {
                    return true;
                }
            }
            return false;
        },

        loadData: function (poId) {
            this.loadCounter++;
            if (this.displayErrorMessage) {
                this.displayErrorMessage.detach();
            }
            this.model.setAttribute("detachNotification", "detach");

            if(this.poIds.length===this.loadCounter) {
                this.proceedToPrepareAcc();
            } else {
                this.pickNextnetExSet();
            }
        },

        pickNextnetExSet: function () {
            this.mainApp.hideLoadingAnimation();
            if (this.dialogBox) this.dialogBox.hide();
            this.startCount++;
            if (this.startCount !== this.poIds.length && this.poIds.length !== 0 && this.poIds[this.startCount]){
                if (this.poIds[this.startCount].type === 'col') {
                    this.fetchCollections(this.poIds[this.startCount].poId);
                } else {
                    this.fetchSavedSearches(this.poIds[this.startCount].poId);
                }
            } else {
                this.verifyAccordionToggle();
                this.loadData();
            }
        },

        cancelDialogBox: function () {
            this.dialogBox.hide();
        },

        prepareAccordion: function (poId) {
            var accName = this.map[poId].attr.type + '_' + this.map[poId].attr.name;
            if (this.accordions[accName] !== undefined && this.map[poId].attr.name !== Constants.OtherObjects) {
                this.updateCollectionAccordion(accName, poId);
            } else if (this.map[poId].attr.name === libLanguage.get('otherObjects')) {
                this.type = Constants.otherObjects;
                this.createOrUpdateOtherAccordion(accName, poId);
            } else {
                this.createCollectionAccordion(accName, poId);
            }
            this.revalidate();
        },

        updateCollectionAccordion: function (accName, poId) {
            this.accordions[accName].detach();
            this.accordions[accName] = undefined;
            this.createAccordion(accName, false, poId);
        },

        createCollectionAccordion: function (accName, poId) {
            this.createAccordion(accName, false, poId);
        },

        createOrUpdateOtherAccordion: function (accName, poId) {
            if (this.accordions[accName] !== undefined) {
                this.updateOtherAccordion(accName,poId);
            } else {
                this.createAccordion(accName, true, poId);
            }
        },

        updateOtherAccordion: function (accName,poId) {
            this.accordions[accName].updateTable(this.finalCollection[this.type]);
            this.reSetAccHeader(this.accordions[accName], accName, this.accordions[accName].getContent().getTableData().length);
        },

        createAccordion: function (accName, isOtherObject, poId) {
            var accContent;
            if(isOtherObject){
                accContent = new createTable(this.finalCollection[this.type], isOtherObject, this.mainApp.getEventBus(), accName);
            }else{
                accContent = new createTable(this.finalCollection[poId], isOtherObject, this.mainApp.getEventBus(), accName);
            }
            if(accContent.options.length>0){
                this.accordions[accName] = new customAccordion(this.map[poId].attr, accContent);
//                this.accordions[accName].getDeleteIcon().addEventHandler('click', this.deleteAccHandler.bind(this, accName, poId));
            if (isOtherObject) {
                this.isOtherObject = {
                    'accObj': this.accordions[accName],
                    'accName': accName,
                    'accContent': accContent
                };
            }
                this.view.showAccordionHolderDiv();
                this.accordions[accName].attachTo(this.view.getAccordion());
            }
            this.whenNodesModified();
        },

        whenNodesModified: function(){
            this.model.setAttribute("isFirstStepModified", true);
            if(this.isBackToFirstStep){
                isJobNameValid = false;
            }
            this.revalidate();
            if(!isJobNameValid && this.isBackToFirstStep){
                isJobNameValid = true;
                this.model.setAttribute("nodesModified", true);
                this.revalidate();
            }
        },

        clearSelection: function () {
            if (this.isOtherObject && this.isOtherObject.accObj) {
                this.isOtherObject.accObj.content.clearSelection();
            }
        },

        updateTableData: function () {
            if (this.isOtherObject) {
                this.isNenameFound = true;
                var accObj = this.isOtherObject.accObj;
                var accName = this.isOtherObject.accName;
                var accContent = this.isOtherObject.accContent;
                accContent.removeSelectedNodes();
                this.reSetAccHeader(accObj, accName, accContent.getTableData().length);
//                this.checkForUpgradeJob();
            }
        },

        reSetAccHeader: function (accObj, accName, length) {
            if (length === 0) {
                this.deleteAccHandler(accName, Constants.OtherObjects);
            } else {
                this.resetNodeCountInAccordion(accObj, length);
            }
            this.whenNodesModified();
        },

        /*
         * Detaches the accordion from DOM and deletes the accordion instance.
          * accName: to detach and delete the accordion from DOM,
          * poId: used to manipulate the neAndCollectionObject.
        * */
        deleteAccHandler: function(accName, poId, event) {
            if (event) {
                event.stopPropagation();
            }
            var poIdToBeDeleted = poId;
            if (this.accordions[accName]) {
                this.isNenameFound = true;
                this.updateUnSupportedNes(this.accordions[accName],true,poId);
                this.accordions[accName].detach();
                if (this.accordions[accName].content.isOtherAccordian()) {
                    this.mainApp.getEventBus().publish('topsection:leavecontext');
                    /*
                     * For Un-grouped nodes we store with key "otherObjects", so modifying the poIdToBeDeleted to otherObjects incase user
                     * performs Un-grouped nodes deletion.
                     * */
                     poIdToBeDeleted = Constants.otherObjects;
                }
                delete this.accordions[accName];
            }
            if(this.neAndCollectionObject[poIdToBeDeleted]) {
                delete this.neAndCollectionObject[poIdToBeDeleted];
            }
            this.verifyAccordionToggle(true);
            this.whenNodesModified();
            this.hideSubCompoentDetails();
            this.revalidate();
        },

        resetNodeCountInAccordion: function (acc, length) {
            this.updateUnSupportedNes(acc,false);
            acc.getElement().find('span').setText(" (" + i18nNumber.getNumber(length) + ") ");
        },

        updateUnSupportedNes: function(acc,fromDelAccHandler,poId) {
            for(var j=this.unSupportedNes.length-1; j >=0 ; j--) {
                var checkNeName = this.unSupportedNes[j];
                var neNameAvailable = false;
                for(var i = 0; i < acc.content.data.length; i++) {
                    if(checkNeName === acc.content.data[i].name) {
                        neNameAvailable = true;
                        break;
                    }
                }
                var verify = this.isNotAvailableInAnyOtherPoId(checkNeName,poId);
                if(neNameAvailable && fromDelAccHandler && verify) {
                    delete this.unSupportedNesByPoId[poId];
                    this.unSupportedNes.splice(j,1);
                } else if(!fromDelAccHandler && !neNameAvailable && verify) {
                    this.unSupportedNes.splice(j,1);
                }
            }
        },

        verifyAccordionToggle: function (isDelete) {
            var accordionsLength = Object.keys(this.accordions).length;
            if (!isDelete && accordionsLength > 1) {
                this.expandOrCollapseFirstAccordion(false);
            } else if (accordionsLength === 1  && ((Object.values(this.accordions)[0].attr.name).startsWith(Constants.OtherObjects)) &&
                    ((Object.values(this.accordions)[0].attr.name).endsWith(Constants.OtherObjects))) {
                this.expandOrCollapseFirstAccordion(true);
            }
//            appName  = this.mainApp.appName.split("/")[2];
//            if(appName === "createupgradejob" || appName === "createbackupjob"  || appName === "backuphousekeeping") {
//                  this.prepareGSMComponentDetails();
//            } else {
//                  this.oldJobActivities();
//            }
        },

        hideSubCompoentDetails: function() {
            if (this.model.getAttribute("nodeDetails").length === 0 ) {
                this.view.hideSelectionLoaders();
                this.prepareListItems(false);
                this.selectionListWidget.setItems(this.items);
            }
        },

        expandOrCollapseFirstAccordion: function (isExpand) {
            for (var index in this.accordions) {
                var firstAccordion = this.accordions[index].accordion;
                if (isExpand) {
                    this.expandFirstAccordion(firstAccordion);
                } else {
                    this.collapseFirstAccordion(firstAccordion);
                }
                break;
            }
        },

        expandFirstAccordion: function (accordion) {
            if (!accordion.isExpanded()) {
                accordion.trigger("expand");
            }

        },

        collapseFirstAccordion: function (accordion) {
            if (accordion.isExpanded()) {
                accordion.trigger("collapse");
            }

        },

//        /*
//         * Once response is received from /jobconfiguration, below function formats it and
//         * separates the required attributes to perform necessary operations
//         * */
//        formatJobConfigurationResponse: function (response) {
//            this.isOldJob = true;
//            this.jobTemplateInfo = JSON.parse(response);
//
//            //Populate the job name and it's description in the first step of the wizard.
//            this.populateJobName(this.jobTemplateInfo.jobName + Constants.DUPLICATE);
//            this.view.setJobDescription(this.jobTemplateInfo.description);
//            this.view.getJobDescription().trigger("change");
//            this.mainApp.hideLoadingAnimation();
//            this.startCount = 0;
//            this.endCount = 0;
//            this.poIds = [];
//            this.loadCounter=0;
//            this.response5gCacheParent = {};
//            this.response4gCacheParent = {};
//            //Retrieve individual network elements from the job template info attribute and get the network elements data.
//            var networkElements = this.jobTemplateInfo.neNames;
//            if (networkElements && networkElements.length > 0) {
//                this.poIds.push({
//                  'type': 'col',
//                  'poId': undefined
//                });
//            }
//
//            //Get the collection ids and retrieve the collection's network elements data.
//            this.jobTemplateInfo.selectedNEs.collectionNames.forEach(function (poid) {
//                this.poIds.push({
//                    'type': 'col',
//                    'poId': poid
//                });
//            }.bind(this));
//
//            this.jobTemplateInfo.selectedNEs.savedSearchIds.forEach(function (poid) {
//                this.poIds.push({
//                    'type': 'ss',
//                    'poId': poid
//                });
//            }.bind(this));
//
//
//            if (this.jobTemplateInfo.selectedNEs.neWithComponentInfo) {
//                this.jobTemplateInfo.selectedNEs.neWithComponentInfo.forEach(function(component) {
//                    for (var i = 0; i<component.selectedComponenets.length; i++ ) {
//                        this.oldJobComponentList.push(component.selectedComponenets[i]);
//                    }
//                }.bind(this));
//            }
//
//            //AXE nodes Duplicate Job have components with uploadbackup option
//            if(this.jobTemplateInfo.selectedNEs.neTypeComponentActivityDetails){
//                this.jobTemplateInfo.selectedNEs.neTypeComponentActivityDetails.forEach(function(comp){
//                    for(var q = 0; q<comp.componentActivities.length; q++){
//                        if(comp.componentActivities[q].activityNames.indexOf("uploadbackup") > -1){
//                            this.oldJobComponentActivities.push(comp.componentActivities[q].componentName);
//                        }
//                    }
//                }.bind(this));
//            }
//            this.model.setAttribute("oldJobComponentActivities", this.oldJobComponentActivities);
//
//            this.neLevelPropertiesObj = this.getNeLevelPropertiesObject(this.jobTemplateInfo.neJobProperties);
////            this.oldJobActivityObject = this.getOldJobActivitiesObj(this.jobTemplateInfo.jobParams);
//            //Check the type of the job
//            switch (this.jobTemplateInfo.jobType) {
////                case Constants.UPGRADE:
////                    this.verifyUPExistance();
////                    break;
//
////                case Constants.RESTORE:
////                    //Find unavailable backups and implement to display the data of unavailable backups.
////                    this.verifyBackupUnavailability();
////                    break;
//
//                default:
//                if (this.poIds.length > 0) {
//                    if (this.poIds[0].type === 'col') {
//                        this.fetchCollections(this.poIds[0].poId);
//                    } else {
//                        this.fetchSavedSearches(this.poIds[0].poId);
//                    }
//                }
//
//            }
//        },

    checkToDuplicate: function (supportedNes) {
            if (this.isNeNotExists || this.isCollectionNotExists || this.isSavedSearchNotExists || this.isPreviousUPNotExists ) {
                this.createUnavailableDataDialogueBox(supportedNes);
            }else{
                this.proceedToDuplicateJobCreation(false,supportedNes);
            }
    },

    getNodes: function () {
        var neFdnsList = [];
        var networkElements = this.jobTemplateInfo.selectedNEs.networkElements;
        networkElements.forEach(function (neObject) {
            neFdnsList.push(neObject.networkElementFdn);
        });
        return neFdnsList;
    },

    //This is to retrieve the activities details and return the it to the caller.
    getActivitiesObject: function (jobParams) {
        var activitiesObj = {};
         var platformWithNeTypeMapping = this.getPlatformWithNeTypeMapping();
        if (jobParams && jobParams.length > 0) {
            for (var i in jobParams) {
                var neTypeActivities = {};
                if(this.isAXENeTypeExist(jobParams[i].neType, platformWithNeTypeMapping) && this.isAxePlatform) {
                   neTypeActivities.activityInfoList = jobParams[i].activityInfoList;
                    for(var k=0; k<jobParams[i].jobProperties.length; k++) {
                        neTypeActivities[jobParams[i].jobProperties[k].key] = jobParams[i].jobProperties[k].value;
                   }             
                } else {
                    var activityInfoList = jobParams[i].activityInfoList, jobProperties = jobParams[i].jobProperties;
                    //Iterate over activity info list and add the key, value paris to neTypeActivities object.
                    for (var j in activityInfoList) {
                        var activityJobProperties = activityInfoList[j].jobProperties;
                        if (activityJobProperties && activityJobProperties.length > 0) {
                            for (var m in activityJobProperties) {
                                neTypeActivities[activityJobProperties[m].key] = activityJobProperties[m].value;
                            }
                        }
                        neTypeActivities[activityInfoList[j].activityName] = activityInfoList[j].scheduleType;
                    }

                    //Iterate over job properties list and add key, value paris to neTypeActivities object.
                    for (var l in jobProperties) {
                        neTypeActivities[jobProperties[l].key] = jobProperties[l].value;
                    }
                }
                activitiesObj[jobParams[i].neType] = neTypeActivities;
            }
        }
        return activitiesObj;
    },

    isAXENeTypeExist: function(neType, platformWithNeTypeMapping) {
        var isFound = false;
        for(var platform in platformWithNeTypeMapping) {
            if(platform === 'AXE' && platformWithNeTypeMapping[platform].indexOf(neType) > -1) {
                isFound = true;
            }
        }
        return isFound;
    },

    getPlatformWithNeTypeMapping: function() {       
        var neDetails = this.model.getAttribute("nodeDetails");
        var platformWithNeTypeMapping = {};
        for (var node in neDetails) {
            if(platformWithNeTypeMapping[neDetails[node].platformType]) {
               if(platformWithNeTypeMapping[neDetails[node].platformType].indexOf(neDetails[node].neType) === -1) {
                    platformWithNeTypeMapping[neDetails[node].platformType].push(neDetails[node].neType);
               }
            } else {
              platformWithNeTypeMapping[neDetails[node].platformType] = [];
              platformWithNeTypeMapping[neDetails[node].platformType].push(neDetails[node].neType);
            }

        }
        return platformWithNeTypeMapping;
    },

    getNeLevelPropertiesObject: function (neJobProperties) {
        if (neJobProperties) {
            var neLevelProperties = {};
            for (var i in neJobProperties) {
                var neObj = neJobProperties[i];
                neLevelProperties[neObj.neName] = {};
                var jobProperties = neObj.jobProperties, count = 0;
                for (var j = 0; j < jobProperties.length; j++) {
                    var propertiesObj = jobProperties[j], key, value;
                    /*
                     * As we don't have access to platform or ne type at this time, preparing a generic object which
                     * can be used at the time of comparing each backup item in select back up step of restore backup job,
                     * */
                    var keyFromProperties = propertiesObj.key;
                    if ((keyFromProperties === Constants.CV_LOCATION) || (keyFromProperties === Constants.BACKUP_LOCATION)) {
                        key = Constants.BACKUP_LOCATION;
                        value = propertiesObj.value;
                        count++;
                    } else if ((keyFromProperties === Constants.CV_NAME) || (keyFromProperties === Constants.BACKUP_NAME)) {
                        key = Constants.BACKUP_NAME;
                        value = propertiesObj.value;
                        count++;
                    }
                    if (key !== undefined) {
                        neLevelProperties[neObj.neName][key] = value;
                    }
                    //As we need only two key, value pairs for this use case, we are breaking the for loop with a count variable.
                    if (count === 2) {
                        break;
                    }
                    neLevelProperties[neObj.neName][propertiesObj.key] = propertiesObj.value;
                }
            }
            return neLevelProperties;
        }
    },

    findUnavailableNodes: function (requestData, supportedNodes) {
        var supportedNodesLength = supportedNodes.length;
        requestData.forEach(function (requestNEName) {
            for (var i = 0; i < supportedNodesLength; i++) {
                requestNEName = requestNEName.split('__')[0];
                requestNEName = requestNEName.split('-AXE_CLUSTER')[0];
                if (supportedNodes[i].name === requestNEName) {
                    break;
                }
            }
            if (i === supportedNodesLength) {
                this.isNeNotExists = true;
                this.unavailableNEs.push({
                    nodeName: requestNEName,
                    result: libLanguage.get('unavailable')
                });
            }
        }.bind(this));
         this.checkToDuplicate(supportedNodes);
    },

    //OK!!!!
    findUnavailableCollectionsOrSavedSearches: function (poId, response) {
        var responseText = response.getResponseText();
        if (responseText) {
            if (responseText.indexOf("Collection does not exist") > -1) {
                this.isCollectionNotExists = true;
            } else if (responseText.indexOf("Saved Search does not exist") > -1) {
                this.isSavedSearchNotExists = true;
            }
        }
        this.checkToDuplicate();
    },

    createUnavailableDataDialogueBox: function (supportedNes) {
        /*
         * setting the header and footer content for dialog box, based on the comefrom value.
         * If user / operator dealing with duplicate job, else part will be executed
         * or if user / operator is dealing with new job creation from job details application, if part will be executed.
         * */
        var continueButton, headerMessage, headerContent;
        if (this.isComeFromJobDetails) {
            continueButton = {
                caption: libLanguage.get('proceed'),
                action: this.proceedWithNewJobCreation.bind(this,supportedNes),
                color: 'darkBlue'
            };
            headerMessage = libLanguage.get('unavailableNodesInfo');
            headerContent = libLanguage.get('nodesUnavailableMessage');
        } else {
            continueButton = {
                caption: libLanguage.get('duplicate').slice(1),
                action: this.proceedToDuplicateJobCreation.bind(this,true,supportedNes),
                color: 'darkBlue'
            };
            headerMessage = libLanguage.get('dupJobResults');
            headerContent = libLanguage.get('someDataUnavailable');
        }
        /*
         * Data preparation for the dialog box, if there is any error scenario occurs. Error scenarios includes,
         * 1.) Any node / collection / saved search is removed from the system - applicable to all 4 create jobs,
         * */
        this.unavailableJobData = new unavailableJobDataDialog({
            networkElements: this.unavailableNEs,
            isCollectionNotExists: this.isCollectionNotExists,
            isSavedSearchNotExists: this.isSavedSearchNotExists,
            packages: [],
            backups: [],
            eventBus: this.mainApp.getEventBus(),
            headerContent: headerContent,
            supportedNes:supportedNes
        });
        /*
         * Create a dialog box, pass the data to it for displaying unavailable nodes, a generic message for unavailable
         * collections or saved searches, unavailable packages and backups.
         * */
        if (this.unavailableDataDialog) {
            this.unavailableDataDialog.destroy();
        }

        this.unavailableDataDialog = new Dialog({
            type: 'warning',
            header: headerMessage,
            content: this.unavailableJobData,
            buttons: [
                continueButton,
                {
                    caption: libLanguage.get('cancel'),
                    action: this.hideUnavailableDataDialog.bind(this),
                    color: 'grey'
                }
            ]
        });
        this.unavailableDataDialog.show();
        this.unavailableJobData.setDialogData();
    },

    resetUnavailableFlags: function(){
        this.isCollectionNotExists = false;
        this.isSavedSearchNotExists = false;
        this.isPreviousUPNotExists = false;
        this.isNeNotExists = false;
        this.unavailableNEs = [];
    },

    proceedToDuplicateJobCreation: function (isFromUnavailableDialogBox,supportedNes) {
        if (this.unavailableDataDialog) {
            this.unavailableDataDialog.hide();
        }
        if(isFromUnavailableDialogBox){
            if(this.isPreviousUPNotExists ){
                if (this.poIds.length > 0) {
                    if (this.poIds[0].type === 'col') {
                        this.fetchCollections(this.poIds[0].poId);
                    } else {
                        this.fetchSavedSearches(this.poIds[0].poId);
                    }
                }
            }else if(this.isNeNotExists){
                this.validateNodes(supportedNes);
            }else{
                this.pickNextnetExSet();
            }
        this.resetUnavailableFlags();
        } else{
            if(supportedNes){
                this.validateNodes(supportedNes);
            }else {
                if (this.poIds.length > 0) {
                    if (this.poIds[0].type === 'col') {
                        this.fetchCollections(this.poIds[0].poId);
                    } else {
                        this.fetchSavedSearches(this.poIds[0].poId);
                    }
                }
            }

        }

        /*
         * For now this is used only for restore backup use-case, in future, this might be extended for other use-cases as well.
         * Publish backup (names and their locations) details.
         * */
        if (this.neLevelPropertiesObj) {
            //Publish the formatted ne level properties to other wizard step.
            this.mainApp.getEventBus().publish('detailsNodeSelection:neLevelProperties', this.neLevelPropertiesObj);
        }

        //Publish the schedule mode and schedule configurations (if there are any) of previous job.
        if(this.jobTemplateInfo){
            this.mainApp.getEventBus().publish('detailsNodeSelection:scheduleMode', this.jobTemplateInfo.mode, this.jobTemplateInfo.scheduleJobConfiguration, this.jobTemplateInfo.jobParams);
            this.mainApp.getEventBus().publish('detailsNodeSelection:ActivitySchedule', this.jobTemplateInfo.jobParams);
            this.mainApp.getEventBus().publish('detailsNodeSelection:NeJobProperties', this.jobTemplateInfo.neJobProperties);
            this.mainApp.getEventBus().publish('detailsNodeSelection:JobType', this.jobTemplateInfo.jobType);
        }
    },

    hideUnavailableDataDialog: function () {
        if (this.unavailableDataDialog) {
            this.unavailableDataDialog.hide();
            this.unavailableDataDialog.destroy();
        }
        this.mainApp.hideLoadingAnimation();
        window.location.hash = sessionStorageUtil.getSessionStorageAttribute("navigateTo");
    },

    proceedWithNewJobCreation: function (supportedNes) {
        if (this.unavailableDataDialog) {
            this.unavailableDataDialog.hide();
            this.unavailableDataDialog.destroy();
        }
        if(supportedNes && supportedNes.length>0){
        this.validateNodes(supportedNes);
        }
    },

    /*
    * Resets the neAndCollectionObject in model to it's initial value when returned from network explorer,
    * This will be called if user is navigating to import software packages from 2nd step of create upgrade job.
    * */
    resetNeCollectionObject: function () {
        this.model.setAttribute("neAndCollectionObject", this.neAndCollectionObject);
    },

    /*
    * Based on this.type variable value, this function will initializes / updates a key value pair in this.neAndCollectionObject
    * */
    createNeAndCollectionOrSSObject: function(type, poId) {
        this.type = Constants.otherObjects;
        switch (type) {
            case Constants.Collection:
                this.type = Constants.Collection;
                break;
            case Constants.SavedSearch:
                this.type = Constants.SavedSearch;
                break;
            default:
                poId = Constants.otherObjects;
        }
        /*
         * If the key value pair is already present with a particular poId, it's neList will be retrieved.
         * */
        if (this.neAndCollectionObject[poId]) {
            this.neAndCollectionObject[poId].type = this.type;
        } else {
            this.neAndCollectionObject[poId] = {
                neList: [],
                type: this.type
            };
        }
    },

    onScopingPanelSelect: function(scope) {
        this.startCount = 0;
        this.endCount = 0;
        this.loadCounter=0;
        this.response5gCacheParent = {};
        this.response4gCacheParent = {};
        this.poIds = [];
        this.responseCache = {};
        this.responseCacheStorage = {};
        this.finalCollection = {};
        if (scope.collections.length > 0) {
            scope.collections.forEach(function(poid) {
                this.poIds.push({
                    'type': 'col',
                    'poId': poid
                });
            }.bind(this));
            this.fetchCollections(this.poIds[0].poId);
        }
        if (scope.networkObjects.length > 0) {
            this.poIds.push({
                'type': 'col',
                'poId': undefined
            });
            this.fetchNetworkObjects(scope.networkObjects);
        }
        if (scope.savedSearches.length > 0) {
            scope.savedSearches.forEach(function(poid) {
                this.poIds.push({
                    'type': 'ss',
                    'poId': poid
                });
            }.bind(this));
            this.fetchSavedSearches(this.poIds[0].poId);
        }
    },

    fetchNetworkObjects: function(networkObjects) {
        var response = {
            name: 'auto_generated_',
            objects: networkObjects.map(function(poId) {
                return {
                    id: poId,
                    attributes: {}
                };
            })
        };
        this.initCountAndCollection();
        this.mainApp.showLoadingAnimation();
        this.model.setAttribute("nodeDetails", []);
        this.type = 'collection';
        this.getNodesFromCollection(undefined, response);
    },

    getAddNodesItem: function() {
        return {name: libLanguage.get('addNodesMsg'), value: 'addNodes', selected: false};
    },

    getComponentsItem: function() {
        return {name: libLanguage.get('subComponents'), value: 'components', selected: false};
    },

    prepareListItems: function(isComponents) {
        this.items = [];
        this.items.push(this.getAddNodesItem());
        if(isComponents) {
            this.items.push(this.getComponentsItem());
            this.showInfoMsg();
        } else {
            this.hideInfoMsg();
        }
        this.items[0].selected = true;
    },

    selectionList: function() {
        this.prepareListItems(false);
        this.selectionListWidget = new SelectionList({
            items: this.items
        });
        this.selectionListWidget.addEventHandler("change", function() {
            var selectedItems = this.selectionListWidget.getSelected();
            if(selectedItems.length === 1) {
                this.lastSelectedItem = this.selectionListWidget.getSelected();
            } else if(selectedItems.length === 0) {
                if(this.lastSelectedItem) {
                    for(var j=0; j<this.items.length; j++) {
                        if(this.lastSelectedItem && this.lastSelectedItem[0].value === this.items[j].value) {
                            this.items[j].selected = true;
                        }
                    }
                } else {
                    this.items[0].selected = true;
                }
                this.selectionListWidget.setItems(this.items);
            }
            if(selectedItems.length === 1) {
                if(selectedItems[0].value === 'addNodes') {
                    this.view.showTopologySection();
                    this.view.hideComponentContent();
                } else {
                    this.view.showComponentContent();
                    this.view.hideTopologySection();
                    if(!this.subComponentsWidget.isAttached()) {
                        this.subComponentsWidget.attachTo(this.view.getComponentContent());
                    }
                }

            } else if(selectedItems.length > 1) {
                this.notification = new Notification({
                    icon: 'warning',
                    color: 'yellow',
                    showCloseButton: true,
                    showAsToast: true,
                    autoDismiss: false,
                    showAsGlobalToast: true,
                    label: libLanguage.get('multipleSelection')
                });
            }
            this.mandatoryLabel();
        }.bind(this));
        this.selectionListWidget.attachTo(this.view.getSelectionWidgetHolder());
//        this.view.getSelectionWidgetHolder().find(".elWidgets-SelectionList-label").setAttribute("class", "elWidgets-SelectionList-label eaNpamlibrary-wJobdetails-text-required");
//        this.view.getSelectionWidgetHolder().find(".elWidgets-SelectionList-label").setAttribute("class", "elWidgets-SelectionList-label eaNpamlibrary-wJobdetails-text-required eaNpamlibrary-wJobdetails-noHighlight");
//        this.view.getSelectionWidgetHolder().find(".elWidgets-SelectionList-item").setAttribute("class", "elWidgets-SelectionList-item eaNpamlibrary-wJobdetails-noBorder");
    },

    mandatoryLabel: function () {
        var item = document.getElementsByClassName("elWidgets-SelectionList-item");
        var label = document.getElementsByClassName("elWidgets-SelectionList-label");
        if (item.length > 1) {
            if(item[1].className === "elWidgets-SelectionList-item"){
                item[0].setAttribute("class", "elWidgets-SelectionList-item elWidgets-SelectionList-item_highlighted");
            }
            item[0].childNodes[1].setAttribute("class", "elWidgets-SelectionList-label eaNpamlibrary-wJobdetails-text-required");
            item[1].childNodes[1].setAttribute("class", "elWidgets-SelectionList-label eaNpamlibrary-wJobdetails-text-required");
        } else {
            item[0].setAttribute("class", "elWidgets-SelectionList-item eaNpamlibrary-wJobdetails-noBorder");
            label[0].setAttribute("class", "elWidgets-SelectionList-label eaNpamlibrary-wJobdetails-text-required eaNpamlibrary-wJobdetails-noHighlight");
        }
    },

    createListBuilder: function() {
        if (this.subComponentsWidget){
            this.subComponentsWidget.detach();
        }
        this.subComponentsWidget = new SubComponentsWidget({
            model: this.model,
            nodeTopology : this.nodeTopology,
            isOldJob: this.isOldJob,
            oldJobComponentList: this.oldJobComponentList,
            appName: this.mainApp.appName.split("/")[2],
            eventBus: this.mainApp.getEventBus()
        });
    },

    validateComponent: function(componentObj,nodeTopology) {
        this.nodeTopology = nodeTopology;
        for (var i = 0; i < this.nodeTopology.length; i++) {
            if (this.nodeTopology[i].components.length > 0) {
            this.isNenameFound = false;
                var nodeName = this.nodeTopology[i].nodeName;
                var neType = this.nodeTopology[i].neType;
                if (componentObj[neType] && Object.keys(componentObj[neType].neNames).indexOf(nodeName) > -1){
                    this.isNenameFound = true;
                }
                if (!this.isNenameFound){
                    break;
                }
            }
        }
        this.revalidate();
    },

    showInfoMsg: function (label) {
        if (this.notificationWidget ) {
            this.notificationWidget.detach();
        }
        this.notificationWidget = new Notification({
            icon: 'infoMsgIndicator',
            color: 'paleBlue',
            autoDismiss: false,
            showCloseButton: false
        });
        if(appName === "createupgradejob"){
            this.notificationWidget.setLabel(libLanguage.get('UpgSubComponentsMsg'));
        } else {
            this.notificationWidget.setLabel(libLanguage.get('BkpSubComponentsMsg'));
        }
        this.notificationWidget.attachTo(this.view.getSelectionHeaderNotification());
    },

    hideInfoMsg: function() {
        if (this.notificationWidget ) {
            this.notificationWidget.detach();
        }
    }
});
});
