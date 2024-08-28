package com.ericsson.oss.testware.usat.page.fragment

import org.openqa.selenium.By
import org.openqa.selenium.WebElement
import org.openqa.selenium.support.FindBy

/**
 * Page fragment that represents the Saved Searches Tab in Scoping Panel widget.
 */
class SavedSearchesTab implements PageFragment { // to be checked

    @FindBy(className = "elTablelib-CheckboxHeaderCell-wrap")
    WebElement selectAllCheckBox

    @FindBy(className = "ebTableRow_highlighted")
    List<WebElement> selectedItems

    //Container Elements
    @FindBy(className = "eaContainer-LoaderOverlay-loaderAnimation")
    WebElement containerLoader

    void clickRowsContainingSavedSearch(final String... savedSearches) {
        for (final String savedSearch : savedSearches) {
            final WebElement element = root.findElement(By.xpath("//tr[td[text()='" + savedSearch + "']]/td[contains(@class, 'elTablelib-CheckboxCell')]"))
            click(element)
            waitNotPresent(containerLoader)
        }
    }

    void selectAllSavedSearches() {
        click(selectAllCheckBox)
    }

    int getNumberOfSelectedItems() {
        return selectedItems.size()
    }
}
