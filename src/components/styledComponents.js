import styled from "styled-components";

export const Container = styled.div`
    max-width: 600px;
    margin: auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h1`
    text-align: center;
    color: #333;
`;

export const Input = styled.input`
    width: 100%;
    margin: 5px 0;
    padding: 10px 0px;
    text-indent: 5px;
    font-size: 1.01em;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

export const Textarea = styled.textarea`
    width: 100%;
    height: 70px;
    margin: 5px 0;
    padding: 10px 0px;
    text-indent: 5px;
    font-size: 1.2em;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

export const Button = styled.button`
    width: 100%;
    padding: 10px;
    margin: 5px 0px;
    background-color: #333;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:disabled {
        background-color: #aaa;
    }
`;
