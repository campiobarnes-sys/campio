import Stripe from 'stripe'

export function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-02-25.clover' })
}

export const PRICES = {
  starter: { amount: 1900, currency: 'usd', mode: 'payment' as const },
  pro: { amount: 2900, currency: 'usd', mode: 'subscription' as const }
}
