import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createRoleSchema } from "../validation";
import { useCreateRole } from "../api";
import { useEffect, useState } from "react";
import Loader from "@/components/shared/loader";

const AddRole = ({ children }: { children: React.ReactNode }) => {
  const [isOpened, setIsOpened] = useState(false);
  const addRoleForm = useForm({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      role: "",
    },
  });
  const {
    mutate: addRoles,
    isSuccess,
    isPending,
  } = useCreateRole(addRoleForm.setError);

  useEffect(() => {
    if (isSuccess) {
        addRoleForm.reset();
        setIsOpened(false);
    }
  }, [isSuccess]);

  return (
    <Dialog open={isOpened} onOpenChange={() => setIsOpened(!isOpened)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="overflow-hidden">
        <DialogHeader>
          <DialogTitle>Add new role</DialogTitle>
          <DialogDescription hidden />
        </DialogHeader>
        <Form {...addRoleForm}>
          <form onSubmit={addRoleForm.handleSubmit((e) => addRoles(e))}>
            <FormField
              control={addRoleForm.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Role" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="flex items-center w-full gap-2">
          <DialogClose asChild className="flex-1">
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button
            className="flex-1"
            onClick={addRoleForm.handleSubmit((e) => addRoles(e))}
            disabled={isPending}
          >
            {isPending ? (
              <Loader
                animation="bounce"
                showTrustBadge={false}
                size="sm"
                variant="fullscreen"
                className="text-white"
                message="Adding Role..."
              />
            ) : (
              "Add Role"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddRole;
