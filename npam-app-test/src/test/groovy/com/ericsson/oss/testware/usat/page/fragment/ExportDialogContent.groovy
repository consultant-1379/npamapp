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

import org.jboss.arquillian.graphene.Graphene
import org.openqa.selenium.By
import org.openqa.selenium.WebDriver
import org.openqa.selenium.WebElement
import org.openqa.selenium.support.FindBy
import org.openqa.selenium.Keys;

/**
 * Page fragment that represents the table.
 */
class ExportDialogContent implements PageFragment {


    @FindBy(className = "eaNpamlibrary-wLabelWidget-input-passkey")
    private WebElement inputPasskey;

    @FindBy(className = "eaNpamlibrary-wLabelWidget-input-filename")
    private WebElement inputFilename;

    @FindBy(className = "eaNpamapp-wExportDialogContent-noPasskeyCheckbox-checkbox")
    private WebElement plainTextCheckbox;

    public void setPasskey(final String txt){
        inputPasskey.sendKeys(txt);
        inputPasskey.sendKeys(Keys.RETURN)
    }

    public void setFilename(final String txt){
        inputFilename.sendKeys(txt);
        inputFilename.sendKeys(Keys.RETURN)
    }

    public void clearFilename() {
       inputFilename.clear()
       inputFilename.sendKeys(Keys.RETURN)
    }

    public void clearPasskey() {
       inputPasskey.clear()
       inputPasskey.sendKeys(Keys.RETURN)
    }

    @FindBy(className = "ebInput-statusError")
    private List<WebElement> errorMsgs


    public String getErrorMsg(){
        for (final WebElement errorMsg : errorMsgs) {
            if (errorMsg.getText() != "")
              return errorMsg.getText()
        }
        return ""
    }

    public boolean noErrorMsg() {
        return (getErrorMsg().equals(""))
    }

    public void clickCheckPlainText() {
        plainTextCheckbox.click()
    }

    public boolean isDisabledPasskey() {
        return !inputPasskey.isEnabled()
    }

}
