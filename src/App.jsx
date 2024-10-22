import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ApplicationListPage from "./pages/ApplicationListPage";
import ProfilePage from "./pages/ProfilePage";
import ApplicationDetailPage from "./pages/ApplicationDetailPage";
import ApplicationSubmitPage from "./pages/ApplicationSubmitPage";
import NotificationsPage from "./pages/NotificationsPage";
import AdminUserListPage from "./pages/AdminUserListPage";
import AdminUserDetailPage from "./pages/AdminUserDetailPage";
import AdminApplicationDetailPage from "./pages/AdminApplicationDetailPage";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PublicRoute from "./components/PublicRoute";
import AdminApplicationListPage from "./pages/AdminApplicationListPage.jsx";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
    return (
        <>
            <Routes>
                {/* 퍼블릭 라우트 */}
                <Route element={<PublicRoute></PublicRoute>}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>

                {/* 프라이빗 라우트 */}
                <Route
                    element={
                        <PrivateRoute>
                            <DashboardLayout />
                        </PrivateRoute>
                    }
                >
                    <Route
                        path="/"
                        element={<Navigate to="/applications" replace />}
                    />
                    <Route
                        path="/applications"
                        element={<ApplicationListPage />}
                    />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route
                        path="/applications/:appId"
                        element={<ApplicationDetailPage />}
                    />
                    <Route
                        path="/applications/new"
                        element={<ApplicationSubmitPage />}
                    />
                    <Route
                        path="/notifications"
                        element={<NotificationsPage />}
                    />

                    {/* 어드민 라우트 */}
                    <Route
                        path="/admin/users"
                        element={
                            <PrivateRoute requireAdmin>
                                <AdminUserListPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/users/:userId"
                        element={
                            <PrivateRoute requireAdmin>
                                <AdminUserDetailPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/applications"
                        element={
                            <PrivateRoute requireAdmin>
                                <AdminApplicationListPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/admin/applications/:appId"
                        element={
                            <PrivateRoute requireAdmin>
                                <AdminApplicationDetailPage />
                            </PrivateRoute>
                        }
                    />
                </Route>

                {/* 404 페이지 */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <ToastContainer />
        </>
    );
};

export default App;
