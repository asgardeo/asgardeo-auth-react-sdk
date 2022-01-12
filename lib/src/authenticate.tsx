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
    Hooks,
    HttpRequestConfig,
    HttpResponse,
    SPAUtils,
    SignInConfig
} from "@asgardeo/auth-spa";
import { SPACustomGrantConfig } from "@asgardeo/auth-spa/src/models/request-custom-grant";
import React, {
    FunctionComponent,
    PropsWithChildren,
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";
import { AuthParams, ReactConfig } from ".";
import AuthAPI from "./api";
import { AuthContextInterface, AuthReactConfig, AuthStateInterface } from "./models";

/**
 * Default `AuthReactConfig` config.
 */
const defaultConfig: Partial<ReactConfig> = {
    disableTrySignInSilently: false
};

const AuthClient = new AuthAPI();

/**
 * Authentication Context to hold global states in react components.
 */
const AuthContext = createContext<AuthContextInterface>(null);

interface AuthProviderPropsInterface {
    config: AuthReactConfig;
    fallback?: ReactNode;
    getAuthParams?: () => Promise<AuthParams>;
    onSignOut?: () => void;
}

const AuthProvider: FunctionComponent<PropsWithChildren<AuthProviderPropsInterface>> = (
    props: PropsWithChildren<AuthProviderPropsInterface>
) => {
    const [ state, dispatch ] = useState<AuthStateInterface>(AuthClient.getState());
    const [ initialized, setInitialized ] = useState(false);

    const { children, config: passedConfig, fallback, getAuthParams, onSignOut } = props;

    const config = useMemo(
        (): AuthReactConfig => ({ ...defaultConfig, ...passedConfig }), [ passedConfig ]
    );

    const signIn = async(
        config?: SignInConfig,
        authorizationCode?: string,
        sessionState?: string,
        callback?: (response: BasicUserInfo) => void
    ): Promise<BasicUserInfo> => {
        return await AuthClient.signIn(dispatch, state, config, authorizationCode, sessionState, callback);
    };
    const signOut = (callback?: (response: boolean) => void): Promise<boolean> => {
        return AuthClient.signOut(dispatch, state, callback);
    };
    const getBasicUserInfo = () => AuthClient.getBasicUserInfo();
    const httpRequest = (config: HttpRequestConfig) => AuthClient.httpRequest(config);
    const httpRequestAll = (configs: HttpRequestConfig[]) => AuthClient.httpRequestAll(configs);
    const requestCustomGrant = (
        config: SPACustomGrantConfig,
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
    const getIDToken = () => AuthClient.getIDToken();
    const updateConfig = (config: Partial<AuthClientConfig<AuthReactConfig>>) => AuthClient.updateConfig(config);
    const on = (hook: Hooks, callback: (response?: any) => void, id?: string): Promise<void> => {
        if (hook === Hooks.CustomGrant) {
            return AuthClient.on(hook, callback, id);
        }

        return AuthClient.on(hook, callback);
    };
    const trySignInSilently = () => AuthClient.trySignInSilently(state, dispatch);

    useEffect(() => {
        if (state.isAuthenticated) {
            return;
        }
        (async () => {
            setInitialized(await AuthClient.init(config));
        })();

    }, [ config ]);

    /**
     * Try signing in when the component is mounted.
     */
    useEffect(() => {
        (async () => {
            let isSignedOut: boolean = false;
            await on(Hooks.SignOut, () => {
                isSignedOut = true;

                if (onSignOut) {
                    onSignOut();
                }
            });

            // User is already authenticated. Skip...
            if (state.isAuthenticated) {
                return;
            }

            // If `skipRedirectCallback` is not true, check if the URL has `code` and `session_state` params.
            // If so, initiate the sign in.
            if (!config.skipRedirectCallback) {
                let authParams: AuthParams = null;
                if (getAuthParams && typeof getAuthParams === "function") {
                    authParams = await getAuthParams();
                }

                if (SPAUtils.hasAuthSearchParamsInURL()
                    || authParams?.authorizationCode
                    || new URL(location.href).searchParams.get("error") )
                {
                    await signIn({ callOnlyOnRedirect: true }, authParams?.authorizationCode, authParams?.sessionState)
                        .then(() => {
                            // TODO: Add logs when a logger is available.
                            // Tracked here https://github.com/asgardeo/asgardeo-auth-js-sdk/issues/151.
                        })
                        .catch((error) => {
                            // TODO: Add logs when a logger is available.
                            // Tracked here https://github.com/asgardeo/asgardeo-auth-js-sdk/issues/151.
                            throw error;
                        });
                }
            }

            if (AuthClient.getState().isAuthenticated) {
                return;
            }

            if (config.disableTrySignInSilently || isSignedOut) {
                dispatch({ ...state, isLoading: false });

                return;
            }

            // This uses the RP iframe to get the session. Hence, will not work if 3rd party cookies are disabled.
            // If the browser has these cookies disabled, we'll not be able to retrieve the session on refreshes.
            await trySignInSilently()
                .then(() => {
                    // TODO: Add logs when a logger is available.
                    // Tracked here https://github.com/asgardeo/asgardeo-auth-js-sdk/issues/151.
                })
                .catch((error) => {
                    // TODO: Add logs when a logger is available.
                    // Tracked here https://github.com/asgardeo/asgardeo-auth-js-sdk/issues/151.
                    throw error;
                });
        })();

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
                getIDToken,
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
                trySignInSilently,
                updateConfig
            } }
        >
            { initialized ? children : fallback ?? null }
        </AuthContext.Provider>
    );
};

const useAuthContext = (): AuthContextInterface => {
    return useContext(AuthContext);
};

export { AuthClient, AuthProvider, useAuthContext };
