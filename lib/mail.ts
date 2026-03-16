import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  paid: 'Payé / En préparation',
  shipped: 'Expédié',
  delivered: 'Livré',
  cancelled: 'Annulé'
}

export async function sendOrderEmail({
  orderId,
  customerEmail,
  status,
  customerName,
  totalAmount,
  items = []
}: {
  orderId: string
  customerEmail: string
  status: string
  customerName: string
  totalAmount: number
  items?: {
    name: string
    quantity: number
    price: number
    variantInfo?: string
  }[]
}) {
  try {
    const statusLabel = STATUS_LABELS[status] || status
    const isNewOrder = status === 'paid' || status === 'pending'

    const subject = isNewOrder 
      ? `Confirmation de votre commande #${orderId.slice(0, 8)} - Gig Store`
      : `Mise à jour de votre commande #${orderId.slice(0, 8)} : ${statusLabel}`

    const itemsHtml = items.map(item => `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f0f0f0; padding: 10px 0;">
        <div style="flex: 1;">
          <p style="margin: 0; font-weight: bold; color: #000;">${item.name}</p>
          ${item.variantInfo ? `<p style="margin: 2px 0 0 0; font-size: 12px; color: #666;">${item.variantInfo}</p>` : ''}
          <p style="margin: 2px 0 0 0; font-size: 13px; color: #999;">Qté : ${item.quantity}</p>
        </div>
        <div style="text-align: right; min-width: 100px;">
          <p style="margin: 0; font-weight: bold; color: #000;">${(item.price * item.quantity).toLocaleString()} CFA</p>
        </div>
      </div>
    `).join('')

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #000; text-transform: uppercase; letter-spacing: 5px; font-size: 28px; margin: 0;">GIG STORE</h1>
          <div style="height: 2px; width: 50px; background: #000; margin: 10px auto;"></div>
        </div>
        
        <p style="font-size: 16px; color: #333;">Bonjour <strong>${customerName}</strong>,</p>
        
        <p style="font-size: 15px; color: #555; line-height: 1.5;">${isNewOrder 
          ? "Merci pour votre achat ! Nous avons bien reçu votre commande et nous la préparons avec soin." 
          : `Le statut de votre commande <strong>#${orderId.slice(0, 8)}</strong> a été mis à jour.`
        }</p>
        
        <div style="background: #000; padding: 20px; border-radius: 8px; margin: 25px 0; color: #fff; text-align: center;">
          <p style="margin: 0; font-size: 12px; text-transform: uppercase; color: #999; letter-spacing: 2px;">Statut de la commande</p>
          <p style="margin: 10px 0 0 0; font-weight: bold; font-size: 22px; color: #fff;">${statusLabel}</p>
        </div>

        ${items.length > 0 ? `
          <div style="margin: 30px 0;">
            <p style="font-size: 14px; text-transform: uppercase; color: #000; font-weight: bold; letter-spacing: 1px; margin-bottom: 15px;">Détails de la commande</p>
            ${itemsHtml}
          </div>
        ` : ''}

        <div style="display: flex; justify-content: space-between; align-items: center; background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="margin: 0; font-size: 16px; font-weight: bold; color: #000;">TOTAL</p>
          <p style="margin: 0; font-weight: bold; font-size: 20px; color: #000;">${totalAmount.toLocaleString()} CFA</p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />
        
        <div style="text-align: center;">
          <p style="font-size: 12px; color: #999; margin-bottom: 5px;">
            Vous recevrez un autre email dès que votre colis sera expédié.
          </p>
          <p style="font-size: 12px; color: #bbb; text-align: center;">
            Ceci est un message automatique, merci de ne pas y répondre directement.<br />
            © ${new Date().getFullYear()} Gig Store. Tous droits réservés.
          </p>
        </div>
      </div>
    `

    const info = await transporter.sendMail({
      from: `"Gig Store" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: subject,
      html: htmlContent,
    })

    console.log('Message sent: %s', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Nodemailer error:', error)
    return { success: false, error }
  }
}

export async function sendContactEmail({
  name,
  email,
  subject,
  message
}: {
  name: string
  email: string
  subject: string
  message: string
}) {
  try {
    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #ffffff;">
        <h2 style="color: #000; text-align: center;">Message client</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Sujet :</strong> ${subject}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="white-space: pre-wrap; color: #333;">${message}</p>
      </div>
    `

    const info = await transporter.sendMail({
      from: `"Gig Store Contact" <${process.env.SMTP_USER}>`,
      to: 'gigstore.shop@gmail.com',
      replyTo: email,
      subject: `[Formulaire Contact] ${subject}`,
      html: htmlContent,
    })

    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Nodemailer Contact Error:', error)
    return { success: false, error }
  }
}
