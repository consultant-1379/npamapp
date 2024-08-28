package com.ericsson.oss.testware.usat.spec

import com.ericsson.oss.testware.usat.page.helpers.ScopingPanelHelper
import com.ericsson.oss.testware.usat.page.object.NpamappMainPage
import com.ericsson.oss.testware.usat.page.helpers.RestHelper
import org.jboss.arquillian.graphene.page.Page
import java.io.File
import static groovy.io.FileType.*
import spock.lang.Shared

/**
 * Contains component tests related to Summary Details for Maintenance User Accounts.
 */
class ExportNeAccountsTestSpec extends BaseSpecification {

    @Page
    NpamappMainPage npamappPage

    @Shared
    ScopingPanelHelper scopingPanelHelper = new ScopingPanelHelper()

    //def static baseDir = new File(System.getProperty('user.home') + "/Downloads")
    //def static baseDir = new File("/home/seluser/Downloads")

    def setupSpec() {
        println('run setupSpec() for ExportNeAccountTestSpec')
        println(System.getProperty('user.home'))
        //baseDir.eachFileMatch FILES, ~/.*\.enc/, { File bak -> bak.delete() }
        //baseDir.eachFileMatch FILES, ~/.*\.csv/, { File bak -> bak.delete() }
    }

    def cleanupSpec() {
        println('run cleanSpec() for ExportNeAccountTestSpec')
        println(System.getProperty('user.home'))
        //baseDir.eachFileMatch FILES, ~/.*\.enc/, { File bak -> bak.delete() }
        //baseDir.eachFileMatch FILES, ~/.*\.csv/, { File bak -> bak.delete() }
    }


    def "Verifying All Export without selection and Cancel button"() {
        when:
        open(npamappPage)
        then:
        assert npamappPage.hasExportAll()

        and:
        npamappPage.clickButtonExportAll()

        then:
        assert npamappPage.getDialogFragment().getDialogBoxHeader() == 'Export NE Accounts'
        assert (npamappPage.getDialogFragment().getDialogBoxBtnCount() == 2)
        assert npamappPage.getDialogFragment().checkButtonWithName('Export')
        assert npamappPage.getDialogFragment().checkButtonWithName('Cancel')
        assert npamappPage.getDialogFragment().isDisabledButtonWithName('Export')

        and:
        npamappPage.getDialogFragment().clickButtonWithName('Export')

        then:
        assert npamappPage.verifyTopSectionTitle()

    }

    def "Verifying All Export without selection and Export button"() {

        when:
        open(npamappPage)
        npamappPage.clickButtonExportAll()

        npamappPage.setPasskey("Test")

        then:
        assert npamappPage.verifyExportDialogContentErrorString("Passkey length must be at least 8 characters")

        and:
        npamappPage.clearPasskey()
        npamappPage.setPasskey("Test1234")

        then:
        assert npamappPage.verifyExportDialogContentNoErrorString()
        assert !npamappPage.getDialogFragment().isDisabledButtonWithName('Export')

        and:
        npamappPage.getDialogFragment().clickButtonWithName('Export')
        sleep(500)


        then:
        assert npamappPage.verifyTopSectionTitle()

//        and:
//        def names = []
//        baseDir.eachFileMatch FILES, ~/exportNeAccounts.enc/, { names << it.name }
//
//        then:
//        assert names == ['exportNeAccounts.enc']

    }

    def "Verifying All Export plain-text without selection and Export button"() {

        when:
        open(npamappPage)
        npamappPage.clickButtonExportAll()

        npamappPage.clickCheckPlainText()

        then:
        assert npamappPage.isDisabledPasskey()


        then:
        assert npamappPage.verifyExportDialogContentNoErrorString()
        assert !npamappPage.getDialogFragment().isDisabledButtonWithName('Export')

        and:
        npamappPage.getDialogFragment().clickButtonWithName('Export')
        sleep(500)


        then:
        assert npamappPage.verifyTopSectionTitle()

//        and:
//        def names = []
//        baseDir.eachFileMatch FILES, ~/exportNeAccounts.csv/, { names << it.name }
//
//        then:
//        assert names == ['exportNeAccounts.csv']

    }

    def "Verifying All Export with selection"() {

        when:
        open(npamappPage)
        sleep(3000)
        npamappPage.expandTopologySimpleSubnet()

        and: 'RN_Node_5 is selected'
        npamappPage.selectTopologyItems(browser, "RN_Node_9")

        then:
        assert npamappPage.hasExportAll()

        and: 'TAB changed to managed nodes and First Ne Account is selected'
        def table = npamappPage.getTableFragment()
        table.selectNeAccountsTab(browser, "Managed Nodes")
        sleep(1000)
        table.clickFirstTableRow()

        then:
        assert npamappPage.hasExport()

        and:
        npamappPage.clickButtonExport()

        then: 
        assert npamappPage.getDialogFragment().getDialogBoxHeader() == 'Export NE Accounts'
        assert (npamappPage.getDialogFragment().getDialogBoxBtnCount() == 2)
        assert npamappPage.getDialogFragment().checkButtonWithName('Export')
        assert npamappPage.getDialogFragment().checkButtonWithName('Cancel')
        assert npamappPage.getDialogFragment().isDisabledButtonWithName('Export')

        and:
        npamappPage.setFilename('MyExportedFile')
        npamappPage.setPasskey("Test1234")

        then:
        assert npamappPage.verifyExportDialogContentNoErrorString()
        assert !npamappPage.getDialogFragment().isDisabledButtonWithName('Export')

        and:
        npamappPage.getDialogFragment().clickButtonWithName('Export')

        then:
        assert npamappPage.verifyTopSectionTitle()

//        and:
//        def names = []
//        baseDir.eachFileMatch FILES, ~/MyExportedFile.enc/, { names << it.name }
//
//        then:
//        assert names == ['MyExportedFile.enc']


    }

    def "Verifying Export error"() {

        when:
        open(npamappPage)
        sleep(3000)
        npamappPage.expandTopologySimpleSubnet()

        and: 'RN_Node_5 is selected'
        npamappPage.selectTopologyItems(browser, "RN_Node_9")

        then:
        assert npamappPage.hasExportAll()

        and: 'TAB changed to managed nodes and First Ne Account is selected'
        def table = npamappPage.getTableFragment()
        table.selectNeAccountsTab(browser, "Managed Nodes")
        sleep(1000)
        table.clickFirstTableRow()

        then:
        assert npamappPage.hasExport()

        and:
        npamappPage.clickButtonExport()

        then:
        assert npamappPage.getDialogFragment().getDialogBoxHeader() == 'Export NE Accounts'
        assert (npamappPage.getDialogFragment().getDialogBoxBtnCount() == 2)
        assert npamappPage.getDialogFragment().checkButtonWithName('Export')
        assert npamappPage.getDialogFragment().checkButtonWithName('Cancel')
        assert npamappPage.getDialogFragment().isDisabledButtonWithName('Export')

        and:
        npamappPage.setFilename('MyExportedFile')
        npamappPage.setPasskey("Test1234")

        then:
        assert npamappPage.verifyExportDialogContentNoErrorString()
        assert !npamappPage.getDialogFragment().isDisabledButtonWithName('Export')

        and:
        RestHelper.setHttpError(422, 4422)
        npamappPage.getDialogFragment().clickButtonWithName('Export')

        then:
        sleep(500)
        assert npamappPage.getDialogFragment().getDialogBoxHeader() == 'Validation Failed'
        // The Export error dialog box always display a generic 'Unprocessable Entity.' error
        // due to the fact that the ajax try to convert the JSON error in a blob
        assert npamappPage.getDialogFragment().getDialogBoxText() == 'Unprocessable Entity.'
        RestHelper.clearHttpError();
    }



}
