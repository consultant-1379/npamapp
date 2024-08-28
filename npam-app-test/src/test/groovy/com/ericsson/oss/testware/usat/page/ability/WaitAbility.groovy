package com.ericsson.oss.testware.usat.page.ability

import org.openqa.selenium.WebDriver

/**
 * Represents an ability to wait for loading.
 */
trait WaitAbility {

    /**
     * Wait for a notable element to load in the UI.
     */
    abstract void waitForLoad()
}
