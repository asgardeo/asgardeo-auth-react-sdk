# Asgardio Java Sample Web App
## Getting Started
Before getting started with running this app, make sure you have followed the instructions in the [Try Out the Sample Apps](../../README.md#try-out-the-sample-apps) section.


Open the [index.html](index.html) file. Scroll down to the `<script>` tag below the `body` where the app logic is written.

Paste the copied `OAuth Client Key` in front of the `clientID` attribute of `auth.initialize` method's argument object. You will be replacing a value called `client-id`.

Replace the `"client-host"` value of the `clientHost` attribute with the application's URL in the server.

```javascript
 // Initialize the client
auth.initialize({
    baseUrls: [ serverOrigin ],
    callbackURL: clientHost,
    clientHost: "client-host",
    clientID: "oNYe7ML9smdwuR5olarViTTL_iga",
    enablePKCE: true,
    serverOrigin: serverOrigin,
    storage: "webWorker",
    responseMode:"form_post",
    authorizationCode: response.data.authCode,
    sessionState:  response.data.sessionState
});
```

Copy the `java-webapp` directory to a tomcat server to run it.
