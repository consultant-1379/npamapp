package com.ericsson.oss.testware.usat.page.fragment

import java.util.ArrayList;
import java.util.List;

import org.jboss.arquillian.drone.api.annotation.Drone;
import org.jboss.arquillian.graphene.Graphene;
import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.FindBy;

/**
 * Page fragment that represents the table widget in the single page application.
 */
public class TableFragment extends IndexOutOfBoundsException implements PageFragment {

    @FindBy(className = "elTablelib-Table")
    private WebElement table;

    @FindBy(css = ".ebTable-headerText")
    private List<WebElement> tableHeaders;

    @FindBy(css = ".ebTable-header .ebTable-headerText")
    private List<WebElement> upPkgsTableHeaders;

    @FindBy(className = "elTablelib-Table-body")
    private WebElement tableBody;

    @FindBy(css = ".elTablelib-Table-body .ebTableRow")
    private List<WebElement> tableRows;

    @FindBy(className = "ebTableRow_highlighted")
    private List<WebElement> selectedRows;

    @FindBy(className = "elTablelib-CheckboxHeaderCell")
    private WebElement headerCheckbox;

    @FindBy(className = "elTablelib-CheckboxCell")
    private List<WebElement> checkboxes;

    @FindBy(className = "ebTable-th_resizable")
    private List<WebElement> supportedHeaders;

    @FindBy(css = ".ebComponentList-items")
    private List<WebElement> dropDownOptions;

    @FindBy(className = "eaNpamlibrary-FilterHeaderCell-options")
    private WebElement filterOption;

    @FindBy(className = "eaNpamlibrary-FilterOptions")
    private WebElement filterButton;

    @FindBy(className = "eaNpamlibrary-FilterHeaderCell-cancelButton")
    private WebElement cancelButton;


    public int getNumberOfTableRows() {
        final int result = tableRows.size();
        return result;
    }

//    public int getNumberOfSelectedRows() {
//        return selectedRows.size()/2;
//    }

    public int getSelectedRows() {
        return selectedRows.size();
    }

    public boolean checkExistRowsWithText(final String textValueOfCell) {
        for (final WebElement row : tableRows) {
            final List<WebElement> rowCells = row.findElements(By.xpath("td"));
            for (final WebElement cell : rowCells) {
                if (cell.getText().contains(textValueOfCell)) {
                    return true;
                }
            }
        }
        return false;
    }


    public int getNumberOfColumnHeaders() {
        return tableHeaders.size();
    }

    public void setFilterOption() {
        Graphene.waitGui().until().element(filterOption).is().present();
        filterOption.click();
    }

    public void clickCancelBtn(final String columnName) {
        final List<WebElement> columnHeaders = browser.findElements(By.xpath("//span[contains(@class, 'ebTable-headerText')]"));
        int columnIndex = -1;
        for (int i = 0; i < columnHeaders.size(); i++) {
            final WebElement column = columnHeaders.get(i);
            if (column.getText().contains(columnName)) {
                columnIndex = i;
                break;
            }
        }

        final WebElement c = columnHeaders.get(0);
        final List<WebElement> columnCancelBtns;
        columnCancelBtns = browser.findElements(By.xpath("//div[contains(@class, 'hasNodeNameInFlyoutAsDetailsPanel" +
                "-FilterHeaderCell-cancelButton')]"));

        for (int j = 0; j < columnCancelBtns.size(); j++) {
            final WebElement cancelButton = columnCancelBtns.get(j);
            if (columnIndex == j) {
                cancelButton.click();
                break;
            }
        }
    }

    public void selectRow(final int checkBoxRow) {
        Graphene.waitGui().until().element(table).is().visible();
        checkboxes.get(checkBoxRow).click();
    }

    public void getSelectedRow(final int checkBoxRow) {
        Graphene.waitGui().until().element(table).is().visible();
        checkboxes.get(checkBoxRow).click();
    }

    public String getSelectedColumnvalues(final int rowNumber, final int column1, final int column2) {
        Graphene.waitGui().until().element(table).is().visible();
        final List<WebElement> rowData = tableRows.get(rowNumber).findElements(By.xpath("td"));
        final String Column1 = rowData.get(column1).getText();
        final String Column2 = rowData.get(column2).getText();
        return Column1 + " : " + Column2;
    }

    public int getNumberOfSupportedColumnHeaders() {
        return supportedHeaders.size();
    }

    public String getColumnValue(final int rowNumber, final int column) {
        Graphene.waitGui().until().element(table).is().visible();
        Graphene.waitGui().until().element(tableRows.get(rowNumber)).is().visible();
        final List<WebElement> rowData = tableRows.get(rowNumber).findElements(By.xpath("td"));
        return rowData.get(column).getText();
    }

    public void selectRowWithoutCheckboxes(final int rowNumber) {
        Graphene.waitGui().until().element(table).is().visible();
        tableRows.get(rowNumber).click();
    }

    public boolean selectRowWithCellValue(final String cellValue, final boolean hasCheckBox) {
        int index = 0;
        for (final WebElement row : tableRows) {
            List<WebElement> rowCells = row.findElements(By.xpath("td"));
            for (final WebElement cell : rowCells) {
                if (cell.getText().contains(cellValue)) {
                    if(hasCheckBox){
                        checkboxes.get(index).click();
                    }else{
                        cell.click();
                    }
                    return true;
                }
            }
            index++;
        }
        return false;
    }

    public void selectAllRowsWithStatus(final String textValueOfCell) {
        for (final WebElement row : tableRows) {
            final List<WebElement> rowCells = row.findElements(By.xpath("td"));
            for (final WebElement cell : rowCells) {
                if (cell.getText().contains(textValueOfCell)) {
                    row.findElement(By.cssSelector(".elTablelib-CheckboxCell")).click();
                }
            }
        }
    }

    public void checkTableHeader() {
        Graphene.waitGui().until().element(headerCheckbox).is().present();
        headerCheckbox.click();
    }

    public boolean checkTableDataNew(final List<String> tableData, final int value) {
        int index = 0;
        boolean matchFound = false;
        for (final WebElement row : tableRows) {
            final List<WebElement> cells = row.findElements(By.xpath("td"));
            if (cells.size() > 0) {
                if (cells.get(value).getText().equals(tableData.get(index))) {
                    matchFound = true;
                    break;
                }
                index++;
            }
        }
        return matchFound;
    }

    public boolean checkTableData(final List<String> tableData, final int value) {
        int index = 0;
        boolean matchFound = true;
        for (final WebElement row : tableRows) {
            final List<WebElement> cells = row.findElements(By.xpath("td"));
            if (cells.size() > 0) {
                if (!cells.get(value).getText().equals(tableData.get(index))) {
                    matchFound = false;
                    break;
                }
                index++;
            }
        }
        return matchFound;
    }



    public boolean checkHeaderValueExists(final String headerName) {
        Graphene.waitGui().until().element(table).is().present();
        for (final WebElement element : supportedHeaders) {
            if (element.getText().contains(headerName)) {
                return true;
            }
        }
        return false;
    }

    public void sortColumn(final String columnName) {
        final WebElement header = browser
                .findElement(By.xpath("//span[contains(text(), '" + columnName + "') and contains(@class, 'ebTable-headerText')]"));
        Graphene.waitGui().until().element(header).is().present();
        header.click();
    }

    public void sortUpPkgsColumn(String columnName) {
        for (int i = 0; i < upPkgsTableHeaders.size(); i++) {
            final WebElement header = upPkgsTableHeaders.get(i);
            Graphene.waitGui().until().element(header).is().present();
            if (header.getText().equals(columnName)) {
                header.click();
                break;
            }
        }
    }

    public boolean isSWPkgSelected(final String pkgName) {
        boolean matchFound = false;
        Graphene.waitGui().until().element(table).is().visible();
        for (final WebElement row : tableRows) {
            if (row.getAttribute("class").contains("ebTableRow ebTableRow_highlighted")) {
                final List<WebElement> cells = row.findElements(By.xpath("td"));
                if (cells.get(0).getText().contains(pkgName)) {
                    matchFound = true;
                    break;
                }
            }
        }
        return matchFound;
    }

    public void setFilterText(final String columnName, final String filterText) {
        final List<WebElement> columnHeaders = browser.findElements(By.xpath("//span[contains(@class, 'ebTable-headerText')]"));
        int columnIndex = -1;
        for (int i = 0; i < columnHeaders.size(); i++) {
            final WebElement column = columnHeaders.get(i);
            if (column.getText().contains(columnName)) {
                columnIndex = i;
                break;
            }
        }

        final WebElement c = columnHeaders.get(0);
        final List<WebElement> columnInputFields;
        columnInputFields = browser.findElements(By.xpath("//input[contains(@class, 'eaNpamlibrary-FilterHeaderCell-input')]"));

        for (int j = 0; j < columnInputFields.size(); j++) {
            final WebElement columnInput = columnInputFields.get(j);
            if (columnIndex == j) {
                columnInput.sendKeys(filterText);
                break;
            }
        }
    }

    public String getFilterText(final String columnName) {
        final List<WebElement> columnHeaders = browser.findElements(By.xpath("//span[contains(@class, 'ebTable-headerText')]"));
        int columnIndex = -1;
        String filterText = "";
        for (int i = 0; i < columnHeaders.size(); i++) {
            final WebElement column = columnHeaders.get(i);
            if (column.getText().contains(columnName)) {
                columnIndex = i;
                break;
            }
        }

        final WebElement c = columnHeaders.get(0);
        final List<WebElement> columnInputFields;
        columnInputFields = browser.findElements(By.xpath("//input[contains(@class, 'eaNpamlibrary-FilterHeaderCell-input')]"));

        for (int j = 0; j < columnInputFields.size(); j++) {
            final WebElement columnInput = columnInputFields.get(j);
            if (columnIndex == j) {
                filterText = columnInput.getAttribute("value");
                break;
            }
        }
        return filterText;
    }

    public boolean selectDropDownOption(final String elementText) {
        final List<WebElement> dropDownItems = browser.findElements(By.xpath("//div[contains(@class, 'ebComponentList-item')]"));
        for (final WebElement element : dropDownItems) {
            if (element.getText().equalsIgnoreCase(elementText)) {
                element.click();
                return true;
            }
        }
        return false;
    }

    public String getFilterOption() {
        Graphene.waitGui().until().element(filterButton).is().present();
        return filterButton.getText();
    }

    public int isSortingExists(final String columnName, final String sortOrder) {
        List<WebElement> listOfItags = new ArrayList<>();
        final List<WebElement> completeHeader = browser.findElements(By.xpath("//div[contains(@class, 'ebTable-header')]"));
        for (int j = 0; j < completeHeader.size(); j++) {
            final WebElement eachHeader = completeHeader.get(j);
            final String headerName = eachHeader.getText();
            if (headerName.contains(columnName)) {
                if (sortOrder == "ASC") {
                    listOfItags = eachHeader.findElements(By.xpath("//i[contains(@class, 'ebSort-arrow_up ebSort-arrow_active')]"));
                } else {
                    listOfItags = eachHeader.findElements(By.xpath("//i[contains(@class, 'ebSort-arrow_down ebSort-arrow_active')]"));
                }
            }
        }
        return listOfItags.size();
    }

    public boolean isDefaultSortingApplied(final String columnName) {
        boolean result = false;
        final List<WebElement> completeHeader = browser.findElements(By.xpath("//div[contains(@class, 'ebTable-header')]"));
        for (int i = 0; i < completeHeader.size(); i++) {
            final WebElement eachHeader = completeHeader.get(i);
            final String headerName = eachHeader.getText();
            if (headerName.contains(columnName)) {
                final String OpacityValue = eachHeader.findElement(By.className("ebSort-arrow_down")).getCssValue("opacity");
                result = OpacityValue.equalsIgnoreCase("1");
            }
        }
        return result;
    }

    public void rightClickRow(final int rowNumber) {
        Graphene.waitGui().until().element(table).is().visible();
        final Actions action = new Actions(browser);

        final WebElement row = tableRows.get(rowNumber);
        final List<WebElement> rowCells = row.findElements(By.xpath("td"));
        action.contextClick(rowCells.get(rowNumber)).perform();
    }
}
