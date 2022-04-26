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

import "core-js";
import "regenerator-runtime/runtime";

import { AuthProvider, AsgardeoAuthException, SecureRoute, useAuthContext } from "@asgardeo/auth-react";
import React, { FunctionComponent, ReactElement } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./app.css";
import * as authConfig from "./config.json";
import LandingPage from "./pages/landing";
import HomePage from "./pages/home";
import NotFoundPage from "./pages/404";

const SecureRouteWithRedirect: FunctionComponent<{component: any, path: string, exact: boolean}> = (props): ReactElement => {
    const { component, path } = props;
    const {signIn } = useAuthContext();

    const callback = () => {
        signIn();
    };

    return (<SecureRoute exact path={ path } component={ component } callback={ callback } />);
};

const AppContent: FunctionComponent = (): ReactElement => {
    const { error } = useAuthContext();

    const systemDateTimeError: string = error?.code === "JS-CRYPTO_UTILS-IVIT-IV02";
    
    {
        return systemDateTimeError
            ? <div>ERROR with system date</div>
            : (
                <Router>
                    <Switch>
                        <Route exact path="/" component={ LandingPage } />
                        <SecureRouteWithRedirect exact path="/home" component={ HomePage } />
                        <Route component={ NotFoundPage } />
                    </Switch>
                </Router>
            )
    }
};

const App = () => (
    <AuthProvider config={ authConfig.default }>
        <AppContent />
    </AuthProvider>
);

render((<App />), document.getElementById("root"));
