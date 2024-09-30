import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getUser, updateUser } from "../services/user.service";
import { getApplications } from "../services/application.service";
import { Link } from "react-router-dom";
import {
    Container,
    Title,
    Input,
    Button,
} from "../components/styledComponents";

export const HomePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const {
        data: user,
        isLoading: isUserLoading,
        refetch,
    } = useQuery({
        queryKey: ["user"],
        queryFn: getUser,
    });
    const {
        data: applications,
        error: appError,
        isLoading: isAppLoading,
    } = useQuery({
        queryKey: ["userApplications"],
        queryFn: getApplications,
        enabled: !!user,
    });

    const updateUserMutation = useMutation({
        mutationFn: updateUser,
        onSuccess: refetch,
    });

    const handleUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedInfo = Object.fromEntries(formData.entries());
        updateUserMutation.mutate(updatedInfo);
        setIsEditing(false);
    };

    if (isUserLoading || isAppLoading) return <div>Loading...</div>;
    if (appError)
        return <div>Error loading applications: {appError.message}</div>;

    return (
        <Container>
            <Title>Home</Title>
            <p>
                Current user: {user?.data?.username} - {user?.data?.email}
            </p>
            {isEditing ? (
                <form onSubmit={handleUpdate}>
                    <Input
                        name="username"
                        defaultValue={user?.data?.username}
                        required
                    />
                    <Input
                        name="email"
                        defaultValue={user?.data?.email}
                        required
                    />
                    <Button type="submit">Update</Button>
                    <Button type="button" onClick={() => setIsEditing(false)}>
                        Cancel
                    </Button>
                </form>
            ) : (
                <Button onClick={() => setIsEditing(true)}>Edit</Button>
            )}
            <h2>My Applications</h2>
            <Link to="/applications">Submit a new application</Link>
            {!applications?.data?.applications?.length ? (
                <p>No applications found.</p>
            ) : (
                <ul>
                    {applications?.data?.applications?.map((app) => (
                        <li key={app.id}>
                            {app.status === "Approved" ? (
                                <Link to={`/applications/${app.id}`}>
                                    {app.name}
                                </Link>
                            ) : (
                                <span>
                                    {app.name} - {app.status}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </Container>
    );
};
