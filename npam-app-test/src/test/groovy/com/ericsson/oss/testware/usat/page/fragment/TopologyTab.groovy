package com.ericsson.oss.testware.usat.page.fragment

import org.jboss.arquillian.graphene.Graphene
import org.openqa.selenium.By
import org.openqa.selenium.Keys
import org.openqa.selenium.WebDriver
import org.openqa.selenium.WebElement
import org.openqa.selenium.interactions.Actions
import org.openqa.selenium.support.FindBy

class TopologyTab implements PageFragment {

    @FindBy(xpath = "//i[contains(@class, 'elDataviz-Item-expanderIcon')]")
    List<WebElement> expandTopologyTabItemIcon

    @FindBy(className = "elDataviz-Tree-items")
    WebElement nodeTree

    @FindBy(className = "elNetworkObjectLib-rTopologyHeader-selected-num")
    WebElement numSelectedNodes

    private static final String TOPOLOGY_ITEM_LABEL_CLASS = "elNetworkObjectLib-NodeItem-label"
    private static final String TOPOLOGY_ITEM_SELECTED_CLASS = "elDataviz-Item_selected"

    void expandTopologyTabItem(final int index) {
        Graphene.waitGui().until().element(expandTopologyTabItemIcon.get(index)).is().present()
        expandTopologyTabItemIcon.get(index).click()
    }

    void contractTopologyTabItem(final int index) {
        expandTopologyTabItemIcon.get(index).click()
    }

    /**
     * Deselect all Topology Tab items by looping through all with the selected class until none remain
     * It cannot deselect items hidden under a collapsed container (such as a subnetwork of folder of nodes). You must expand them first with {@code expandTopologyTabItem}
     */
    void deselectAllVisibleTopologyItems(WebDriver browser) {
        waitPresent(nodeTree)

        Actions builder = new Actions(browser)
        while (getNumberOfSelectedTopoItems() > 0) {
            final WebElement oneSelectedTopoItem = nodeTree.findElement(By.className(TOPOLOGY_ITEM_SELECTED_CLASS))
            holdCtrlAndClickOn(oneSelectedTopoItem, builder)
        }
    }

    /**
     * Robustly set the selected Topology tab items in the scoping panel
     * It cannot select/deselect items hidden under a collapsed container (such as a subnetwork of folder of nodes). You must expand them first with {@code expandTopologyTabItem}
     * @param topologyItemLabels list of strings, the labels for the topology items that will be selected
     */
    void selectTopologyItems(WebDriver browser, final String... topologyItemLabels) {
        deselectAllVisibleTopologyItems(browser)

        waitPresent(nodeTree)
        Actions builder = new Actions(browser)
        for (final String topologyItemLabel : topologyItemLabels) {
            Thread.sleep(200)
            selectItem(topologyItemLabel, builder)
        }
    }

    /**
     * Checks if the topology tab's selected items exactly matches a list of expected items
     * It cannot verify items hidden under a collapsed container (such as a subnetwork of folder of nodes). You must expand them first with {@code expandTopologyTabItem}
     * @param expectedItemLabels the names of the topology items that should be selected
     * @return False if an item wasn't select, there's any other items selected, or the scoping panel reports a different number of selected items
     */
    boolean verifyTopologyItemsAreSelected(final String... expectedItemLabels) {
        boolean expectedItemsAreSelected = true
        waitPresent(nodeTree)

        final HashSet<String> selectedItemLabels = getSelectedTopologyItemLabels()
        if (expectedItemLabels.length > 0) {
            for (final String expectedItem : expectedItemLabels) {
                if (!selectedItemLabels.contains(expectedItem)) {
                    expectedItemsAreSelected = false
                    break
                }
            }
        }
        return expectedItemsAreSelected && selectedItemLabels.size() == expectedItemLabels.length
    }

    /**
     * Select one item in the Topology Tab, and try again until it actually gets selected
     * @param topologyItemLabel string label for the item
     * @param builder an instantiated, but emptied, Selenium Actions executor
     */
    private void selectItem(final String topologyItemLabel, Actions builder) {
        boolean isItemSelected = false

        while (!isItemSelected) {
            final WebElement labelElement = nodeTree.findElement(By.xpath(".//span[contains(text(), '" + topologyItemLabel + "') and contains(@class, '" + TOPOLOGY_ITEM_LABEL_CLASS + "')]"))
            holdCtrlAndClickOn(labelElement, builder)

            // verify selection, and try again if it wasn't selected
            try {
                nodeTree.findElement(By.xpath(".//div[contains(@class, '" + TOPOLOGY_ITEM_SELECTED_CLASS + "')]//span[contains(text(), '" + topologyItemLabel + "') and contains(@class, '" + TOPOLOGY_ITEM_LABEL_CLASS + "')]"))
                isItemSelected = true
            } catch (NoSuchElementException e) {
                isItemSelected = false
            }
        }
    }

    /**
     * Simulate holding down the Ctrl key on the keyboard while clicking on a DOM element
     * @param element an existing WebElement that should be Control-clicked on
     * @param builder an instantiated, but emptied, Selenium Actions executor
     */
    private void holdCtrlAndClickOn(WebElement element, Actions builder) {
        builder.keyDown(Keys.CONTROL).click(element).keyUp(Keys.CONTROL).build().perform()
    }

    /**
     * Get number of selected Topology items based on the scoping panel's "Selected" label
     * @return int The contents of the label at the top fo the scoping panel
     */
    int getNumberOfSelectedTopoItems() {
        Graphene.waitGui().until().element(numSelectedNodes).is().present()
        final String numberOfNodes = numSelectedNodes.getText()
        return numberOfNodes.isEmpty() ? 0 : Integer.parseInt(numberOfNodes)
    }

    private HashSet<String> getSelectedTopologyItemLabels() {
        final List<WebElement> selectedTopologyItems = new ArrayList<>()
        selectedTopologyItems.addAll(nodeTree.findElements(By.className(TOPOLOGY_ITEM_SELECTED_CLASS)))
        final HashSet<String> selectedLabels = new HashSet<>()
        for (WebElement element : selectedTopologyItems) {
            WebElement textElement = element.findElement(By.className(TOPOLOGY_ITEM_LABEL_CLASS))
            selectedLabels.add(textElement.getText())
        }
        return selectedLabels
    }
}
