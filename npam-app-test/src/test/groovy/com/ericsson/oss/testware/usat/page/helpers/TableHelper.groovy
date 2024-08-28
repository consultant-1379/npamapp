package com.ericsson.oss.testware.usat.page.helpers

import com.ericsson.oss.testware.usat.page.object.NpamappMainPage

/**
 * Utility class that contains spock helper methods for Cell Management UI table.
 */
class TableHelper {

    static void selectCellRows(NpamappMainPage page, String... cellNames) {
        def cellsTable = page.getTableFragment()
        cellsTable.clickRowsContainingCellWithText(cellNames)
        Thread.sleep(500)
        assert cellsTable.getNumberOfVisibleSelectedRows() == cellNames.length
    }

}
