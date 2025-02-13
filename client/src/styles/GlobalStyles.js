import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 0;
    background-color: #121212;
    color: #ffffff;
    font-family: 'Roboto', sans-serif;
  }
  a { text-decoration: none; color: inherit; }
`;

export default GlobalStyles;
