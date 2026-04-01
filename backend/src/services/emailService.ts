/**
 * emailService.ts
 * Sends email via Microsoft Graph API using client credentials (daemon flow).
 *
 * Required env vars:
 *   MICROSOFT_TENANT_ID      — Azure AD tenant ID
 *   MICROSOFT_CLIENT_ID      — App registration client ID
 *   MICROSOFT_CLIENT_SECRET  — App registration client secret
 *   EMAIL_FROM               — Sender address (must be a mailbox in the tenant)
 */

const GRAPH_TOKEN_URL = (tenantId: string) =>
  `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

// Use the actual mailbox, not the alias, for the endpoint
const GRAPH_SEND_URL = 'https://graph.microsoft.com/v1.0/users/jeffrey@learnsignaltheory.com/sendMail';

interface TokenResponse {
  access_token: string;
  expires_in: number;
}

// Simple in-process token cache
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt - 30_000) {
    return cachedToken;
  }

  const tenantId     = process.env.MICROSOFT_TENANT_ID;
  const clientId     = process.env.MICROSOFT_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error('[emailService] Missing Microsoft Graph credentials (TENANT_ID / CLIENT_ID / CLIENT_SECRET)');
  }

  const body = new URLSearchParams({
    grant_type:    'client_credentials',
    client_id:     clientId,
    client_secret: clientSecret,
    scope:         'https://graph.microsoft.com/.default',
  });

  const res = await fetch(GRAPH_TOKEN_URL(tenantId), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[emailService] Token request failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as TokenResponse;
  cachedToken    = data.access_token;
  tokenExpiresAt = now + data.expires_in * 1000;
  return cachedToken;
}

export interface EmailPayload {
  toEmail:   string;
  toName?:   string;
  subject:   string;
  htmlBody:  string;
  textBody:  string;
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  const fromAddress = process.env.EMAIL_FROM;
  if (!fromAddress) {
    throw new Error('[emailService] EMAIL_FROM env var is not set');
  }

  const token = await getAccessToken();

  const message = {
    from: {
      emailAddress: {
        address: fromAddress,
        name: 'Signal Theory',
      },
    },
    subject: payload.subject,
    body: {
      contentType: 'HTML',
      content:     payload.htmlBody,
    },
    toRecipients: [
      {
        emailAddress: {
          address: payload.toEmail,
          name:    payload.toName ?? payload.toEmail,
        },
      },
    ],
  };

  const res = await fetch(GRAPH_SEND_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, saveToSentItems: false }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[emailService] Send failed (${res.status}): ${text}`);
  }
  // 202 Accepted — no body
}

/** Returns true if all three Graph API env vars are present. */
export function isEmailConfigured(): boolean {
  return Boolean(
    process.env.MICROSOFT_TENANT_ID &&
    process.env.MICROSOFT_CLIENT_ID &&
    process.env.MICROSOFT_CLIENT_SECRET &&
    process.env.EMAIL_FROM
  );
}
