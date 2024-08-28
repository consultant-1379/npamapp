package com.ericsson.oss.testware.usat.spec

import com.ericsson.oss.testware.usat.page.object.NpamappMainPage
import com.ericsson.oss.testware.usat.page.object.JobsPage
import com.ericsson.oss.testware.usat.page.object.CreateNeAccountsJobPage
import com.ericsson.oss.testware.usat.page.helpers.RestHelper

import org.jboss.arquillian.graphene.page.Page


class CollectionsSavedSearchTestSpec extends BaseSpecification {
    @Page
    NpamappMainPage npamappPage

    @Page
    JobsPage jobsPage

    @Page
    CreateNeAccountsJobPage createJobPage

    def cleanup() {
       RestHelper.clearHttpError();
    }

    def "Selecting a collection on Scoping Panel Table and verifying nodes number in CreateJob summary"() {
        when: 'NPam application is launched'
        open(npamappPage)
        sleep(3000)

        and: 'Select Collection networkelement_all'
        assert npamappPage.hasDropDownCreateJob()
        npamappPage.selectScopingPanelTab('Collections')
        npamappPage.clickRowsContainingCollection("networkelement_all")

        and:
        assert npamappPage.hasDropDownCreateJob()
        npamappPage.clickDropDownCreateJob()
        assert npamappPage.hasDropDownItemCreateJob()
        assert npamappPage.selectDropDownItemCreateJob()

        sleep(3000)

        then: 'Open accordion, then schedule and create job'
        assert createJobPage.verifyTopSectionTitle()
        assert createJobPage.clickAccordionWithName("networkelement_all")

        def today = new Date()
        def jobName = "Collection_Job_Create" + today.toTimestamp().getTime()
        createJobPage.setAndValidateJobName(jobName)
        createJobPage.setAndValidateJobDescription("Collection Job Description")
        sleep(500)
        createJobPage.clickSchedulePage()
        sleep(500)
        createJobPage.clickSummaryPage()
        createJobPage.checkSummaryJobName(jobName)
        createJobPage.checkSummaryJobDescription("Collection Job Description")
        createJobPage.checkSummaryScope("Collections")
        createJobPage.checkSummaryNumbersOfSelectedNodes("5")
        createJobPage.checkScheduleMsg("Define job and execute immediately")
        sleep(500)
        createJobPage.clickFinish()
        createJobPage.clickDialogCreate()
        assert jobsPage.verifyTopSectionTitle()
    }

    def "Selecting a Saved Search on Scoping Panel Table and verifying nodes number in CreateJob summary"() {
        when: 'NPam application is launched'
        open(npamappPage)
        sleep(3000)

        and: 'Select Collection NEs'
        assert npamappPage.hasDropDownCreateJob()
        npamappPage.selectScopingPanelTab('Saved Searches')
        npamappPage.clickRowsContainingSavedSearch("NEs")

        and:
        assert npamappPage.hasDropDownCreateJob()
        npamappPage.clickDropDownCreateJob()
        assert npamappPage.hasDropDownItemCreateJob()
        assert npamappPage.selectDropDownItemCreateJob()

        sleep(3000)

        then: 'Open accordion, then schedule and create job'
        assert createJobPage.verifyTopSectionTitle()
        assert createJobPage.clickAccordionWithName("NEs")

        def today = new Date()
        def jobName = "SavedSearch_Job_Create" + today.toTimestamp().getTime()
        createJobPage.setAndValidateJobName(jobName)
        createJobPage.setAndValidateJobDescription("SavedSearch Job Description")
        sleep(500)
        createJobPage.clickSchedulePage()
        sleep(500)
        createJobPage.clickSummaryPage()
        createJobPage.checkSummaryJobName(jobName)
        createJobPage.checkSummaryJobDescription("SavedSearch Job Description")
        createJobPage.checkSummaryScope("Saved Searches")
        createJobPage.checkSummaryNumbersOfSelectedNodes("2")
        createJobPage.checkScheduleMsg("Define job and execute immediately")
        sleep(500)
        createJobPage.clickFinish()
        createJobPage.clickDialogCreate()
        assert jobsPage.verifyTopSectionTitle()
    }

}
