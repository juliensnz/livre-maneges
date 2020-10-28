import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Header = styled.header`
  display: flex;
`;
const LogoImg = styled.img`
  height: 80px;
  margin: 2em 2em 3em 2em;
`;

const Logo = ({src}: {src: string}) => (<a href="http://maneges-conseil.fr">
  <LogoImg src={src} width="297" height="80"/>
</a>)


const Description = styled.div`
  margin: 0 0 2em 0;
`
const Title = styled.h2`
  font-size: 1.8rem;
`

export {Title, Description, Logo, Header, Container};
