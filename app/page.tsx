import Link from 'next/link'

const EXAMPLE_PATHS = [
  { title: "From Zero to ML Engineer", level: "Beginner", duration: "6 months", domain: "General ML", modules: 8 },
  { title: "Generative AI for Developers", level: "Intermediate", duration: "3 months", domain: "Generative AI", modules: 6 },
  { title: "NLP Specialist Track", level: "Advanced", duration: "4 months", domain: "NLP", modules: 7 },
]

const STEPS = [
  { n: "01", title: "Answer 5 questions", desc: "Tell us your background, goals, and how much time you have. Takes under 2 minutes." },
  { n: "02", title: "AI generates your path", desc: "Claude crafts a personalized curriculum with curated resources and hands-on projects just for you." },
  { n: "03", title: "Learn and track progress", desc: "Work through your modules at your own pace. Check off milestones as you grow." },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold tracking-tight">⬡ <span className="gradient-text">AI Learning Paths</span></span>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors">Pricing</Link>
          <Link href="/dashboard" className="text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors">Dashboard</Link>
          <Link href="/onboarding" className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent2)] transition-colors">Get Started</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(124,106,255,0.2) 0%, transparent 70%)'}} />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[var(--accent2)] border border-[rgba(124,106,255,0.3)] bg-[rgba(124,106,255,0.08)] mb-6">
            ✦ Powered by Claude AI
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6">
            Your personalized<br /><span className="gradient-text">AI learning path</span>,<br />generated in seconds.
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-xl mx-auto mb-10">
            Answer 5 questions about your background and goals. Get a fully structured AI/ML curriculum with curated resources, hands-on projects, and milestones — built just for you.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/onboarding" className="px-8 py-4 rounded-xl bg-[var(--accent)] text-white font-bold text-lg hover:bg-[var(--accent2)] transition-all hover:-translate-y-0.5 shadow-lg shadow-[rgba(124,106,255,0.3)]">
              Generate My Learning Path →
            </Link>
            <Link href="/pricing" className="px-8 py-4 rounded-xl border border-[var(--border)] text-[var(--text)] font-semibold text-lg hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all">
              See Pricing
            </Link>
          </div>
          <p className="mt-4 text-sm text-[var(--muted)]">Free to start · No account required</p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6 border-t border-[var(--border)]">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-3">How it works</p>
          <h2 className="text-center text-4xl font-bold tracking-tight mb-14">From zero to learning in 3 steps</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map(s => (
              <div key={s.n} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 hover:border-[var(--accent)] transition-colors group">
                <div className="text-4xl font-black text-[rgba(124,106,255,0.2)] group-hover:text-[rgba(124,106,255,0.4)] transition-colors mb-4">{s.n}</div>
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-[var(--muted)] text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXAMPLE PATHS */}
      <section className="py-20 px-6 border-t border-[var(--border)]">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-3">Examples</p>
          <h2 className="text-center text-4xl font-bold tracking-tight mb-4">What paths look like</h2>
          <p className="text-center text-[var(--muted)] mb-14 max-w-md mx-auto">Every path is unique. Here are a few examples of what people have generated.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {EXAMPLE_PATHS.map(p => (
              <div key={p.title} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 hover:border-[var(--accent)] transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[rgba(124,106,255,0.1)] text-[var(--accent2)] border border-[rgba(124,106,255,0.2)]">{p.domain}</span>
                  <span className="text-xs text-[var(--muted)]">{p.duration}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{p.title}</h3>
                <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
                  <span>{p.level}</span>
                  <span>·</span>
                  <span>{p.modules} modules</span>
                </div>
                <div className="mt-4 space-y-1.5">
                  {['Foundations', 'Core concepts', 'Applied projects'].map(m => (
                    <div key={m} className="flex items-center gap-2 text-xs text-[var(--muted)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                      {m}
                    </div>
                  ))}
                  <div className="text-xs text-[var(--muted)] pl-3.5">+ {p.modules - 3} more modules...</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/onboarding" className="px-8 py-4 rounded-xl bg-[var(--accent)] text-white font-bold hover:bg-[var(--accent2)] transition-all inline-block hover:-translate-y-0.5">
              Generate Mine →
            </Link>
          </div>
        </div>
      </section>

      {/* PRICING TEASER */}
      <section className="py-20 px-6 border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold tracking-tight mb-4">Start free, upgrade when ready</h2>
          <p className="text-[var(--muted)] mb-8">Generate your basic path for free. Unlock the full curriculum, guided projects, and monthly new content with Starter or Pro.</p>
          <div className="flex items-center justify-center gap-6 flex-wrap text-sm">
            {['Free basic path', 'Full path from $19', 'Monthly projects at $29/mo'].map(f => (
              <div key={f} className="flex items-center gap-2 text-[var(--muted)]">
                <span className="text-[var(--green)]">✓</span> {f}
              </div>
            ))}
          </div>
          <Link href="/pricing" className="mt-8 inline-block text-[var(--accent)] hover:text-[var(--accent2)] font-semibold text-sm transition-colors">
            See full pricing →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[var(--border)] py-8 px-6 text-center text-sm text-[var(--muted)]">
        <p>AI Learning Paths · Built with Claude AI · <Link href="/pricing" className="hover:text-[var(--accent)] transition-colors">Pricing</Link> · <Link href="/dashboard" className="hover:text-[var(--accent)] transition-colors">Dashboard</Link></p>
      </footer>
    </div>
  )
}
