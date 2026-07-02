'use client'

import type { Metadata } from 'next'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { DISCORD_URL } from '@/lib/constants'

const SPECIALTIES = [
  'YouTube Video Editing',
  'Short-Form / TikTok',
  'Gaming Content',
  'Motion Graphics',
  'Thumbnail Design',
  'Faceless Automation',
  'VFX / Visual Effects',
  'Sound Design',
]

const schema = z.object({
  display_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  bio: z.string().min(50, 'Bio must be at least 50 characters'),
  experience_years: z.enum(['0', '1', '2', '3', '5', '8', '10+']),
  timezone: z.string().min(2, 'Please enter your timezone (e.g. UTC+5)'),
  availability: z.string().min(2, 'Please describe your availability'),
  specialties: z.array(z.string()).min(1, 'Select at least one specialty'),
  tools: z.string().min(2, 'Please list the software you use'),
  drive_links: z.string().min(10, 'Please provide at least one portfolio link'),
  portfolio_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  agreed_tos: z.literal(true, { errorMap: () => ({ message: 'You must agree to the Terms of Service' }) }),
})

type FormData = z.infer<typeof schema>

export default function ApplyPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { specialties: [] },
  })

  const selectedSpecialties = watch('specialties') ?? []

  function toggleSpecialty(s: string) {
    const current = selectedSpecialties
    if (current.includes(s)) {
      setValue('specialties', current.filter((x) => x !== s), { shouldValidate: true })
    } else {
      setValue('specialties', [...current, s], { shouldValidate: true })
    }
  }

  async function onSubmit(data: FormData) {
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/apply-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) {
        setErrorMsg(json.message ?? 'Submission failed. Please try again.')
        setStatus('error')
        return
      }
      setStatus('success')
    } catch {
      setErrorMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '12px 16px',
    color: 'var(--text-main)',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    transition: 'border-color 0.2s',
  } as const

  const labelStyle = {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    marginBottom: 6,
    letterSpacing: '0.3px',
  } as const

  const errorStyle = {
    fontSize: '0.74rem',
    color: '#f87171',
    marginTop: 4,
  } as const

  if (status === 'success') {
    return (
      <section style={{ padding: 'min(20vh,160px) min(20px,5%) min(100px,10vw)', maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 20 }}>🎉</div>
        <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.4rem)', fontWeight: 900, color: 'var(--text-main)', marginBottom: 16, letterSpacing: '-1px' }}>
          Application Received
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: 32 }}>
          Thank you for applying to the ExtoArts editor roster. We review applications weekly and reach out via Discord or email within 5–7 business days.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#5865f2', color: '#fff', padding: '12px 24px', borderRadius: 14, fontSize: '0.85rem', fontWeight: 800, textDecoration: 'none' }}>
            <i className="ti ti-brand-discord" aria-hidden="true" /> Join Our Discord
          </a>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '12px 24px', borderRadius: 14, fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>
            Back to Home
          </Link>
        </div>
      </section>
    )
  }

  return (
    <>
      <h1 className="sr-only">Apply to Join the ExtoArts Editor Roster</h1>

      <section style={{ padding: 'min(18vh,140px) min(20px,5%) min(80px,8vw)', maxWidth: 760, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span className="hero-badge" style={{ marginBottom: 24 }}>
            <span className="hero-badge-dot" aria-hidden="true" />
            Editor Applications
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem,6vw,3.8rem)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.04, marginBottom: 20, color: 'var(--text-main)' }}>
            Join the <span className="sweep-text">Roster.</span>
          </h1>
          <p style={{ fontSize: 'clamp(0.95rem,1.8vw,1.1rem)', color: 'var(--text-muted)', maxWidth: 520, margin: '0 auto', lineHeight: 1.72 }}>
            We&apos;re always looking for talented editors and designers who want fair pay, consistent work, and a team that takes the craft seriously.
          </p>
        </div>

        {/* Requirements strip */}
        <div className="tilt-card glass-card sr" style={{ border: '1px solid rgba(34,211,238,0.18)', borderRadius: 18, padding: '20px 24px', marginBottom: 40, display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <div className="tilt-inner" style={{ display: 'flex', flexWrap: 'wrap', gap: 20, width: '100%' }}>
            {[
              { icon: 'ti-clock', text: '3+ months YouTube editing experience' },
              { icon: 'ti-percentage', text: '90% of project rate paid to you' },
              { icon: 'ti-brand-discord', text: 'Discord-based workflow' },
              { icon: 'ti-photo', text: 'Portfolio required' },
            ].map((r) => (
              <span key={r.text} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                <i className={`ti ${r.icon}`} style={{ color: 'var(--primary)', fontSize: '0.95rem' }} aria-hidden="true" />
                {r.text}
              </span>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Display name */}
            <div>
              <label htmlFor="display_name" style={labelStyle}>Display Name / Handle *</label>
              <input id="display_name" type="text" placeholder="e.g. RehanSigma or @yourhandle" style={inputStyle} {...register('display_name')} />
              {errors.display_name && <p style={errorStyle}>{errors.display_name.message}</p>}
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" style={labelStyle}>Bio — Tell us about yourself *</label>
              <textarea id="bio" rows={4} placeholder="Your editing background, what niches you specialise in, what drives your work... (min. 50 characters)" style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.65 }} {...register('bio')} />
              {errors.bio && <p style={errorStyle}>{errors.bio.message}</p>}
            </div>

            {/* Experience + Timezone row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 18 }}>
              <div>
                <label htmlFor="experience_years" style={labelStyle}>Years of Experience *</label>
                <select id="experience_years" style={{ ...inputStyle, cursor: 'pointer' }} {...register('experience_years')}>
                  <option value="">Select...</option>
                  <option value="0">Less than 1 year</option>
                  <option value="1">1 year</option>
                  <option value="2">2 years</option>
                  <option value="3">3 years</option>
                  <option value="5">5 years</option>
                  <option value="8">8 years</option>
                  <option value="10+">10+ years</option>
                </select>
                {errors.experience_years && <p style={errorStyle}>{errors.experience_years.message}</p>}
              </div>
              <div>
                <label htmlFor="timezone" style={labelStyle}>Timezone *</label>
                <input id="timezone" type="text" placeholder="e.g. UTC+5, EST, GMT+0" style={inputStyle} {...register('timezone')} />
                {errors.timezone && <p style={errorStyle}>{errors.timezone.message}</p>}
              </div>
            </div>

            {/* Availability */}
            <div>
              <label htmlFor="availability" style={labelStyle}>Weekly Availability *</label>
              <input id="availability" type="text" placeholder="e.g. Full-time 40h/week, Part-time 15–20h/week" style={inputStyle} {...register('availability')} />
              {errors.availability && <p style={errorStyle}>{errors.availability.message}</p>}
            </div>

            {/* Specialties */}
            <div>
              <label style={labelStyle}>Specialties * (select all that apply)</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
                {SPECIALTIES.map((s) => {
                  const selected = selectedSpecialties.includes(s)
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSpecialty(s)}
                      style={{
                        padding: '9px 14px',
                        borderRadius: 10,
                        border: `1px solid ${selected ? 'rgba(34,211,238,0.45)' : 'var(--border)'}`,
                        background: selected ? 'rgba(34,211,238,0.08)' : 'rgba(255,255,255,0.03)',
                        color: selected ? 'var(--primary)' : 'var(--text-muted)',
                        fontSize: '0.78rem',
                        fontWeight: selected ? 700 : 500,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                        fontFamily: 'var(--font-body)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 7,
                      }}
                    >
                      <i className={`ti ti-${selected ? 'circle-check-filled' : 'circle'}`} aria-hidden="true" style={{ fontSize: '0.9rem' }} />
                      {s}
                    </button>
                  )
                })}
              </div>
              {errors.specialties && <p style={errorStyle}>{errors.specialties.message as string}</p>}
            </div>

            {/* Tools */}
            <div>
              <label htmlFor="tools" style={labelStyle}>Software & Tools *</label>
              <input id="tools" type="text" placeholder="e.g. Adobe Premiere Pro, After Effects, DaVinci Resolve, Photoshop" style={inputStyle} {...register('tools')} />
              {errors.tools && <p style={errorStyle}>{errors.tools.message}</p>}
            </div>

            {/* Drive links */}
            <div>
              <label htmlFor="drive_links" style={labelStyle}>Portfolio / Drive Links * (one per line)</label>
              <textarea id="drive_links" rows={4} placeholder="Google Drive, YouTube channel, Vimeo, Behance — one link per line" style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.65 }} {...register('drive_links')} />
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 5 }}>Include 3–10 representative examples of your best work.</p>
              {errors.drive_links && <p style={errorStyle}>{errors.drive_links.message}</p>}
            </div>

            {/* Portfolio URL (optional) */}
            <div>
              <label htmlFor="portfolio_url" style={labelStyle}>Personal Portfolio Website <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional)</span></label>
              <input id="portfolio_url" type="url" placeholder="https://yourportfolio.com" style={inputStyle} {...register('portfolio_url')} />
              {errors.portfolio_url && <p style={errorStyle}>{errors.portfolio_url.message}</p>}
            </div>

            {/* TOS */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <input
                id="agreed_tos"
                type="checkbox"
                style={{ marginTop: 3, width: 16, height: 16, accentColor: 'var(--primary)', cursor: 'pointer', flexShrink: 0 }}
                {...register('agreed_tos')}
              />
              <label htmlFor="agreed_tos" style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.6, cursor: 'pointer' }}>
                I agree to the{' '}
                <Link href="/tos" target="_blank" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>
                  Terms of Service
                </Link>{' '}
                and understand that my submitted work samples may be reviewed by the ExtoArts team.
              </label>
            </div>
            {errors.agreed_tos && <p style={errorStyle}>{errors.agreed_tos.message}</p>}

            {/* Error banner */}
            {status === 'error' && (
              <div style={{ padding: '14px 18px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, fontSize: '0.84rem', color: '#fca5a5' }}>
                {errorMsg}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn btn-main"
              style={{ width: '100%', borderRadius: 16, fontSize: '0.9rem', padding: '15px 28px', opacity: status === 'loading' ? 0.7 : 1, cursor: status === 'loading' ? 'not-allowed' : 'pointer' }}
            >
              {status === 'loading' ? (
                <>
                  <i className="ti ti-loader-2" aria-hidden="true" style={{ animation: 'spin 1s linear infinite' }} /> Submitting...
                </>
              ) : (
                <>
                  <i className="ti ti-send" aria-hidden="true" /> Submit Application
                </>
              )}
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Already an editor?{' '}
              <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>
                Join the Discord server directly
              </a>
            </p>
          </div>
        </form>
      </section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus, textarea:focus, select:focus { border-color: rgba(34,211,238,0.45) !important; box-shadow: 0 0 0 3px rgba(34,211,238,0.08); }
        select option { background: var(--surface); color: var(--text-main); }
      `}</style>
    </>
  )
}
