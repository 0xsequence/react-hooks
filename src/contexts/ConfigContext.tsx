import { createContext } from "react";

export interface Config {
  projectAccessKey: string;
}

export const ConfigContext = createContext<Config | null>(null);

export const ConfigProvider = ConfigContext.Provider;
