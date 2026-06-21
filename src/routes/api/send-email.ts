import { createFileRoute } from '@tanstack/react-router'
import { Resend } from 'resend'

export const Route = createFileRoute('/api/send-email')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json()
        const { emails, subject, websiteUrl, imageUrl, companyName, message, senderName, replyTo } = body

        const apiKey = Netlify.env.get('RESEND_API_KEY')
        if (!apiKey) {
          return Response.json({ error: 'Email service not configured. Please set RESEND_API_KEY.' }, { status: 500 })
        }

        if (!emails || !Array.isArray(emails) || emails.length === 0) {
          return Response.json({ error: 'No recipient emails provided.' }, { status: 400 })
        }

        if (!websiteUrl || !subject) {
          return Response.json({ error: 'Website URL and subject are required.' }, { status: 400 })
        }

        const resend = new Resend(apiKey)

        const validatedImageUrl = imageUrl?.trim() || `${websiteUrl.replace(/\/$/, '')}/placeholder.png`

        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background-color:#1a1a2e;padding:28px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">${companyName || senderName || 'Your Company'}</h1>
            </td>
          </tr>

          <!-- Banner Image wrapped in website link -->
          <tr>
            <td style="padding:0;">
              <a href="${websiteUrl}" target="_blank" style="display:block;text-decoration:none;" title="Visit our website">
                <img
                  src="${validatedImageUrl}"
                  alt="${companyName || 'Visit our website'}"
                  width="600"
                  style="display:block;width:100%;max-width:600px;height:auto;border:none;outline:none;"
                />
              </a>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h2 style="margin:0 0 16px;color:#1a1a2e;font-size:24px;font-weight:700;line-height:1.3;">${subject}</h2>
              ${message ? `<p style="margin:0 0 24px;color:#4b5563;font-size:16px;line-height:1.7;">${message.replace(/\n/g, '<br>')}</p>` : ''}
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="border-radius:8px;background-color:#1a1a2e;">
                    <a href="${websiteUrl}" target="_blank" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;">
                      Visit Our Website →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:0;">
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 32px;text-align:center;">
              <p style="margin:0 0 8px;color:#9ca3af;font-size:13px;">
                You are receiving this email from <strong>${companyName || senderName || 'Us'}</strong>.
              </p>
              <p style="margin:0;color:#9ca3af;font-size:13px;">
                <a href="${websiteUrl}" target="_blank" style="color:#6366f1;text-decoration:underline;">${websiteUrl}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

        const results = { sent: 0, failed: 0, errors: [] as string[] }

        for (const email of emails) {
          const trimmed = email.trim()
          if (!trimmed) continue
          try {
            await resend.emails.send({
              from: `${senderName || companyName || 'Notifications'} <onboarding@resend.dev>`,
              to: trimmed,
              subject,
              html: htmlContent,
              reply_to: replyTo || undefined,
            })
            results.sent++
          } catch (err: unknown) {
            results.failed++
            results.errors.push(`${trimmed}: ${err instanceof Error ? err.message : 'Unknown error'}`)
          }
        }

        return Response.json({ success: true, ...results })
      },
    },
  },
})
