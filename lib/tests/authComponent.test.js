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