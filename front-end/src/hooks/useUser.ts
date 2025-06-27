import { apiInstance } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export type User = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

const getUser = async (): Promise<User> => {
    const response = await apiInstance.get<User>("/auth/verifyuser");
    return response.data;
}

export const useUser = () => {
    return useQuery({
        queryKey: ["user"],
        queryFn: getUser,
    })
}

const userDetails = async (userId: string) => {
    const response = await apiInstance.get("/users/getUser", { params: { userId } });
    return response.data;
}

export const useUserDetails = (userId: string | null | undefined) => {
    return useQuery({
        queryKey: ["userDetails", userId],
        queryFn: () => userDetails(userId as string),
        enabled: !!userId,
    });
}