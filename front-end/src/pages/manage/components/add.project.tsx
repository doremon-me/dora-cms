import { useForm } from "react-hook-form";
import { useCreateProject } from "../api";
import { projectSchema } from "../validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/loader";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";

const AddProject = ({ children }: { children: React.ReactNode }) => {
  const [isOpened, setIsOpened] = useState(false);
  const projectForm = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { mutate: createProject, isPending, isSuccess } = useCreateProject();

  useEffect(() => {
    if (isSuccess) {
      projectForm.reset();
      setIsOpened(false);
    }
  }, [isSuccess]);

  return (
    <Dialog open={isOpened} onOpenChange={() => setIsOpened(!isOpened)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="overflow-hidden">
        <DialogHeader>
          <DialogTitle className="font-bold">Create New Project</DialogTitle>
          <DialogDescription hidden />
        </DialogHeader>
        <div>
          <Form {...projectForm}>
            <form
              onSubmit={projectForm.handleSubmit((data) => {
                createProject(data);
                projectForm.reset();
              })}
              className="space-y-10"
            >
              <FormField
                control={projectForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project name..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Choose a descriptive name for your project
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={projectForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your project..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a brief description of what this project is about
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex">
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <Loader
                      size="sm"
                      variant="fullscreen"
                      animation="bounce"
                      message="Creating..."
                    />
                  ) : (
                    "Create Project"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" className="w-full">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProject;
