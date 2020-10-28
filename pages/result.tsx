import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { fetchGetJSON } from '../utils/api-helpers'
import { Card, CardBody } from 'shards-react';
import {Title, Description, Logo, Header, Container} from '../components'

import useSWR from 'swr'
import styled from 'styled-components';

const Confirmation = styled(Card)`
  max-width: 500px;
  border-radius: 8px;
  overflow: hidden;
`
const ResultPage: NextPage = () => {
  const router = useRouter()

  // Fetch CheckoutSession from static page via
  // https://nextjs.org/docs/basic-features/data-fetching#static-generation
  const { data, error } = useSWR(
    router.query.session_id
      ? `/api/checkout_sessions/${router.query.session_id}`
      : null,
    fetchGetJSON
  )

  if (undefined === data) {

  }

  if (error) return <div>Fail to load payment: {error}</div>

  return (
    <Container>
    <Header>
      <Logo src="/assets/logo.jpg" />
    </Header>
    <Confirmation style={{ maxWidth: '600px'}}>
      <CardBody>
        {undefined === data ? (
          <>
            <Title>Traitement de votre paiement...</Title>
            <Description>Nous sommes en train de traiter votre paiement. Cela ne devrait pas prendre trop de temps.</Description>
          </>
        ) : (
          <>
            <Title>{'succeeded' === data.payment_intent.status ? 'Merci pour votre commande' : 'Une erreur est survenue'}</Title>
            <Description>{'succeeded' === data.payment_intent.status ? (
              <>
                <br/>
                Numéro de confirmation: <strong>{data.payment_intent.id}</strong><br/><br/>
                Vous devriez recevoir un email de confirmation dans les prochaines minutes. <br/><br/>
                Si vous rencontrez un problème ou que vous avez une question, n'hésitez pas à nous contacter sur l'email: <br/>
                <a href="mailto:commandes-livre@maneges-conseil.fr">commandes-livre@maneges-conseil.fr</a>
              </>
            ) : (
              <>
                Une erreur est survenue lors du paiement. Vous ne serez pas débité.
                Si vous rencontrez à nouveau un problème, n'hésitez pas à nous contacter sur l'email: <br/>
                <a href="mailto:commandes-livre@maneges-conseil.fr">commandes-livre@maneges-conseil.fr</a>
              </>
            )}</Description>
          </>
        )}
      </CardBody>
    </Confirmation>
  </Container>
  )
}

export default ResultPage
