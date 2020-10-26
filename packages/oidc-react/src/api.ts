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

import { ConfigInterface, Hooks, IdentityClient } from "@asgardio/oidc-js";
import { AuthStateInterface } from "./models";

class AuthAPI {
    static DEFAULT_STATE: AuthStateInterface;

    private _authState = AuthAPI.DEFAULT_STATE;
    private _client;

    constructor() {
        this._client = IdentityClient.getInstance();

        this.getState = this.getState.bind(this);
        this.httpClient = this.httpClient.bind(this);
        this.init = this.init.bind(this);
        this.signIn = this.signIn.bind(this);
        this.signOut = this.signOut.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    /**
     * Method to return Auth Client instance authentication state.
     *
     * @return {AuthStateInterface} Authentication State.
     */
    getState() {
        return this._authState;
    }

    /**
     * Method will return the http client instance bound to this Auth Client instance.
     *
     * @return HttpClient.
     */
    httpClient() {
        return this._client.httpRequest.bind(this._client).bind(this._client);
    }

    /**
     * Method to initialize the AuthClient instance.
     *
     * @param {ConfigInterface} config - `dispatch` function from React Auth Context.
     */
    init(config: ConfigInterface) {
        this._client.initialize(config);
    }

    /**
     * Method to handle user Sign In requests.
     *
     * @param {any} dispatch - `dispatch` function from React Auth Context.
     * @param {AuthStateInterface} state - Current authentication state in React Auth Context.
     * @param {any} callback - Action to trigger on successful sign in.
     */
    signIn(dispatch, state: AuthStateInterface, callback?) {
        this._client.on(Hooks.SignIn, (response) => {
            const stateToUpdate = {
                allowedScopes: response.allowedScopes,
                displayName: response.displayName,
                email: response.email,
                isAuthenticated: true,
                username: response.username
            };

            this.updateState(stateToUpdate);

            dispatch({...state, ...stateToUpdate});

            if (callback) {
                callback();
            }
        });

        this._client.signIn();
    }

    /**
     * Method to handle user Sign Out requests.
     *
     * @param {any} dispatch - `dispatch` function from React Auth Context.
     * @param {AuthStateInterface} state - Current authentication state in React Auth Context.
     * @param {any} callback - Action to trigger on successful sign out.
     */
    signOut(dispatch, state: AuthStateInterface, callback?) {
        this._client.on(Hooks.SignOut, () => {
            const stateToUpdate = AuthAPI.DEFAULT_STATE;

            this.updateState(stateToUpdate);

            dispatch({...state, ...stateToUpdate});

            if (callback) {
                callback();
            }
        });

        this._client.signOut();
    }

    /**
     * Method to update Auth Client instance authentication state.
     *
     * @param {AuthStateInterface} state - State values to update in authentication state.
     */
    updateState(state: AuthStateInterface) {
        this._authState = {...this._authState, ...state};
    }
}

AuthAPI.DEFAULT_STATE = { 
    allowedScopes: "",
    displayName: "",
    email: "",
    isAuthenticated: false,
    username: ""
};

export default AuthAPI;
