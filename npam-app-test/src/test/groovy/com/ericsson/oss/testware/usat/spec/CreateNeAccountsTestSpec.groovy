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
import com.ericsson.oss.testware.usat.page.object.CreateNeAccountsJobPage
import com.ericsson.oss.testware.usat.page.helpers.RestHelper

import org.jboss.arquillian.graphene.page.Page
import static java.util.Calendar.YEAR


/**
 * Contains all component tests related to the actions that appear in the Action Bar component of
 * the top section of Network Privileged Access Management
 * as well as the context menu on the table
 */
class CreateNeAccountsTestSpec extends BaseSpecification {
    @Page
    NpamappMainPage npamappPage

    @Page
    JobsPage jobsPage

    @Page
    CreateNeAccountsJobPage createJobPage

    def cleanup() {
       RestHelper.clearHttpError();
    }

    def "Verifying to open CreateJob application and that it returns to npamapp if pressed cancel"() {
        when: 'NPam application is launched'
        open(npamappPage)

        and:
        assert npamappPage.hasDropDownCreateJob()
        npamappPage.clickDropDownCreateJob()
        sleep(500)

        then:
        assert !npamappPage.hasDropDownItemCreateJob()
    }


    def "Selecting a node on NEAccount Table and verifying to have this node on CreateJob app"() {
        when: 'NPam application is launched'
        open(npamappPage)
        sleep(3000)
        npamappPage.expandTopologyParentSubnet()

        and: 'RN_Node_5 is selected'
        npamappPage.selectTopologyItems(browser, "RN_Node_5")

        and: 'TAB changed to unmanaged nodes and First Ne Account is selected'
        def table = npamappPage.getTableFragment()
        table.selectNeAccountsTab(browser, "Unmanaged Nodes")
        sleep(1000)
        table.clickFirstTableRow()
        sleep(3000)

        and:
        assert npamappPage.hasButtonCreateJob()
        npamappPage.clickButtonCreateJob()
        sleep(3000)

        then: 'Import, Create, Export and View Jobs button are enabled in the Action Bar'
        assert createJobPage.verifyTopSectionTitle()
        assert createJobPage.checkExistRowWithText("RN_Node_5")
        createJobPage.clickCancel()
        createJobPage.clickDialogYes()
        assert npamappPage.verifyTopSectionTitle()
    }

    def "Selecting a node and verifying to have this node on CreateJob app"() {
        when: 'NPam application is launched'
        open(npamappPage)
        sleep(3000)
        npamappPage.expandTopologyParentSubnet()

        and: 'RN_Node_5 is selected'
        npamappPage.selectTopologyItems(browser, "RN_Node_5")

        and:
        assert npamappPage.hasDropDownCreateJob()
        npamappPage.clickDropDownCreateJob()
        sleep(500)
        assert npamappPage.hasDropDownItemCreateJob()
        npamappPage.selectDropDownItemCreateJob()
        sleep(1000)

        then: 'Import, Create, Export and View Jobs button are enabled in the Action Bar'
        assert createJobPage.verifyTopSectionTitle();
        sleep(1000)
        assert createJobPage.checkExistRowWithText("RN_Node_5")
//        assert createJobPage.selectRowWithText("RN_Node_5")
        sleep(500)
        def today = new Date()
        def jobName = "RN_Node_5_Create" + today.toTimestamp().getTime()
        createJobPage.setAndValidateJobName(jobName)
        createJobPage.setAndValidateJobDescription("RN_Node_5 Job Description")
        sleep(500)
        createJobPage.clickSchedulePage()
        sleep(500)
        createJobPage.clickSummaryPage()
        createJobPage.checkSummaryJobName(jobName)
        createJobPage.checkSummaryJobDescription("RN_Node_5 Job Description")
        createJobPage.checkSummaryScope("Nodes")
        createJobPage.checkSummaryNumbersOfSelectedNodes("1")
        createJobPage.checkScheduleMsg("Define job and execute immediately")
        sleep(500)
        createJobPage.clickFinish()
        createJobPage.clickDialogCreate()
        assert jobsPage.verifyTopSectionTitle()
    }

    def "Verifying to Create a Job Deferred"() {
        when: 'NPam application is launched'
        open(npamappPage)
        sleep(3000)
        npamappPage.expandTopologyParentSubnet()

        and: 'RN_Node_5 is selected'
        npamappPage.selectTopologyItems(browser, "RN_Node_5")

        and:
        assert npamappPage.hasDropDownCreateJob()
        npamappPage.clickDropDownCreateJob()
        sleep(500)
        assert npamappPage.hasDropDownItemCreateJob()
        npamappPage.selectDropDownItemCreateJob()
        sleep(1000)

        then: 'Import, Create, Export and View Jobs button are enabled in the Action Bar'
        assert createJobPage.verifyTopSectionTitle();
        sleep(1000)
        assert createJobPage.checkExistRowWithText("RN_Node_5")
//        assert createJobPage.selectRowWithText("RN_Node_5")
        sleep(500)
        def today = new Date()
        def jobName = "RN_Node_5_Create" + today.toTimestamp().getTime()
        createJobPage.setAndValidateJobName(jobName)
        createJobPage.setAndValidateJobDescription("RN_Node_5 Job Description")
        sleep(500)
        createJobPage.clickSchedulePage()
        createJobPage.clickScheduleDropDown()
        sleep(500)
        createJobPage.selectDropDownItemScheduleDeferred()
        sleep(500)
        def nextYear = today[YEAR] + 1
        def oneYearFromNow = today.copyWith(year: nextYear)
        createJobPage.setScheduleStartDate(oneYearFromNow.format('MM/dd/yyyy HH:mm:ss'))
        createJobPage.clickSummaryPage()
        sleep(500)
        createJobPage.checkSummaryJobName(jobName)
        createJobPage.checkSummaryJobDescription("RN_Node_5 Job Description")
        createJobPage.checkSummaryScope("Nodes")
        createJobPage.checkSummaryNumbersOfSelectedNodes("1")
        createJobPage.checkScheduleMsg("Define job and schedule execution")
        println oneYearFromNow.format('MM/dd/yyyy, HH:mm:ss')
        createJobPage.checkSummaryJobStartDate(oneYearFromNow.format('MM/dd/yyyy, HH:mm:ss'))

        createJobPage.clickFinish()
        createJobPage.clickDialogCreate()
        assert jobsPage.verifyTopSectionTitle()
    }

    def "Verifying to have an error if CreateJob fails"() {
        when: 'NPam application is launched'
        open(npamappPage)
        sleep(3000)
        npamappPage.expandTopologyParentSubnet()

        and: 'RN_Node_5 is selected'
        npamappPage.selectTopologyItems(browser, "RN_Node_5")

        and:
        assert npamappPage.hasDropDownCreateJob()
        npamappPage.clickDropDownCreateJob()
        sleep(500)
        assert npamappPage.hasDropDownItemCreateJob()
        npamappPage.selectDropDownItemCreateJob()
        sleep(1000)

        then: 'Import, Create, Export and View Jobs button are enabled in the Action Bar'
        assert createJobPage.verifyTopSectionTitle();
        sleep(1000)
        assert createJobPage.checkExistRowWithText("RN_Node_5")
//        assert createJobPage.selectRowWithText("RN_Node_5")
        sleep(500)
        createJobPage.clickSchedulePage()
        sleep(500)
        createJobPage.clickSummaryPage()
        sleep(500)
        createJobPage.clickFinish()
        RestHelper.setHttpError(422, 4415)
        createJobPage.clickDialogCreate()
        sleep(500)
        assert npamappPage.getDialogFragment().getDialogBoxHeader() == 'Validation Failed'
        assert npamappPage.getDialogFragment().getDialogBoxText().startsWith("Job configuration error.")
    }
}
