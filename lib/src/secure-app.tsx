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

import React, { FunctionComponent, PropsWithChildren, ReactElement, Suspense, useEffect } from "react";
import { useAuthContext } from "./authenticate";
import { AuthenticatedComponent } from "./authenticated-component";

/**
 * Prop types of the `SecureApp` component.
 */
interface SecureAppPropsInterface {
    children?: React.ReactNode;
    /**
     * The fallback component to be shown during a sign in attempt.
     */
    fallback?: React.ReactNode;
    /**
     * The callback function to be fired after a successful login.
     */
    onSignIn?: () => void;
    /**
     * The sign in method to be called. By default `SecureApp` uses the default `signIn` method.
     * If you want to use a custom sign in method, you can pass it here. For example, if you use the `form_post`
     * method to retrieve the authorization code, then you can call the `signIn` with the code within this method.
     */
    overrideSignIn?: () => Promise<void>;
}

/**
 * This component can be used to secure a React application. This component renders its children
 * only if the user is signed-in. If the user is not signed in, then this component automatically attempts
 * to sign the user in using the default `signIn` method or using the `overrideSignIn` method passed as a prop.
 *
 *
 * @param props {SecureAppPropsInterface}
 *
 * @returns SecureApp component
 */
export const SecureApp: FunctionComponent<PropsWithChildren<SecureAppPropsInterface>> = (
    props: PropsWithChildren<SecureAppPropsInterface>): ReactElement => {

    const { children, fallback, onSignIn, overrideSignIn } = props;

    const { state: { isAuthenticated, isLoading }, signIn } = useAuthContext();

    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            (async () => {
                if (overrideSignIn && typeof overrideSignIn === "function") {
                    await overrideSignIn();
                } else {
                    await signIn();
                }
            })();
        }

        isAuthenticated && onSignIn && typeof onSignIn === "function" && onSignIn();

    }, [ isAuthenticated, isLoading ]);

    return (
        <AuthenticatedComponent fallback={ fallback }>
            <Suspense fallback={ fallback }>
                { children }
            </Suspense>
        </AuthenticatedComponent>
    );
};
