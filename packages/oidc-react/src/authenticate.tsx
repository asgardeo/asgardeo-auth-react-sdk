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

import React, { FunctionComponent, createContext, useContext, useEffect, useState } from "react";
import AuthAPI from "./api";
import { AuthContextInterface } from "./models";

const AuthClient = new AuthAPI();

/**
 * Authentication Context to hold global states in react components.
 */
const AuthContext = createContext<AuthContextInterface>({
    signIn: () => { return; },
    signOut: () => { return; },
    state: AuthClient.getState()
});

const AuthProvider: FunctionComponent<{ children: any; config: any }> = ({ children, config }) => {

    const [ state, dispatch ] = useState(AuthClient.getState());
    const [ configState, setConfigState ] = useState(null);

    const signIn = (callback?) => { AuthClient.signIn(dispatch, state, callback); };
    const signOut = (callback?) => { AuthClient.signOut(dispatch, state, callback); };

    useEffect(() => {

        if (state.isAuthenticated) {
            return;
        }

        AuthClient.init(config);
        setConfigState(config);

    }, [config]);

    /**
     * Render state and special case actions
     */
    return (
        <AuthContext.Provider value={ { signIn, signOut, state } }>
            { configState && children }
        </AuthContext.Provider>
    );
};

const useAuthContext = () => {
    return useContext(AuthContext);
};

export { AuthClient, AuthProvider, useAuthContext };
