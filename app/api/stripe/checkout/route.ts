import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const { tier, pathId, email } = await req.json()
    const stripe = getStripe()
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://campio.vercel.app'

    let session
    if (tier === 'starter') {
      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        customer_email: email || undefined,
        line_items: [{ price_data: { currency: 'usd', product_data: { name: 'Campio — Starter', description: 'Full Campio path + 3 guided projects' }, unit_amount: 1900 }, quantity: 1 }],
        success_url: `${base}/results?pathId=${pathId}&session_id={CHECKOUT_SESSION_ID}&unlocked=true`,
        cancel_url: `${base}/results?pathId=${pathId}`,
        metadata: { pathId, tier }
      })
    } else if (tier === 'pro') {
      session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer_email: email || undefined,
        line_items: [{ price_data: { currency: 'usd', product_data: { name: 'Campio — Pro', description: 'Full Campio path + monthly projects + Q&A' }, recurring: { interval: 'month' }, unit_amount: 2900 }, quantity: 1 }],
        success_url: `${base}/results?pathId=${pathId}&session_id={CHECKOUT_SESSION_ID}&unlocked=true`,
        cancel_url: `${base}/results?pathId=${pathId}`,
        metadata: { pathId, tier }
      })
    } else {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', err)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
