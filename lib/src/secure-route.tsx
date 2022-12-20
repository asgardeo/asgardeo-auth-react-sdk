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

import React, { FunctionComponent, MutableRefObject, ReactElement, useEffect, useRef } from "react";
import { Route, RouteProps } from "react-router-dom";
import { useAuthContext } from "./authenticate";
import { SecureRouteInterface } from "./models";

/**
 * Protected route component.
 *
 * @param {SecureRouteInterface} props - Props injected in to the component.
 *
 * @return {React.ReactElement}
 */
const SecureRoute: FunctionComponent<SecureRouteInterface & RouteProps> = (props: SecureRouteInterface & RouteProps
): ReactElement => {
    const { state } = useAuthContext();
    const reRenderCheckRef: MutableRefObject<boolean> = useRef(false);

    const { component: Component, callback, ...rest } = props;

    useEffect(() => {
        if (state.isAuthenticated || state.isLoading) {
            return;
        }

        // React 18.x Strict.Mode has a new check for `Ensuring reusable state` to facilitate an upcoming react feature.
        // https://reactjs.org/docs/strict-mode.html#ensuring-reusable-state
        // This will remount all the useEffects to ensure that there are no unexpected side effects.
        // When react remounts the signIn hook of the AuthProvider, it will cause a race condition. Hence, we have to
        // prevent the re-render of this hook as suggested in the following discussion.
        // https://github.com/reactwg/react-18/discussions/18#discussioncomment-795623
        if (reRenderCheckRef.current) {
            return;
        }

        reRenderCheckRef.current = true;
        callback && callback();
    }, [ state.isAuthenticated, state.isLoading ]);

    if (!state.isAuthenticated) {
        return null;
    }

    return (
        <Route
            { ...rest }
            element={ <Component />
            }
        />
    );
};

export { SecureRoute };
