package com.ericsson.oss.testware.usat.page.fragment

import org.openqa.selenium.By
import org.openqa.selenium.WebElement
import org.openqa.selenium.support.FindBy

/**
 * Page fragment that represents the Collections Tab in Scoping Panel widget.
 */
class CollectionsTab implements PageFragment { // selectors to be checked

    @FindBy(className = "elTablelib-CheckboxHeaderCell-wrap")
    WebElement selectAllCheckBox

    @FindBy(className = "ebTableRow_highlighted")
    List<WebElement> selectedItems

    void clickRowsContainingCollection(final String... collections) {
        for (final String collection : collections) {
            // TODO: Search from the root element, which is the container of this element.
            final WebElement element = root.findElement(By.xpath("//tr[td[text()='" + collection + "']]/td[contains(@class, 'elTablelib-CheckboxCell')]"))
            click(element)
        }
    }

    void selectAllCollections() {
        click(selectAllCheckBox)
    }

    int getNumberOfSelectedItems() {
        return selectedItems.size()
    }
}
