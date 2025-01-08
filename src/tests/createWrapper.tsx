import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ConfigProvider } from "../contexts/ConfigContext";

interface CreateWrapperProps {
  children: React.ReactNode;
}

export const createWrapper = () => {
  // Creates a new QueryClient for each test
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: CreateWrapperProps) => (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        value={{
          projectAccessKey: "test-access",
        }}
      >
        {children}
      </ConfigProvider>
    </QueryClientProvider>
  );
};
