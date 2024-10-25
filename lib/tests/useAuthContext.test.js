import React from "react";
import { render, screen } from "@testing-library/react";
import { AuthenticatedComponent } from "../src/authenticated-component";
import { useAuthContext } from "../src/authenticate";
import "@testing-library/jest-dom";

jest.mock("../src/authenticate");

describe("AuthenticatedComponent with different auth states", () => {
    it("renders children when authenticated", () => {
        useAuthContext.mockReturnValue({ state: { isAuthenticated: true, isLoading: false, error: null } });

        render(
            <AuthenticatedComponent fallback={<div data-testid="fallback">Loading...</div>}>
                <div data-testid="protected-content">Protected Content</div>
            </AuthenticatedComponent>
        );

        expect(screen.getByTestId("protected-content")).toBeInTheDocument();
        expect(screen.queryByTestId("fallback")).not.toBeInTheDocument();
    });

    it("renders fallback when not authenticated", () => {
        useAuthContext.mockReturnValue({ state: { isAuthenticated: false, isLoading: false, error: null } });

        render(
            <AuthenticatedComponent fallback={<div data-testid="fallback">Please log in</div>}>
                <div data-testid="protected-content">Protected Content</div>
            </AuthenticatedComponent>
        );

        expect(screen.getByTestId("fallback")).toBeInTheDocument();
        expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    });

    it("renders loading state when authentication is loading", () => {
        useAuthContext.mockReturnValue({ state: { isAuthenticated: false, isLoading: true, error: null } });

        render(
            <AuthenticatedComponent fallback={<div data-testid="loading">Loading...</div>}>
                <div data-testid="protected-content">Protected Content</div>
            </AuthenticatedComponent>
        );

        expect(screen.getByTestId("loading")).toBeInTheDocument();
        expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    });

    it("renders error message if there is an error in auth state", () => {
        useAuthContext.mockReturnValue({ state: { isAuthenticated: false, isLoading: false, error: "Authentication error" } });

        render(
            <AuthenticatedComponent fallback={<div data-testid="error">Error: Unable to authenticate</div>}>
                <div data-testid="protected-content">Protected Content</div>
            </AuthenticatedComponent>
        );

        expect(screen.getByTestId("error")).toBeInTheDocument();
        expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    });
});
