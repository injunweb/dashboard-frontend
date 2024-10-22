import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Github, Mail } from "lucide-react";

const Footer = () => {
    return (
        <FooterContainer>
            <FooterContent>
                <CopyrightText>&copy; 2024 injunweb</CopyrightText>
                <StyledLink to="/terms">이용약관</StyledLink>
                <StyledLink to="/privacy">개인정보처리방침</StyledLink>
                <StyledLink
                    to="https://github.com/injunweb"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    조직
                </StyledLink>
                <SocialLink
                    href="https://github.com/in-jun"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                >
                    <Github size={14} />
                </SocialLink>
                <SocialLink href="mailto:injun@injunweb.com" aria-label="Email">
                    <Mail size={14} />
                </SocialLink>
            </FooterContent>
        </FooterContainer>
    );
};

const FooterContainer = styled.footer`
    background-color: #000;
    color: rgba(255, 255, 255, 0.6);
    padding: 2px 0.5rem;
    font-size: 0.75rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const FooterContent = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    max-width: 1200px;
    margin: 0 auto;
    overflow-x: auto;
    white-space: nowrap;
    padding: 0 1rem;

    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const StyledLink = styled(Link)`
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
        color: rgba(255, 255, 255, 0.8);
    }
`;

const SocialLink = styled.a`
    color: rgba(255, 255, 255, 0.6);
    transition: color 0.2s ease;
    display: flex;
    align-items: center;

    &:hover {
        color: rgba(255, 255, 255, 0.8);
    }
`;

const CopyrightText = styled.p`
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
`;

export default Footer;
