import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import { JsonLd } from '@/components/JsonLd'
import { SITE_URL } from '@/lib/constants'
import { ApplyClient } from './ApplyClient'

export const metadata: Metadata = buildMetadata({
  title: 'Apply as a Video Editor — Join the ExtoArts Team',
  description: 'Apply to join ExtoArts as a specialist video editor. We hire YouTube editors, thumbnail designers, Shorts editors, gaming content specialists, and motion graphics artists worldwide.',
  path: '/apply',
  noIndex: false,
})

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${SITE_URL}/apply`,
  url: `${SITE_URL}/apply`,
  name: 'Apply as a Video Editor — Join the ExtoArts Team',
  description: 'Apply to join ExtoArts as a specialist video editor or thumbnail designer. We hire talented editors worldwide across all YouTube niches.',
  inLanguage: 'en-US',
  isPartOf: { '@id': `${SITE_URL}/#website` },
  about: { '@id': `${SITE_URL}/#organization` },
}

export default function ApplyPage() {
  return (
    <>
      <JsonLd data={webPageSchema} />

      {/* SEO-visible context — server rendered for crawlers */}
      <div className="sr-only">
        <h2>What ExtoArts Looks for in Editors</h2>
        <p>
          ExtoArts is always looking for talented specialist video editors, thumbnail designers, motion
          graphics artists, and short-form content editors to join the team. We work with editors
          worldwide — location is not a barrier as long as you have reliable internet, a professional
          setup, and the skills to back it up.
        </p>
        <p>
          We hire by niche, not by general ability. A gaming channel editor must have a portfolio of
          actual gaming content. A faceless automation editor must understand AI voiceover integration,
          stock footage pacing, and information-dense editing patterns. A Shorts editor must think
          natively in vertical format and understand what drives completion rates on TikTok and YouTube Shorts.
        </p>
        <p>
          Strong applicants typically have at least one year of professional editing experience, a
          portfolio with 5 or more completed YouTube videos in their specialty niche, proficiency in
          Adobe Premiere Pro or DaVinci Resolve, and availability for at least 10 hours per week.
          Experience with After Effects for motion graphics is a strong plus for long-form video applicants.
        </p>
        <p>
          ExtoArts operates on a client-set budget model. Editors receive 90% of the client's editing
          budget for each project. There are no fixed salaries — your earnings scale directly with your
          output and the quality of work you deliver. Top editors on the platform earn consistently
          across multiple retainer clients and project-by-project engagements.
        </p>
        <p>
          Once accepted, you will be onboarded via Discord and matched with clients whose niche and
          style align with your portfolio. The application process involves a portfolio review, a
          brief technical assessment, and a short introduction call with the team lead.
        </p>
      </div>

      <ApplyClient />
    </>
  )
}
