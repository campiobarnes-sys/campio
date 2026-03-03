import { NextRequest, NextResponse } from 'next/server'
import { generateLearningPath } from '@/lib/anthropic'

export async function POST(req: NextRequest) {
  try {
    const answers = await req.json()
    const path = await generateLearningPath(answers)
    return NextResponse.json(path)
  } catch (err) {
    console.error('Generation error:', err)
    return NextResponse.json({ error: 'Failed to generate learning path' }, { status: 500 })
  }
}
