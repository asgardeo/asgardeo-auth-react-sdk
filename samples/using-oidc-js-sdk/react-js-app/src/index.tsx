/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { IdentityClient, Storage } from "@asgardio/oidc-js";
import "./index.css";

const auth = IdentityClient.getInstance();
const serverOrigin = "https://localhost:9443";
const clientHost = "http://localhost:3000";

// Initialize the client
auth.initialize({
    baseUrls: [ serverOrigin ],
    signInRedirectURL: clientHost + "/sign-in",
    signOutRedirectURL: clientHost + "/dashboard",
    clientHost: clientHost,
    clientID: "client-id",
    enablePKCE: true,
    serverOrigin: serverOrigin,
    storage: Storage.WebWorker
});

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
