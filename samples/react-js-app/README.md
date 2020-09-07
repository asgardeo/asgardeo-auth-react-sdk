# Asgardio Vanilla JavaScript Sample App
## Getting Started
Before getting started with running this app, make sure you have followed the instructions in the [Try Out the Sample Apps](../../README.md#try-out-the-sample-apps) section.


Open the [index.tsx](src/index.tsx) file.

Paste the copied `OAuth Client Key` in front of the `clientID` attribute of `auth.initialize` method's argument object. You will be replacing a value called `client-id`.
```javascript
 // Initialize the client
auth.initialize({
    baseUrls: [ serverOrigin ],
    callbackURL: clientHost,
    clientHost: clientHost,
    clientID: "oNYe7ML9smdwuR5olarViTTL_iga",
    enablePKCE: true,
    serverOrigin: serverOrigin,
    storage: "webWorker"
});
```

Run the app by entering the following command
```
npm start
```
The app should open at `http://localhost:3000`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!
