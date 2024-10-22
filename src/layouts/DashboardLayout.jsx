import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import SuvscriptionPrompt from "../components/SubscriptionPrompt";

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <LayoutContainer>
            <Header toggleSidebar={toggleSidebar} />
            <MainContent>
                <Sidebar $isOpen={isSidebarOpen} />
                <PageContent>
                    <SuvscriptionPrompt />
                    <Outlet />
                </PageContent>
            </MainContent>
            <Footer />
        </LayoutContainer>
    );
};

const LayoutContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #0a0a0a;
`;

const MainContent = styled.div`
    display: flex;
    flex: 1;
`;

const PageContent = styled.main`
    flex: 1;
    padding: 20px;
    overflow-y: auto;
`;

export default DashboardLayout;
