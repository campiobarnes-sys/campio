import { LearningPath } from '@/types'

const PATHS_KEY = 'alp_paths'

export function savePath(path: LearningPath): void {
  if (typeof window === 'undefined') return
  const paths = getPaths()
  const idx = paths.findIndex(p => p.id === path.id)
  if (idx >= 0) paths[idx] = path
  else paths.unshift(path)
  localStorage.setItem(PATHS_KEY, JSON.stringify(paths))
}

export function getPaths(): LearningPath[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(PATHS_KEY) || '[]')
  } catch { return [] }
}

export function getPath(id: string): LearningPath | null {
  return getPaths().find(p => p.id === id) || null
}

export function updateProgress(pathId: string, moduleId: string, completed: boolean): void {
  const progressKey = `alp_progress_${pathId}`
  if (typeof window === 'undefined') return
  const progress: Record<string, boolean> = JSON.parse(localStorage.getItem(progressKey) || '{}')
  progress[moduleId] = completed
  localStorage.setItem(progressKey, JSON.stringify(progress))
}

export function getProgress(pathId: string): Record<string, boolean> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(`alp_progress_${pathId}`) || '{}')
  } catch { return {} }
}

export function unlockPath(pathId: string): void {
  const paths = getPaths()
  const path = paths.find(p => p.id === pathId)
  if (path) { path.unlocked = true; savePath(path) }
}
