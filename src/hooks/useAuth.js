import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login, register, logout } from "../services/auth";
import { getUser } from "../services/user";
import {
    setAuthToken,
    removeAuthToken,
    isTokenValid,
    isAdmin,
} from "../utils/auth";

export const useAuth = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: user, isLoading: isUserLoading } = useQuery({
        queryKey: ["user"],
        queryFn: getUser,
        enabled: isTokenValid(),
    });

    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            setAuthToken(data.token);
            queryClient.invalidateQueries(["user"]);
            navigate("/applications");
        },
    });

    const registerMutation = useMutation({
        mutationFn: register,
        onSuccess: () => {
            navigate("/login");
        },
    });

    const logoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            removeAuthToken();
            queryClient.clear();
            navigate("/login");
        },
    });

    const isLoggedIn = isTokenValid() && (isUserLoading || !!user);
    const isAdminUser = isLoggedIn && isAdmin(user);

    return {
        user,
        isLoggedIn: isLoggedIn,
        isAdmin: isAdminUser,
        isLoading: isUserLoading,
        login: loginMutation.mutate,
        isLoginLoading: loginMutation.isPending,
        register: registerMutation.mutate,
        isRegisterLoading: registerMutation.isPending,
        logout: logoutMutation.mutate,
    };
};
