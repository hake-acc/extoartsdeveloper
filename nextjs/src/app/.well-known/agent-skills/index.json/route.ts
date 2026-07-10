import { NextResponse } from 'next/server'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { SITE_URL } from '@/lib/constants'

// Agent Skills Discovery index (RFC v0.2.0).
// https://github.com/cloudflare/agent-skills-discovery-rfc
//
// Dynamic (not force-static): the digest is recomputed from the SKILL.md
// file on every request so it can never drift from the served artifact.
export const dynamic = 'force-dynamic'

const SKILLS = [
  {
    name: 'extoarts-estimate',
    type: 'skill-md' as const,
    description: 'Look up YouTube video editing / thumbnail design pricing from ExtoArts and direct a user to the right page to start a project.',
    file: 'extoarts-estimate/SKILL.md',
  },
]

async function digestFor(relativePath: string): Promise<string> {
  const filePath = path.join(process.cwd(), 'public', '.well-known', 'agent-skills', relativePath)
  const contents = await readFile(filePath)
  const hash = createHash('sha256').update(contents).digest('hex')
  return `sha256:${hash}`
}

export async function GET() {
  const skills = await Promise.all(
    SKILLS.map(async (skill) => ({
      name: skill.name,
      type: skill.type,
      description: skill.description,
      url: `${SITE_URL}/.well-known/agent-skills/${skill.file}`,
      digest: await digestFor(skill.file),
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
