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

import React, { ReactElement, FunctionComponent, useState, useEffect } from "react";
import { SIGN_OUT, SIGN_IN } from "../constants";
import { useHistory } from "react-router-dom";
import { IdentityClient, Hooks } from '@asgardio/oidc-js';
import { useRecoilState } from "recoil";
import { authState, displayName } from "../recoil";

export const Dashboard: FunctionComponent<null> = (): ReactElement => {
    const history = useHistory();
    const auth = IdentityClient.getInstance();
    const serverOrigin = "https://localhost:9443";
    const clientHost = "http://localhost:3000";

    const [ email, setEmail ] = useState("");
    const [ lastName, setLastName ] = useState("");
    const [ roles, setRoles ] = useState("");

    const [ isAuth ] = useRecoilState(authState);
    const [ displayNameState ] = useRecoilState(displayName);
    const [ isLoggedOut, setIsLoggedOut ] = useState(false);

    useEffect(() => {
        auth.on(Hooks.SignOut, () => {
            setIsLoggedOut(true);
        });
    }, [auth]);

    return <div className="wrapper">
        <div className="menu">
            <button onClick={ () => {
                if (isAuth) {
                    alert("You have already signed in!");
                } else {
                    setIsLoggedOut(false);
                    history.push(SIGN_IN);
                }
            } }>
                Sign In
            </button>

            <button onClick={ () => {
                if (isAuth) {
                    history.push(SIGN_OUT);
                } else {
                    alert("You haven't signed in!");
                }
            }
            }>
                Sign Out
            </button>

            <button onClick={ () => {
                if (isAuth) {
                    auth.httpRequest({
                        url: serverOrigin + "/api/identity/user/v1.0/me",
                        method: "GET",
                        headers: {
                            "Access-Control-Allow-Origin": clientHost,
                            Accept: "application/json"
                        }
                    }).then((response) => {
                        setEmail(response.data.basic[ "http://wso2.org/claims/emailaddress" ]);
                        setLastName(response.data.basic[ "http://wso2.org/claims/lastname" ]);
                        setRoles(response.data.basic[ "http://wso2.org/claims/role" ]);
                    });
                } else {
                    alert("Please sign in first!");
                }
            } }>Get user info</button>
        </div>
        <div id="greeting">
            { isAuth && "Hi, " + displayNameState + "!" }
            { isLoggedOut && "You have logged out!" }
        </div>
        <div className="details">
            <div id="email">
                {
                    email && "Email: " + email
                }
            </div>
            <div id="lastName">
                {
                    lastName && "Last Name: " + lastName
                }
            </div>
            <div id="roles">
                {
                    roles && "Roles: " + roles
                }
            </div>
        </div>
    </div>;
};
