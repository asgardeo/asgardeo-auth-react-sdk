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
import { extractAccessToken } from "../utils/token-utils";

const GRANT_TYPE = "urn:ietf:params:oauth:grant-type:token-exchange";
const REQUESTED_TOKEN_TYPE = "urn:ietf:params:oauth:token-type:jwt";
const SUBJECT_TOKEN_TYPE = "urn:ietf:params:oauth:token-type:jwt";

const tokenHandler = async function (req, res, next) {
  const asgardeoAccessToken = extractAccessToken(req, res);

  if(!asgardeoAccessToken) {
    return res.status(403).json({ error: "No credentials sent!" });
  }

  if(!req.isExchangeNeeded && (req?.session as any).choreoAccessToken) {
    return next();
  }

  const exchangeGrantData = {
    client_id: process.env.CHOREO_CONSUMER_KEY,
    orgHandle: process.env.CHOREO_ORGANIZATION,
    grant_type: GRANT_TYPE,
    requested_token_type: REQUESTED_TOKEN_TYPE,
    subject_token: asgardeoAccessToken,
    subject_token_type: SUBJECT_TOKEN_TYPE,
  };

  const formBody: string[] = [];

  for (const property in exchangeGrantData) {
    const encodedKey: string = encodeURIComponent(property);
    const encodedValue: string = encodeURIComponent(
      exchangeGrantData[property]
    );
    formBody.push(`${encodedKey}=${encodedValue}`);
  }

  const requestOptions = {
    body: formBody.join("&"),
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      authorization: `Bearer ${asgardeoAccessToken}`,
    },
    method: "POST",
    mode: "cors",
  };

  const tokenExchangeResponse = await fetch(
    process.env.CHOREO_TOKEN_ENDPOINT,
    requestOptions
  );

  if (!tokenExchangeResponse.ok) {
    res.status(500).send("Failed exchanging token");
    return;
  }

  const responseBody = await tokenExchangeResponse.json();

  if(!(responseBody as any)?.access_token) {
    res.status(500).send("Something went wrong exchanging token");
    return;
  }

  /**
   * Store choreo access token if the exchange is successful
   * 
   * The idea of using this encrypted cookie session to reduced unwanted exchange requests.
   */
  req.session.choreoAccessToken = (responseBody as any)?.access_token;
  await req.session.save();

  next();
};

export default tokenHandler;
