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

import React, { FunctionComponent, PropsWithChildren, ReactNode } from "react";
import { useAuthContext } from "./authenticate";

/**
 * Prop types of the Authenticated component.
 */
interface AuthenticatedComponentPropsInterface {
    fallback: ReactNode;
}

/**
 * This component shows the child component only if the user is authenticated. Otherwise, it shows the placeholder.
 *
 * @param {AuthenticatedComponentPropsInterface} props The props of the component
 * @returns {ReactElement} The authenticated component.
 */
export const AuthenticatedComponent: FunctionComponent<PropsWithChildren<AuthenticatedComponentPropsInterface>> = (
    props: PropsWithChildren<AuthenticatedComponentPropsInterface>
) => {

    const { fallback, children } = props;
    const { state: { isAuthenticated } } = useAuthContext();

    return <> { isAuthenticated ? children : fallback ?? null } </>;
};
