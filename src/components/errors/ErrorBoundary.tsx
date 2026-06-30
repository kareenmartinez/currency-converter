import type { ReactNode } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

import { PageError } from "./PageError";

type Props = {
  children: ReactNode;
};

export function ErrorBoundary({ children }: Props) {
  return (
    <ReactErrorBoundary
      fallback={
        <PageError
          title="Something went wrong"
          message="Something went wrong. Please refresh the page."
        />
      }
      onError={(error, info) => {
        console.error("Unhandled application error:", error, info);
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
