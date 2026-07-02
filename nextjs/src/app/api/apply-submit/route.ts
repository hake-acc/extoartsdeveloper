import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  display_name: z.string().min(2).max(100),
  bio: z.string().min(50),
  experience_years: z.enum(['0', '1', '2', '3', '5', '8', '10+']),
  timezone: z.string().min(2),
  availability: z.string().min(2),
  specialties: z.array(z.string()).min(1),
  tools: z.string().min(2),
  drive_links: z.string().min(10),
  portfolio_url: z.string().optional(),
  agreed_tos: z.literal(true),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = schema.parse(body)

    // Send Discord notification if webhook is configured
    const webhookUrl = process.env.DISCORD_WEBHOOK_APPLICATIONS
    if (webhookUrl) {
      const specialtiesList = data.specialties.join(', ')
      const driveLinks = data.drive_links
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => `• ${l}`)
        .join('\n')

      const payload = {
        embeds: [
          {
            title: '🎨 New Editor Application',
            color: 0x22d3ee,
            fields: [
              { name: 'Name / Handle', value: data.display_name, inline: true },
              { name: 'Experience', value: `${data.experience_years} yr(s)`, inline: true },
              { name: 'Timezone', value: data.timezone, inline: true },
              { name: 'Availability', value: data.availability, inline: true },
              { name: 'Specialties', value: specialtiesList },
              { name: 'Tools', value: data.tools },
              { name: 'Bio', value: data.bio.slice(0, 1000) },
              { name: 'Portfolio Links', value: driveLinks.slice(0, 1000) },
              ...(data.portfolio_url ? [{ name: 'Portfolio Website', value: data.portfolio_url }] : []),
            ],
            timestamp: new Date().toISOString(),
            footer: { text: 'ExtoArts Editor Applications' },
          },
        ],
      }

      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    }

    // Optionally insert into Supabase editor_applications table
    const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseKey) {
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const client = createClient(supabaseUrl, supabaseKey)
        await client.from('editor_applications').insert({
          display_name: data.display_name,
          bio: data.bio,
          experience_years: parseInt(data.experience_years) || 0,
          timezone: data.timezone,
          availability: data.availability,
          specialties: data.specialties,
          tools: data.tools,
          drive_links: data.drive_links,
          portfolio_url: data.portfolio_url ?? null,
          agreed_tos: true,
          status: 'pending',
          submitted_at: new Date().toISOString(),
        })
      } catch {
        // Non-fatal — Discord notification already sent
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ ok: false, message: 'Invalid form data. Please check all fields.' }, { status: 400 })
    }
    console.error('Apply submit error:', error)
    return NextResponse.json({ ok: false, message: 'Submission failed. Please try again.' }, { status: 500 })
  }
}
