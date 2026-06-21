import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'

export const Route = createFileRoute('/')({
  component: EmailCampaign,
})

type Status = 'idle' | 'sending' | 'success' | 'error'
type Tab = 'compose' | 'preview'

// ── Icons ──────────────────────────────────────────────────────────────────

function IconMail({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function IconSend({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4z" />
      <path d="M22 2 11 13" />
    </svg>
  )
}

function IconEye({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function IconEdit({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function IconCheck({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function IconAlert({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function IconUsers({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function IconLink({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

function IconImage({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  )
}

// ── Form Field ─────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{
      display: 'block',
      fontSize: '11.5px',
      fontWeight: 500,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)',
      marginBottom: '7px',
      fontFamily: 'var(--font-display)',
    }}>
      {children}
    </label>
  )
}

// ── Spinner ────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg className="spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" opacity="0.3" />
      <path d="M12 2v4" />
    </svg>
  )
}

// ── Section Card ───────────────────────────────────────────────────────────

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={className} style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      padding: '24px',
    }}>
      {children}
    </div>
  )
}

function SectionLabel({ num, label }: { num: number; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
      <span style={{
        width: '22px', height: '22px',
        borderRadius: '50%',
        background: 'var(--accent-dim)',
        border: '1px solid rgba(217,119,6,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '10.5px', fontWeight: 700, color: 'var(--accent-light)',
        fontFamily: 'var(--font-mono)',
        flexShrink: 0,
      }}>{num}</span>
      <span style={{
        fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)',
        fontFamily: 'var(--font-display)', letterSpacing: '0.01em',
      }}>{label}</span>
    </div>
  )
}

// ── Email Preview ──────────────────────────────────────────────────────────

function EmailPreview({
  companyName, senderName, subject, message, websiteUrl, imageUrl,
}: {
  companyName: string; senderName: string; subject: string;
  message: string; websiteUrl: string; imageUrl: string;
}) {
  const bannerSrc = imageUrl.trim() || '/placeholder.png'
  const displayName = companyName || senderName || 'Your Company'
  const displaySubject = subject || 'Your subject line'

  return (
    <div style={{
      background: '#f5f4f1',
      borderRadius: '12px',
      overflow: 'hidden',
      fontFamily: 'Georgia, serif',
      boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
    }}>
      {/* Email header bar */}
      <div style={{
        background: '#161618',
        padding: '18px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ color: '#f0ede8', fontSize: '13px', fontWeight: 700, fontFamily: 'Syne, sans-serif', letterSpacing: '0.04em' }}>
          {displayName}
        </span>
        <span style={{
          fontSize: '9px', color: 'rgba(240,237,232,0.35)', fontFamily: 'DM Mono, monospace',
          letterSpacing: '0.12em', textTransform: 'uppercase',
        }}>
          EMAIL PREVIEW
        </span>
      </div>

      {/* Meta row */}
      <div style={{
        background: '#ebe9e5', borderBottom: '1px solid #dedad4',
        padding: '10px 24px', fontSize: '11.5px', color: '#6b6560',
        fontFamily: 'DM Sans, sans-serif',
      }}>
        <strong style={{ color: '#2a2825' }}>From:</strong> {displayName}{' '}
        {websiteUrl && <span style={{ color: '#8c7a5c' }}>&lt;no-reply@{websiteUrl.replace(/^https?:\/\//, '').split('/')[0]}&gt;</span>}
        <span style={{ marginLeft: '20px' }}><strong style={{ color: '#2a2825' }}>Subject:</strong> {displaySubject}</span>
      </div>

      {/* Banner */}
      <a href={websiteUrl || '#'} target="_blank" rel="noreferrer" style={{ display: 'block', textDecoration: 'none', position: 'relative' }}>
        <img
          src={bannerSrc}
          alt="Email banner"
          style={{ width: '100%', display: 'block', maxHeight: '200px', objectFit: 'cover' }}
          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png' }}
        />
        {websiteUrl && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0)',
            transition: 'background 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.25)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0)')}
          />
        )}
      </a>

      {/* Body */}
      <div style={{ padding: '28px 24px 20px', background: '#fff' }}>
        <p style={{ margin: '0 0 10px', fontSize: '19px', fontWeight: 700, color: '#1a1816', lineHeight: 1.3 }}>
          {displaySubject}
        </p>
        {message && (
          <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#4a4642', lineHeight: 1.7 }}>
            {message}
          </p>
        )}
        <a
          href={websiteUrl || '#'}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-block', padding: '11px 24px',
            background: '#161618', color: '#f0ede8',
            fontSize: '12.5px', fontWeight: 600, textDecoration: 'none',
            borderRadius: '8px', fontFamily: 'DM Sans, sans-serif',
            letterSpacing: '0.02em',
          }}
        >
          Visit Our Website →
        </a>
      </div>

      {/* Footer */}
      <div style={{
        padding: '14px 24px', background: '#f5f4f1',
        borderTop: '1px solid #dedad4', textAlign: 'center',
        fontSize: '10.5px', color: '#9a938c', fontFamily: 'DM Sans, sans-serif',
      }}>
        {displayName} · {websiteUrl || 'https://yourwebsite.com'} · You're receiving this because you're a client.
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────

function EmailCampaign() {
  const [emails, setEmails] = useState('')
  const [subject, setSubject] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [senderName, setSenderName] = useState('')
  const [replyTo, setReplyTo] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<{ sent: number; failed: number; errors: string[] } | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('compose')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const recipientList = emails
    .split(/[\n,]+/)
    .map((e) => e.trim())
    .filter(Boolean)

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (recipientList.length === 0) return

    setStatus('sending')
    setResult(null)

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails: recipientList, subject, websiteUrl, imageUrl, companyName, senderName, replyTo, message }),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus('error')
        setResult({ sent: 0, failed: recipientList.length, errors: [data.error || 'Failed to send'] })
      } else {
        setStatus(data.failed > 0 ? 'error' : 'success')
        setResult({ sent: data.sent, failed: data.failed, errors: data.errors || [] })
      }
    } catch {
      setStatus('error')
      setResult({ sent: 0, failed: recipientList.length, errors: ['Network error. Please try again.'] })
    }
  }

  // auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [emails])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Ambient glow */}
      <div style={{
        position: 'fixed', top: '-200px', right: '-100px',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(217,119,6,0.06) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ── Header ─────────────────────────────────────────────── */}
      <header style={{
        borderBottom: '1px solid var(--border)',
        background: 'rgba(12,12,14,0.8)',
        backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '9px',
              background: 'linear-gradient(135deg, #b45309, #d97706)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 12px rgba(217,119,6,0.35)',
            }}>
              <IconMail size={15} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
                MailSend
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#22c55e', display: 'inline-block',
              boxShadow: '0 0 6px #22c55e',
            }} className="pulse-dot" />
            ready
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '48px 24px 80px', position: 'relative', zIndex: 1 }}>

        {/* ── Page Heading ──────────────────────────────────────── */}
        <div className="animate-in" style={{ marginBottom: '36px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            background: 'var(--accent-dim)', border: '1px solid rgba(217,119,6,0.2)',
            borderRadius: '20px', padding: '4px 12px 4px 8px',
            marginBottom: '14px',
          }}>
            <IconMail size={12} />
            <span style={{ fontSize: '11px', color: 'var(--accent-light)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>
              CAMPAIGN BUILDER
            </span>
          </div>
          <h1 style={{
            margin: 0, fontSize: 'clamp(28px, 4vw, 40px)',
            fontFamily: 'var(--font-display)', fontWeight: 800,
            color: 'var(--text-primary)', lineHeight: 1.15, letterSpacing: '-0.02em',
          }}>
            Send Branded<br />
            <span style={{ color: 'var(--accent)' }}>Email Campaigns</span>
          </h1>
          <p style={{ margin: '12px 0 0', color: 'var(--text-secondary)', fontSize: '14.5px', maxWidth: '480px', lineHeight: 1.6 }}>
            Compose and deliver branded emails with a clickable banner to all your clients — in one shot.
          </p>
        </div>

        {/* ── Tabs ─────────────────────────────────────────────── */}
        <div className="animate-in animate-in-1" style={{ display: 'flex', gap: '4px', marginBottom: '24px' }}>
          {([['compose', <IconEdit size={13} />, 'Compose'], ['preview', <IconEye size={13} />, 'Preview']] as const).map(([tab, icon, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as Tab)}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '8px 18px', borderRadius: '8px', border: 'none',
                cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                fontFamily: 'var(--font-display)', letterSpacing: '0.01em',
                transition: 'all 0.15s',
                background: activeTab === tab ? 'var(--accent)' : 'var(--bg-raised)',
                color: activeTab === tab ? '#fff' : 'var(--text-secondary)',
                boxShadow: activeTab === tab ? '0 2px 12px rgba(217,119,6,0.3)' : 'none',
              }}
            >
              {icon}{label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSend}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: activeTab === 'preview' ? '1fr' : 'minmax(0,1.05fr) minmax(0,0.95fr)',
            gap: '20px',
            alignItems: 'start',
          }}>

            {/* ── Compose Column ─────────────────────────────────── */}
            {activeTab === 'compose' && (
              <div className="animate-in animate-in-2" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Recipients */}
                <Card>
                  <SectionLabel num={1} label="Recipients" />
                  <Label>Email addresses <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>— one per line or comma-separated</span></Label>
                  <textarea
                    ref={textareaRef}
                    value={emails}
                    onChange={(e) => setEmails(e.target.value)}
                    placeholder={'olivia@estudio.com\nmarco@fieldhomes.co'}
                    rows={4}
                    required
                    className="field-input"
                    style={{ resize: 'none', fontFamily: 'var(--font-mono)', fontSize: '12.5px', lineHeight: 1.7 }}
                  />
                  {recipientList.length > 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                      <IconUsers size={13} />
                      <span style={{ fontSize: '12px', color: 'var(--accent-light)', fontFamily: 'var(--font-mono)' }}>
                        {recipientList.length} recipient{recipientList.length !== 1 ? 's' : ''} detected
                      </span>
                    </div>
                  ) : (
                    <p style={{ margin: '8px 0 0', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      Paste or type client emails above to begin.
                    </p>
                  )}
                </Card>

                {/* Content */}
                <Card>
                  <SectionLabel num={2} label="Email Content" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <Label>Company / Brand</Label>
                      <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Fieldhomes Studio" className="field-input" />
                    </div>
                    <div>
                      <Label>Sender name</Label>
                      <input type="text" value={senderName} onChange={(e) => setSenderName(e.target.value)}
                        placeholder="Marco from Fieldhomes" className="field-input" />
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <Label>
                      Subject line <span style={{ color: 'var(--accent)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>*</span>
                      {subject.length > 0 && (
                        <span style={{ float: 'right', color: subject.length > 60 ? '#f87171' : 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: '11px' }}>
                          {subject.length}/60
                        </span>
                      )}
                    </Label>
                    <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
                      placeholder="A new collection just landed — take a look" required className="field-input" maxLength={78} />
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <Label>Message body <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>— optional</span></Label>
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                      placeholder="We've been working on something new — and we'd love for you to be the first to see it."
                      rows={3} className="field-input" style={{ resize: 'vertical' }} />
                  </div>

                  <div>
                    <Label>Reply-to <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>— optional</span></Label>
                    <input type="email" value={replyTo} onChange={(e) => setReplyTo(e.target.value)}
                      placeholder="marco@fieldhomes.co" className="field-input" />
                  </div>
                </Card>

                {/* Banner */}
                <Card>
                  <SectionLabel num={3} label="Banner & Link" />
                  <p style={{ margin: '0 0 16px', fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    The banner image in the email wraps your website link — clicking it takes clients straight to your site.
                  </p>

                  <div style={{ marginBottom: '12px' }}>
                    <Label><span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><IconLink />Website URL <span style={{ color: 'var(--accent)' }}>*</span></span></Label>
                    <input type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://www.fieldhomes.co" required className="field-input mono" />
                  </div>

                  <div>
                    <Label><span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><IconImage />Banner image URL <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>— optional</span></span></Label>
                    <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://www.fieldhomes.co/banner.jpg" className="field-input mono" />
                    <p style={{ margin: '7px 0 0', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      Leave empty to use the site's default image.
                    </p>
                  </div>
                </Card>
              </div>
            )}

            {/* ── Preview Column (always visible) ──────────────────── */}
            <div
              className={activeTab === 'compose' ? 'animate-in animate-in-3' : 'animate-in animate-in-1'}
              style={{ position: activeTab === 'compose' ? 'sticky' : undefined, top: activeTab === 'compose' ? '80px' : undefined }}
            >
              {activeTab === 'preview' && (
                <div style={{ maxWidth: '620px', margin: '0 auto' }}>
                  <p style={{ margin: '0 0 16px', fontSize: '11.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Live Preview
                  </p>
                </div>
              )}
              <div style={activeTab === 'preview' ? { maxWidth: '620px', margin: '0 auto' } : {}}>
                <div style={{
                  background: 'var(--bg-surface)', border: '1px solid var(--border)',
                  borderRadius: '16px', padding: '4px',
                }}>
                  <div style={{
                    background: 'var(--bg-raised)', borderRadius: '13px',
                    padding: '10px 14px 10px',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: '4px',
                  }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {['#ef4444','#f59e0b','#22c55e'].map((c, i) => (
                        <div key={i} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c, opacity: 0.7 }} />
                      ))}
                    </div>
                    <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      email client preview
                    </span>
                    <div style={{ width: '42px' }} />
                  </div>
                  <div style={{ padding: '0 4px 4px' }}>
                    <EmailPreview
                      companyName={companyName} senderName={senderName}
                      subject={subject} message={message}
                      websiteUrl={websiteUrl} imageUrl={imageUrl}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Result Banner ─────────────────────────────────────── */}
          {result && (
            <div className="animate-in" style={{
              marginTop: '24px', borderRadius: '14px', padding: '18px 20px',
              border: `1px solid ${status === 'success' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
              background: status === 'success' ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)',
              display: 'flex', alignItems: 'flex-start', gap: '12px',
            }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                background: status === 'success' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: status === 'success' ? '#22c55e' : '#ef4444',
                marginTop: '1px',
              }}>
                {status === 'success' ? <IconCheck /> : <IconAlert />}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: status === 'success' ? '#4ade80' : '#f87171', fontFamily: 'var(--font-display)' }}>
                  {status === 'success'
                    ? `Campaign delivered — ${result.sent} email${result.sent !== 1 ? 's' : ''} sent`
                    : `${result.sent} sent, ${result.failed} failed`}
                </p>
                {result.errors.length > 0 && (
                  <ul style={{ margin: '8px 0 0', paddingLeft: '16px', fontSize: '12.5px', color: '#f87171', opacity: 0.8, lineHeight: 1.7 }}>
                    {result.errors.map((err, i) => <li key={i}>{err}</li>)}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* ── Send Button ───────────────────────────────────────── */}
          <div style={{ marginTop: '28px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              type="submit"
              disabled={status === 'sending' || recipientList.length === 0}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '9px',
                padding: '13px 28px', borderRadius: '11px', border: 'none',
                cursor: recipientList.length === 0 || status === 'sending' ? 'not-allowed' : 'pointer',
                background: recipientList.length === 0 || status === 'sending'
                  ? 'var(--bg-raised)'
                  : 'linear-gradient(135deg, #b45309 0%, #d97706 50%, #f59e0b 100%)',
                backgroundSize: '200% 100%',
                color: recipientList.length === 0 || status === 'sending' ? 'var(--text-muted)' : '#fff',
                fontSize: '13.5px', fontWeight: 600,
                fontFamily: 'var(--font-display)', letterSpacing: '0.02em',
                transition: 'all 0.2s',
                boxShadow: recipientList.length > 0 && status !== 'sending' ? '0 4px 20px rgba(217,119,6,0.35)' : 'none',
              }}
              onMouseEnter={e => {
                if (recipientList.length > 0 && status !== 'sending') {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 28px rgba(217,119,6,0.45)'
                }
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLButtonElement).style.transform = ''
                ;(e.currentTarget as HTMLButtonElement).style.boxShadow = recipientList.length > 0 && status !== 'sending' ? '0 4px 20px rgba(217,119,6,0.35)' : 'none'
              }}
            >
              {status === 'sending' ? (
                <><Spinner /> Dispatching…</>
              ) : (
                <><IconSend /> Send to {recipientList.length > 0 ? `${recipientList.length} recipient${recipientList.length !== 1 ? 's' : ''}` : 'Recipients'}</>
              )}
            </button>

            {recipientList.length === 0 && status !== 'sending' && (
              <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Add recipient emails to continue.
              </p>
            )}
          </div>
        </form>

        {/* ── Setup Notice ──────────────────────────────────────── */}
        <div className="animate-in animate-in-4" style={{
          marginTop: '52px',
          borderRadius: '14px', padding: '18px 22px',
          background: 'rgba(180,83,9,0.06)',
          border: '1px solid rgba(180,83,9,0.15)',
          display: 'flex', gap: '14px', alignItems: 'flex-start',
        }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
            background: 'rgba(180,83,9,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#d97706', marginTop: '1px',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
            </svg>
          </div>
          <div>
            <p style={{ margin: '0 0 4px', fontSize: '12.5px', fontWeight: 600, color: '#d97706', fontFamily: 'var(--font-display)' }}>
              Setup Required
            </p>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'rgba(240,237,232,0.45)', lineHeight: 1.65 }}>
              Set the{' '}
              <code style={{ background: 'rgba(0,0,0,0.3)', padding: '1px 6px', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: '#f59e0b' }}>
                RESEND_API_KEY
              </code>{' '}
              environment variable in your Netlify dashboard under <strong style={{ color: 'rgba(240,237,232,0.6)' }}>Site → Environment variables</strong> to enable sending.
              Get a free key at <strong style={{ color: 'rgba(240,237,232,0.6)' }}>resend.com</strong>.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
