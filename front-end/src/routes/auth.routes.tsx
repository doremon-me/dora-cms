import { Navigate, Route } from "react-router-dom";
import ProtectedRoute from "./protected.route";
import Signin from "@/pages/auth/signin";
import { OAuthGoogle } from "@/pages/auth/oauth";

export const AuthRoutes = (isAuthenticated: boolean) => {
  return (
    <Route path="/auth">
      <Route index element={<Navigate to="signin" replace />} />
      <Route
        path="signin"
        element={
          <ProtectedRoute
            type="UNAUTHENTICATED"
            isAuthenticated={isAuthenticated}
          >
            <Signin />
          </ProtectedRoute>
        }
      />
      <Route
        path="google"
        element={
          <ProtectedRoute
            type="UNAUTHENTICATED"
            isAuthenticated={isAuthenticated}
          >
            <OAuthGoogle />
          </ProtectedRoute>
        }
      />
    </Route>
  );
};
