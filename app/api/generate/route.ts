import { NextRequest, NextResponse } from 'next/server'
import { generateLearningPath } from '@/lib/anthropic'

export const maxDuration = 60 // extend Vercel function timeout to 60s

export async function POST(req: NextRequest) {
  try {
    const answers = await req.json()
    const path = await generateLearningPath(answers)
    return NextResponse.json(path)
  } catch (err: any) {
    console.error('Generation error:', err?.message || err)
    return NextResponse.json({ error: 'Failed to generate learning path', detail: err?.message }, { status: 500 })
  }
}
