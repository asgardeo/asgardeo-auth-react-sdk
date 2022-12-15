# Asgardeo Auth React SDK

![Builder](https://github.com/asgardeo/asgardeo-auth-react-sdk/workflows/Builder/badge.svg)
[![Stackoverflow](https://img.shields.io/badge/Ask%20for%20help%20on-Stackoverflow-orange)](https://stackoverflow.com/questions/tagged/wso2is)
[![Join the chat at https://discord.gg/wso2](https://img.shields.io/badge/Join%20us%20on-Discord-%23e01563.svg)](https://discord.gg/wso2)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/wso2/product-is/blob/master/LICENSE)
[![Twitter](https://img.shields.io/twitter/follow/wso2.svg?style=social&label=Follow)](https://twitter.com/intent/follow?screen_name=wso2)

---

## Table of Content

-   [Introduction](#introduction)
-   [Prerequisite](#prerequisite)
-   [Getting Started](#getting-started)
-   [Sample Apps](#sample-apps)
-   [Using APIs](#using-apis)
    - [Best practices when using APIs](#best-practices-when-using-apis)
    - [`useAuthContext()` hook](#useauthcontext-hook)
    - [Add a Login/Logout Button](#add-a-loginlogout-button)
    - [Show Authenticated User's Information](#show-authenticated-users-information)
    - [Add Routing](#add-routing)
    - [API Documentation](#api-documentation)
-   [Develop](#develop)
-   [Contribute](#contribute)
-   [License](#license)

## Introduction

Asgardeo Auth React SDK  allows React applications to use OIDC or OAuth2 authentication with Asgardeo as the Identity Provider. The SDK supports following capabilities
-   [Authenticate users](#add-a-loginlogout-button)
-   [Show Authenticated User's Information](#show-authenticated-users-information)
-   [Retrieve Additional User Information](/API.md#getbasicuserinfo)
-   [Secure Routes](/API.md#1-secureroute)
-   [Secure Components](/API.md#3-authenticatedcomponent)
-   [Send HTTP Requests to Asgardeo](/API.md#httprequest)
-   [Silent Sign In](/API.md#trysigninsilently)

## Prerequisite

Create an organization in Asgardeo if you don't already have one. The organization name you choose will be referred to as `<org_name>` throughout this document.


## Getting Started

Follow this guide to integrate Asgardeo to your own React Application. To try out the sample apps, use [this guide](/SAMPLE_APPS.md).

### 1. Installing the Package

Run the following command to install `@asgardeo/auth-react` & `react-router-dom` from the npm registry.
```
npm install @asgardeo/auth-react react-router-dom --save
```
> **Note**
> The `react-router-dom` package is a peer-dependency of the SDK and it is required to be installed for the SDK to work. We are working on making it optional.

### 2. Import `AuthProvider` and Provide Configuration Parameters

Asgardeo React SDK exposes the `AuthProvider` component, which helps you easily integrate Asgardeo to your application.

First, import the `AuthProvider` component from `@asgardeo/auth-react.`

```TypeScript
import { AuthProvider } from "@asgardeo/auth-react";
```
Then, wrap your root component with the `AuthProvider`.

```TypeScript
import React from "react";
import { AuthProvider } from "@asgardeo/auth-react";

const config = {
     signInRedirectURL: "https://localhost:3000/sign-in",
     signOutRedirectURL: "https://localhost:3000/dashboard",
     clientID: "client ID",
     baseUrl: "https://api.asgardeo.io/t/<org_name>",
     scope: [ "openid","profile" ]
};

export const MyApp = (): ReactElement => {
    return (
        <AuthProvider config={ config }>
            <App />
        </AuthProvider>
    )
}
```

## Sample Apps

Sample React Apps offered by Asgardeo will allow you to take Asgardeo for a spin without having to setup your own application. You can see [how to setup sample apps here](/SAMPLE_APPS.md).

## Using APIs

### Best practices when using APIs

Asgardeo Auth React SDK is built on top of Asgardeo Auth SPA SDK. Hence, almost all the usable APIs from Auth SPA SDK are re-exported from Asgardeo Auth React SDK.

- The only SDK that should be listed in the app dependencies is `@asgardeo/auth-react`.
- Always try to import APIs from `@asgardeo/auth-react`.

>**Warning**
>IDE or Editor auto import may sometimes import certain APIs from `@asgardeo/auth-spa`, change them back manually.


#### When importing a component from React SDK:

##### DO ✅
```TypeScript
import { AsgardeoSPAClient } from "@asgardeo/auth-react";
```

#### When including React SDK as a dependency:

##### DO ✅
```
// In package.json

dependencies: {
    "@asgardeo/auth-react": "1.1.18"
}
```

---
### `useAuthContext()` hook
The `useAuthContext()` hook provided by the SDK could be used to access the session state that contains information such as the email address of the authenticated user and the methods that are required for implementing authentication.

Import the `useAuthContext()` hook from `@asgardeo/auth-react`.
```Typescript
import { useAuthContext } from "@asgardeo/auth-react";
```

And then inside your components, you can access the context as follows
```Typescript
const { state, signIn, signOut } = useAuthContext();
```
---
### Add a Login/Logout Button

We can use the `signIn()` method from `useAuthContext()` to easily implement a **login button**.
```Typescript
<button onClick={ () => signIn() }>Login</button>
```

Similarly to the above step, we can use the `signOut()` method from `useAuthContext()` to implement a **logout button**.
```Typescript
<button onClick={() => signOut()}>Logout</button>
```
Clicking on **Login button** will take the user to Asgardeo login page. Upon successful `signIn()`, the user will be redirected to the app (based on the specified `signInRedirectURL`) and the `state.isAuthenticated` will be set to `true`.

Clicking on **Logout button** will sign out the user and will be redirected to `signOutRedirectURL` and the `state.isAuthenticated` will be set to `false`. 

You can use the `state.isAuthenticated` attribute to check the authenticated status of the user.

---
###  Show Authenticated User's Information

The following code snippet demonstrates the usage of the `state` object, together with `signIn()` and `signOut()` methods from the context.
```Typescript
import React from "react";
import { useAuthContext } from "@asgardeo/auth-react";

function App() {

  const { state, signIn, signOut } = useAuthContext();

  return (
    <div className="App">
      {
        state.isAuthenticated
          ? (
            <div>
              <ul>
                <li>{state.username}</li>
              </ul>

              <button onClick={() => signOut()}>Logout</button>
            </div>
          )
          : <button onClick={() => signIn()}>Login</button>
      }
    </div>
  );
}

export default App;
```
---
### Add Routing

If your application needs routing, the SDK provides a multiple approaches to secure routes in your application. You can read more about [routing capabilities in Asgardeo here](/API.md#securing-routes-with-asgardeo).

---
### API Documentation

Additionally to above, Asgardeo offers a wide range of APIs that you can use to integrate and make use of Asgardeo within your React Application. You can refer to a [detailed API documentation here](/API.md).

## Develop

### Prerequisites

-   `Node.js` (version 10 or above).
-   `yarn` package manager.

### Installing Dependencies

The repository is a mono repository. The SDK repository is found in the [lib](/lib/) directory. You can install the dependencies by running the following command at the root.

```bash
yarn build
```

## Contribute

Please read [Contributing to the Code Base](http://wso2.github.io/) for details on our code of conduct, and the process for submitting pull requests to us.

### Reporting issues

We encourage you to report issues, improvements, and feature requests creating [Github Issues](https://github.com/asgardeo/asgardeo-auth-react-sdk/issues).

Important: And please be advised that security issues must be reported to security@wso2com, not as GitHub issues, in order to reach the proper audience. We strongly advise following the WSO2 Security Vulnerability Reporting Guidelines when reporting the security issues.

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.
