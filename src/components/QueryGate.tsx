import type { ReactNode } from "react";

interface QueryGateProps {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  loading?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
}

export default function QueryGate({
  isLoading,
  isError,
  errorMessage,
  loading,
  error,
  children,
}: QueryGateProps) {
  if (isLoading) {
    return loading ?? (
      <div className="loader">
        <div className="spinner" />
      </div>
    );
  }
  if (isError) {
    return error ?? (
      <div className="text-center py-20 text-canceld">
        <p className="text-xl font-bold">{errorMessage}</p>
      </div>
    );
  }
  return <>{children}</>;
}
