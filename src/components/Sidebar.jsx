import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Box, User, Bell, Users, Shield } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Sidebar = ({ $isOpen }) => {
    const location = useLocation();
    const { isAdmin } = useAuth();

    const menuItems = [
        {
            icon: Box,
            label: "어플리케이션",
            link: "/applications",
        },
        { icon: User, label: "내 정보", link: "/profile" },
        { icon: Bell, label: "알림", link: "/notifications" },
    ];

    const adminMenuItems = [
        { icon: Users, label: "사용자 관리", link: "/admin/users" },
        {
            icon: Shield,
            label: "애플리케이션 관리",
            link: "/admin/applications",
        },
    ];

    return (
        <SidebarContainer $isOpen={$isOpen}>
            <Nav>
                {menuItems.map((item) => (
                    <NavItem
                        key={item.link}
                        $isActive={location.pathname === item.link}
                    >
                        <NavLink to={item.link}>
                            <IconWrapper>
                                <item.icon size={20} />
                            </IconWrapper>
                            <span>{item.label}</span>
                        </NavLink>
                    </NavItem>
                ))}
                {isAdmin && (
                    <>
                        <Divider />
                        <AdminSection>관리자 메뉴</AdminSection>
                        {adminMenuItems.map((item) => (
                            <NavItem
                                key={item.link}
                                $isActive={location.pathname === item.link}
                            >
                                <NavLink to={item.link}>
                                    <IconWrapper>
                                        <item.icon size={20} />
                                    </IconWrapper>
                                    <span>{item.label}</span>
                                </NavLink>
                            </NavItem>
                        ))}
                    </>
                )}
            </Nav>
        </SidebarContainer>
    );
};

const SidebarContainer = styled.aside`
    width: ${(props) => (props.$isOpen ? "240px" : "0")};
    background-color: #111;
    transition: width 0.3s ease;
    overflow-x: hidden;
    border-right: 1px solid #222;
`;

const Nav = styled.nav`
    display: flex;
    flex-direction: column;
    padding: 20px 0;
`;

const NavItem = styled.div`
    margin-bottom: 5px;
`;

const NavLink = styled(Link)`
    display: flex;
    align-items: center;
    padding: 10px 20px;
    color: ${(props) => (props.$isActive ? "#fff" : "#999")};
    text-decoration: none;
    transition: all 0.3s ease;
    border-left: 3px solid transparent;

    &:hover {
        background-color: rgba(255, 255, 255, 0.05);
        color: #fff;
    }

    ${(props) =>
        props.$isActive &&
        `
        background-color: rgba(255, 255, 255, 0.1);
        border-left-color: #1e90ff;
        color: #fff;
    `}
`;

const IconWrapper = styled.div`
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
`;

const Divider = styled.hr`
    border: 0;
    border-top: 1px solid #333;
    margin: 15px 20px;
`;

const AdminSection = styled.div`
    padding: 0 20px 10px;
    color: #666;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
`;

export default Sidebar;
