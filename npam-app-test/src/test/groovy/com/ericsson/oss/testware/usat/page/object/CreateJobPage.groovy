package com.ericsson.oss.testware.usat.page.object

import com.ericsson.oss.testware.usat.page.fragment.TopSection;
import com.ericsson.oss.testware.usat.page.fragment.WizardFragment;
import com.ericsson.oss.testware.usat.page.fragment.DialogFragment;
import com.ericsson.oss.testware.usat.page.fragment.TableFragment;
import com.ericsson.oss.testware.usat.page.fragment.FlyoutPanel;
import com.ericsson.oss.testware.usat.page.fragment.ScopingPanel;
import com.ericsson.oss.testware.usat.page.fragment.ScopingPanelActions;
import com.ericsson.oss.testware.usat.page.fragment.Finish;
import com.ericsson.oss.testware.usat.page.fragment.Schedule;
import com.ericsson.oss.testware.usat.page.fragment.DropDown;
import com.ericsson.oss.testware.usat.page.fragment.Credentials;

import org.jboss.arquillian.graphene.Graphene;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.WebDriver;

class CreateJobPage implements PageObject {

    // TopSection Fragment
    @FindBy(className = "elLayouts-TopSection")
    WebElement topSection

    @FindBy(className = "elLayouts-TopSection")
    private TopSection topSectionFragment;

    public TopSection getTopSectionFragment() {
        Graphene.waitGui().until().element(topSection).is().present();
        return topSectionFragment;
    }

    boolean verifyTopSectionTitle(String txt) {
        return getTopSectionFragment().verifyTopSectionTitle(txt);
    }

    // Wizard  Fragment
    @FindBy(className = "ebWizard")
    private WebElement jobWizElement;

    @FindBy(className = "ebWizard")
    private WizardFragment wizardFragment;

    public WizardFragment getWizardFragment() {
        Graphene.waitGui().until().element(jobWizElement).is().present();
        return wizardFragment;
    }

    void clickCancel() {
        getWizardFragment().clickCancel();
    }

    void clickNext() {
        getWizardFragment().clickNext();
    }

    void clickFinish() {
        getWizardFragment().clickFinish();
    }

    void clickCredentialsPage() {
        getWizardFragment().clickStep('Credentials');
    }

    void clickSchedulePage() {
        getWizardFragment().clickStep('Job Scheduling');
    }

    void clickSummaryPage() {
        getWizardFragment().clickStep('Summary');
    }

    //TODO add other wizard methods

    // Dialog Fragment
    @FindBy(className = "ebDialogBox")
    private WebElement dialogElement;

    @FindBy(className = "ebDialogBox")
    private DialogFragment dialogFrag;

    public DialogFragment getDialogFragment() {
        Graphene.waitGui().until().element(dialogElement).is().present();
        return dialogFrag;
    }

    void clickDialogYes() {
        getDialogFragment().clickButtonWithName('Yes');
    }

    void clickDialogCreate() {
        getDialogFragment().clickButtonWithName('Yes');
    }

    // Table Fragment
    @FindBy(className = "elTablelib-Table")
    private WebElement tableElement;

    @FindBy(className = "elTablelib-Table")
    private TableFragment tableFrag;

    public TableFragment getTableFragment() {
        Graphene.waitGui().until().element(tableElement).is().present();
        return tableFrag;
    }

    public int getNumberOfTableRows() {
        return getTableFragment().getNumberOfTableRows();
    }

    public int getSelectedRows() {
        return getTableFragment().getSelectedRows();
    }

    public boolean checkExistRowWithText(final String textValueOfCell) {
        return getTableFragment().checkExistRowsWithText(textValueOfCell);
    }

    public boolean selectRowWithText(final String textValueOfCell) {
        return getTableFragment().selectRowWithCellValue(textValueOfCell, true);
    }

    // Flyout Panel Fragment
    @FindBy(className = "eaFlyout-panel")
    WebElement flyoutPanel

    @FindBy(className = "eaFlyout-panel")
    FlyoutPanel flyoutPanelFragment

    private FlyoutPanel getFlyoutPanelFragment() {
        waitPresent(flyoutPanel)
        return flyoutPanelFragment
    }

    public String isFlyoutPanel(final String flyoutPanelCaption){
        Graphene.waitGui().until().element(flyoutPanel).is().present()
        sleep(1000)
        return parametersFlyout.getText()
    }

    boolean isFlyoutPanelClosed(FlyoutPanel tableSettingsFlyout) {
        sleep(1000)
        if (flyoutPanel.displayed) {
            tableSettingsFlyout.clickApplyTableSettingsButton()
            Graphene.waitGui().until().element(flyoutPanel).is().not().visible()
        }
        return true
    }

    void clickFlyout(){
        waitPresent(flyout_show)
        click(flyout_show);
    }

    // Scoping Panel Fragment
    public final static int ALL_OTHER_NODES_TOPOLOGY_INDEX = 2 // depending from mock
    public final static int SIMPLE_SUBNET_INDEX = 2 // Simple_Subnet
    public final static int PARENT_SN_INDEX = 1 // Parent_Subnet

    @FindBy(className = "elScopingPanel-rManualScopingPanel")
    WebElement scopingPanel

    @FindBy(className = "elScopingPanel-rManualScopingPanel")
    ScopingPanel scopingPanelFragment


    public ScopingPanel getScopingPanelFragment() {
        waitPresent(scopingPanel)
        return scopingPanelFragment
    }

    void selectTopologyItems(WebDriver browser, String... names) {
        getScopingPanelFragment().selectTopologyItems(browser, names)
        assert getScopingPanelFragment().verifyTopologyItemsAreSelected(names)
    }

    boolean expandTopologyOtherNodes() {
        return getScopingPanelFragment().expandTopologyTabItem(ALL_OTHER_NODES_TOPOLOGY_INDEX);
    }

    void expandTopologySimpleSubnet() {
         getScopingPanelFragment().expandTopologyTabItem(SIMPLE_SUBNET_INDEX);
    }

    void expandTopologyParentSubnet() {
        getScopingPanelFragment().expandTopologyTabItem(PARENT_SN_INDEX);
    }

    //ScopingPanelActions Fragment
    @FindBy(className = "elScopingPanel-rManualScopingPanel-actions")
    WebElement scopingPanelActions

    @FindBy(className = "elScopingPanel-rManualScopingPanel-actions")
    ScopingPanelActions scopingPanelActionsFragment

    public ScopingPanelActions getScopingPanelActionsFragment() {
        waitPresent(scopingPanelActions)
        return scopingPanelActionsFragment
    }

    void clickScopingPanelAddButton() {
        getScopingPanelActionsFragment().clickScopingPanelAddButton()
    }

    // Finish Fragment
    @FindBy(className = "eaNpamlibrary-finish")
    private WebElement finish;

    @FindBy(className = "eaNpamlibrary-finish")
    private Finish finishFragment;

    public Finish getFinishFragment() {
        waitPresent(finish)
        return finishFragment
    }

    public boolean checkSummaryJobName(String name) {
        return getFinishFragment().getJobName().contains(name)
    }

    public boolean checkSummaryNumbersOfSelectedNodes(String numberOfNodesStr) {
        return getFinishFragment().getNumbersOfSelectedNodes().equals(numberOfNodesStr)
    }

    public boolean checkSummaryScope(String scope) {
        return getFinishFragment().getSelectedScope().equals(scope)
    }

    public boolean checkSummaryJobDescription(String description ) {
        return getFinishFragment().getJobDescription().equals(description)
    }

    public boolean checkSummaryJobStartDate(String dateStr) {
        return getFinishFragment().getJobStartDate().startsWith(dateStr)
    }

    public boolean checkSummaryJobRepeats(String repeats) {
        return getFinishFragment().getJobRepeats().equals(repeats)
    }

    public boolean checkSummaryJobRepeatEvery(String repeatEvery) {
        return getFinishFragment().getJobRepeatEvery().contains("Every " + repeatEvery + " Week")
    }

    public boolean checkSummaryJobEnd(String end) {
        return getFinishFragment().getJobEnd().equals(end)
    }

    public boolean checkSummaryCredentialsMsg(String msg) {
        return getFinishFragment().getCredentialsMsg().equals(msg)
    }

    public boolean checkScheduleMsg(String msg) {
        return getFinishFragment().getScheduleMsg().equals(msg)
    }

    // Schedule Fragment
    @FindBy(className = "eaNpamlibrary-schedule")
    private WebElement schedule;

    @FindBy(className = "eaNpamlibrary-schedule")
    private Schedule scheduleFragment;

    public Schedule getScheduleFragment() {
        waitPresent(schedule)
        return scheduleFragment
    }

    void selectDropDownItemScheduleImmediate() {
        getDropdownFragment().selectItemFromDropdown('Define job and execute immediately')
    }

    void selectDropDownItemScheduleDeferred() {
        getDropdownFragment().selectItemFromDropdown('Define job and schedule execution')
//        getScheduleFragment().selectDropDownItemScheduleDeferred()
    }

    void setScheduleStartDate(String startDate) {
        getScheduleFragment().setStartDate(startDate)
    }

    void clickScheduleDropDown() {
        getScheduleFragment().clickScheduleDropDown()
    }

    void checkRepeatCheckBox() {
        getScheduleFragment().checkRepeatCheckBox()
    }

    void clickDropDownRepeats() {
        getScheduleFragment().clickDropDownRepeats()
    }

    void selectDropDownRepeatWeekly() {
        getDropdownFragment().selectItemFromDropdown('Weekly')
    }

    void setRepeatEvery(final String txt) {
        getScheduleFragment().setRepeatEvery(txt)
    }

    void selectEnd(String txt) {
        getScheduleFragment().selectEnd(txt)
    }

    // Job Name & Description
    @FindBy(className = "eaNpamlibrary-wJobdetails-jobNameTextBox")
    private WebElement jobName;

    public void setJobName(final String txt){
        Graphene.waitGui().until().element(jobName).is().present();
        jobName.clear();
        jobName.sendKeys(txt);
    }

    public String getJobName(){
        Graphene.waitGui().until().element(jobName).is().present();
        return jobName.getAttribute("value");
    }

    public void setAndValidateJobName(final String txt) {
        setJobName(txt)
        assert getJobName().equals(txt)
    }

    @FindBy(className = "eaNpamlibrary-wJobdetails-jobDescriptionBox")
    private WebElement jobDescription;

    public void setJobDescription(final String txt){
        Graphene.waitGui().until().element(jobDescription).is().present();
        jobDescription.clear();
        jobDescription.sendKeys(txt);
    }

    public String getJobDescription(){
        Graphene.waitGui().until().element(jobDescription).is().present();
        return jobDescription.getAttribute("value");
    }

    public void setAndValidateJobDescription(final String txt) {
        setJobDescription(txt)
        assert getJobDescription().equals(txt)
    }

    @FindBy(className = "ebIcon_topology")
    WebElement topologyButton

    void clickTopologyButton() {
        Graphene.waitGui().until().element(topologyButton).is().present()
        Graphene.waitGui().until().element(topologyButton).is().clickable()
        click(topologyButton)
    }

    @FindBy(className = "elWidgets-ComponentList")
    WebElement dropDown

    @FindBy(className = "elWidgets-ComponentList")
    DropDown dropDownFragment

    DropDown getDropdownFragment() {
        waitPresent(dropDown)
        return dropDownFragment

    }



    @FindBy(className = "ebAccordion-title")
    private List<WebElement> accordions;

    @FindBy(className = "ebCheckbox")
    private List<WebElement> checkboxes;

    @FindBy(className = "ebInput-statusError")
    private WebElement errorMsg;

    @FindBy(className = "eaNpamlibrary-finish-schedule eaNpamlibrary-finish-right")
    private WebElement scheduleMsg;

    @FindBy(className = "elWidgets-SelectionList-item")
    private List<WebElement> selectionListLabel;

    @FindBy(className = "ebIcon_nextArrow")
    private WebElement selectAllComps;

    @FindBy(className = "eaNpamlibrary-eaListBuilder-wListBuilder-menuItem")
    private WebElement selectSelectedComps;

    @FindBy(className = "ebIcon_rightArrow")
    private WebElement expandComps;

//    public void loadNodes() {
//        browser.get("http://localhost:8585/#npamapp/npamcreateneaccountjob/loadNodes?collections=281474982773730");
//        browser.manage().window().setSize(new Dimension(1824, 1824));
//    }



    public int getNumberOfAccordions() {
        final int result = accordions.size();
        return result;
    }

    public boolean clickAccordionWithName(final String elementText) {
        for (final WebElement element : accordions) {
            if (element.getText().contains(elementText)) {
                element.click();
                return true;
            }
        }
        return false;
    }

    public void setInputValue(final String txt, int index){
        inputElement.get(index).sendKeys(txt);
    }

    public String getInputValue(int index){
        Graphene.waitGui().until().element(inputElement.get(index)).is().present();
        return inputElement.get(index).getAttribute("value");
    }

    public void clearInputValue(int index){
        Graphene.waitGui().until().element(inputElement.get(index)).is().present();
        inputElement.get(index).clear();
    }

    public void clickCheckBox(int index) {
        Graphene.waitGui().until().element(checkboxes.get(index)).is().present();
        checkboxes.get(index).click();
    }

    public String checkSelectedCheckBox(int index) {
        Graphene.waitGui().until().element(checkboxes.get(index)).is().present();
        return checkboxes.get(index).getAttribute("value");
    }

//    public void setPasswordValue(final String txt, int index){
//        passwordValue.get(index).sendKeys(txt);
//    }

    public void enterBackSpace(int index){
        inputElement.get(index).sendKeys(Keys.BACK_SPACE);
    }

    public String getErrorMsg(){
        return errorMsg.getText();
    }

    public String getScheduleMsg(){
        return scheduleMsg.getText();
    }

    public void selectListElement(String name) {
        for (final WebElement ele : selectionListLabel) {
            if (ele.getText().equals(name)) {
                ele.click();
                break;
            }
        }
    }

    public void clickSelectAllComps() {
        Graphene.waitGui().until().element(selectAllComps).is().present();
        selectAllComps.click();
    }

    public void clickSelectSelectedComps() {
        Graphene.waitGui().until().element(selectSelectedComps).is().present();
        selectSelectedComps.click();
    }
    public void expandComps() {
        Graphene.waitGui().until().element(expandComps).is().present();
        expandComps.click();
    }

    @Override
    void waitForLoad() {
        falseOnException { wizardFragment.waitForLoad() }
        waitNotVisible(loadingDots)
    }

        // Credentials Fragment
    @FindBy(className = "eaNpamrotateneaccountjob-wCreddetails")
    private WebElement credentials;

    @FindBy(className = "eaNpamrotateneaccountjob-wCreddetails")
    private Credentials credentialsFragment;

    public Credentials getCredentialsFragment() {
        waitPresent(credentials)
        return credentialsFragment
    }

    public void selectManualCredentials() {
        getCredentialsFragment().clickRadioButtonWithName("Set new credentials manually")
    }

    public void setPassword(final String txt) {
        getCredentialsFragment().setPassword(txt)
    }

    public void setUsername(final String txt) {
        getCredentialsFragment().setUsername(txt)
    }

    public boolean verifyCredentialsErrorString(final String txt) {
        return txt.equals(getCredentialsFragment().getErrorMsg())
    }

    public boolean verifyCredentialsNoErrorString(final String txt) {
        return getCredentialsFragment().noErrorMsg()
    }

    public void clearUsername(){
        getCredentialsFragment().clearUsername()
    }

    public void clearPassword(){
        getCredentialsFragment().clearPassword()
    }

    @FindBy(className = "ebWizard-footerBtnNext")
    private WebElement nextButton;

    private boolean nextButtonEnabled() {
        return nextButton.isEnabled()
    }

    public boolean verfifyNextButtonDisabled() {
        return !nextButtonEnabled()
    }
 
    public boolean verfifyNextButtonEnabled() {
        return nextButtonEnabled()
    }
}
