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

import {
    AuthClientConfig,
    BasicUserInfo,
    Config,
    CustomGrantConfig,
    DecodedIDTokenPayload,
    Hooks,
    HttpClientInstance,
    HttpRequestConfig,
    HttpResponse,
    OIDCEndpoints
} from "@asgardeo/auth-spa";

export interface AuthStateInterface {
    allowedScopes: string;
    displayName: string;
    email: string;
    isAuthenticated: boolean;
    username: string;
}

export interface AuthContextInterface {
    signIn: (callback?) => void;
    signOut: () => void;
    getBasicUserInfo(): Promise<BasicUserInfo>;
    httpRequest(config: HttpRequestConfig): Promise<HttpResponse<any>>;
    httpRequestAll(configs: HttpRequestConfig[]): Promise<HttpResponse<any>[]>;
    requestCustomGrant(
        config: CustomGrantConfig,
        callback?: (response: BasicUserInfo | HttpResponse<any>) => void,
    ): void;
    revokeAccessToken(): Promise<boolean>;
    getOIDCServiceEndpoints(): Promise<OIDCEndpoints>;
    getHttpClient(): Promise<HttpClientInstance>;
    getDecodedIDToken(): Promise<DecodedIDTokenPayload>;
    getAccessToken(): Promise<string>;
    refreshAccessToken(): Promise<BasicUserInfo>;
    isAuthenticated(): Promise<boolean>;
    enableHttpHandler(): Promise<boolean>;
    disableHttpHandler(): Promise<boolean>;
    updateConfig(config: Partial<AuthClientConfig<Config>>): Promise<void>;
    on(hook: Hooks.CustomGrant, callback: (response?: any) => void, id: string): void;
    on(
        hook:
            | Hooks.EndUserSession
            | Hooks.HttpRequestError
            | Hooks.HttpRequestFinish
            | Hooks.HttpRequestStart
            | Hooks.HttpRequestSuccess
            | Hooks.Initialize
            | Hooks.SignIn
            | Hooks.SignOut,
        callback: (response?: any) => void
    ): void;
    on(hook: Hooks, callback: (response?: any) => void, id?: string): void;
    state: AuthStateInterface;
}

export interface SecureRouteInterface {
    callback: () => void;
    component: any;
}
