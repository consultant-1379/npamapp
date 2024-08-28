package com.ericsson.oss.testware.usat.page.fragment

import org.openqa.selenium.support.FindBy
import org.openqa.selenium.WebElement
import org.jboss.arquillian.graphene.Graphene
import org.openqa.selenium.Keys;

class Schedule implements PageFragment{

    @FindBy(className = "ebSelect-value")
    List<WebElement> buttonScheduleDropdown

    public boolean clickDropDownWithName(final String elementText) {
        for (final WebElement element : buttonScheduleDropdown) {
            if (element.getText().contains(elementText)) {
                element.click();
                return true;
            }
        }
        return false;
    }


    @FindBy(css = ".ebInput.elWidgets-PopupDatePicker-input")
    private WebElement inputDate;

    @FindBy(css = ".ebInput-statusError")
    private WebElement errorMsg;

    void clickScheduleDropDown() {
        clickDropDownWithName('Define job and execute immediately')
    }

    public void setStartDate(final String txt){
        inputDate.sendKeys(txt);
        inputDate.sendKeys(Keys.RETURN);
    }

    public String getInputDate(){
        Graphene.waitGui().until().element(inputDate).is().present();
        return inputDate.getAttribute("value");
    }

    public String getErrorMsg(){
        return errorMsg.getText();
    }

    @FindBy(className = "eaNpamlibrary-wRepeatPattern-repeatCheckbox")
    WebElement repeatCheckBox;

    public void checkRepeatCheckBox() {
//        Graphene.waitGui().until().element(repeatCheckBox).is().present()
//        Graphene.waitGui().until().element(repeatCheckBox).is().clickable()
        repeatCheckBox.click()
    }

    public void clickDropDownRepeats() {
        clickDropDownWithName('Select Repeat Pattern type')
    }

    @FindBy(className = "eaNpamlibrary-wRepeatPattern-repeatPeriod")
    private WebElement repeatEvery;

    public void setRepeatEvery(final String txt){
        repeatEvery.sendKeys(txt);
        repeatEvery.sendKeys(Keys.RETURN);
    }

    @FindBy(className = "eaNpamlibrary-wRepeatPattern-repeatEndNever")
    private WebElement repeatEndNever;

    void selectEnd(String txt) {
        if ("Never".equals(txt)) {
            repeatEndNever.click()
        }
    }
}
