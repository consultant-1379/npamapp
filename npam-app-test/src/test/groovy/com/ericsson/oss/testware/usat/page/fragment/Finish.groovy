package com.ericsson.oss.testware.usat.page.fragment

import org.openqa.selenium.support.FindBy
import org.openqa.selenium.WebElement

class Finish implements PageFragment{
    @FindBy(className = "eaNpamlibrary-finish-jobname")
    private WebElement jobName;

    @FindBy(className = "eaNpamlibrary-finish-desc")
    private WebElement jobDescription;

    @FindBy(className = "eaNpamlibrary-finish-schedule")
    private WebElement scheduleMsg;

    @FindBy(className = "eaNpamlibrary-finish-nodes")
    private WebElement nodes;

    @FindBy(className = "eaNpamlibrary-finish-scope")
    private WebElement selectedScope;

    @FindBy(className = "eaNpamlibrary-finish-startdate")
    private WebElement startDate;

    @FindBy(className = "eaNpamlibrary-finish-cred")
    private WebElement credType;
    
    @FindBy(className = "eaNpamlibrary-finish-repeattype")
    private WebElement repeattype;

    @FindBy(className = "eaNpamlibrary-finish-repeatcount")
    private WebElement repeatcount;

    @FindBy(className = "eaNpamlibrary-finish-end")
    private WebElement end;

    public String getJobName(){
        return jobName.getText();
    }

    public String getNumbersOfSelectedNodes() {
        return nodes.getText()
    }

    public String getSelectedScope() {
        return selectedScope.getText()
    }
    public String getJobDescription() {
        return jobDescription.getText()
    }

    public String getScheduleMsg(){
        return scheduleMsg.getText();
    }

    public String getJobStartDate() {
        return startDate.getText()
    }

    public String getCredentialsMsg() {
        return credType.getText()
    }

    public String getJobRepeats() {
        return repeattype.getText()
    }

    public String getJobRepeatEvery() {
        return repeatcount.getText()
    }

    public String getJobEnd() {
        return end.getText()
    }


}
