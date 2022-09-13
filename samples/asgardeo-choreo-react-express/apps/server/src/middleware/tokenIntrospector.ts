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

import fetch from "node-fetch";
import { getData, putData } from "../storage/session";
import { extractAccessToken } from "../utils/token-utils";

const tokenIntrospector = async function (req, res, next) {

  let tokensList = await getData("asgardeoAccessTokens");
  
  const asgardeoAccessToken = extractAccessToken(req, res);

  if (!asgardeoAccessToken) {
    res.status(403).json({ error: "No credentials sent!" });
    return;
  }

  if ((tokensList && Array.isArray(tokensList) && tokensList.includes(asgardeoAccessToken))) {
    req.isExchangeNeeded = false;
    return next();
  }

  const requestOptions = {
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      accept: "application/json",
      Authorization: `Basic ${Buffer.from(
        `${process.env.ASGARDEO_CLIENT_ID}:${process.env.ASGARDEO_CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    method: "POST",
  };

  const tokenExchangeResponse = await fetch(
    `${process.env.ASGARDEO_BASE_URL}/oauth2/introspect?token=${asgardeoAccessToken}`,
    requestOptions
  );

  if (!tokenExchangeResponse.ok) {
    throw new Error("Failed introspecting token");
  }

  const responseBody = await tokenExchangeResponse.json();

  if (!(responseBody as any)?.active) {
    // Client should try refreshing the token
    res.status(401).send("Invalid Access Token");
    return;
  }

  tokensList = await getData("asgardeoAccessTokens") ?? [];
  tokensList.push(asgardeoAccessToken);
  await putData("asgardeoAccessTokens", tokensList);

  req.isExchangeNeeded = true;

  next();
};

export default tokenIntrospector;
