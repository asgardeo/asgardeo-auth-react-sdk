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
import FOOTER_LOGOS from "../images/footer.png";

export const DefaultLayout: FunctionComponent<{ children: any }> = (props) => {

    const { children } = props;

    return (
        <>
            <div className="container">
                <div className="header-title">
                    <h1>
                        React SPA Authentication Sample
                    </h1>
                </div>
                <div className="content">
                    { children }
                </div>
            </div>
            <img src={ FOOTER_LOGOS } className="footer-image" />
        </>
    );
};
