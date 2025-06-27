import DashboardSidebar from "@/components/const/sidebar";
import { Outlet, useParams } from "react-router-dom";
import { useGetDashboardLayout } from "./api";

const DashboardLayout = () => {
  const params = useParams<{ projectId: string }>();
  const { data: layout } = useGetDashboardLayout(params.projectId || "");
  return (
    <DashboardSidebar>
      <main>
        <Outlet />
      </main>
    </DashboardSidebar>
  );
};

export default DashboardLayout;
