import NotFound from "@/components/shared/404";
import { OAuthGoogle } from "@/pages/auth/oauth";
import Signin from "@/pages/auth/signin";
import Projects from "@/pages/projects";
import ProjectsLayout from "@/pages/projects/layout";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import ProtectedRoute from "./protected.route";
import { useUser } from "@/hooks/useUser";
import Loader from "@/components/shared/loader";
import CreateProject from "@/pages/projects/create";

const AppRoutes = () => {
  const navigate = useNavigate();
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return (
      <Loader animation="dots" showTrustBadge size="md" variant="fullscreen" />
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={user ? "/projects" : "/auth"} replace />}
      />
      <Route path="/auth">
        <Route index element={<Navigate to="signin" replace />} />
        <Route
          path="signin"
          element={
            <ProtectedRoute
              type="UNAUTHENTICATED"
              isAuthenticated={user !== undefined && user !== null}
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
              isAuthenticated={user !== undefined && user !== null}
            >
              <OAuthGoogle />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route
        path="/projects"
        element={
          <ProtectedRoute
            type="AUTHENTICATED"
            isAuthenticated={user !== undefined && user !== null}
          >
            <ProjectsLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Projects />} />
        <Route path="create" element={<CreateProject />} />
      </Route>
      <Route
        path="*"
        element={
          <NotFound
            icon="FileX"
            title="404 - Not Found"
            variant="fullscreen"
            size="lg"
            showBackButton
            message="Page not found"
            onBack={() => navigate(-1)}
          />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
