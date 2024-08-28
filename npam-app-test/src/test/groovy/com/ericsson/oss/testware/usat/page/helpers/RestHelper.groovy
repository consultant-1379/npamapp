package com.ericsson.oss.testware.usat.page.helpers

/**
 * Provides means to issue administration REST calls, typically used for test setup.
 *
 * @see /cell-management-src/cellmanagement/server.js for the stubbed REST endpoints and the corresponding REST requests.
 */
class RestHelper {

    static final String LOCALHOST_URL = "http://localhost:8585"

    static boolean changeNpamCapabilities(String capabilities) {
        return performPutRequest(LOCALHOST_URL + "/editNpamCapabilities", capabilities)
    }

    static boolean setHttpError(int status, int internalErrorCode) {
        String body = "{\"status\": " + status+",\"internalErrorCode\" : "+internalErrorCode+" }"
//        println("DUS BODY : " + body)
        return performPutRequest(LOCALHOST_URL + "/setHttpError", body )
    }

    static boolean clearHttpError() {
        return performPutRequest(LOCALHOST_URL + "/setHttpError", "{\"status\" : 200,\"internalErrorCode\" : 0 }")
    }

/*
    static void changeUserRoleActions(String user, String actions) {
        new URL(LOCALHOST_URL + "/editUserRoleActions/" + user + "/" + actions).getText()
    }

    static boolean resetAllCellData() throws MalformedURLException, IOException {
        return performGetRequest(LOCALHOST_URL + "/resetAllCellData")
    }
*/
    static boolean clearServerSettings()throws MalformedURLException, IOException {
        return performGetRequest(LOCALHOST_URL + "/clearServerSettings")
    }
/*
    static boolean setFailedResponseToUserSettings()throws MalformedURLException, IOException {
        return performGetRequest(LOCALHOST_URL + "/setFailureResponseForUserSettings")
    }


    static boolean manuallyChangeAdminStateOfOneCell(String fdn, String adminState) throws MalformedURLException, IOException {
        return performGetRequest(LOCALHOST_URL + "/setAdminState?fdn=" + fdn + "&adminState=" + adminState)
    }

    static boolean sendSignalToFinishLock() throws MalformedURLException, IOException {
        return performGetRequest(LOCALHOST_URL + "/completeWaitingLock")
    }
*/
    private static boolean performGetRequest(String requestURL) throws MalformedURLException, IOException {
        HttpURLConnection connection = (HttpURLConnection) (new URL(requestURL)).openConnection()
        return connection.getResponseCode() == HttpURLConnection.HTTP_OK
        // Return failure if server returned any status other than 200 OK
    }

    private static boolean performPutRequest(String requestURL, String json ) throws MalformedURLException, IOException {
        HttpURLConnection connection = (HttpURLConnection) (new URL(requestURL)).openConnection()
        connection.setRequestMethod("PUT");
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setDoOutput(true);
        OutputStream os = connection.getOutputStream();
        os.write(json.getBytes());
        os.flush();
        os.close();

        int r_code = connection.getResponseCode();
 //       println("CONNECTION CODE: " + r_code);

        return r_code == HttpURLConnection.HTTP_OK
        // Return failure if server returned any status other than 200 OK
    }

    static boolean setFailedResponseToTableSettings()throws MalformedURLException, IOException {
        return performGetRequest(LOCALHOST_URL + "/setFailureResponseForTableSettings")
    }

}

