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

import React, { FunctionComponent } from "react";
import { RecoilRoot } from "recoil";
import { BrowserRouter, Switch, Redirect, Route } from "react-router-dom";
import { DASHBOARD } from "./constants";
import { routes, ProtectedRoute } from "./configs";
import { Route as RouteInterface } from "./models";
function App() {
    return (
        <RecoilRoot>
            <BrowserRouter>
                <Switch>
                    { routes.map((route: RouteInterface, index: number) => {
                        if (route.protected) {
                            return (
                                <ProtectedRoute
                                    path={ route.path }
                                    component={ route.component }
                                    exact={ true }
                                    key={ index }
                                />
                            );
                        } else {
                            return (
                                <Route
                                    key={ index }
                                    path={ route.path }
                                    component={ route.component as FunctionComponent }
                                    exact={ true }
                                />
                            );
                        }
                    }) }
                    <Redirect to={ DASHBOARD } path="*" />
                </Switch>
            </BrowserRouter>
        </RecoilRoot>
    );
}

export default App;
