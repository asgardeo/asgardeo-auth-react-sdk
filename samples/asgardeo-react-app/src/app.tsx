/**
 * Copyright (c) 2025, WSO2 LLC. (https://wso2.com).
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

import { AuthProvider, useAuthContext } from "@asgardeo/auth-react";
import {default as authConfig } from "./config.json";
import { FunctionComponent, ReactElement } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ErrorBoundary } from "./error-boundary";
import { HomePage } from "./pages/home";
import { NotFoundPage } from "./pages/404";

const AppContent: FunctionComponent = (): ReactElement => {
    const { error } = useAuthContext();

    return (
      <ErrorBoundary error={error}>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route element={<NotFoundPage />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    );
};

function App() {
    return (
        <AuthProvider config={authConfig}>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
