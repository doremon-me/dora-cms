import { useLogout } from "@/pages/auth/api";
import { ConfirmDialog } from "../shared/confirm";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useUser } from "@/hooks/useUser";
import Icon from "@/lib/icons";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Header = () => {
  const { mutate: logout } = useLogout();
  const { data: user } = useUser();

  return (
    <header className="sticky z-50 top-0 bg-background/95 backdrop-blur-sm border-b transition-all duration-300">
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Icon name="FolderOpen" size={20} className="text-primary" />
          <h2 className="font-semibold text-lg">Projects</h2>
        </div>
        <div className="flex items-center gap-4">
          <nav>
            <ul className="flex items-center gap-6 font-bold group text-sm">
              <li className="group-hover:blur-[1px] hover:blur-none transition-all hover:text-primary hover:underline underline-offset-4 decoration-2">
                <Link to="/manage/projects">Projects</Link>
              </li>
              <li className="group-hover:blur-[1px] hover:blur-none transition-all hover:text-primary hover:underline underline-offset-4 decoration-2">
                <Link to="/manage/users">Users</Link>
              </li>
              <li className="group-hover:blur-[1px] hover:blur-none transition-all hover:text-primary hover:underline underline-offset-4 decoration-2">
                <Link to="/manage/roles">Roles</Link>
              </li>
            </ul>
          </nav>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt={user?.firstName + " " + user?.lastName}
                />
                <AvatarFallback>
                  {user?.firstName + " " + user?.lastName}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52 font-medium">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-foreground/40 text-xs font-medium">
                  User profile
                </DropdownMenuLabel>
                <DropdownMenuItem className="flex items-center justify-between">
                  <span>Profile</span>
                  <Icon name="User" />
                </DropdownMenuItem>
                <ConfirmDialog
                  cancelText="Cancel"
                  confirmText="Logout"
                  title="Logout"
                  description="Are you sure you want to logout?"
                  onConfirm={logout}
                  variant="warning"
                >
                  <DropdownMenuItem
                    className="flex items-center justify-between"
                    onSelect={(event) => event.preventDefault()}
                  >
                    <span>Logout</span>
                    <Icon name="LogOut" />
                  </DropdownMenuItem>
                </ConfirmDialog>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
