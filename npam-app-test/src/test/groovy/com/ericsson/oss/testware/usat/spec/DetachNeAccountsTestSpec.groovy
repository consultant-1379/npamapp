/*******************************************************************************
 * COPYRIGHT Ericsson 2024
 *
 *
 *
 * The copyright to the computer program(s) herein is the property of
 *
 * Ericsson Inc. The programs may be used and/or copied only with written
 *
 * permission from Ericsson Inc. or in accordance with the terms and
 *
 * conditions stipulated in the agreement/contract under which the
 *
 * program(s) have been supplied.
 ******************************************************************************/

package com.ericsson.oss.testware.usat.spec

import com.ericsson.oss.testware.usat.page.object.NpamappMainPage
import com.ericsson.oss.testware.usat.page.object.JobsPage
import com.ericsson.oss.testware.usat.page.object.DetachNeAccountsJobPage
import com.ericsson.oss.testware.usat.page.helpers.RestHelper

import static java.util.Calendar.YEAR

import org.jboss.arquillian.graphene.page.Page

class DetachNeAccountsTestSpec extends BaseSpecification {
    @Page
    NpamappMainPage npamappPage

    @Page
    JobsPage jobsPage

    @Page
    DetachNeAccountsJobPage createJobPage

    def cleanup() {
       RestHelper.clearHttpError();
    }

    def "Verifying to open DetachNeAccountJob application and that it returns to npamapp if pressed cancel"() {
        when: 'NPam application is launched'
        open(npamappPage)

        and:
        assert npamappPage.hasDropDownCreateJob()
        npamappPage.clickDropDownCreateJob()
        sleep(500)

        then:
        assert !npamappPage.hasDropDownItemDetachJob()
    }

    def "Selecting a node on NEAccount Table and verifying to have this node on DetachNeAccountJob app"() {
        when: 'NPam application is launched'
        open(npamappPage)
        sleep(3000)
        npamappPage.expandTopologySimpleSubnet()
        sleep(500)

        and: 'RN_Node_9 is selected'
        npamappPage.selectTopologyItems(browser, "RN_Node_9")

        and: 'TAB changed to managed nodes and First Ne Account is selected'
        def table = npamappPage.getTableFragment()
        table.selectNeAccountsTab(browser, "Managed Nodes")
        sleep(1000)
        table.clickFirstTableRow()
        sleep(3000)

        and:
        assert npamappPage.hasButtonDetachJob()
        npamappPage.clickButtonDetachJob()
        sleep(3000)

        then:
        assert createJobPage.verifyTopSectionTitle()
        assert createJobPage.checkExistRowWithText("RN_Node_9")
        createJobPage.clickCancel()
        createJobPage.clickDialogYes()
        assert npamappPage.verifyTopSectionTitle()
    }

    def "Selecting a node and verifying to have this node on CreateJob app"() {
        when: 'NPam application is launched'
        open(npamappPage)
        sleep(3000)
        npamappPage.expandTopologySimpleSubnet()
        sleep(500)

        and: 'RN_Node_9 is selected'
        npamappPage.selectTopologyItems(browser, "RN_Node_9")

        and:
        assert npamappPage.hasDropDownCreateJob()
        npamappPage.clickDropDownCreateJob()
        sleep(500)
        assert npamappPage.hasDropDownItemDetachJob()
        npamappPage.selectDropDownItemDetachJob()
        sleep(1000)

        then: 
        assert createJobPage.verifyTopSectionTitle();
        sleep(1000)
        assert createJobPage.checkExistRowWithText("RN_Node_9")
//        assert createJobPage.selectRowWithText("RN_Node_9")
        sleep(500)
        createJobPage.clickSchedulePage()
        sleep(500)
        createJobPage.clickSummaryPage()
        sleep(500)
        createJobPage.clickFinish()
        createJobPage.clickDialogCreate()
        assert jobsPage.verifyTopSectionTitle();
    }

    def "Create a Detach NEAccountJob deferred"() {
        when: 'NPam application is launched'
        open(npamappPage)
        sleep(3000)
        npamappPage.expandTopologySimpleSubnet()
        sleep(500)

        and: 'RN_Node_9 is selected'
        npamappPage.selectTopologyItems(browser, "RN_Node_9")

        and:
        assert npamappPage.hasDropDownCreateJob()
        npamappPage.clickDropDownCreateJob()
        sleep(500)
        assert npamappPage.hasDropDownItemDetachJob()
        npamappPage.selectDropDownItemDetachJob()
        sleep(1000)

        then:
        assert createJobPage.verifyTopSectionTitle();
        sleep(1000)
        assert createJobPage.checkExistRowWithText("RN_Node_9")
//        assert createJobPage.selectRowWithText("RN_Node_9")
        sleep(500)
        createJobPage.clickSchedulePage()
        createJobPage.clickScheduleDropDown()
        sleep(500)
        createJobPage.selectDropDownItemScheduleDeferred()
        sleep(500)
        def today = new Date()
        def nextYear = today[YEAR] + 1
        def oneYearFromNow = today.copyWith(year: nextYear)
        createJobPage.setScheduleStartDate(oneYearFromNow.format('MM/dd/yyyy HH:mm:ss'))
        sleep(500)
        createJobPage.clickSummaryPage()
        sleep(500)
        createJobPage.clickFinish()
        createJobPage.clickDialogCreate()
        assert jobsPage.verifyTopSectionTitle();
    }

    def "Verifying to have an error if DetachNEAccount Job fails"() {
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
        assert npamappPage.hasDropDownItemDetachJob()
        npamappPage.selectDropDownItemDetachJob()
        sleep(1000)

        then:
        assert createJobPage.verifyTopSectionTitle();
        sleep(1000)
        assert createJobPage.checkExistRowWithText("RN_Node_9")
//        assert createJobPage.selectRowWithText("RN_Node_9")
        sleep(500)
        createJobPage.clickSchedulePage()
        sleep(500)
        createJobPage.clickSummaryPage()
        sleep(500)
        createJobPage.clickFinish()
        RestHelper.setHttpError(422, 4415)
        sleep(500)
        createJobPage.clickDialogCreate()
        sleep(500)
        assert npamappPage.getDialogFragment().getDialogBoxHeader() == 'Validation Failed'
        assert npamappPage.getDialogFragment().getDialogBoxText().startsWith("Job configuration error.")
    }
}
