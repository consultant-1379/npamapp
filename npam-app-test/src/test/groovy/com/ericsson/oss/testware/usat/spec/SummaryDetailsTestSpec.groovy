package com.ericsson.oss.testware.usat.spec

import com.ericsson.oss.testware.usat.page.helpers.ScopingPanelHelper
import com.ericsson.oss.testware.usat.page.object.NpamappMainPage
import com.ericsson.oss.testware.usat.page.helpers.RestHelper
import org.jboss.arquillian.graphene.page.Page
import spock.lang.Shared

/**
 * Contains component tests related to Summary Details for Maintenance User Accounts.
 */
class SummaryDetailsTestSpec extends BaseSpecification {

    public final static int PARENT_SUBNET_TOPOLOGY_INDEX = 1
    @Page
    NpamappMainPage page

    @Shared
    ScopingPanelHelper scopingPanelHelper = new ScopingPanelHelper()

    def setup() {
        open(page)
        page.getScopingPanelFragment().expandTopologyTabItem(PARENT_SUBNET_TOPOLOGY_INDEX)
    }

    def "Verifying details in Summary"() {
        when: 'Parent_Subnet is selected'
        scopingPanelHelper.selectTopologyItems(browser, page, "RN_Node_1")

        and: 'First Ne Account is selected from table'
        def table = page.getTableFragment()
        sleep(1000)
        table.clickFirstTableRow()

        and: 'Info Summary is clicked'
        def actionBar = page.getActionBarFragment()
        sleep(1000)
        actionBar.clickSummaryIcon()
        sleep(3000)

        then: 'The details are correctly reporting neName, ipAddress, currentUser, currentPswd, status, errorDetails, lastUpdate'
        assert page.hasNodeNameInFlyoutAsDetailsPanel("RN_Node_1")
        assert page.hasIpAddressInFlyoutAsDetailsPanel("0.0.0.0")
        assert page.hasCurrentUsernameInFlyoutAsDetailsPanel("RN_Node_1")
        assert page.hasStatusAsDetailsPanel("IN_PROGRESS")
        assert page.hasErrorDetailsAsDetailsPanel("NE not in synch")
        assert page.hasLastUpdateAsDetailsPanel("11/30/2022")
    }

    def "Verifying encrypted password with eye in Summary"() {
        when: 'Parent_Subnet is selected'
        scopingPanelHelper.selectTopologyItems(browser, page, "RN_Node_1")

        and: 'First Ne Account is selected from table'
        def table = page.getTableFragment()
        sleep(500)
        assert table.hasNotClearLink()
        table.clickFirstTableRow()
        sleep(500)

        and: 'Info Summary is clicked'
        def actionBar = page.getActionBarFragment()
        sleep(1000)
        assert table.hasClearLink()
        actionBar.clickSummaryIcon()
        sleep(3000)

        and: 'Eye icon is clicked in summary details '
        def flyout = page.getFlyoutPanelFragment()
        flyout.clickEyeIcon()
        sleep(3000)
        then: 'Password is displayed'
        assert page.hasPasswdInFlyoutAsDetailsPanel("5VS.S3[<GLH6")
        and: 'click on eye icon again'
        flyout.clickEyeIcon()
        assert page.hasNoPasswordInFlyoutDetailsPanel()
    }

    def "Verifying error displayed in UI when REST fails"() {
        when: 'Parent_Subnet is selected'
        scopingPanelHelper.selectTopologyItems(browser, page, "RN_Node_1")

        and: 'First Ne Account is selected from table'
        def table = page.getTableFragment()
        sleep(500)
        assert table.hasNotClearLink()
        table.clickFirstTableRow()
        sleep(500)

        and: 'Info Summary is clicked'
        def actionBar = page.getActionBarFragment()
        sleep(1000)
        assert table.hasClearLink()
        RestHelper.setHttpError(500, 5000)
        actionBar.clickSummaryIcon()
        sleep(3000)

        then: 'An error is displayed'
        assert page.isInlineMessageHeaderDisplayed("Internal Error.")
        assert page.isInlineMessageDescriptionDisplayed("Internal Error occurred in the system. Please contact your system administrator.")
        RestHelper.clearHttpError()
    }
}
