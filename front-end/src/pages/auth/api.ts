import { apiInstance } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { SigninSchema } from "./validations";
import { type UseFormSetError } from "react-hook-form"
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { queryClient } from "@/provider/query.provider";
import type { User } from "@/hooks/useUser";
import { useNavigate } from "react-router-dom"

const googleOAuthCallback = async (code: string) => {
    const response = await apiInstance.get("/auth/google/callback", {
        params: { code }
    });
    return response.data;
}

export const useGoogleOAuthCallback = (code: string) => {
    return useQuery({
        queryKey: ["googleOAuthCallback", code],
        queryFn: () => googleOAuthCallback(code),
        enabled: !!code,
    })
}

const signinWithEmail = async (data: SigninSchema) => {
    const response = await apiInstance.post("/auth/signin", data);
    return response.data;
}

export const useSigninWithEmail = (setError: UseFormSetError<SigninSchema>) => {
    const navigate = useNavigate();
    return useMutation({
        mutationKey: ["signinWithEmail"],
        mutationFn: signinWithEmail,
        onSuccess: (data: User) => {
            queryClient.setQueryData(["user"], data);
            toast.success("Logged in successfully.");
            navigate("/manage/projects", { replace: true });
        },
        onError: (error: AxiosError) => {
            if (error.status === 404) {
                setError("email", {
                    type: "custom",
                    message: "User not found. Please check your email.",
                });
            }
            else if (error.status === 401) {
                setError("password", {
                    type: "custom",
                    message: "Invalid password. Please try again.",
                });
            }
            else {
                toast.error("An unexpected error occurred. Please try again later.");
            }
        }
    });
}

const logout = async () => {
    const response = await apiInstance.post("/auth/logout");
    return response.data;
}

export const useLogout = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationKey: ['logout'],
        mutationFn: logout,
        onSuccess: () => {
            queryClient.setQueryData(["user"], null);
            toast.success("Logged out successfully.");
            navigate("/auth/signin", { replace: true });
        },
        onError: ({ response }: AxiosError) => {
            const { message } = response?.data as { message: string }
            toast.error(message);
        }
    })
}