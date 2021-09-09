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
    OIDCEndpoints,
    SignInConfig
} from "@asgardeo/auth-spa";

export interface AuthReactConfig extends SPAConfig {
    /**
     * The SDK's `AuthProvider` by default is listening to the URL changes to see
     * if `code` & `session_state` search params are available so that it could perform
     * token exchange. This option could be used to override that behaviour.
     */
    skipRedirectCallback?: boolean;
}

export interface AuthStateInterface {
    allowedScopes: string;
    displayName?: string;
    email?: string;
    isAuthenticated: boolean;
    /**
     * Are the Auth requests loading.
     */
    isLoading: boolean;
    username: string;
    isSigningOut?: boolean;
}

export interface AuthContextInterface {
    signIn: (
        config?: SignInConfig,
        authorizationCode?: string,
        sessionState?: string,
        callback?: (response: BasicUserInfo) => void
    ) => Promise<BasicUserInfo>;
    signOut: (callback?: (response: boolean) => void) => Promise<boolean>;
    getBasicUserInfo(): Promise<BasicUserInfo>;
    httpRequest(config: HttpRequestConfig): Promise<HttpResponse<any>>;
    httpRequestAll(configs: HttpRequestConfig[]): Promise<HttpResponse<any>[]>;
    requestCustomGrant(
        config: CustomGrantConfig,
        callback?: (response: BasicUserInfo | HttpResponse<any>) => void
    ): void;
    revokeAccessToken(): Promise<boolean>;
    getOIDCServiceEndpoints(): Promise<OIDCEndpoints>;
    getHttpClient(): Promise<HttpClientInstance>;
    getDecodedIDToken(): Promise<DecodedIDTokenPayload>;
    getIDToken(): Promise<string>;
    getAccessToken(): Promise<string>;
    refreshAccessToken(): Promise<BasicUserInfo>;
    isAuthenticated(): Promise<boolean>;
    enableHttpHandler(): Promise<boolean>;
    disableHttpHandler(): Promise<boolean>;
    updateConfig(config: Partial<AuthClientConfig<Config>>): Promise<void>;
    trySignInSilently: () => Promise<boolean | BasicUserInfo>;
    on(hook: Hooks.CustomGrant, callback: (response?: any) => void, id: string): void;
    on(
        hook:
            | Hooks.RevokeAccessToken
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
