import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import logo from "/logo.svg";
import { Notifications } from "./Notifications";
import { isLoggedIn } from "../utils/auth";

const HeaderContainer = styled.header`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: #000;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    color: white;
    border-bottom: 1px solid #333;
    z-index: 1000;

    @media (max-width: 600px) {
        padding: 10px 10px;
    }
`;

const Logo = styled.img`
    height: 40px;
    margin-right: 5px;
`;

const Title = styled.h1`
    font-size: 24px;
    margin: 0;

    a {
        color: white;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
            color: #ffcc00;
        }
    }
`;

export const Header = () => {
    return (
        <HeaderContainer>
            <Link
                to="/"
                style={{
                    display: "flex",
                    alignItems: "center",
                    textDecoration: "none",
                    color: "white",
                }}
                role="link"
            >
                <Logo src={logo} alt="InjunWeb Logo" />
                <Title>injunweb</Title>
            </Link>
            {isLoggedIn() && <Notifications />}
        </HeaderContainer>
    );
};
