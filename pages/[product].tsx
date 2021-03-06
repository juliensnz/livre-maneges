import React, {ChangeEvent, useState} from 'react';
import {Button, FormCheckbox, Form, FormGroup, FormSelect, FormInput, Card, CardImg, CardBody} from 'shards-react';
import styled from 'styled-components';
import {Title, Description, Logo, Header, Container} from '../components';
import {Client} from '../prismic-configuration';
import {formatAmountForDisplay} from '../utils/stripe-helpers';
import getStripe from '../utils/get-stripejs';
import {fetchPostJSON} from '../utils/api-helpers';
import Head from 'next/head';

const CheckoutForm = styled(Form)`
  display: flex;
  flex-direction: column;
`;

const Cart = styled(Card)`
  max-width: 500px;
  border-radius: 8px;
  overflow: hidden;
`;

const CoverContainer = styled.div`
  display: flex;
  padding: 2rem 2rem 1rem 2rem;
  display: flex;
  justify-content: center;
`;

const Cover = styled(CardImg)`
  height: 300px;
  border: 1px solid #999;
  border-radius: 5px;
`;

const Label = styled.label``;
const Option = styled.option``;

const Buy = styled(Button)`
  margin: 2rem;
  padding: 0.75rem 2rem;
`;

const Total = styled.div`
  margin-top: 1em;
`;

type Article = {
  title: [PrismicTextElement];
  name: [PrismicTextElement];
  itemtitle: [PrismicTextElement];
  description: [PrismicTextElement];
  cover: PrismicMediaElement;
  price: number;
};
type PrismicTextElement = {
  type: string;
  text: string;
  spans: any[];
};
type PrismicMediaElement = {
  url: string;
  alt: string;
};

type HomeProps = {
  product: Article | null;
  productId: string;
};

const Home = ({product, productId}: HomeProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [needInvoice, setNeedInvoice] = useState(false);
  const [needCustomQuantity, setNeedCustomQuantity] = useState(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Create a Checkout Session.
    const response = await fetchPostJSON('/api/checkout_sessions', {
      quantity,
      productId,
    });

    if (response.statusCode === 500) {
      console.error(response.message);
      return;
    }

    // Redirect to Checkout.
    const stripe = await getStripe();
    const {error} = await stripe!.redirectToCheckout({
      // Make the id field from the Checkout Session creation API response
      // available to this file, so you can provide it as parameter here
      // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
      sessionId: response.id,
    });
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    console.warn(error.message);
    setLoading(false);
  };

  if (null === product) return null;

  return (
    <Container>
      <Head>
        <title>Manèges conseil - {product.title[0].text}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0" />
      </Head>
      <Header>
        <Logo src="/assets/logo.jpg" />
      </Header>
      <Cart style={{maxWidth: '600px'}}>
        <CoverContainer>
          <Cover src={product.cover.url} alt={product.cover.alt} width="214" height="300" />
        </CoverContainer>
        <CardBody>
          <Title>{product.title[0].text}</Title>
          <Description>
            {product.description[0].text.split('\n').map((text: string, index: number) => (
              <span key={index}>
                {text}
                <br />
              </span>
            ))}
          </Description>
          <CheckoutForm onSubmit={handleSubmit}>
            {!needCustomQuantity ? (
              <FormGroup>
                <Label htmlFor="quantity-select">Quantité</Label>
                <FormSelect
                  id="quantity-select"
                  value={quantity}
                  onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                    if ('custom' === event.currentTarget.value) {
                      setQuantity(20);
                      setNeedCustomQuantity(true);
                    } else {
                      setQuantity(Number(event.currentTarget.value));
                      setNeedCustomQuantity(false);
                    }
                  }}
                >
                  <Option key="1" value={1}>
                    1
                  </Option>
                  <Option key="2" value={2}>
                    2
                  </Option>
                  <Option key="3" value={3}>
                    3
                  </Option>
                  <Option key="4" value={4}>
                    4
                  </Option>
                  <Option key="5" value={5}>
                    5
                  </Option>
                  <Option key="10" value={10}>
                    10
                  </Option>
                  <Option key="custom" value="custom">
                    Grands volumes
                  </Option>
                </FormSelect>
              </FormGroup>
            ) : (
              <FormGroup>
                <Label htmlFor="quantity-input">Quantité</Label>
                <FormInput
                  id="quantity-input"
                  type="number"
                  step={1}
                  min={1}
                  value={quantity}
                  onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                    if ('' === event.currentTarget.value) {
                      setQuantity(1);
                    }
                    const value = Number(event.currentTarget.value);

                    if (typeof value === 'number' && value !== NaN && Math.round(value) === value && value > 0) {
                      setQuantity(Number(event.currentTarget.value));
                    }
                  }}
                />
              </FormGroup>
            )}
            <FormCheckbox
              id="need-invoice-input"
              checked={needInvoice}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setNeedInvoice(!needInvoice)}
            >
              J'ai besoin d'une facture
            </FormCheckbox>
            <Total>
              <strong>Total:</strong> {formatAmountForDisplay(quantity * product.price, 'EUR')}
            </Total>
            <Buy pill type="submit" disabled={isLoading}>
              {!isLoading ? 'Acheter' : 'Chargement...'}
            </Buy>
          </CheckoutForm>
        </CardBody>
      </Cart>
    </Container>
  );
};

export async function getServerSideProps({
  preview = null,
  previewData = {},
  query: {product: productId},
}: {
  preview: any;
  previewData: any;
  query: {product: string};
}) {
  const {ref} = previewData;
  const product = await Client().getByUID('article', productId, ref ? {ref} : {});

  if (undefined === product) {
    return {
      props: {
        product: null,
        productId: '',
        preview: null,
      },
    };
  }

  return {
    props: {
      product: product.data,
      productId,
      preview,
    },
  };
}

export default Home;
export type {Article};
