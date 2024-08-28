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
import com.ericsson.oss.testware.usat.page.object.RotateNeAccountsJobPage
import com.ericsson.oss.testware.usat.page.helpers.RestHelper

import org.jboss.arquillian.graphene.page.Page
import static java.util.Calendar.YEAR

/**
 * Contains all component tests related to the actions that appear in the Action Bar component of
 * the top section of Network Privileged Access Management
 * as well as the context menu on the table
 */
class RotateNeAccountsTestSpec extends BaseSpecification {
    @Page
    NpamappMainPage npamappPage

    @Page
    JobsPage jobsPage

    @Page
    RotateNeAccountsJobPage createJobPage

    def cleanup() {
       RestHelper.clearHttpError();
    }

    def "Verifying to open RotateNeAccountJob application and that Rotate Job is not available"() {
        when: 'NPam application is launched'
        open(npamappPage)

        and:
        assert npamappPage.hasDropDownCreateJob()
        npamappPage.clickDropDownCreateJob()
        sleep(500)

        then:
        assert !npamappPage.hasDropDownItemRotateJob()
    }


    def "Selecting a node on NEAccount Table and verifying to have this node on RotateNeAccountJob app"() {
        when: 'NPam application is launched'
        open(npamappPage)
        sleep(3000)
        npamappPage.expandTopologySimpleSubnet()

        and: 'RN_Node_5 is selected'
        npamappPage.selectTopologyItems(browser, "RN_Node_9")

        and: 'TAB changed to managed nodes and First Ne Account is selected'
        def table = npamappPage.getTableFragment()
        table.selectNeAccountsTab(browser, "Managed Nodes")
        sleep(1000)
        table.clickFirstTableRow()
        sleep(1500)

        and:
        assert npamappPage.hasButtonRotateJob()
        npamappPage.clickButtonRotateJob()
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

        and: 'RN_Node_9 is selected'
        npamappPage.selectTopologyItems(browser, "RN_Node_9")

        and:
        assert npamappPage.hasDropDownCreateJob()
        npamappPage.clickDropDownCreateJob()
        sleep(500)
        assert npamappPage.hasDropDownItemRotateJob()
        npamappPage.selectDropDownItemRotateJob()
        sleep(1000)

        then: 
        assert createJobPage.verifyTopSectionTitle();
        sleep(1000)
        assert createJobPage.checkExistRowWithText("RN_Node_9")
//        assert createJobPage.selectRowWithText("RN_Node_9")
        sleep(500)
        createJobPage.clickCredentialsPage()
        sleep(500)
        createJobPage.clickSchedulePage()
        sleep(500)
        createJobPage.clickSummaryPage()
        sleep(500)
        createJobPage.clickFinish()
        createJobPage.clickDialogCreate()
        assert jobsPage.verifyTopSectionTitle();
    }

    def "Verifying to Create a Job deferred with recurrent data, starting from scratch"() {
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
        assert npamappPage.hasDropDownItemRotateJob()
        npamappPage.selectDropDownItemRotateJob()
        sleep(500)

        then:
        assert createJobPage.verifyTopSectionTitle()
        def today = new Date()
        def jobName = "RN_Node_9_Rotate" + today.toTimestamp().getTime()
        createJobPage.setAndValidateJobName(jobName)
        createJobPage.setAndValidateJobDescription("RN_Node_9 Job Description")
        sleep(500)
        createJobPage.clickCredentialsPage()
        sleep(500)
        createJobPage.clickSchedulePage()
        createJobPage.clickScheduleDropDown()
        sleep(500)
        createJobPage.selectDropDownItemScheduleDeferred()
        sleep(500)
        def nextYear = today[YEAR] + 1
        def oneYearFromNow = today.copyWith(year: nextYear)
        createJobPage.setScheduleStartDate(oneYearFromNow.format('MM/dd/yyyy HH:mm:ss'))

        createJobPage.checkRepeatCheckBox()

        createJobPage.clickDropDownRepeats()
        sleep(500)
        createJobPage.selectDropDownRepeatWeekly()
        sleep(500)
        createJobPage.setRepeatEvery("3")
        createJobPage.selectEnd("Never")

        createJobPage.clickSummaryPage()
        sleep(500)
        createJobPage.checkSummaryJobName(jobName)
        createJobPage.checkSummaryJobDescription("RN_Node_9 Job Description")
        createJobPage.checkSummaryScope("Nodes")
        createJobPage.checkSummaryNumbersOfSelectedNodes("1")
        createJobPage.checkSummaryCredentialsMsg('Generate a new password automatically');
        createJobPage.checkScheduleMsg("Define job and schedule execution")
        createJobPage.checkSummaryJobStartDate(oneYearFromNow.format('MM/dd/yyyy, HH:mm:ss'))
        createJobPage.checkSummaryJobRepeats("Weekly")
        createJobPage.checkSummaryJobRepeatEvery("3")
        createJobPage.checkSummaryJobEnd("Never")

        createJobPage.clickFinish()
        createJobPage.clickDialogCreate()
        assert jobsPage.verifyTopSectionTitle()
    }

    def "Verifying to Create a Job immediate with manual password, starting from scratch"() {
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
        assert npamappPage.hasDropDownItemRotateJob()
        npamappPage.selectDropDownItemRotateJob()
        sleep(500)

        then:
        assert createJobPage.verifyTopSectionTitle()
        def today = new Date()
        def jobName = "RN_Node_9_Rotate" + today.toTimestamp().getTime()
        createJobPage.setAndValidateJobName(jobName)
        createJobPage.setAndValidateJobDescription("RN_Node_9 Job Description")
        sleep(500)
        createJobPage.clickCredentialsPage()
        sleep(500)
        createJobPage.selectManualCredentials()
        sleep(500)
        assert createJobPage.verfifyNextButtonDisabled()
        createJobPage.setPassword("Test")
        sleep(500)
        assert createJobPage.verifyCredentialsErrorString("Password length must be at least 12 characters")
        assert createJobPage.verfifyNextButtonDisabled()
        createJobPage.setPassword("Passw0rd")
        sleep(500)
        assert createJobPage.verifyCredentialsErrorString("Password must have at least 2 numeric cases (0-9)")
        assert createJobPage.verfifyNextButtonDisabled()
        createJobPage.setPassword("1")
        sleep(500)
        assert createJobPage.verifyCredentialsErrorString("Password must have at least 3 uppercase characters (A-Z)")
        assert createJobPage.verfifyNextButtonDisabled()
        createJobPage.setPassword("A")
        sleep(500)
        assert createJobPage.verifyCredentialsErrorString("Password must have at least a special character")
        assert createJobPage.verfifyNextButtonDisabled()
        createJobPage.setPassword(";")
        sleep(500)
        assert createJobPage.verifyCredentialsErrorString("Password contains not allowed characters")
        assert createJobPage.verfifyNextButtonDisabled()
        createJobPage.clearPassword()
        createJobPage.setPassword("TestPassw0rd1A^")
        sleep(500)
        assert createJobPage.verifyCredentialsNoErrorString()
        assert createJobPage.verfifyNextButtonEnabled()
        createJobPage.setUsername("Test")
        sleep(500)
        assert createJobPage.verifyCredentialsErrorString("Password must not contain username")
        assert createJobPage.verfifyNextButtonDisabled()
        createJobPage.clearUsername()
        sleep(500)
        assert createJobPage.verifyCredentialsNoErrorString()
        assert createJobPage.verfifyNextButtonEnabled()
 
        createJobPage.clickSchedulePage()
        sleep(500)
        
        createJobPage.clickSummaryPage()
        sleep(500)
        createJobPage.checkSummaryJobName(jobName)
        createJobPage.checkSummaryJobDescription("RN_Node_9 Job Description")
        createJobPage.checkSummaryScope("Nodes")
        createJobPage.checkSummaryNumbersOfSelectedNodes("1")
        createJobPage.checkSummaryCredentialsMsg('Set new credentials manually');
        createJobPage.checkScheduleMsg("Define job and execute immediately")

        createJobPage.clickFinish()
        createJobPage.clickDialogCreate()
        assert jobsPage.verifyTopSectionTitle()
    }

    def "Verifying to have an error if CreateJob fails"() {
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
        assert npamappPage.hasDropDownItemRotateJob()
        npamappPage.selectDropDownItemRotateJob()
        sleep(1000)

        then:
        assert createJobPage.verifyTopSectionTitle();
        sleep(1000)
        assert createJobPage.checkExistRowWithText("RN_Node_9")
//        assert createJobPage.selectRowWithText("RN_Node_9")
        sleep(500)
        createJobPage.clickCredentialsPage()
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
