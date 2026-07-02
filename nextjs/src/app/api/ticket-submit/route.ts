import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5),
  order_id: z.string().optional(),
  message: z.string().min(20),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = schema.parse(body)

    const webhookUrl = process.env.DISCORD_WEBHOOK_TICKET
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: `Support Ticket: ${data.subject}`,
            color: 0x22d3ee,
            fields: [
              { name: 'Name', value: data.name, inline: true },
              { name: 'Email', value: data.email, inline: true },
              { name: 'Order ID', value: data.order_id || 'N/A', inline: true },
              { name: 'Message', value: data.message.slice(0, 1000) },
            ],
            timestamp: new Date().toISOString(),
          }],
        }),
      })
    }

    return NextResponse.json({ ok: true, message: 'Ticket submitted successfully.' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ ok: false, message: 'Invalid form data.' }, { status: 400 })
    }
    console.error('Ticket submission error:', error)
    return NextResponse.json({ ok: false, message: 'Internal server error.' }, { status: 500 })
  }
}
