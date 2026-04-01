# ConvertKit Email Sequence Setup - Signal Theory

**Purpose:** Configure profile-specific action plan emails that send automatically based on quiz results.

**Last updated:** 2026-03-30

---

## Overview

When someone completes the Signal Theory quiz:
1. Backend tags them with their profile type (e.g., `ready-navigator`)
2. ConvertKit receives the email + tag via API
3. Automation triggers and sends the matching action plan email
4. Follow-up sequence (Email 2, 3, 4) runs on schedule

---

## Step 1: Create 8 Tags in ConvertKit

**URL:** https://app.kit.com/subscribers (Tags section)

**Tag names (must match backend exactly):**
1. `ready-navigator`
2. `rusty-romantic`
3. `eager-rebuilder`
4. `cautious-observer`
5. `wounded-analyst`
6. `pattern-repeater`
7. `inconsistent-dater`
8. `self-aware-learner`

**How to create:**
- Click "Tags" in left sidebar
- "Create new tag" button
- Enter tag name (lowercase, hyphenated)
- Save
- Repeat for all 8

---

## Step 2: Upload Email Content to ConvertKit

**For each of the 8 profiles:**

1. Go to https://app.kit.com/broadcasts/new
2. Click "Email" (not Broadcast)
3. Enter subject line from the email file
4. Paste body content (everything after the subject line)
5. **Important:** Format as plain text or minimal HTML
6. Preview to verify formatting
7. Save as Draft
8. Note the email ID (visible in URL)

**Email files location:**
`signal-theory/email-sequences/action-plan-[01-08]-[profile-name].md`

---

## Step 3: Create Automation for Each Profile

**URL:** https://app.kit.com/automations/new

**For EACH profile, create one automation:**

### Automation Settings:

**Name:** `Action Plan - [Profile Name]`

**Trigger:** Tag added → Select the profile tag (e.g., `ready-navigator`)

**Actions:**
1. **Wait:** 1 minute (ensures form confirmation processed)
2. **Send Email:** Select the saved email draft for this profile
3. **Wait:** 2 days
4. **Send Email:** Email 2 (future - when ready)
5. **Wait:** 2 days
6. **Send Email:** Email 3 (future - when ready)

**Status:** Publish (activate)

### Example for Ready Navigator:

```
Automation Name: Action Plan - Ready Navigator
Trigger: Tag "ready-navigator" added
Actions:
  1. Wait 1 minute
  2. Send "Your Signal Theory results are in — and you're in the top 10%"
  3. (future) Wait 2 days → Send Email 2
  4. (future) Wait 2 days → Send Email 3
```

---

## Step 4: Test the Flow

**Create test subscriber:**
1. Use quiz at learnsignaltheory.com/quiz
2. Complete with test email: `test-[profile]@example.com`
3. Verify in ConvertKit:
   - Subscriber created
   - Tag applied
   - Automation triggered
   - Email sent within 2-3 minutes

**Verify automation logs:**
- Go to Automation → View logs
- Check for successful triggers
- Confirm emails were sent

---

## Step 5: Backend Integration (Already Complete)

**Backend code:** `signal-theory/backend/src/routes/convertkit.ts`

**How it works:**
```javascript
// When quiz completes, backend calls:
POST /api/convertkit/subscribe
{
  "email": "user@example.com",
  "tags": ["ready-navigator"]  // Profile-specific tag
}
```

**ConvertKit receives:**
- Email address
- Tag(s)
- Triggers automation automatically

---

## Automation Architecture

```
Quiz Completion
    ↓
Backend receives results
    ↓
Calls ConvertKit API with email + profile tag
    ↓
ConvertKit adds subscriber + applies tag
    ↓
Tag triggers automation
    ↓
Automation sends profile-specific Email 1
    ↓
Wait 2 days → Email 2
    ↓
Wait 2 days → Email 3
```

---

## Email Sequence Timeline

**Day 0:** Action plan email (immediate, triggered by tag)
**Day 2:** Email 2 - "Why This Is So Hard Alone" (not yet written)
**Day 4:** Email 3 - "How Signal Theory Works" (the pitch)
**Day 7:** Email 4 (optional) - Objection handler for non-converters

---

## Tag Management Best Practices

**Single tag per subscriber:**
- Each quiz completion = 1 profile = 1 tag
- If someone retakes quiz, remove old tag first (backend can handle this)

**Tag naming convention:**
- Lowercase
- Hyphenated (not underscores)
- Match backend exactly (case-sensitive in API)

**Monitoring:**
- Check automation logs daily for first week
- Watch for failed sends
- Monitor unsubscribe rate per profile

---

## Troubleshooting

### Subscriber not receiving email

**Check:**
1. Subscriber exists in ConvertKit? (Search by email)
2. Tag applied? (View subscriber → Tags section)
3. Automation triggered? (Automation → Logs)
4. Email marked as spam? (Ask subscriber to check)

### Automation not triggering

**Check:**
1. Automation is "Published" (not Draft)
2. Tag name matches exactly (case-sensitive)
3. Email draft is saved and published
4. Wait time set correctly (1 minute minimum)

### Wrong email sent

**Check:**
1. Tag name matches profile (backend sends correct tag?)
2. Automation linked to correct email
3. Multiple automations not conflicting

---

## Future Enhancements

**When Email 2 & 3 are ready:**
1. Create email drafts in ConvertKit
2. Edit each automation
3. Add Wait + Send Email actions
4. Test with fresh subscriber

**When app launches:**
1. Add CTA links to action plan emails
2. Update Email 3 with pricing/trial details
3. Create conversion tracking in automations

---

## Reference

**ConvertKit API Docs:** https://developers.kit.com/
**Form ID:** 9264094 (Signal Theory Quiz)
**API Key:** Stored in Render environment variable
**Backend endpoint:** `POST /api/convertkit/subscribe`

---

## Files

**Email content:** `signal-theory/email-sequences/action-plan-[01-08]-*.md`
**Backend code:** `signal-theory/backend/src/routes/convertkit.ts`
**Integration procedure:** `CONVERTKIT-INTEGRATION-PROCEDURE.md`
