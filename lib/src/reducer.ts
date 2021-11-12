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

import { AuthContextReducerActionTypes } from "./actions";
import { AuthStateInterface } from "./models";

/**
 * Initial authenticate state.
 */
const authenticateInitialState: AuthStateInterface = {
    allowedScopes: "",
    displayName: "",
    email: "",
    isAuthenticated: false,
    isLoading: true,
    username: "",
    sub: ""
};

/**
 * Reducer to handle the state of authentication related actions.
 *
 * @param state - Previous state
 * @param action - Action type
 * @returns The new state
 */
const authenticateReducer = (state, action) => {
    switch (action.type) {
        case AuthContextReducerActionTypes.SET_SIGN_IN:
            return {
                ...state,
                allowedScopes: action.payload.allowedScopes,
                displayName: action.payload.displayName,
                email: action.payload.email,
                isAuthenticated: true,
                isLoading: false,
                username: action.payload.username,
                sub: action.payload.sub
            };
        case AuthContextReducerActionTypes.SET_SIGN_OUT:
            return {
                ...state,
                authenticateInitialState,
                isLoading: false
            };
        case AuthContextReducerActionTypes.SET_PROFILE_INFO:
            return state;
        default:
            return state;
    }
};

export { authenticateInitialState, authenticateReducer };
