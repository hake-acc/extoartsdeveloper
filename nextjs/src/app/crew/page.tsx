import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import { JsonLd } from '@/components/JsonLd'
import { SITE_URL } from '@/lib/constants'
import { CrewClient } from './CrewClient'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: 'Meet the Crew — ExtoArts Video Editing Team',
  description: 'Get to know the founders and creative team behind ExtoArts. We are a YouTube-focused video editing agency combining cutting-edge tech, marketing strategy, and premium storytelling.',
  path: '/crew',
})

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Crew', item: `${SITE_URL}/crew` },
  ],
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'ExtoArts',
  url: SITE_URL,
  logo: `${SITE_URL}/images/og-default.jpg`,
  sameAs: [
    'https://x.com/extoarts',
    'https://www.instagram.com/extoarts',
    'https://youtube.com/@extoarts',
  ],
  founder: [
    {
      '@type': 'Person',
      name: 'Rehan Khan',
      jobTitle: 'Founder & Creative Director',
    },
    {
      '@type': 'Person',
      name: 'Kunjal Joshi',
      jobTitle: 'Founder, CEO & CTO',
    },
    {
      '@type': 'Person',
      name: 'Hake Acc',
      jobTitle: 'Founder, CMO & Outsourcing Manager',
    },
  ],
}

export default function CrewPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={organizationSchema} />

      {/* SEO Context for Web Crawlers */}
      <div className="sr-only">
        <h1>Meet the ExtoArts Crew</h1>
        <p>
          ExtoArts is a premium YouTube video editing and channel optimization agency founded in 2024.
          Our leadership team combines deep technical skills, marketing experience, and creative storytelling
          to help video creators build sustainable businesses.
        </p>
        <h2>Our Founders and Team Members</h2>
        <ul>
          <li>
            <strong>Rehan Khan</strong> — Founder & Creative Director. Rehan drives the creative direction
            and edit standards at ExtoArts. He believes the best editors deserve the most compensation, which
            is why ExtoArts operates on a client-set budget model where 90% goes directly to the editor.
          </li>
          <li>
            <strong>Kunjal Joshi</strong> — Founder, CEO & CTO. Kunjal Joshi manages the technological vision,
            building scalable web tools, automation systems, and backend infrastructures to empower the agency&apos;s operations.
          </li>
          <li>
            <strong>Hake Acc</strong> — Founder, CMO & Outsourcing Manager. Hake Acc oversees client partnerships, marketing
            campaigns, and resource coordination to match editors with the right creators.
          </li>
          <li>
            <strong>Septileye</strong> — Co-Founder & Creative Manager. Septileye supervises quality control, project visual assets,
            and brand consistency.
          </li>
        </ul>
      </div>

      <CrewClient />
    </>
  )
}
