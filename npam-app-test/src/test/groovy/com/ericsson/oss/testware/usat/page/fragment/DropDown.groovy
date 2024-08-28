package com.ericsson.oss.testware.usat.page.fragment

import org.openqa.selenium.WebElement
import org.openqa.selenium.support.FindBy

class DropDown implements PageFragment{
    @FindBy(className = "ebComponentList-item")
    List<WebElement> dropDownItems

    @FindBy(className = "ebComponentList-items")
    WebElement dropDownItemsHolder

    public boolean selectItemFromDropdown(final String itemName) {
        waitVisible(dropDownItemsHolder)
        for (final WebElement item : dropDownItems) {
            if (item.getText().contains(itemName)) {
                item.click()
                return true;
            }
        }
        return false;
    }

    boolean hasDropdownItems(final String... itemNames) {
        for (final String itemName : itemNames) {
            for (final WebElement item : dropDownItems) {
                if (item.getText() == itemName) {
                    return true
                }
            }
        }
        return false
    }
}
