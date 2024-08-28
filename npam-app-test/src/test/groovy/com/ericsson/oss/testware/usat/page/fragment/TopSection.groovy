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

package com.ericsson.oss.testware.usat.page.fragment

import org.jboss.arquillian.graphene.Graphene;

import org.openqa.selenium.WebElement
import org.openqa.selenium.support.FindBy

class TopSection implements PageFragment {
    @FindBy(className = "elLayouts-TopSection-title")
    WebElement topSectionTitle

    public boolean verifyTopSectionTitle(final String title) {
        Graphene.waitGui().until().element(topSectionTitle).text().contains(title)
        return true
    }

}
