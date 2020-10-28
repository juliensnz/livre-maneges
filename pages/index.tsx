import React, {useState} from 'react';
import Link from 'next/link';

import styled from 'styled-components';

import {Client} from '../prismic-configuration';
import {formatAmountForDisplay} from '../utils/stripe-helpers';
import getStripe from '../utils/get-stripejs';
import {fetchPostJSON} from '../utils/api-helpers';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const Header = styled.header`
  display: flex;
`;
const Title = styled.h1`
  text-align: center;
  flex: 1;
`;

const Form = styled.form`

`
const Select = styled.select`

`
const Label = styled.label`

`
const Option = styled.option`

`
const Buy = styled.button`

`

const Total = styled.div``



type PrismicElement = {
  type: string;
  text: string;
  spans: any[];
};

type HomeProps = {
  elements: {
    title: [PrismicElement];
    subtitle: [PrismicElement];
    description: [PrismicElement];
  };
};

const PRICE = 14.90

const Home = ({elements}: HomeProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setLoading] = useState(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Create a Checkout Session.
    const response = await fetchPostJSON('/api/checkout_sessions', {
      quantity
    })

    if (response.statusCode === 500) {
      console.error(response.message)
      return
    }

    // Redirect to Checkout.
    const stripe = await getStripe()
    const { error } = await stripe!.redirectToCheckout({
      // Make the id field from the Checkout Session creation API response
      // available to this file, so you can provide it as parameter here
      // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
      sessionId: response.id,
    })
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    console.warn(error.message)
    setLoading(false)
  }


  return (
    <Container>
      <Header>
        <Title>{elements.title[0].text}</Title>
      </Header>
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="quantity">Quantité</Label>
        <Select id="quantity" value={quantity} onChange={(event) => {
          setQuantity(Number(event.currentTarget.value));
        }}>
          <Option value={1}>1</Option>
          <Option value={2}>2</Option>
          <Option value={3}>3</Option>
          <Option value={4}>4</Option>
          <Option value={5}>5</Option>
          <Option value={10}>10</Option>
          <Option value={15}>15</Option>
          <Option value={20}>20</Option>
        </Select>
        <Total>Total: {formatAmountForDisplay(quantity*PRICE, 'EUR')}</Total>
        <Buy type="submit" disabled={isLoading}>Acheter</Buy>
      </Form>
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
