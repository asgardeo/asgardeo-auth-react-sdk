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
