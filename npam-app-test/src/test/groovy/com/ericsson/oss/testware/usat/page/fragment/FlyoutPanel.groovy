package com.ericsson.oss.testware.usat.page.fragment

import org.jboss.arquillian.graphene.Graphene;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy

class FlyoutPanel implements PageFragment{
    @FindBy(xpath ="/html/body/div[3]/div/div/div[1]/div[4]/div/div[5]/div/div[2]/div/div/div/i")
    private WebElement eyeIcon

    void clickEyeIcon(){
        sleep(500)
        click(eyeIcon)
    }

    @FindBy(className = "eaFlyout-panel")
    private WebElement flyoutPanel;
    @FindBy(className = "eaFlyout-panelHeader")
    private WebElement panelHeader ;
    @FindBy(className = "eaFlyout-panelContents")
    private List<WebElement> panelContent ;
    @FindBy(className = "eaFlyout-panelContents")
    private WebElement tablePanelContent ;
    @FindBy(className = "eaFlyout-panelCloseIcon")
    private WebElement panelClose ;
    @FindBy(className = "elTablelib-TableSettingsItem")
    private List<WebElement> columnNames;
    @FindBy(className = "elTablelib-TableSettingsItem-labelText")
    private List<WebElement> listOfColumns;
    @FindBy(css = ".elTablelib-TableSettings-selectAll")
    private WebElement selectAll;
    @FindBy(css = ".elTablelib-TableSettings-selectNone")
    private WebElement selectNone;
    @FindBy(className = "eaNpamlibrary-wSettings-ApplyButton")
    private WebElement applySettings;
    @FindBy(className = "eaNpamlibrary-wDisplayMessage-contentHolder")
    private WebElement displayMessage;

    public boolean verifyPanelTitle(final String title) {
        Graphene.waitGui().until().element(panelHeader).text().contains(title);
        return true;
    }

    public int getNumberOfColumns() {
        return columnNames.size();
    }

    public int getSelectedColumns() {
        List<WebElement> columns = tablePanelContent.findElements(By.cssSelector("input:checked[type='checkbox']"));
        return columns.size();
    }

    public boolean hasColumnWithName(final String columnName) {
        Graphene.waitGui().until().element(tablePanelContent).is().present();
        for (final WebElement element : listOfColumns) {
            if (element.getText().equalsIgnoreCase(columnName)) {
                return true;
            }
        }
        return false;
    }

    public boolean selectColumn (final String columnName) {
        Graphene.waitGui().until().element(tablePanelContent).is().present();
        for (final WebElement element : columnNames) {
            if (element.getText().equalsIgnoreCase(columnName)) {
                element.click();
                return true;
            }
        }
        return false;
    }

    public void setSelectNone() {
        Graphene.waitGui().until().element(selectNone).is().present();
        selectNone.click();
        Graphene.waitGui().until().element(applySettings).is().present();
        applySettings.click();
    }

    public void setSelectAll() {
        Graphene.waitGui().until().element(selectAll).is().present();
        selectAll.click();
        Graphene.waitGui().until().element(applySettings).is().present();
        applySettings.click();
    }

    public boolean confirmPanelMessage(final String eMessage) {
        Graphene.waitGui().until().element(displayMessage).text().contains(eMessage);
        return true;
    }

    public void closePanel() {
        Graphene.waitGui().until().element(panelClose).is().present();
        panelClose.click();
    }

    public void applySettings() {
        Graphene.waitGui().until().element(applySettings).is().present();
        applySettings.click();
    }

}
