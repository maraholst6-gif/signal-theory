# Azure App Registration — Setup Guide

This is the one manual step to complete before the email system goes live. It takes about 10 minutes.

---

## What you're doing

Creating an Azure "app registration" that lets the Signal Theory backend send email through your Microsoft account using the Graph API — without storing your password anywhere.

---

## Prerequisites

- A Microsoft 365 account (or Outlook.com with Exchange Online)
- Access to the Azure Portal: https://portal.azure.com
- The email address you want to send FROM (e.g. jeff@signaltheory.com)

---

## Step 1 — Sign in to Azure Portal

1. Go to https://portal.azure.com
2. Sign in with your Microsoft account

---

## Step 2 — Create App Registration

1. Search for **"App registrations"** in the top search bar
2. Click **"New registration"**
3. Fill in:
   - **Name:** `Signal Theory Email` (or anything descriptive)
   - **Supported account types:** select **"Accounts in this organizational directory only"**
   - **Redirect URI:** leave blank
4. Click **Register**

After registering, you'll land on the app's overview page.

---

## Step 3 — Copy the IDs you'll need

From the overview page, copy these values — you'll need them later:

| Value | Where to find it | Env var name |
|-------|-----------------|--------------|
| Application (client) ID | Overview page | `MICROSOFT_CLIENT_ID` |
| Directory (tenant) ID   | Overview page | `MICROSOFT_TENANT_ID` |

---

## Step 4 — Create a Client Secret

1. In the left sidebar, click **"Certificates & secrets"**
2. Click **"New client secret"**
3. Add a description (e.g. "Signal Theory Backend")
4. Set expiration — **24 months** is fine to start
5. Click **Add**
6. **Copy the secret value immediately** — it's only shown once

This value is your `MICROSOFT_CLIENT_SECRET`.

---

## Step 5 — Add Mail.Send API Permission

1. In the left sidebar, click **"API permissions"**
2. Click **"Add a permission"**
3. Click **"Microsoft Graph"**
4. Click **"Application permissions"** (NOT Delegated)
5. Search for **"Mail.Send"**
6. Check the box next to **Mail.Send**
7. Click **"Add permissions"**

Then:

8. Click **"Grant admin consent for [your org]"** (the blue button)
9. Click **Yes** to confirm

The permission status should now show a green checkmark: **"Granted for [your org]"**

> **Why Application permissions?** The backend runs as a daemon (no user logged in), so it needs app-level access rather than delegated user access.

---

## Step 6 — Add the credentials to Render

In your Render dashboard, go to your `signal-theory-backend` service → **Environment** and add:

```
MICROSOFT_TENANT_ID      = (Directory/tenant ID from Step 3)
MICROSOFT_CLIENT_ID      = (Application/client ID from Step 3)
MICROSOFT_CLIENT_SECRET  = (Secret value from Step 4)
EMAIL_FROM               = jeff@signaltheory.com  (or whatever address you want to send from)
APP_BASE_URL             = https://signaltheory.app  (your production URL)
```

---

## Step 7 — Verify it works

After deploying, run the test script against production:

```bash
# From your local machine (with .env pointing at prod, or set vars directly):
TEST_SEND_TO=jeff@signaltheory.com npx ts-node src/test-email-system.ts
```

You should receive a test email. If not, check the output for which step failed.

---

## Troubleshooting

**"Insufficient privileges"** — The Mail.Send permission wasn't admin-consented. Redo Step 5.

**"Invalid client secret"** — The secret was copied incorrectly or expired. Rotate it in Step 4.

**"mailbox not found"** — The `EMAIL_FROM` address doesn't have a mailbox in this tenant. It must be a real Exchange Online mailbox assigned to the tenant where the app is registered.

**"AADSTS700016"** — Wrong tenant ID. Double-check the Directory ID in Step 3.

---

## Notes

- Client secrets expire. Set a calendar reminder to rotate before the expiration date.
- The app only has `Mail.Send` permission — it cannot read email or access any other data.
- If you rotate the secret, update `MICROSOFT_CLIENT_SECRET` in Render and redeploy.
