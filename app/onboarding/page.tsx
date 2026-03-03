'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { OnboardingAnswers, SkillLevel, Goal, TimePerWeek, LearningStyle, Domain, Tier } from '@/types'
import { savePath } from '@/lib/storage'

type Step = 'skill' | 'goal' | 'time' | 'style' | 'domain' | 'email'
const STEPS: Step[] = ['skill', 'goal', 'time', 'style', 'domain', 'email']

const OPTIONS = {
  skill: [
    { value: 'none', label: 'No coding experience', desc: "I've never written code before" },
    { value: 'some-coding', label: 'Some coding experience', desc: 'I know basics but not Python specifically' },
    { value: 'python', label: 'Comfortable with Python', desc: "I can write scripts, use libraries" },
    { value: 'ml-practitioner', label: 'ML practitioner', desc: "I've trained models, used scikit-learn/PyTorch" },
  ],
  goal: [
    { value: 'get-job', label: 'Get a job in AI/ML', desc: 'Targeting ML engineer, data scientist, etc.' },
    { value: 'build-products', label: 'Build AI products', desc: 'Integrate AI into apps and services' },
    { value: 'work-use', label: 'Use AI at work', desc: 'Apply AI tools in my current role' },
    { value: 'curiosity', label: 'Pure curiosity', desc: "I just want to understand how AI works" },
    { value: 'research', label: 'Research', desc: 'Academic or deep technical exploration' },
  ],
  time: [
    { value: 'lt2', label: 'Less than 2 hrs/week', desc: 'Casual learning, slow and steady' },
    { value: '2-5', label: '2–5 hrs/week', desc: 'Consistent part-time learning' },
    { value: '5-10', label: '5–10 hrs/week', desc: 'Dedicated learner' },
    { value: 'gt10', label: '10+ hrs/week', desc: 'Intensive — I want to move fast' },
  ],
  style: [
    { value: 'videos', label: 'Videos & lectures', desc: 'YouTube, online courses, talks' },
    { value: 'reading', label: 'Reading & docs', desc: 'Papers, articles, documentation' },
    { value: 'projects', label: 'Hands-on projects', desc: 'Learn by building and doing' },
    { value: 'mixed', label: 'Mix of everything', desc: "Variety keeps me engaged" },
  ],
  domain: [
    { value: 'general-ml', label: 'General ML', desc: 'Broad machine learning fundamentals' },
    { value: 'nlp', label: 'Natural Language Processing', desc: 'Text, language models, transformers' },
    { value: 'computer-vision', label: 'Computer Vision', desc: 'Images, video, CNNs, detection' },
    { value: 'generative-ai', label: 'Generative AI', desc: 'LLMs, diffusion models, agents' },
    { value: 'rl', label: 'Reinforcement Learning', desc: 'Agents, rewards, game playing' },
    { value: 'data-science', label: 'Data Science', desc: 'Analysis, visualization, statistics' },
  ],
}

const STEP_TITLES: Record<Step, string> = {
  skill: "What's your current skill level?",
  goal: "What do you want to achieve?",
  time: "How much time can you commit weekly?",
  style: "How do you learn best?",
  domain: "Which area of AI interests you most?",
  email: "Almost done — unlock your path",
}

export default function Onboarding() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Partial<OnboardingAnswers>>({ tier: 'free' })
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  const step = STEPS[currentStep]
  const progress = ((currentStep) / (STEPS.length - 1)) * 100

  function select(field: string, value: string) {
    setAnswers(prev => ({ ...prev, [field]: value }))
    if (step !== 'email') {
      setTimeout(() => setCurrentStep(s => Math.min(s + 1, STEPS.length - 1)), 200)
    }
  }

  async function generate() {
    setIsGenerating(true)
    setError('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers)
      })
      if (!res.ok) throw new Error('Generation failed')
      const path = await res.json()
      savePath(path)
      router.push(`/results?pathId=${path.id}`)
    } catch (e) {
      setError('Something went wrong. Please try again.')
      setIsGenerating(false)
    }
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-12 h-12 rounded-full border-2 border-[var(--accent)] border-t-transparent spin mb-6" />
        <h2 className="text-2xl font-bold mb-2">Building your learning path...</h2>
        <p className="text-[var(--muted)] text-center max-w-sm">Claude is analyzing your profile and crafting a personalized curriculum. This takes about 10 seconds.</p>
        <div className="mt-8 space-y-2 w-full max-w-xs">
          {['Analyzing your background', 'Selecting core modules', 'Curating resources', 'Designing projects'].map((t, i) => (
            <div key={t} className="flex items-center gap-3 text-sm text-[var(--muted)]">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] pulse-dot" style={{animationDelay: `${i*0.3}s`}} />
              {t}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[var(--border)]">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold">⬡ AI Learning Paths</span>
            <span className="text-xs text-[var(--muted)]">Step {currentStep + 1} of {STEPS.length}</span>
          </div>
          <div className="h-1.5 rounded-full bg-[var(--border)]">
            <div className="h-full rounded-full bg-[var(--accent)] transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          <h1 className="text-2xl md:text-3xl font-bold mb-8">{STEP_TITLES[step]}</h1>

          {step === 'email' ? (
            <div className="space-y-6">
              <div className="space-y-3">
                {(['free', 'starter', 'pro'] as Tier[]).map(t => (
                  <button key={t} onClick={() => setAnswers(prev => ({ ...prev, tier: t }))}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${answers.tier === t ? 'border-[var(--accent)] bg-[rgba(124,106,255,0.08)]' : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold capitalize">{t === 'free' ? 'Free' : t === 'starter' ? 'Starter' : 'Pro'}</div>
                        <div className="text-sm text-[var(--muted)] mt-0.5">
                          {t === 'free' ? 'Basic path, first 2 modules' : t === 'starter' ? 'Full path + 3 projects — $19 one-time' : 'Full path + monthly projects + Q&A — $29/mo'}
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${answers.tier === t ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-[var(--muted)]'}`} />
                    </div>
                  </button>
                ))}
              </div>
              <div>
                <input type="email" placeholder="Email (optional — to save your path)"
                  value={answers.email || ''}
                  onChange={e => setAnswers(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors" />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button onClick={generate}
                className="w-full py-4 rounded-xl bg-[var(--accent)] text-white font-bold text-lg hover:bg-[var(--accent2)] transition-all hover:-translate-y-0.5 shadow-lg shadow-[rgba(124,106,255,0.3)]">
                Generate My Learning Path →
              </button>
              <p className="text-center text-xs text-[var(--muted)]">
                {answers.tier === 'free' ? "Free — no payment needed" : "You'll be taken to checkout after generation"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {(OPTIONS[step as keyof typeof OPTIONS] || []).map((opt: any) => {
                const isSelected = answers[step as keyof OnboardingAnswers] === opt.value
                return (
                  <button key={opt.value} onClick={() => select(step, opt.value)}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${isSelected ? 'border-[var(--accent)] bg-[rgba(124,106,255,0.08)]' : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] hover:-translate-y-0.5'}`}>
                    <div className="font-semibold">{opt.label}</div>
                    <div className="text-sm text-[var(--muted)] mt-0.5">{opt.desc}</div>
                  </button>
                )
              })}
            </div>
          )}

          {/* Back */}
          {currentStep > 0 && step !== 'email' && (
            <button onClick={() => setCurrentStep(s => s - 1)} className="mt-6 text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors">
              ← Back
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
