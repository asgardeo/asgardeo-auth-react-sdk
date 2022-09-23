# Try Out the Sample Apps

Follow this guide to try out the sample app curated by Asgardeo. If you want to integrate Asgardeo for your own app, follow [this guide](/README.md#getting-started).


## Table of Content

-   [Create an Application in Asgardeo](#create-an-application-in-asgardeo)
-   [Running the sample apps](#running-the-sample-apps)
-   [Change the Application's Development Server Port](#change-the-applications-development-server-port)
-   [Other Links](#other-links)


## Create an Application in Asgardeo

Before trying out the sample apps, you need to create an application in **Asgardeo**.

1. Navigate to [**Asgardeo Console**](https://console.asgardeo.io/login) and click on **Applications** under **Develop** tab

2. Click on **New Application** and then **Single Page Application**.

3. Enter any name you prefer as the name of the app

4. Add the redirect URL(s). The redirect URL usually is the URL in which your React application is hosted. For local environments, it will be something like `https://localhost:3000`. This will be used as a configuration in [Running the sample apps](#2-running-the-sample-apps) section.<img width="1439" alt="Screenshot 2022-09-14 at 17 26 57" src="https://user-images.githubusercontent.com/42619922/190148189-bb933d6b-2f8e-41e7-8c42-9d67e6746d17.png">

4. Click on Register. You will be navigated to management page of the sample application. In the **Quick Start** tab, select **React** as the preferred technology.

5. Since we are using sample app, select **Try out a sample** option and follow the guide.

## Running the sample apps

1. In the Quick Start guide, download the sample React application from the given link in the Asgardeo Console.

2. Update configuration file `src/config.json` with your registered app details.

```json
{
    "clientID": "",
    "baseUrl": "https://api.asgardeo.io/t/<org_name>",
    "signInRedirectURL": "https://localhost:3000",
    "signOutRedirectURL": "https://localhost:3000",
    "scope": [ "openid","profile" ]
}
```
| Attribute             | Description                                                                        |
| --------------------- | ---------------------------------------------------------------------------------- |
| `"clientID"`         | The Client ID of your OIDC app. |
| `"baseUrl"`              | The Asgardeo server's host name along with your organization name.                          |
| `"signInRedirectURL"` | The URL which the sample app redirects to after user login. |
| `"signOutRedirectURL"`            | The URL which the sample app redirects to after user logout                     |
| `"scope"`             | The list of OIDC scopes that are used for requesting user information. The `openid` scope is mandatory to get the ID token. You can add other OIDC scopes such as `profile` and `email`.                           |

3. Build and deploy the apps by running the following command at the root directory.

```bash
npm install && npm start
```

4. Navigate to [`https://localhost:3000`](https://localhost:3000) (or whichever the URL you have hosted the sample app).

## Change the Application's Development Server Port

By default, the development server runs on port `3000`. Incase if you wish to change this to something else, 
follow the steps below.

1. Update the `PORT` in [.env](.env) file in the app root.
2. Update the `signInRedirectURL` & `signOutRedirectURL` in [src/config.json](./src/config.json)
3. Go to the Asgardeo Console and navigate to the protocol tab of your application:
    - Update the Authorized Redirect URL.
    - Update the Allowed Origins.

## Other Links

- Download the Sample: [samples/asgardeo-react-app](https://github.com/asgardeo/asgardeo-auth-react-sdk/releases/latest/download/asgardeo-react-app.zip)

- Find More Info: 
  - [README](/README.md)
  - [APIs](/API.md)

- **Redirect URL(s):**
  - `https://localhost:3000`
