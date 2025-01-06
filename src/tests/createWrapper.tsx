import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
