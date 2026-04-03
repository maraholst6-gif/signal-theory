/**
 * emails.ts
 * Email templates for the Signal Theory onboarding sequence.
 */

import { getActionPlan } from './actionPlans';

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

export async function templateImmediate(sub: SubscriberData): Promise<EmailTemplate> {
  const name = sub.firstName?.trim() || 'there';
  
  // Try to load profile-specific action plan
  if (sub.quizProfile) {
    const actionPlan = await getActionPlan(sub.quizProfile);
    if (actionPlan) {
      // Replace {firstName} placeholder in the loaded content
      const resultsUrl = `https://learnsignaltheory.com/quiz/results?profile=${sub.quizProfile}`;
      const personalizedHtml = actionPlan.htmlBody.replace(/\{firstName\}/g, name)
        + `<hr><p style="text-align:center;margin-top:32px"><a href="${resultsUrl}" style="color:#8b5e3c;font-weight:600">View your full results anytime →</a></p>`;
      const personalizedText = actionPlan.textBody.replace(/\{firstName\}/g, name)
        + `\n\n---\nView your full results anytime: ${resultsUrl}`;
      
      return {
        subject: actionPlan.subject,
        htmlBody: htmlWrapper(personalizedHtml, sub.unsubscribeToken),
        textBody: personalizedText + `\n\nUnsubscribe: ${unsubscribeUrl(sub.unsubscribeToken)}`,
      };
    }
  }
  
  // Fallback if no profile or action plan not found
  const subject = `Your Signal Theory results`;

  const bodyHtml = `
    <p>Hi ${name},</p>
    <p>Thanks for taking the Signal Theory quiz. Your personalized action plan is being prepared.</p>
    <p>Check back soon for your custom recommendations.</p>
    <p>— The Signal Theory Team</p>
  `;

  const bodyText = `Hi ${name},

Thanks for taking the Signal Theory quiz. Your personalized action plan is being prepared.

Check back soon for your custom recommendations.

— The Signal Theory Team

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
  const name = sub.firstName?.trim() || 'there';

  const subject = `The one signal most people miss`;

  const bodyHtml = `
    <p>Hi ${name},</p>
    <p>Two days ago you took the quiz. I wanted to follow up with something you can use immediately.</p>
    <p>Here's the single most common misread I see: <strong>confusing responsiveness with interest.</strong></p>
    <p>She replies to every text. She's friendly. She laughs at your jokes. So she's interested, right?</p>
    <p>Not necessarily.</p>
    <p>There's a difference between someone who responds when you reach out and someone who reaches out on their own. The first is politeness. The second is investment.</p>
    <p>Here's the test: look at your last 10 conversations. Who started them? If it's you every time, you're not in a conversation — you're in an interview.</p>
    <p><strong>Interested people initiate.</strong> They don't just answer — they reach out because they're thinking about you when you're not there.</p>
    <p>This one distinction — responsive vs. invested — will save you more time than anything else I can teach you.</p>
    <p>Try it this week. Look at who's initiating. The answer might surprise you.</p>
    <p>If you haven't tried the app yet, the training scenarios walk you through exactly this:</p>
    <p><strong><a href="https://learnsignaltheory.com/app">Start Training Free →</a></strong></p>
    <p>Talk soon,<br>— Signal Theory</p>
  `;

  const bodyText = `Hi ${name},

Two days ago you took the quiz. I wanted to follow up with something you can use immediately.

Here's the single most common misread I see: confusing responsiveness with interest.

She replies to every text. She's friendly. She laughs at your jokes. So she's interested, right?

Not necessarily.

There's a difference between someone who responds when you reach out and someone who reaches out on their own. The first is politeness. The second is investment.

Here's the test: look at your last 10 conversations. Who started them? If it's you every time, you're not in a conversation — you're in an interview.

Interested people initiate. They don't just answer — they reach out because they're thinking about you when you're not there.

This one distinction — responsive vs. invested — will save you more time than anything else I can teach you.

Try it this week. Look at who's initiating. The answer might surprise you.

If you haven't tried the app yet, the training scenarios walk you through exactly this:

Start Training Free → https://learnsignaltheory.com/app

Talk soon,
— Signal Theory

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
  const name = sub.firstName?.trim() || 'there';

  const subject = `The stories you tell yourself (and why they're wrong)`;

  const bodyHtml = `
    <p>Hi ${name},</p>
    <p>Let me ask you something honest.</p>
    <p>Think about the last person you were interested in who didn't work out. How long did you hold onto it after the signals were already clear?</p>
    <p>If you're like most men I've talked to, the answer is: way too long.</p>
    <p>Not because you're desperate. Not because you're dumb. But because your brain is really, really good at filling silence with hopeful stories.</p>
    <p>"She's probably just busy."<br>"Maybe she doesn't want to seem too eager."<br>"She said she had a great time — she's definitely interested."</p>
    <p>None of those are based on anything she actually did. They're based on what you hope is true.</p>
    <p><strong>Signal Theory exists because of this one problem:</strong> the gap between what's happening and what we tell ourselves is happening.</p>
    <p>The framework teaches you to close that gap. To see behavior instead of inventing narratives. To read the signal, not the story.</p>
    <p>It's not complicated. But it does require practice. And that's what the app is for.</p>
    <p><strong>The training scenarios give you a safe place to practice reading signals before it matters:</strong></p>
    <p><strong><a href="https://learnsignaltheory.com/app">Try a Training Scenario →</a></strong></p>
    <p>One more email coming your way in a few days. This one's about knowing when to walk away — and why it's harder than it should be.</p>
    <p>— Signal Theory</p>
  `;

  const bodyText = `Hi ${name},

Let me ask you something honest.

Think about the last person you were interested in who didn't work out. How long did you hold onto it after the signals were already clear?

If you're like most men I've talked to, the answer is: way too long.

Not because you're desperate. Not because you're dumb. But because your brain is really, really good at filling silence with hopeful stories.

"She's probably just busy."
"Maybe she doesn't want to seem too eager."
"She said she had a great time — she's definitely interested."

None of those are based on anything she actually did. They're based on what you hope is true.

Signal Theory exists because of this one problem: the gap between what's happening and what we tell ourselves is happening.

The framework teaches you to close that gap. To see behavior instead of inventing narratives. To read the signal, not the story.

It's not complicated. But it does require practice. And that's what the app is for.

The training scenarios give you a safe place to practice reading signals before it matters:

Try a Training Scenario → https://learnsignaltheory.com/app

One more email coming your way in a few days. This one's about knowing when to walk away — and why it's harder than it should be.

— Signal Theory

Unsubscribe: ${unsubscribeUrl(sub.unsubscribeToken)}
`;

  return {
    subject,
    htmlBody: htmlWrapper(bodyHtml, sub.unsubscribeToken),
    textBody: bodyText,
  };
}

// ─────────────────────────────────────────────
// Template 4 — Follow-up at 7 days
// ─────────────────────────────────────────────

export function templateFollowup7d(sub: SubscriberData): EmailTemplate {
  const name = sub.firstName?.trim() || 'there';

  const subject = `The hardest part of dating (it's not what you think)`;

  const bodyHtml = `
    <p>Hi ${name},</p>
    <p>The hardest part of dating isn't getting rejected. Rejection is quick. It stings, then it's over.</p>
    <p>The hardest part is <strong>staying too long in something that's going nowhere.</strong></p>
    <p>Three months of texting someone who never makes plans. Six weeks of dates with someone who's "not ready for a relationship" but keeps showing up. Four canceled meetups where she always has a "great reason."</p>
    <p>Each individual moment feels reasonable. Together, they're a pattern. And the pattern is: this isn't going anywhere.</p>
    <p><strong>Here's what I learned the hard way after my divorce:</strong></p>
    <p>Walking away from someone who's "nice" and has "good reasons" feels wrong. It feels like you're being impatient. Unreasonable. Too picky.</p>
    <p>You're not. You're reading the signal and respecting yourself enough to invest where your energy is actually returned.</p>
    <p>That's not giving up. That's seeing clearly.</p>
    <p><strong>The Signal Theory framework has a simple rule for this:</strong></p>
    <p>When energy is consistently moving away from you — slower replies, vaguer plans, less initiation — stop investing more. You can't text someone into being interested. You can't out-effort a declining signal.</p>
    <p><strong>Redirect your energy to where it grows.</strong></p>
    <p>If you've been stuck in a "maybe" situation and want clarity, the AI analyzer can help:</p>
    <p><strong><a href="https://learnsignaltheory.com/app">Analyze Your Situation →</a></strong></p>
    <p>Paste in what's happening. Get honest feedback based on observable behavior, not guesswork.</p>
    <p>— Signal Theory</p>
  `;

  const bodyText = `Hi ${name},

The hardest part of dating isn't getting rejected. Rejection is quick. It stings, then it's over.

The hardest part is staying too long in something that's going nowhere.

Three months of texting someone who never makes plans. Six weeks of dates with someone who's "not ready for a relationship" but keeps showing up. Four canceled meetups where she always has a "great reason."

Each individual moment feels reasonable. Together, they're a pattern. And the pattern is: this isn't going anywhere.

Here's what I learned the hard way after my divorce:

Walking away from someone who's "nice" and has "good reasons" feels wrong. It feels like you're being impatient. Unreasonable. Too picky.

You're not. You're reading the signal and respecting yourself enough to invest where your energy is actually returned.

That's not giving up. That's seeing clearly.

The Signal Theory framework has a simple rule for this:

When energy is consistently moving away from you — slower replies, vaguer plans, less initiation — stop investing more. You can't text someone into being interested. You can't out-effort a declining signal.

Redirect your energy to where it grows.

If you've been stuck in a "maybe" situation and want clarity, the AI analyzer can help:

Analyze Your Situation → https://learnsignaltheory.com/app

Paste in what's happening. Get honest feedback based on observable behavior, not guesswork.

— Signal Theory

Unsubscribe: ${unsubscribeUrl(sub.unsubscribeToken)}
`;

  return {
    subject,
    htmlBody: htmlWrapper(bodyHtml, sub.unsubscribeToken),
    textBody: bodyText,
  };
}

// ─────────────────────────────────────────────
// Template 5 — Follow-up at 10 days
// ─────────────────────────────────────────────

export function templateFollowup10d(sub: SubscriberData): EmailTemplate {
  const name = sub.firstName?.trim() || 'there';

  const subject = `4 words that changed how I see dating`;

  const bodyHtml = `
    <p>Hi ${name},</p>
    <p>After my divorce, I spent two years studying, dating, reading, listening to podcasts, and talking to everyone I could about relationships.</p>
    <p>Most of the advice I found fell into two categories:</p>
    <p>1. <strong>"Be confident"</strong> — which is useless when you don't know what you're doing<br>2. <strong>"Learn techniques"</strong> — which felt manipulative and wasn't who I wanted to be</p>
    <p>Neither helped. What helped was a reframe so simple it almost felt stupid:</p>
    <p><strong>Believe what people show you.</strong></p>
    <p>Not what they say. Not what you hope. Not what their words imply. What their behavior actually demonstrates.</p>
    <p>Four words. But applying them changed everything.</p>
    <p>I stopped chasing women who said "definitely, let's hang out!" but never made plans. I stopped analyzing text messages looking for hidden meaning. I stopped telling myself stories about why she was distant.</p>
    <p>I started reading behavior. And suddenly dating wasn't confusing anymore.</p>
    <p>That's Signal Theory. Four signal states. Observable behavior. Reality over narrative.</p>
    <p><strong>I built the app because I couldn't coach everyone one-on-one.</strong> But I wanted to give people the same framework that worked for me and every guy I shared it with.</p>
    <p>If you've been using the free tier, you've seen beginner scenarios and basic training. There's a lot more depth available:</p>
    <p><strong>Advanced signal training. Intermediate and advanced scenarios. Unlimited AI analysis. Custom scenario creation.</strong></p>
    <p>All of it is available with Signal Theory Pro.</p>
    <p><strong><a href="https://learnsignaltheory.com/app">See What Pro Includes →</a></strong></p>
    <p>No pressure. The free version gives you real value. But if you want to go deeper, Pro is there.</p>
    <p>— Signal Theory</p>
  `;

  const bodyText = `Hi ${name},

After my divorce, I spent two years studying, dating, reading, listening to podcasts, and talking to everyone I could about relationships.

Most of the advice I found fell into two categories:

1. "Be confident" — which is useless when you don't know what you're doing
2. "Learn techniques" — which felt manipulative and wasn't who I wanted to be

Neither helped. What helped was a reframe so simple it almost felt stupid:

Believe what people show you.

Not what they say. Not what you hope. Not what their words imply. What their behavior actually demonstrates.

Four words. But applying them changed everything.

I stopped chasing women who said "definitely, let's hang out!" but never made plans. I stopped analyzing text messages looking for hidden meaning. I stopped telling myself stories about why she was distant.

I started reading behavior. And suddenly dating wasn't confusing anymore.

That's Signal Theory. Four signal states. Observable behavior. Reality over narrative.

I built the app because I couldn't coach everyone one-on-one. But I wanted to give people the same framework that worked for me and every guy I shared it with.

If you've been using the free tier, you've seen beginner scenarios and basic training. There's a lot more depth available:

Advanced signal training. Intermediate and advanced scenarios. Unlimited AI analysis. Custom scenario creation.

All of it is available with Signal Theory Pro.

See What Pro Includes → https://learnsignaltheory.com/app

No pressure. The free version gives you real value. But if you want to go deeper, Pro is there.

— Signal Theory

Unsubscribe: ${unsubscribeUrl(sub.unsubscribeToken)}
`;

  return {
    subject,
    htmlBody: htmlWrapper(bodyHtml, sub.unsubscribeToken),
    textBody: bodyText,
  };
}

// ─────────────────────────────────────────────
// Template 6 — Follow-up at 14 days
// ─────────────────────────────────────────────

export function templateFollowup14d(sub: SubscriberData): EmailTemplate {
  const name = sub.firstName?.trim() || 'there';

  const subject = `"I wasted 4 months. Signal Theory showed me in 10 minutes."`;

  const bodyHtml = `
    <p>Hi ${name},</p>
    <p>I want to share something a guy told me recently.</p>
    <p>He'd been texting a woman for four months. They'd gone on three dates. She was warm, funny, always said she had a good time. But she never initiated plans. He always had to ask. And she'd canceled twice.</p>
    <p>He kept telling himself she was just cautious. Recently divorced, taking it slow. Made sense, right?</p>
    <p>Then he used the Signal Theory analyzer. Pasted in the situation. The framework showed him what he already knew but didn't want to see:</p>
    <p><strong>Neutral trending Negative. Responsive but not invested. No forward movement in 4 months.</strong></p>
    <p>His response? "I knew. I just didn't want to admit it."</p>
    <p>He stopped reaching out. She never texted again. Four months of hope, resolved in 10 minutes of clarity.</p>
    <p><strong>He wasn't heartbroken. He was relieved.</strong> Because now he could redirect that energy to someone who would actually meet him halfway.</p>
    <p>That's what Signal Theory does. It doesn't tell you what to feel. It shows you what's actually happening. And that clarity — even when it's not what you want to hear — is worth more than months of uncertainty.</p>
    <p><strong>The men who get the most from Signal Theory are the ones who use it consistently:</strong></p>
    <p><strong>Training</strong> sharpens your signal-reading skills.<br><strong>Scenarios</strong> let you practice without real-world stakes.<br><strong>The analyzer</strong> gives you clarity on your actual situations.</p>
    <p>If you've been using the free tier but want to go deeper:</p>
    <p><strong><a href="https://learnsignaltheory.com/app">Upgrade to Signal Theory Pro →</a></strong></p>
    <p>Unlimited analysis. Advanced training. Custom scenarios. All the tools to stop wasting time and start seeing clearly.</p>
    <p>— Signal Theory</p>
  `;

  const bodyText = `Hi ${name},

I want to share something a guy told me recently.

He'd been texting a woman for four months. They'd gone on three dates. She was warm, funny, always said she had a good time. But she never initiated plans. He always had to ask. And she'd canceled twice.

He kept telling himself she was just cautious. Recently divorced, taking it slow. Made sense, right?

Then he used the Signal Theory analyzer. Pasted in the situation. The framework showed him what he already knew but didn't want to see:

Neutral trending Negative. Responsive but not invested. No forward movement in 4 months.

His response? "I knew. I just didn't want to admit it."

He stopped reaching out. She never texted again. Four months of hope, resolved in 10 minutes of clarity.

He wasn't heartbroken. He was relieved. Because now he could redirect that energy to someone who would actually meet him halfway.

That's what Signal Theory does. It doesn't tell you what to feel. It shows you what's actually happening. And that clarity — even when it's not what you want to hear — is worth more than months of uncertainty.

The men who get the most from Signal Theory are the ones who use it consistently:

Training sharpens your signal-reading skills.
Scenarios let you practice without real-world stakes.
The analyzer gives you clarity on your actual situations.

If you've been using the free tier but want to go deeper:

Upgrade to Signal Theory Pro → https://learnsignaltheory.com/app

Unlimited analysis. Advanced training. Custom scenarios. All the tools to stop wasting time and start seeing clearly.

— Signal Theory

Unsubscribe: ${unsubscribeUrl(sub.unsubscribeToken)}
`;

  return {
    subject,
    htmlBody: htmlWrapper(bodyHtml, sub.unsubscribeToken),
    textBody: bodyText,
  };
}

// ─────────────────────────────────────────────
// Template 7 — Follow-up at 21 days
// ─────────────────────────────────────────────

export function templateFollowup21d(sub: SubscriberData): EmailTemplate {
  const name = sub.firstName?.trim() || 'there';

  const subject = `One last thing (+ a free gift)`;

  const bodyHtml = `
    <p>Hi ${name},</p>
    <p>This is the last email in this sequence. After this, I'll only reach out when there's something genuinely useful to share — new scenarios, framework updates, or insights from coaching conversations.</p>
    <p>Before I go, three things:</p>
    <p><strong>1. If you've been using the app — thank you.</strong></p>
    <p>Seriously. I built Signal Theory because I went through a divorce and had to figure this out from scratch. Every person who uses it validates that the framework works beyond my own experience. That matters to me.</p>
    <p><strong>2. If you haven't tried it yet — what are you waiting for?</strong></p>
    <p>The free version gives you real training, real scenarios, and access to the AI analyzer. It takes 10 minutes to have your first "oh, that's what I was doing wrong" moment.</p>
    <p><strong><a href="https://learnsignaltheory.com/app">Try Signal Theory Free →</a></strong></p>
    <p><strong>3. I wrote a book. You can have it for free.</strong></p>
    <p>It's called <em>Signal Theory</em>. It's the complete framework — the four signal states, how to read them, how to respond, and dozens of real-world examples. About 80 pages. No fluff.</p>
    <p>It's the foundation that the app is built on. If you prefer reading to practicing, start here.</p>
    <p><strong><a href="https://learnsignaltheory.com/signal-theory.pdf">Download the Book (Free PDF) →</a></strong></p>
    <p>Thanks for reading these emails. I hope something in them was useful.</p>
    <p>And if you ever want to go deeper — advanced training, unlimited analysis, custom scenarios — Signal Theory Pro is always there.</p>
    <p><strong><a href="https://learnsignaltheory.com/app">See What Pro Includes →</a></strong></p>
    <p>See you around,<br>— Signal Theory</p>
  `;

  const bodyText = `Hi ${name},

This is the last email in this sequence. After this, I'll only reach out when there's something genuinely useful to share — new scenarios, framework updates, or insights from coaching conversations.

Before I go, three things:

1. If you've been using the app — thank you.

Seriously. I built Signal Theory because I went through a divorce and had to figure this out from scratch. Every person who uses it validates that the framework works beyond my own experience. That matters to me.

2. If you haven't tried it yet — what are you waiting for?

The free version gives you real training, real scenarios, and access to the AI analyzer. It takes 10 minutes to have your first "oh, that's what I was doing wrong" moment.

Try Signal Theory Free → https://learnsignaltheory.com/app

3. I wrote a book. You can have it for free.

It's called Signal Theory. It's the complete framework — the four signal states, how to read them, how to respond, and dozens of real-world examples. About 80 pages. No fluff.

It's the foundation that the app is built on. If you prefer reading to practicing, start here.

Download the Book (Free PDF) → https://learnsignaltheory.com/signal-theory.pdf

Thanks for reading these emails. I hope something in them was useful.

And if you ever want to go deeper — advanced training, unlimited analysis, custom scenarios — Signal Theory Pro is always there.

See What Pro Includes → https://learnsignaltheory.com/app

See you around,
— Signal Theory

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

export const TEMPLATES: Record<string, (sub: SubscriberData) => Promise<EmailTemplate> | EmailTemplate> = {
  immediate:     templateImmediate,
  followup_2d:   templateFollowup2d,
  followup_4d:   templateFollowup4d,
  followup_7d:   templateFollowup7d,
  followup_10d:  templateFollowup10d,
  followup_14d:  templateFollowup14d,
  followup_21d:  templateFollowup21d,
};

export async function getTemplate(name: string, sub: SubscriberData): Promise<EmailTemplate | null> {
  const fn = TEMPLATES[name];
  return fn ? await fn(sub) : null;
}
