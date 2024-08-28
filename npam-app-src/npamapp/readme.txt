###########
## Setup ##
###########
Just after cloning the repo, run below commands from the "{project.path}/npam-app-src/npamapp/":

    npm install --registry http://presentation-layer.lmera.ericsson.se/registry
    ./npm install --registry https://arm.lmera.ericsson.se/artifactory/api/npm/proj-uisdk-npm-local/ --proxy null
    sudo npm install -g @uisdk/cdt2 --registry https://arm.lmera.ericsson.se/artifactory/api/npm/proj-uisdk-npm-local/ --proxy null

    cdt2 package install --autofill
    npm install request@2.81.0 --save-dev
    npm install express --save
    npm install body-parser --save


#Link the CM actions driver test app from Npam Management:

#    Install the test app
#        cd "{project.path}/npam-app-src/npamapp/test/resources/apps/actions"
#        cdt2 package install --autofill

#    Link the test app
#        cd "{project.path}/npam-app-src/npamapp/"
#        cdt2 package link test/resources/apps/actions


################################################
## Executing tests using local browser client ##
################################################
While in the same directory run the following command to start up a CDT server:

    cd "{project.path}/npam-app-src/npamapp/"
    cdt2 serve --module server.js


In another terminal, change to the top level directory "npamapp" or "npamapp/npam-app-test"
and run the test by executing one of the following Maven build commands:

    # Run tests using local Chrome browser (default)
    mvn verify -Plocal
    # Run tests using local Firefox browser (currently not supported)
    mvn verify -Plocal,firefox


############################################################
## Executing tests using Selenium-Chrome Docker container ##
############################################################

    # Run tests using Selenium-Chrome Docker container (tests are always run outside of this container)
    mvn verify -Pdocker,docker_setup

    # Run Selenium-Chrome Docker container and leave it up
    mvn verify -Pdocker_setup

#######################################################
## Executing tests against a real server using proxy ##
#######################################################

    # From "{project.path}/npam-app-src/" run:
        ./start.sh

    # Make sure that proxy-config.json contains correct 'username' and 'userpassword':
        "username": "administrator",
        "userpassword": "TestPassw0rd"

    # proxy-config.json points to the generic vapp hostname by default:
        "proxy_host": "enmapache.athtem.eei.ericsson.se"


######################################

See the following page for more details on the test setup:
https://confluence-oss.seli.wh.rnd.internal.ericsson.com/display/FC/Client+User+Story+Acceptance+Tests