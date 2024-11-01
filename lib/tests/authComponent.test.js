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

import React from "react";
import { render, screen } from "@testing-library/react";
import { AuthenticatedComponent } from "../src/authenticated-component.tsx";
import { useAuthContext } from "../src/authenticate";
import "@testing-library/jest-dom";

jest.mock("../src/authenticate");

describe("AuthenticatedComponent", () => {
    it("renders children when authenticated", () => {
        useAuthContext.mockReturnValue({ state: { isAuthenticated: true } });

        render(
            <AuthenticatedComponent fallback={<div data-testid="fallback">Fallback</div>}>
                <div data-testid="protected-content">Protected Content</div>
            </AuthenticatedComponent>
        );

        expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    });

    it("renders fallback when not authenticated", () => {
        useAuthContext.mockReturnValue({ state: { isAuthenticated: false } });

        render(
            <AuthenticatedComponent fallback={<div data-testid="fallback">Fallback</div>}>
                <div data-testid="protected-content">Protected Content</div>
            </AuthenticatedComponent>
        );

        expect(screen.getByTestId("fallback")).toBeInTheDocument();
        expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    });
});