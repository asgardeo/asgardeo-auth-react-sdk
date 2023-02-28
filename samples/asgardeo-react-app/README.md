# Asgardeo Auth React SDK Usage Example (Single Page Application)

This sample is developed to demonstrate the basic usage of the Asgardeo Auth React SDK.

## Getting Started

### Prerequisites
-   `Node.js` (version 10 or above).

### Register an Application

Follow the instructions in the [Try Out the Sample Apps](../../SAMPLE_APPS.md#try-out-the-sample-apps) section to register an application.

Make sure to add `https://localhost:3000` as a Redirect URL and also add it under allowed origins. 

### Download the Sample

Download the sample from [here](https://github.com/asgardeo/asgardeo-auth-react-sdk/releases/latest/download/asgardeo-react-app.zip) and extract the zip file.

### Configure the Sample

Update configuration file `src/config.json` with your registered app details.

**Note:** You will only have to paste in the `client ID` generated for the application you registered.

Read more about the SDK configurations [here](../../README.md#authprovider).

```json
{
    "clientID": "<ADD_CLIENT_ID_HERE>",
    "baseUrl": "https://api.asgardeo.io/t/<org_name>",
    "signInRedirectURL": "https://localhost:3000",
    "signOutRedirectURL": "https://localhost:3000",
    "scope": ["profile"]
}
```

### Run the Application

```bash
npm install && npm start
```
The app should open at [`https://localhost:3000`](https://localhost:3000)

### Change the Application's Development Server Port

By default, the development server runs on port `3000`. Incase if you wish to change this to something else, 
follow the steps below.

1. Update the `PORT` in [.env](.env) file in the app root.
2. Update the `signInRedirectURL` & `signOutRedirectURL` in [src/config.json](./src/config.json)
3. Go to the Asgardeo Console and navigate to the protocol tab of your application:
    - Update the Authorized Redirect URL.
    - Update the Allowed Origins.

## Contribute

Please read [Contributing to the Code Base](http://wso2.github.io/) for details on our code of conduct, and the process for submitting pull requests to us.

### Reporting Issues

We encourage you to report issues, improvements, and feature requests creating [Github Issues](https://github.com/asgardeo/asgardeo-auth-react-sdk/issues).

Important: And please be advised that security issues must be reported to security@wso2com, not as GitHub issues, in order to reach the proper audience. We strongly advise following the WSO2 Security Vulnerability Reporting Guidelines when reporting the security issues.

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](../../LICENSE) file for details.
