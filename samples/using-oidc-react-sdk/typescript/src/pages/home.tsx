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

import { useAuthContext } from "@asgardeo/oidc-react";
import React, { FunctionComponent } from "react";
import { DefaultLayout } from "../layouts/default";

const HomePage: FunctionComponent<{}> = () => {
    const { state, signOut } = useAuthContext();

    return (
        <DefaultLayout>
            <h3>Below are the basic details retrieves from the server on a successful login.</h3>
            <div>
                <ul className="details">
                    <li><b>Name:</b> { state.displayName }</li>
                    <li><b>Username:</b> { state.username }</li>
                    <li><b>Email:</b> { state.email }</li>
                </ul>
            </div>
            <button className="btn primary" onClick={() => { signOut() }}>Logout</button>
        </DefaultLayout>
    );
};

export default HomePage;
