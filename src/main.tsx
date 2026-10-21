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
        <Toaster
          position="top-center"
          toastOptions={{
            className: "!rounded-xl !text-sm !font-medium !text-zinc-900 !shadow-pop",
            success: { iconTheme: { primary: "#047857", secondary: "#fff" } },
            error: { iconTheme: { primary: "#b10f16", secondary: "#fff" } },
          }}
        />
      </AuthProvider>
    </QueryProvider>
  </BrowserRouter>
);