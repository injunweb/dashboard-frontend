import React from "react";
import styled from "styled-components";

const FooterContainer = styled.footer`
    background-color: #000;
    padding: 5px 0;
    text-align: center;
    color: white;
    position: relative;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #333;
`;

export const Footer = () => {
    return (
        <FooterContainer>
            &copy; 2024 injunweb. All rights reserved.
        </FooterContainer>
    );
};
