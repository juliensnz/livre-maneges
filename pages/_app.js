import {createGlobalStyle} from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.nightMode ? '#000011' : 'white'};
    margin: 0;
  }
`;

function MyApp({Component, pageProps}) {
  const nightMode = new Date().getHours() > 20 || new Date().getHours() < 7;

  return (
    <>
      <Component {...pageProps} />
      <GlobalStyle nightMode={nightMode} />
    </>
  );
}

export default MyApp;
