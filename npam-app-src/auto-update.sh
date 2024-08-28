#!/bin/bash

    cd npamlibrary
    cdt2 package install clientsdk scopingpanel
    cd ..

    cd npamcreateneaccountjob/
    cdt2 package install clientsdk scopingpanel
    cd ..

    cd npamdeleteneaccountjob/
    cdt2 package install clientsdk scopingpanel
    cd ..

    cd npamrotateneaccountjob/
    cdt2 package install clientsdk scopingpanel
    cd ..

    cd npamcheckneaccountconfigjob/
    cdt2 package install clientsdk scopingpanel
    cd ..

    cd npamjob/
    cdt2 package install clientsdk scopingpanel
    cd ..

    cd npamjobdetails/
    cdt2 package install clientsdk scopingpanel
    cd ..

    cd npamapp/
    cdt2 package install clientsdk scopingpanel
    cd ..

    echo "UPDATE COMPLETED"
