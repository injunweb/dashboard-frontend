import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ApplicationDetailPage } from "./pages/ApplicationDetailPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AdminUserListPage } from "./pages/AdminUserListPage";
import { AdminUserDetailPage } from "./pages/AdminUserDetailPage";
import { AdminApplicationDetailPage } from "./pages/AdminApplicationDetailPage";
import { ApplicationSubmitPage } from "./pages/ApplicationSubmitPage";
import { isLoggedIn, isAdmin } from "./utils/auth";

const PrivateRoute = ({ element }) => {
    return isLoggedIn() ? element : <Navigate to="/login" />;
};

const AdminRoute = ({ element }) => {
    return isLoggedIn() && isAdmin() ? element : <Navigate to="/" />;
};

const PublicRoute = ({ element }) => {
    return isLoggedIn() ? <Navigate to="/" /> : element;
};

export const router = createBrowserRouter([
    {
        path: "/",
        element: PrivateRoute({ element: <HomePage /> }),
    },
    {
        path: "/login",
        element: PublicRoute({ element: <LoginPage /> }),
    },
    {
        path: "/register",
        element: PublicRoute({ element: <RegisterPage /> }),
    },
    {
        path: "/applications/:appId",
        element: PrivateRoute({ element: <ApplicationDetailPage /> }),
    },
    {
        path: "/applications",
        element: PrivateRoute({ element: <ApplicationSubmitPage /> }),
    },
    {
        path: "/admin/users",
        element: AdminRoute({ element: <AdminUserListPage /> }),
    },
    {
        path: "/admin/users/:userId",
        element: AdminRoute({ element: <AdminUserDetailPage /> }),
    },
    {
        path: "/admin/applications/:appId",
        element: AdminRoute({ element: <AdminApplicationDetailPage /> }),
    },
    {
        path: "*",
        element: <Navigate to="/" />,
    },
]);
