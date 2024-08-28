package com.ericsson.oss.testware.usat.page.object

import org.jboss.arquillian.graphene.page.Location;

@Location("/#npamapp/npamrotateneaccountjob")
class RotateNeAccountsJobPage extends CreateJobPage {

  boolean verifyTopSectionTitle() {
        return verifyTopSectionTitle('Rotate NE Account Credentials');
  }
}
