import { apiInstance } from "@/lib/api";
import type { GetProjectsSchema, ProjectSchema } from "./validation";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

const createProject = async (project: ProjectSchema) => {
    const response = await apiInstance.post("/projects/create", project);
    return response.data;
}

export const useCreateProject = () => {
    return useMutation({
        mutationKey: ["createProject"],
        mutationFn: createProject,
        onSuccess: (data) => {
            console.log("Project created successfully:", data);
        },
        onError: (error) => {
            console.error("Error adding project:", error);
        }
    })
}

const getProjects = async (params: GetProjectsSchema) => {
    const response = await apiInstance.get("/projects/list", { params });
    return response.data;
}

export const useGetProjects = (params: GetProjectsSchema) => {
    return useQuery({
        queryKey: ["getProjects", params],
        queryFn: () => getProjects(params),
        select: (data) => {
            console.log(data)
            return data;
        },
        throwOnError: ({ response }: AxiosError) => {
            const { message } = response?.data as { message: string, error: string, statusCode: number };
            toast.error(message);
            return false;
        }
    })
}