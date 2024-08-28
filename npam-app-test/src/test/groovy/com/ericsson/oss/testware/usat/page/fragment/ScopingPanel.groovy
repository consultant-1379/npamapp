package com.ericsson.oss.testware.usat.page.fragment

//import org.jboss.arquillian.graphene.Graphene
//import org.openqa.selenium.By
import org.openqa.selenium.WebDriver
import org.openqa.selenium.WebElement
import org.openqa.selenium.support.FindBy

class ScopingPanel implements PageFragment{ // TO DO to be verified when ready other tabs
    // Topology Tab Fragment
    @FindBy(className = "elScopingPanel-rTabTopology")
    WebElement topologyTab

    @FindBy(className = "elScopingPanel-rTabTopology")
    TopologyTab topologyTabFragment

    // Search Tab Fragment
    @FindBy(className = "elScopingPanel-rTabSearch")
    WebElement searchTab

    @FindBy(className = "elScopingPanel-rTabSearch")
    SearchTab searchTabFragment

    // Collections Tab Fragment
    @FindBy(className = "elScopingPanel-rTabCollections")
    WebElement collectionsTab

    @FindBy(className = "elScopingPanel-rTabCollections")
    CollectionsTab collectionsTabFragment

    // SavedSearches Tab Fragment
    @FindBy(className = "elScopingPanel-rTabSavedSearches")
    WebElement savedSearchesTab

    @FindBy(className = "elScopingPanel-rTabSavedSearches")
    SavedSearchesTab savedSearchesTabFragment

    @FindBy(className = "ebCheckbox")
    WebElement CheckBox

    @FindBy(css = ".ebIcon.ebIcon_interactive.ebIcon_downArrow.elWidgets-ScrollBar-icon")
    WebElement virtualScrollDownArrow

    @FindBy(className = "elWidgets-ScrollBar-thumb")
    private WebElement scrollBar;

    // Clicks on required tab in Scoping Panel
    void selectScopingPanelTab(final String tabName) {
        final WebElement scopingPanelTab =
                root.findElement(By.xpath("//div[contains(text(), '" + tabName + "') and contains(@class, 'ebTabs-tabItem')]"))
        click(scopingPanelTab)
    }

    boolean isTabSelected(final String tabName) {
        final WebElement selectedScopingPanelTab =
                root.findElement(By.xpath("//div[contains(text(), '" + tabName + "') and contains(@class, 'ebTabs-tabItem_selected_true')]"))
        Graphene.waitGui().until().element(selectedScopingPanelTab).is().present()
        return true
    }

    // Actions on Topology Tab
    private TopologyTab getTopologyTabFragment() {
        waitPresent(topologyTab)
        return topologyTabFragment
    }

    void expandTopologyTabItem(final int index) {
        getTopologyTabFragment().expandTopologyTabItem(index)
    }

    void contractTopologyTabItem(final int index) {
        getTopologyTabFragment().contractTopologyTabItem(index)
    }

    void selectTopologyItems(WebDriver browser, final String... nodeItems) {
        getTopologyTabFragment().selectTopologyItems(browser, nodeItems)
    }

    boolean verifyTopologyItemsAreSelected(final String... nodeItems) {
        return getTopologyTabFragment().verifyTopologyItemsAreSelected(nodeItems)
    }

    void deselectAllVisibleTopologyItems(WebDriver browser) {
        getTopologyTabFragment().deselectAllVisibleTopologyItems(browser)
    }

    int getNumberOfSelectedTopoItems() {
        return getTopologyTabFragment().getNumberOfSelectedTopoItems()
    }


    void scrollDown(final int noOfRows) {
        for (int row = 0; row < noOfRows; row++) {
            click(virtualScrollDownArrow)
        }
    }

    // Actions on Search Tab
    private SearchTab getSearchTabFragment() {
        waitPresent(searchTab)
        return searchTabFragment
    }

    boolean isSearchCriteriaTextBoxAvailable() {
        return getSearchTabFragment().isSearchCriteriaTextBoxAvailable()
    }

    void searchForMoType(final String moTypeToBeSearched) {
        getSearchTabFragment().searchForMoType(moTypeToBeSearched)
        Thread.sleep(200)
    }

    void clearSearchData() {
        getSearchTabFragment().clearSearchData()
    }

    int getNumberOfSearchResults() {
        return getSearchTabFragment().getNumberOfSearchResults()
    }

    void clickRowsContainingMOName(final String... moNames) {
        getSearchTabFragment().clickRowsContainingMOName(moNames)
    }

    void selectAllSearchResults() {
        getSearchTabFragment().selectAllSearchResults()
    }

    void getNumberOfSelectedItemsInSearchTab() {
        getSearchTabFragment().getNumberOfSelectedItems()
    }

    // Actions on Collections Tab
    private CollectionsTab getCollectionsTabFragment() {
        waitPresent(collectionsTab)
        return collectionsTabFragment
    }

    void clickRowsContainingCollection(final String... collections) {
        getCollectionsTabFragment().clickRowsContainingCollection(collections)
    }

    void selectAllCollections() {
        getCollectionsTabFragment().selectAllCollections()
    }

    void getNumberOfSelectedItemsInCollectionsTab() {
        getCollectionsTabFragment().getNumberOfSelectedItems()
    }

    // Actions on Saved Searches Tab
    private SavedSearchesTab getSavedSearchesTabFragment() {
        waitPresent(savedSearchesTab)
        return savedSearchesTabFragment
    }

    void clickRowsContainingSavedSearch(final String... savedSearches) {
        getSavedSearchesTabFragment().clickRowsContainingSavedSearch(savedSearches)
    }

    void selectAllSavedSearches() {
        getSavedSearchesTabFragment().selectAllSavedSearches()
    }

    void getNumberOfSelectedItemsInSavedSearchesTab() {
        getSavedSearchesTabFragment().getNumberOfSelectedItems()
    }
}
