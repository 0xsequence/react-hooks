import { createContext } from "react";

interface ReactHooksConfig {
  projectAccessKey: string;
}

export const ReactHooksConfigContext = createContext<ReactHooksConfig | null>(null);

export const ReactHooksConfigProvider = ReactHooksConfigContext.Provider;
