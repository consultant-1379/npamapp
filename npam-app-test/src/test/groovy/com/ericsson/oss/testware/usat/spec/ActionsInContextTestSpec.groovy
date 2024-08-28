package com.ericsson.oss.testware.usat.spec

import com.ericsson.oss.testware.usat.page.helpers.ScopingPanelHelper
import com.ericsson.oss.testware.usat.page.object.NpamappMainPage
import org.apache.commons.io.FileUtils
import org.jboss.arquillian.graphene.page.Page
import com.ericsson.oss.testware.usat.page.helpers.RestHelper
import org.openqa.selenium.OutputType
import org.openqa.selenium.TakesScreenshot
import org.openqa.selenium.WebDriver
import spock.lang.Shared

/**
 * Contains all component tests related to the actions that appear in the Action Bar component of
 * the top section of Network Privileged Access Management
 * as well as the context menu on the table
 */
class ActionsInContextTestSpec extends BaseSpecification {

    public final static int ALL_OTHER_NODES_TOPOLOGY_INDEX = 2 // depending from mock
    public final static int SIMPLE_SUBNET_INDEX = 2 // Simple_Subnet
    public final static int PARENT_SN_INDEX = 1 // Parent_Subnet

    @Page
    NpamappMainPage page

    @Shared
    ScopingPanelHelper scopingPanelHelper = new ScopingPanelHelper()

    def setup() {
        open(page)
        page.getScopingPanelFragment().expandTopologyTabItem(ALL_OTHER_NODES_TOPOLOGY_INDEX)
    }

    def "Verifying Buttons after opening application"() {

        when: 'NPam application is launched'
        open(page)

        then: 'Import, Create, Export and View Jobs button are enabled in the Action Bar'
        def actionBar = page.getActionBarFragment()
        assert actionBar.hasDropDownButton("Create Job")
        assert actionBar.hasButton("View Jobs")
        assert actionBar.hasButton("Import")
        assert actionBar.hasButton("Export All NE Accounts")
        assert actionBar.hasSummaryButton()
        actionBar.clickActionBarDropdown()
        sleep(1000)
        def dropdown = page.getDropdownFragment()
        assert !dropdown.hasDropdownItems('Create NE Accounts', 'Detach NE Accounts', 'Rotate NE Account Credentials')
        assert dropdown.hasDropdownItems('Rotate NE Account Credentials From File')
    }

    def "Verifying Buttons after selecting a Node in the Ne Account table"() {

        when: 'Messages_Subnet is selected'
        scopingPanelHelper.selectTopologyItems(browser, page, "RN_Node_9")

        and: 'First Ne Account is selected'
        def table = page.getTableFragment()
        sleep(10000)
        table.clickFirstTableRow()

        then: 'Import, Create, Export and View Jobs button are enabled in the Action Bar'
        def actionBar = page.getActionBarFragment()

        assert actionBar.hasButton("Detach")
        assert actionBar.hasButton("Rotate Credentials")
        assert actionBar.hasButton("Export")
        assert actionBar.hasSummaryButton()
        !actionBar.hasButton("Create Job")
        !actionBar.hasButton("Create NE Accounts")
        !actionBar.hasButton("View Jobs")
        !actionBar.hasButton("Import")
    }

    def "Verifying Update Configuration Button is present only if row selected has warning"() {
        when: 'RN_NODE_1 is selected'
        page.getScopingPanelFragment().expandTopologyTabItem(PARENT_SN_INDEX)
        scopingPanelHelper.selectTopologyItems(browser, page, "RN_Node_1")

        then: 'no update configuration button is present'
        def table = page.getTableFragment()
        sleep(3000)
        table.clickFirstTableRow()
        def actionBar = page.getActionBarFragment()
        assert !actionBar.hasButton("Update NE Accounts Configuration")

        then: 'RN_NODE_2 is selected'
        scopingPanelHelper.selectTopologyItems(browser, page, "RN_Node_2")
        sleep(3000)
        table.clickFirstTableRow()
        def actionBar2 = page.getActionBarFragment()
        assert actionBar.hasButton("Update NE Accounts Configuration")
    }

    static def neAccountCapability = "{\"resource\": \"neaccount\",\"actions\" : [\"read\"] }"
    static def neAccountImportCapability = "[" + neAccountCapability + ",{\"resource\": \"neaccount_import\",\"actions\" : [\"execute\"] }]"
    static def neAccountExportCapability = "[" + neAccountCapability + ",{\"resource\": \"neaccount_export\",\"actions\" : [\"execute\"] }]"
    static def neCreateJobCapability = "[" + neAccountCapability + ",{\"resource\": \"neaccount_job\",\"actions\" : [\"create\"] }]"
    static def neViewJobCapability = "[" + neAccountCapability + ",{\"resource\": \"neaccount_job\",\"actions\" : [\"read\"] }]"

    def "Verifying buttons after opening application, according with user capabilities"() {
        when: 'NPam application is launched'
        RestHelper.changeNpamCapabilities(capabilities)
        open(page)

        then: 'Import, Create, Export and View Jobs button are enabled in the Action Bar'
        def actionBar = page.getActionBarFragment()
        assert actionBar.hasButton("View Jobs") == viewJobButtonEnabled
        assert actionBar.hasButton("Import") == importButtonEnabled
        assert actionBar.hasButton("Export All NE Accounts") == exportJobButtonEnabled
        assert actionBar.hasSummaryButton()
        actionBar.hasDropDownButton('Create Job') == createJobButtonEnabled

        cleanup:
        RestHelper.changeNpamCapabilities("[]")

        where:
        capabilities              | importButtonEnabled | exportJobButtonEnabled | createJobButtonEnabled | viewJobButtonEnabled
        neAccountImportCapability | true                | false                  | false                  | false
        neAccountExportCapability | false               | true                   | false                  | false
        neCreateJobCapability     | false               | false                  | true                   | false
        neViewJobCapability       | false               | false                  | false                  | true

    }

    def "Verifying Buttons after selecting a Node in the Ne Account table (Managed Nodes), according with user capabilities"() {
        when: 'NPam application is launched'
        RestHelper.changeNpamCapabilities(capabilities)
        open(page)
        page.getScopingPanelFragment().expandTopologyTabItem(SIMPLE_SUBNET_INDEX)

        and: 'RN_NODE_9 is selected'
        scopingPanelHelper.selectTopologyItems(browser, page, "RN_Node_9")

        and: 'First Ne Account is selected'
        def table = page.getTableFragment()
        sleep(1000)
        table.clickFirstTableRow()
        sleep(1000)

        then: 'Import, Create, Export and View Jobs button are enabled in the Action Bar'
        def actionBar = page.getActionBarFragment()
        sleep(1000)
        assert actionBar.hasButton('Detach') == createJobManagedNe
        assert actionBar.hasButton('Rotate Credentials') == createJobManagedNe
        assert actionBar.hasButton('Export') == exportJobManagedNe

        cleanup:
        RestHelper.changeNpamCapabilities("[]")

        where:
        capabilities              |  exportJobManagedNe | createJobManagedNe
        neAccountImportCapability |  false                  | false
        neAccountExportCapability |  true                   | false
        neCreateJobCapability     |  false                  | true
        neViewJobCapability       |  false                  | false
    }

    def "Verifying Buttons after selecting a Node in the Ne Account table (Unmanaged Nodes), according with user capabilities"() {
        when: 'Messages_Subnet is selected'
        RestHelper.changeNpamCapabilities(capabilities)
        open(page)
        page.getScopingPanelFragment().expandTopologyTabItem(PARENT_SN_INDEX)
        and: 'RN_Node_5 is selected'
        scopingPanelHelper.selectTopologyItems(browser, page, "RN_Node_5")
        and: 'TAB changed to unmanaged nodes and First Ne Account is selected'
        def table = page.getTableFragment()
        table.selectNeAccountsTab(browser, "Unmanaged Nodes")
        sleep(1000)
        table.clickFirstTableRow()
        sleep(1000)
       // takeSnapShot(browser, "/tmp/screenshotUnmanagedNodes.png")
        then: 'Import, Create, Export and View Jobs button are enabled in the Action Bar'
        def actionBar = page.getActionBarFragment()
        sleep(1000)
        assert actionBar.hasButton("Detach") == createJobManagedNe
        assert actionBar.hasButton("Create NE Accounts") == createJobButtonUnmanagedNe
        assert actionBar.hasButton("Rotate Credentials") == createJobManagedNe
        assert actionBar.hasButton("Export") == exportJobButtonEnabled

        cleanup:
        RestHelper.changeNpamCapabilities("[]")

        where:
        capabilities              | createJobButtonUnmanagedNe | exportJobButtonEnabled | createJobManagedNe
        neAccountImportCapability | false                    | false                  | false
        neAccountExportCapability | false                    | false                  | false
        neCreateJobCapability     | true                     | false                  | false
        neViewJobCapability       | false                    | false                  | false
    }

    public static void takeSnapShot(WebDriver webdriver, String fileWithPath) throws Exception{
        //Convert web driver object to TakeScreenshot
        TakesScreenshot scrShot =((TakesScreenshot)webdriver);
        //Call getScreenshotAs method to create image file
        File SrcFile=scrShot.getScreenshotAs(OutputType.FILE);
        //Move image file to new destination
        File DestFile=new File(fileWithPath);
        //Copy file at destination
        FileUtils.copyFile(SrcFile, DestFile);
    }
}
