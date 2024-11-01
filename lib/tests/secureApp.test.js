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
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { SecureApp } from "../src/secure-app";
import { useAuthContext } from "../src/authenticate"; // Adjust the import path based on your project structure

// Mock useAuthContext to control the authentication state in tests.
jest.mock("../src/authenticate");

describe("SecureApp", () => {
    const mockSignIn = jest.fn();
    const mockOnSignIn = jest.fn();

    beforeEach(() => {
        // Reset mocks before each test.
        jest.clearAllMocks();
    });

    it("should render fallback content while loading", () => {
        useAuthContext.mockReturnValue({
            state: { isAuthenticated: false, isLoading: true },
            signIn: mockSignIn
        });

        render(
            <SecureApp fallback={<div data-testid="fallback">Loading...</div>}>
                <div data-testid="protected-content">Protected Content</div>
            </SecureApp>
        );

        expect(screen.getByTestId("fallback")).toBeInTheDocument();
    });

    it("should call signIn if the user is not authenticated", async () => {
        useAuthContext.mockReturnValue({
            state: { isAuthenticated: false, isLoading: false },
            signIn: mockSignIn
        });

        render(
            <SecureApp fallback={<div>Loading...</div>}>
                <div data-testid="protected-content">Protected Content</div>
            </SecureApp>
        );

        await waitFor(() => expect(mockSignIn).toHaveBeenCalledTimes(1));
    });

    it("should call overrideSignIn if provided and user is not authenticated", async () => {
        const mockOverrideSignIn = jest.fn();

        useAuthContext.mockReturnValue({
            state: { isAuthenticated: false, isLoading: false },
            signIn: mockSignIn
        });

        render(
            <SecureApp
                fallback={<div>Loading...</div>}
                overrideSignIn={mockOverrideSignIn}
            >
                <div data-testid="protected-content">Protected Content</div>
            </SecureApp>
        );

        await waitFor(() => expect(mockOverrideSignIn).toHaveBeenCalledTimes(1));
        expect(mockSignIn).not.toHaveBeenCalled();
    });

    it("should render children when user is authenticated", () => {
        useAuthContext.mockReturnValue({
            state: { isAuthenticated: true, isLoading: false },
            signIn: mockSignIn
        });

        render(
            <SecureApp fallback={<div>Loading...</div>}>
                <div data-testid="protected-content">Protected Content</div>
            </SecureApp>
        );

        expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    });

    it("should call onSignIn callback when user is authenticated", () => {
        useAuthContext.mockReturnValue({
            state: { isAuthenticated: true, isLoading: false },
            signIn: mockSignIn
        });

        render(
            <SecureApp fallback={<div>Loading...</div>} onSignIn={mockOnSignIn}>
                <div data-testid="protected-content">Protected Content</div>
            </SecureApp>
        );

        expect(mockOnSignIn).toHaveBeenCalledTimes(1);
    });
});
