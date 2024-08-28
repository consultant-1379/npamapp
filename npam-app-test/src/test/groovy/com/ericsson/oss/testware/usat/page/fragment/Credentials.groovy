package com.ericsson.oss.testware.usat.page.fragment

import org.openqa.selenium.support.FindBy
import org.openqa.selenium.WebElement
import org.jboss.arquillian.graphene.Graphene
import org.openqa.selenium.Keys;

class Credentials implements PageFragment{

    @FindBy(className = "ebRadioBtn-label")
    List<WebElement> radioButtons

    public boolean clickRadioButtonWithName(final String elementText) {
        for (final WebElement element : radioButtons) {
            if (element.getText().contains(elementText)) {
                element.click();
                return true;
            }
        }
        return false;
    }


    @FindBy(className = "eaNpamlibrary-wLabelWidget-input-password")
    private WebElement inputPassword;

    @FindBy(className = "eaNpamlibrary-wLabelWidget-input-username")
    private WebElement inputUsername;

    public void setPassword(final String txt){
        inputPassword.sendKeys(txt);
        inputPassword.sendKeys(Keys.RETURN);
    }

    public void setUsername(final String txt){
        inputUsername.sendKeys(txt);
        inputUsername.sendKeys(Keys.RETURN);
    }
    
    public void clearUsername() {
       inputUsername.clear()
       inputUsername.sendKeys(Keys.RETURN);
    }

    public void clearPassword() {
       inputPassword.clear()
       inputPassword.sendKeys(Keys.RETURN);
    }

    @FindBy(className = "ebInput-statusError")
    private List<WebElement> errorMsgs;


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

}
