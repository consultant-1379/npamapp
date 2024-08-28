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

import com.ericsson.oss.testware.usat.page.ability.InteractionAbility
import com.ericsson.oss.testware.usat.page.ability.WaitAbility
import org.jboss.arquillian.graphene.findby.FindByJQuery
import org.openqa.selenium.WebElement

trait PageObject implements InteractionAbility, WaitAbility{

    @FindByJQuery('body div.ebLoader-Holder')
    WebElement loadingDots
}
