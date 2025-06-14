import { ConfirmDialog } from "@/components/shared/confirm";
import { Button } from "@/components/ui/button";
import { useLogout } from "../auth/api";
import Icon from "@/lib/icons";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema } from "./validation";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProject } from "./api";
import Loader from "@/components/shared/loader";

const CreateProject = () => {
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();
  const projectForm = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { mutate: createProject, isPending } = useCreateProject();

  return (
    <div className="space-y-4">
      <header className="sticky z-50 top-0 bg-background/95 backdrop-blur-sm border-b transition-all duration-300 flex justify-between items-center py-3">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <Icon name="ArrowBigLeft" />
          Back
        </Button>
        <ConfirmDialog
          cancelText="Cancel"
          confirmText="Logout"
          title="Logout"
          description="Are you sure you want to logout?"
          onConfirm={logout}
          variant="warning"
        >
          <Button>Logout</Button>
        </ConfirmDialog>
      </header>
      <div className="space-y-10">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl">Create New Project</CardTitle>
            <CardDescription>
              Fill in the details below to create a new project.
              <br />
              Fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...projectForm}>
              <form
                onSubmit={projectForm.handleSubmit((data) =>
                  createProject(data)
                )}
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
                        Provide a brief description of what this project is
                        about
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
                        variant="inline"
                        animation="spin"
                        message="Creating..."
                      />
                    ) : (
                      "Create Project"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateProject;
