import {
  Sidebar,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

const DashboardSidebar = () => {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader></SidebarHeader>
      </Sidebar>
      <SidebarInset></SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardSidebar;
