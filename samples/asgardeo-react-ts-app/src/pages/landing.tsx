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

import { useAuthContext, Hooks } from "@asgardeo/auth-react";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { DefaultLayout } from "../layouts/default";
import REACT_LOGO from "../images/react-logo.png";
import * as authConfig from "../config.json";
import { LogoutRequestDenied } from "../components/LogoutRequestDenied";
import { USER_DENIED_LOGOUT } from "../constants/errors";

const LandingPage: FunctionComponent<{}> = () => {
    const { signIn, signOut, state, on } = useAuthContext();
    const history = useHistory();

    const search = useLocation().search;
    const stateParam = new URLSearchParams(search).get('state');
    const errorDescParam = new URLSearchParams(search).get('error_description');

    const [ hasLogoutFailureError, setHasLogoutFailureError ] = useState<boolean>();

    useEffect(() => {
        if (state?.isAuthenticated) {
            history.push("/home");
        }
    }, [ state.isAuthenticated, history ]);

    useEffect(() => {
        if(stateParam && errorDescParam) {
            if(errorDescParam === "End User denied the logout request") {
                setHasLogoutFailureError(true);
            }
        }
    }, [stateParam, errorDescParam]);

    useEffect(() => {
        on(Hooks.SignOut, () => {
            setHasLogoutFailureError(false);
        });
    }, [ on ]);

    const handleLogin = () => {
        setHasLogoutFailureError(false);
        signIn();
    };

    const handleLogout = () => {
        signOut();
    };

    if (hasLogoutFailureError) {
        return (
            <LogoutRequestDenied
                errorMessage={USER_DENIED_LOGOUT}
                handleLogin={handleLogin}
                handleLogout={handleLogout}
            />
        );
    }

    return (
        <DefaultLayout>
            { authConfig.default.clientID === "" ?
                <div className="content">
                    <h2>You need to update the Client ID to proceed.</h2>
                    <p>Please open "src/config.json" file using an editor, and update the <code>clientID</code> value with the registered application's client ID.</p>
                    <p>Visit repo <a href="https://github.com/asgardeo/asgardeo-auth-react-sdk/tree/master/samples/asgardeo-react-ts-app">README</a> for more details.</p>
                </div>
                :
                <>
                    <div className="home-image">
                        <img src={ REACT_LOGO } className="react-logo-image logo" />
                    </div>
                    <h4 className={ "spa-app-description" }>
                        Sample demo to showcase authentication for a Single Page Application
                        via the OpenID Connect Authorization Code flow,
                        which is integrated using the&nbsp;
                        <a href="https://github.com/asgardeo/asgardeo-auth-react-sdk" target="_blank">
                            Asgardeo Auth React SDK
                        </a>.
                    </h4>
                    <button
                        className="btn primary"
                        onClick={ () => {
                            signIn();
                        } }
                    >
                        Login
                    </button>
                </>
            }
        </DefaultLayout>
    );
};

export default LandingPage;
