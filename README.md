# Asgardio JavaScript OIDC SDK
![Builder](https://github.com/asgardio/asgardio-js-oidc-sdk/workflows/Builder/badge.svg)
[![Stackoverflow](https://img.shields.io/badge/Ask%20for%20help%20on-Stackoverflow-orange)](https://stackoverflow.com/questions/tagged/wso2is)
[![Join the chat at https://join.slack.com/t/wso2is/shared_invite/enQtNzk0MTI1OTg5NjM1LTllODZiMTYzMmY0YzljYjdhZGExZWVkZDUxOWVjZDJkZGIzNTE1NDllYWFhM2MyOGFjMDlkYzJjODJhOWQ4YjE](https://img.shields.io/badge/Join%20us%20on-Slack-%23e01563.svg)](https://join.slack.com/t/wso2is/shared_invite/enQtNzk0MTI1OTg5NjM1LTllODZiMTYzMmY0YzljYjdhZGExZWVkZDUxOWVjZDJkZGIzNTE1NDllYWFhM2MyOGFjMDlkYzJjODJhOWQ4YjE)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/wso2/product-is/blob/master/LICENSE)
[![Twitter](https://img.shields.io/twitter/follow/wso2.svg?style=social&label=Follow)](https://twitter.com/intent/follow?screen_name=wso2)
---
## Table of Contents

- [Introduction](#introduction)
- [Install](#install)
- [Getting Started](#getting-started)
- [Try Out the Sample Apps](#try-out-the-sample-apps)
- [APIs](#apis)
    - [getInstance](#getinstance)
    - [initialize](#initialize)
        - [Storage](#storage)
        - [ServiceResourceTypes](#serviceresourcetypes)
    - [getUserInfo](#getuserinfo)
    - [signIn](#signin)
    - [signOut](#signout)
    - [httpRequest](#httpRequest)
    - [httpRequestAll](#httpRequestAll)
    - [customGrant](#customGrant)
        - [The data Attribute](#the-data-attribute)
    - [endUserSession](#endusersession)
    - [getServiceEndpoints](#getserviceendpoints)
    - [getDecodedIDToken](#getdecodedidtoken)
- [Using the `form_post` Response Mode](#using-the-form_post-response-mode)
- [Develop](#develop)
    - [Prerequisites](#prerequisites)
    - [Installing Dependencies](#installing-dependencies)
- [Contribute](#contribute)
- [License](#license)

## Introduction
Asgardio's OIDC SDK for JavaScript allows Single Page Applications to use OIDC or OAuth2 authentication in a simple and secure way. By using Asgardio and the JavaScript OIDC SDK, developers will be able to add identity management to their Single Page Applications in a jiffy.

## Install
Install the JavaScript library from the npm registry.
```
npm install --save @asgardio/oidc-js
```
Or simply load the SDK by importing the script into the header of your HTML file.
```html
<script src="https://unpkg.com/@asgardio/oidc-js@0.1.0/dist/main.js"></script>

<script>
const auth = AsgardioAuth.IdentityClient.getInstance();
</script>
```

## Getting Started
```javascript
// The SDK provides a client that can be used to carry out the authentication.
import { IdentityClient } from "@asgardio/oidc-js";

// This client is a singleton and can be instantiated as follows.
const auth = IdentityClient.getInstance();

// Once instantiated, the  client can be initialized by passing the relevant parameters such as the server origin, redirect URL, client ID, etc.
auth.initialize({
     signInRedirectURL: "http://localhost:9443/myaccount/login",
     signOutRedirectURL: "http://localhost:9443/myaccount/login",
     clientHost: "http://localhost:9443/myaccount/",
     clientID: "client ID",
     serverOrigin: "http://localhost:9443"
});

// To sign in, simply call the `signIn()` method.
auth.signIn();

// The `sign-in` hook is used to fire a callback function after signing in is successful.
auth.on("sign-in", (response) => {
    alert("You have successfully signed in!");
});

```

[Learn more](#apis).

## Try Out the Sample Apps
### 1. Create a Service Provider
Before trying out the sample apps, you need to a create a service provider in the Identity Server.
1. So, navigate to `https://localhost:9443/carbon" and click on `Add` under `Service Providers` in the left-hand menu panel.

2. Enter `Sample` as the name of the app and click on `Register`.

3. Then, expand the `Inbound Authentication Configuration` section. Under that, expand `OAuth/OpenID Connect Configuration` section and click on `Configure`.

4. Under `Allowed Grant Types` uncheck everything except `Code` and `Refresh Token`.

5. Enter `http://localhost:3000` as the `Callback Url`.

6. Check `Allow authentication without the client secret`.

7. Click `Add` at the bottom.

8. Copy the `OAuth Client Key`.

### 2. Running the sample apps
Build the apps by running the following command at the root directory.
```
npm run build
```

#### 1. Vanilla JavaScript Sample
You can try out the Vanilla JavaScript Sample App from the [samples/vanilla-js-app](samples/vanilla-js-app). The instructions to run the app can  be found [here](/samples/vanilla-js-app/README.md)

#### 2. React Sample
You can try out the React Sample App from the [samples/react-js-app](samples/react-js-app). The instructions to run the app can  be found [here](/samples/react-js-app/README.md)

#### 2. Java Webapp Sample
You can try out the Java Webapp Sample App from the [samples/java-webapp](samples/java-webapp). The instructions to run the app can  be found [here](/samples/java-webapp/README.md)

## APIs
### getInstance
This returns an instance of the `IdentityClient`. Since the `IdentityClient` is a singleton, this method returns the same instance no matter how many times it is called.

This allows the developers the flexibility of using multiple files to implement the authentication logic. That is, you can have the sign in logic implemented on one page and the sign out logic on another.

### initialize

The `initialize` method is used to the initialize the client. This *MUST* be called soon after instantiating the `IdentityClient` and before calling another methods.

This method takes a `config` object as the only argument. The attributes of the `config` object is as follows.

|Attribute| Type | Default Value| Description|
|:-----|:----|:----|:----|
|`signInRedirectURL`|`string`||The URL to redirect to after the user authorizes the client app. eg: `https://conotoso.com/login` |
|`signOutRedirectURL`|`string`||The URL to redirect to after the user signs out. eg: `https://conotoso.com/logout` |
|`clientHost`|`string`||The hostname of the client app.  eg: `https://contoso.com`|
|`clientID`| `string` ||The client ID of the OIDC application hosted in the Asgardio.
|`clientSecret` (optional)|`string`|""|The client secret of the OIDC application|
|`enablePKCE` (optional)|`boolean`|`true`|Specifies if a PKCE should be sent with the request for the authorization code. |
|`prompt` (optional)|`string`|""|Specifies the prompt type of an OIDC request|
|`responseMode` (optional)|`string`|`"query"`| Specifies the response mode. The value can either be `query` or `form_post`|
|`scope` (optional)|`string[]`|`["openid"]`|Specifies the requested scopes|
|`serverOrigin`|`string`|""|The origin of the Identity Provider. eg: `https://www.asgardio.io`|
|[`storage`](#storage) (optional)| `"sessionStorage"`, `"webWorker"`, `"localStorage"`|`"sessionStorage"`| The storage medium where the session information such as the access token should be stored.|
|`baseUrls` (required if the `storage` is set to `webWorker`|`string[]`|""|The URLs of the API endpoints. This is needed only if the storage method is set to `webWorker`. When API calls are made through the [`httpRequest`](#httprequest) or the [`httpRequestAll`](#httprequestall) method, only the calls to the endpoints specified in the `baseURL` attribute will be allowed. Everything else will be denied.|
|`endpoints` (optional)|[`ServiceResourceTypes`](#serviceresourcetypes)|[ServiceResource Default Values](#serviceresourcetypes)| The OIDC endpoint URLs. The SDK will try to obtain the endpoint URLS using the `.well-known` endpoint. If this fails, the SDK will use these endpoint URLs. If this attribute is not set, then the default endpoint URLs will be used.|
|`authorizationCode` (optional)| `string`|""|When the `responseMode` is set to `from_post`, the authorization code is returned as a `POST` request. Apps can use this attribute to pass the obtained authorization code to the SDK. Since client applications can't handle `POST` requests, the application's backend should implement the logic to receive the authorization code and send it back to the SDK.|
| `sessionState` (optional) | `string`|""| When the `responseMode` is set to `from_post`, the session state is returned as a `POST` request. Apps can use this attribute to pass the obtained session state to the SDK. Since client applications can't handle `POST` requests, the application's backend should implement the logic to receive the session state and send it back to the SDK.|
|`validateIDToken`(optional)|`boolean`|`true`|Allows you to enable/disable JWT ID token validation after obtaining the ID token.|

The `initialize` hook is used to fire a callback function after initializing is successful. Check the [on()](#on) section for more information.
### Storage
Asgardio allows the session information including the access token to be stored in three different places, namely,
1. Session storage
2. Local storage
3. Web worker

Of the three methods, storing the session information in the **web worker** is the **safest** method. This is because the web worker cannot be accessed by third-party libraries and data there cannot be stolen through XSS attacks. However, when using a web worker to store the session information, the [`httpRequest`](#httprequest) method has to be used to send http requests. This method will route the request through the web worker and the web worker will attach the access token to the request before sending it to the server.

#### ServiceResourceTypes
|Attribute|Type|Default Value|Description|
|:--|:--|:--|:--|
|`authorize`|`string`|`"/oauth2/authorize"`| The endpoint to send the authorization request to.|
|`jwks`|`string`|`"/oauth2/jwks"`| The endpoint from which the JSON Web Keyset can be obtained`|
|`logout`|`string`| `"/oidc/logout"`|The endpoint to send the logout request to.
|`oidcSessionIFrame`|`string`| `"/oidc/checksession"`| The URL of the OIDC session iframe.
|`revoke`|`string`| `"/oauth2/revoke"`| The endpoint to send the revoke-access-token request to.
|`token`|`string`| `"/oauth2/token"`| The endpoint to send the token request to.|
|`wellKnown`|`string`| `"/oauth2/oidcdiscovery/.well-known/openid-configuration"`| The endpoint to receive the OIDC endpoints from|

```javascript
auth.initialize(config)
```

### getUserInfo
This method returns the information about the authenticated user as an object. The object has the following attributes.

|Attribute| Type | Description|
|:--|:--|:--|
|`email`|`string`|The email address of the user|
|`username`|`string`| The username of the user|
|`displayName`| `string`| The display name of the user|
`allowedScopes`|`string`| The scopes the user has authorized the client to access|
```javascript
auth.getUserInfo().then((response) => {
    // console.log(response);
}).catch(error=>{
    // console.error(error);
})
```

### signIn

This method initiates the authentication flow.

The `sign-in` hook is used to fire a callback function after signing in is successful. Check the [on()](#on) section for more information.


```javascript
auth.signIn();
```

### signOut
This method ends the user session at the Identity Server and logs the user out.

The `sign-out` hook is used to fire a callback function after signing out is successful. Check the [on()](#on) section for more information.

### httpRequest
This method  is used to send http requests to the Identity Server. The developer doesn't need to manually attach the access token since this method does it automatically.

If the `storage` type is set to `sessionStorage` or `localStorage`, the developer may choose to implement their own ways of sending http requests by obtaining the access token from the relevant storage medium and attaching it to the header. However, if the `storage` is set to `webWorker`, this is the *ONLY* way http requests can be sent.

This method accepts a config object which is of type `AxiosRequestConfig`. If you have used `axios` before, you can use the `httpRequest` in the exact same way.

For example, to get the user profile details after signing in, you can query the `me` endpoint as follows:

```javascript
const auth = IdentityClient.getInstance();

const requestConfig = {
    headers: {
        "Accept": "application/json",
        "Access-Control-Allow-Origin": "https://localhost:9443/myaccount,
        "Content-Type": "application/scim+json"
    },
    method: "GET",
    url: "https://localhost:9443/scim2/me
};

return auth.httpRequest(requestConfig)
    .then((response) => {
        // console.log(response);
    })
    .catch((error) => {
        // console.error(error);
    });
```

### httpRequestAll
This method is used to send multiple http requests at the same time. This works similar to `axios.all()`. An array of config objects need to be passed as the argument and an array of responses will be returned in a `Promise` in the order in which the configs were passed.

```javascript
auth.httpRequestAll(configs).then((responses) => {
    response.forEach((response) => {
        // console.log(response);
    });
}).catch((error) => {
    // console.error(error);
});
```

### customGrant
This method allows developers to use custom grants provided by their Identity Servers. This method accepts an object that has the following attributes as the argument.
|Attribute|Type|Description|
|:--|:--|:--|
`id`| `string`|A unique id for the custom grant. This allows developers to use multiple custom grants.|
`data`| `any`|The data to be attached to the body of the request to the Identity Server|
`signInRequired`| `boolean`|Specifies if the custom grant requires an active user session.|
`attachToken`| `boolean`|Specifies if the access token should be attached to the header of the request.|
`returnsSession`| `boolean`|Specifies if the response to the custom grant request would return session information. If set to yes, then the current session will be updated with the returned session.|
`returnResponse`| `boolean`|Specifies if the response returned by the custom grant should be returned back. If the `returnsSession` attribute is set to `true` then only the user information is returned.|

The `custom-grant` hook is used to fire a callback function after a custom grant request is successful. Check the [on()](#on) section for more information.

#### The data attribute
Often, you may have to send session information in the body of a custom grant request. Since when using a web worker to store the session information, you won't have access to the session information, Asgardio provides template tags to attach the necessary session information. When a template tag is used, the SDK automatically replaces the tag with the relevant session information before sending the request. For example, if the access token should be send in the body of the request, you can use the `{{token}}` template tag. The SDK will replace this tag with the access token before dispatching the request.

The following template tags are at your disposal.
|Template Tags| Session Information Attached|
|:--|:--|
`"{{token}}"`|The access token|
`"{{username}}"`|The username|
`"{{scope}}"`| The allowed scopes |
`"{{clientId}}"`| The client ID|
`"{{clientSecret}}"`|The client secret|

```javascript
return auth.customGrant({
    attachToken: false,
    data: {
        client_id: "{{clientId}}",
        grant_type: "account_switch",
        scope: "{{scope}}",
        token: "{{token}}",
    },
    id: "account-switch",
    returnResponse: true,
    returnsSession: true,
    signInRequired: true
});
```

### endUserSession
This method revokes the access token and clears the session information from the storage.

The `end-user-session` hook is used to fire a callback function after end user session is successful. Check the [on()](#on) section for more information.

### getServiceEndpoints
This method returns an object containing the OIDC endpoints obtained from the `.well-known` endpoint.

### getDecodedIDToken
This method returns the decoded payload of the JWT ID token.

### on
The `on` method is used to hook callback functions to authentication methods. The method accepts a hook name and a callback function as the only arguments except when the hook name is "custom-grant", in which case the id of the custom grant should be passed as the third argument. The following hooks are available.

|Hook|Method to which the callback function is attached| Returned Response|
|:--|:--|:--|
|`"sign-in"`|`signIn()`| The user information|
|`"sign-out"`|`signOut()`|
|`"initialize"`|`initialize()`|A boolean value indicating if the initialization was successful or not.|
|`"http-request-start"`| `httpRequest()` (Called before an http request is sent)|
|`"http-request-finish"`|`httpRequest()` (Called after an http request is sent and response is received.)|
|`"http-request-error"`| `httpRequest()` (Called when an http request returns an error)|
|`"http-request-success"`| `httpRequest()` (Called when an http requests returns a response successfully)|
|`"end-user-session"`| `endUserSession()`| A boolean value indicating if the process was successful or not
|`"custom-grant"`| `customGrant()`|

## Using the `form_post` response mode
When the `responseMode` is set to `form_post`, the authorization code is sent in the body of a `POST` request as opposed to in the URL. So, the Single Page Application should have a backend to receive the authorization code and send it back to the Single Page Application.

The backend can then inject the authorization code into a JavaSCript variable while rendering the webpage in the server side. But this results in the authorization code getting printed in the HTML of the page creating a **threat vector**.

To address this issue, we recommend storing the authorization code in a server session variable and providing the Single Page Application a separate API endpoint to request the authorization code. The server, when the request is received, can then respond with the authorization code from the server session.

![form_post auth code flow](https://raw.githubusercontent.com/asgardio/asgardio-js-oidc-sdk/master/img/auth_code.png)

You can refer to a sample implementation using JSP [here](/samples/java-webapp).

## Develop
### Prerequisites
- `Node.js` (version 10 or above).
- `npm` package manager.
### Installing Dependencies
The repository is a mono repository. The SDK repository is found in the [oidc-js-sdk]() directory. You can install the dependencies by running the following command at the root.
```
npm run build
```

## Contribute

Please read [Contributing to the Code Base](http://wso2.github.io/) for details on our code of conduct, and the process for submitting pull requests to us.

### Reporting issues
We encourage you to report issues, improvements, and feature requests creating [Github Issues](https://github.com/asgardio/asgardio-js-oidc-sdk/issues).

Important: And please be advised that security issues must be reported to security@wso2com, not as GitHub issues, in order to reach the proper audience. We strongly advise following the WSO2 Security Vulnerability Reporting Guidelines when reporting the security issues.

## License
This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.
