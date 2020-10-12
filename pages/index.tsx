import React from 'react';
import Link from 'next/link';

import styled from 'styled-components';

import {Client} from '../prismic-configuration';
import {Flowered} from '../components/Flowered';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const Header = styled.header`
  display: flex;
`;
const Title = styled.h1`
  flex: 1;
  text-align: center;
  text-transform: uppercase;
  font-style: bold;
  font-size: 24px;
  margin: 38px 0;

  font-family: 'Playfair Display', 'Times New Roman', Times, serif;
`;

const Menu = styled.div`
  margin: 45px 45px 0 0;
  position: absolute;
  top: 0;
  right: 0;

  @media screen and (max-width: 500px) {
    top: auto;
    right: auto;
    bottom: 10px;
    width: 100vw;
    margin: 0;
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: center;
  }
`;
const MenuItem = styled.a`
  line-height: 20px;
  font-family: 'Raleway';
  text-transform: uppercase;
  text-decoration: none;
  margin: 0 0 10px 0;
  color: inherit;
`;

const Content = styled.div`
  position: relative;
`;

const SubTitle = styled.div`
  margin-left: 8vw;
  margin-top: 9vw;
  overflow: hidden;

  @media screen and (max-width: 500px) {
    display: flex;
    justify-content: center;
    margin-left: 0;
  }
`;

const Scale = styled.div`
  @media screen and (max-width: 500px) {
    transform: scale(1.2);
  }
`;

type PrismicElement = {
  type: string;
  text: string;
  spans: any[];
};

type HomeProps = {
  elements: {
    title: [PrismicElement];
    subtitle: [PrismicElement];
  };
};

const Home = ({elements}: HomeProps) => {
  return (
    <Container>
      <Header>
        <Title>{elements.title[0].text}</Title>
      </Header>
      <Menu>
        <MenuItem href="mailto:bonjour@jadepiol.com?subject=Bonjour%20Jade">Contact</MenuItem>
      </Menu>
      <Content>
        <SubTitle>
          <Scale>
            <Flowered
              style={{
                fontFamily: 'Playfair Display',
                fontSize: '13vw',
                textTransform: 'uppercase',
                fontWeight: 'normal',
              }}
            >
              {elements.subtitle[0].text}
            </Flowered>
          </Scale>
        </SubTitle>
      </Content>
    </Container>
  );
};

export async function getServerSideProps({preview = null, previewData = {}}: {preview: any; previewData: any}) {
  const {ref} = previewData;
  const home = await Client().getSingle('home', ref ? {ref} : {});
  return {
    props: {
      elements: home.data,
      preview,
    },
  };
}

export default Home;
