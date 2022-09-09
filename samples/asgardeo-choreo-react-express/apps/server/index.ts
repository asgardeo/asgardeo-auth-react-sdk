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

import express, { Express } from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import fetch from "node-fetch";
import { ironSession } from "iron-session/express";
import asyncHandler from "express-async-handler";
import errorHandler from "./src/middleware/errorHandler";
import tokenHandler from "./src/middleware/tokenHandler";
import tokenIntrospector from "./src/middleware/tokenIntrospector";
import terminate from "./src/terminate";
import { createCache } from "./src/storage/session";

(async function () {
  const app: Express = express();

  const session = ironSession({
    cookieName: "asgardeo/choreo/react-sample",
    password: process.env.SECRET_COOKIE_PASSWORD,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  });

  app.use(cookieParser());
  const PORT: string | number = process.env.NODE_PORT || 3001;

  const allowedOrigins = ["http://localhost:3000"];

  app.use(
    cors({
      credentials: true,
      origin: function (origin, callback) {
        // allow requests with no origin
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
          var msg =
            "The CORS policy for this site does not " +
            "allow access from the specified Origin.";
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
    })
  );

  app.use(express.json());

  await createCache();

  app.use(errorHandler);

  app.get(
    "/statistics",
    asyncHandler(session),
    asyncHandler(tokenIntrospector),
    asyncHandler(tokenHandler),
    asyncHandler(async (req, res) => {
      const token = (req?.session as any).choreoAccessToken;
      let response = null;

      try {
        response = await fetch(process.env.CHOREO_API_ENDPOINT, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        res.status(500).send({ error: "Error retrieving data" });
        return;
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        res.status(200).send({ data });
      } else {
        res.status(500).send({ error: "Error retrieving data" });
      }
    })
  );

  app.post(
    "/logout",
    asyncHandler(session),
    asyncHandler(async function (req, res) {
      req.session.destroy();
      res.sendStatus(200);
    })
  );

  const httpServer = app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  });

  // Add Terminate code
  const exitHandler = terminate(httpServer, {
    coredump: false,
    timeout: 500,
  });
  process.on("uncaughtException", exitHandler(1, "Unexpected Error"));
  process.on("unhandledRejection", exitHandler(1, "Unhandled Promise"));
  process.on("SIGTERM", exitHandler(0, "SIGTERM"));
  process.on("SIGINT", exitHandler(0, "SIGINT"));
})();
