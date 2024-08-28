package com.ericsson.oss.testware.usat.page.fragment

import org.jboss.arquillian.graphene.findby.FindByJQuery
import org.openqa.selenium.By
import org.openqa.selenium.WebElement
import org.openqa.selenium.support.FindBy


// preso da node-security-ui
class NetworkExplorerPanel implements PageFragment {

    @FindBy(xpath = "//div[@class = 'ebTabs-tabItem ebTabs-tabItem_closable_false' and text() = 'Search']")
    WebElement searchTab

    @FindBy(css = "input.elNetworkExplorerLib-wSimpleSearchInput-searchInput.ebInput")
    WebElement searchField

    @FindBy(css = ".elNetworkExplorerLib-rSimpleSearch-form-searchBtnIcon.ebIcon.ebIcon_searchWhite")
    WebElement searchButton

    @FindBy(xpath = "//div[@class = 'ebTabs-tabItem ebTabs-tabItem_closable_false' and text() = 'Topology']")
    WebElement topologyTab

//    @FindByJQuery(".elNetworkObjectLib-NodeItem:eq(0)")
    @FindBy(xpath = "//div[@class='elDataviz-Item '][div[@class='elDataviz-Item-label elDataviz-Item-label_selectable']/div/span[@class='elNetworkObjectLib-NodeItem-label' and text()='x-nodes']]/div[@class='elDataviz-Item-label elDataviz-Item-label_selectable']/div")
    WebElement subnetworkItem

//    @FindByJQuery(".elDataviz-Item-expander.elDataviz-Item-expander_show:eq(0)")
    @FindBy(xpath = "//div[@class='elDataviz-Item '][div[@class='elDataviz-Item-label elDataviz-Item-label_selectable']/div/span[@class='elNetworkObjectLib-NodeItem-label' and text()='x-nodes']]/div[@class='elDataviz-Item-expander elDataviz-Item-expander_show']/i")
    WebElement itemExpander

    @FindBy(xpath = "//div[@class = 'ebTabs-tabItem ebTabs-tabItem_closable_false' and text() = 'Collections']")
    WebElement collectionsTab

    @FindBy(xpath = "//div[@class = 'ebTabs-tabItem ebTabs-tabItem_closable_false' and text() = 'Saved Searches']")
    WebElement savedSearches

    @FindBy(xpath = "//div[@class = 'ebTabs-tabItem ebTabs-tabItem_closable_false ebTabs-tabItem_selected_true' and text() = 'Topology']")
    WebElement topologyTabSelected

    @FindBy(css = "table > tbody > tr:nth-child(1) > td.elTablelib-CheckboxCell > div")
    WebElement tableRow

    @FindBy(xpath = "//button[@class='ebBtn ebBtn_medium ebBtn_color_paleBlue'][span[@class ='ebBtn-caption' and text() = 'Add']]")
    WebElement addButton

    @FindBy(xpath = "//button[@class='ebBtn ebBtn_medium'][span[@class ='ebBtn-caption' and text() = 'Cancel']]")
    WebElement cancelButton

    @FindBy(xpath = "//th[contains(@class, 'elTablelib-CheckboxHeaderCell')]")
    WebElement checkboxHeaderCell

    @FindBy(xpath = "//label[@class = 'ebNotification-label elWidgets-Notification-label']")
    WebElement notificationToast

    @FindBy(xpath = "//div[@class = 'elNetworkExplorerLib-wResultsTable']")
    WebElement netExpResult

    String checkBoxSelector = "table > tbody > tr > td.elTablelib-CheckboxCell > .elTablelib-CheckboxCell-wrap .ebCheckbox"
    String collectionsAndSavedSearchesCellSelector = "//div[@class='ebTabs-contentDiv']//tr[@class='ebTableRow elTablelib-row'][td[contains(@class,'ebTableCell elNetworkExplorerLib-rCollectionsCommon-content-tableCell') and text()='"
    String searchNodeCellSelector = "//div[@class='ebTabs-contentDiv']//tr[@class='ebTableRow elTablelib-row'][td[@class='ebTableCell' and @title='"
    String cellCheckBoxSelector = "']]/td[@class='elTablelib-CheckboxCell ebTableCell']/div/input"
    String topologyNodeSelector = "//span[@class='elNetworkObjectLib-NodeItem-label' and text()='"

    void addAllNetworkObject() {
        waitVisible(checkboxHeaderCell)
        click(checkboxHeaderCell)
        clickAddButton()
    }

    void searchForNetworkObjectNoAdd(final String searchString) {
        waitVisible(searchTab)
        enterNodesToSearch(searchString)
        clickSearchForNodes()

    }

    void enterNodesToSearch(final String searchString) {
        click(searchTab)
        waitVisible(searchField)
        searchField.sendKeys(searchString)
    }

    void clickAddButton () {
        click(addButton)
    }

    void clickCancelButton () {
        click(cancelButton)
    }

    void clickSearchForNodes() {
        click(searchButton)
    }

    void clickCheckBoxByName (final String name, final String cellSelector){
        waitVisible(tableRow)
        String selector = cellSelector + name + cellCheckBoxSelector
        List<WebElement> checkboxes = root.findElements(By.xpath(selector))
        if(checkboxes.size() > 0) {
            checkboxes[0].click()
        }
    }

    void selectSearchedNodeByName(nodeName) {
        clickCheckBoxByName(nodeName, searchNodeCellSelector)
    }

    void addSubnetwork(){
        click(subnetworkItem)
        clickAddButton()
    }

    void addSingleNodeFromTopology(final String nodeName) {
        waitVisible(topologyTabSelected)
        click(itemExpander)
        String selector = topologyNodeSelector + nodeName + "']"
        List<WebElement> nodes = root.findElements(By.xpath(selector))
        if(nodes.size() > 0) {
            nodes[0].click()
        }
        clickAddButton()
    }

    void clickCollectionsTab () {
        click(collectionsTab)
    }

    void clickCollectionsTabAndAddByName (final String name) {
        clickCollectionsTab()
        clickCheckBoxByName(name, collectionsAndSavedSearchesCellSelector)
        clickAddButton()
    }

    void clickSavedSearchTabAndAddByName (final String name) {
        clickSavedSearchTab()
        clickCheckBoxByName(name, collectionsAndSavedSearchesCellSelector)
        clickAddButton()
    }

    void clickSavedSearchTab () {
        click(savedSearches)
    }

    void clickAndReturnNodesFromIndex(final int numberOfCheckBoxes, final int index) {

        waitVisible(tableRow)
        List<WebElement> nameRows1 = root.findElements(By.cssSelector(checkBoxSelector))
        for (int i = index; i < index+numberOfCheckBoxes; i++) {
            nameRows1.get(i).click()
        }
        clickAddButton()
    }

    void clickAndReturnNodes(final int numberOfCheckBoxes) {

        waitVisible(tableRow)
        List<WebElement> nameRows1 = root.findElements(By.cssSelector(checkBoxSelector))
        for (int i = 0; i < numberOfCheckBoxes; i++) {
            nameRows1.get(i).click()
        }
        clickAddButton()
    }

    void clickAndReturnNodeByName(final String searchString) {
        waitVisible(netExpResult)
        String nodeSelector = searchNodeCellSelector + searchString + cellCheckBoxSelector
        List<WebElement> nodeCheckboxes = root.findElements(By.xpath(nodeSelector))
        if(nodeCheckboxes.size() > 0) {
            nodeCheckboxes[0].click()
        }
        clickAddButton()
    }

    String getNotificationToastContent() {
        waitVisible(notificationToast)
        return notificationToast.getText()
    }

}