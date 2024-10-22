import React from "react";
import styled, { keyframes } from "styled-components";

const Loading = () => {
    return (
        <LoadingContainer>
            <Spinner />
        </LoadingContainer>
    );
};

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top: 4px solid #fff;
    width: 40px;
    height: 40px;
    animation: ${spin} 1s linear infinite;
`;

export default Loading;
