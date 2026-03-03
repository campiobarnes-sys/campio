import Anthropic from '@anthropic-ai/sdk'
import { OnboardingAnswers, LearningPath } from '@/types'

function getClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

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

export async function generateLearningPath(answers: OnboardingAnswers): Promise<LearningPath> {
  const client = getClient()
  const prompt = `You are an expert AI/ML educator. Generate a detailed, personalized learning curriculum based on this profile:

- Current skill level: ${SKILL_LABELS[answers.skillLevel]}
- Goal: ${GOAL_LABELS[answers.goal]}
- Available time: ${TIME_LABELS[answers.timePerWeek]}
- Preferred learning style: ${STYLE_LABELS[answers.learningStyle]}
- Domain interest: ${DOMAIN_LABELS[answers.domain]}

Return ONLY valid JSON (no markdown, no explanation) with this exact structure:
{
  "title": "string - personalized path title",
  "description": "string - 2-3 sentence personalized description",
  "estimatedDuration": "string - e.g. '3-4 months'",
  "difficulty": "string - e.g. 'Beginner' or 'Intermediate'",
  "modules": [
    {
      "id": "string - slug like 'module-1'",
      "title": "string",
      "description": "string - 2 sentences",
      "objectives": ["string", "string", "string"],
      "estimatedHours": number,
      "resources": [
        { "title": "string", "url": "string - real URL", "type": "video|article|course|book|tool", "free": boolean }
      ],
      "projects": [
        { "title": "string", "description": "string", "skills": ["string"], "estimatedHours": number, "difficulty": "beginner|intermediate|advanced" }
      ]
    }
  ],
  "milestones": [
    { "title": "string", "description": "string", "afterModuleIndex": number, "badge": "emoji" }
  ]
}

Generate 5-7 modules. Each module should have 3-5 resources and 1-2 projects. Make the resources real, high-quality URLs. Tailor everything specifically to the user's goal and domain.`

  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }]
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const data = JSON.parse(text)

  return {
    id: `path_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    ...data,
    createdAt: new Date().toISOString(),
    answers,
    tier: answers.tier,
    unlocked: answers.tier !== 'free'
  }
}
