import DashboardLayout from "@/pages/dashboard/layout";
import { Route } from "react-router-dom";
import ProtectedRoute from "./protected.route";

export const DashboardRoutes = (isAuthenticate: boolean) => {
  return (
    <Route
      path="/dashboard/:projectId"
      element={
        <ProtectedRoute isAuthenticated={isAuthenticate} type="AUTHENTICATED">
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route
        index
        element={
          <div className="flex items-center justify-center h-full">
            Dashboard Home
          </div>
        }
      />
    </Route>
  );
};
