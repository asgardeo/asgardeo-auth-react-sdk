# Asgardeo Auth React SDK

![Builder](https://github.com/asgardeo/asgardeo-auth-react-sdk/workflows/Builder/badge.svg)
[![Stackoverflow](https://img.shields.io/badge/Ask%20for%20help%20on-Stackoverflow-orange)](https://stackoverflow.com/questions/tagged/wso2is)
[![Join the chat at https://join.slack.com/t/wso2is/shared_invite/enQtNzk0MTI1OTg5NjM1LTllODZiMTYzMmY0YzljYjdhZGExZWVkZDUxOWVjZDJkZGIzNTE1NDllYWFhM2MyOGFjMDlkYzJjODJhOWQ4YjE](https://img.shields.io/badge/Join%20us%20on-Slack-%23e01563.svg)](https://join.slack.com/t/wso2is/shared_invite/enQtNzk0MTI1OTg5NjM1LTllODZiMTYzMmY0YzljYjdhZGExZWVkZDUxOWVjZDJkZGIzNTE1NDllYWFhM2MyOGFjMDlkYzJjODJhOWQ4YjE)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/wso2/product-is/blob/master/LICENSE)
[![Twitter](https://img.shields.io/twitter/follow/wso2.svg?style=social&label=Follow)](https://twitter.com/intent/follow?screen_name=wso2)

---

## Table of Content

-   [Introduction](#introduction)
-   [Prerequisite](#prerequisite)
-   [Getting Started](#getting-started)
-   [Try Out the Sample Apps](#try-out-the-sample-apps)
-   [APIs](#apis)
    -   [AuthProvider](#authprovider)
    -   [SecureRoute](#secureroute)
    -   [SecureApp](#secureapp)
    -   [useAuthContext](#useauthcontext)
    -   [getBasicUserInfo](#getbasicuserinfo)
    -   [signIn](#signin)
    -   [trySignInSilently](#trysigninsilently)
    -   [signOut](#signout)
    -   [httpRequest](#httprequest)
    -   [httpRequestAll](#httprequestall)
    -   [requestCustomGrant](#requestcustomgrant)
    -   [revokeAccessToken](#revokeaccesstoken)
    -   [getOIDCServiceEndpoints](#getoidcserviceendpoints)
    -   [getDecodedIDToken](#getdecodedidtoken)
    -   [getIDToken](#getidtoken)
    -   [getAccessToken](#getaccesstoken)
    -   [refreshAccessToken](#refreshaccesstoken)
    -   [on](#on)
    -   [isAuthenticated](#isauthenticated)
    -   [enableHttpHandler](#enablehttphandler)
    -   [disableHttpHandler](#disablehttphandler)
    -   [updateConfig](#updateconfig)
    -   [getHttpClient](#gethttpclient)
-   [Using the `form_post` Response Mode](#using-the-form_post-response-mode)
-   [Storage](#storage)
-   [Models](#models)
    -   [AuthStateInterface](#authstateinterface)
    -   [AuthReactConfig>](#authreactconfig)
    -   [BasicUserInfo](#basicuserinfo)
    -   [SignInConfig](#signinconfig)
    -   [OIDCEndpoints](#oidcendpoints)
    -   [CustomGrantConfig](#customgrantconfig)
    -   [Custom Grant Template Tags](#custom-grant-template-tags)
    -   [DecodedIDTokenPayload](#decodedidtokenpayload)
    -   [HttpRequestConfig](#httprequestconfig)
-   [Develop](#develop)
    -   [Prerequisites](#prerequisites)
    -   [Installing Dependencies](#installing-dependencies)
-   [Contribute](#contribute)
-   [License](#license)

## Introduction

Asgardeo Auth React SDK for JavaScript allows React applications to use OIDC or OAuth2 authentication in a simple and secure way. By using Asgardeo and the Asgardeo Auth React SDK, developers will be able to add identity management to their React applications fast and secure.

To enable authentication for this sample, we are using Asgardeo as the Identity Provider.

## Prerequisite

Create an organization in Asgardeo if you don't already have one. The organization name you choose will be referred to as `<org_name>` throughout this document.

## Try Out the Sample Apps

### 1. Create an Application in Asgardeo

Before trying out the sample apps, you need to create an application in **Asgardeo**.

1. Navigate to [**Asgardeo Console**](https://console.asgardeo.io/login) and click on **Applications** under **Develop** tab

2. Click on **New Application** and then **Single Page Application**.

3. Enter **Sample** as the name of the app and add the redirect URL(s). You can find the relevant redirect URL(s) of each sample app in the [Running the sample apps](#2-running-the-sample-apps) section.

4. Click on Register. You will be navigated to management page of the **sample** application.
   
5. Add `https://localhost:3000` (or whichever the URL your app is hosted on) to **Allowed Origins** under **Access** tab and check **Public client** option.
   
6. Click on **Update** at the bottom.

7. Copy the configuration from the Asgardeo React Quickstart guide to your React application as shown in the above code snippet.

### 2. Running the sample apps

1. Download the sample from the given link in the Asgardeo Console.

2. Update configuration file `src/config.json` with your registered app details.

**Note:** You will only have to paste in the `clientID`(**OAuth Client Key**) generated for the application you registered.

Read more about the SDK configurations [here](#configuration) .

```json
{
    "clientID": "",
    "baseUrl": "https://api.asgardeo.io/t/<org_name>",
    "signInRedirectURL": "https://localhost:3000",
    "signOutRedirectURL": "https://localhost:3000"
}
```

3. Build and deploy the apps by running the following command at the root directory.

```bash
npm install && npm start
```

4. Navigate to [`https://localhost:3000`](https://localhost:3000) (or whichever the URL you have hosted the sample app).

#### Basic React Sample

- Download the Sample: [samples/asgardeo-react-app](https://github.com/asgardeo/asgardeo-auth-react-sdk/releases/latest/download/asgardeo-react-app.zip)

- Find More Info: [README](/samples/asgardeo-react-app/README.md)

- **Redirect URL(s):**
  - `https://localhost:3000`

## Getting Started

### 1. Installing the Package

Install `@asgardeo/auth-react` & `react-router-dom` from the npm registry.

```
npm install @asgardeo/auth-react react-router-dom --save
```

### 2. Import `AuthProvider`, `useAuthContext` and Provide Configuration Parameters

```TypeScript
// The SDK provides a provider that can be used to carry out the authentication.
// The `AuthProvider` is a React context.
// `useAuthContext` is a React hook that provides you with authentication methods such as `signIn`.
import { AuthProvider, useAuthContext } from "@asgardeo/auth-react";

// The config data.
const config = {
     signInRedirectURL: "https://localhost:3000/sign-in",
     signOutRedirectURL: "https://localhost:3000/dashboard",
     clientID: "client ID",
     baseUrl: "https://api.asgardeo.io/t/<org_name>"
};

// Encapsulate your components with the `AuthProvider`.
export const MyApp = (): ReactElement => {
    return (
        <AuthProvider config={ config }>
            <Dashboard />
        </AuthProvider>
    )
}

const Dashboard = (): ReactElement => {
    const { signIn } = useAuthContext();
    const [ signedIn, setSignedIn ] = useState(false);

    const handleClick = (): void => {
        signIn(() => {
            setSignedIn(true);
        });
    }

    return (
        <div>
            { signedIn && <div>You have signed in!</div> }
            <button onClick={handleClick}> Sign In </button>
        </div>
    );
}
```

[Learn more](#apis).

<!-- ## Browser Compatibility

The SDK supports all major browsers and provides polyfills to support incompatible browsers. If you want the SDK to run on Internet Explorer or any other old browser, you can use the polyfilled script instead of the default one.

To embed a polyfilled script in an HTML page:

```html
<script src="https://unpkg.com/@asgardeo/auth-spa@0.1.26/dist/polyfilled/asgardeo-spa.production.min.js.js"></script>
```

You can also import a polyfilled module into your modular app. Asgardeo provides two different modules each supporting UMD and ESM.
You can specify the preferred module type by appending the type to the module name as follows.

To import a polyfilled ESM module:

```TypeScript
import { AsgardeoSPAClient } from "@asgardeo/auth-spa/polyfilled/esm";
```

To import a polyfilled UMD module:

```TypeScript
import { AsgardeoSPAClient } from "@asgardeo/auth-spa/polyfilled/umd";
```

**Note that using a polyfilled modules comes at the cost of the bundle size being twice as big as the default, non-polyfilled bundle.**

**_A Web Worker cannot be used as a storage option in Internet Explorer as the browser doesn't fully support some of the modern features of web workers._**
 -->

## APIs

### AuthProvider

This is a React Context Provider that provides the session state that contains information such as the authenticated user's display name, email address, etc., and the methods that are required to implement authentication in the React app.
Like every other provider, the `AuthProvider` also encapsulates the components that would need the data provided by the provider.

The provider takes a prop called `config` that accepts a config object of type [`AuthClientConfig<Config>`](#AuthClientConfig<Config>). This config object contains attributes that provide the configurations necessary for authentication. To learn more about what attributes the object takes, refer to the [`AuthClientConfig<Config>`](#AuthClientConfig<Config>) section.

In addition, the `fallback` prop is used to specify a fallback component that will be rendered when the user is not authenticated.

As an optional parameter, `plugin` parameter can be used to pass an external plugin.

The `AuthProvider` also automatically requests for the access token should the URL contain the `code` query parameter.

If the response mode is set to `form_post`, then you will have your own ways of retrieving the authorization code and session state from your backend. In that case, you can use the `getAuthParams()` prop method to pass an async callback function that would return the `authorizationCode` and `sessionState` in a Promise. This way, the `AuthProvider` will use the authorization code returned by this method to automatically request for an access token.

#### Example

```TypeScript
export const MyApp = (): ReactElement => {
    return (
        <AuthProvider config={ config } fallback={ <div>Initializing...</div> }>
            <Dashboard />
        </AuthProvider>
    )
}
```

#### Example with an external Auth SPA plugin

```TypeScript
import { TokenExchangePlugin } from "@asgardeo/token-exchange-plugin";

export const MyApp = (): ReactElement => {
    return (
        <AuthProvider config={ config } plugin={ TokenExchangePlugin.getInstance() }>
            <Dashboard />
        </AuthProvider>
    )
}
```
---
### SecureRoute
The SDK also provides a component called `SecureRoute` that wraps the `Route` component provided by `react-router`dom`. This allows you to secure your routes using the SDK. Only authenticated users will be taken to the route. The component let's you pass a callback function that would be fired if the user is not authenticated.

This component takes three props. The `path` and `component` props just relay the prop values directly to the `Route` component. The `callback` prop takes a callback function that is fired when an unauthenticated user access teh route. Developers can use this callback function to either to redirect the user to the login page of the app to call the [`signIn`](#signIn) method.
#### Example
```TypeScript
<SecureRoute path={ "/secure-page" } component={ <SecureComponent /> } callback={ callback } />
```

---

### SecureApp
This is a component that can be used to secure a React app. This component wraps a React component and renders it only
if the user is signed in. Otherwise, it renders the `fallback` prop. If the user is not signed in, this component automatically
initiates the sign-in flow.

The component takes three props, namely `fallback`, `onSignIn`, and `overrideSignIn`. The `fallback` prop
is used to render a fallback component during sign in. The `onSignIn` prop is used to pass a callback function that will be called after signing in. The `overrideSignIn` prop is used to specify a function that will be called to initiate the sign-in flow. By default, the `signIn` method is used to initiate the sign-in flow.

#### Example
```TypeScript
<SecureApp fallback={ <Loader /> } onSignIn{ ()=> { history.push("/home") } } >
    <App />
</SecureApp>
```
---
### AuthenticatedComponent

This component is used to wrap the components that need authentication. If the user is authenticated, the component renders the wrapped component. If the user is not authenticated, the component renders the `fallback` prop. Besides, the component also takes a prop called `signingOutFallback` that is shown while the user is signing out.
#### Example
```TypeScript
<AuthenticatedComponent fallback={ <div>Sign in to view this section.</div> } signingOutFallback={ <div>Signing out...</div> }>
    <SecureComponent />
</AuthenticatedComponent>
```
### useAuthContext

This is a React hook that returns the session state that contains information such as the email address of the authenticated user and the methods that are required for implementing authentication.

#### Example

```TypeScript
const { signIn } = useAuthContext();
```

The object returned by the `useAuthContext` has a `state` attribute the value of which is an object of type [`AuthStateInterface`](#AuthStateInterface). You can refer the link to know more about what data is contained by the `state` object.

In addition to the `state` object, the hook also returns the following methods.


### getBasicUserInfo

```typescript
getBasicUserInfo(): Promise<BasicUserInfo>;
```

#### Returns

A Promise that resolves with [`BasicUserInfo`](#BasicUserInfo).

#### Description

This method returns a promise that resolves with the information about the authenticated user obtained from the id token as an object. To learn more what information this object contains, refer to the [`BasicUserInfo`](#BasicUserInfo) section.

#### Example

```TypeScript
getBasicUserInfo().then((response) => {
    // console.log(response);
}).catch((error) => {
    // console.error(error);
});
```

---

### signIn

```typescript
signIn(config?: SignInConfig, authorizationCode?: string, sessionState?: string, authState?: string, callback?: (response: BasicUserInfo) => void);
```

#### Arguments

1. config?: [`SignInConfig`](#SignInConfig) (optional)
   An object that contains attributes that allows you to configure sign in. The `forceInit` attribute of this object, allows you to force a request to the `.well-known` endpoint even if a request has previously been sent. You can also pass key-value pairs that you want to be appended as path parameters to the authorization URL to this object. To learn more, refer to [`SignInConfig`](#SignInConfig). This object is needed only during the authorization-url-generation phase.

2. authorizationCode?: `string` (optional)
   The `signIn` method can be passed the authorization code as an argument, which will be used to obtain the token during the token-request phase of the method. This allows developers to use different response modes such as `form_post`. To learn more about the `form_post` method refer to the [Using the `form_post` response mode](#Using-the-form_post-response-mode) section. If you're using the `query` method, then the `signIn` method automatically obtains the authorization code from the URL.
3. sessionState?: `string` (optional)
   The `signIn` method can be passed the session state as an argument, which will be used to obtain the token during the token-request phase of the method. This allows developers to use different response modes such as `form_post`. To learn more about the `form_post` method refer to the [Using the `form_post` response mode](#Using-the-form_post-response-mode) section. If you're using the `query` method, then the `signIn` method automatically obtains the session state from the URL.
4. authState?: `string` (optional)
   The `signIn` method can be passed the state parameter as an argument, which will be used to obtain the token during the token-request phase of the method.
5. callback?: (response: [`BasicUserInfo`](#BasicUserInfo)) => `void`
   A callback function that fires when sign-in is successful. The callback function takes an object of type [`BasicUserInfo`](#BasicUserInfo) as an argument.
#### Description

As the name implies, this method is used to sign-in users. This method will have to be called twice to implement the two phases of the authentication process. The first phase generates generates the authorization URl and takes the user to the single-sign-on page of the identity server, while second phase triggers the token request to complete the authentication process. So, this method should be called when initiating authentication and when the user is redirected back to the app after authentication themselves with the server.

The `sign-in` hook is used to fire a callback function after signing in is successful. Check the [on()](#on) section for more information.

#### Example

```TypeScript
signIn();
```
---
### trySignInSilently

```typescript
trySignInSilently();
```

#### Description

This method attempts to sign a user in silently by sending an authorization request with the `prompt` query parameter set to `none`.
This will be useful when you want to sign a user in automatically while avoiding the browser redirects.

This uses an iFrame to check if there is an active user session in the identity server by sending an authorization request. If the request returns an authorization code, then the token request is dispatched and the returned token is stored effectively signing the user in.

To dispatch a token request, the `[signIn()](#signIn)` or this `trySignInSilently()` method should be called by the page/component rendered by the redirect URL.

This returns a promise that resolves with a `[BasicUserInfo](#BasicUserInfo)` object following a successful sign in. If the user is not signed into the Asgardeo, then the promise resolves with the boolean value of `false`.

The `sign-in` hook is used to fire a callback function after signing in is successful. Check the [on()](#on) section for more information.

> :warning: ***Since this method uses an iFrame, this method will not work if third-party cookies are blocked in the browser.***

#### Example

```typescript
trySignInSilently().then((response)=>{
    if(response) {
        // The user is signed in.
        // handle basic user info
    }

    // The user is not signed in.
});
```

---

### signOut

```typescript
signOut();
```

#### Description

This method ends the user session at the identity server and logs the user out.

The `sign-out` hook is used to fire a callback function after signing out is successful. Check the [on()](#on) section for more information.

#### Example

```TypeScript
signOut();
```

---

### httpRequest

```typescript
httpRequest(config: `HttpRequestConfig`): Promise<HttpResponse>;
```

#### Arguments

1. config: `[HttpRequestConfig](#httpRequestConfig)`
   A config object with the settings necessary to send http requests. This object is similar to the `AxiosRequestConfig` but provides these additional attributes:

   |Attribute|Type|Default|Description|
   |--|--|--|--|
   |`attachToken`|`boolean`|`true`|If set to `true`, the token will be attached to the request header.|
   |`shouldEncodeToFormData`|`boolean`|`false`|If set to `true`, the request body will be encoded to `FormData`. The body (specified by the `data` attribute) should be a Javascript object. |
   |`shouldAttachIDPAccessToken`|`boolean`|`false`| If set to `true`, the IDP access token will be attached to the the request `Authorization` header. |

#### Returns

A Promise that resolves with the response.

#### Description

This method is used to send http requests to the identity server. The developer doesn't need to manually attach the access token since this method does it automatically.

If the `storage` type is set to `sessionStorage` or `localStorage`, the developer may choose to implement their own ways of sending http requests by obtaining the access token from the relevant storage medium and attaching it to the header. However, if the `storage` is set to `webWorker`, this is the _ONLY_ way http requests can be sent.

This method accepts a config object which is of type `AxiosRequestConfig`. If you have used `axios` before, you can use the `httpRequest` in the exact same way.

For example, to get the user profile details after signing in, you can query the `me` endpoint as follows:

#### Example

```TypeScript
const auth = AsgardeoSPAClient.getInstance();

const requestConfig = {
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/scim+json"
    },
    method: "GET",
    url: "https://api.asgardeo.io/scim2/me"
};

return httpRequest(requestConfig)
    .then((response) => {
        // console.log(response);
    })
    .catch((error) => {
        // console.error(error);
    });
```

---

### httpRequestAll

```typescript
httpRequestAll(config[]: ): Promise<[]>;
```

#### Arguments

1. config[]: `HttpRequestConfig[]`
   An array config objects with the settings necessary to send http requests. This object is similar to the `AxiosRequestConfig`.

#### Returns

A Promise that resolves with the responses.

#### Description

This method is used to send multiple http requests at the same time. This works similar to `axios.all()`. An array of config objects need to be passed as the argument and an array of responses will be returned in a `Promise` in the order in which the configs were passed.

#### Example

```TypeScript
httpRequestAll(configs).then((responses) => {
    response.forEach((response) => {
        // console.log(response);
    });
}).catch((error) => {
    // console.error(error);
});
```

---

### requestCustomGrant

```typescript
requestCustomGrant(config: CustomGranConfig, callback?: (response: BasicUserInfo | HttpResponse<any>) => void): Promise<HttpResponse | BasicUserInfo>;
```

#### Arguments

1. config: [`CustomGrantConfig`](#CustomGrantConfig)
   A config object to configure the custom-grant request. To learn more about the different attributes that can be used with config object, see the [`CustomGrantConfig`](#CustomGrantConfig) section.
2. callback?: (response: [`BasicUserInfo`](#BasicUserInfo) | `HttpResponse`<any>) => void
   A callback function that takes an object of type [`BasicUserInfo`](#BasicUserInfo) or `HttpResponse` (depending on the `config`) as an argument and is fired when the request is successful.

#### Returns

A Promise that resolves either with the response or the [`BasicUserInfo`](#BasicUserInfo).

#### Description

This method allows developers to use custom grants provided by their Identity Providers. This method accepts an object that has the following attributes as the argument.

The `custom-grant` hook is used to fire a callback function after a custom grant request is successful. Check the [on()](#on) section for more information.

```TypeScript
    const config = {
      attachToken: false,
      data: {
          client_id: "{{clientID}}",
          grant_type: "account_switch",
          scope: "{{scope}}",
          token: "{{token}}",
      },
      id: "account-switch",
      returnResponse: true,
      returnsSession: true,
      signInRequired: true
    }

    requestCustomGrant(config).then((response)=>{
        console.log(response);
    }).catch((error)=>{
        console.error(error);
    });
```

---

### revokeAccessToken

```typescript
revokeAccessToken();
```

#### Description

This method revokes the access token and clears the session information from the storage.

The `end-user-session` hook is used to fire a callback function after end user session is successful. Check the [on()](#on) section for more information.

#### Example

```TypeScript
revokeAccessToken();
```

---

### getOIDCServiceEndpoints

```TypeScript
getOIDCServiceEndpoints(): Promise<OIDCEndpoints>
```

#### Returns

A Promise that resolves with an object containing the endpoints. To learn more about what endpoints are returned, refer to the [`OIDCEndpoints`](#OIDCEndpoints) section.

#### Description

This method returns a promise that resolves with an object containing the OIDC endpoints obtained from the `.well-known` endpoint. The object contains the following attributes.

| Attribute             | Description                                                                        |
| --------------------- | ---------------------------------------------------------------------------------- |
| `"authorize"`         | The endpoint to which the authorization request should be sent.                    |
| `"jwks"`              | The endpoint from which JSON Web Key Set can be obtained.                          |
| `"oidcSessionIFrame"` | The URL of the page that should be loaded in an IFrame to get session information. |
| `"revoke"`            | The endpoint to which the revoke-token request should be sent.                     |
| `"token"`             | The endpoint to which the token request should be sent.                            |
| `"wellKnown"`         | The well-known endpoint from which OpenID endpoints of the server can be obtained. |

#### Example

```TypeScript
getOIDCServiceEndpoints().then((endpoints) => {
    // console.log(endpoints);
}).error((error) => {
    // console.error(error);
});
```

---

### getDecodedIDToken

```typescript
getDecodedIDToken(): Promise<DecodedIDTokenPayload>
```

#### Returns

A promise that returns with the [`DecodedIDTokenPayload`](#DecodedIDTokenPayload) object.

#### Description

This method returns a promise that resolves with the decoded payload of the JWT ID token.

#### Example

```TypeScript
getDecodedIDToken().then((idToken) => {
    // console.log(idToken);
}).error((error) => {
    // console.error(error);
});
```
---

### getDecodedIDPIDToken

```typescript
getDecodedIDPIDToken(): Promise<DecodedIDTokenPayload>
```

#### Returns

A promise that returns with the IDP [`DecodedIDTokenPayload`](#DecodedIDTokenPayload) object.

#### Description

This method returns a promise that resolves with the decoded payload of the JWT ID token provided by the IDP.

#### Example

```TypeScript
getDecodedIDPIDToken().then((idToken) => {
    // console.log(idToken);
}).error((error) => {
    // console.error(error);
});
```
---

### getIDToken

```TypeScript
getIDToken(): Promise<string>
```

#### Returns

idToken: `Promise<string>`
The id token.

#### Description

This method returns the id token.

#### Example

```TypeScript
const idToken = await getIDToken();
```
---

### getAccessToken

```typescript
getAccessToken(): Promise<string>;
```

#### Returns

A Promise that resolves with the access token.

#### Description

This returns a promise that resolves with the access token. The promise resolves successfully only if the storage type is set to a type other than `webWorker`. Otherwise an error is thrown.

#### Example

```TypeScript
getAccessToken().then((token) => {
    // console.log(token);
}).error((error) => {
    // console.error(error);
});
```

### refreshAccessToken

```typescript
refreshAccessToken(): Promise<BasicUserInfo>;
```

#### Returns

A Promise that resolves with the [`BasicUserInfo`](#BasicUserInfo) object.

#### Description

This refreshes the access token and stores the refreshed session information in either the session or local storage as per your configuration. Note that this method cannot be used when the storage type is set to `webWorker` since the web worker automatically refreshes the token and there is no need for the developer to do it.

This method also returns a Promise that resolves with an object containing the attributes mentioned in the table below.
|Attribute|Description|
|--|--|
`"accessToken"`| The new access token |
`"expiresIn"`| The expiry time in seconds|
`"idToken"`| The ID token|
`"refreshToken"`| The refresh token|
`"scope"`| The scope of the access token|
`"tokenType"`| The type of the token. E.g.: Bearer|

#### Example

```TypeScript
refreshToken().then((response)=>{
      // console.log(response);
 }).catch((error)=>{
      // console.error(error);
});
```

### on

```typescript
on(hook: string, callback: () => void, id?: string): void
```

#### Arguments

1. hook: `string`
   The name of the hook.
2. callback: `() => void`
   The callback function that should be fired.
3. id?: `string`
   An id for the method. This is required only when the hook type is `custom-grant`.

#### Description

The `on` method is used to hook callback functions to authentication methods. The method accepts a hook name and a callback function as the only arguments except when the hook name is "custom-grant", in which case the id of the custom grant should be passed as the third argument. The following hooks are available.

If you are using TypeScript, you may want to use the `Hooks` enum that consists of the following string literals instead of directly inputting the string value.

| Hook                     | Method to which the callback function is attached                                | Returned Response                                                                       |
| :----------------------- | :------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------- |
| `"sign-in"`              | `signIn()`                                                                       | The user information. See [getUserInfo()](#getuserinfo)'s return type for more details. |
| `"sign-out"`             | `signOut()`                                                                      |                                                                                         |
| `"initialize"`           | `initialize()`                                                                   | A boolean value indicating if the initialization was successful or not.                 |
| `"http-request-start"`   | `httpRequest()` (Called before an http request is sent)                          |
| `"http-request-finish"`  | `httpRequest()` (Called after an http request is sent and response is received.) |
| `"http-request-error"`   | `httpRequest()` (Called when an http request returns an error)                   |
| `"http-request-success"` | `httpRequest()` (Called when an http requests returns a response successfully)   |
| `"end-user-session"`     | `endUserSession()`                                                               | A boolean value indicating if the process was successful or not                         |
| `"custom-grant"`         | `customGrant()`                                                                  | Returns the response from the custom grant request.                                     |

**When the user signs out, the user is taken to the identity server's logout page and then redirected back to the SPA on successful logout. Hence, developers should ensure that the `"sign-out"` hook is called when the page the user is redirected to loads.**

#### Example

```TypeScript
on("sign-in", () => {
    //called after signing in.
});
```

---

### isAuthenticated

```TypeScript
isAuthenticated(): boolean
```

#### Returns

isAuth: `boolean`
A boolean value that indicates of the user is authenticated or not.

#### Description

This method returns a boolean value indicating if the user is authenticated or not.

#### Example

```TypeScript
const isAuth = isAuthenticated();
```

---

### enableHttpHandler

```typescript
enableHttpHandler(): Promise<Boolean>
```

#### Returns

A Promise that resolves with a `boolean` value indicating if the call was successful.

#### Description

This enables the callback functions attached to the http client. The callback functions are enabled by default. This needs to be called only if the [disableHttpHandler](#disableHttpHandler) method was called previously.

#### Example

```TypeScript
enableHttpHandler();
```

---

### disableHttpHandler

```typescript
disableHttpHandler(): Promise<boolean>
```

#### Returns

A Promise that resolves with a `boolean` value indicating if the call was successful.

#### Description

This disables the callback functions attached to the http client.

#### Example

```TypeScript
disableHttpHandler();
```

### updateConfig

```TypeScript
updateConfig(config: Partial<AuthClientConfig<T>>): void
```

#### Arguments

1. config: [`AuthClientConfig<T>`](#AuthClientConfig<T>)

The config object containing the attributes that can be used to configure the SDK. To learn more about the available attributes, refer to the [`AuthClientConfig>T>`](#AuthClientConfig<T>) model.

#### Description

This method can be used to update the configurations passed into the constructor of the `AsgardeoAuthClient`. Please note that every attribute in the config object passed as the argument here is optional. Use this method if you want to update certain attributes after instantiating the class.

#### Example

```TypeScript
updateConfig({
    signOutRedirectURL: "https://localhost:3000/sign-out"
});
```

---

### getHttpClient

```TypeScript
getHttpClient(): `HttpClientInstance`
```

#### Returns

An `HttpClientInstance`

#### Description

This method returns the `HttpClientInstance`. This is the client that is used to send http requests internally.

#### Example

```TypeScript
const httpClient = getHttpClient();
```

## Using the `form_post` response mode

When the `responseMode` is set to `form_post`, the authorization code is sent in the body of a `POST` request as opposed to in the URL. So, the Single Page Application should have a backend to receive the authorization code and send it back to the Single Page Application.

The backend can then inject the authorization code into a JavaSCript variable while rendering the webpage in the server side. But this results in the authorization code getting printed in the HTML of the page creating a **threat vector**.

To address this issue, we recommend storing the authorization code in a server session variable and providing the Single Page Application a separate API endpoint to request the authorization code. The server, when the request is received, can then respond with the authorization code from the server session.

![form_post auth code flow](./assets/img/auth_code.png)

You can refer to a sample implementation using JSP [here](/samples/java-webapp).

## Storage

Asgardeo allows the session information including the access token to be stored in three different places, namely,

1. Session storage
2. Local storage
3. Web worker
4. Browser memory

Of the four methods, storing the session information in the **web worker** is the **safest** method. This is because the web worker cannot be accessed by third-party libraries and data there cannot be stolen through XSS attacks. However, when using a web worker to store the session information, the [`httpRequest`](#httprequest) method has to be used to send http requests. This method will route the request through the web worker and the web worker will attach the access token to the request before sending it to the server.

```TypeScript
initialize(config);
```

## Models

### AuthStateInterface

| Attribute         | Type      | Description                                                               |
| :---------------- | :-------- | :------------------------------------------------------------------------ |
| `allowedScopes`   | `string`  | The scopes that are allowed for the user.                                 |
| `displayName`     | `string`  | The display name of the user.                                             |
| `email`           | `string`  | The email address of the user.                                            |
| `isAuthenticated` | `boolean` | Specifies if the user is authenticated or not.                             |
| `isLoading`       | `boolean` | Specifies if the authentication requests are loading.                      |
| `username`        | `string`  | The username of the user.                                                 |
| `sub`             | `string`  | The `uid` corresponding to the user to whom the ID token belongs to.      |

### AuthReactConfig

| Attribute | Required/Optional | Type | Default Value | Description |
| --------- | ----------------- | ---- | ------------- | ----------- |
| `signInRedirectURL`          | Required          | `string`        | ""                                                                      | The URL to redirect to after the user authorizes the client app. eg: `https//localhost:3000/sign-in` |
| `signOutRedirectURL`         | Optional          | `string`        | The `signInRedirectURL` URL will be used if this value is not provided. | The URL to redirect to after the user                                                                | signs out. eg: `https://localhost:3000/dashboard`                                                                                                           |
| `clientHost`                 | Optional          | `string`        | The origin of the client app obtained using `window.origin`             | The hostname of the client app. eg: `https://localhost:3000`                                         |
| `clientID`                   | Required          | `string`        | ""                                                                      | The client ID of the OIDC application hosted in the Asgardeo.                                        |
| `clientSecret`               | Optional          | `string`        | ""                                                                      | The client secret of the OIDC application                                                            |
| `enablePKCE`                 | Optional          | `boolean`       | `true`                                                                  | Specifies if a PKCE should be sent with the request for the authorization code.                      |
| `prompt`                     | Optional          | `string`        | ""                                                                      | Specifies the prompt type of an OIDC request                                                         |
| `responseMode`               | Optional          | `ResponseMode`  | `"query"`                                                               | Specifies the response mode. The value can either be `query` or `form_post`                          |
| `scope`                      | Optional          | `string[]`      | `["openid"]`                                                            | Specifies the requested scopes.                                                                      |
| `baseUrl`               | Required  (If `wellKnownEndpoint` or `endpoints` is not provided)          | `string`        | ""                                                                      | The origin of the Identity Provider. eg: `https://www.asgardeo.io/t/<org_name>`                                   |
| `endpoints`                  | Optional (Required to provide all endpoints, if `wellKnownEndpoint` or `baseUrl` is not provided)          | `OIDCEndpoints` | [OIDC Endpoints Default Values](#oidc-endpoints)                        | The OIDC endpoint URLs. The SDK will try to obtain the endpoint URLS                                 | using the `.well-known` endpoint. If this fails, the SDK will use these endpoint URLs. If this attribute is not set, then the default endpoint URLs will be | used. However, if the `overrideWellEndpointConfig` is set to `true`, then this will override the endpoints obtained from the `.well-known` endpoint. |
`wellKnownEndpoint`          | Optional          | `string`        | `"/oauth2/token/.well-known/openid-configuration"`                      | The URL of the `.well-known` endpoint.                                                               |
| `overrideWellEndpointConfig` | Optional          | `boolean`       | `false`                                                                 | If this option is set to `true`, then the `endpoints` object will override endpoints obtained        | from the `.well-known` endpoint. If this is set to `false`, then this will be used as a fallback if the request to the `.well-known` endpoint fails.        |
| `validateIDToken`            | Optional          | `boolean`       | `true`                                                                  | Allows you to enable/disable JWT ID token validation after obtaining the ID token.                   |
| `clockTolerance`             | Optional          | `number`        | `60`                                                                    | Allows you to configure the leeway when validating the id_token.                                     |
| `skipRedirectCallback`       | Optional          | `boolean`        | `false`                                                                    | Stop listening to Auth param changes i.e `code` & `session_state` to trigger auto login.        |
| [`storage`](#storage) | Optional | `"sessionStorage"`, `"webWorker"`, `"localStorage"` | `"sessionStorage"` | The storage medium where the session information such as the access token should be stored.| |
| `resourceServerURLs` |Required if the `storage` is set to `webWorker` | `string[]` | `[]` | The URLs of the API endpoints. This is needed only if the storage method is set to `webWorker`. When API calls are made through the [`httpRequest`](#httprequest) or the [`httpRequestAll`](#httprequestall) method, only the calls to the endpoints specified in the `baseURL` attribute will be allowed. Everything else will be denied. | |
|`requestTimeout` | Optional | `number`| 60000 (seconds) | Specifies in seconds how long a request to the web worker should wait before being timed out. |
| `disableTrySignInSilently` | Optional | `boolean` | `true` | Specifies if the SDK should try to sign in silently on mount.|
|`enableOIDCSessionManagement` |Optional|`boolean`| false | Flag to enable OIDC Session Management |

### BasicUserInfo

| Attribute       | Type     | Description                                                                                        |
| :-------------- | :------- | :------------------------------------------------------------------------------------------------- |
| `email`         | `string` | The email address of the user.                                                                     |
| `username`      | `string` | The username of the user.                                                                          |
| `displayName`   | `string` | The display name of the user. It is the `preferred_username` in the id token payload or the `sub`. |
| `allowedScopes` | `string` | The scopes allowed for the user.                                                                   |
| `tenantDomain`  | `string` | The tenant domain to which the user belongs.                                                       |
| `sessionState`  | `string` | The session state.                                                                                 |

### SignInConfig

| Method        | Required/Optional | Type                  | Default Value | Description                                                                                                                                                            |
| ------------- | ----------------- | --------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fidp`        | Optional          | `string`              | ""            | The `fidp` parameter that can be used to redirect a user directly to an IdP's sign-in page.                                                                            |
| `forceInit`   | Optional          | `boolean`             | `false`       | Forces obtaining the OIDC endpoints from the `.well-known` endpoint. A request to this endpoint is not sent if a request has already been sent. This forces a request. |
| `callOnlyOnRedirect` | Optional | `boolean` | `false` | Specifies if the SDK should only call the `signIn` method when the user is redirected back to the client app. |
| key: `string` | Optional          | `string` \| `boolean` | ""            | Any key-value pair to be appended as path parameters to the authorization URL.                                                                                         |

### OIDCEndpoints

| Method                  | Type     | Default Value                                      | Description                                                               |
| ----------------------- | -------- | -------------------------------------------------- | ------------------------------------------------------------------------- |
| `authorizationEndpoint` | `string` | `"/oauth2/authorize"`                              | The authorization endpoint.                                               |
| `tokenEndpoint`         | `string` | `"/oauth2/token"`                                  | The token endpoint.                                                       |
| `userinfoEndpoint`      | `string` | ""                                                 | The user-info endpoint.                                                   |
| `jwksUri`               | `string` | `"/oauth2/jwks"`                                   | The JWKS URI.                                                             |
| `registrationEndpoint`  | `string` | ""                                                 | The registration endpoint.                                                |
| `revocationEndpoint`    | `string` | `"/oauth2/revoke"`                                 | The token-revocation endpoint.                                            |
| `introspectionEndpoint` | `string` | ""                                                 | The introspection endpoint.                                               |
| `checkSessionIframe`    | `string` | `"/oidc/checksession"`                             | The check-session endpoint.                                               |
| `endSessionEndpoint`    | `string` | `"/oidc/logout"`                                   | The end-session endpoint.                                                 |
| `issuer`                | `string` | ""                                                 | The issuer of the token.                                                  |
| `wellKnownEndpoint` | `string` | `"/oauth2/token/.well-known/openid-configuration"` | The well-known endpoint. This is the default endpoint defined in the SDK. |

### CustomGrantConfig

| Attribute        | Required/Optional | Type      | Default Value | Description                                                                                                                                                                                                                   |
| ---------------- | ----------------- | --------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`             | Required          | `string`  | ""            | Every custom-grant request should have an id. This attributes takes that id.                                                                                                                                                  |
| `data`           | Required          | `any`     | `null`        | The data that should be sent in the body of the custom-grant request. You can use template tags to send session information. Refer to the [Custom Grant Template Tags](#custom-grant-template-tags) section for more details. |
| `signInRequired` | Required          | `boolean` | `false`       | Specifies if the user should be sign-in or not to dispatch this custom-grant request.                                                                                                                                         |
| `attachToken`    | Required          | `boolean` | `false`       | Specifies if the access token should be attached to the header of the request.                                                                                                                                                |
| `returnsSession` | Required          | `boolean` | `false`       | Specifies if the the request returns session information such as the access token.                                                                                                                                            |

#### Custom Grant Template Tags

Session information can be attached to the body of a custom-grant request using template tags. This is useful when the session information is not exposed outside the SDK but you want such information to be used in custom-grant requests. The following table lists the available template tags.
|Tag|Data|
|--|--|
|"{{token}}" | The access token.|
|{{username}}" | The username.|
|"{{scope}}" | The scope.|
|{{clientID}}" | The client ID.|
|"{{clientSecret}}" | The client secret.|

#### The data attribute

### DecodedIDTokenPayload

| Method             | Type                   | Description                                    |
| ------------------ | ---------------------- | ---------------------------------------------- |
| aud                | `string` \| `string[]` | The audience.                                  |
| sub                | `string`               | The subject. This is the username of the user. |
| iss                | `string`               | The token issuer.                              |
| email              | `string`               | The email address.                             |
| preferred_username | `string`               | The preferred username.                        |
| tenant_domain      | `string`               | The tenant domain to which the user belongs.   |

### HTTPRequestConfig
This extends the `AxiosRequestConfig` by providing an additional attribute that is used to specify if the access token should be attached to the request or not.
|Attribute | Type | Description|
|--|--|--|
|attachToken| `boolean`| Specifies if the access token should be attached to the header of the request.|

## Develop

### Prerequisites

-   `Node.js` (version 10 or above).
-   `yarn` package manager.

### Installing Dependencies

The repository is a mono repository. The SDK repository is found in the [lib]() directory. You can install the dependencies by running the following command at the root.

```
yarn build
```

## Contribute

Please read [Contributing to the Code Base](http://wso2.github.io/) for details on our code of conduct, and the process for submitting pull requests to us.

### Reporting issues

We encourage you to report issues, improvements, and feature requests creating [Github Issues](https://github.com/asgardeo/asgardeo-auth-react-sdk/issues).

Important: And please be advised that security issues must be reported to security@wso2com, not as GitHub issues, in order to reach the proper audience. We strongly advise following the WSO2 Security Vulnerability Reporting Guidelines when reporting the security issues.

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.
