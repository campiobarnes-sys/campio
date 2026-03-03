'use client'
import { useEffect, useState } from 'react'
import { getPaths, getProgress } from '@/lib/storage'
import { LearningPath } from '@/types'
import Link from 'next/link'

export default function Dashboard() {
  const [paths, setPaths] = useState<LearningPath[]>([])

  useEffect(() => { setPaths(getPaths()) }, [])

  if (paths.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <nav className="px-6 py-5 border-b border-[var(--border)] flex items-center justify-between">
          <Link href="/" className="text-lg font-bold">⬡ <span className="gradient-text">AI Learning Paths</span></Link>
          <Link href="/onboarding" className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent2)] transition-colors">Generate Path</Link>
        </nav>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="text-5xl mb-4">🗺️</div>
          <h2 className="text-2xl font-bold mb-2">No paths yet</h2>
          <p className="text-[var(--muted)] mb-6">Generate your first personalized learning path to get started.</p>
          <Link href="/onboarding" className="px-6 py-3 rounded-xl bg-[var(--accent)] text-white font-bold hover:bg-[var(--accent2)] transition-all">
            Generate My Learning Path →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <nav className="px-6 py-5 border-b border-[var(--border)] flex items-center justify-between">
        <Link href="/" className="text-lg font-bold">⬡ <span className="gradient-text">AI Learning Paths</span></Link>
        <Link href="/onboarding" className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent2)] transition-colors">New Path</Link>
      </nav>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Your Learning Paths</h1>
        <p className="text-[var(--muted)] mb-8">{paths.length} path{paths.length !== 1 ? 's' : ''} saved</p>
        <div className="space-y-4">
          {paths.map(path => {
            const prog = getProgress(path.id)
            const done = Object.values(prog).filter(Boolean).length
            const pct = path.modules.length ? Math.round((done / path.modules.length) * 100) : 0
            return (
              <Link key={path.id} href={`/results?pathId=${path.id}`}
                className="block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 hover:border-[var(--accent)] transition-all hover:-translate-y-0.5 group">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[rgba(124,106,255,0.1)] text-[var(--accent2)] border border-[rgba(124,106,255,0.2)]">{path.difficulty}</span>
                      {path.unlocked && <span className="text-xs text-[var(--green)]">✓ Unlocked</span>}
                      {!path.unlocked && <span className="text-xs text-[var(--muted)]">Free tier</span>}
                    </div>
                    <h3 className="font-bold text-lg group-hover:text-[var(--accent)] transition-colors">{path.title}</h3>
                    <p className="text-sm text-[var(--muted)] mt-0.5">{path.estimatedDuration} · {path.modules.length} modules</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-black text-[var(--accent)]">{pct}%</div>
                    <div className="text-xs text-[var(--muted)]">complete</div>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--border)]">
                  <div className="h-full rounded-full bg-[var(--accent)] transition-all" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-[var(--muted)] mt-2">Created {new Date(path.createdAt).toLocaleDateString()}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
