# APIs

## Table of Content

-   [AuthProvider](#authprovider)
-   [Securing routes with Asgardeo](#securing-routes-with-asgardeo)
    -   [SecureApp](#1-secureapp)
    -   [AuthenticatedComponent](#2-authenticatedcomponent)
    -   [Bring Your Own Router](#3-implement-your-own-routing-logic)
-   [useAuthContext React Hook](#useauthcontext-react-hook)
-   [`state` Object](#state-object)
-   [Consuming the `isLoading` State of the Auth Flow](#consuming-the-isloading-state-of-the-auth-flow)
-   [List of supported APIs](#list-of-supported-apis)
    -   [signIn](#signin)
    -   [isAuthenticated](#isauthenticated)
    -   [autoSignIn](#autosignin)
    -   [getBasicUserInfo](#getbasicuserinfo)
    -   [signOut](#signout)
    -   [getIDToken](#getidtoken)
    -   [getDecodedIDToken](#getdecodedidtoken)
    -   [getAccessToken](#getaccesstoken)
    -   [refreshAccessToken](#refreshaccesstoken)
    -   [revokeAccessToken](#revokeaccesstoken)
    -   [httpRequest](#httprequest)
    -   [httpRequestAll](#httprequestall)
    -   [enableHttpHandler](#enablehttphandler)
    -   [disableHttpHandler](#disablehttphandler)
    -   [getOIDCServiceEndpoints](#getoidcserviceendpoints)
    -   [on](#on)
    -   [updateConfig](#updateconfig)
    -   [trySignInSilently](#trysigninsilently)
-   [Storage](#storage)
    -   [Session Storage](#session-storage)
    -   [Web Worker](#web-worker)
    -   [Local Storage](#local-storage)
-   [Using the `form_post` response mode](#using-the-form_post-response-mode)
-   [Models](#models)
    -   [AuthStateInterface](#authstateinterface)
    -   [AuthReactConfig](#authreactconfig)
    -   [BasicUserInfo](#basicuserinfo)
    -   [SignInConfig](#signinconfig)
    -   [OIDCEndpoints](#oidcendpoints)
    -   [DecodedIDTokenPayload](#decodedidtokenpayload)
    -   [HttpRequestConfig](#httprequestconfig)
- [Other Links](#other-links)

## AuthProvider

This is a [React Context](https://reactjs.org/docs/context.html) Provider that provides the session state which contains information such as the authenticated user's display name, email address, etc., and the methods that are required to implement authentication in the React app.
Like every other provider, the `AuthProvider` also encapsulates the components that would need the data provided by the provider.
`AuthProvider` takes following properties.
| Property         | Type      | Required/Optional                                                               |
| :---------------- | :-------- | :------------------------------------------------------------------------ |
| `config`   | `AuthReactConfig`  | Required
| `fallback` | `ReactNode` | Optional
| `plugin` | `AsgardeoSPAClient` | Optional
| `getAuthParams` | `() => Promise<AuthParams>` | Optional
| `onSignOut` | `() => void` | Optional

1. **config** - Accepts a config object of type [`AuthClientConfig<AuthReactConfig>`](#authreactconfig). This config object contains attributes that provide the configurations necessary for authentication. To learn more about what attributes the object takes, refer to the [`AuthReactConfig`](#authreactconfig) section.
2. **fallback?** - Used to specify a fallback component that will be rendered when the user is not authenticated. This accepts any React element.
3. **plugin?** - A parameter that can be used to pass an external plugin. (Ex: `TokenExchangePlugin`)
4. **getAuthParams?** - Pass an async callback function that would return the `authorizationCode`, `sessionState` and `state` in a Promise
5. **onSignOut?** - A function can be passed which gets called upon sign out.

The `AuthProvider` also automatically requests for the access token should the URL contain the `code` query parameter.

If the response mode is set to [`form_post`](#using-the-form_post-response-mode), then you will have your own ways of retrieving the authorization code and session state from your backend. In that case, you can use the `getAuthParams()` prop method to pass an async callback function that would return the `authorizationCode` and `sessionState` in a Promise. This way, the `AuthProvider` will use the authorization code returned by this method to automatically request for an access token.

Example:

```TypeScript
export const MyApp = (): ReactElement => {
    return (
        <AuthProvider config={ config } fallback={ <div>Initializing...</div> }>
            <Dashboard />
        </AuthProvider>
    )
}
```

Example with an external Auth SPA plugin:

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
## Securing routes with Asgardeo

There are 3 approaches you can use to secure routes in your React application with Asgardeo.

### 1. SecureApp

This is a component that can be used to secure a whole React app. This component wraps a React component and renders it only if the user is signed in. Otherwise, it renders the `fallback` prop. If the user is not signed in, this component automatically initiates the sign-in flow.

```TypeScript
<SecureApp
    fallback={ <Loader /> }
    onSignIn={ onSignInFunction }
    overrideSignIn={ overrideSignInFunction }
>
    <App />
</SecureApp>
```
The component takes three props, namely `fallback`, `onSignIn`, and `overrideSignIn`.

1. **fallback?**: `ReactNode` (optional)
Takes a React component is used to render a fallback component during sign in.
2. **onSignIn?**: `() => void` (optional)
Used to pass a callback function that will be called after signing in. 
2. **overrideSignIn?**: `() => Promise<void>` (optional)
Used to specify a function that will be called to initiate the sign-in flow. By default, the [`signIn()`](#signin) method is used to initiate the sign-in flow. If you want to use a custom sign in method, you can pass it here. 
For example, if you use the [`form_post`](#using-the-form_post-response-mode) method to retrieve the authorization code, then you can call the `signIn` with the code within this method.

Use this if you want to sign-in a user on app load. This component renders its children if a user is authenticated. Otherwise, it initiates the sign-in flow.

#### Example
```TypeScript
import { SecureApp } from "@asgardeo/auth-react";

const App = () => {
    return (
        <SecureApp 
            fallback={ <Loader /> }
            onSignIn={ functionToFireOnSignIn }
            overrideSignIn={ customSignInMethod}
        >
            <App />
        </SecureApp>
    );
}
```

### 2. AuthenticatedComponent

This component is used to wrap the components that need authentication. This offers more granular control of the elements that should or should not be rendered depending on whether the user is authenticated or not. 

```TypeScript
<AuthenticatedComponent
    fallback={ <FallbackComponent /> }
>
    <SecureComponent />
</AuthenticatedComponent>
```

If the user is authenticated, the component renders the wrapped component. If the user is not authenticated, the component renders the `fallback` prop which accepts any **React element**.

#### Example
```TypeScript
import { AuthenticatedComponent } from "@asgardeo/auth-react";

const FallbackComponent = () => {
    return (
        <div>Sign in to view this section.</div>
    )
}

const App = () => {
    return (
        <>
            <Header />
            <AuthenticatedComponent
                fallback={ FallbackComponent }
            >
                <SecureComponent />
            </AuthenticatedComponent>
            <Footer />
        </>
    )
}
```
In this case, `<Header />` and `<Footer />` will render regardless of user's authenticated status. But the `<SecureComponent />` will be only rendered when the user is authenticated. 

If the user is **not** authenticated, the `<FallbackComponent/>` will be loaded. If you didn't include a `fallback`, it will render a `null` instead.

### 3. Implement Your Own Routing Logic

It's also possible to implement your own routing logic to secure the protected routes, based on the routing library you use.

#### React Router v6

Create a reusable component that redirects user to the sign in page based on the authentication status.

**ProtectedRoute.jsx**

```js
import { useAuthContext } from '@asgardeo/auth-react';

const ProtectedRoute = ({ children }) => {
  const {
    signIn,
    state: { isAuthenticated }
  } = useAuthContext();

  if (!isAuthenticated) {
    return (
        <button
          onClick={ () => signIn() }
        >
          Sign In
        </button>
    )
  }

  return children;
};

export default ProtectedRoute;
```

Use the `ProtectedRoute` as follows, in your route definition.

```js
import { AuthProvider } from '@asgardeo/auth-react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
```

---
## useAuthContext React Hook

This is a React hook that returns the session state that contains information such as the email address of the authenticated user and the methods that are required for implementing authentication.

Example:

```TypeScript
const { signIn } = useAuthContext();
```

The object returned by the `useAuthContext` has a `state` attribute the value of which is an object of type [`AuthStateInterface`](#authstateinterface). You can refer the topic below to know more about what data is contained by the `state` object.

You can see all the APIs that can be accessed via `useAuthContext()` [in here](#list-of-supported-apis).

---
## `state` Object

The state object will contain attributes such as whether a user is currently logged in, the username of the currently logged-in user etc. It is an object of type [`AuthStateInterface`](#authstateinterface).

Example:

```json
{
    "allowedScopes": "openid profile",
    "displayName": "alica",
    "isAuthenticated": true,
    "isLoading": false,
    "sub": "d33ab8c0-1234-4567-7890-b5c3619cb356",
    "username": "alica@bifrost.com",
    "isSigningOut": false
}
```

### Consuming the `isLoading` State of the Auth Flow

Based on the loading state of the authentication flow, you may want to take some actions like show spinners etc.

Always use the `isLoading` flag from the `state` object rather than maintaining your own React state.

#### Example
```TypeScript
import { useAuthContext } from "@asgardeo/auth-react";

const App = () => {
  const { state } = useAuthContext();
  const { isLoading } = state;

  if (isLoading) {
    return <Spinner />
  }

  return (
    <main>
     …
    </main>
  );
}
```
---
## List of supported APIs
In addition to the `state` object, the `useAuthContext()` hook also returns the following methods. You can use the methods as follows.

```typescript
import { useAuthContext } from "@asgardeo/auth-react";

const App = () => {
  const { <method_name> } = useAuthContext();
  ...
}
```

### signIn
As the name implies, this method is used to sign-in users. This method can be bound to an `onClick` function as follows.
```typescript
<button onClick={ () => signIn() }>Login</button>
```
Clicking on **Login button** will take the user to Asgardeo login page. Upon successful `signIn()`, the user will be redirected to the app (based on the specified `signInRedirectURL`) and the `state.isAuthenticated` will be set to `true`.
```typescript
signIn(
    config?: SignInConfig,
    authorizationCode?: string,
    sessionState?: string,
    authState?: string,
    callback?: (response: BasicUserInfo) => void,
    tokenRequestConfig?: {
        params: Record<string, unknown>
    }
);
```

#### Arguments
1. **config?**: [`SignInConfig`](#signinconfig) (optional)
   An object that contains attributes that allows you to configure sign in. The `forceInit` attribute of this object, allows you to force a request to the `.well-known` endpoint even if a request has previously been sent. You can also pass key-value pairs that you want to be appended as path parameters to the authorization URL to this object. To learn more, refer to [`SignInConfig`](#SignInConfig). This object is needed only during the authorization-url-generation phase.

2. **authorizationCode?**: `string` (optional)
   The `signIn` method can be passed the authorization code as an argument, which will be used to obtain the token during the token-request phase of the method. This allows developers to use different response modes such as `form_post`. To learn more about the `form_post` method refer to the [Using the `form_post` response mode](#Using-the-form_post-response-mode) section. If you're using the `query` method, then the `signIn` method automatically obtains the authorization code from the URL.
3. **sessionState?**: `string` (optional)
   The `signIn` method can be passed the session state as an argument, which will be used to obtain the token during the token-request phase of the method. This allows developers to use different response modes such as `form_post`. To learn more about the `form_post` method refer to the [Using the `form_post` response mode](#Using-the-form_post-response-mode) section. If you're using the `query` method, then the `signIn` method automatically obtains the session state from the URL.
4. **authState?**: `string` (optional)
   The `signIn` method can be passed the state parameter as an argument, which will be used to obtain the token during the token-request phase of the method.
5. **callback?**: (response: [`BasicUserInfo`](#basicuserinfo)) => `void`
   A callback function that fires when sign-in is successful. The callback function takes an object of type [`BasicUserInfo`](#basicuserinfo) as an argument.
6. **tokenRequestConfig?**: `object` (optional)
    An optional configuration object that allows you to augment the token request.
    - `params` (Mandatory): Key-value pairs to be sent as additional parameters in the token request payload.

       ```TypeScript
       tokenRequestConfig: {
           params: Record<string, unknown>
       }
       ```

The `sign-in` hook is used to fire a callback function after signing out is successful. Check the [`on()`](#on) section for more information.
#### Example

```TypeScript
import { useAuthContext } from "@asgardeo/auth-react";

const App = () => {
  const { signIn } = useAuthContext();
  .
  .
  .
  return (
        .
        .
        .
        <button onClick={ () => signIn() }>Login</button>
  )
}
```
---

### isAuthenticated
This method returns a promise that resolves with the boolean value of `true` or `false` indicating if the user is authenticated or not. The result returned will be similar to `state.isAuthenticated` value.

```TypeScript
isAuthenticated(): <promise>boolean
```

#### Returns
A promise that resolves with a boolean value.

#### Example
```TypeScript
import { useAuthContext } from "@asgardeo/auth-react";

const App = () => {
    const { isAuthenticated } = useAuthContext();
    
    useEffect(() => {
        isAuthenticated().then((response) => {
            if (response === true) {
                // User is authenticated
            } else {
                // User is not authenticated
            }
        }).catch((error) => {
            //console.log(error);
        });
    }, [])
    .
    .
    .
}
```
---

### autoSignIn

This will enable a mechanism where the application will sign in automatically if there is an already active session in an instance of the same application in the same browser. This behaves similar to [`trySignInSilently()`](#trySignInSilently), but does not use an iFrame to check the session and instead uses a parameter in the local storage of the browser.

>**Warning**
>The will only work if the storage type is set to [`sessionStorage`](#session-storage) or [`localStorage`](#local-storage). If it is set to [`webWorker`](#web-worker), an error is thrown.
>The reason is that this method uses a parameter in the local storage of the browser.


You can add `disableAutoSignIn` as a config in the [Asgardeo SDK configuration](#authreactconfig) as follows. This will make the application to attempt silent sign-in as soon as it loads.
```json
{
    ...
    disableAutoSignIn: false
}
```


---
### getBasicUserInfo
This method returns a promise that resolves with the information about the authenticated user obtained from the id token as an object. To learn more what information this object contains, refer to the [`BasicUserInfo`](#basicuserinfo) section.

> **Note**
> Use [`getDecodedIDToken`](#getdecodedidtoken) method to get the additional user attributes that are not returned from the `getBasicUserInfo` method.

```TypeScript
getBasicUserInfo(): Promise<BasicUserInfo>;
```

#### Returns

A Promise that resolves with [`BasicUserInfo`](#BasicUserInfo).

#### Example

```TypeScript
import { useAuthContext } from "@asgardeo/auth-react";

const App = () => {
    const { getBasicUserInfo } = useAuthContext();

    useEffect(() => {
        getBasicUserInfo().then((response) => {
            //console.log(response);
        }).catch((error) => {
            //console.error(error);
        });
    }, []);
    .
    .
    .
}
```
---

### signOut
As the name implies, this method is used to sign out users. This method ends the user session in the Asgardeo and logs the user out. It method can be bound to an `onClick` function as follows.
```Typescript
<button onClick={() => signOut()}>Logout</button>
```
Clicking on **Logout button** will sign out the user and will be redirected to `signOutRedirectURL` and the `state.isAuthenticated` will be set to `false`.


The `sign-out` hook is used to fire a callback function after signing out is successful. Check the [`on()`](#on) section for more information.

#### Example
```TypeScript
import { useAuthContext } from "@asgardeo/auth-react";

const App = () => {
    const { signOut } = useAuthContext();
    .
    .
    .
    return (
            .
            .
            .
            <button onClick={ () => signOut() }>Login</button>
    )
}
```
---
### getIDToken
An ID token contains information about what happened when a user authenticated, and is intended to be read by the OAuth client. The ID token may also contain information about the user such as their name or email address.

This method returns the `ID token` in a form of a string. To get the decoded ID token, you can use [`getDecodedIDToken()`](#getdecodedidtoken).
```TypeScript
getIDToken(): Promise<string>
```

#### Returns
A promise that resolves with the ID token as a string.

#### Example
```TypeScript
import { useAuthContext } from "@asgardeo/auth-react";

const App = () => {
    const { getIDToken } = useAuthContext();
    
    useEffect(() => {
        getIDToken().then((idToken) => {
            //console.log(idToken);
        }).catch((error) => {
            //console.log(error);
        })
    }, []);
    .
    .
    .
}
```
---
### getDecodedIDToken
This method returns a promise that resolves with the decoded payload of the JWT ID token. Use this method if you want to get the **decoded value** of the object returned from [`getIdToken()`](#getidtoken)
```typescript
getDecodedIDToken(): Promise<DecodedIDTokenPayload>
```
>**Warning**
>The promise resolves successfully only if the storage type is set to [`sessionStorage`](#session-storage) or [`localStorage`](#local-storage). If it is set to [`webWorker`](#web-worker), an error is thrown.
>The reason is that the token is stored inside the web worker and cannot be accessed from outside.
#### Returns
A promise that returns with the [`DecodedIDTokenPayload`](#decodedidtokenpayload) object.

#### Example
```TypeScript
import { useAuthContext } from "@asgardeo/auth-react";

const App = () => {
    const { getDecodedIDToken } = useAuthContext();
    
    useEffect(() => {
        getDecodedIDToken().then((decodedIdToken) => {
            //console.log(decodedIdToken);
        }).catch((error) => {
            //console.log(error);
        })
    }, []);
    .
    .
    .
}
```
---
### getAccessToken
An Access Token is a string that the OAuth client uses to make requests to the resource server (Asgardeo). The application receives an access token from the SDK after a user is successfully authenticated. The [token storage mechanism](#storage) can be configured according to your preference.

The access token will be used as a credential when it calls the Asgardeo APIs.

This methods returns a promise that resolves with the access token as a string.
```typescript
getAccessToken(): Promise<string>;
```
>**Warning**
>The promise resolves successfully only if the storage type is set to [`sessionStorage`](#session-storage) or [`localStorage`](#local-storage). If it is set to [`webWorker`](#web-worker), an error is thrown.
>The reason is that the token is stored inside the web worker and cannot be accessed from outside.
#### Returns
A Promise that resolves with the access token.

#### Example
```TypeScript
import { useAuthContext } from "@asgardeo/auth-react";

const App = () => {
    const { getAccessToken } = useAuthContext();
    
    useEffect(() => {
        getAccessToken().then((accessToken) => {
            //console.log(accessToken);
        }).catch((error) => {
            //console.log(error);
        });
    }, []);
    .
    .
    .
}
```
---
### refreshAccessToken
This refreshes the access token and stores the refreshed session information in either the session storage or local storage as per your configuration.
```typescript
refreshAccessToken(): Promise<BasicUserInfo>;
```
>**Warning**
>The token refresh is handled **automatically** by the SDK. Use this method if you need to explicitly refresh the token. Note that this method will not work when the storage type is set to `webWorker` since the web worker automatically refreshes the token.

#### Returns
A Promise that resolves with the [`BasicUserInfo`](#basicuserinfo) object.

#### Example
```TypeScript
import { useAuthContext } from "@asgardeo/auth-react";

const App = () => {
    const { refreshAccessToken } = useAuthContext();
    
    useEffect(() => {
        refreshAccessToken().then((basicUserInfo) => {
            //console.log(basicUserInfo);
        }).catch((error) => {
            //console.log(error);
        });
    }, []);
    .
    .
    .
}
```
---
### revokeAccessToken
This method revokes the access token and clears the session information from the storage.
```typescript
revokeAccessToken();
```
>**Note**
>The [`signOut()`](#signout) method will automatically revoke the access token when called. Use the above method if you want to forcefully revoke the access token.


The `end-user-session` hook is used to fire a callback function after end user session is successful. Check the [`on()`](#on) section for more information.

#### Example
```typeScript
import { useAuthContext } from "@asgardeo/auth-react";

const App = () => {
    const { revokeAccessToken } = useAuthContext();

    return (
        .
        .
        .
        <button onClick={() => revokeAccessToken()}>Revoke Access</button>
    )
}
```
---
### httpRequest
This method is used to send http requests to Asgardeo or desired backend. The developer doesn't need to manually attach the access token since this method does it automatically.

If the **storage type** is set to `sessionStorage` or `localStorage`, the developer may choose to implement their own ways of sending http requests by obtaining the access token from the relevant storage medium and attaching it to the header. However, if the `storage` is set to `webWorker`, this is the _ONLY_ way http requests can be sent with the token.

This method accepts a config object which is of type `AxiosRequestConfig`. If you have used `axios` before, you can use the `httpRequest` in the exact same way.
```typescript
httpRequest(config: HttpRequestConfig): Promise<HttpResponse>;
```

#### Arguments

1. config: [`HttpRequestConfig`](#httprequestconfig)
   A config object with the settings necessary to send http requests. This object is similar to the `AxiosRequestConfig` but provides these additional attributes:

   |Attribute|Type|Default|Description|
   |--|--|--|--|
   |`attachToken`|`boolean`|`true`|If set to `true`, the token will be attached to the request header. <br/><br/> 💡 **Note** : If the request is credentialed,  server must specify a domain, and cannot use wild carding. This would lead to [CORS errors](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) and if you intend to bypass this behavior per request, add `wihCredentials: false` to the `httpRequest` config.|
   |`shouldEncodeToFormData`|`boolean`|`false`|If set to `true`, the request body will be encoded to `FormData`. The body (specified by the `data` attribute) should be a Javascript object. |


#### Returns
A Promise that resolves with the response relevant to the HTTP request that was sent.

#### Example

There are two approaches when sending HTTP requests.

1. **Within React Components** - When sending HTTP requests from inside React components or React Hooks, always use the `httpRequest` and  `httpRequestAll` methods exposed from the `useAuthContext` hook.

    For example, to get the user profile details after signing in, you can query the `me` endpoint as follows:
    ```TypeScript
    import { useAuthContext } from "@asgardeo/auth-react";

    const App = () => {
        const { httpRequest } = useAuthContext();

        const requestConfig = {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/scim+json"
            },
            method: "GET",
            url: "https://api.asgardeo.io/t/<org_name>/scim2/me"
        };

        useEffect(() => {
            httpRequest(requestConfig)
                .then((response) => {
                    // console.log(response);
                })
                .catch((error) => {
                    // console.error(error);
                });
        }, [])
        .
        .
        .
    }
    ```

2. **From Non-Components** - When sending HTTP requests from JS or TS logic files which are non components, you do not have access to React Hooks. Therefore, if you want to invoke APIs from a logic file, you have to get an instance of the HTTP client and use that instance to invoke the APIs.

    For example, to get the user profile details after signing in, you can query the `me` endpoint via a custom function `getUser()` as follows:
    ```TypeScript
    import { AsgardeoSPAClient } from "@asgardeo/auth-react";

    const spaClient = AsgardeoSPAClient.getInstance();

    const getUser = () => {
        const requestConfig = {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/scim+json"
            },
            method: "GET",
            url: "https://api.asgardeo.io/t/<org_name>/scim2/me"
        };

        spaClient.httpRequest(requestConfig)
            .then((response) => {
               // do something with response
            })
            .catch((error) => {
              // do something with error.
            });
    };

    ```
---
### httpRequestAll
This method is used to send multiple, **concurrent** http requests to the Asgardeo or a desired backend at the same time. Instead of making multiple HTTP requests individually, this method allows you to make multiple HTTP requests to different endpoints altogether.

This might be useful when you want to call multiple endpoints at once to get an accumulated result from the responses of those endpoints.

>**Note**
> This methods sends the requests concurrently, **not** sequentially.

This works similar to `axios.all()`. An array of config objects need to be passed as the argument and an array of responses will be returned in a `Promise` in the order in which the configs were passed.

If the **storage type** is set to `sessionStorage` or `localStorage`, the developer may choose to implement their own ways of sending http requests by obtaining the access token from the relevant storage medium and attaching it to the header. However, if the `storage` is set to `webWorker`, this is the _ONLY_ way http requests can be sent with the token.
```typescript
httpRequestAll(config[]: ): Promise<[]>;
```

#### Arguments

1. **config[]**: [`HttpRequestConfig[]`](#httprequestconfig)
   An array config objects with the settings necessary to send http requests. This object is similar to the `AxiosRequestConfig`, but provides these additional attributes:

   |Attribute|Type|Default|Description|
   |--|--|--|--|
   |`attachToken`|`boolean`|`true`|If set to `true`, the token will be attached to the request header.|
   |`shouldEncodeToFormData`|`boolean`|`false`|If set to `true`, the request body will be encoded to `FormData`. The body (specified by the `data` attribute) should be a Javascript object. |

#### Returns
An array of promises that resolve with the responses relevant to the HTTP requests that was sent. The responses will be returned **in the order of requests that was sent.**
>**Warning**
> If one of the requests in the `httpRequestAll` fail, it will **not** return a response (even if the other requests were successful). Therefore, for this method to return a successful response, all the requests should be successful.
#### Examples
There are two approaches when sending HTTP requests.

1. **Within React Components** - When sending HTTP requests from inside React components or React Hooks, always use the `httpRequest` and  `httpRequestAll` methods exposed from the `useAuthContext` hook.

    For example, to get the user profile details after signing in, you can query the `userinfo` endpoint and other requests as follows:
    ```TypeScript
    import { useAuthContext } from "@asgardeo/auth-react";

    const App = () => {
        const { httpRequest } = useAuthContext();

        const requestConfigs = [
            {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/scim+json"
                },
                method: "GET",
                url: "https://api.asgardeo.io/t/<org_name>/oauth2/userinfo"
            },
            {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/scim+json"
                },
                method: "GET",
                url: "https://api.asgardeo.io/t/<org_name>/oauth2/jwks"
            },
            .
            .
            .
        ];

        useEffect(() => {
            httpRequestAll(requestConfigs).then((responses) => {
                // responses are returned in the order of the requests.
                // responses[0] will return response from userinfo endpoint.
                // responses[1] will return response from jwks endpoint.

                // responses array can be iterated as follows.
                responses.forEach((response) => {
                    // console.log(response.data);
                });
            }).catch((error) => {
                // console.error(error);
            });
        }, []);
        .
        .
        .
    }
    ```

2. **From Non-Components** - When sending HTTP requests from JS or TS logic files which are non components, you do not have access to React Hooks. Therefore, if you want to invoke APIs from a logic file, you have to get an instance of the HTTP client and use that instance to invoke the APIs.

    For example, to get the user profile details after signing in, you can query the `userinfo` endpoint and other requests as follows:
     ```TypeScript
    import { AsgardeoSPAClient } from "@asgardeo/auth-react";

    const spaClient = AsgardeoSPAClient.getInstance();

    const requestConfigs = [
        {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/scim+json"
            },
            method: "GET",
            url: "https://api.asgardeo.io/t/<org_name>/oauth2/userinfo"
        },
        {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/scim+json"
            },
            method: "GET",
            url: "https://api.asgardeo.io/t/<org_name>/oauth2/jwks"
        },
        .
        .
        .
    ];

    spaClient.httpRequestAll(requestConfigs).then((responses) => {
        // responses are returned in the order of the requests.
        // responses[0] will return response from userinfo endpoint.
        // responses[1] will return response from jwks endpoint.

        // responses array can be iterated as follows.
        responses.forEach((response) => {
            // console.log(response.data);
        });
    }).catch((error) => {
        // console.error(error);
    });
    ```
---
### enableHttpHandler
This enables the callback functions attached to the HTTP client. The callback functions are enabled by default. This needs to be called **only** if the [disableHttpHandler](#disablehttphandler) method was called previously.

This will allow you to intercept the HTTP requests and responses sent by the SDK, before dispatching the request.
```typescript
enableHttpHandler(): Promise<Boolean>
```

#### Returns
A Promise that resolves with a `boolean` value indicating if the call was successful.

#### Example

```TypeScript
enableHttpHandler();
```
---
### disableHttpHandler
This disables the callback functions attached to the HTTP client.

This will allow you to prevent intercepting the HTTP requests and responses sent by the SDK, before dispatching the request.
```typescript
disableHttpHandler(): Promise<boolean>
```

#### Returns
A Promise that resolves with a `boolean` value indicating if the call was successful.

#### Example
```TypeScript
disableHttpHandler();
```
---
### getOIDCServiceEndpoints
This method returns a promise that resolves with an object containing the OIDC endpoints obtained from the `.well-known` endpoint. 
```TypeScript
getOIDCServiceEndpoints(): Promise<OIDCEndpoints>
```

The object contains the following attributes.
| Attribute             | Description                                                                        |
| --------------------- | ---------------------------------------------------------------------------------- |
| `"authorizationEndpoint"`| The endpoint to which the authorization request should be sent.                    |
| `"checkSessionIframe"` | The URL of the page that should be loaded in an IFrame to get session information. |
| `"endSessionEndpoint"` | The endpoint which should be called to end the session. |
| `"introspectionEndpoint"` | The endpoint which should be called to validate an access token and retrieve its underlying authorization. |
| `"issuer"` | The endpoint which should be called to end the session. |
| `"jwksUri"` | The endpoint from which JSON Web Key Set can be obtained.                          |
| `"registrationEndpoint"` | The endpoint from which a Client can be registered at the Authorization Server.                          |
| `"revocationEndpoint"`| The endpoint to which the revoke-token request should be sent.                     |
| `"tokenEndpoint"` | The endpoint to which the token request should be sent.                            |
| `"userinfoEndpoint"` | The endpoint to retrieve profile information and other attributes for a logged-in end-user. |
#### Returns
A Promise that resolves with an object containing the endpoints. To learn more about what endpoints are returned, refer to the [`OIDCEndpoints`](#oidcendpoints) section.

#### Example
```typeScript
import { useAuthContext } from "@asgardeo/auth-react";

const App = () => {
    const { getOIDCServiceEndpoints } = useAuthContext();

    useEffect(() => {
        getOIDCServiceEndpoints().then((endpoints) => {
            //console.log(endpoints);
        }).catch((error) => {
            //console.log(error)
        });
    }, []);
}
```
---
### on
The `on` method is used to hook callback functions to authentication methods. The method accepts a hook name and a callback function as the only arguments. The following hooks are available.
```typescript
on(hook: string, callback: () => void, id?: string): void
```

#### Arguments

1. **hook**: `string`
   The name of the hook.
2. **callback**: `() => void`
   The callback function that should be fired.
3. **id?**: `string`
   An id for the method. This is required only when the hook type is `custom-grant`.

#### Description



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

**When the user signs out, the user is taken to the Asgardeo's logout page and then redirected back to the SPA on successful logout. Hence, developers should ensure that the `"sign-out"` hook is called when the page the user is redirected to loads.**

#### Example
In this example, the `sign-in` and the `sign-out` hooks are used to show a welcome message and a goodbye message respectively.
```TypeScript
import { useAuthContext } from "@asgardeo/auth-react";

enum Hooks {
    SignIn = "sign-in",
    SignOut = "sign-out"
}

const App = () => {
    const { on } = useAuthContext();

    useEffect(() => {
        on(Hooks.SignIn, () => {
            //called after signing in.
            showWelcomeMessage();
        });
        
        on(Hooks.SignOut, () => {
            //called after signing out.
            showGoodbyeMessage();
        });
        .
        .
        .
    }, [on]);
}
```
---
### updateConfig
This method can be used to update the configurations passed into the constructor of the [`AuthReactConfig`](#authreactconfig). Please note that every attribute in the config object passed as the argument here is optional. Use this method if you want to update certain attributes after instantiating the class.
```TypeScript
updateConfig(config: Partial<AuthClientConfig<AuthReactConfig>>): void
```

#### Arguments
1. **config**: [`Partial<AuthClientConfig<AuthReactConfig>>`](#authreactconfig)

The config object containing the attributes that can be used to configure the SDK. To learn more about the available attributes, refer to the [`AuthReactConfig`](#authreactconfig) model.

#### Example
```TypeScript
updateConfig({
    signOutRedirectURL: "https://localhost:3000/sign-out"
});
```
---
### trySignInSilently
>**Warning**
>Since this method uses an iFrame, it will not work if third-party cookies are blocked in the browser. Most modern browsers block third-party cookies by default and can cause some unexpected behavior with this function. 
>Therefore it is recommended to use your own implementation of silent sign-in from the application side using the [`signIn()`](#signin) method.

This method attempts to sign a user in silently by sending an authorization request with the `prompt` query parameter set to `none`.
This will be useful when you want to sign a user in automatically while avoiding the browser redirects.

This uses an iFrame to check if there is an active user session in Asgardeo by sending an authorization request. If the request returns an authorization code, then the token request is dispatched and the returned token is stored effectively signing the user in.

To dispatch a token request, the [`signIn()`](#signin) or `trySignInSilently()` method should be called by the page/component rendered by the redirect URL.
```typescript
trySignInSilently(): Promise<boolean | BasicUserInfo>;
```

#### Returns
This returns a promise that resolves with a [`BasicUserInfo`](#basicuserinfo) object following a successful sign in. If the user is not signed into the Asgardeo, then the promise resolves with the boolean value of `false`.
#### Example
Silent sign-in can be performed in **two ways**.
1. You can enable silent sign-in as a config in the [Asgardeo SDK configuration](#authreactconfig) as follows. This will make the application to attempt silent sign-in as soon as it loads.
    ```json
    {
        ...
        disableTrySignInSilently: false
    }
    ```
2. Or, you can call the `trySignInSilently()` function within the application and perform silent sign-in.
    ```typescript
    import { useAuthContext } from "@asgardeo/auth-react";

    const App = () => {
        const { trySignInSilently } = useAuthContext();

        useEffect(() => {
            trySignInSilently().then((response)=>{
                if(response) {
                    // The user is signed in.
                    // handle basic user info
                }

                // If response is false,
                // The user is not signed in.
            });
        }, []);
        .
        .
        .
    }
    ```
---
---
## Storage
Asgardeo allows the session information including the access token to be stored in three different places, namely,

1. [Session storage](#session-storage)
2. [Web worker](#web-worker)
3. [Local storage](#local-storage)


The storage mechanism can be defined in the configuration provided to the `<AuthProvider />` as follows.

```json
{
   "clientID": "",
   "baseUrl": "https://api.asgardeo.io/t/<org_name>",
   "signInRedirectURL": "https://localhost:3000/sign-in",
   "signOutRedirectURL": "https://localhost:3000/sign-out",
   "scope": ["openid", "profile"],
   "storage": "sessionStorage"
}
```

### Session Storage
The token is stored in the session of the browser via Javascript. The tokens can be seen when inspected via the browser console. The token stored are only available per tab. Changes made are saved and available for the current page in that tab until it is closed. Once it is closed, the stored data is deleted.

#### Pros
- Easier to use and developer friendly as the tokens can be accessed via browser storage. Therefore, the developer will have access to the methods like `getAccessToken()` and `getIDPAccessToken()` in the SDK.
- The tokens will persist in browser refresh as the browser storage is not cleared on refreshes. This eliminates the need to get the token from Asgardeo on every reload.
- The responsibility of handling the token falls on the application developer and they can use it however they wish as they have full control over the token.

#### Cons
- The **drawback** on this approach is that the tokens can be subjected to [Cross-Site Scripting (XSS)](https://owasp.org/www-community/attacks/xss) attacks. React applications are mostly immune to these kind of attacks. But you can make your React application more secure against XSS by following [this guide](https://stackoverflow.com/collectives/wso2/articles/75138459/mitigating-xss-attacks-in-react-applications). Additionally, you can also use a [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) to mitigate XSS attacks. For more information on the usage of CSP in React, refer to [this article](https://stackoverflow.com/collectives/wso2/articles/75138459/mitigating-xss-attacks-in-react-applications).

### Web Worker
Web Workers are a simple means for web content to run scripts in background threads. The worker thread can perform tasks without interfering with the user interface. Once created, a worker can send messages to the JavaScript code that created it by posting messages to an event handler specified by that code (and vice versa).

#### Pros
- Out of the above three methods, storing the session information in the **web worker** is the **safest** method. This is because the web worker cannot be accessed by third-party libraries and the data cannot be stolen through XSS attacks. 

#### Cons
- Since the token is inside the web worker, it cannot be accessed from outside by the developer. Therefore, if they need to send an HTTP request with the token, it needs to be done within the web worker. This means that the APIs such as `getAccessToken()` and `getIDPAccessToken()` **do not work** with the web worker approach.
- If a request is made to Asgardeo (with the token), it needs to be done via the web worker, using it's own HTTP client using the [`httpRequest`](#httprequest) method. But if you do not require the token (when talking to their own APIs), you can use any HTTP client.
- Since the tokens are stored in the browser memory, when a page reloads happens the token gets lost as the browser resets the memory. Therefore, the token does not persist on page refreshes and browser tabs.

### Local Storage
The token is stored in the local storage of the browser via Javascript. The tokens can be seen when inspected via the browser console.  The difference between local and session storage is that the local storage does not expire and needs to be explicitly deleted which is an elevated security risk.
#### Pros
- Easier to use and developer friendly as the tokens can be accessed via browser storage. Therefore, the developer will have access to the methods like `getAccessToken()` and `getIDPAccessToken()` in the SDK.
- The tokens will persist in browser refresh as the browser storage is not cleared on refreshes. This eliminates the need to get the token from Asgardeo on every reload.
- The responsibility of handling the token falls on the application developer and they can use it however they wish as they have full control over the token.

#### Cons
- The tokens can be subjected to [Cross-Site Scripting (XSS)](https://owasp.org/www-community/attacks/xss) attacks. React applications are mostly immune to these kind of attacks. But you can make your React application more secure against XSS by following [this guide](https://stackoverflow.com/collectives/wso2/articles/75138459/mitigating-xss-attacks-in-react-applications). Additionally, you can also use a [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) to mitigate XSS attacks. For more information on the usage of CSP in React, refer to [this article](https://stackoverflow.com/collectives/wso2/articles/75138459/mitigating-xss-attacks-in-react-applications).

- Needs to be explicitly deleted from the browser. Does not lose on browser tab closing.

---
---
## Using the `form_post` response mode

When the `responseMode` is set to `form_post`, the authorization code is sent in the body of a `POST` request as opposed to in the URL. So, the Single Page Application should have a backend to receive the authorization code and send it back to the Single Page Application.

>**Warning**
>The backend can then inject the authorization code into a JavaScript variable while rendering the webpage in the server side. But this results in the authorization code getting >printed in the HTML of the page creating a **threat vector**.

To address this issue, we recommend storing the authorization code in a server session variable and providing the Single Page Application a separate API endpoint to request the authorization code. The server, when the request is received, can then respond with the authorization code from the server session.

You can refer to a sample implementation using JSP [here](/samples/java-webapp).

---
---
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

| Attribute | Required/Optional | Type | Default Value | Description                                                                                                                                                                                                                                                                                                                                               |
| --------- | ----------------- | ---- | ------------- |-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `signInRedirectURL`          | Required          | `string`        | ""                                                                      | The URL to redirect to after the user authorizes the client app. eg: `https//localhost:3000/sign-in`                                                                                                                                                                                                                                                      |
| `signOutRedirectURL`         | Optional          | `string`        | The `signInRedirectURL` URL will be used if this value is not provided. | The URL to redirect to after the user                                                                                                                                                                                                                                                                                                                     | signs out. eg: `https://localhost:3000/dashboard`                                                                                                           |
| `clientHost`                 | Optional          | `string`        | The origin of the client app obtained using `window.origin`             | The hostname of the client app. eg: `https://localhost:3000`                                                                                                                                                                                                                                                                                              |
| `clientID`                   | Required          | `string`        | ""                                                                      | The client ID of the OIDC application hosted in the Asgardeo.                                                                                                                                                                                                                                                                                             |
| `clientSecret`               | Optional          | `string`        | ""                                                                      | The client secret of the OIDC application                                                                                                                                                                                                                                                                                                                 |
| `enablePKCE`                 | Optional          | `boolean`       | `true`                                                                  | Specifies if a PKCE should be sent with the request for the authorization code.                                                                                                                                                                                                                                                                           |
| `disableAutoSignIn` | Optional | `boolean` | `true` | Specifies if the SDK should try to sign in on app load using the browser storage approach. |
| `prompt`                     | Optional          | `string`        | ""                                                                      | Specifies the prompt type of an OIDC request                                                                                                                                                                                                                                                                                                              |
| `responseMode`               | Optional          | `ResponseMode`  | `"query"`                                                               | Specifies the response mode. The value can either be `query` or `form_post`                                                                                                                                                                                                                                                                               |
| `scope`                      | Optional          | `string[]`      | `["openid"]`                                                            | Specifies the requested scopes.                                                                                                                                                                                                                                                                                                                           |
| `baseUrl`               | Required  (If `wellKnownEndpoint` or `endpoints` is not provided)          | `string`        | ""                                                                      | The origin of the Identity Provider. eg: `https://www.asgardeo.io/t/<org_name>`                                                                                                                                                                                                                                                                           |
| `endpoints`                  | Optional (Required to provide all endpoints, if `wellKnownEndpoint` or `baseUrl` is not provided)          | `OIDCEndpoints` | [OIDC Endpoints Default Values](#oidc-endpoints)                        | The OIDC endpoint URLs. The SDK will try to obtain the endpoint URLS                                                                                                                                                                                                                                                                                      | using the `.well-known` endpoint. If this fails, the SDK will use these endpoint URLs. If this attribute is not set, then the default endpoint URLs will be | used. However, if the `overrideWellEndpointConfig` is set to `true`, then this will override the endpoints obtained from the `.well-known` endpoint. |
`wellKnownEndpoint`          | Optional          | `string`        | `"/oauth2/token/.well-known/openid-configuration"`                      | The URL of the `.well-known` endpoint.                                                                                                                                                                                                                                                                                                                    |
| `overrideWellEndpointConfig` | Optional          | `boolean`       | `false`                                                                 | If this option is set to `true`, then the `endpoints` object will override endpoints obtained                                                                                                                                                                                                                                                             | from the `.well-known` endpoint. If this is set to `false`, then this will be used as a fallback if the request to the `.well-known` endpoint fails.        |
| `validateIDToken`            | Optional          | `boolean`       | `true`                                                                  | Allows you to enable/disable JWT ID token validation after obtaining the ID token.                                                                                                                                                                                                                                                                        |
| `clockTolerance`             | Optional          | `number`        | `60`                                                                    | Allows you to configure the leeway when validating the id_token.                                                                                                                                                                                                                                                                                          |
| `skipRedirectCallback`       | Optional          | `boolean`        | `false`                                                                    | Stop listening to Auth param changes i.e `code` & `session_state` to trigger auto login.                                                                                                                                                                                                                                                                  |
| [`storage`](#storage) | Optional | `"sessionStorage"`, `"webWorker"`, `"localStorage"` | `"sessionStorage"` | The storage medium where the session information such as the access token should be stored.                                                                                                                                                                                                                                                               | |
| `resourceServerURLs` |Required if the `storage` is set to `webWorker` | `string[]` | `[]` | The URLs of the API endpoints. This is required if the storage method is set to `webWorker`. Additionally, when API calls are made through the [`httpRequest`](#httprequest) or the [`httpRequestAll`](#httprequestall) method, only the calls to the endpoints specified either in `baseURL` or in `resourceServerURLs` attributes will be allowed. Everything else will be denied. | |
|`requestTimeout` | Optional | `number`| 60000 (seconds) | Specifies in seconds how long a request to the web worker should wait before being timed out.                                                                                                                                                                                                                                                             |
| `disableTrySignInSilently` | Optional | `boolean` | `true` | Specifies if the SDK should try to sign in silently on mount using the iFrame. |
|`enableOIDCSessionManagement` |Optional|`boolean`| false | Flag to enable OIDC Session Management. Set this flag to `true` to add single logout capabilities to your application. |
| `periodicTokenRefresh` | Optional | `boolean` | `false` | Flag to enable periodic token refresh. Set this flag to `true` to enable the SDK to refresh the access token periodically. |

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
   |shouldEncodeToFormData|`boolean`|If set to `true`, the request body will be encoded to `FormData`. The body (specified by the `data` attribute) should be a Javascript object. |
---
---
## Other Links
- [README](/README.md)
- [Sample Apps](/SAMPLE_APPS.md)
