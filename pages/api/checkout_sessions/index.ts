import { NextApiRequest, NextApiResponse } from 'next'

import { formatAmountForStripe } from '../../../utils/stripe-helpers'
import Stripe from 'stripe'
import {Client} from '../../../prismic-configuration';
import {Article} from '../..';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-08-27',
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const element = await Client().getByUID('article', 'livre-conference', {});
  const article: Article = element.data;

  if (req.method === 'POST') {
    const quantity: number = Number(req.body.quantity)
    const needInvoice = req.body.needInvoice;

    try {
      // Create Checkout Sessions from body params.
      const params: Stripe.Checkout.SessionCreateParams = {
        submit_type: 'pay',
        payment_method_types: ['card'],
        line_items: [
          {
            name: article.name[0].text,
            amount: formatAmountForStripe(Number(article.price), process.env.CURRENCY!),
            currency: process.env.CURRENCY,
            quantity,
          },
        ],
        billing_address_collection: 'required',
        shipping_address_collection: {
          allowed_countries: ['FR']
        },
        metadata: {
          needInvoice,
          article: element.uid!
        },
        success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/`,
      }
      const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(
        params
      )

      res.status(200).json(checkoutSession)
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
