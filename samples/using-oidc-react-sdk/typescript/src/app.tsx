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

import { AuthProvider, SecureRoute } from "@asgardio/oidc-react/src/index";
import React, { FunctionComponent, ReactElement } from "react";
import { render } from "react-dom";
import { BrowserRouter, Route, Switch, useHistory, useLocation } from "react-router-dom";
import "./app.css";
import * as authConfig from "./config.json";
import LandingPage from "./pages/landing";
import HomePage from "./pages/home";
import NotFoundPage from "./pages/404";

const SecureRouteWithRedirect: FunctionComponent<{component: any, path: string}> = (props): ReactElement => {
    const { component, path } = props;

    const secureRouteErrorFallback = () => {
        let location = useLocation();
        let history = useHistory();
    
        if (location.pathname == "/404" || location.pathname == "/") {
            history.push("/home");
        }
    };

    return (<SecureRoute path={ path } component={ component } callback={ secureRouteErrorFallback() } />);
};

render(
    (
        <AuthProvider config={ authConfig.default }>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={ LandingPage } />
                    <SecureRouteWithRedirect path="/home" component={ HomePage } />
                    <Route component={ NotFoundPage } />
                </Switch>
            </BrowserRouter>
        </AuthProvider>
    ),
    document.getElementById("root")
);
