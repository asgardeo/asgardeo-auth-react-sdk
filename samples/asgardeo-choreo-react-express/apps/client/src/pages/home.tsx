/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com) All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import { Hooks, useAuthContext } from "@asgardeo/auth-react";
import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import REACT_LOGO from "../images/react-logo.png";
import { useApiRequest } from "../hooks/useApiRequest";
import { DefaultLayout } from "../layouts/default";
import { AuthenticationResponse } from "../components/AuthenticationResponse";
import { ApiResponse } from "../components/ApiResponse";
import { ApiBaseUrl } from "../config";

type HomePagePropsInterface = {};

export const HomePage: FunctionComponent<
  HomePagePropsInterface
> = (): ReactElement => {
  const {
    state,
    signIn,
    signOut,
    getBasicUserInfo,
    getIDToken,
    getDecodedIDToken,
    httpRequest,
    on,
  } = useAuthContext();
  const [chartData, setChartData] = useState<any>();
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [hasAuthenticationErrors, setHasAuthenticationErrors] =
    useState<boolean>(false);
  const [derivedAuthenticationState, setDerivedAuthenticationState] =
    useState<any>(null);

  const fetcher = (url: string) => httpRequest({ url }).then((res) => res.data);

  const { data, error } = useApiRequest(shouldFetch, fetcher);

  useEffect(() => {
    if (!state?.isAuthenticated) {
      return;
    }

    setShouldFetch(true);

    (async (): Promise<void> => {
      const basicUserInfo = await getBasicUserInfo();
      const idToken = await getIDToken();
      const decodedIDToken = await getDecodedIDToken();

      const derivedState = {
        authenticateResponse: basicUserInfo,
        idToken: idToken.split("."),
        decodedIdTokenHeader: JSON.parse(atob(idToken.split(".")[0])),
        decodedIDTokenPayload: decodedIDToken,
      };

      setDerivedAuthenticationState(derivedState);
    })();
  }, [state.isAuthenticated]);

  useEffect(() => {
    on(Hooks.SignOut, async () => {
      await fetch(`${ApiBaseUrl}/logout`, {
        method: "POST",
        credentials: "include",
      });
    });
  }, [on]);

  const handleLogin = () => {
    signIn().catch(() => setHasAuthenticationErrors(true));
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <DefaultLayout
      isLoading={state.isLoading}
      hasErrors={hasAuthenticationErrors}
    >
      {state.isAuthenticated ? (
        <div className="content">
          {data && <ApiResponse response={data} />}
          <AuthenticationResponse
            derivedResponse={derivedAuthenticationState}
          />
          <button
            className="btn primary mt-4"
            onClick={() => {
              handleLogout();
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="content">
          <div className="home-image">
            <img src={REACT_LOGO} className="react-logo-image logo" />
          </div>
          <h4 className={"spa-app-description"}>
            Sample demo to showcase authentication for a Single Page Application
            via the OpenID Connect Authorization Code flow, which is integrated
            using the&nbsp;
            <a
              href="https://github.com/asgardeo/asgardeo-auth-react-sdk"
              target="_blank"
            >
              Asgardeo Auth React SDK
            </a>
            .
          </h4>
          <button
            className="btn primary"
            onClick={() => {
              handleLogin();
            }}
          >
            Login
          </button>
        </div>
      )}
    </DefaultLayout>
  );
};
