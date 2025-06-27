import { apiInstance } from "@/lib/api"
import { useSuspenseQuery } from "@tanstack/react-query";

const getDashboardLayout = async (projectId: string) => {
    const response = await apiInstance.get("/layouts/dashboard", {
        params: {
            projectId
        }
    });
    return response.data;
}

export const useGetDashboardLayout = (projectId: string) => {
    return useSuspenseQuery({
        queryKey: ["dashboard-layout"],
        queryFn: () => getDashboardLayout(projectId),
    });
}