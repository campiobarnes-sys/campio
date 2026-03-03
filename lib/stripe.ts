import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover'
})

export const PRICES = {
  starter: { amount: 1900, currency: 'usd', mode: 'payment' as const, label: 'Starter' },
  pro: { amount: 2900, currency: 'usd', mode: 'subscription' as const, label: 'Pro' }
}
