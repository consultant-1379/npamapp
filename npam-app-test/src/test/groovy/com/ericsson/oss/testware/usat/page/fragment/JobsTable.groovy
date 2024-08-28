/*------------------------------------------------------------------------------
 *******************************************************************************
 * COPYRIGHT Ericsson 2022
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************
 *----------------------------------------------------------------------------*/
package com.ericsson.oss.testware.usat.page.fragment

import org.jboss.arquillian.graphene.Graphene
import org.openqa.selenium.By
import org.openqa.selenium.NoSuchElementException
import org.openqa.selenium.WebDriver
import org.openqa.selenium.WebElement
import org.openqa.selenium.interactions.Actions
import org.openqa.selenium.support.FindBy

/**
 * Page fragment that represents the table.
 */
class JobsTable implements PageFragment {

    @FindBy(xpath = "//tbody[@class='elTablelib-Table-body']")
    WebElement tableBody

    @FindBy(className = "elTablelib-Table-pretable")
    WebElement pretable

    @FindBy(className = "eaNpamjob-rJobDetails")
    WebElement tablePlaceholder

    @FindBy(css = ".elTablelib-Table-wrapper tbody>tr.ebTableRow")
    List<WebElement> tableRows

    @FindBy(css = ".elTablelib-Table-wrapper .ebTableRow_highlighted")
    List<WebElement> selectedRows

    // First checkbox selector in NE accounts table
    @FindBy(css = ".elTablelib-Table-body > tr:nth-child(1) > td:nth-child(1)")
    WebElement firstCheckBoxInJobsTable

//    @FindBy(css = ".eaNpamapp-NeAccountTable-SectionHeading-selected-clear-link")
//    WebElement clearLink

    @FindBy(css = ".ebIcon.ebIcon_interactive.ebIcon_downArrow.elWidgets-ScrollBar-icon")
    WebElement virtualScrollDownArrow

    @FindBy(css = ".ebIcon.ebIcon_interactive.ebIcon_upArrow.elWidgets-ScrollBar-icon")
    WebElement virtualScrollUpArrow

    @FindBy(className = "elTablelib-CheckboxHeaderCell-wrap")
    WebElement selectAllCheckbox

    @FindBy(className = "ebTable-headerResize")
    List<WebElement> resizableHeader

    @FindBy(className = "ebTable-headerText")
    List<WebElement> tableColumnNames

    //@FindBy(className = "eaCellManagement-wTableHeader-filtersAppliedText")
    // This is a list of selectors to be investigated
    @FindBy(css = ".elTablelib-QuickFilter-text")
    WebElement clearFiltersText

    @FindBy(css = ".ebIcon.ebIcon_refresh.elNetworkObjectLib-rTopologyHeader-refresh-icon")
    WebElement refreshIcon

    @FindBy(className = "elTablelib-Table-header")
    List<WebElement> tableHeader

    @FindBy(className = "elTablelib-Table-body")
    private List<WebElement> tableContent

    // left here but not sure if this is ok
    @FindBy(className = "elTablelib-VirtualScrolling-loader-content")
    WebElement virtualScrollingLoader

    // To be checked but it should be ok
    void selectAllRows() {
        waitPresent(selectAllCheckbox)
        selectAllCheckbox.click()
    }

    // changed selector to verify if the associated functions are ok
//    private static final String CELL_PARAM_TABLE_CLASS = "eaNpamapp-rMain-neAccountTabPlaceholder"
    // actually this is not present but left here for future developments in case of context menu
    private static final String CONTEXT_MENU_ITEM_CLASS = "ebComponentList-item-name"


    private static final String TABLE_ROW_CLASS = "ebTableRow"

   // to be verified if it is ok, it has been adapted as table is not existing but only tablePlaceholder exists
    void waitUntilTableRowsRendered() {
        if (tablePlaceholder.displayed && getNumberOfVisibleRows() > 0) {
            waitNotVisible(virtualScrollingLoader)
        }
    }

//    void selectNeAccountsTab(WebDriver browser, final String tabName) {
//        sleep(300)
//        for(WebElement button:neAccountsTab){
//            println("I am selecting Ne Account Tab..." + button)
//            println("The text in Ne Account Tab is..." + button.getText())
//            if(button.getText().startsWith(tabName)) {
//                button.click()
//            }
//        }
//    }
    /**
     * Gets the number of rows in the table that are within the browser viewport
     * This method counts DOM elements and will not report an accurate number of EUtranCells if the table has a scrollbar, i.e. more cells then can fit in the viewport
     * @return The number of rows visible in the table
     */
    // to be checked
    int getNumberOfVisibleRows() {
        Thread.sleep(1000)
        waitPresent(tablePlaceholder)
        return tableRows.size()
    }
    /**
     * Gets the number selected rows that are within the browser viewport
     * This method counts DOM elements and will not count selected rows that have been scrolled out of view
     * @return The number of visible, selected rows in the table
     */
    // to be checked
    int getNumberOfVisibleSelectedRows() {
        Thread.sleep(1000)
        waitPresent(tablePlaceholder)
        return selectedRows.size()
    }

    List verifyColumnNamesList() {
        List columnNames = new ArrayList()
        for(WebElement columnName : tableColumnNames) {
            columnNames.add(columnName.getText());
        }
        Thread.sleep(1000)
        return columnNames
    }

    /**
     * Gets the number of selected records in the table, as reported in the table header.
     */
    // to be checked for sure to be changed accordingly to selector
 /*   int getNumberOfSelectedRows() {
        waitPresent(selectedRowsSpan)
        return Integer.parseInt(selectedRowsSpan.getText())
    }

    /**
     * Gets the total number of records in the table, as reported in the table header.
     */
/*    int getTotalNumberOfRows() {
        waitPresent(totalRowsSpan)
        return Integer.parseInt(totalRowsSpan.getText())
    }

 */
    /**
     * Gets the total number of records in the table, as reported in the table header.
     */
  /*  int getTotalNumberOfRowsRendered() {
        waitUntilTableRowsRendered()
        waitPresent(totalRowsSpan)
        return Integer.parseInt(totalRowsSpan.getText())
    }
*/
    /**
     * Click 'Clear' link which is part of the table header.
     */
    // to be checked
    void clickClearLink() {
        waitPresent(clearLink)
        clearLink.click()
    }

    boolean hasNotClearLink() {
        waitNotVisible(clearLink)
        return true
    }

    boolean hasClearLink() {
        waitPresent(clearLink)
        return true
    }

    boolean checkClearFiltersText(header){
        if(clearFiltersText.getText() == header){
            return true
        }
        return false
    }

   /* boolean checkNoCellsMatched(header){
        if(noCellsMatchedHeader.getText() == header){
            return true
        }
        return false
    }

*/

    /**
     * Click a number of rows, each one chosen because it contains a cell with the text provided in a list
     * @param cellText list of strings, each of which is expected to uniquely identify one table cell
     */
    // to be verified - maybe this can be maintened
    void clickRowsContainingCellWithText(final String... cellText) {
        waitUntilTableRowsRendered()
        List<WebElement> checkboxes = pretable.findElements(By.className('elTablelib-CheckboxCell'))
        cellText.each { text -> clickCellWithText(text,checkboxes) }
    }

    void clickRowsContainingCellWithTextCreateRelation(final String... cellText) {
        waitPresent(table)
        cellText.each { text -> clickCellWithTextCreateRelation(text) }
    }

    /**
     * Click a cell that is within the table which contains the text provided
     * @param text the contents of the cell
     * @param checkboxes contains the list of checkboxes within the cells table
     */
// to be checked
    private void clickCellWithText(final String text, final  List<String> checkboxes) {
        for (int i = 0; i < tableRows.size(); i++) {
            if (tableRows[i].getText().contains(text)) {
                checkboxes[i].click()
                break;
            }
        }
    }
//  to be checked
    private void clickCellWithTextCreateRelation(final String text) {
        for (int i = 0; i < tableRows.size(); i++) {
            if (tableRows[i].getText().contains(text)) {
                tableRows[i].click()
                break;
            }
        }
    }

    /**
     * Check if a table contains a particular piece of text
     * The search is performed across the entire table, except the header row.
     * @param expectedText The string to search for
     */
    // to be checked
    boolean containsRowWith(final String expectedText) {
        Graphene.waitGui().until().element(table).is().present()
        Thread.sleep(1000)
        for (final WebElement tableRow : tableRows) {
            if (tableRow.getText().contains(expectedText)) {
                return true
            }
        }
        return false
    }

    /**
     * Simulate a right-click on a row within the table
     * @param cellName The Cell Name that identifies the row to right click on
     * @param contextMenuAction The item in the context menu to execute
     */
    // Left here for future development
    void performContextMenuActionOnRow(WebDriver browser, final String cellName, final String contextMenuAction) {
        openContextMenuOnRow(browser, cellName)
        findContextMenuItemWithClassName(contextMenuAction, CONTEXT_MENU_ITEM_CLASS).click()
    }

    /**
     * After right clicking on a row, a context menu will appear with an exact list of items (an no extra)
     * @param cellName specify which row to click on via it's EUtranCell Name
     * @param contextMenuActions a list of the text captions of the context menu items
     * @return true if all context menu actions appear in the menu, false if any are missing or there are any extra
     */
    // Left here for future development
    boolean doesContextMenuOnRowHaveExactItems(WebDriver browser,
                                               final String cellName, final String... contextMenuActions) {
        openContextMenuOnRow(browser, cellName)
        final List<String> contextMenuLabels = getLabelsFromOpenedContextMenuWithClassName(browser, CONTEXT_MENU_ITEM_CLASS)
        return contextMenuLabels.size() == contextMenuActions.length && contextMenuLabels.containsAll(Arrays.asList(contextMenuActions))
    }

    /**
     * Returns a DOM element of a list item in the UI SDK context menu
     * @param contextMenuAction the text caption of the context menu item
     * @param className the class name of the context menu item
     * @return WebElement representing the DOM element
     */
    private WebElement findContextMenuItemWithClassName(final String contextMenuAction, final String className) {
        final String queryForContextMenuItem = "//div[contains(text(), '" + contextMenuAction + "') and contains(@class, '" + className + "')]"
        final WebElement contextMenuItem = root.findElement(By.xpath(queryForContextMenuItem))
        Graphene.waitGui().until().element(contextMenuItem).is().present()
        return contextMenuItem
    }

    void waitForLoad() {
        waitVisible(tableBody)
    }
    /**
     * Right click on the row
     * @param cellName specify which row to click on
     */
    // to be verified
    private void openContextMenuOnRow(WebDriver browser, String cellName) {
        final String queryForCellWithinCellParametersTable = "//div[contains(@class, '" + CELL_PARAM_TABLE_CLASS + "')]//tr[contains(@class, '" + TABLE_ROW_CLASS + "')]//*[text()='" + cellName + "']"
        final WebElement cell = root.findElement(By.xpath(queryForCellWithinCellParametersTable))

        Graphene.waitGui().until().element(cell).is().present()
        Actions actions = new Actions(browser)
        actions.contextClick(cell).perform()
    }

    /**
     * Get all context menu items as strings for the supplied classname
     * @param className , the className of the items for which labels to be retrieved
     * @return a list of the context menu items, as their labels returned from getText()
     */
    private List<String> getLabelsFromOpenedContextMenuWithClassName(WebDriver browser, String className) {
        final List<WebElement> contextMenuElements = browser.findElements(By.className(className))

        // map list of WebElements to a list of their text labels
        final List<String> contextMenuLabels = new ArrayList<>(contextMenuElements.size())
        for (WebElement item : contextMenuElements) {
            contextMenuLabels.add(item.getText())
        }
        return contextMenuLabels
    }

/*
    boolean isVirtualScrollBarDisplayed() {
        waitVisible(virtualScrollBar)
        return true
    }
*/
    /**
     * Click the down arrow on the virtual scrollbar
     */
    // To be checked
    void scrollDown(final int noOfRows) {
        for (int row = 0; row < noOfRows; row++) {
            click(virtualScrollDownArrow)
        }
    }

    /**
     * Click the up arrow on the virtual scrollbar
     */
    // To be checked
    void scrollUp(final int noOfRows) {
        for (int row = 0; row < noOfRows; row++) {
            click(virtualScrollUpArrow)
        }
    }
/*
    String getScrollBarAnnotationText() {
        return scrollBarAnnotationText.getText()
    }
*/

    // To be checked but it should be ok
    private void resizeColumn(WebDriver browser, int columnIndex, int offset) {
        Graphene.waitGui().until().element(resizableHeader.get(columnIndex)).is().present()
        Actions action = new Actions(browser)
        action.clickAndHold(resizableHeader.get(0)).moveByOffset(offset, 0).release().build().perform();

    }

    // to be verified
    private String getColumnWidth(WebDriver browser, String cellName) {
        final String queryForCellWithinCellParametersTable = "//div[contains(@class, '" + CELL_PARAM_TABLE_CLASS + "')]//tr[contains(@class, '" + TABLE_ROW_CLASS + "')]/td[text()='" + cellName + "']"
        final WebElement cell = root.findElement(By.xpath(queryForCellWithinCellParametersTable))
        Graphene.waitGui().until().element(cell).is().present()
        return cell.getCssValue("width")
    }

    // it should be ok
    void clickRefreshIcon() {
        Graphene.waitGui().until().element(refreshIcon).is().present()
        Graphene.waitGui().until().element(refreshIcon).is().clickable()
        refreshIcon.click()
    }

    boolean isSortIconVisible(String colName) {
        try {
            getSortIcon(colName);
            return true;
        } catch (NoSuchElementException e) {
//            logger.error("Sort icon not visible {}", e);
            return false;
        }
    }

    // It should be ok
    WebElement getSortIcon(String columnName) {
        List<WebElement> columnCells = tableHeader.get(0).findElements(By.xpath("tr/th"));
        WebElement sortIcon = null;
        for (int i = 0; i < columnCells.size(); i++) {
            if (columnCells.get(i).getText().equals(columnName)) {
                sortIcon = columnCells.get(i).findElement(By.className("ebTable-headerSort"));
                break;
            }
        }
        if (sortIcon == null) {
            throw new NoSuchElementException("Info popup not found for " + columnName);
        }
        return sortIcon;
    }

    void clickSortIcon(String columnName) {
        WebElement sortIcon = getSortIcon(columnName);
        sortIcon.click();
    }

    // it should be ok
    int getColumnIndex(String columnName) {
        List<WebElement> headerCellElements = tableHeader.get(0).findElements(By.xpath("tr/th"));
        if(tableHeader.size() > 1) {
            headerCellElements = tableHeader.get(1).findElements(By.xpath("tr/th"));
        }
        int colIndex = -1;
        for (int i = 0; i < headerCellElements.size(); i++) {
            if (headerCellElements.get(i).getText().equals(columnName)) {
                colIndex = i;
                break;
            }
        }
        return colIndex;
    }

    String getCellText(final int rowIndex, final String columnName) {
        List<WebElement> tableRows = tableContent.get(0).findElements(By.xpath("tr"));
        List<WebElement> tableCells = tableRows.get(rowIndex).findElements(By.xpath("td"));
        int colIndex = getColumnIndex(columnName);
        return tableCells.get(colIndex).getText().trim();
    }

    boolean isSortIconHighLighted(String columnName) {
        WebElement sortedIcon = getSortIcon(columnName).findElement(By.className("ebSort-arrow_up"));
        return sortedIcon.getAttribute("class").contains("active");
    }

    void clickFirstTableRow() {
        click(firstCheckBoxInNeAccoutTable)
    }

}
