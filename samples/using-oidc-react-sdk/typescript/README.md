# OIDC REACT SDK Usage Example (Single Page Application)

asgardeo / WSO2 Identity Server integration example using the OIDC REACT SDK.
This sample uses Typescript.

## Getting started

Navigate to https://console.portals.asgardeo.io and login (Register if you don't have an account). Or if you are using the on premise version (WSO2 Identity Server) follow below 1-3 steps.

1. Download [WSO2 Identity Server 5.11.0](https://github.com/wso2/product-is/releases) or above.
2. Navigate and execute `bin/wso2server.sh` (For unix environment) or `bin/wso2server.bat` (For windows environment) to run the WSO2 Identity Server.
3. After the server is started, navigate to `https://localhost:9443/console/` from the browser, and login to the system by entering the admin password.

   > **Hint!** Can find out the default password details here: [https://docs.wso2.com/display/ADMIN44x/Configuring+the+System+Administrator](https://docs.wso2.com/display/ADMIN44x/Configuring+the+System+Administrator)

**Follow these steps to Register an Application (SPA)**
---

4. Navigate to **"Applications -> Develop"** section. And click **"New Application"** on right top corner.
5. Click **"Single Page Application -> General Applications"**.
6. Give a Name to the application and add `http://localhost:5000` & `http://localhost:5000/home` to **"Redirect URLs"**, and proceed. (This is a security feature and we need to inform asgardeo / WSO2 Identity Server that this endpoints are trusted)
7. Also we need to inform the Server that the origin `http://localhost:5000` is also trusted. You can do this by navigating to **"Access -> OIDC -> Allowed Origins"**. That's all required to connect your application.
8. Now the application is registered. You can navigate to **"Attribute - > Attribute Selection"** add attribute `email` to retrieve when we login to the sample (But this is optional if you want to see how it works). Also you can enable retrieve tenant domain by ticking **"Subject -> Include Tenant Domain"**

And you are ready! OIDC details can be found under **"Access -> OIDC"**

### Setup and run sample

1. Update configuration file `src/config.json` with your registered application details. Rest of the configuration in the config file keep as it is.

    __REFERENCE__

    ```javascript
    {
        ...
        // ClientID generated for the application. E.g. "uxRd9AqFa3Blp1ASvKYaUizU7pca"
        "clientID": "",

        // Server Origin URL with your tenant details. E.g. https://localhost:9443 (WSO2 Identity Server) or https://asgardeo.io/t/demo (asgardeo)
        "serverOrigin": "",
        ...
    };

2. If this is the first time, run `npm install` to install dependencies.
3. You are all set. Run `npm start`.
4. Navigate to `http://localhost:5000` from the browser.

## License

Licenses this source under the Apache License, Version 2.0 ([LICENSE](LICENSE)), You may not use this file except in compliance with the License.
