import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useUser } from "@/hooks/useUser";
import Icon from "@/lib/icons";
import { Button } from "../ui/button";
import { ConfirmDialog } from "../shared/confirm";
import { useLogout } from "@/pages/auth/api";
import Loader from "../shared/loader";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { useNavigate } from "react-router-dom";

const DashboardSidebar = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading } = useUser();
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();

  if (isLoading || !user) {
    return (
      <Loader animation="dots" showTrustBadge size="md" variant="fullscreen" />
    );
  }

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader className="p-0 cursor-pointer">
          <SidebarMenu>
            <SidebarMenuButton className="flex gap-3 items-center bg-sidebar-accent h-12">
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg font-bold">
                {user.firstName.charAt(0)}
                {user.lastName.charAt(0)}
              </div>
              <div className="leading-tight">
                <span className="font-bold">
                  {user.firstName + " " + user.lastName}
                </span>
                <br />
                <span className="text-sm">{user.email}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent></SidebarContent>
        <SidebarFooter className="p-0">
          <SidebarMenu>
            <Tooltip>
              <TooltipTrigger>
                <SidebarMenuButton className="flex gap-3 items-center bg-sidebar-accent h-12">
                  <Button
                    variant="ghost"
                    className="w-full justify-between font-bold"
                    onClick={() => navigate("/", { replace: true })}
                  >
                    Main Menu <Icon name="Menu" />
                  </Button>
                </SidebarMenuButton>
              </TooltipTrigger>
              <TooltipContent className="bg-background text-foreground">
                <span>Go to main menu</span>
              </TooltipContent>
            </Tooltip>
            <SidebarMenuButton
              className="flex gap-3 items-center bg-sidebar-accent h-12"
              asChild
            >
              <ConfirmDialog
                variant="warning"
                title="Logout"
                description="Are you sure you want to logout?"
                onConfirm={() => logout()}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-between font-bold text-destructive/80"
                >
                  Logout <Icon name="LogOut" />
                </Button>
              </ConfirmDialog>
            </SidebarMenuButton>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="bg-secondary py-3.5 px-2 flex justify-between">
          <SidebarTrigger className="hover:bg-primary hover:text-primary-foreground" />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardSidebar;
