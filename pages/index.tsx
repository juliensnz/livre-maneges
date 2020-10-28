import React from 'react';
import Link from 'next/link';

import styled from 'styled-components';

import {Client} from '../prismic-configuration';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const Header = styled.header`
  display: flex;
`;
const Title = styled.h1`

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
