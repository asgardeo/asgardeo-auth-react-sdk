# OIDC JS SDK Usage samples

These are some examples how to use the OIDC JS SDK to integrate with asgardeo / WSO2 Identity Server.

1. [`vanilla-js-app`](/using-oidc-js-sdk/vanilla-js-app)
2. [`react-js-app`](/using-oidc-js-sdk/react-js-app)
3. [`java-webapp`](/using-oidc-js-sdk/java-webapp)

## Try Out the Sample Apps

### 1. Create a Service Provider

Before trying out the sample apps, you need to a create a service provider in the Identity Server.
1. So, navigate to `https://localhost:9443/carbon" and click on `Add` under `Service Providers` in the left-hand menu panel.

2. Enter `Sample` as the name of the app and click on `Register`.

3. Then, expand the `Inbound Authentication Configuration` section. Under that, expand `OAuth/OpenID Connect Configuration` section and click on `Configure`.

4. Under `Allowed Grant Types` uncheck everything except `Code` and `Refresh Token`.

5. Enter the Callback URL(s). You can find the relevant callback URL(s) of each sample app in the [Running the sample apps](#2.-running-the-sample-apps) section.

6. Check `Allow authentication without the client secret`.

7. Click `Add` at the bottom.

8. Copy the `OAuth Client Key`.

9. Enable CORS for the client application by following this guide (https://is.docs.wso2.com/en/5.11.0/learn/cors/).

### 2. Running the sample apps

Build the apps by running the following command at the root directory.
```
npm run build
```

#### 1. Vanilla JavaScript Sample

The *Callback URL* of this app is `http://localhost:3000`.

You can try out the Vanilla JavaScript Sample App from the [samples/vanilla-js-app](samples/vanilla-js-app). The instructions to run the app can  be found [here](/samples/vanilla-js-app/README.md)

#### 2. React Sample

The *Callback URL* of this app is `regexp=(http://localhost:3000/sign-in|http://localhost:3000/dashboard)`.

You can try out the React Sample App from the [samples/react-js-app](samples/react-js-app). The instructions to run the app can  be found [here](/samples/react-js-app/README.md)

#### 2. Java Webapp Sample

The *Callback URL* of this app is the URL of this app on the server. For instance, if your Tomcat server is running on `http://localhost:8080`, then the callback URL will be `http://localhost:8080/java-webapp`.

You can try out the Java Webapp Sample App from the [samples/java-webapp](samples/java-webapp). The instructions to run the app can  be found [here](/samples/java-webapp/README.md)
