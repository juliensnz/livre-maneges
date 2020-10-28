import {createGlobalStyle, ThemeProvider} from 'styled-components';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'shards-ui/dist/css/shards.min.css'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`;

function MyApp({Component, pageProps}) {
  return (
    <>
      <ThemeProvider theme={{}}>
        <Component {...pageProps} />
        <GlobalStyle />
      </ThemeProvider>
    </>
  );
}

export default MyApp;
