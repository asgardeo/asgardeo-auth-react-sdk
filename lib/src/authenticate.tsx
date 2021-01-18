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
    Hooks,
    HttpRequestConfig,
    HttpResponse,
    SignInConfig
} from "./auth-spa";
import React, {
    FunctionComponent,
    ReactPropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useState
} from "react";
import AuthAPI from "./api";
import { AuthContextInterface, AuthStateInterface } from "./models";

const AuthClient = new AuthAPI();

/**
 * Authentication Context to hold global states in react components.
 */
const AuthContext = createContext<AuthContextInterface>({
    ...AuthClient,
    state: AuthClient.getState()
});

interface AuthProviderPropsInterface {
    config: AuthClientConfig<Config>;
}

const AuthProvider: FunctionComponent<ReactPropsWithChildren<AuthProviderPropsInterface>> = (
    props: ReactPropsWithChildren<AuthProviderPropsInterface>
) => {
    const [ state, dispatch ] = useState<AuthStateInterface>(AuthClient.getState());
    const [ configState, setConfigState ] = useState(null);

    const { children, config } = props;

    const signIn = (
        config?: SignInConfig,
        authorizationCode?: string,
        sessionState?: string,
        callback?: (response: BasicUserInfo) => void
    ) => {
        AuthClient.signIn(dispatch, state, config, authorizationCode, sessionState, callback);
    };
    const signOut = (callback?) => {
        AuthClient.signOut(dispatch, state, callback);
    };
    const getBasicUserInfo = () => AuthClient.getBasicUserInfo();
    const httpRequest = (config: HttpRequestConfig) => AuthClient.httpRequest(config);
    const httpRequestAll = (configs: HttpRequestConfig[]) => AuthClient.httpRequestAll(configs);
    const requestCustomGrant = (
        config: CustomGrantConfig,
        callback?: (response: BasicUserInfo | HttpResponse<any>) => void
    ) => AuthClient.requestCustomGrant(config, callback, dispatch);
    const revokeAccessToken = () => AuthClient.revokeAccessToken(dispatch);
    const getOIDCServiceEndpoints = () => AuthClient.getOIDCServiceEndpoints();
    const getHttpClient = () => AuthClient.getHttpClient();
    const getDecodedIDToken = () => AuthClient.getDecodedIDToken();
    const getAccessToken = () => AuthClient.getAccessToken();
    const refreshAccessToken = () => AuthClient.refreshAccessToken();
    const isAuthenticated = () => AuthClient.isAuthenticated();
    const enableHttpHandler = () => AuthClient.enableHttpHandler();
    const disableHttpHandler = () => AuthClient.disableHttpHandler();
    const updateConfig = (config: Partial<AuthClientConfig<Config>>) => AuthClient.updateConfig(config);
    const on = (hook: Hooks, callback: (response?: any) => void, id?: string) => {
        if (hook === Hooks.CustomGrant) {
            return AuthClient.on(hook, callback, id);
        }

        return AuthClient.on(hook, callback);
    };

    useEffect(() => {
        if (state.isAuthenticated) {
            return;
        }

        AuthClient.init(config);
        setConfigState(config);
    }, [ config ]);

    /**
     * Render state and special case actions
     */
    return (
        <AuthContext.Provider
            value={ {
                disableHttpHandler,
                enableHttpHandler,
                getAccessToken,
                getBasicUserInfo,
                getDecodedIDToken,
                getHttpClient,
                getOIDCServiceEndpoints,
                httpRequest,
                httpRequestAll,
                isAuthenticated,
                on,
                refreshAccessToken,
                requestCustomGrant,
                revokeAccessToken,
                signIn,
                signOut,
                state,
                updateConfig
            } }
        >
            { configState && children }
        </AuthContext.Provider>
    );
};

const useAuthContext = (): AuthContextInterface => {
    return useContext(AuthContext);
};

export { AuthClient, AuthProvider, useAuthContext };
