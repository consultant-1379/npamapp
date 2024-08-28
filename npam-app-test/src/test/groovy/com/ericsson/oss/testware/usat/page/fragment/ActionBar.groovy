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

package com.ericsson.oss.testware.usat.page.fragment

//import org.openqa.selenium.By
import org.openqa.selenium.WebElement
import org.openqa.selenium.support.FindBy

class ActionBar implements PageFragment {

    @FindBy(className = "elLayouts-QuickActionBar-items")
    WebElement actionBarItems

    @FindBy(className = "elLayouts-ActionBarButton")
    List<WebElement> actionBarButtons

    @FindBy(className = "elLayouts-ActionBarDropdown")
    List<WebElement> actionBarDropDownMio

    // NE account Summary selector
    @FindBy(css = "button.ebBtn.ebBtn_subtle.elLayouts-PanelActionBar-button.elLayouts-PanelActionBar-button_summary.elLayouts-PanelActionBar-button_external i.ebIcon.ebIcon_info.elLayouts-PanelActionBar-icon")
    WebElement actionBarRightItems

    @FindBy(className = "elLayouts-QuickActionBar-defaultCommands")
    WebElement actionBarDefaultCommands

    @FindBy(css = ".elLayouts-QuickActionBar-contextCommands .elLayouts-ActionBarButton")
    List<WebElement> contextActionButtons

    @FindBy(css = ".elLayouts-QuickActionBar-defaultCommands .elLayouts-ActionBarButton")
    WebElement defaultActionButton

    @FindBy(css = ".elWidgets-Dropdown-iconHolder")
    WebElement dropdownIcon

    @FindBy(className = "ebDropdown-button")
    WebElement actionBarDropdown

    // not used but left here for future developments
    boolean hasButtonWithName(final String buttonName) {
       waitVisible(actionBarItems)
       return hasButton(buttonName)
   }

    // not used but left here for future developments
    boolean hasNoButtons() {
        waitNotVisible(actionBarItems)
        return true
    }

    // not used to be checked
    void clickActionBarButton(final String actionBarCaption) {
        WebElement actionBarButton = root.findElement(By.xpath("//*[contains(text(), '" + actionBarCaption + "')"
                + " and contains(@class, 'elLayouts-ActionBar')]"))
        click(actionBarButton)
    }

    // not used but left here for future developments
    void clickCreateButton(final String name){
        for(WebElement button:contextActionButtons){
            if( name == button.getText() ) {
                button.click()
                break;
            }
        }
    }

    void clickExportButton(final String name) {
        for(WebElement button: actionBarButtons) {
            if(button.getText() == name) {
                button.click()
                break;
            }
        }
    }

    // not used but left here for future developments
    boolean hasContextActionButton(final String buttonName) {
        for (WebElement button : contextActionButtons) {
            if (button.getText() == buttonName) {
                return true
            }
        }
        return false
    }

    // not used but left here for future developments
    boolean hasDefaultActionButtons(final String buttonName1, final String buttonName2) {
        for (WebElement button : contextActionButtons) {
            if (button.getText() == buttonName1 || button.getText() == buttonName2) {
                return true
            }
        }
        return false
    }

    // not used but left here for future developments
    private boolean hasDefaultActionButton(final String buttonName) {
        return defaultActionButton.getText() == buttonName
    }

    boolean hasButton(final String buttonName) {
        return actionBarButtons.any {button -> button.getText() == buttonName}
    }

    boolean hasSummaryButton() {
        waitVisible(actionBarRightItems)
        return true
    }

    void clickSummaryIcon(){
        click(actionBarRightItems)
    }

    public void clickActionDropDown() {
        click(dropdownIcon);
    }

    boolean hasDropDownButton(final String buttonName) {
        return actionBarDropDownMio.any { button -> button.getText() == buttonName}
    }

    // added come in cell management
    boolean hasDropdown(final String dropDownName) {
        return actionBarDropdown.getText().equals(dropDownName)
    }

    void clickActionBarDropdown() {
        waitVisible(actionBarDropdown)
        click(actionBarDropdown)
    }

}
