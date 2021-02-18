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
import { DefaultLayout } from "../layouts/default";
import ReactJson from "react-json-view";

const HomePage: FunctionComponent<{}> = () => {
    const { state, signOut, getBasicUserInfo, getIDToken, getDecodedIDToken } = useAuthContext();
    const [authenticateState, setAuthenticateState] = useState(null);

    useEffect(() => {
        if (state?.isAuthenticated) {
            const getData = async () => {
                const basicUserInfo = await getBasicUserInfo();
                const idToken = await getIDToken();
                const decodedIDToken = await getDecodedIDToken();

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
            {state.isAuthenticated && (
                <>
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
                                    Signature
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
                            signOut();
                        }}
                    >
                        Logout
                    </button>
                </>
            )}
        </DefaultLayout>
    );
};

export default HomePage;
