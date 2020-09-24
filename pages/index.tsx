import {GetStaticPropsContext} from 'next'
import Link from 'next/link'

import styled from 'styled-components'

import { Client } from '../prismic-configuration'

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
  text-transform: uppercase;
  font-style: bold;
  font-size: 24px;
  margin: 38px 0;

  font-family: 'Playfair Display';
`
const Subtitle = styled.h2`
  font-family: 'Playfair Display';
  font-weight: normal;
  font-size: 144px;
  text-transform: uppercase;
  margin-left: 120px;
  margin-top: 160px;
`
const Menu = styled.div`
  margin: 45px 45px 0 0;
  position: absolute;
  top: 0;
  right: 0;
`
const MenuItem = styled.a`
  line-height: 20px;
  font-family: 'Raleway';
  text-transform: uppercase;
  text-decoration: none;
  color: inherit;
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

const Content = styled.div``

type PrismicElement = {
  type: string,
  text: string,
  spans: any[]
}

type HomeProps = {
  elements: {
    title: [PrismicElement],
    subtitle: [PrismicElement]
  }
}

const Home = ({elements}: HomeProps) => {
  return (
    <Container>
      <Header>
        <Title>{elements.title[0].text}</Title>
      </Header>
      <Menu>
          <MenuItem href="mailto:pioljade@yahoo.fr?subject=Bonjour%20Jade">Contact</MenuItem>
        </Menu>
      <Content>
        <Subtitle>{elements.subtitle[0].text}</Subtitle>
      </Content>
    </Container>
  );
}

const getStaticProps = async (context: GetStaticPropsContext) => {
  const home = await Client().getSingle('home', {});

  return {
    props: {
      elements: home.data
    },
  }
}

export default Home;
export {getStaticProps}
