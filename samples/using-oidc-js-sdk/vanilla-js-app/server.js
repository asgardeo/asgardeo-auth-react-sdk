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

const express = require("express");
const path = require("path");
const RateLimit = require("express-rate-limit");

// Set up rate limiter: maximum of five requests per minute
const limiter = new RateLimit({
    windowMs: 1*60*1000, // 1 minute
    max: 5
});

const app = express();

// Apply rate limiter to all requests
app.use(limiter);

// Set app listening port
app.listen(3000, () => {
    console.log("Server listening on 3000");
});

app.use(express.static(path.resolve(__dirname, "node_modules/@asgardio/oidc-js/umd")));

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "index.html"));
});
