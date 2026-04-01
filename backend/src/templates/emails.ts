/**
 * emails.ts
 * Email templates for the Signal Theory onboarding sequence.
 *
 * PLACEHOLDER COPY — Jeff will provide final content before launch.
 * Each template receives subscriber data and returns subject + html + text.
 */

export interface SubscriberData {
  email:       string;
  firstName?:  string;
  quizProfile?: string;
  unsubscribeToken: string;
}

export interface EmailTemplate {
  subject:  string;
  htmlBody: string;
  textBody: string;
}

// ─────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────

const BASE_URL = process.env.APP_BASE_URL ?? 'https://signaltheory.app';
const BACKEND_URL = process.env.BACKEND_URL ?? 'https://signal-theory-backend.onrender.com';

function unsubscribeUrl(token: string): string {
  return `${BACKEND_URL}/api/email/unsubscribe/${token}`;
}

function greet(firstName?: string): string {
  return firstName ? `Hi ${firstName}` : 'Hi there';
}

function htmlWrapper(content: string, unsubToken: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: Georgia, serif; background: #f9f6f1; margin: 0; padding: 0; }
    .container { max-width: 580px; margin: 40px auto; background: #ffffff; border-radius: 8px; padding: 40px 48px; }
    p { color: #2c2c2c; font-size: 16px; line-height: 1.7; margin: 0 0 18px; }
    a { color: #8b5e3c; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e8e3db; }
    .footer p { font-size: 12px; color: #999; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    ${content}
    <div class="footer">
      <p>Signal Theory &mdash; <a href="${unsubscribeUrl(unsubToken)}">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`;
}

// ─────────────────────────────────────────────
// Template 1 — Immediate (sent on signup)
// ─────────────────────────────────────────────

export function templateImmediate(sub: SubscriberData): EmailTemplate {
  const name = sub.firstName ?? 'there';
  const profile = sub.quizProfile ? ` — ${sub.quizProfile}` : '';

  const subject = `Your Signal Theory results${profile}`;

  const bodyHtml = `
    <p>Hi ${name},</p>
    <p><strong>[PLACEHOLDER — Jeff to provide copy]</strong></p>
    <p>Thanks for taking the Signal Theory quiz. Here's what your results mean and what to do next.</p>
    <p>Your profile: <strong>${sub.quizProfile ?? 'See your results'}</strong></p>
    <p>More to come soon.</p>
    <p>— Jeff</p>
  `;

  const bodyText = `Hi ${name},

[PLACEHOLDER — Jeff to provide copy]

Thanks for taking the Signal Theory quiz. Here's what your results mean and what to do next.

Your profile: ${sub.quizProfile ?? 'See your results'}

More to come soon.

— Jeff

Unsubscribe: ${unsubscribeUrl(sub.unsubscribeToken)}
`;

  return {
    subject,
    htmlBody: htmlWrapper(bodyHtml, sub.unsubscribeToken),
    textBody: bodyText,
  };
}

// ─────────────────────────────────────────────
// Template 2 — Follow-up at 2 days
// ─────────────────────────────────────────────

export function templateFollowup2d(sub: SubscriberData): EmailTemplate {
  const name = sub.firstName ?? 'there';

  const subject = `The one signal most people miss`;

  const bodyHtml = `
    <p>Hi ${name},</p>
    <p><strong>[PLACEHOLDER — Jeff to provide copy]</strong></p>
    <p>Two days ago you took the quiz. I wanted to follow up with something practical.</p>
    <p>Here's the single most important signal to pay attention to in any dynamic you're navigating...</p>
    <p>[Jeff — add your lesson / insight here]</p>
    <p>— Jeff</p>
  `;

  const bodyText = `Hi ${name},

[PLACEHOLDER — Jeff to provide copy]

Two days ago you took the quiz. I wanted to follow up with something practical.

Here's the single most important signal to pay attention to in any dynamic you're navigating...

[Jeff — add your lesson / insight here]

— Jeff

Unsubscribe: ${unsubscribeUrl(sub.unsubscribeToken)}
`;

  return {
    subject,
    htmlBody: htmlWrapper(bodyHtml, sub.unsubscribeToken),
    textBody: bodyText,
  };
}

// ─────────────────────────────────────────────
// Template 3 — Follow-up at 4 days
// ─────────────────────────────────────────────

export function templateFollowup4d(sub: SubscriberData): EmailTemplate {
  const name = sub.firstName ?? 'there';

  const subject = `What to do when you're getting mixed signals`;

  const bodyHtml = `
    <p>Hi ${name},</p>
    <p><strong>[PLACEHOLDER — Jeff to provide copy]</strong></p>
    <p>This is my last note in this intro sequence. I wanted to leave you with one more thought...</p>
    <p>[Jeff — add your closing lesson / CTA here]</p>
    <p>— Jeff</p>
  `;

  const bodyText = `Hi ${name},

[PLACEHOLDER — Jeff to provide copy]

This is my last note in this intro sequence. I wanted to leave you with one more thought...

[Jeff — add your closing lesson / CTA here]

— Jeff

Unsubscribe: ${unsubscribeUrl(sub.unsubscribeToken)}
`;

  return {
    subject,
    htmlBody: htmlWrapper(bodyHtml, sub.unsubscribeToken),
    textBody: bodyText,
  };
}

// ─────────────────────────────────────────────
// Registry — maps template_name → function
// ─────────────────────────────────────────────

export const TEMPLATES: Record<string, (sub: SubscriberData) => EmailTemplate> = {
  immediate:    templateImmediate,
  followup_2d:  templateFollowup2d,
  followup_4d:  templateFollowup4d,
};

export function getTemplate(name: string, sub: SubscriberData): EmailTemplate | null {
  const fn = TEMPLATES[name];
  return fn ? fn(sub) : null;
}
