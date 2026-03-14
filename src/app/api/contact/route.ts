import { NextResponse } from 'next/server'
import { contactSchema } from '@/lib/schemas'

const WEB3FORMS_KEY = process.env.WEB3FORMS_ACCESS_KEY

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = contactSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid form data' },
        { status: 400 }
      )
    }

    if (!WEB3FORMS_KEY) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    const { name, email, phone, projectType, description } = result.data

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `New Quote Request: ${projectType} — ${name}`,
        from_name: 'Satin Fabrication Website',
        name,
        email,
        phone,
        project_type: projectType,
        message: description,
      }),
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
