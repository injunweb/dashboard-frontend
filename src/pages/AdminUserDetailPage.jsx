import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUser, getApplications } from "../services/admin.service";
import { Container, Title } from "../components/styledComponents";

export const AdminUserDetailPage = () => {
    const { userId } = useParams();
    const { data: user, isLoading: userLoading } = useQuery({
        queryKey: ["user", userId],
        queryFn: () => getUser(userId),
    });
    const { data: applications, isLoading: appLoading } = useQuery({
        queryKey: ["userApplications", userId],
        queryFn: () => getApplications(userId),
        enabled: !!user,
    });

    if (userLoading || appLoading) return <div>Loading...</div>;

    return (
        <Container>
            <Title>User Detail: {user?.data?.username}</Title>
            <h2>Applications</h2>
            <ul>
                {applications?.data?.applications?.map((app) => (
                    <li key={app.id}>
                        <Link to={`/admin/applications/${app.id}`}>
                            {app.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </Container>
    );
};
