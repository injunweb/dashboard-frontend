import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const NotFoundPage = () => {
    const [countdown, setCountdown] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (countdown === 0) {
            navigate("/applications");
        }
    }, [countdown, navigate]);

    return (
        <Container>
            <Content>
                <GlitchText data-text="404">404</GlitchText>
                <Message>페이지를 찾을 수 없습니다</Message>
                <SubMessage>
                    <TypewriterText>
                        {countdown}초 후 홈페이지로 이동합니다...
                    </TypewriterText>
                </SubMessage>
            </Content>
        </Container>
    );
};

const glitchAnimation = keyframes`
  0% {
    clip: rect(31px, 9999px, 94px, 0);
    transform: skew(0.85deg);
  }
  5% {
    clip: rect(70px, 9999px, 78px, 0);
    transform: skew(0.17deg);
  }
  10% {
    clip: rect(75px, 9999px, 90px, 0);
    transform: skew(0.76deg);
  }
  15% {
    clip: rect(21px, 9999px, 46px, 0);
    transform: skew(0.37deg);
  }
  20% {
    clip: rect(39px, 9999px, 10px, 0);
    transform: skew(0.26deg);
  }
  25% {
    clip: rect(18px, 9999px, 60px, 0);
    transform: skew(0.91deg);
  }
  30% {
    clip: rect(5px, 9999px, 83px, 0);
    transform: skew(0.98deg);
  }
  35% {
    clip: rect(90px, 9999px, 97px, 0);
    transform: skew(0.1deg);
  }
  40% {
    clip: rect(11px, 9999px, 16px, 0);
    transform: skew(0.91deg);
  }
  45% {
    clip: rect(50px, 9999px, 70px, 0);
    transform: skew(0.26deg);
  }
  50% {
    clip: rect(67px, 9999px, 97px, 0);
    transform: skew(0.61deg);
  }
  55% {
    clip: rect(84px, 9999px, 36px, 0);
    transform: skew(0.83deg);
  }
  60% {
    clip: rect(34px, 9999px, 33px, 0);
    transform: skew(0.4deg);
  }
  65% {
    clip: rect(46px, 9999px, 62px, 0);
    transform: skew(0.55deg);
  }
  70% {
    clip: rect(13px, 9999px, 50px, 0);
    transform: skew(0.77deg);
  }
  75% {
    clip: rect(99px, 9999px, 64px, 0);
    transform: skew(0.06deg);
  }
  80% {
    clip: rect(18px, 9999px, 31px, 0);
    transform: skew(0.58deg);
  }
  85% {
    clip: rect(44px, 9999px, 92px, 0);
    transform: skew(0.27deg);
  }
  90% {
    clip: rect(76px, 9999px, 58px, 0);
    transform: skew(0.85deg);
  }
  95% {
    clip: rect(62px, 9999px, 11px, 0);
    transform: skew(0.34deg);
  }
  100% {
    clip: rect(65px, 9999px, 19px, 0);
    transform: skew(0.85deg);
  }
`;

const typewriterAnimation = keyframes`
  from { width: 0 }
  to { width: 100% }
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #0a0a0a;
    color: #ffffff;
    font-family: "Arial", sans-serif;
    overflow: hidden;
`;

const Content = styled.div`
    text-align: center;
`;

const GlitchText = styled.h1`
    font-size: 120px;
    font-weight: bold;
    color: #ffffff;
    position: relative;
    display: inline-block;
    margin: 0 0 20px;

    &:before,
    &:after {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #0a0a0a;
    }

    &:before {
        left: 2px;
        text-shadow: -2px 0 #ff00c1;
        clip: rect(24px, 550px, 90px, 0);
        animation: ${glitchAnimation} 3s infinite linear alternate-reverse;
    }

    &:after {
        left: -2px;
        text-shadow: -2px 0 #00fff9;
        clip: rect(85px, 550px, 140px, 0);
        animation: ${glitchAnimation} 2.5s infinite linear alternate-reverse;
    }
`;

const Message = styled.p`
    font-size: 24px;
    margin: 0 0 20px;
`;

const SubMessage = styled.div`
    font-size: 18px;
    color: #3a86ff;
    margin-bottom: 20px;
    height: 24px;
`;

const TypewriterText = styled.div`
    overflow: hidden;
    white-space: nowrap;
    margin: 0 auto;
    letter-spacing: 0.05em;
    animation: ${typewriterAnimation} 0.5s steps(40, end);
`;

export default NotFoundPage;
