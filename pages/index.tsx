import React, {ChangeEvent, useState} from 'react';
import Link from 'next/link';
import { Button, FormCheckbox, Form, FormGroup, FormSelect, Card, CardImg, CardBody } from 'shards-react';
import styled from 'styled-components';

import {Client} from '../prismic-configuration';
import {formatAmountForDisplay} from '../utils/stripe-helpers';
import getStripe from '../utils/get-stripejs';
import {fetchPostJSON} from '../utils/api-helpers';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Header = styled.header`
  display: flex;
`;
const Logo = styled.img`
  width: 200px;
  margin: 2em;
  height: auto;
`;

const CheckoutForm = styled(Form)`
  display: flex;
  flex-direction: column;
`

const Cart = styled(Card)`
  max-width: 500px;
  border-radius: 8px;
  overflow: hidden;
`

const CoverContainer = styled.div`
  display: flex;
  padding: 2rem;
  display: flex;
  justify-content: center;
`


const Cover = styled(CardImg)`
  height: 300px;
  border: 1px solid #999;
  border-radius: 3px;
`

const Label = styled.label`

`
const Option = styled.option`

`

const Description = styled.div`
  margin: 0 0 2em 0;
`
const ItemTitle = styled.h2`

`

const Buy = styled(Button)`
  margin: 2rem;
  padding: .75rem 2rem;
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
    itemtitle: [PrismicElement];
    description: [PrismicElement];
  };
};

const PRICE = 14.90

const Home = ({elements}: HomeProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [needInvoice, setNeedInvoice] = useState(false);

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
  };

  return (
    <Container>
      <Header>
        <Logo src="http://www.maneges-conseil.fr/wp-content/uploads/2014/09/logo_maneges2-300x82.jpg" />
      </Header>
      <Cart style={{ maxWidth: '600px'}}>
        <CoverContainer>
          <Cover src="/assets/cover.jpg" />
        </CoverContainer>
        <CardBody>
          <ItemTitle>{elements.itemtitle[0].text}</ItemTitle>
          <Description>{elements.description[0].text}</Description>
          <CheckoutForm onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="quantity">Quantité</Label>
              <FormSelect id="quantity" value={quantity} onChange={(event: ChangeEvent<HTMLSelectElement>) => {
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
              </FormSelect>
            </FormGroup>
            <FormCheckbox
              checked={needInvoice}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setNeedInvoice(!needInvoice)}
            >
              J'ai besoin d'une facture
            </FormCheckbox>
            <Total>Total: {formatAmountForDisplay(quantity*PRICE, 'EUR')}</Total>
            <Buy pill type="submit" disabled={isLoading}>Acheter</Buy>
          </CheckoutForm>
        </CardBody>

      </Cart>
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
