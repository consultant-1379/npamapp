package com.ericsson.oss.testware.usat.page.fragment

import org.jboss.arquillian.graphene.Graphene
import org.openqa.selenium.By
import org.openqa.selenium.WebElement
import org.openqa.selenium.support.FindBy

class SearchTab implements PageFragment {

    @FindBy(className = "elNetworkExplorerLib-wSimpleSearchInput-searchInput")
    private WebElement searchCriteriaTextBox

    @FindBy(className = "elNetworkExplorerLib-rSimpleSearch-form-searchBtn")
    private WebElement searchButton

    @FindBy(className = "elNetworkExplorerLib-wSimpleSearchInput-searchCancel")
    private WebElement clearSearchData

    @FindBy(css = ".ebTableRow")
    private List<WebElement> tableRows

    @FindBy(className = "elTablelib-CheckboxHeaderCell-wrap")
    private WebElement selectAllCheckBox

    @FindBy(className = "ebTableRow_highlighted")
    private List<WebElement> selectedItems

    /*
    boolean isSearchCriteriaTextBoxAvailable() {
        Graphene.waitGui().until().element(searchCriteriaTextBox).is().present()
        return true;
    }
*/
    void searchForMoType(final String moTypeToBeSearched) {
        searchCriteriaTextBox.sendKeys(moTypeToBeSearched)
        waitPresent(searchButton)
        Graphene.guardAjax(searchButton).click()
    }

    void clearSearchData() {
        click(clearSearchData)
    }

    int getNumberOfSearchResults() {
        final int result = tableRows.size()
        return result - 1 // Reduce by 1 to remove header row
    }

    void clickRowsContainingMOName(final String... moNames) {
        for (final String moName : moNames) {
            final WebElement element = root.findElement(By.xpath("//tr[td[text()='" + moName + "']]/td[contains(@class, 'elTablelib-CheckboxCell')]"))
            click(element)
        }
    }

    void selectAllSearchResults() {
        Graphene.guardAjax(selectAllCheckBox).click()
    }

    int getNumberOfSelectedItems() {
        return selectedItems.size()
    }
}
