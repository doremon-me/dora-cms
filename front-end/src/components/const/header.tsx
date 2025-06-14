import { useLogout } from "@/pages/auth/api";
import { Button } from "../ui/button";
import { ConfirmDialog } from "../shared/confirm";

const Header = () => {
  const { mutate: logout } = useLogout();
  return (
    <header className="px-4 py-2 rounded-lg bg-secondary">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects</h1>
        <span className="text-sm font-semibold text-foreground/70 max-md:hidden">
          All Projects
        </span>
        <ConfirmDialog
          onConfirm={logout}
          title="Logout"
          description="Are you sure you want to logout."
          variant="warning"
          icon="LogOut"
          cancelText="Cancel"
          confirmText="Logout"
        >
          <Button>Logout</Button>
        </ConfirmDialog>
      </div>
    </header>
  );
};

export default Header;
