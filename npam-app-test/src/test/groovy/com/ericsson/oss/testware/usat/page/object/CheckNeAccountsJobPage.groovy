package com.ericsson.oss.testware.usat.page.object

import org.jboss.arquillian.graphene.page.Location;

@Location("/#npamapp/npamcheckneaccountconfigjob")
class CheckNeAccountsJobPage extends CreateJobPage {

  boolean verifyTopSectionTitle() {
        return verifyTopSectionTitle('Check and Update NE Accounts Configuration');
  }
}
