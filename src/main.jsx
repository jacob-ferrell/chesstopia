import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HashRouter } from "react-router-dom";

const queryClient = new QueryClient();
const domain = "dev-34s13r3ilknohwmq.us.auth0.com";
const clientId = "27F4sjcVpWzVsviGDpdjk13Z5rmdywV7";

ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter baseline="/">
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
  </HashRouter>
);
