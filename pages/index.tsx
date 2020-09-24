import Link from 'next/link'

import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`
const Header = styled.header`
  display: flex;
`
const Title = styled.h1`
  flex: 1;
  text-align: center;
`
const Menu = styled.div`
  margin: 50px 50px 0 0;
`
const Item = styled.div`
  line-height: 20px;
`
const Footer = styled.footer`
  display: flex;
  justify-content: center;

  & > span {
    margin: 0 10px;
    line-height: 26px;
    text-transform: uppercase;
  }
`
const Caroussel = styled.div`
  flex: 1;
`

const Home = () => {
  return (
    <Container>
      <Header>
        <Title>Jade Piol</Title>
        <Menu>
          <Item>Illustrations</Item>
          <Item>Embroidery</Item>
          <Item>Design</Item>
        </Menu>
      </Header>
      <Caroussel>
      </Caroussel>
      <Footer>
        <span>© Jade Piol 2020</span>
        <span>🌙</span>
        <span><Link href="/contact"><a>Contact</a></Link></span>
      </Footer>

    </Container>
  );
}

export default Home;
