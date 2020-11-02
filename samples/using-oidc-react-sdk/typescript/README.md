# OIDC REACT SDK Usage Example (Single Page Application)

Asgardio / WSO2 Identity Server integration example using the OIDC REACT SDK.
This sample uses Typescript.

## Getting started

Navigate to https://console.portals.asgardio.io and login (Register if you don't have an account). Or if you are using the on premise version (WSO2 Identity Server) follow below 1-3 steps.

1. Download [WSO2 Identity Server 5.11.0](https://github.com/wso2/product-is/releases) or above.
2. Navigate and execute `bin/wso2server.sh` (For unix environment) or `bin/wso2server.bat` (For windows environment) to run the WSO2 Identity Server.
3. After the server is started, navigate to `https://localhost:9443/console/` from the browser, and login to the system by entering the admin password.

   > **Hint!** Can find out the default password details here: [https://docs.wso2.com/display/ADMIN44x/Configuring+the+System+Administrator](https://docs.wso2.com/display/ADMIN44x/Configuring+the+System+Administrator)

**Follow these steps to Register an Application (SPA)**
---

4. Navigate to **"Applications -> Develop"** section. And click **"New Application"** on right top corner.
5. Click **"Single Page Application -> General Applications"**.
6. Give a Name to the application and add `http://localhost:5000` to **"Redirect URLs"**, and proceed.

Application is registration is done. OIDC details can be found under **"Access -> OIDC"**

### Setup and run sample

1. Update configuration file `src/config.json` with your registered application details. Rest of the configuration in the config file keep as it is.

    __REFERENCE__

    ```javascript
    {
        ...
        // ClientID generated for the application. E.g. "uxRd9AqFa3Blp1ASvKYaUizU7pca"
        "clientID": "",

        // Server Origin URL with your tenant details. E.g. https://localhost:9443 (WSO2 Identity Server) and https://asgardio.io/t/demo (Asgardio)
        "serverOrigin": "",
        ...
    };

2. If this is the first time, run `npm install` to install dependencies.
3. You are all set. Run `npm start`.
4. Navigate to `http://localhost:5000` from the browser.

## License

Licenses this source under the Apache License, Version 2.0 ([LICENSE](LICENSE)), You may not use this file except in compliance with the License.
