import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { OnboardingAnswers } from '@/types'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

const SKILL_LABELS: Record<string, string> = {
  'none': 'No coding experience', 'some-coding': 'Some coding experience',
  'python': 'Comfortable with Python', 'ml-practitioner': 'Experienced ML practitioner'
}
const GOAL_LABELS: Record<string, string> = {
  'get-job': 'Get a job in AI/ML', 'build-products': 'Build AI-powered products',
  'work-use': 'Apply AI in my current job', 'curiosity': 'Understand AI out of curiosity', 'research': 'Pursue AI research'
}
const TIME_LABELS: Record<string, string> = {
  'lt2': 'less than 2 hours per week', '2-5': '2-5 hours per week',
  '5-10': '5-10 hours per week', 'gt10': 'more than 10 hours per week'
}
const STYLE_LABELS: Record<string, string> = {
  'videos': 'watching videos', 'reading': 'reading documentation and articles',
  'projects': 'hands-on projects', 'mixed': 'a mix of everything'
}
const DOMAIN_LABELS: Record<string, string> = {
  'general-ml': 'General Machine Learning', 'nlp': 'Natural Language Processing',
  'computer-vision': 'Computer Vision', 'generative-ai': 'Generative AI',
  'rl': 'Reinforcement Learning', 'data-science': 'Data Science'
}

export async function POST(req: NextRequest) {
  const answers: OnboardingAnswers = await req.json()
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const prompt = `You are an expert AI/ML educator. Generate a personalized learning curriculum.

Profile:
- Skill level: ${SKILL_LABELS[answers.skillLevel]}
- Goal: ${GOAL_LABELS[answers.goal]}
- Time available: ${TIME_LABELS[answers.timePerWeek]}
- Learning style: ${STYLE_LABELS[answers.learningStyle]}
- Domain: ${DOMAIN_LABELS[answers.domain]}

Return ONLY a valid JSON object (no markdown, no code fences) with this structure:
{
  "title": "string",
  "description": "string (2 sentences)",
  "estimatedDuration": "string e.g. 3 months",
  "difficulty": "Beginner|Intermediate|Advanced",
  "modules": [
    {
      "id": "module-1",
      "title": "string",
      "description": "string (1-2 sentences)",
      "objectives": ["string", "string", "string"],
      "estimatedHours": number,
      "resources": [
        {"title": "string", "url": "https://...", "type": "video|article|course|book|tool", "free": true}
      ],
      "projects": [
        {"title": "string", "description": "string", "skills": ["string"], "estimatedHours": number, "difficulty": "beginner|intermediate|advanced"}
      ]
    }
  ],
  "milestones": [
    {"title": "string", "description": "string", "afterModuleIndex": number, "badge": "emoji"}
  ]
}

Generate exactly 5 modules. Each with 3 real resource URLs and 1 project. Keep all text concise. Return raw JSON only.`

  // Use streaming to avoid Vercel timeout
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        let fullText = ''
        const response = await client.messages.create({
          model: 'claude-sonnet-4-5',
          max_tokens: 5000,
          stream: true,
          messages: [{ role: 'user', content: prompt }]
        })

        for await (const chunk of response) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            fullText += chunk.delta.text
          }
        }

        // Parse and return complete path
        const jsonStart = fullText.indexOf('{')
        const jsonEnd = fullText.lastIndexOf('}')
        if (jsonStart === -1 || jsonEnd === -1) throw new Error('No JSON in response')
        const data = JSON.parse(fullText.slice(jsonStart, jsonEnd + 1))

        const path = {
          id: `path_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          ...data,
          createdAt: new Date().toISOString(),
          answers,
          tier: answers.tier,
          unlocked: answers.tier !== 'free'
        }

        controller.enqueue(encoder.encode(JSON.stringify(path)))
        controller.close()
      } catch (err: any) {
        console.error('Generate error:', err?.message)
        controller.enqueue(encoder.encode(JSON.stringify({ error: err?.message || 'Generation failed' })))
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'application/json' }
  })
}
