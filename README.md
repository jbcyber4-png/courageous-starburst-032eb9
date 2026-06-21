# MailSend — Client Email Campaigns

A web application for sending branded emails to clients. Each email includes a banner image wrapped in a clickable link that takes recipients directly to your main website.

## Features  

- Compose emails with a subject, message body, sender info, and banner image
- Paste multiple recipient emails (comma-separated or line-by-line)
- Live email preview before sending
- Banner image is hyperlinked to your website URL
- "Visit Our Website" call-to-action button in every email
- Powered by [Resend](https://resend.com) for reliable delivery

## Tech Stack

- **Framework:** TanStack Start (React + Vite)
- **Styling:** Tailwind CSS v4
- **Email delivery:** Resend SDK
- **Hosting:** Netlify (serverless API route handles email sending)

## Running Locally

```bash
npm install
```

Set up your environment variable:
```bash
# Create a .env file
RESEND_API_KEY=re_your_key_here
```

Start the dev server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `RESEND_API_KEY` | Yes | API key from [resend.com](https://resend.com) |

Set this in the Netlify dashboard under **Site → Environment variables** before deploying.
