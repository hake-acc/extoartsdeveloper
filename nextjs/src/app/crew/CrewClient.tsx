'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'

interface Member {
  name: string
  role: string
  image?: string
  quote?: string
  about: string
  isPlaceholder?: boolean
  accentHue?: number   // HSL hue for the per-card accent glow
}

const CREW_MEMBERS: Member[] = [
  {
    name: 'Rehan Khan',
    role: 'Founder & Creative Director',
    image: '/images/crew/rehan.png',
    quote: "The best editors deserve the most money. That's why we take 10%, not 40%.",
    about: "I built ExtoArts because I watched creators overpay for mediocre work, over and over again. Good editing shouldn't cost 40% of your budget in agency fees—that math has never made sense.",
    accentHue: 265,
  },
  {
    name: 'Kunjal Joshi',
    role: 'Founder, CEO & CTO',
    image: '/images/crew/kunjal.jpg',
    about: "Kunjal Joshi leads ExtoArts as CEO and CTO, driving the company's technology and long-term vision. Passionate about software engineering, he focuses on building scalable systems, modern web applications, automation, and developer-first solutions.",
    accentHue: 200,
  },
  {
    name: 'Hake Acc',
    role: 'Founder, CMO & Outsourcing Manager',
    image: '/images/crew/hake.png',
    about: "Hake Acc oversees outsourcing operations and marketing strategy at ExtoArts. He manages client relationships, coordinates external talent, and ensures projects are delivered efficiently while expanding the company's reach through strategic marketing.",
    accentHue: 320,
  },
  {
    name: 'Septileye',
    role: 'Co-Founder & Creative Manager',
    image: '/images/crew/septileye.png',
    about: "Septileye leads the creative direction of ExtoArts, ensuring every project maintains exceptional visual quality and storytelling. From branding to video production, he helps transform ideas into impactful creative experiences.",
    accentHue: 35,
  },
  {
    name: 'Subh',
    role: 'Co-Founder & Creative Manager',
    image: '/images/crew/subh.png',
    about: "Subh is a Co-Founder and Creative Manager at ExtoArts, playing a key role in shaping the agency's creative output. He brings a sharp eye for detail and a passion for visual storytelling, helping ensure every project meets the highest standards of quality and creativity.",
    accentHue: 150,
  },
  {
    name: 'Future Team Member',
    role: 'You?',
    isPlaceholder: true,
    about: "We are always looking for talented video editors, thumbnail designers, and creative strategists to join our team. Think you have what it takes? Open a ticket on our Discord!",
    accentHue: 265,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 55,
      damping: 14,
    },
  },
}

export function CrewClient() {
  const reduce = useReducedMotion()

  return (
    <>
      {/* Hero Badge and Text */}
      <section style={{ padding: 'min(20vh,160px) min(24px,5%) min(60px,6vw)', textAlign: 'center', maxWidth: 850, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <motion.span
          initial={reduce ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="hero-badge"
          style={{ marginBottom: 28 }}
        >
          <span className="hero-badge-dot" aria-hidden="true" />
          Meet the Crew
        </motion.span>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ fontSize: 'clamp(2.4rem,7vw,4.5rem)', fontWeight: 900, letterSpacing: '-2.5px', lineHeight: 1.05, marginBottom: 24, color: 'var(--text-main)' }}
        >
          The Creators Behind<br /><span className="sweep-text">Our Editing.</span>
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ fontSize: 'clamp(0.95rem,1.8vw,1.15rem)', color: 'var(--text-muted)', maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}
        >
          Get to know the team building ExtoArts. We combine software automation, branding, and storytelling to unlock maximum growth for creators.
        </motion.p>
      </section>

      {/* Grid Section */}
      <section style={{ padding: '0 min(24px,5%) min(120px,10vw)', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <motion.div
          className="crew-grid"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {CREW_MEMBERS.map((member, index) => (
            <motion.article
              key={`${member.name}-${index}`}
              variants={itemVariants}
              className="crew-card"
              style={{ '--card-hue': member.accentHue ?? 265 } as React.CSSProperties}
              whileHover={reduce ? undefined : { y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
            >
              {/* Shimmer overlay */}
              <div className="crew-card__shimmer" aria-hidden="true" />

              {/* Top accent bar */}
              <div className="crew-card__accent-bar" aria-hidden="true" />

              <div className="crew-card__inner">
                {/* Avatar */}
                {member.isPlaceholder ? (
                  <div className="crew-avatar crew-avatar--placeholder">
                    <i className="ti ti-plus" style={{ fontSize: '2rem', color: 'var(--primary-accent)' }} aria-hidden="true" />
                  </div>
                ) : (
                  member.image && (
                    <div className="crew-avatar">
                      <div className="crew-avatar__ring" aria-hidden="true" />
                      <div className="crew-avatar__img-wrap">
                        <Image
                          src={member.image}
                          alt={`${member.name} — ${member.role}`}
                          fill
                          sizes="108px"
                          style={{ objectFit: 'cover' }}
                          priority={index < 3}
                        />
                      </div>
                    </div>
                  )
                )}

                {/* Name */}
                <h2 className="crew-name">{member.name}</h2>

                {/* Role badge */}
                <span className="crew-role-badge">{member.role}</span>

                {/* Divider */}
                <div className="crew-divider" aria-hidden="true" />

                {/* Quote */}
                {member.quote && (
                  <blockquote className="crew-quote">
                    &ldquo;{member.quote}&rdquo;
                  </blockquote>
                )}

                {/* About */}
                <p className="crew-about">{member.about}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <style>{`
          /* ── Grid ─────────────────────────────────────────── */
          .crew-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }

          /* ── Card shell ───────────────────────────────────── */
          .crew-card {
            position: relative;
            border-radius: 20px;
            overflow: hidden;
            /* glass base */
            background:
              linear-gradient(
                145deg,
                rgba(255,255,255,0.04) 0%,
                rgba(255,255,255,0.01) 100%
              );
            border: 1px solid rgba(255,255,255,0.07);
            box-shadow:
              0 1px 0 0 rgba(255,255,255,0.06) inset,
              0 24px 48px -12px rgba(0,0,0,0.55),
              0 0 0 1px rgba(0,0,0,0.3);
            transition:
              box-shadow 0.35s cubic-bezier(0.23,1,0.32,1),
              border-color 0.35s cubic-bezier(0.23,1,0.32,1);
            backdrop-filter: blur(12px);
          }

          .crew-card:hover {
            border-color: hsla(var(--card-hue), 70%, 65%, 0.3);
            box-shadow:
              0 1px 0 0 rgba(255,255,255,0.08) inset,
              0 32px 64px -16px rgba(0,0,0,0.65),
              0 0 0 1px rgba(0,0,0,0.4),
              0 0 40px -8px hsla(var(--card-hue), 70%, 60%, 0.22);
          }

          /* ── Top accent bar ───────────────────────────────── */
          .crew-card__accent-bar {
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 2px;
            background: linear-gradient(
              90deg,
              transparent 0%,
              hsla(var(--card-hue), 75%, 65%, 0.9) 50%,
              transparent 100%
            );
            opacity: 0;
            transition: opacity 0.35s ease;
          }
          .crew-card:hover .crew-card__accent-bar {
            opacity: 1;
          }

          /* ── Shimmer sweep ────────────────────────────────── */
          .crew-card__shimmer {
            position: absolute;
            inset: 0;
            background: linear-gradient(
              115deg,
              transparent 30%,
              hsla(var(--card-hue), 80%, 70%, 0.06) 50%,
              transparent 70%
            );
            background-size: 200% 100%;
            background-position: -100% 0;
            transition: background-position 0.6s cubic-bezier(0.23,1,0.32,1);
            pointer-events: none;
            border-radius: inherit;
          }
          .crew-card:hover .crew-card__shimmer {
            background-position: 100% 0;
          }

          /* ── Inner padding ────────────────────────────────── */
          .crew-card__inner {
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 36px 28px 32px;
          }

          /* ── Avatar ───────────────────────────────────────── */
          .crew-avatar {
            position: relative;
            width: 108px;
            height: 108px;
            margin-bottom: 22px;
            flex-shrink: 0;
          }

          .crew-avatar__ring {
            position: absolute;
            inset: -4px;
            border-radius: 50%;
            background: conic-gradient(
              from 0deg,
              hsla(var(--card-hue), 75%, 65%, 0.9),
              hsla(var(--card-hue), 75%, 65%, 0.1) 40%,
              hsla(var(--card-hue), 75%, 65%, 0.9) 100%
            );
            animation: crew-ring-spin 5s linear infinite;
            opacity: 0;
            transition: opacity 0.4s ease;
          }
          .crew-card:hover .crew-avatar__ring {
            opacity: 1;
          }

          @keyframes crew-ring-spin {
            to { transform: rotate(360deg); }
          }

          /* Mask the ring gap so it looks like a border ring */
          .crew-avatar__ring::after {
            content: '';
            position: absolute;
            inset: 3px;
            border-radius: 50%;
            background: #0e0c0a;
          }

          .crew-avatar__img-wrap {
            position: absolute;
            inset: 0;
            border-radius: 50%;
            overflow: hidden;
            border: 2px solid rgba(255,255,255,0.08);
          }

          .crew-avatar--placeholder {
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(167,139,250,0.05) 100%);
            border: 2px dashed rgba(124,58,237,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 22px;
          }

          /* ── Name ─────────────────────────────────────────── */
          .crew-name {
            font-size: 1.25rem;
            font-weight: 800;
            color: var(--text-main);
            letter-spacing: -0.4px;
            margin: 0 0 10px;
            line-height: 1.2;
          }

          /* ── Role badge ───────────────────────────────────── */
          .crew-role-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 12px;
            border-radius: 100px;
            background: hsla(var(--card-hue), 70%, 60%, 0.12);
            border: 1px solid hsla(var(--card-hue), 70%, 60%, 0.25);
            color: hsla(var(--card-hue), 80%, 75%, 1);
            font-size: 0.7rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            margin-bottom: 20px;
            transition: background 0.3s ease, border-color 0.3s ease;
          }
          .crew-card:hover .crew-role-badge {
            background: hsla(var(--card-hue), 70%, 60%, 0.2);
            border-color: hsla(var(--card-hue), 70%, 60%, 0.4);
          }

          /* ── Divider ──────────────────────────────────────── */
          .crew-divider {
            width: 40px;
            height: 1px;
            background: linear-gradient(
              90deg,
              transparent,
              hsla(var(--card-hue), 60%, 60%, 0.5),
              transparent
            );
            margin: 0 auto 18px;
            transition: width 0.35s cubic-bezier(0.23,1,0.32,1);
          }
          .crew-card:hover .crew-divider {
            width: 80px;
          }

          /* ── Quote ────────────────────────────────────────── */
          .crew-quote {
            border-left: 2px solid hsla(var(--card-hue), 70%, 65%, 0.6);
            padding: 4px 0 4px 12px;
            margin: 0 0 16px;
            color: #e5e7eb;
            font-style: italic;
            font-size: 0.88rem;
            line-height: 1.6;
            text-align: left;
            align-self: stretch;
            border-radius: 0 4px 4px 0;
            background: hsla(var(--card-hue), 60%, 60%, 0.05);
          }

          /* ── About ────────────────────────────────────────── */
          .crew-about {
            font-size: 0.88rem;
            color: #e5e7eb;
            line-height: 1.7;
            margin: 0;
            text-align: left;
          }

          /* ── Light mode ───────────────────────────────────── */
          [data-theme="light"] .crew-card {
            background:
              linear-gradient(
                145deg,
                rgba(255,255,255,0.85) 0%,
                rgba(255,252,246,0.65) 100%
              );
            border-color: rgba(0,0,0,0.07);
            box-shadow:
              0 1px 0 0 rgba(255,255,255,0.9) inset,
              0 12px 32px -8px rgba(0,0,0,0.08),
              0 0 0 1px rgba(0,0,0,0.04);
          }
          [data-theme="light"] .crew-card:hover {
            border-color: hsla(var(--card-hue), 70%, 55%, 0.35);
            box-shadow:
              0 1px 0 0 rgba(255,255,255,0.9) inset,
              0 20px 48px -12px rgba(0,0,0,0.14),
              0 0 32px -8px hsla(var(--card-hue), 70%, 55%, 0.15);
          }
          [data-theme="light"] .crew-avatar__ring::after {
            background: #fff;
          }
          [data-theme="light"] .crew-quote {
            background: hsla(var(--card-hue), 60%, 55%, 0.06);
            color: #374151;
          }
          [data-theme="light"] .crew-about {
            color: #4b5563;
          }

          /* ── Responsive ───────────────────────────────────── */
          @media (max-width: 990px) {
            .crew-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
            }
          }

          @media (max-width: 660px) {
            .crew-grid {
              grid-template-columns: 1fr;
              gap: 18px;
              max-width: 420px;
              margin: 0 auto;
            }
          }

          /* ── Reduced motion ───────────────────────────────── */
          @media (prefers-reduced-motion: reduce) {
            .crew-card__shimmer,
            .crew-avatar__ring {
              display: none;
            }
            .crew-card__accent-bar {
              transition: none;
            }
            .crew-divider {
              transition: none;
            }
          }
        `}</style>
      </section>
    </>
  )
}
