import { NextApiRequest, NextApiResponse } from 'next'

import { formatAmountForStripe } from '../../../utils/stripe-helpers'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2020-08-27',
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const quantity: number = Number(req.body.quantity)
    try {
      // Create Checkout Sessions from body params.
      const params: Stripe.Checkout.SessionCreateParams = {
        submit_type: 'pay',
        payment_method_types: ['card'],
        line_items: [
          {
            name: 'Livre de la conférence Maneges',
            amount: formatAmountForStripe(Number(process.env.PRICE!) * quantity, process.env.CURRENCY!),
            currency: process.env.CURRENCY,
            quantity,
          },
        ],
        billing_address_collection: 'required',
        shipping_address_collection: {
          allowed_countries: ['FR', 'BE', 'CH']
        },
        success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/pay-with-checkout`,
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
