import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  children,
  type,
  isAuthenticated,
}: {
  children: React.ReactNode;
  type: "AUTHENTICATED" | "UNAUTHENTICATED";
  isAuthenticated: boolean;
}) => {
  if (type === "AUTHENTICATED" && isAuthenticated) return children;
  if (type === "UNAUTHENTICATED" && !isAuthenticated) return children;
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
