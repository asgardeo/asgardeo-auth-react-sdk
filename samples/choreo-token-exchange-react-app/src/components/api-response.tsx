/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
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

import React, { FunctionComponent, ReactElement } from "react";
import ReactJson from "react-json-view";

interface APIResponsePropsInterface {
    response?: any;
}

/**
 * Displays the API Response from the provided endpoint.
 *
 * @param {APIResponsePropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const APIResponse: FunctionComponent<APIResponsePropsInterface> = (
    props: APIResponsePropsInterface
): ReactElement => {

    const { response } = props;

    return (
        <>
            <h2>API Response</h2>
            <div className="json">
                {/* @ts-ignore */}
                <ReactJson
                    src={ response }
                    name={ null }
                    enableClipboard={ false }
                    displayObjectSize={ false }
                    displayDataTypes={ false }
                    iconStyle="square"
                    theme="monokai"
                />
            </div>
        </>
    );
};
