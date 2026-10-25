import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/index.css";
import App from "@/App";
import { store } from "@/app/store";
import { ThemeProvider } from "@/context/ThemeContext";
import { PreferencesProvider } from "@/context/PreferencesContext";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, refetchOnWindowFocus: false } },
});

// Providers wrap the whole app: Redux (data) > Context (theme, preferences) > App.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <PreferencesProvider>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </PreferencesProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);
