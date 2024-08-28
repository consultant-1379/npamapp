package com.ericsson.oss.testware.usat.page.ability

import org.openqa.selenium.By
import org.openqa.selenium.NoSuchElementException
import org.openqa.selenium.WebElement

import java.util.concurrent.TimeUnit

import static org.jboss.arquillian.graphene.Graphene.waitGui
import static org.jboss.arquillian.graphene.Graphene.waitGui
import static org.jboss.arquillian.graphene.Graphene.waitGui
import static org.jboss.arquillian.graphene.Graphene.waitGui
import static org.jboss.arquillian.graphene.Graphene.waitGui
import static org.jboss.arquillian.graphene.Graphene.waitGui

trait InteractionAbility {

    boolean falseOnException(Closure<Boolean> closure) {
        try {
            return closure()
        } catch (Exception ex) {
            return false
        }
    }

    void waitTextEntryComplete(final WebElement element, final String expected) {
        waitGui().withTimeout(10, TimeUnit.SECONDS).until().element(element).attribute('value').equalTo(expected)
    }

    WebElement waitVisible(WebElement element) {
        waitGui().withTimeout(20, TimeUnit.SECONDS).until().element(element).is().visible()
        return element
    }

    WebElement waitNotVisible(WebElement element) {
        waitGui().withTimeout(20, TimeUnit.SECONDS).until().element(element).is().not().visible()
        return element
    }

    WebElement waitPresent(WebElement element) {
        waitGui().until().element(element).is().present()
        return element
    }

    WebElement waitNotPresent(WebElement element) {
        waitGui().until().element(element).is().not().present()
        return element
    }

    void click(WebElement element) {
        waitVisible(element).click()
    }
}
