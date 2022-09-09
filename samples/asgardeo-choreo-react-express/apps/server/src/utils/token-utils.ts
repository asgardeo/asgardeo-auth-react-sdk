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

export const extractAccessToken = (req, res) => {
  if (
    !req?.headers?.authorization ||
    !req.headers.authorization.split(" ")[1]
  ) {
    return null;
  }
  const bearerToken = req.headers.authorization.split(" ");
  const asgardeoAccessToken =
    bearerToken.length > 1 ? bearerToken[1] : bearerToken[0];

  if (asgardeoAccessToken) {
    return asgardeoAccessToken;
  } else {
    return null;
  }
};
