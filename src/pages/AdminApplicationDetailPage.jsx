import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import {
    getApplication,
    approveApplication,
    cancelApproveApplication,
    updatePrimaryHostname,
} from "../services/admin";
import Loading from "../components/Loading";
import {
    GitBranch,
    ArrowLeft,
    Clock,
    Check,
    X,
    Globe,
    Edit2,
    Save,
} from "lucide-react";

const AdminApplicationDetailPage = () => {
    const { appId } = useParams();
    const queryClient = useQueryClient();
    const [isEditingHostname, setIsEditingHostname] = useState(false);
    const [newPrimaryHostname, setNewPrimaryHostname] = useState("");
    const [hostnameError, setHostnameError] = useState("");

    const {
        data: application,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["adminApplication", appId],
        queryFn: () => getApplication(appId),
    });

    const approveMutation = useMutation({
        mutationFn: approveApplication,
        onSuccess: () => {
            queryClient.invalidateQueries(["adminApplication", appId]);
        },
    });

    const cancelApproveMutation = useMutation({
        mutationFn: cancelApproveApplication,
        onSuccess: () => {
            queryClient.invalidateQueries(["adminApplication", appId]);
        },
    });

    const updateHostnameMutation = useMutation({
        mutationFn: (hostname) => updatePrimaryHostname(appId, hostname),
        onSuccess: () => {
            queryClient.invalidateQueries(["adminApplication", appId]);
            setIsEditingHostname(false);
            setHostnameError("");
        },
        onError: (error) => {
            setHostnameError(
                error.response?.error || "호스트네임 업데이트 실패"
            );
        },
    });

    const handleEditHostname = () => {
        setNewPrimaryHostname(application.primary_hostname);
        setIsEditingHostname(true);
        setHostnameError("");
    };

    const handleSaveHostname = () => {
        if (!newPrimaryHostname.trim()) {
            setHostnameError("호스트네임을 입력해주세요.");
            return;
        }
        updateHostnameMutation.mutate(newPrimaryHostname);
    };

    const handleCancelEdit = () => {
        setIsEditingHostname(false);
        setHostnameError("");
    };

    if (isLoading) return <Loading />;
    if (isError) return <ErrorDisplay message={error.message} />;

    return (
        <Container>
            <Header>
                <Title>애플리케이션 상세</Title>
                <BackLink to="/admin/applications">
                    <ArrowLeft size={16} />
                    애플리케이션 목록으로 돌아가기
                </BackLink>
            </Header>
            <ContentWrapper>
                <Card>
                    <AppNameRow>
                        <AppName>{application.name}</AppName>
                        <AppStatus status={application.status}>
                            {application.status}
                        </AppStatus>
                    </AppNameRow>
                    <DetailGrid>
                        <DetailItem>
                            <DetailLabel>소유자</DetailLabel>
                            <DetailValue>
                                {application.owner_username}
                            </DetailValue>
                        </DetailItem>
                        <DetailItem>
                            <DetailLabel>소유자 ID</DetailLabel>
                            <DetailValue>{application.owner_id}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                            <DetailLabel>GIT URL</DetailLabel>
                            <DetailValue>{application.git_url}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                            <DetailLabel>BRANCH</DetailLabel>
                            <DetailValue>{application.branch}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                            <DetailLabel>PORT</DetailLabel>
                            <DetailValue>{application.port}</DetailValue>
                        </DetailItem>
                        <DetailItem>
                            <DetailLabel>PRIMARY HOSTNAME</DetailLabel>
                            {isEditingHostname ? (
                                <HostnameEditContainer>
                                    <HostnameInput
                                        type="text"
                                        value={newPrimaryHostname}
                                        onChange={(e) =>
                                            setNewPrimaryHostname(
                                                e.target.value
                                            )
                                        }
                                        placeholder="새로운 호스트네임 입력"
                                    />
                                    <HostnameEditButtons>
                                        <HostnameEditButton
                                            onClick={handleSaveHostname}
                                            disabled={
                                                updateHostnameMutation.isPending
                                            }
                                        >
                                            {updateHostnameMutation.isPending ? (
                                                "저장 중..."
                                            ) : (
                                                <>
                                                    <Save size={14} />
                                                    저장
                                                </>
                                            )}
                                        </HostnameEditButton>
                                        <HostnameCancelButton
                                            onClick={handleCancelEdit}
                                        >
                                            <X size={14} />
                                            취소
                                        </HostnameCancelButton>
                                    </HostnameEditButtons>
                                    {hostnameError && (
                                        <HostnameError>
                                            {hostnameError}
                                        </HostnameError>
                                    )}
                                </HostnameEditContainer>
                            ) : (
                                <HostnameDisplay>
                                    <DetailValue>
                                        {application.primary_hostname}
                                    </DetailValue>
                                    <EditHostnameButton
                                        onClick={handleEditHostname}
                                    >
                                        <Edit2 size={14} />
                                    </EditHostnameButton>
                                </HostnameDisplay>
                            )}
                        </DetailItem>
                    </DetailGrid>
                    <ExtraHostnames>
                        <DetailLabel>EXTRA HOSTNAMES</DetailLabel>
                        <HostnameList>
                            {application.extra_hostnames?.map((hostname) => (
                                <HostnameItem key={hostname}>
                                    <Globe size={14} />
                                    <HostnameText>{hostname}</HostnameText>
                                </HostnameItem>
                            ))}
                            {(!application.extra_hostnames ||
                                application.extra_hostnames.length === 0) && (
                                <NoHostnames>
                                    등록된 추가 호스트네임이 없습니다.
                                </NoHostnames>
                            )}
                        </HostnameList>
                    </ExtraHostnames>
                    <CardFooter>
                        <RepoLink
                            href={application.git_url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <GitBranch size={14} />
                            Repository
                        </RepoLink>
                        <CreatedAt>
                            <Clock size={14} />
                            {application.creation_date}
                        </CreatedAt>
                    </CardFooter>
                    <Description>{application.description}</Description>
                    {(application.status === "Pending" ||
                        application.status === "Approved") && (
                        <ActionButtons>
                            {application.status === "Pending" && (
                                <ApproveButton
                                    onClick={() =>
                                        approveMutation.mutate(appId)
                                    }
                                    disabled={approveMutation.isPending}
                                >
                                    <Check size={18} />
                                    승인
                                </ApproveButton>
                            )}
                            {application.status === "Approved" && (
                                <CancelButton
                                    onClick={() =>
                                        cancelApproveMutation.mutate(appId)
                                    }
                                    disabled={cancelApproveMutation.isPending}
                                >
                                    <X size={18} />
                                    승인 취소
                                </CancelButton>
                            )}
                        </ActionButtons>
                    )}
                </Card>
            </ContentWrapper>
        </Container>
    );
};

const Container = styled.div`
    max-width: 1000px;
    margin: 0 auto;
    padding: 40px 20px;
    color: #ffffff;
    min-height: 100vh;
    font-family: "Arial", sans-serif;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
`;

const Title = styled.h1`
    font-size: 28px;
    color: #ffffff;
    font-weight: 600;
`;

const BackLink = styled(Link)`
    display: flex;
    align-items: center;
    gap: 8px;
    color: #3a86ff;
    text-decoration: none;
    font-size: 14px;
    &:hover {
        text-decoration: underline;
    }
`;

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

const Card = styled.div`
    background-color: #1a1a1a;
    border-radius: 10px;
    padding: 24px;
    border: 1px solid #2a2a2a;
    transition: all 0.3s ease-in-out;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
`;

const AppNameRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

const AppName = styled.h3`
    font-size: 24px;
    color: #f0f0f0;
    margin: 0;
`;

const AppStatus = styled.span`
    padding: 4px 8px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    background-color: ${(props) => {
        switch (props.status.toLowerCase()) {
            case "approved":
                return "rgba(16, 185, 129, 0.2)";
            case "pending":
                return "rgba(245, 158, 11, 0.2)";
            default:
                return "rgba(239, 68, 68, 0.2)";
        }
    }};
    color: ${(props) => {
        switch (props.status.toLowerCase()) {
            case "approved":
                return "#10b981";
            case "pending":
                return "#f59e0b";
            default:
                return "#ef4444";
        }
    }};
`;

const DetailGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 20px;
`;

const DetailItem = styled.div`
    display: flex;
    flex-direction: column;
`;

const DetailLabel = styled.span`
    color: #a0a0a0;
    font-size: 14px;
    margin-bottom: 4px;
`;

const DetailValue = styled.span`
    color: #ffffff;
    font-size: 16px;
    font-weight: 500;
    word-break: break-all;
`;

const ExtraHostnames = styled.div`
    margin-bottom: 20px;
`;

const HostnameList = styled.div`
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const HostnameItem = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: #2a2a2a;
    padding: 8px 12px;
    border-radius: 6px;
`;

const HostnameText = styled.span`
    color: #ffffff;
    font-size: 14px;
`;

const NoHostnames = styled.div`
    color: #a0a0a0;
    font-size: 14px;
    padding: 8px 12px;
`;

const CardFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #2a2a2a;
`;

const RepoLink = styled.a`
    display: flex;
    align-items: center;
    gap: 5px;
    color: #3a86ff;
    text-decoration: none;
    font-size: 14px;
    transition: color 0.2s;

    &:hover {
        color: #2f74e0;
    }
`;

const CreatedAt = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    color: #6b7280;
    font-size: 12px;
`;

const Description = styled.p`
    margin-top: 20px;
    color: #a0a0a0;
    font-size: 14px;
    line-height: 1.6;
`;

const ActionButtons = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid #2a2a2a;
`;

const ButtonBase = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s ease-in-out;

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    &:hover:not(:disabled) {
        transform: translateY(-2px);
    }
`;

const ApproveButton = styled(ButtonBase)`
    background-color: #10b981;
    color: #ffffff;

    &:hover:not(:disabled) {
        background-color: #059669;
    }
`;

const CancelButton = styled(ButtonBase)`
    background-color: #ef4444;
    color: #ffffff;

    &:hover:not(:disabled) {
        background-color: #dc2626;
    }
`;

const HostnameEditContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const HostnameInput = styled.input`
    padding: 8px 12px;
    background-color: #2a2a2a;
    border: 1px solid #3a3a3a;
    border-radius: 6px;
    color: #ffffff;
    font-size: 14px;
    width: 100%;

    &:focus {
        outline: none;
        border-color: #3a86ff;
    }
`;

const HostnameEditButtons = styled.div`
    display: flex;
    gap: 8px;
`;

const HostnameEditButton = styled.button`
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    background-color: #3a86ff;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.2s ease-in-out;

    &:hover:not(:disabled) {
        background-color: #2f74e0;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const HostnameCancelButton = styled(HostnameEditButton)`
    background-color: #2a2a2a;

    &:hover {
        background-color: #3a3a3a;
    }
`;

const HostnameDisplay = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const EditHostnameButton = styled.button`
    background: none;
    border: none;
    padding: 4px;
    color: #3a86ff;
    cursor: pointer;
    display: flex;
    align-items: center;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;

    &:hover {
        color: #2f74e0;
    }

    ${DetailItem}:hover & {
        opacity: 1;
    }
`;

const HostnameError = styled.div`
    color: #ef4444;
    font-size: 12px;
    margin-top: 4px;
`;

const ErrorDisplay = styled.div`
    color: #ef4444;
    background-color: rgba(239, 68, 68, 0.1);
    border: 1px solid #ef4444;
    border-radius: 8px;
    padding: 16px;
    margin: 20px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
`;

export default AdminApplicationDetailPage;
