import { Button } from "@/components/ui/button";
import {
  Dialog,
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
import { DialogClose } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { createUserSchema } from "../validation";
import { useCreateUser } from "../api";
import AddRole from "./add.role";
import Loader from "@/components/shared/loader";
import { useEffect, useState } from "react";

const AddUser = ({ children }: { children: React.ReactNode }) => {
  const [isOpened, setIsOpened] = useState(false);
  const addUserForm = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });
  const {
    mutate: createUser,
    isPending,
    isSuccess,
  } = useCreateUser(addUserForm.setError);

  useEffect(() => {
    if (isSuccess) {
      addUserForm.reset();
      setIsOpened(false);
    }
  }, [isSuccess]);

  return (
    <Dialog open={isOpened} onOpenChange={() => setIsOpened(!isOpened)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="overflow-hidden">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription hidden />
        </DialogHeader>
        <Form {...addUserForm}>
          <form
            onSubmit={addUserForm.handleSubmit((data) => {
              createUser(data);
            })}
            className="space-y-4 py-2"
          >
            <div className="flex justify-center gap-5 items-center">
              <FormField
                control={addUserForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} className="flex-1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addUserForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} className="flex-1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={addUserForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@gmail.com"
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <DialogClose className="flex-1" asChild>
                <Button variant="secondary" type="button" className="w-full">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="flex-1" disabled={isPending}>
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
                  "Add User"
                )}
              </Button>
            </div>
          </form>
        </Form>
        <DialogFooter>
          <div className="text-sm text-muted-foreground text-center">
            <p>
              Need to add new role?{" "}
              <AddRole>
                <Button
                  variant="link"
                  className="text-primary underline underline-offset-3 font-semibold hover:text-primary/80"
                >
                  Click here
                </Button>
              </AddRole>
            </p>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUser;
