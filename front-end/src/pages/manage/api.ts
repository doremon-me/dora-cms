import { apiInstance } from "@/lib/api";
import type { CreateRoleSchema, CreateUserSchema, GetProjectsSchema, GetUsersSchema, ProjectSchema } from "./validation";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { queryClient } from "@/provider/query.provider";
import { useNavigate } from "react-router-dom";
import type { UseFormSetError } from "react-hook-form";

export const projectsQueryKeys = {
    all: ['projects'] as const,
    lists: () => [...projectsQueryKeys.all, 'list'] as const,
    list: (params: GetProjectsSchema) => [...projectsQueryKeys.lists(), params] as const,
    details: () => [...projectsQueryKeys.all, 'detail'] as const,
    detail: (id: string) => [...projectsQueryKeys.details(), id] as const,
    search: (query: string) => [...projectsQueryKeys.all, 'search', query] as const,
} as const;

const createProject = async (project: ProjectSchema) => {
    const response = await apiInstance.post("/projects/create", project);
    return response.data;
}

export const useCreateProject = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationKey: ["createProject"],
        mutationFn: createProject,
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: projectsQueryKeys.lists() });
            return;
        },
        onSuccess: async (data) => {
            await queryClient.setQueryData(projectsQueryKeys.detail(data.id), data);
            await queryClient.setQueriesData({ queryKey: projectsQueryKeys.lists() }, (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    data: old.data.map((project: any) =>
                        project.id.startsWith('temp-') ? data : project
                    ),
                };
            });
            toast.success("Project created successfully!");
            navigate(`/dashboard/${data.id}`, { replace: true });
        },
        onError: (error: AxiosError) => {
            const errorMessage = (error.response?.data as any)?.message || error.message || "Failed to create project";
            toast.error(errorMessage);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: projectsQueryKeys.lists() });
        },
    })
}

const getProjects = async (params: GetProjectsSchema) => {
    const response = await apiInstance.get("/projects/list", { params });
    return response.data;
}

export const useGetProjects = (params: GetProjectsSchema) => {
    return useQuery({
        queryKey: projectsQueryKeys.list(params),
        queryFn: () => getProjects(params),
        retry: (failureCount, error) => {
            const axiosError = error as AxiosError;
            if (axiosError.response?.status && axiosError.response.status >= 400 && axiosError.response.status < 500) {
                return false;
            }
            return failureCount < 3;
        },
    })
}

export const usersQueryKeys = {
    all: ['users'] as const,
    lists: () => [...usersQueryKeys.all, 'list'] as const,
    list: (params: GetUsersSchema) => [...usersQueryKeys.lists(), params] as const,
    details: () => [...usersQueryKeys.all, 'detail'] as const,
    detail: (id: string) => [...usersQueryKeys.details(), id] as const,
    search: (query: string) => [...usersQueryKeys.all, 'search', query] as const,
    roles: () => [...usersQueryKeys.all, 'roles'] as const,
    profile: (id: string) => [...usersQueryKeys.all, 'profile', id] as const,
} as const;

const createUser = async (params: CreateUserSchema) => {
    const response = await apiInstance.post("/users/create", params);
    return response.data;
}

export const useCreateUser = (setError: UseFormSetError<CreateUserSchema>) => {
    return useMutation({
        mutationKey: ["createUser"],
        mutationFn: createUser,
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: usersQueryKeys.lists() });
            return;
        },
        onSuccess: async (data) => {
            console.log("User created successfully", data);
        },
        onError: (error: AxiosError) => {
            if (error.status === 409) {
                setError("email", {
                    type: "custom",
                    message: "User already exits with the following email",
                });
            }
            else {
                toast.error("An unexpected error occurred. Please try again later.");
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: usersQueryKeys.lists() });
        }
    })
}

const getUsers = async (params: GetUsersSchema) => {
    const response = await apiInstance.get("/users/list", { params });
    return response.data;
}

export const useGetUsers = (params: GetUsersSchema) => {
    return useQuery({
        queryKey: usersQueryKeys.list(params),
        queryFn: () => getUsers(params),
        retry: (failureCount, error) => {
            const axiosError = error as AxiosError;
            if (axiosError.response?.status && axiosError.response.status >= 400 && axiosError.response.status < 500) {
                return false;
            }
            return failureCount < 3;
        },
    })
}

const getRoles = async () => {
    const response = await apiInstance.get("/roles");
    return response.data;
}

export const useRoles = () => {
    return useQuery({
        queryKey: ["roles"],
        queryFn: getRoles,
    })
}

const createRole = async (params: CreateRoleSchema) => {
    const response = await apiInstance.post('/roles/create', params);
    return response.data;
}

export const useCreateRole = (setError: UseFormSetError<CreateRoleSchema>) => {
    return useMutation({
        mutationKey: ['create_roles'],
        mutationFn: createRole,
        onError: (error: AxiosError) => {
            const responseData = error.response?.data as { message: string; error: string } | undefined;
            const status = error.response?.status;
            if (status === 409) {
                setError("role", {
                    type: "custom",
                    message: responseData?.message || "Role already exists",
                });
            }
            else {
                toast.error("An unexpected error occurred. Please try again later.");
            }
        },
        onSuccess: () => {
            queryClient.refetchQueries({ queryKey: ['roles'] });
            toast.success("Role created successfully!");
        }
    })
}

const getDetailedRoles = async () => {
    const response = await apiInstance.get('/roles/all');
    return response.data;
}

export const useGetDetailedRoles = () => {
    return useQuery({
        queryKey: ['roles', 'all'],
        queryFn: getDetailedRoles,
    })
}