import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// import { QueryClientProvider } from "@tanstack/react-query";

import AppRoutes from "./app/routes/AppRoutes";
import QueryProvider from "./app/providers/QueryProvider";

import "./index.css";
import AuthProvider from "./components/auth/AuthProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryProvider>
      <AuthProvider>
      <AppRoutes />
      </AuthProvider>
    </QueryProvider>
  </BrowserRouter>
);