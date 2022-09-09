/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com) All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

/**
 * Decoded ID Token Response component Prop types interface.
 */
interface ApiResponsePropsInterface {
  response: any;
}

/**
 * Displays the derived Authentication Response from the SDK.
 *
 * @param {AuthenticationResponsePropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const ApiResponse: FunctionComponent<
  ApiResponsePropsInterface
> = (props: ApiResponsePropsInterface): ReactElement => {
  const { response } = props;

  return (
    <>
      <h2>API Response</h2>
      <h4 className="sub-title">
        Derived by the&nbsp;
        <code className="inline-code-block">Choreo hosted API endpoint</code>
      </h4>
      <div className="json">
        <ReactJson
          src={response}
          name={null}
          enableClipboard={false}
          displayObjectSize={false}
          displayDataTypes={false}
          iconStyle="square"
          theme="monokai"
        />
      </div>
    </>
  );
};
