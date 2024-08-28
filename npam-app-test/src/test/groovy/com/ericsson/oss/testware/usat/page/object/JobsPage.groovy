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

package com.ericsson.oss.testware.usat.page.object

import com.ericsson.oss.testware.usat.page.fragment.TopSection;
import com.ericsson.oss.testware.usat.page.fragment.JobsTable;


import org.jboss.arquillian.graphene.Graphene
import org.jboss.arquillian.graphene.page.Location

import org.openqa.selenium.WebElement
import org.openqa.selenium.support.FindBy


/**
 * Page object that represents the single page application.
 */
@Location("/#npamapp/npamjobs")
class JobsPage implements PageObject {

    // TopSection Fragment
    @FindBy(className = "elLayouts-TopSection")
    WebElement topSection

    @FindBy(className = "elLayouts-TopSection")
    private TopSection topSectionFragment;

    @FindBy(className = "eaNpamjob-rJobDetails-jobsTablePlaceholder")
    JobsTable tableFragment

    public TopSection getTopSectionFragment() {
        Graphene.waitGui().until().element(topSection).is().present();
        return topSectionFragment;
    }

    boolean verifyTopSectionTitle() {
        return getTopSectionFragment().verifyTopSectionTitle('Jobs');
    }

    @Override
    void waitForLoad() {
        falseOnException { JobsTable.waitForLoad() }
        waitNotVisible(loadingDots)
    }

}
