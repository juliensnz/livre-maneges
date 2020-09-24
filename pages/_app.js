import { createGlobalStyle } from 'styled-components';

const GlobalStyle =  createGlobalStyle`
  body {
    margin: 0;
  }
`;

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <GlobalStyle />
    </>
  )
}

export default MyApp
