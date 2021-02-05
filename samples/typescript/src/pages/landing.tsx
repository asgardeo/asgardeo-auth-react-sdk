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
import React, { FunctionComponent } from "react";
import { DefaultLayout } from "../layouts/default";

const LandingPage: FunctionComponent<{}> = () => {
    const { signIn } = useAuthContext();

    return (
        <DefaultLayout>
            <h3>
                Sample demo to showcase how to authenticate a simple client side application using&nbsp;
                <b>Asgardeo</b> with the&nbsp;
                <a href="https://github.com/wso2-extensions/identity-sdks-js/tree/master/identity-oidc-js"
                    target="_blank">Asgardeo Auth React SDK</a>
            </h3>
            <button className="btn primary" onClick={() => { signIn() }}>Login</button>
        </DefaultLayout>
    );
};

export default LandingPage;
