import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/lib/icons";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetDetailedRoles } from "./api";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime } from "@/lib/formate";
import { Pages } from "@/components/shared/pages";
import AddRole from "./components/add.role";

const Roles = () => {
  const [searchParams, setSearchParams] = useState<{
    limit: number;
    sortBy: string;
    sort: "asc" | "desc";
    search: string;
    page: number;
  }>({
    limit: 8,
    sortBy: "createdAt",
    sort: "desc",
    search: "",
    page: 1,
  });
  const { data: roles, isLoading, error } = useGetDetailedRoles();
  console.log(roles);

  return (
    <div>
      <div className="space-y-10">
        <div className="flex gap-5 items-center justify-center pt-5">
          <div className="w-full max-w-[400px] flex items-center justify-center">
            <div className="flex items-center justify-center w-10 h-9 bg-muted rounded-l-md border-[1px] p-2.5">
              <Icon name="Search" />
            </div>
            <Input
              placeholder="Search role..."
              className="w-full rounded-l-none border-l-0"
              // value={searchValue}
              // onChange={handleSearchChange}
            />
          </div>
          <AddRole>
            <Button variant="secondary">
              <Icon name="Plus" size={16} className="mr-2" />
              Add Role
            </Button>
          </AddRole>
        </div>
        <section>
          <Table>
            <TableCaption>A list of the users.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">S.No.</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Is Active</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            {/* <TableBody>
              {isLoading ? (
                Array.from({ length: searchParams.limit }).map(
                  (_, index: number) => <UserTableRowSkeleton key={index} />
                )
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center text-muted-foreground">
                      <Icon name="AlertCircle" size={24} className="mb-2" />
                      <p>Failed to load users</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                roles &&
                roles.data.length > 0 &&
                roles.data.map((user: UserTableRow, index: number) => {
                  return (
                    <RoleTableRow key={user.id} user={user} index={++index} />
                  );
                })
              )}
            </TableBody> */}
          </Table>
          {/* <Pages
            currentPage={searchParams.page}
            itemsPerPage={searchParams.limit}
            totalItems={roles?.total || 0}
            onPageChange={(page: number) => {
              setSearchParams((prev) => {
                return {
                  ...prev,
                  page: page,
                };
              });
            }}
          /> */}
        </section>
      </div>
    </div>
  );
};

interface UserTableRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  isDeleted: boolean;
}

const RoleTableRow = ({
  user,
  index,
}: {
  index: number;
  user: UserTableRow;
}) => {
  return (
    <TableRow className="font-medium">
      <TableCell>{index}</TableCell>
      <TableCell
        className={`${user.isDeleted && "line-through text-muted-foreground"}`}
      >
        {user.firstName + " " + user.firstName}
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.role}</TableCell>
      <TableCell>
        <Switch checked={user.isActive} />
      </TableCell>
      <TableCell>{formatDateTime(user.createdAt)}</TableCell>
      <TableCell className="space-x-3">
        <Tooltip>
          <TooltipTrigger>
            <Icon name="Edit" size={20} />
          </TooltipTrigger>
          <TooltipContent>
            <span>Edit user</span>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <Icon name="Trash" size={20} className="text-destructive/70" />
          </TooltipTrigger>
          <TooltipContent>
            <span>Delete user</span>
          </TooltipContent>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

const UserTableRowSkeleton = () => {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-4 w-8" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-48" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-20 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-12 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell className="space-x-3">
        <div className="flex space-x-3">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-5 w-5 rounded" />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default Roles;
