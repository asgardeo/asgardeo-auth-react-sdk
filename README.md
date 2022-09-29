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
-   [API Documentation](#api-documentation)
-   [Sample Apps](#sample-apps)
-   [Contribute](#contribute)
-   [License](#license)

## Introduction

Asgardeo Auth React SDK for JavaScript allows React applications to use OIDC or OAuth2 authentication in a simple and secure way. By using Asgardeo and the Asgardeo Auth React SDK, developers will be able to add identity management to their React applications faster and securely.

To enable authentication for this sample, we are using Asgardeo as the Identity Provider.

## Prerequisite

Create an organization in Asgardeo if you don't already have one. The organization name you choose will be referred to as `<org_name>` throughout this document.


## Getting Started

Follow this guide to integrate Asgardeo to your own React Application. To try out the sample apps, use [this guide](/SAMPLE_APPS.md).

### 1. Installing the Package

Install `@asgardeo/auth-react` and `react-router-dom` from the npm registry.

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
     baseUrl: "https://api.asgardeo.io/t/<org_name>",
     scope: [ "openid","profile" ]
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
    const { signIn, state } = useAuthContext();
    const handleClick = (): void => {
        signIn()
            .then(() => {
                // handle successful sign-in
            })
            .catch(() =>{
                // handle errors of sign-in
            });
    }

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
                ) : <button onClick={() => signIn()}>Login</button>
            }
        </div>
    );
}
```

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

## API Documentation

Asgardeo offers a wide range of APIs that you can use to integrate and make use of Asgardeo within your React Application. You can refer to [API documentation here](/API.md).

## Sample Apps

Sample React Apps offered by Asgardeo will allow you to take Asgardeo for a spin without having to setup your own application. You can see [how to setup sample apps here](/SAMPLE_APPS.md).
## Contribute

Please read [Contributing to the Code Base](http://wso2.github.io/) for details on our code of conduct, and the process for submitting pull requests to us.

### Reporting issues

We encourage you to report issues, improvements, and feature requests creating [Github Issues](https://github.com/asgardeo/asgardeo-auth-react-sdk/issues).

Important: And please be advised that security issues must be reported to security@wso2com, not as GitHub issues, in order to reach the proper audience. We strongly advise following the WSO2 Security Vulnerability Reporting Guidelines when reporting the security issues.

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.
