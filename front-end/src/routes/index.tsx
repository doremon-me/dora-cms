import NotFound from "@/components/shared/404";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useUser, useUserDetails } from "@/hooks/useUser";
import Loader from "@/components/shared/loader";
import { AuthRoutes } from "./auth.routes";
import { ManageRoutes } from "./manage.routes";
import { DashboardRoutes } from "./dashboard.routes";

const AppRoutes = () => {
  const navigate = useNavigate();
  const { data: user, isLoading: fetchingUser } = useUser();
  const {
    data: userDetails,
    isLoading: fetchingDetails,
    isFetched: isFetchedDetails,
    isError,
  } = useUserDetails(user?.id);

  if (fetchingUser || fetchingDetails) {
    return (
      <Loader animation="dots" showTrustBadge size="md" variant="fullscreen" />
    );
  }

  if (isError && user) {
    return (
      <NotFound
        icon="AlertTriangle"
        message="You do not have app access"
        title="Unauthorized"
        variant="fullscreen"
        size="md"
        showBackButton={false}
      />
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={user ? "/manage" : "/auth"} replace />}
      />
      {AuthRoutes(user !== undefined && user !== null)}
      {ManageRoutes(user !== undefined && user !== null)}
      {DashboardRoutes(user !== undefined && user !== null)}
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
