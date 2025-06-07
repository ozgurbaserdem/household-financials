"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store";
import { ThemeProvider } from "next-themes";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    /* Disable until we have solved the issue with Light Theme then switch back to this <ThemeProvider attribute="class" defaultTheme="system" enableSystem>*/
    <ThemeProvider attribute="class" forcedTheme="dark" enableSystem={false}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
};
