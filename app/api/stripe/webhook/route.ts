import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  
  try {
    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any
      console.log('Payment complete for path:', session.metadata?.pathId)
      // Path unlock handled client-side via success_url params
    }
    return NextResponse.json({ received: true })
  } catch (err) {
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }
}
