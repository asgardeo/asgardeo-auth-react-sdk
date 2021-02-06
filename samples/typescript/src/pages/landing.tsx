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

import { useAuthContext } from "@asgardeo/auth-react";
import React, { FunctionComponent, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { DefaultLayout } from "../layouts/default";
import REACT_LOGO from "../images/react-logo.png";
import JS_LOGO from "../images/js-logo.png";

const LandingPage: FunctionComponent<{}> = () => {
    const { signIn, state } = useAuthContext();
    const history = useHistory();

    useEffect(() => {
        if (state?.isAuthenticated) {
            history.push("/home");
        }
    }, [ state.isAuthenticated, history ]);

    return (
        <DefaultLayout>
            <div className="home-image">
                <img src={ JS_LOGO } className="js-logo-image logo" />
                <span className="logo-plus">+</span>
                <img src={ REACT_LOGO } className="react-logo-image logo" />
            </div>
            <h3>
                Sample demo to showcase how to authenticate a simple client side application using
                <br />
                <b>Asgardeo</b> with the{ " " }
                <a href="https://github.com/asgardeo/asgardeo-auth-react-sdk" target="_blank">
                    Asgardeo Auth React SDK
                </a>
            </h3>
            <button
                className="btn primary"
                onClick={ () => {
                    signIn();
                } }
            >
                Login
            </button>
        </DefaultLayout>
    );
};

export default LandingPage;
