'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { getPath, savePath, getProgress, updateProgress } from '@/lib/storage'
import { LearningPath, Module } from '@/types'
import Link from 'next/link'

function ResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathId = searchParams.get('pathId')
  const unlocked = searchParams.get('unlocked') === 'true'
  const [path, setPath] = useState<LearningPath | null>(null)
  const [progress, setProgress] = useState<Record<string, boolean>>({})
  const [checkingOut, setCheckingOut] = useState(false)

  useEffect(() => {
    if (!pathId) { router.push('/onboarding'); return }
    const p = getPath(pathId)
    if (!p) { router.push('/onboarding'); return }
    if (unlocked && !p.unlocked) { p.unlocked = true; savePath(p) }
    setPath(p)
    setProgress(getProgress(pathId))
  }, [pathId, unlocked])

  async function handleUpgrade(tier: 'starter' | 'pro') {
    if (!path) return
    setCheckingOut(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, pathId: path.id, email: path.answers.email })
      })
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch { setCheckingOut(false) }
  }

  function toggleModule(moduleId: string) {
    if (!path) return
    const newVal = !progress[moduleId]
    updateProgress(path.id, moduleId, newVal)
    setProgress(prev => ({ ...prev, [moduleId]: newVal }))
  }

  if (!path) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-[var(--accent)] border-t-transparent spin" />
    </div>
  )

  const isUnlocked = path.unlocked
  const completedCount = Object.values(progress).filter(Boolean).length
  const progressPct = path.modules.length ? Math.round((completedCount / path.modules.length) * 100) : 0

  return (
    <div className="min-h-screen">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight"><span className="gradient-text">Campio</span></Link>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors">Dashboard</Link>
          {!isUnlocked && (
            <button onClick={() => handleUpgrade('starter')} disabled={checkingOut}
              className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent2)] transition-colors disabled:opacity-60">
              {checkingOut ? 'Loading...' : 'Unlock Full Path — $19'}
            </button>
          )}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-28 pb-20">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[rgba(124,106,255,0.1)] text-[var(--accent2)] border border-[rgba(124,106,255,0.2)]">{path.difficulty}</span>
            <span className="text-xs text-[var(--muted)]">{path.estimatedDuration}</span>
            <span className="text-xs text-[var(--muted)]">·</span>
            <span className="text-xs text-[var(--muted)]">{path.modules.length} modules</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">{path.title}</h1>
          <p className="text-[var(--muted)] text-lg leading-relaxed">{path.description}</p>
        </div>

        {/* Progress */}
        {isUnlocked && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold">Your Progress</span>
              <span className="text-sm text-[var(--muted)]">{completedCount}/{path.modules.length} modules</span>
            </div>
            <div className="h-2 rounded-full bg-[var(--border)]">
              <div className="h-full rounded-full bg-[var(--accent)] transition-all duration-500" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        )}

        {/* Modules */}
        <div className="space-y-4 mb-12">
          <h2 className="text-2xl font-bold mb-6">Your Curriculum</h2>
          {path.modules.map((module, i) => {
            const locked = !isUnlocked && i >= 2
            const done = progress[module.id]
            return (
              <div key={module.id} className={`relative rounded-2xl border transition-all ${done ? 'border-[var(--accent)] bg-[rgba(124,106,255,0.05)]' : 'border-[var(--border)] bg-[var(--surface)]'} ${locked ? 'opacity-60' : 'hover:border-[var(--accent)]'}`}>
                {locked && (
                  <div className="absolute inset-0 rounded-2xl backdrop-blur-sm flex items-center justify-center z-10 bg-[rgba(10,10,15,0.6)]">
                    <div className="text-center">
                      <div className="text-2xl mb-2">🔒</div>
                      <p className="text-sm font-semibold text-[var(--text)]">Unlock with Starter or Pro</p>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[rgba(124,106,255,0.15)] flex items-center justify-center text-sm font-bold text-[var(--accent)]">{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-bold text-lg">{module.title}</h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-[var(--muted)]">{module.estimatedHours}h</span>
                          {!locked && (
                            <button onClick={() => toggleModule(module.id)}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${done ? 'border-[var(--accent)] bg-[var(--accent)] text-white' : 'border-[var(--muted)]'}`}>
                              {done && <span className="text-xs">✓</span>}
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-[var(--muted)] text-sm mb-4">{module.description}</p>

                      {/* Objectives */}
                      <div className="mb-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)] mb-2">Learning Objectives</p>
                        <ul className="space-y-1">
                          {module.objectives.map((obj, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                              <span className="text-[var(--accent)] mt-0.5 flex-shrink-0">→</span>{obj}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Resources */}
                      {module.resources.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)] mb-2">Resources</p>
                          <div className="space-y-1.5">
                            {module.resources.map((r, j) => (
                              <a key={j} href={r.url} target="_blank" rel="noopener"
                                className="flex items-center gap-2 text-sm text-[var(--text)] hover:text-[var(--accent)] transition-colors group">
                                <span className="text-[var(--muted)] text-xs w-12 flex-shrink-0">{r.type}</span>
                                <span className="group-hover:underline truncate">{r.title}</span>
                                {r.free && <span className="text-xs text-[var(--green)] flex-shrink-0">free</span>}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Projects */}
                      {module.projects.length > 0 && (isUnlocked || i < 2) && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)] mb-2">Projects</p>
                          <div className="space-y-2">
                            {module.projects.map((proj, j) => (
                              <div key={j} className="rounded-lg border border-[var(--border)] p-3 bg-[rgba(124,106,255,0.04)]">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-semibold text-sm">{proj.title}</span>
                                  <span className="text-xs text-[var(--muted)]">{proj.estimatedHours}h · {proj.difficulty}</span>
                                </div>
                                <p className="text-xs text-[var(--muted)]">{proj.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Milestone after this module */}
                {path.milestones?.filter(m => m.afterModuleIndex === i).map((ms, j) => (
                  <div key={j} className="mx-6 mb-6 p-3 rounded-lg bg-[rgba(124,106,255,0.08)] border border-[rgba(124,106,255,0.2)] flex items-center gap-3">
                    <span className="text-xl">{ms.badge}</span>
                    <div>
                      <p className="font-semibold text-sm">{ms.title}</p>
                      <p className="text-xs text-[var(--muted)]">{ms.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>

        {/* Upgrade CTA */}
        {!isUnlocked && (
          <div className="rounded-2xl border border-[rgba(124,106,255,0.3)] bg-[rgba(124,106,255,0.06)] p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Unlock Your Full Path</h3>
            <p className="text-[var(--muted)] mb-6">You're seeing 2 of {path.modules.length} modules. Unlock everything — all modules, guided projects, and resources.</p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button onClick={() => handleUpgrade('starter')} disabled={checkingOut}
                className="px-6 py-3 rounded-xl bg-[var(--accent)] text-white font-bold hover:bg-[var(--accent2)] transition-all disabled:opacity-60">
                {checkingOut ? 'Loading...' : 'Starter — $19 one-time'}
              </button>
              <button onClick={() => handleUpgrade('pro')} disabled={checkingOut}
                className="px-6 py-3 rounded-xl border border-[var(--border)] text-[var(--text)] font-semibold hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all disabled:opacity-60">
                Pro — $29/month
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Results() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 rounded-full border-2 border-[var(--accent)] border-t-transparent spin" /></div>}><ResultsContent /></Suspense>
}
