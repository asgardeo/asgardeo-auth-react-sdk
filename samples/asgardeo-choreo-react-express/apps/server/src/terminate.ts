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

import winston from "winston";

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logfile.log' })
  ]
});

// Reference: https://blog.heroku.com/best-practices-nodejs-errors
const terminate = (server, options = { coredump: false, timeout: 500 }) => {
  // Exit function
  const exit = (code) => {
    if (options.coredump) {
      process.abort();
    } else {
      process.exit(code);
    }
  };

  return (code, reason) => (err) => {
    logger.info(`Barker Terminating due to ${reason}`);

    if (err && err instanceof Error) {
      logger.error("Terminating due to error", err);
    }

    // Attempt a graceful shutdown
    server.close(() => {
      exit(code);
    });
    // If server hasn't finished in timeout, shut down process
    setTimeout(() => {
      process.exit(code);
    }, options.timeout).unref(); // Prevents the timeout from registering on event loop
  };
};

export default terminate;
