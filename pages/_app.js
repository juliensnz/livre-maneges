import {createGlobalStyle, ThemeProvider} from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.nightMode ? '#000011' : 'white'};
    color: ${props => props.theme.nightMode ? 'white' : 'black'};
    margin: 0;
  }
`;

const theme = {
  nightMode: new Date().getHours() > 22 || new Date().getHours() < 7
};

function MyApp({Component, pageProps}) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
        <GlobalStyle />
      </ThemeProvider>
    </>
  );
}

export default MyApp;
