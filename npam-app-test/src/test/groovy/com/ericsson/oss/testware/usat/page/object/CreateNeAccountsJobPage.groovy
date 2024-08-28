package com.ericsson.oss.testware.usat.page.object

import org.jboss.arquillian.graphene.page.Location;

@Location("/#npamapp/npamcreateneaccountjob")
class CreateNeAccountsJobPage extends CreateJobPage {

  boolean verifyTopSectionTitle() {
        return verifyTopSectionTitle('Create NE Accounts');
  }
}
