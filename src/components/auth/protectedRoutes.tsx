import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { PageLoader } from "../ui";


export default function ProtectedRoute() {

  const {
    user,
    loading,
  } = useAuth();


  if (loading) {

    return (

      <PageLoader />

    );

  }


  if (!user) {

    return (

      <Navigate
        to="/login"
        replace
      />

    );

  }


  return <Outlet />;

}