package com.ericsson.oss.testware.usat.spec

import com.ericsson.oss.testware.usat.page.object.NpamappMainPage
import com.ericsson.oss.testware.usat.page.object.JobsPage
import com.ericsson.oss.testware.usat.page.object.CheckNeAccountsJobPage
import com.ericsson.oss.testware.usat.page.helpers.RestHelper

import org.jboss.arquillian.graphene.page.Page

/**
 * Contains all component tests related to the actions that appear in the Action Bar component of
 * the top section of Network Privileged Access Management
 * as well as the context menu on the table
 */
class CheckNeAccountsConfigTestSpec extends BaseSpecification {
    @Page
    NpamappMainPage npamappPage

    @Page
    JobsPage jobsPage

    @Page
    CheckNeAccountsJobPage createJobPage

    def cleanup() {
       RestHelper.clearHttpError();
    }

    def "Selecting a node on NEAccount Table and verifying to have this node on CheckAndUpdateNeAccountConfigJob app"() {
        when: 'NPam application is launched'
        open(npamappPage)
        sleep(3000)
        npamappPage.expandTopologySimpleSubnet()
        npamappPage.expandTopologyParentSubnet()

        and: 'RN_Node_2 is selected'
        npamappPage.selectTopologyItems(browser, "RN_Node_2")

        and: 'TAB changed to managed nodes and First Ne Account is selected'
        def table = npamappPage.getTableFragment()
        table.selectNeAccountsTab(browser, "Managed Nodes")
        sleep(1000)
        table.clickFirstTableRow()
        sleep(1000)

        and:
        assert npamappPage.hasButtonCheckJob()
        npamappPage.clickButtonCheckJob()
        sleep(3000)

        then:
        assert createJobPage.verifyTopSectionTitle()
        assert createJobPage.checkExistRowWithText("RN_Node_2")
        createJobPage.clickCancel()
        createJobPage.clickDialogYes()
        assert npamappPage.verifyTopSectionTitle()
    }

    def "Selecting a node and verifying not to have Check Job on CreateJob dropdown menu"() {
        when: 'NPam application is launched'
        open(npamappPage)
        sleep(3000)
        npamappPage.expandTopologySimpleSubnet()

        and: 'RN_Node_9 is selected'
        npamappPage.selectTopologyItems(browser, "RN_Node_9")

        and:
        assert npamappPage.hasDropDownCreateJob()
        npamappPage.clickDropDownCreateJob()
        sleep(500)

        then:
        assert !npamappPage.hasDropDownItemCheckJob()
    }

//    def "Selecting more nodes and verifying to have this node on CreateJob app"() {
//        when: 'NPam application is launched'
//        open(npamappPage)
//        sleep(3000)
//        npamappPage.expandTopologySimpleSubnet()
//        npamappPage.expandTopologyParentSubnet()
//
//        and: 'RN_Node_9, RN_Node_5, RN_Node_2 is selected'
//        npamappPage.selectTopologyItems(browser, "RN_Node_9", "RN_Node_5", "RN_Node_2")
//        sleep(500)
//
//        and: 'TAB changed to managed nodes and First Ne Account is selected'
//        def table = npamappPage.getTableFragment()
//        table.selectNeAccountsTab(browser, "Managed Nodes")
//        sleep(1000)
//        table.clickFirstTableRow()
//
//        and: 'TAB changed to unmanaged nodes'
//        table.selectNeAccountsTab(browser, "Unmanaged Nodes")
//        sleep(1000)
//
//        assert npamappPage.hasDropDownCreateJob()
//        npamappPage.clickDropDownCreateJob()
//        sleep(500)
//        assert npamappPage.hasDropDownItemCheckJob()
//        npamappPage.selectDropDownItemCheckJob()
//        sleep(500)
//
//        then:
//        assert createJobPage.verifyTopSectionTitle();
//        sleep(1000)
//        assert createJobPage.checkExistRowWithText("RN_Node_9")
//        assert createJobPage.checkExistRowWithText("RN_Node_5")
//        assert createJobPage.checkExistRowWithText("RN_Node_2")
//
//        createJobPage.clickCancel()
//        createJobPage.clickDialogYes()
//        assert npamappPage.verifyTopSectionTitle()
//    }

//    def "Verifying to have an error if create CheckAndUpdateNeAccountConfigJob fails"() {
//        when: 'NPam application is launched'
//        open(npamappPage)
//        sleep(3000)
//        npamappPage.expandTopologySimpleSubnet()
//        npamappPage.expandTopologyParentSubnet()
//
//        and: 'RN_Node_9, RN_Node_5, RN_Node_2 is selected'
//        npamappPage.selectTopologyItems(browser, "RN_Node_9", "RN_Node_5", "RN_Node_2")
//        sleep(500)
//
//        assert npamappPage.hasDropDownCreateJob()
//        npamappPage.clickDropDownCreateJob()
//        sleep(500)
//        assert npamappPage.hasDropDownItemCheckJob()
//        npamappPage.selectDropDownItemCheckJob()
//        sleep(500)
//
//        then:
//        assert createJobPage.verifyTopSectionTitle();
//        sleep(1000)
//        assert createJobPage.checkExistRowWithText("RN_Node_9")
//        assert createJobPage.checkExistRowWithText("RN_Node_5")
//        assert createJobPage.checkExistRowWithText("RN_Node_2")
//
//        and:
//        createJobPage.clickSummaryPage()
//        sleep(500)
//        createJobPage.clickFinish()
//        RestHelper.setHttpError(422, 4415)
//        sleep(500)
//        createJobPage.clickDialogCreate()
//
//        then:
//        sleep(500)
//        assert npamappPage.getDialogFragment().getDialogBoxHeader() == 'Validation Failed'
//        assert npamappPage.getDialogFragment().getDialogBoxText().startsWith("Job configuration error.")
//    }
}
