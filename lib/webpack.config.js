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

const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");

// Name of the UMD bundle.
const LIBRARY_NAME = "AsgardeoAuth";

// Flag to enable source maps in production.
const IS_SOURCE_MAPS_ENABLED_IN_PRODUCTION = false;

module.exports = (env) => {

    // Build Environments.
    const isProduction = env.NODE_ENV === "production";
    const isDevelopment = env.NODE_ENV === "development";

    return {
        devtool: isProduction
            ? IS_SOURCE_MAPS_ENABLED_IN_PRODUCTION
                ? "source-map"
                : false
            : isDevelopment && "eval-cheap-module-source-map",
        entry: "./src/index.ts",
        externals: [
            {
                "react": {
                    commonjs: "react",
                    commonjs2: "react",
                    root: "React",
                    umd: "react"
                },
                "react-dom": {
                    commonjs: "react-dom",
                    commonjs2: "react-dom",
                    root: "ReactDOM",
                    umd: "react-dom"
                },
                "react-router-dom": {
                    commonjs: "react-router-dom",
                    commonjs2: "react-router-dom",
                    root: "ReactRouter",
                    umd: "react-router-dom"
                }
            }
        ],
        mode: isProduction ? "production" : "development",
        module: {
            rules: [
                {
                    test: /\.worker\.ts$/,
                    use: {
                        loader: "worker-loader",
                        options: {
                            inline: true
                        }
                    }
                },
                {
                    exclude: /(node_modules|dist)/,
                    test: /\.(tsx|jsx|ts|js)?$/,
                    use: "babel-loader"
                }
            ]
        },
        output: {
            filename: "main.js",
            globalObject: "this",
            library: LIBRARY_NAME,
            libraryTarget: "umd",
            path: path.resolve(__dirname, "dist")
        },
        plugins: [ new ESLintPlugin()],
        resolve: {
            extensions: [".tsx", ".ts", ".js"]
        }
    };
};
