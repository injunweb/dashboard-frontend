import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import {
    getApplication,
    deleteApplication,
    addExtraHostname,
    deleteExtraHostname,
} from "../services/application";
import { getEnvironments, updateEnvironment } from "../services/environment";
import Loading from "../components/Loading";
import {
    Eye,
    EyeOff,
    Trash2,
    Plus,
    Save,
    X,
    ArrowLeft,
    GitBranch,
    Clock,
    Loader,
    AlertTriangle,
    MoreVertical,
    Globe,
    Info,
} from "lucide-react";

export const ApplicationDetailPage = () => {
    const { appId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    const {
        data: applicationData,
        error: appError,
        isLoading: appLoading,
    } = useQuery({
        queryKey: ["application", appId],
        queryFn: () => getApplication(appId),
    });

    const isPending = applicationData?.status.toLowerCase() === "pending";

    const {
        data: environmentsData,
        error: envError,
        isLoading: envLoading,
        refetch,
    } = useQuery({
        queryKey: ["applicationEnvironments", appId],
        queryFn: () => getEnvironments(appId),
        enabled: !isPending,
    });

    const [environments, setEnvironments] = useState([]);
    const [newEnvKey, setNewEnvKey] = useState("");
    const [newEnvValue, setNewEnvValue] = useState("");
    const [visibleFields, setVisibleFields] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [newHostname, setNewHostname] = useState("");
    const [showHostnameInfo, setShowHostnameInfo] = useState(false);

    const updateEnvironmentsMutation = useMutation({
        mutationFn: (updatedEnvs) => updateEnvironment(appId, updatedEnvs),
        onSuccess: () => {
            refetch();
            resetNewEnvInputs();
            setSuccessMessage("환경 변수가 성공적으로 업데이트되었습니다.");
            setErrorMessage("");
            setTimeout(() => setSuccessMessage(""), 3000);
        },
        onError: (error) => {
            setErrorMessage(error.response?.error || "환경 변수 업데이트 실패");
            setSuccessMessage("");
            setTimeout(() => setErrorMessage(""), 3000);
        },
    });

    const deleteApplicationMutation = useMutation({
        mutationFn: deleteApplication,
        onSuccess: () => {
            navigate("/applications");
        },
        onError: (error) => {
            setErrorMessage(error.response?.error || "애플리케이션 삭제 실패");
            setTimeout(() => setErrorMessage(""), 3000);
        },
    });

    const addHostnameMutation = useMutation({
        mutationFn: (hostname) => addExtraHostname(appId, hostname),
        onSuccess: () => {
            queryClient.invalidateQueries(["application", appId]);
            setNewHostname("");
            setSuccessMessage("호스트네임이 성공적으로 추가되었습니다.");
            setTimeout(() => setSuccessMessage(""), 3000);
        },
        onError: (error) => {
            setErrorMessage(error.response?.error || "호스트네임 추가 실패");
            setTimeout(() => setErrorMessage(""), 3000);
        },
    });

    const deleteHostnameMutation = useMutation({
        mutationFn: (hostname) => deleteExtraHostname(appId, hostname),
        onSuccess: () => {
            queryClient.invalidateQueries(["application", appId]);
            setSuccessMessage("호스트네임이 성공적으로 삭제되었습니다.");
            setTimeout(() => setSuccessMessage(""), 3000);
        },
        onError: (error) => {
            setErrorMessage(error.response?.error || "호스트네임 삭제 실패");
            setTimeout(() => setErrorMessage(""), 3000);
        },
    });

    useEffect(() => {
        if (environmentsData?.environments) {
            setEnvironments(environmentsData.environments);
        }
    }, [environmentsData]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (appLoading) return <Loading />;
    if (appError || !applicationData) {
        return <ErrorDisplay message="Application Not Found" />;
    }

    const application = applicationData;

    const handleInputChange = (key, value) => {
        setEnvironments((prev) =>
            prev.map((env) => (env.key === key ? { ...env, value } : env))
        );
    };

    const handleDeleteEnv = (key) => {
        setEnvironments((prev) => prev.filter((env) => env.key !== key));
    };

    const handleAddEnv = () => {
        if (newEnvKey && newEnvValue) {
            const existingEnv = environments.find(
                (env) => env.key === newEnvKey
            );
            if (existingEnv) {
                setErrorMessage("키가 이미 존재합니다. 다른 키를 선택하세요.");
                setTimeout(() => setErrorMessage(""), 3000);
                return;
            }
            setEnvironments((prev) => [
                ...prev,
                { key: newEnvKey, value: newEnvValue },
            ]);
            resetNewEnvInputs();
            setErrorMessage("");
        }
    };

    const handleUpdate = () => {
        const updatedEnvs = {
            environments: environments.filter(({ value }) => value !== null),
        };

        if (newEnvKey && newEnvValue) {
            const existingEnv = environments.find(
                (env) => env.key === newEnvKey
            );
            if (!existingEnv) {
                updatedEnvs.environments.push({
                    key: newEnvKey,
                    value: newEnvValue,
                });
            }
        }

        updateEnvironmentsMutation.mutate(updatedEnvs);
    };

    const toggleVisibility = (key) => {
        setVisibleFields((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleCancel = () => {
        setEnvironments(environmentsData?.environments || []);
        resetNewEnvInputs();
    };

    const resetNewEnvInputs = () => {
        setNewEnvKey("");
        setNewEnvValue("");
    };

    const handleMenuToggle = () => {
        setShowMenu(!showMenu);
    };

    const handleDeleteClick = () => {
        setShowMenu(false);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = () => {
        deleteApplicationMutation.mutate(appId);
    };

    const handleAddHostname = () => {
        if (newHostname) {
            addHostnameMutation.mutate(newHostname);
        }
    };

    const handleDeleteHostname = (hostname) => {
        deleteHostnameMutation.mutate(hostname);
    };

    return (
        <Container>
            <Header>
                <Title>애플리케이션 상세</Title>
                <BackLink to="/applications">
                    <ArrowLeft size={16} />
                    애플리케이션 목록으로 돌아가기
                </BackLink>
            </Header>
            <ContentWrapper>
                <Card>
                    <CardHeader>
                        <CardTitle>애플리케이션 정보</CardTitle>
                        <MenuWrapper ref={menuRef}>
                            <MenuButton onClick={handleMenuToggle}>
                                <MoreVertical size={20} />
                            </MenuButton>
                            {showMenu && (
                                <Menu>
                                    <MenuItem onClick={handleDeleteClick}>
                                        <Trash2 size={16} />
                                        애플리케이션 삭제
                                    </MenuItem>
                                </Menu>
                            )}
                        </MenuWrapper>
                    </CardHeader>
                    <AppNameRow>
                        <AppName>{application.name}</AppName>
                        <AppStatus status={application.status}>
                            {application.status}
                        </AppStatus>
                    </AppNameRow>
                    <DetailGrid>
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
                            <DetailValue>
                                {application.primary_hostname}
                            </DetailValue>
                        </DetailItem>
                    </DetailGrid>
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
                            {new Date(
                                application.created_at
                            ).toLocaleDateString()}
                        </CreatedAt>
                    </CardFooter>
                    <Description>{application.description}</Description>
                </Card>

                {!isPending && (
                    <Card>
                        <CardTitle>환경 변수</CardTitle>
                        {envLoading ? (
                            <Loading />
                        ) : envError ? (
                            <ErrorMessage>
                                환경 변수를 불러오는데 실패했습니다.
                            </ErrorMessage>
                        ) : (
                            <>
                                <EnvironmentList>
                                    {environments.map((env) => (
                                        <EnvironmentItem key={env.key}>
                                            <EnvInput
                                                type="text"
                                                value={env.key}
                                                readOnly
                                            />
                                            <EnvInput
                                                type={
                                                    visibleFields[env.key]
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={env.value}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        env.key,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <IconButton
                                                onClick={() =>
                                                    toggleVisibility(env.key)
                                                }
                                            >
                                                {visibleFields[env.key] ? (
                                                    <EyeOff size={18} />
                                                ) : (
                                                    <Eye size={18} />
                                                )}
                                            </IconButton>
                                            <IconButton
                                                onClick={() =>
                                                    handleDeleteEnv(env.key)
                                                }
                                            >
                                                <Trash2 size={18} />
                                            </IconButton>
                                        </EnvironmentItem>
                                    ))}
                                </EnvironmentList>
                                <AddEnvForm>
                                    <EnvInput
                                        type="text"
                                        placeholder="새 키"
                                        value={newEnvKey}
                                        onChange={(e) =>
                                            setNewEnvKey(e.target.value)
                                        }
                                    />
                                    <EnvInput
                                        type="text"
                                        placeholder="새 값"
                                        value={newEnvValue}
                                        onChange={(e) =>
                                            setNewEnvValue(e.target.value)
                                        }
                                    />
                                    <AddButton onClick={handleAddEnv}>
                                        <Plus size={18} /> 추가
                                    </AddButton>
                                </AddEnvForm>
                                <ActionButtons>
                                    <SaveButton
                                        onClick={handleUpdate}
                                        disabled={
                                            updateEnvironmentsMutation.isPending
                                        }
                                    >
                                        {updateEnvironmentsMutation.isPending ? (
                                            <>
                                                <Loader
                                                    size={18}
                                                    className="animate-spin"
                                                />
                                                저장 중...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                변경사항 저장
                                            </>
                                        )}
                                    </SaveButton>
                                    <CancelButton onClick={handleCancel}>
                                        <X size={18} /> 취소
                                    </CancelButton>
                                </ActionButtons>
                            </>
                        )}
                    </Card>
                )}

                {!isPending && (
                    <Card>
                        <CardHeader>
                            <CardTitle>사용자 정의 호스트네임</CardTitle>
                            <InfoIcon
                                onClick={() =>
                                    setShowHostnameInfo(!showHostnameInfo)
                                }
                            >
                                <Info size={20} />
                            </InfoIcon>
                        </CardHeader>
                        {showHostnameInfo && (
                            <InfoBox>
                                사용자 정의 호스트네임을 추가하려면 먼저 DNS에
                                <strong>{application.primary_hostname}</strong>
                                을 CNAME으로 등록해야 합니다. 이렇게 하면 사용자
                                정의 도메인으로 애플리케이션에 접근할 수
                                있습니다.
                            </InfoBox>
                        )}
                        {errorMessage && (
                            <ErrorMessage>{errorMessage}</ErrorMessage>
                        )}
                        {successMessage && (
                            <SuccessMessage>{successMessage}</SuccessMessage>
                        )}
                        <HostnameList>
                            {application.extra_hostnames?.map((hostname) => (
                                <HostnameItem key={hostname}>
                                    <Globe size={14} />
                                    <HostnameText>{hostname}</HostnameText>
                                    <DeleteButton
                                        onClick={() =>
                                            handleDeleteHostname(hostname)
                                        }
                                    >
                                        <Trash2 size={14} />
                                    </DeleteButton>
                                </HostnameItem>
                            ))}
                        </HostnameList>
                        <AddHostnameForm>
                            <EnvInput
                                type="text"
                                placeholder="새 호스트네임"
                                value={newHostname}
                                onChange={(e) => setNewHostname(e.target.value)}
                            />
                            <AddButton
                                onClick={handleAddHostname}
                                disabled={addHostnameMutation.isPending}
                            >
                                {addHostnameMutation.isPending ? (
                                    <Loader
                                        size={18}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <Plus size={18} />
                                )}
                                추가
                            </AddButton>
                        </AddHostnameForm>
                    </Card>
                )}
            </ContentWrapper>

            {showDeleteConfirm && (
                <ConfirmModal>
                    <ModalContent>
                        <AlertTriangle size={48} color="#ef4444" />
                        <h2>애플리케이션 삭제</h2>
                        <p>
                            정말로 이 애플리케이션을 삭제하시겠습니까? 이 작업은
                            되돌릴 수 없습니다.
                        </p>
                        <ModalButtons>
                            <ConfirmButton onClick={handleDeleteConfirm}>
                                삭제
                            </ConfirmButton>
                            <CancelButton
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                취소
                            </CancelButton>
                        </ModalButtons>
                    </ModalContent>
                </ConfirmModal>
            )}
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

const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

const CardTitle = styled.h2`
    font-size: 20px;
    color: #ffffff;
    font-weight: 600;
`;

const MenuWrapper = styled.div`
    position: relative;
`;

const MenuButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    color: #ffffff;
    padding: 5px;

    &:hover {
        color: #3a86ff;
    }
`;

const Menu = styled.div`
    position: absolute;
    right: 0;
    top: 100%;
    background-color: #2a2a2a;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 10;
`;

const MenuItem = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 10px 15px;
    background: none;
    border: none;
    color: #ffffff;
    cursor: pointer;
    text-align: left;

    &:hover {
        background-color: #3a3a3a;
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

const EnvironmentList = styled.div`
    margin-bottom: 24px;
`;

const EnvironmentItem = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
`;

const EnvInput = styled.input`
    flex: 1;
    padding: 10px 12px;
    background-color: #2a2a2a;
    border: 1px solid #3a3a3a;
    border-radius: 6px;
    color: #ffffff;
    font-size: 14px;

    &:focus {
        outline: none;
        border-color: #3a86ff;
    }
`;

const IconButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    color: #a0a0a0;
    padding: 4px;
    transition: color 0.2s;

    &:hover {
        color: #ffffff;
    }
`;

const AddEnvForm = styled.div`
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
`;

const AddButton = styled.button`
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 10px 20px;
    background-color: #2a2a2a;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease-in-out;

    &:hover {
        background-color: #3a3a3a;
        transform: translateY(-2px);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .animate-spin {
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`;

const ActionButtons = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 16px;
`;

const SaveButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background-color: #3a86ff;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s ease-in-out;

    &:hover {
        background-color: #2f74e0;
        transform: translateY(-2px);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const CancelButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background-color: #2a2a2a;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s ease-in-out;

    &:hover {
        background-color: #3a3a3a;
        transform: translateY(-2px);
    }
`;

const ErrorMessage = styled.div`
    color: #ef4444;
    background-color: rgba(239, 68, 68, 0.1);
    border: 1px solid #ef4444;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 24px;
    text-align: center;
`;

const SuccessMessage = styled.div`
    color: #10b981;
    background-color: rgba(16, 185, 129, 0.1);
    border: 1px solid #10b981;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 24px;
    text-align: center;
`;

const ConfirmModal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background-color: #1a1a1a;
    padding: 24px;
    border-radius: 10px;
    text-align: center;
    max-width: 400px;

    h2 {
        margin-top: 16px;
        color: #ffffff;
    }

    p {
        margin: 16px 0;
        color: #a0a0a0;
    }
`;

const ModalButtons = styled.div`
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 24px;
`;

const ConfirmButton = styled.button`
    padding: 10px 20px;
    background-color: #ef4444;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;

    &:hover {
        background-color: #dc2626;
    }
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

const HostnameList = styled.div`
    margin-bottom: 24px;
`;

const HostnameItem = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    background-color: #2a2a2a;
    padding: 8px 12px;
    border-radius: 6px;
`;

const HostnameText = styled.span`
    flex: 1;
    color: #ffffff;
    font-size: 14px;
`;

const DeleteButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    color: #ef4444;
    padding: 4px;
    transition: color 0.2s;

    &:hover {
        color: #dc2626;
    }
`;

const AddHostnameForm = styled.div`
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
`;

const InfoIcon = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    color: #3a86ff;
    padding: 4px;
    transition: color 0.2s;

    &:hover {
        color: #2f74e0;
    }
`;

const InfoBox = styled.div`
    background-color: rgba(58, 134, 255, 0.1);
    border: 1px solid #3a86ff;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 24px;
    font-size: 14px;
    line-height: 1.5;
    color: #ffffff;

    strong {
        color: #3a86ff;
    }
`;

export default ApplicationDetailPage;
