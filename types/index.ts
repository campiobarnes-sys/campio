export type SkillLevel = 'none' | 'some-coding' | 'python' | 'ml-practitioner'
export type Goal = 'get-job' | 'build-products' | 'work-use' | 'curiosity' | 'research'
export type TimePerWeek = 'lt2' | '2-5' | '5-10' | 'gt10'
export type LearningStyle = 'videos' | 'reading' | 'projects' | 'mixed'
export type Domain = 'general-ml' | 'nlp' | 'computer-vision' | 'generative-ai' | 'rl' | 'data-science'
export type Tier = 'free' | 'starter' | 'pro'

export interface OnboardingAnswers {
  skillLevel: SkillLevel
  goal: Goal
  timePerWeek: TimePerWeek
  learningStyle: LearningStyle
  domain: Domain
  email?: string
  tier: Tier
}

export interface Resource {
  title: string
  url: string
  type: 'video' | 'article' | 'course' | 'book' | 'tool'
  free: boolean
}

export interface Project {
  title: string
  description: string
  skills: string[]
  estimatedHours: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export interface Module {
  id: string
  title: string
  description: string
  objectives: string[]
  resources: Resource[]
  projects: Project[]
  estimatedHours: number
}

export interface Milestone {
  title: string
  description: string
  afterModuleIndex: number
  badge: string
}

export interface LearningPath {
  id: string
  title: string
  description: string
  estimatedDuration: string
  difficulty: string
  modules: Module[]
  milestones: Milestone[]
  createdAt: string
  answers: OnboardingAnswers
  tier: Tier
  unlocked: boolean
}
