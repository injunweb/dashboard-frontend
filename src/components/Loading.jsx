import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #000;
    color: #fff;
    font-family: "Arial", sans-serif;
`;

const Logo = styled.h1`
    font-size: 3rem;
    font-weight: 700;
    letter-spacing: 2px;
    margin-bottom: 2rem;
    background: linear-gradient(135deg, #1e90ff, #ff007f);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const ProgressBarContainer = styled.div`
    width: 200px;
    height: 3px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 1.5px;
    overflow: hidden;
    margin-bottom: 1rem;
`;

const ProgressBar = styled.div`
    height: 100%;
    background: linear-gradient(90deg, #1e90ff, #ff007f);
    transition: width 0.3s ease-out;
`;

const LoadingText = styled.div`
    font-size: 0.9rem;
    color: #888;
`;

export const Loading = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    clearInterval(timer);
                    return 100;
                }
                const diff = Math.random() * 10;
                return Math.min(oldProgress + diff, 100);
            });
        }, 500);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <Container>
            <Logo>injunweb</Logo>
            <ProgressBarContainer>
                <ProgressBar style={{ width: `${progress}%` }} />
            </ProgressBarContainer>
            <LoadingText>Loading... {Math.round(progress)}%</LoadingText>
        </Container>
    );
};
