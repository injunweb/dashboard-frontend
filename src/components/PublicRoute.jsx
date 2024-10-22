import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PublicRoute = () => {
    const { isLoggedIn } = useAuth();
    const location = useLocation();

    if (isLoggedIn) {
        return (
            <Navigate to="/applications" state={{ from: location }} replace />
        );
    }

    return <Outlet />;
};

export default PublicRoute;
