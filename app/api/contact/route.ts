import { NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/mail'

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Tous les champs sont requis.' }, { status: 400 })
    }

    const result = await sendContactEmail({ name, email, subject, message })

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Message envoyé avec succès.' })
    } else {
      return NextResponse.json({ error: 'Échec de l\'envoi de l\'email.' }, { status: 500 })
    }
  } catch (error) {
    console.error('Contact API Error:', error)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
