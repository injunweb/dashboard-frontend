import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getUsers } from "../services/admin.service";
import { Container, Title } from "../components/styledComponents";

export const AdminUserListPage = () => {
    const { data, error, isLoading } = useQuery({
        queryKey: ["adminUsers"],
        queryFn: getUsers,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <Container>
            <Title>User List</Title>
            <ul>
                {data?.data?.users?.map((user) => (
                    <li key={user.id}>
                        <Link to={`/admin/users/${user.id}`}>
                            {user.name} - {user.email}
                        </Link>
                    </li>
                ))}
            </ul>
        </Container>
    );
};
