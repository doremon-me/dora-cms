import { apiInstance } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export type User = {
    id: string;
    email: string;
    role: "SUPER_ADMIN" | "ADMIN" | "USER";
    firstname: string;
    lastName: string;
}

const getUser = async (): Promise<User | null> => {
    const response = await apiInstance.get<User>("/auth/verifyuser");
    return response.data;

}

export const useUser = () => {
    return useQuery({
        queryKey: ["user"],
        queryFn: getUser,
    })
}