/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

require("dotenv").config();
const chalk = require("chalk");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const { findPort } = require("dev-server-ports");

const PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = "localhost";

const PORT_IN_USE_PROMPT = `${ chalk.blue("Be sure to update the following configurations if you proceed with the port change.") }

    1. Update the ${ chalk.bgBlack("PORT") } in ${ chalk.bgBlack(".env") } file in the app root.
    2. Update the signInRedirectURL & signOutRedirectURL in ${ chalk.bgBlack("src/config.json") }.
    3. Go to the Asgardeo console and navigate to the protocol tab of your application:
        - Update the Authorized Redirect URL.
        - Update the Allowed Origins.
`;

module.exports = {
    devServer: {
        contentBase: path.resolve(__dirname, "dist"),
        historyApiFallback: true,
        https: true,
        host: HOST,
        inline: true,
        port: findPort(PORT, HOST, false, {
            extensions: {
                BEFORE_getProcessTerminationMessage: () => {
                  return PORT_IN_USE_PROMPT;
                }
            }
        })
    },
    devtool: "source-map",
    entry: ["./src/app.tsx"],
    module: {
        rules: [
            {
                test: /\.(tsx|ts|js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|jpg|cur|gif|eot|ttf|woff|woff2)$/,
                use: ["url-loader"]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            },
            {
                test: /\.js$/,
                enforce: "pre",
                use: ["source-map-loader"],
            }
        ]
    },
    node: {
        fs: "empty"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        })
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".json"]
    }
};
