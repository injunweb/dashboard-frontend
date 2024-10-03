import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  html {
    background-color: #000;
    height: 100%;
  }

  body {
    margin: 0;
    padding: 0;
    padding-top: 60px;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
    height: 100%;
    color: white;
  }
`;
