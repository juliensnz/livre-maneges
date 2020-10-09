import React from 'react';
import {GetStaticPropsContext} from 'next';
import Link from 'next/link';

import styled from 'styled-components';

import {Client} from '../prismic-configuration';
import {LeafCollection} from '../components/Leaf';
import {useElementSize} from '../hooks/useElementSize';
import {useLeafPoints} from '../hooks/useLeafPoints';

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
const Subtitle = styled.h2`
  font-family: 'Playfair Display', 'Times New Roman', Times, serif;
  font-weight: normal;
  font-size: 13vw;
  text-transform: uppercase;
  margin-left: 120px;
  margin-top: 160px;
  position: absolute;
`;
const Menu = styled.div`
  margin: 45px 45px 0 0;
  position: absolute;
  top: 0;
  right: 0;
`;
const MenuItem = styled.a`
  line-height: 20px;
  font-family: 'Raleway';
  text-transform: uppercase;
  text-decoration: none;
  color: inherit;
`;

const Canvas = styled.canvas`
  overflow: visible;
  margin-left: 120px;
  margin-top: 160px;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
`;

const Content = styled.div`
  position: relative;
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
  const [subtitleRef, subtitleSize] = useElementSize();
  const [canvasRef, leafPoints] = useLeafPoints(elements.subtitle[0].text);

  return (
    <Container>
      <Header>
        <Title>{elements.title[0].text}</Title>
      </Header>
      <Menu>
        <MenuItem href="mailto:bonjour@jadepiol.com?subject=Bonjour%20Jade">Contact</MenuItem>
      </Menu>
      <Content>
        <Subtitle ref={subtitleRef}>{elements.subtitle[0].text}</Subtitle>
        <LeafCollection leafPoints={leafPoints} size={subtitleSize} />
        <Canvas ref={canvasRef} width="1000px" height="383px"></Canvas>
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
