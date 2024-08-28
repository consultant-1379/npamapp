package com.ericsson.oss.testware.usat.page.helpers

import com.ericsson.oss.testware.usat.page.object.NpamappMainPage
import org.openqa.selenium.WebDriver

/**
 * Utility class that contains spock helper methods for the Scoping Panel.
 */
class ScopingPanelHelper {

    static void selectTopologyItems(WebDriver browser, NpamappMainPage page, String... names) {
        def scopingPanel = page.getScopingPanelFragment()
        scopingPanel.selectTopologyItems(browser, names)
        assert scopingPanel.verifyTopologyItemsAreSelected(names)
    }

    static void selectTopologyItems(WebDriver browser, NpamappMainPage page, int expectedCellCount, String... names) {
        selectTopologyItems(browser, page, names)
        // TODO
      //  def table = page.getRenderedTableFragment()
      //  assert table.getTotalNumberOfRows() == expectedCellCount
    }

    static void deselectAllVisibleTopologyItems(WebDriver browser, NpamappMainPage page) {
        def scopingPanel = page.getScopingPanelFragment()
        scopingPanel.deselectAllVisibleTopologyItems(browser)
        assert scopingPanel.verifyTopologyItemsAreSelected()
    }
}