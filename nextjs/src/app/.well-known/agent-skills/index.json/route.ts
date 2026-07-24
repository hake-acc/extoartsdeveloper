import { NextResponse } from 'next/server'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { unstable_cache } from 'next/cache'
import { SITE_URL } from '@/lib/constants'

// Agent Skills Discovery index (RFC v0.2.0).
// https://github.com/cloudflare/agent-skills-discovery-rfc
//
// ISR: the skills list and their SKILL.md files are static — they don't
// change at runtime. The SHA-256 digest is cached via unstable_cache so the
// FS read + crypto are not repeated on every GET. Revalidate hourly to pick
// up any redeployment that updates the SKILL.md artifact.
export const revalidate = 3600

const SKILLS = [
  {
    name: 'extoarts-estimate',
    type: 'skill-md' as const,
    description: 'Look up YouTube video editing / thumbnail design pricing from ExtoArts and direct a user to the right page to start a project.',
    file: 'extoarts-estimate/SKILL.md',
  },
]

// Cache the FS read + SHA-256 hash per file path for the ISR window.
// The SKILL.md artifact only changes on redeploy, so recomputing the digest
// on every GET is unnecessary work. unstable_cache writes to the Next.js data
// cache (same layer as fetch() with next: { revalidate }), so it's collocated
// with the page revalidate window and survives serverless cold starts.
const cachedDigestFor = unstable_cache(
  async (relativePath: string): Promise<string> => {
    const filePath = path.join(process.cwd(), 'public', '.well-known', 'agent-skills', relativePath)
    const contents = await readFile(filePath)
    const hash = createHash('sha256').update(contents).digest('hex')
    return `sha256:${hash}`
  },
  ['agent-skill-digest'],
  { revalidate: 3600, tags: ['agent-skills'] },
)

export async function GET() {
  const skills = await Promise.all(
    SKILLS.map(async (skill) => ({
      name: skill.name,
      type: skill.type,
      description: skill.description,
      url: `${SITE_URL}/.well-known/agent-skills/${skill.file}`,
      digest: await cachedDigestFor(skill.file),
    })),
  )

  return NextResponse.json(
    {
      $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
      skills,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    },
  )
}
