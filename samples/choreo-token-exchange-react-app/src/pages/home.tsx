/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
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

 import { Hooks, useAuthContext, Provider } from "@asgardeo/auth-react";
 import React, {
     FunctionComponent,
     ReactElement,
     useEffect,
     useState
 } from "react";
 import { Store } from "react-notifications-component";
 import { default as authConfig } from "../config.json";
 import REACT_LOGO from "../images/react-logo.png";
 import { DefaultLayout } from "../layouts/default";
 import { AuthenticationResponse } from "../components";
 import { useLocation } from "react-router-dom";
 import { LogoutRequestDenied } from "../components/LogoutRequestDenied";
 import { USER_DENIED_LOGOUT } from "../constants/errors";
 import "react-notifications-component/dist/theme.css";
 import { APIResponse } from "../components/api-response";
 
 const API_ENDPOINT = "https://1d8acbf1-e34a-4cb3-a9f5-9690a2b6d67b-prod.e1-us-east-azure.choreoapis.dev/jgdm/covid19-statistics/1.0.0/stats/usa";
 
 /**
  * Decoded ID Token Response component Prop types interface.
  */
 type HomePagePropsInterface = {};
 
 /**
  * Home page for the Sample.
  *
  * @param {HomePagePropsInterface} props - Props injected to the component.
  *
  * @return {React.ReactElement}
  */
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
         on,
         httpRequest
     } = useAuthContext();
 
     const [ derivedAuthenticationState, setDerivedAuthenticationState ] =
         useState<any>(null);
     const [ apiResponse, setApiResponse ] =
         useState<any>(null);
     const [ hasAuthenticationErrors, setHasAuthenticationErrors ] =
         useState<boolean>(false);
     const [ hasLogoutFailureError, setHasLogoutFailureError ] =
         useState<boolean>();
 
     const search = useLocation().search;
     const stateParam = new URLSearchParams(search).get("state");
     const errorDescParam = new URLSearchParams(search).get("error_description");
 
     useEffect(() => {
         if (!state?.isAuthenticated) {
             return;
         }
 
         (async (): Promise<void> => {
             const basicUserInfo = await getBasicUserInfo();
             const idToken = await getIDToken();
             const decodedIDToken = await getDecodedIDToken();
 
             const derivedState = {
                 authenticateResponse: basicUserInfo,
                 idToken: idToken?.split("."),
                 decodedIdTokenHeader: JSON.parse(atob(idToken?.split(".")[0])),
                 decodedIDTokenPayload: decodedIDToken
             };
 
             setDerivedAuthenticationState(derivedState);

             try {
                const apiResponse = await performAPIRequest();
                apiResponse && setApiResponse(apiResponse);
             } catch (error) {
                Store.addNotification({
                    title: "Error!",
                    message: "Invoking the API has failed",
                    type: "danger",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 4000,
                      onScreen: true
                    }
                });
             }
             
         })();
     }, [state?.isAuthenticated]);
 
     useEffect(() => {
         if (stateParam && errorDescParam) {
             if (errorDescParam === "End User denied the logout request") {
                 setHasLogoutFailureError(true);
             }
         }
     }, [stateParam, errorDescParam]);
 
     /**
      * handles the error occurs when the logout consent page is enabled
      * and the user clicks 'NO' at the logout consent page
      */
     useEffect(() => {
         on(Hooks.SignOut, () => {
             setHasLogoutFailureError(false);
         });
     }, [on]);
 
     const handleLogin = () => {
         setHasLogoutFailureError(false);
         signIn().catch(() => setHasAuthenticationErrors(true));
     };
 
     const handleLogout = () => {
         signOut();
     };

     const performAPIRequest = async () => {
        return await httpRequest({
            url: API_ENDPOINT,
            authProvider: Provider.STS
        });
     }
 
     // If `clientID` is not defined in `config.json`, show a UI warning.
     if (!authConfig?.clientID) {
         return (
             <div className="content">
                 <h2>You need to update the Client ID to proceed.</h2>
                 <p>
                     Please open "src/config.json" file using an editor, and
                     update the <code>clientID</code> value with the registered
                     application's client ID.
                 </p>
                 <p>
                     Visit repo{" "}
                     <a href="https://github.com/asgardeo/asgardeo-auth-spa-token-exchange/tree/master/samples/choreo-token-exchange-react-app">
                         README
                     </a>{" "}
                     for more details.
                 </p>
             </div>
         );
     }
 
     if (hasLogoutFailureError) {
         return (
             <LogoutRequestDenied
                 errorMessage={USER_DENIED_LOGOUT}
                 handleLogin={handleLogin}
                 handleLogout={handleLogout}
             />
         );
     }
 
     return (
         <DefaultLayout
             isLoading={state.isLoading}
             hasErrors={hasAuthenticationErrors}
         >
             {state.isAuthenticated ? (
                 <div className="content">
                     {
                        apiResponse ? <APIResponse
                            response={apiResponse["data"]}
                        /> : null
                     }
                     <AuthenticationResponse
                         derivedResponse={derivedAuthenticationState}
                     />
                     <button
                         className="btn primary my-4 mx-4"
                         onClick={() => {
                             handleLogout();
                         }}
                     >
                         Logout
                     </button>
                     <hr className="mt-4" />
                 </div>
             ) : (
                 <div className="content">
                     <div className="home-image">
                         <img
                             alt="react logo"
                             src={REACT_LOGO}
                             className="react-logo-image logo"
                         />
                     </div>
                     <h4 className={"spa-app-description"}>
                         Sample demo to showcase token exchange for a Single Page
                         Application via the OpenID Connect Authorization Code
                         flow, which is integrated using the&nbsp;
                         <a
                             href="https://github.com/asgardeo/asgardeo-auth-spa-token-exchange"
                             target="_blank" rel="noreferrer"
                         >
                             Asgardeo Auth SPA Token Exchange
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