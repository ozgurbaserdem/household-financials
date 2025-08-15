"use client";

import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from "@/store";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    /* Disable until we have solved the issue with Light Theme then switch back to this <ThemeProvider attribute="class" defaultTheme="system" enableSystem>*/
    <ThemeProvider enableSystem attribute="class" defaultTheme="system">
      {" "}
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
};
