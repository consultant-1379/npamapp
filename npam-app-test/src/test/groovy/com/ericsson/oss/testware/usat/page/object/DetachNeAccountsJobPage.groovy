package com.ericsson.oss.testware.usat.page.object

import org.jboss.arquillian.graphene.page.Location;

@Location("/#npamapp/npamdeleteneaccountjob")
class DetachNeAccountsJobPage extends CreateJobPage {

  boolean verifyTopSectionTitle() {
        return verifyTopSectionTitle('Detach NE Accounts');
  }
}
