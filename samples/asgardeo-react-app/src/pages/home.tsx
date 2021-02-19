/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import React, { FunctionComponent, useEffect, useState } from "react";
import ReactJson from "react-json-view";
import { default as authConfig } from "../config.json";
import REACT_LOGO from "../images/react-logo.png";
import { DefaultLayout } from "../layouts/default";

export const HomePage: FunctionComponent<{}> = () => {

    const { state, signIn, signOut, getBasicUserInfo, getIDToken, getDecodedIDToken, on } = useAuthContext();
    const [authenticateState, setAuthenticateState] = useState(null);

    useEffect(() => {
        if (getIsInitLogin()) {
            signIn();
        }
    }, []);

    const getIsInitLogin = () => {
        if (sessionStorage.getItem("isInitLogin") === "true") {
            return true;
        }
        else {
            return false;
        }
    };

    const setIsInitLogin = (value: string) => {
        sessionStorage.setItem("isInitLogin", value)
    };

    const handleLogin = () => {
        setIsInitLogin("true");
        signIn();
    }

    const handleLogout = () => {
        signOut();
        setIsInitLogin("false");
    }

    useEffect(() => {
        if (state?.isAuthenticated) {
            const getData = async () => {
                const basicUserInfo = await getBasicUserInfo();
                const idToken = await getIDToken();
                const decodedIDToken = await getDecodedIDToken();

                const username = basicUserInfo?.username?.split("/");

                if (username.length >= 2) {
                    username.shift();
                    basicUserInfo.username = username.join("/");
                }

                const sub = decodedIDToken?.sub?.split("/");

                if (sub.length >= 2) {
                    sub.shift();
                    decodedIDToken.sub = sub.join("/");
                }

                const groups: string[] = [];
                decodedIDToken?.groups?.forEach((group: string) => {
                    const groupArrays = group.split("/");

                    if (groupArrays.length >= 2) {
                        groupArrays.shift();
                        groups.push(groupArrays.join("/"));
                    } else {
                        groups.push(group);
                    }
                });

                if (decodedIDToken?.groups) {
                    decodedIDToken.groups = groups;
                }

                const authState = {
                    authenticateResponse: basicUserInfo,
                    idToken: idToken.split("."),
                    decodedIdTokenHeader: JSON.parse(atob(idToken.split(".")[0])),
                    decodedIDTokenPayload: decodedIDToken
                };

                setAuthenticateState(authState);
            };
            getData();
        }
    }, [state.isAuthenticated]);

    return (
        <DefaultLayout>
            { authConfig.clientID === "" ?
                <div className="content">
                    <h2>You need to update the Client ID to proceed.</h2>
                    <p>Please open "src/config.json" file using an editor, and update the <code>clientID</code> value with the registered application's client ID.</p>
                    <p>Visit repo <a href="https://github.com/asgardeo/asgardeo-auth-react-sdk/tree/master/samples/asgardeo-react-app">README</a> for more details.</p>
                </div>

                :

                <div className="header-title">
                    <h1>
                        React SPA Authentication Sample <br /> (OIDC - Authorization Code Grant)
                        </h1>
                </div>
            }
            {state.isAuthenticated ?
                <div className="content">
                    <h2>Authentication response</h2>
                    <div className="json">
                        <ReactJson
                            src={authenticateState?.authenticateResponse}
                            name={null}
                            enableClipboard={false}
                            displayObjectSize={false}
                            displayDataTypes={false}
                            iconStyle="square"
                            theme="monokai"
                        />
                    </div>

                    <h2 className="mb-0 mt-4">ID token</h2>

                    <div className="row">
                        {authenticateState?.idToken && (
                            <div className="column">
                                <h5>
                                    <b>Encoded</b>
                                </h5>
                                <div className="code">
                                    <code>
                                        <span className="id-token-0">{authenticateState?.idToken[0]}</span>.
                                    <span className="id-token-1">{authenticateState?.idToken[1]}</span>.
                                    <span className="id-token-2">{authenticateState?.idToken[2]}</span>
                                    </code>
                                </div>
                            </div>
                        )}
                        <div className="column">
                            <div className="json">
                                <h5>
                                    <b>Decoded:</b> Header
                            </h5>
                                <ReactJson
                                    src={authenticateState?.decodedIdTokenHeader}
                                    name={null}
                                    enableClipboard={false}
                                    displayObjectSize={false}
                                    displayDataTypes={false}
                                    iconStyle="square"
                                    theme="monokai"
                                />
                            </div>

                            <div className="json">
                                <h5>
                                    <b>Decoded:</b> Payload
                            </h5>
                                <ReactJson
                                    src={authenticateState?.decodedIDTokenPayload}
                                    name={null}
                                    enableClipboard={false}
                                    displayObjectSize={false}
                                    displayDataTypes={false}
                                    iconStyle="square"
                                    theme="monokai"
                                />
                            </div>
                            <div className="json">
                                <h5>
                                    <b>Signature:</b>
                                </h5>
                                <div className="code">
                                    <code>
                                        HMACSHA256(
                                    <br />
                                    &nbsp;&nbsp;
                                    <span className="id-token-0">
                                            base64UrlEncode(
                                        <span className="id-token-1">header</span>)
                                    </span>{" "}
                                    + "." + <br />
                                    &nbsp;&nbsp;
                                    <span className="id-token-0">
                                            base64UrlEncode(
                                        <span className="id-token-1">payload</span>)
                                    </span>
                                    ,&nbsp;
                                    <span className="id-token-1">your-256-bit-secret</span> <br />
                                    );
                                </code>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        className="btn primary mt-4"
                        onClick={() => {
                            handleLogout();
                        }}
                    >
                        Logout
                </button>
                </div>
                :
                (getIsInitLogin())
                    ? (
                        <div className="content">Loading ...</div>
                    )
                    :
                    (
                        <>
                            <div className="content">
                                <div className="home-image">
                                    <img src={REACT_LOGO} className="react-logo-image logo" />
                                </div>
                                <h3>
                                    Sample demo to showcase how to authenticate a simple client side application using <br />
                                    <b>Asgardeo</b> with the{" "}
                                    <a href="https://github.com/asgardeo/asgardeo-auth-react-sdk" target="_blank">
                                        Asgardeo Auth React SDK </a>
                                </h3>
                                <button
                                    className="btn primary"
                                    onClick={() => {
                                        handleLogin();
                                    }}
                                >
                                    Login
                                </button>
                            </div>
                        </>
                    )
            }
        </DefaultLayout >
    );
};
