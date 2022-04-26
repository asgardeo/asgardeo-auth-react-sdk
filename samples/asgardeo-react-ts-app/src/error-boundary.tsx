import { AsgardeoAuthException } from "@asgardeo/auth-react";
import React, { FunctionComponent, ReactElement } from "react";
import { InvalidSystemTimePage } from "./pages/InvalidSystemTime";

interface ErrorBoundaryProps {
  error: AsgardeoAuthException;
  children: ReactElement;
}

export const ErrorBoundary: FunctionComponent<ErrorBoundaryProps> = (
  props: ErrorBoundaryProps
): ReactElement => {
  const { error, children } = props;

  return error?.code === "JS-CRYPTO_UTILS-IVIT-IV02" ? <InvalidSystemTimePage /> : error ? null : (
    children
  );
};
