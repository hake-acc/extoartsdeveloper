'use client'

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
  const [submitted, setSubmitted] = useState(false)

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

  function onSubmit(_data: FormData) {
    setSubmitted(true)
    window.open(DISCORD_URL, '_blank', 'noopener,noreferrer')
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

  if (submitted) {
    return (
      <section style={{ padding: 'min(20vh,160px) min(20px,5%) min(100px,10vw)', maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 20 }}>🎉</div>
        <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.4rem)', fontWeight: 900, color: 'var(--text-main)', marginBottom: 16, letterSpacing: '-1px' }}>
          One Last Step
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: 32 }}>
          We&apos;ve opened our Discord server for you. Please send your application details there so our team can review it.
        </p>
        <a
          href={DISCORD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-main"
          style={{ borderRadius: 16, fontSize: '0.9rem', padding: '15px 32px', display: 'inline-flex' }}
        >
          <i className="ti ti-brand-discord" aria-hidden="true" /> Open Discord
        </a>
      </section>
    )
  }

  return (
    <>
      <h1 className="sr-only">Apply as a Video Editor - ExtoArts</h1>

      <section style={{ padding: 'min(20vh,160px) min(20px,5%) min(100px,10vw)', maxWidth: 780, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <span className="hero-badge" style={{ marginBottom: 24 }}>
            <span className="hero-badge-dot" aria-hidden="true" />
            We&apos;re Hiring
          </span>
          <h1 style={{ fontSize: 'clamp(2.4rem,5.5vw,3.8rem)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.05, marginBottom: 20, color: 'var(--text-main)' }}>
            Join the <span className="sweep-text">ExtoArts</span> Team.
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.75, maxWidth: 540, margin: '0 auto' }}>
            We work with talented editors worldwide. Tell us about yourself and we&apos;ll reach out if there&apos;s a match.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="glass-card tilt-card" style={{ border: '1px solid var(--border)', borderRadius: 22, padding: 'min(48px,5vw)' }}>
            <div className="tilt-inner" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* Name */}
              <div>
                <label htmlFor="display_name" style={labelStyle}>Your Name / Handle</label>
                <input id="display_name" type="text" style={inputStyle} placeholder="How should we call you?" {...register('display_name')} />
                {errors.display_name && <p style={errorStyle}>{errors.display_name.message}</p>}
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="bio" style={labelStyle}>Short Bio</label>
                <textarea id="bio" rows={4} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.65 }} placeholder="Tell us who you are, what drives your work, and why ExtoArts..." {...register('bio')} />
                {errors.bio && <p style={errorStyle}>{errors.bio.message}</p>}
              </div>

              {/* Experience + Timezone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label htmlFor="experience_years" style={labelStyle}>Years of Experience</label>
                  <select id="experience_years" style={{ ...inputStyle, cursor: 'pointer' }} {...register('experience_years')}>
                    <option value="">Select...</option>
                    {(['0', '1', '2', '3', '5', '8', '10+'] as const).map((v) => (
                      <option key={v} value={v}>{v === '0' ? 'Less than 1 year' : v === '10+' ? '10+ years' : `${v} year${v === '1' ? '' : 's'}`}</option>
                    ))}
                  </select>
                  {errors.experience_years && <p style={errorStyle}>{errors.experience_years.message}</p>}
                </div>
                <div>
                  <label htmlFor="timezone" style={labelStyle}>Your Timezone</label>
                  <input id="timezone" type="text" style={inputStyle} placeholder="e.g. UTC+5, EST, PST" {...register('timezone')} />
                  {errors.timezone && <p style={errorStyle}>{errors.timezone.message}</p>}
                </div>
              </div>

              {/* Availability */}
              <div>
                <label htmlFor="availability" style={labelStyle}>Availability</label>
                <input id="availability" type="text" style={inputStyle} placeholder="e.g. 20 hrs/week, weekdays only, full-time" {...register('availability')} />
                {errors.availability && <p style={errorStyle}>{errors.availability.message}</p>}
              </div>

              {/* Specialties */}
              <div>
                <p style={labelStyle}>Specialties <span style={{ fontWeight: 400, opacity: 0.6 }}>(select all that apply)</span></p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {SPECIALTIES.map((s) => {
                    const active = selectedSpecialties.includes(s)
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSpecialty(s)}
                        style={{
                          padding: '7px 14px',
                          borderRadius: 999,
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          border: active ? '1px solid var(--primary)' : '1px solid var(--border)',
                          background: active ? 'rgba(34,211,238,0.1)' : 'transparent',
                          color: active ? 'var(--primary)' : 'var(--text-muted)',
                          transition: 'all 0.2s',
                          fontFamily: 'var(--font-body)',
                        }}
                      >
                        {s}
                      </button>
                    )
                  })}
                </div>
                {errors.specialties && <p style={errorStyle}>{errors.specialties.message}</p>}
              </div>

              {/* Tools */}
              <div>
                <label htmlFor="tools" style={labelStyle}>Software & Tools</label>
                <input id="tools" type="text" style={inputStyle} placeholder="e.g. Premiere Pro, After Effects, DaVinci Resolve" {...register('tools')} />
                {errors.tools && <p style={errorStyle}>{errors.tools.message}</p>}
              </div>

              {/* Portfolio links */}
              <div>
                <label htmlFor="drive_links" style={labelStyle}>Portfolio / Work Samples</label>
                <textarea id="drive_links" rows={3} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.65 }} placeholder="Google Drive, YouTube, Dropbox links — one per line" {...register('drive_links')} />
                {errors.drive_links && <p style={errorStyle}>{errors.drive_links.message}</p>}
              </div>

              {/* Portfolio website (optional) */}
              <div>
                <label htmlFor="portfolio_url" style={{ ...labelStyle, opacity: 0.7 }}>Portfolio Website <span style={{ fontWeight: 400 }}>(optional)</span></label>
                <input id="portfolio_url" type="url" style={inputStyle} placeholder="https://yourportfolio.com" {...register('portfolio_url')} />
                {errors.portfolio_url && <p style={errorStyle}>{errors.portfolio_url.message}</p>}
              </div>

              {/* ToS */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <input id="agreed_tos" type="checkbox" style={{ marginTop: 3, accentColor: 'var(--primary)', flexShrink: 0, width: 16, height: 16 }} {...register('agreed_tos')} />
                <label htmlFor="agreed_tos" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, cursor: 'pointer' }}>
                  I agree to the{' '}
                  <Link href="/tos" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>
                    Terms of Service
                  </Link>{' '}
                  and understand that my submitted work samples may be reviewed by the ExtoArts team.
                </label>
              </div>
              {errors.agreed_tos && <p style={errorStyle}>{errors.agreed_tos.message}</p>}

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-main"
                style={{ width: '100%', borderRadius: 16, fontSize: '0.9rem', padding: '15px 28px' }}
              >
                <i className="ti ti-brand-discord" aria-hidden="true" /> Submit via Discord
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Prefer a direct approach?{' '}
                <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>
                  Join the Discord server directly
                </a>
              </p>
            </div>
          </div>
        </form>
      </section>

      <style>{`
        input:focus, textarea:focus, select:focus { border-color: rgba(34,211,238,0.45) !important; box-shadow: 0 0 0 3px rgba(34,211,238,0.08); }
        select option { background: var(--surface); color: var(--text-main); }
      `}</style>
    </>
  )
}
