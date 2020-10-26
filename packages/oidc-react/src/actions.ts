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

/**
 * AuthContext reducer actions enum.
 */
export enum AuthContextReducerActionTypes {
    SET_SIGN_IN = "SET_SIGN_IN",
    SET_SIGN_OUT = "SET_SIGN_OUT",
    SET_PROFILE_INFO = "SET_PROFILE_INFO"
}

/**
 * Set Sign In State reducer action.
 */
export const setSignIn = (response: any) => ({
    payload: response,
    type: AuthContextReducerActionTypes.SET_SIGN_IN
});

/**
 * Set Sign Out State reducer action.
 */
export const setSignOut = () => ({
    type: AuthContextReducerActionTypes.SET_SIGN_OUT
});

/**
 * Set Profile Info reducer action.
 *
 * @param {any} details - Profile details
 */
export const setProfileInfo = (details: any) => ({
    payload: details,
    type: AuthContextReducerActionTypes.SET_PROFILE_INFO
});
