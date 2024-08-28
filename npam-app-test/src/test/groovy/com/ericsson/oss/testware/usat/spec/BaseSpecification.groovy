package com.ericsson.oss.testware.usat.spec

import com.ericsson.oss.testware.usat.page.ability.WaitAbility
import com.ericsson.oss.testware.usat.page.object.CreateNeAccountsJobPage
import com.ericsson.oss.testware.usat.page.object.RotateNeAccountsJobPage
import com.ericsson.oss.testware.usat.page.object.NpamappMainPage
import org.jboss.arquillian.drone.api.annotation.Drone
import org.jboss.arquillian.graphene.page.Page
import org.jboss.arquillian.spock.ArquillianSputnik
import org.jboss.arquillian.test.api.ArquillianResource
import org.junit.runner.RunWith
import org.openqa.selenium.JavascriptExecutor
import org.openqa.selenium.WebDriver
import spock.lang.Specification

@RunWith(ArquillianSputnik)
class BaseSpecification extends Specification {

    @Drone
    private WebDriver browser

    @ArquillianResource
    private URL url

    @Page
    NpamappMainPage npamappMainPage

    @Page
    CreateNeAccountsJobPage createNeAccountsJobPage

    @Page
    RotateNeAccountsJobPage rotateNeAccountsJobPage

    def open(final WaitAbility pageObject) {
        browser.get(url.toString())
        pageObject.waitForLoad()
    }

    def open(final NpamappMainPage npamappMainPage) {
        browser.get(url.toString())
        npamappMainPage.waitForLoad()
    }

    def open(final CreateNeAccountsJobPage createNeAccountsJobPage) {
        browser.get(url.toString())
        createNeAccountsJobPage.waitForLoad()
    }

    def open(final RotateNeAccountsJobPage rotateNeAccountsJobPage) {
        browser.get(url.toString())
        rotateNeAccountsJobPage.waitForLoad()
    }

    WebDriver getBrowser() {
        return browser
    }

    URL getUrl() {
        return url
    }

    JavascriptExecutor getJavascriptExecutor() {
        return (JavascriptExecutor) browser
    }

    void scrollToBottom() {
        getJavascriptExecutor().executeScript(
                "window.scrollTo(0, document.body.scrollHeight)")
    }
}
