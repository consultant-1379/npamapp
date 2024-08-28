package com.ericsson.oss.testware.usat.page.fragment

import java.util.List;

import org.jboss.arquillian.graphene.Graphene;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
//import org.openqa.selenium.support.Color;
import org.openqa.selenium.support.FindBy;


public class DialogFragment implements PageFragment {

    @FindBy(className = "ebDialogBox-primaryText")
    private WebElement dialogBoxHeader;

    @FindBy(className = "ebBtn-caption")
    private List<WebElement> dialogBoxItems;

    @FindBy(className = "ebBtn")
    private List<WebElement> dialogBoxButtons;


    @FindBy(className = "ebDialogBox-secondaryText")
    private WebElement secondaryText;

//    @FindBy(className = "eaShmsoftwareinventory-deleteUpgradePkgs-accordionTitle")
//    private WebElement accordionTitle;
//
//    @FindBy(className = "eaShmsoftwareinventory-deleteUpgradePkgs-accordion")
//    private WebElement selectedUpTable;

//    @FindBy(className = "eaShmsoftwarepackages-CombinedPopup")
//    private WebElement deleteDialog;
//
//    @FindBy(css = ".eaShmsoftwarepackages-CombinedPopup")
//    private TableFragment deleteDialogFragment;
//
//    @FindBy(css = ".eaShmsoftwareinventory-deleteUpgradePkgs-accordion")
//    private TableFragment selectedUpTableFragment;
//
//    @FindBy(css = ".eaShmsoftwareinventory-deleteUpgradePkgs-checkbox")
//    private List<WebElement> deletePackageActivityList;
//
//    @FindBy(css = ".eaShmsoftwarepackages-DeletePopup-smrsCheckbox")
//    private WebElement smrsCheckbox;

//    public void clickDialogCheckbox(final int checkBoxRow) {
//        deletePackageActivityList.get(checkBoxRow).click();
//    }

    public int getDialogBoxBtnCount() {
        return dialogBoxItems.size();
    }

    public String getDialogBoxHeader() {
        Graphene.waitGui().until().element(dialogBoxHeader).is().present();
        return dialogBoxHeader.getText();
    }

    public String getDialogBoxText() {
        Graphene.waitGui().until().element(secondaryText).is().present();
        return secondaryText.getText();
    }

    public boolean clickButtonWithName(final String elementText) {
        for (final WebElement element : dialogBoxItems) {
            if (element.getText().contains(elementText)) {
                element.click();
                return true;
            }
        }
        return false;
    }

    public boolean checkButtonWithName(final String elementText) {
        for (final WebElement element : dialogBoxItems) {
            if (element.getText().contains(elementText)) {
                return true;
            }
        }
        return false;
    }

    public boolean isDisabledButtonWithName(final String elementText) {
        for (final WebElement element : dialogBoxButtons) {
            if (element.getText().contains(elementText)) {
                return !element.isEnabled()
            }
        }
        return false;
    }


    public int getActivityAccordianCount(final String classname) {
        WebElement accordianHolder = secondaryText.findElement(By.className(classname));
        List<WebElement> accordians = accordianHolder.findElements(By.xpath("./*"));
        return accordians.size();
    }

    public boolean hasAccordianWithName(final String classname, final String accName) {
        WebElement accordianHolder = secondaryText.findElement(By.className(classname));
        List<WebElement> accordians = accordianHolder.findElements(By.xpath("./*"));
        for (final WebElement element : accordians) {
            final WebElement title = element.findElement(By.className("ebAccordion-title"));
            if (title.getText().contains(accName)) {
                return true;
            }
        }
        return false;
    }

    public void clickAccordianWithName(final String classname, final String accName) {
        WebElement accordianHolder = secondaryText.findElement(By.className(classname));
        List<WebElement> accordians = accordianHolder.findElements(By.xpath("./*"));
        for (final WebElement element : accordians) {
            final WebElement title = element.findElement(By.className("ebAccordion-title"));
            if (title.getText().contains(accName)) {
                title.click();
            }
        }
    }

//    public String getAccordionTitle() {
//        Graphene.waitGui().until().element(accordionTitle).is().present();
//        return accordionTitle.getText();
//    }

//    public TableFragment getSelectedUpTableFragment() {
//        Graphene.waitGui().until().element(selectedUpTable).is().present();
//        return selectedUpTableFragment;
//    }
//
//    public void clickSmrsCheckbox() {
//        Graphene.waitGui().until().element(smrsCheckbox).is().present();
//        smrsCheckbox.click();
//    }
}
