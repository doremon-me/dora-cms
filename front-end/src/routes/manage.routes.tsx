import { Navigate, Route } from "react-router-dom";
import ProtectedRoute from "./protected.route";

import ManageLayout from "@/pages/manage/layout";
import Projects from "@/pages/manage/projects";
import Users from "@/pages/manage/users";
import Roles from "@/pages/manage/roles";

export const ManageRoutes = (isAuthenticated: boolean) => {
  return (
    <Route
      path="/manage"
      element={
        <ProtectedRoute type="AUTHENTICATED" isAuthenticated={isAuthenticated}>
          <ManageLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="projects" replace />} />
      <Route path="projects" element={<Projects />} />
      <Route path="users" element={<Users />} />
      <Route path="roles" element={<Roles />} />
    </Route>
  );
};
