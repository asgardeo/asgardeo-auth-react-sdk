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

import { AuthProvider } from "@asgardeo/auth-react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SWRConfig } from "swr";
import { SDKConfig } from "./config";
import { HomePage, NotFoundPage } from "./pages";

const App = () => (
  <SWRConfig>
    <AuthProvider config={SDKConfig as any}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  </SWRConfig>
);

export default App;
