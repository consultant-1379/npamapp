/*------------------------------------------------------------------------------
 *******************************************************************************
 * COPYRIGHT Ericsson 2022
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************
 *----------------------------------------------------------------------------*/

package com.ericsson.oss.testware.usat.page.object

import com.ericsson.oss.testware.usat.page.fragment.TopSection;
import com.ericsson.oss.testware.usat.page.fragment.ScopingPanel

import com.ericsson.oss.testware.usat.page.fragment.ActionBar
import com.ericsson.oss.testware.usat.page.fragment.NeAccountTable
import com.ericsson.oss.testware.usat.page.fragment.FlyoutPanel
import com.ericsson.oss.testware.usat.page.fragment.DropDown
import com.ericsson.oss.testware.usat.page.fragment.WizardFragment;
import com.ericsson.oss.testware.usat.page.fragment.DialogFragment;
import com.ericsson.oss.testware.usat.page.fragment.ExportDialogContent;

import org.jboss.arquillian.graphene.Graphene
import org.jboss.arquillian.graphene.page.Location

import org.openqa.selenium.WebDriver
import org.openqa.selenium.WebElement
import org.openqa.selenium.By
import org.openqa.selenium.support.FindBy

/**
 * Page object that represents the single page application.
 */
@Location("/#npamapp")
class NpamappMainPage implements PageObject {

    // TopSection Fragment
    @FindBy(className = "elLayouts-TopSection")
    WebElement topSection

    @FindBy(className = "elLayouts-TopSection")
    private TopSection topSectionFragment;

    public TopSection getTopSectionFragment() {
        Graphene.waitGui().until().element(topSection).is().present();
        return topSectionFragment;
    }

    boolean verifyTopSectionTitle() {
        return getTopSectionFragment().verifyTopSectionTitle('Network Privileged Access Management');
    }

    // Scoping Panel Fragment
    public final static int ALL_OTHER_NODES_TOPOLOGY_INDEX = 2 // depending from mock
    public final static int SIMPLE_SUBNET_INDEX = 2 // Simple_Subnet
    public final static int PARENT_SN_INDEX = 1 // Parent_Subnet

    @FindBy(className = "elScopingPanel-rScopingPanel")
    WebElement scopingPanel

    @FindBy(className = "elScopingPanel-rScopingPanel")
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

    boolean expandTopologySimpleSubnet() {
        return getScopingPanelFragment().expandTopologyTabItem(SIMPLE_SUBNET_INDEX);
    }

    boolean expandTopologyParentSubnet() {
        return getScopingPanelFragment().expandTopologyTabItem(PARENT_SN_INDEX);
    }

    void clickRowsContainingCollection(collection) {
        getScopingPanelFragment().clickRowsContainingCollection(collection);
    }

    void clickRowsContainingSavedSearch(savedSearch) {
        getScopingPanelFragment().clickRowsContainingSavedSearch(savedSearch);
    }


    // Clicks on required tab in Scoping Panel
    void selectScopingPanelTab(final String tabName) {
        final WebElement scopingPanelTab =
                scopingPanel.findElement(By.xpath("//div[contains(text(), '" + tabName + "') and contains(@class, 'ebTabs-tabItem')]"))
        click(scopingPanelTab)
    }

    // ActionBar Fragment
    @FindBy(className = "elLayouts-QuickActionBar")
    WebElement actionBar

    @FindBy(className = "elLayouts-QuickActionBar")
    ActionBar actionBarFragment

    ActionBar getActionBarFragment() {
        waitPresent(actionBar)
        return actionBarFragment
    }

    boolean hasDropDownCreateJob() {
        return getActionBarFragment().hasDropDownButton("Create Job");
    }

    boolean hasExportAll() {
        return getActionBarFragment().hasButton("Export All NE Accounts");
    }

    boolean hasExport() {
        return getActionBarFragment().hasButton("Export");
    }

    boolean clickDropDownCreateJob() {
        return getActionBarFragment().clickActionBarDropdown();
    }

    boolean hasButtonCreateJob() {
        return getActionBarFragment().hasButton("Create NE Accounts");
    }

    boolean clickButtonCreateJob() {
        return getActionBarFragment().clickCreateButton("Create NE Accounts");
    }

    boolean hasButtonDetachJob() {
        return getActionBarFragment().hasButton("Detach");
    }

    boolean clickButtonDetachJob() {
        return getActionBarFragment().clickCreateButton("Detach");
    }

    boolean hasButtonRotateJob() {
        return getActionBarFragment().hasButton("Rotate Credentials");
    }

    boolean clickButtonRotateJob() {
        return getActionBarFragment().clickCreateButton("Rotate Credentials");
    }

    boolean hasButtonCheckJob() {
        return getActionBarFragment().hasButton("Update NE Accounts Configuration");
    }

    boolean clickButtonCheckJob() {
        return getActionBarFragment().clickCreateButton("Update NE Accounts Configuration");
    }

    void clickButtonExportAll() {
        getActionBarFragment().clickExportButton("Export All NE Accounts");
    }

    void clickButtonExport() {
        getActionBarFragment().clickExportButton("Export");
    }

    // Dropdown Fragment
    @FindBy(className = "elWidgets-ComponentList")
    WebElement dropDown

    @FindBy(className = "elWidgets-ComponentList")
    DropDown dropDownFragment

    DropDown getDropdownFragment() {
        waitPresent(dropDown)
        return dropDownFragment

    }

    boolean hasDropDownItemCreateJob() {
        return getDropdownFragment().hasDropdownItems('Create NE Accounts');
    }

    boolean selectDropDownItemCreateJob() {
        return getDropdownFragment().selectItemFromDropdown('Create NE Accounts');
    }

    boolean hasDropDownItemDetachJob() {
        return getDropdownFragment().hasDropdownItems('Detach NE Accounts');
    }

    boolean selectDropDownItemDetachJob() {
        return getDropdownFragment().selectItemFromDropdown('Detach NE Accounts');
    }

    boolean hasDropDownItemRotateJob() {
        return getDropdownFragment().hasDropdownItems('Rotate NE Account Credentials');
    }

    boolean selectDropDownItemRotateJob() {
        return getDropdownFragment().selectItemFromDropdown('Rotate NE Account Credentials');
    }

    boolean hasDropDownItemCheckJob() {
        return getDropdownFragment().hasDropdownItems('Update NE Accounts Configuration');
    }

    boolean selectDropDownItemCheckJob() {
        return getDropdownFragment().selectItemFromDropdown('Update NE Accounts Configuration');
    }

      // ExportDialogContent Fragment
    @FindBy(className = "eaNpamapp-wExportDialogContent")
    private WebElement exportDialogContent;

    @FindBy(className = "eaNpamapp-wExportDialogContent")
    private ExportDialogContent exportDialogContentFragment;

    public ExportDialogContent getExportDialogContentFragment() {
        waitPresent(exportDialogContent)
        return exportDialogContentFragment
    }

    public void setPasskey(final String txt) {
        getExportDialogContentFragment().setPasskey(txt)
    }

    public void setFilename(final String txt) {
        getExportDialogContentFragment().setFilename(txt)
    }

    public boolean verifyExportDialogContentErrorString(final String txt) {
        return txt.equals(getExportDialogContentFragment().getErrorMsg())
    }

    public boolean verifyExportDialogContentNoErrorString(final String txt) {
        return getExportDialogContentFragment().noErrorMsg()
    }

    public void clearFilename(){
        getExportDialogContentFragment().clearFilename()
    }

    public void clearPasskey(){
        getExportDialogContentFragment().clearPasskey()
    }

    public void clickCheckPlainText() {
        getExportDialogContentFragment().clickCheckPlainText()
    }

    public boolean isDisabledPasskey() {
        return getExportDialogContentFragment().isDisabledPasskey()
    }



    //  @FindBy(className = "elLayouts-PanelActionBar-button_active")
    // OK e' il tree sopra network
  //  WebElement leftPanel

 /*   @FindBy(className = "ebIcon_topology")
    WebElement topologyButton // OK e' l'cona del tree
*/
    // Main Region Elements
    @FindBy(className = "ebInlineMessage-header")
    WebElement inlineMessageHeader

    @FindBy(className = "ebInlineMessage-description")
    WebElement inlineMessageDescription

    @FindBy(className = "ebTable-headerText")
    WebElement inlineTableHeaderText

    @FindBy(className = "eaNpamapp-rMain-neAccountTabPlaceholder")
    WebElement table

    @FindBy(className = "eaNpamapp-rMain-neAccountTabPlaceholder")
    NeAccountTable tableFragment

    @FindBy(className = "eaFlyout-panel")
    WebElement flyoutPanel

    @FindBy(className = "eaFlyout-panel")
    FlyoutPanel flyoutPanelFragment

  //  @FindBy(css = "elLayouts-MultiSlidingPanels-rightHeader elLayouts-MultiSlidingPanels-title-right")
  //  WebElement parametersFlyout
    @FindBy(className = "NeAccountSummary")
    WebElement neAccountSummaryRootElement

    @FindBy(css = ".eaNpamapp-NeAccountSummary-label:nth-child(2)") // questo non sembra funzionare
    WebElement nodeFlyout

    @FindBy(css = ".eaNpamapp-NeAccountSummary-value:nth-child(3)")
    WebElement nodeNameInFlyout

    @FindBy(css = ".eaNpamapp-NeAccountSummary-value:nth-child(5)")
    WebElement ipAddressInFlyout

    @FindBy(css = ".eaNpamapp-NeAccountSummary-value.eaNpamapp-NeAccountSummary-currentUser-value.ebText")
    WebElement currentUsernameInFlyout

    @FindBy(css = ".eaNpamapp-NeAccountSummary-value.eaNpamapp-NeAccountSummary-status-value.ebText")
    WebElement statusInFlyout

    @FindBy(css = ".eaNpamapp-NeAccountSummary-value.eaNpamapp-NeAccountSummary-errorDetails-value.ebText")
    WebElement errorDetailsInFlyout

    @FindBy(css = ".eaNpamapp-NeAccountSummary-value:nth-child(17)")
    WebElement lastUpdateInFlyout

    @FindBy(css = ".eaNpamapp-NeAccountSummary-password-value.ebText")
    private WebElement passwordText

    @FindBy(className = "ebWizard")
    private WebElement jobWizElement;

    @FindBy(className = "ebWizard")
    private WizardFragment wizardFragment;

    @FindBy(className = "ebDialogBox")
    private WebElement dialogElement;

    @FindBy(className = "ebDialogBox")
    private DialogFragment dialogFrag;

    @FindBy(className = "ebDialogBox")
    private WebElement dialogElement2;

    @FindBy(className = "ebDialogBox")
    private DialogFragment dialogFrag2;

  // @FindBy(className = "ebTabs-tabArea")
  // WebElement tabs

// to be removed
    @FindBy(css = ".ebTabs-tabItem_closable_false")
    List<WebElement> neAccountsTab

  //  "//div[@class = 'ebTabs-tabItem ebTabs-tabItem_closable_false ebTabs-tabItem_selected_true']"))

 //   @FindBy(className = "eaFlyout")
 //   WebElement flyout_show

  //  @FindBy(className = "ebNotification-content")
  //  private WebElement successMessage

    private String npamManagementTab
    // private String exportTab

    String getLocation() {
        return "/#npamapp"
    }

    // --- Actions on TopSection --- //

    boolean isTopSectionAvailable() {
        waitPresent(topSection)
        return true
    }

    boolean verifyTopSectionTitle(final String title) {
        Graphene.waitGui().until().element(topSectionTitle).text().contains(title)
        return true
    }

    /* boolean isScopingPanelCollapsed() {
        Graphene.waitGui().until().element(leftPanel).is().not().present()
        return true
    }

    boolean isScopingPanelAvailable() {
        Graphene.waitGui().until().element(leftPanel).is().present()
        return true
    }
*/
    /*boolean isDetailsPanelAvailable(){
        Graphene.waitGui().until().element(rightPanel).is().present()
        return true
    }

    void clickTopologyButton() {
        Graphene.waitGui().until().element(topologyButton).is().present()
        Graphene.waitGui().until().element(topologyButton).is().clickable()
        click(topologyButton)
    }
*/
    // --- Actions on Main Region --- //

    boolean isTableDisplayed() {
        waitPresent(table)
        return true
    }

    /* boolean isIconHolderDisplayed() {
        Thread.sleep(1000)
        waitPresent(iconHolder)
        return true
    }
*/
    // e' cio' che contiene No Scope Selected
    boolean isInlineMessageHeaderDisplayed(final String expectedText) {
        Graphene.waitGui().until().element(inlineMessageHeader).text().contains(expectedText)
        return true
    }

    boolean isInlineMessageDescriptionDisplayed(final String expectedText) {
        Graphene.waitGui().until().element(inlineMessageDescription).text().contains(expectedText)
        return true
    }

    boolean isinlineTableHeaderTextDisplayed(final String expectedText) {
        Graphene.waitGui().until().element(inlineTableHeaderText).text().contains(expectedText)
        return true
    }

    public WizardFragment getWizardFragment() {
        Graphene.waitGui().until().element(jobWizElement).is().present();
        return wizardFragment;
    }

    public DialogFragment getDialogFragment() {
        Graphene.waitGui().until().element(dialogElement).is().present();
        return dialogFrag;
    }

    public DialogFragment getDialogFragment2() {
        Graphene.waitGui().until().element(dialogElement2).is().present();
        return dialogFrag2;
    }

    /* boolean isInlineMessageEditFiltersLinkDisplayed(final String expectedText) {
        Graphene.waitGui().until().element(inlineMessageEditFiltersLink).text().contains(expectedText)
        return true
    }
    boolean isInlineMessageErrorIconDisplayed() {
        waitPresent(inlineMessageErrorIcon)
        return true
    }

    boolean isInlineMessageHeaderNotVisible() {
        waitNotPresent(inlineMessageHeader)
        return true
    }

    /* boolean isNotificationLabelDisplayed(final String expectedText) {
        Graphene.waitGui().until().element(notificationLabel).text().contains(expectedText)
        return true
    }

    boolean isNotificationLabelNotVisible() {
        waitNotPresent(notificationLabel)
        return true
    }

    void selectCellsTab(WebDriver browser, final String tabName) {
        final WebElement cellsTab =
                browser.findElement(By.xpath("//div[contains(text(), '" + tabName + "') and contains(@class, 'ebTabs-tabItem')]"))
        click(cellsTab)
    }
*/

    // added to check the fields - not ok, it never fails to be investigated
    String hasFlyoutAsDetailsPanelHeader(final String flyoutPanelCaption){
        sleep(500)
        return nodeFlyout.getText() == flyoutPanelCaption
    }

    boolean hasNodeNameInFlyoutAsDetailsPanel(final String neName){
        sleep(500)
        return nodeNameInFlyout.getText() == neName
    }

    boolean hasIpAddressInFlyoutAsDetailsPanel(final String ipAddress) {
        sleep(500)
        return ipAddressInFlyout.getText() == ipAddress
    }

    boolean hasCurrentUsernameInFlyoutAsDetailsPanel(final String userName) {
        sleep(500)
        return currentUsernameInFlyout.getText() == userName
    }
    boolean hasStatusAsDetailsPanel(final String status) {
        sleep(500)
        return statusInFlyout.getText() == status
    }

    boolean hasErrorDetailsAsDetailsPanel(final String errorDetails) {
        sleep(500)
        return errorDetailsInFlyout.getText() == errorDetails
    }

    boolean hasLastUpdateAsDetailsPanel(final String lastUpdate) {
        sleep(500)
        return lastUpdateInFlyout.getText().contains(lastUpdate)
    }

    boolean hasPasswdInFlyoutAsDetailsPanel(final textInEye){
        sleep(500)
        return passwordText.getText() == textInEye
    }

    boolean hasNoPasswordInFlyoutDetailsPanel(){
        sleep(500)
        return passwordText.getText() == "******"
    }


    // --- Getters for Fragments --- //



    // TODO - verificare se ok
    NeAccountTable getTableFragment() {
          waitPresent(table)
          return tableFragment
    }

    /* NeAccountTable getRenderedTableFragment() {
        waitPresent(table)
        tableFragment.waitUntilTableRowsRendered()
        return tableFragment
    }
*/


    FlyoutPanel getFlyoutPanelFragment() {
        waitPresent(flyoutPanel)
        return flyoutPanelFragment
    }

  /*  boolean isFlyoutPanelClosed(FlyoutPanel tableSettingsFlyout) {
        sleep(1000)
        if (flyoutPanel.displayed) {
            tableSettingsFlyout.clickApplyTableSettingsButton()
            Graphene.waitGui().until().element(flyoutPanel).is().not().visible()
        }
        return true
    }

    boolean isSuccessMessageDisplayed(String message) {
        if (successMessage.getText() == message) {
            return true
        }
        return false
    }
*/

    @Override
    void waitForLoad() {
        falseOnException { NeAccountTable.waitForLoad() }
        waitNotVisible(loadingDots)
    }



}
