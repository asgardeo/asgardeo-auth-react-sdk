# Asgardeo Auth React SDK Usage Example (React-Express Full Stack Application)

This sample is developed to demonstrate the basic usage of the Asgardeo Auth React SDK.

![Sequence Diagram](https://github.com/asgardeo/asgardeo-auth-react-sdk/blob/main/samples/asgardeo-choreo-react-express/diagram.png?raw=true)

## Getting Started

### Register an Application

Follow the instructions in the [Try Out the Sample Apps](../../README.md#try-out-the-sample-apps) section to register an application.

Make sure to add `https://localhost:3000` as a Redirect URL and also add it under allowed origins. 

### Download the Sample

Download the sample from [here](https://github.com/asgardeo/asgardeo-auth-react-sdk/releases/latest/download/asgardeo-choreo-react-express.zip) and extract the zip file.

### Configure the Sample

#### Configure the Client

Update `SDKConfig` in the configuration file located in `apps/client/src/config.ts` with your registered app details.

Additionally you can configure the path of the express api under `ApiBaseUrl`.

**Note:** You will only have to paste in the `client ID` generated for the application you registered.

Read more about the SDK configurations [here](../../README.md#authprovider).

```json
export const SDKConfig = {
    clientID: "<CLIENT ID>",
    signInRedirectURL: "http://localhost:3000",
    signOutRedirectURL: "http://localhost:3000",
    baseUrl: "https://api.asgardeo.io/t/<ORGANIZATION>",
    scope: [ "openid","profile" ],
    disableTrySignInSilently: false,
    resourceServerURLs: "http://localhost:8080"
}

export const REACT_APP_API_BASE_URL = "http://localhost:8080";

```

##### Run the Application

```bash
1. cd apps/client
2. npm install && npm run start
```
Client app should open at [`https://localhost:3000`](https://localhost:3000) 

#### Configure the Server

Make a copy of the .env.example file located in `apps/server/.env.example` and rename the file as .env. Then change the values with your registered app details of Asgardeo and Choreo portals accordingly.

Read more about the SDK configurations [here](../../README.md#authprovider).

```json
NODE_PORT=8080
NODE_ENV=production
// Can use a tool like https://1password.com/password-generator to generate the secret
SECRET_COOKIE_PASSWORD=<AT LEAST 32 DIGIT SECRET>
ASGARDEO_CLIENT_ID=<ASGARDEO CLIENT ID>
ASGARDEO_CLIENT_SECRET=<ASGARDEO CLIENT SECRET>
ASGARDEO_BASE_URL=https://api.asgardeo.io/t/<ASGARDEO ORGANIZATION>
CHOREO_CONSUMER_KEY=<CHOREO CONSUMER KEY>
CHOREO_ORGANIZATION=<CHOREO ORGANIZATION>
CHOREO_TOKEN_ENDPOINT=<CHOREO TOKEN ENDPOINT>
CHOREO_API_ENDPOINT=<CHOREO HOSTED API ENDPONT>
```

### Run the Application

```bash
1. cd apps/server
2. npm install && npm run build
2. npm run start
```
Server should open at [`https://localhost:8080`](https://localhost:8080).

## Contribute

Please read [Contributing to the Code Base](http://wso2.github.io/) for details on our code of conduct, and the process for submitting pull requests to us.

### Reporting Issues

We encourage you to report issues, improvements, and feature requests creating [Github Issues](https://github.com/asgardeo/asgardeo-auth-react-sdk/issues).

Important: And please be advised that security issues must be reported to security@wso2com, not as GitHub issues, in order to reach the proper audience. We strongly advise following the WSO2 Security Vulnerability Reporting Guidelines when reporting the security issues.

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](../../LICENSE) file for details.
