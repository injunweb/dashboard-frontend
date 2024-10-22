import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Menu, LogOut, HelpCircle, Mail, Github } from "lucide-react";
import Notifications from "./Notifications";
import { useAuth } from "../hooks/useAuth";

const Header = ({ toggleSidebar }) => {
    const { isLoggedIn, logout, isLoading, user } = useAuth();
    const [showInquiryMenu, setShowInquiryMenu] = useState(false);
    const inquiryRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                inquiryRef.current &&
                !inquiryRef.current.contains(event.target)
            ) {
                setShowInquiryMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <HeaderContainer>
            <LeftSection>
                <MenuButton onClick={toggleSidebar}>
                    <Menu size={24} />
                </MenuButton>
                <LogoLink to="/applications">
                    <LogoImg src="/logo.svg" alt="InjunWeb Logo" />
                    <LogoTitle>injunweb</LogoTitle>
                </LogoLink>
            </LeftSection>
            {isLoggedIn && (
                <RightSection>
                    <InquiryContainer ref={inquiryRef}>
                        <InquiryButton
                            onClick={() => setShowInquiryMenu(!showInquiryMenu)}
                        >
                            <HelpCircle size={20} />
                            <span>문의</span>
                        </InquiryButton>
                        {showInquiryMenu && (
                            <InquiryMenu>
                                <InquiryMenuItem href="mailto:injun@injunweb.com">
                                    <Mail size={16} />
                                    <span>이메일</span>
                                </InquiryMenuItem>
                                <InquiryMenuItem
                                    href="https://github.com/in-jun"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Github size={16} />
                                    <span>GitHub</span>
                                </InquiryMenuItem>
                            </InquiryMenu>
                        )}
                    </InquiryContainer>
                    <Notifications />
                    <UserAvatar>
                        {isLoading ? "..." : user?.username[0].toUpperCase()}
                    </UserAvatar>
                    <LogoutButton onClick={logout}>
                        <LogOut size={20} />
                    </LogoutButton>
                </RightSection>
            )}
        </HeaderContainer>
    );
};

const HeaderContainer = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #000;
    padding: 10px 20px;
    color: white;
    border-bottom: 1px solid #333;
`;

const LeftSection = styled.div`
    display: flex;
    align-items: center;
`;

const MenuButton = styled.button`
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
    padding: 0.5rem;
    margin-right: 0.5rem;
`;

const LogoLink = styled(Link)`
    display: flex;
    align-items: center;
    text-decoration: none;
    color: white;
`;

const LogoImg = styled.img`
    height: 40px;
    margin-right: 5px;
`;

const LogoTitle = styled.h1`
    font-size: 24px;
    margin: 0;
    color: white;
    text-decoration: none;
`;

const RightSection = styled.div`
    display: flex;
    align-items: center;
`;

const InquiryContainer = styled.div`
    position: relative;
`;

const InquiryButton = styled.button`
    display: flex;
    align-items: center;
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
    margin-right: 1rem;

    span {
        margin-left: 0.5rem;
    }
`;

const InquiryMenu = styled.div`
    position: absolute;
    top: 100%;
    right: 0;
    background-color: #1a1a1a;
    border: 1px solid #333;
    border-radius: 4px;
    padding: 0.5rem 0;
    z-index: 10;
`;

const InquiryMenuItem = styled.a`
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    color: #fff;
    text-decoration: none;
    transition: background-color 0.2s;

    &:hover {
        background-color: #333;
    }

    span {
        margin-left: 0.5rem;
    }
`;

const UserAvatar = styled.div`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1e90ff, #ff007f);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: bold;
    margin: 0 1rem;
`;

const LogoutButton = styled.button`
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
`;

export default Header;
