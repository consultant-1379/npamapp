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


package com.ericsson.oss.testware.usat.spec

import com.ericsson.oss.testware.usat.page.helpers.ScopingPanelHelper
import com.ericsson.oss.testware.usat.page.object.NpamappMainPage
import com.ericsson.oss.testware.usat.page.helpers.RestHelper
import org.jboss.arquillian.graphene.page.Page
import spock.lang.Shared
///import groovy.util.logging.Slf4j

/**
 * Contains component tests related to Maintenance User Accounts tab.
 */
///@Slf4j
class NpamPageTestSpec extends BaseSpecification {
    public final static int PARENT_SN_INDEX = 1 // Parent_Subnet
    public final static int SIMPLE_SUBNET_INDEX = 2 // Simple_Subnet

    @Page
    private NpamappMainPage page

    @Shared
    private ScopingPanelHelper scopingPanelHelper = new ScopingPanelHelper()

    def setup() {
       open(page)
    }

    def "Ne Name table is displayed when a selection is made in scoping panel"() {
        when: 'RN_NODE_9 is selected'
        page.getScopingPanelFragment().expandTopologyTabItem(SIMPLE_SUBNET_INDEX)
        scopingPanelHelper.selectTopologyItems(browser, page, "RN_Node_9")
        then: 'on tab NE accounts Ne Name table is displayed'
        assert page.isinlineTableHeaderTextDisplayed("NE Account Status")
        and: 'Ne Accounts table is displayed'
        assert page.isTableDisplayed()
        and: 'on table of Ne Account the following information are retrieved'
        def table = page.getTableFragment()
        assert table.verifyColumnNamesList().get(3) == "Node Name"
        assert table.verifyColumnNamesList().get(0) == "NE Account Status"
        assert table.verifyColumnNamesList().get(1) == "Error Details"
        assert table.verifyColumnNamesList().get(2) == "Last Updated"
        //assert table.verifyColumnNamesList().get(4) == "CBRS Status"
    }

    def "Select Tab NE Account"() {
        when: 'Tab Ne Account is selected'
        def table = page.getTableFragment()
        table.selectNeAccountsTab(browser, "Managed Nodes")
        then: 'Ne Name table is displayed'
        assert page.isTableDisplayed()
    }

    def "Check validation Error return by REST"() {
        when: 'RN_NODE_9 is selected'
        RestHelper.setHttpError(422, 4418)
        page.getScopingPanelFragment().expandTopologyTabItem(SIMPLE_SUBNET_INDEX)
        scopingPanelHelper.selectTopologyItems(browser, page, "RN_Node_9")

        then: 'Validation Failed error'
        assert page.isInlineMessageHeaderDisplayed("Validation Failed")
        assert page.isInlineMessageDescriptionDisplayed("NEAccount not found for selected NetworkElement.")
        RestHelper.clearHttpError()
    }

    def "Check Warning and Error Icon on ne account status and cbrs status"() {
        when: 'RN_NODE_1 is selected'
        page.getScopingPanelFragment().expandTopologyTabItem(PARENT_SN_INDEX)
        scopingPanelHelper.selectTopologyItems(browser, page, "RN_Node_1")

        then: 'no icon are present'
        def table = page.getTableFragment()
        assert table.getCellText(0, "NE Account Status") == "CONFIGURED"
        assert table.getCellText(0, "CBRS Status") == "CONFIGURED"
        assert table.noErrorIcon(0, "NE Account Status")
        assert table.noErrorIcon(0, "CBRS Status")
        assert table.noWarningIcon(0, "NE Account Status")
        assert table.noWarningIcon(0, "CBRS Status")

        then: 'RN_NODE_2 is selected'
        scopingPanelHelper.selectTopologyItems(browser, page, "RN_Node_2")

        then: 'warning icon are present for both status'
        assert table.getCellText(0, "NE Account Status") == "DETACHED"
        assert table.getCellText(0, "CBRS Status") == "DETACHED"
        assert table.noErrorIcon(0, "NE Account Status")
        assert table.noErrorIcon(0, "CBRS Status")
        assert !table.noWarningIcon(0, "NE Account Status")
        assert !table.noWarningIcon(0, "CBRS Status")

    }

    def "Check Warning and Error Icon on ne account status and cbrs status 2"() {
        when: "RN_NODE_9 is selected"
        page.getScopingPanelFragment().expandTopologyTabItem(SIMPLE_SUBNET_INDEX)
        scopingPanelHelper.selectTopologyItems(browser, page, "RN_Node_9")

        then: 'warning icon are present for only on cbrsstatus'
        def table = page.getTableFragment()
        assert table.getCellText(0, "NE Account Status") == "CONFIGURED"
        assert table.getCellText(0, "CBRS Status") == "N/A"
        assert table.noErrorIcon(0, "NE Account Status")
        assert table.noErrorIcon(0, "CBRS Status")
        assert table.noWarningIcon(0, "NE Account Status")
        assert !table.noWarningIcon(0, "CBRS Status")

    }

    def "Check Internal Error return by REST"() {
        when: 'RN_NODE_9 is selected'
        RestHelper.setHttpError(500, 5000)
        page.getScopingPanelFragment().expandTopologyTabItem(SIMPLE_SUBNET_INDEX)
        scopingPanelHelper.selectTopologyItems(browser, page, "RN_Node_9")

        then: 'Validation Failed error'
        assert page.isInlineMessageHeaderDisplayed("Internal Error.")
        assert page.isInlineMessageDescriptionDisplayed("Internal Error occurred in the system. Please contact your system administrator.")
        RestHelper.clearHttpError()
    }

}
