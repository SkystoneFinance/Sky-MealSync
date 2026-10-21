import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import QueryProvider from "./app/providers/QueryProvider";
import AppRoutes from "./app/routes/AppRoutes";

import AuthProvider from "./components/auth/AuthProvider";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <BrowserRouter>
    <QueryProvider>
      <AuthProvider>
        <AppRoutes />

        {/* Renders every toast() call in the app */}
        <Toaster position="top-center" />
      </AuthProvider>
    </QueryProvider>
  </BrowserRouter>
);