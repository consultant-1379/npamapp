/*------------------------------------------------------------------------------
 *******************************************************************************
 * COPYRIGHT Ericsson 2017
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
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

/**
 * Page fragment that represents the table widget in the single page application.
 */
public class WizardFragment implements PageFragment {

    @FindBy(className = "ebWizard")
    private WebElement wizard;
    @FindBy(className = "ebWizard-step_valid")
    private List<WebElement> validSteps;

    @FindBy(className = "ebWizard-stepListItem")
    private List<WebElement> steps;

    @FindBy(className = "ebWizard-stepTitle")
    private List<WebElement> stepTitle;

    @FindBy(css=".ebWizard-step_current .ebWizard-stepTitle")
    private WebElement currentStep;

    @FindBy(className="ebWizard-footerBtnNext")
    private WebElement nextButton;

    @FindBy(className = "ebWizard-footerBtnPrevious")
    private WebElement previousButton;

    @FindBy(className = "ebWizard-footerBtnFinish")
    private WebElement finishButton;

    @FindBy(className = "ebWizard-footerBtnCancel")
    private WebElement cancelButton;

    @FindBy(className = "ebLoader-Holder")
    private WebElement loaderIcons;

    public int getNumberOfSteps() {
        return steps.size();
    }

    public int getNumberOfValidSteps() {
        return validSteps.size();
    }

    public String getCurrentStepTitle() {
        return currentStep.getAttribute("innerText");
    }

    public void clickNext() {
        Graphene.waitGui().until().element(nextButton).is().enabled();
        nextButton.click();
    }

    public void clickPrevious(){
        Graphene.waitGui().until().element(previousButton).is().present();
        previousButton.click();
    }

    public void clickFinish(){
        Graphene.waitGui().until().element(finishButton).is().present();
        finishButton.click();
    }

    public String isNextButtonDisabled() {
       return nextButton.getAttribute("disabled");
    }

    public boolean isNextButtonEnabled() {
        Graphene.waitGui().until().element(nextButton).is().enabled();
        return true;
    }
    
    public boolean isLoaderIconDisappeared() {
        Graphene.waitGui().until().element(loaderIcons).is().not().visible();
        return true;
    }

    public void clickStep(String stepName){
        for (final WebElement title : stepTitle) {
            if (title.getText().contains(stepName)) {
                Graphene.waitGui().until().element(title).is().present();
                title.click();
            }
        }
    }

    public void clickCancel() {
        Graphene.waitGui().until().element(cancelButton).is().present();
        cancelButton.click();
    }

}
