# Asgardeo Auth React SDK Usage Example (Single Page Application)

This sample is developed to demonstrate the basic usage of the Asgardeo Auth React SDK.

## Getting Started

### Register an Application

Follow the instructions in the [Try Out the Sample Apps](../../README.md#try-out-the-sample-apps) section to register an application.

Make sure to add `https://localhost:5000` as a Redirect URL and also add it under allowed origins. 

### Download the Sample

Download the sample from [here](https://github.com/asgardeo/asgardeo-auth-react-sdk/releases/latest/download/asgardeo-react-app.zip) and extract the zip file.

### Configure the Sample

Update configuration file `src/config.json` with your registered app details.

**Note:** You will only have to paste in the `client ID` generated for the application you registered.

Read more about the SDK configurations [here](../../README.md#authprovider).

```json
{
    "clientID": "<ADD_CLIENT_ID_HERE>",
    "serverOrigin": "https://localhost:9443",
    "signInRedirectURL": "https://localhost:5000",
    "signOutRedirectURL": "https://localhost:5000"
}
```

### Run the Application

```bash
npm install && npm start
```
The app should open at [`https://localhost:5000`](https://localhost:5000)

## Contribute

Please read [Contributing to the Code Base](http://wso2.github.io/) for details on our code of conduct, and the process for submitting pull requests to us.

### Reporting Issues

We encourage you to report issues, improvements, and feature requests creating [Github Issues](https://github.com/asgardeo/asgardeo-auth-react-sdk/issues).

Important: And please be advised that security issues must be reported to security@wso2com, not as GitHub issues, in order to reach the proper audience. We strongly advise following the WSO2 Security Vulnerability Reporting Guidelines when reporting the security issues.

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](../../LICENSE) file for details.
