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
  const profile = sub.quizProfile || 'secure-ready';

  const subject = `The one signal most people miss`;

  const profileBlocks: Record<string, string> = {
    'secure-ready': `You're probably already noticing this pattern. Your blind spot isn't confusing responsiveness with interest — it's sometimes being too patient with low-investment situations. Trust your read and act on it.`,
    'anxious-overreader': `For you, this is especially important. You tend to see responsiveness as interest because you're anxious for confirmation. But if you're always the one reaching out, that anxiety is creating the very dynamic you're afraid of. Pull back and see what happens.`,
    'confident-misreader': `You might assume that if she's responding, she's interested. But friendliness isn't flirting. Watch for who initiates. If it's always you, she might just be being polite.`,
    'guarded-hesitant': `You probably hold back from initiating because you don't want to seem needy. But someone has to make the first move. If she's interested, she'll reciprocate. If she doesn't, you'll know early.`,
    'hopeful-projector': `This is your biggest trap. You keep initiating because you believe persistence pays off. It doesn't. If she wanted to talk to you, she'd reach out. Redirect your energy.`,
    'cynical-burned-out': `You might read someone's responsiveness as manipulation — keeping you on the hook. Sometimes it is. But sometimes people are just polite. The test is simple: do they initiate? If not, walk away.`,
    'pattern-blind-repeater': `Look at your last three interactions that went nowhere. Who was initiating? If it was you every time, that's the pattern. Break it by only investing where energy is reciprocated.`,
    'overthinking-analyzer': `You're probably already counting who initiates what. That's good. But don't overthink it. If the ratio is 8:2 in your favor, you don't need more data. You need to pull back.`,
  };
  const profileBlock = profileBlocks[profile] || profileBlocks['secure-ready'];

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
    <p><em>${profileBlock}</em></p>
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

${profileBlock}

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
  const profile = sub.quizProfile || 'secure-ready';

  const subject = `The stories you tell yourself (and why they're wrong)`;

  const profileBlocks4d: Record<string, string> = {
    'secure-ready': `You probably don't fill silence with stories as much as most guys — your blind spot is subtler. Sometimes you assume everything's fine when the signals are actually cooling. If she stops initiating and you're still telling yourself "she's just busy," notice it before you explain it away.`,
    'anxious-overreader': `Your stories go negative, not hopeful. "She's pulling away." "I said something wrong." "She's losing interest." Sometimes that reads right. Often it's noise. Ask yourself: what did she actually do? Not what you fear she's thinking — what did you observe? That's the story you're allowed to tell.`,
    'confident-misreader': `Your stories are built on confidence, not evidence. The interaction felt great — you were on, she was laughing, the chemistry was real. But enjoying yourself isn't signal. Watch what she does between the moments you're together. That's where the actual story lives.`,
    'guarded-hesitant': `Your stories are pre-emptive: "This won't last." "She'll leave eventually." "It's too good to be true." Those aren't reads — they're armor. Question the story before you let it end something real. Sometimes the signal is genuinely good. You don't have to believe it forever — just long enough to find out.`,
    'hopeful-projector': `This email was basically written about you. You build entire futures on a single "maybe." The story you tell yourself is always about potential — what this could become, how different things will be next week. Potential isn't signal. Behavior is.`,
    'cynical-burned-out': `Your stories are protective — everyone's playing games, warmth is a red flag, this is too good to be real. Some of that is earned. But you've turned a scar into a lens, and now you see manipulation everywhere. Ask yourself: what would I need to observe to believe this situation is genuine? That's the signal question. Everything else is a story.`,
    'pattern-blind-repeater': `You're not just telling yourself stories — you're telling yourself the same story, repeatedly. "This time is different." "She's not like the others." Recognize that sentence. That's not a read. That's the beginning of the pattern replaying.`,
    'overthinking-analyzer': `You build stories from fragments — response times, punctuation choices, how many messages are in the thread. Each piece seems meaningful. Together they create a narrative that has nothing to do with what's actually happening. Pull back. What is the overall behavior, over the last two weeks? That's the only story worth reading.`,
  };
  const profileBlock4d = profileBlocks4d[profile] || profileBlocks4d['secure-ready'];

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
    <p><em>${profileBlock4d}</em></p>
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

${profileBlock4d}

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
  const profile = sub.quizProfile || 'secure-ready';

  const subject = `The hardest part of dating (it's not what you think)`;

  const profileBlocks7d: Record<string, string> = {
    'secure-ready': `You probably walk away cleaner than most — but your challenge is occasionally waiting for certainty you don't need. If the signal has been declining for three weeks, that's the answer. You don't need one more data point. Trust it and move on.`,
    'anxious-overreader': `Walking away feels like giving up, and you're not a quitter. But here's what you're actually doing when you stay in a declining situation: feeding the anxiety. The more you invest, the more terrifying it becomes to lose it. Sometimes walking away is the bravest, most self-respecting move available to you.`,
    'confident-misreader': `You tend to stay too long because you're certain it's going well — right up until it ends. The surprise is the tell. If you're consistently blindsided when things fall apart, you're reading the current moment instead of the trajectory. Start watching the trend. If it's been declining for a month, it's been over for a month.`,
    'guarded-hesitant': `Ironically, you might stay too long not because you're deeply invested — but because leaving feels like confirming your worst fear: that you were right to be guarded. You protect yourself by not trying, then stay in failed situations to avoid the verdict. Leave earlier. It's not failure. It's information.`,
    'hopeful-projector': `You're the hardest to help here because your hope is renewable. Each week brings a new reason this time might be different. It won't. The signal was clear weeks ago. You don't have to be cold about it — just honest. She showed you what this is. Believe it.`,
    'cynical-burned-out': `Walking away should feel easier for you — but often it doesn't. You stay because you've lowered your expectations enough that "declining" still feels like "something." Don't settle for a situation that's actively going nowhere just because you've stopped believing better exists. You deserve actual investment, not just presence.`,
    'pattern-blind-repeater': `You've stayed too long before. Multiple times. Think about the last time you finally walked away — how long did it take? That's your pattern. Cut that number in half. You already know what the signs look like. You just keep convincing yourself this time is different.`,
    'overthinking-analyzer': `You'll stay because you're still building a case. You need more data. You want to be certain. Meanwhile, the signal has been declining for weeks and you already have everything you need. Stop building the case. The answer is already in the data you've collected. Let yourself read it.`,
  };
  const profileBlock7d = profileBlocks7d[profile] || profileBlocks7d['secure-ready'];

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
    <p><em>${profileBlock7d}</em></p>
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

${profileBlock7d}

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
  const profile = sub.quizProfile || 'secure-ready';

  const subject = `4 words that changed how I see dating`;

  const profileBlocks10d: Record<string, string> = {
    'secure-ready': `"Believe what people show you" probably feels intuitive — you already lean that way. The deeper work is in the ambiguous situations, where two reads are both defensible. That's where Pro training pays off: precision in the gray zones, not just the obvious ones.`,
    'anxious-overreader': `"Believe what people show you" is your rescue line — because what you've been believing is the story your anxiety wrote, not her behavior. When you apply this consistently, you'll find most situations are less dire than your head says. But you need to practice it until it's a reflex. That's what the Pro scenarios are built for.`,
    'confident-misreader': `This principle should humble you slightly — and that's a good thing. Believing what people show you means watching for reciprocation, not just receptiveness. She laughed at every joke. That's not signal. Did she initiate? Did she follow through on a plan? Those are signals.`,
    'guarded-hesitant': `"Believe what people show you" cuts both ways. It means trusting positive signals too. If she's initiating, making plans, and showing up consistently — believe that. You built your guard to protect yourself. But if you can't trust real positive data, the guard isn't protecting you. It's just keeping you stuck.`,
    'hopeful-projector': `This principle is the antidote to your pattern. You've been believing what you hope is true. The shift is simple but radical: only trust what you can observe. Not what she said she'd do. Not the potential you see. What did she actually show you? Apply it once to your current situation and see what changes.`,
    'cynical-burned-out': `You've been believing what you fear is true. The principle asks you to be more precise — neither hopeful nor cynical. Just observational. What does this specific person's behavior actually show you, right now? Not what past people showed you. This person. That's the standard.`,
    'pattern-blind-repeater': `You've been here before. And if you're honest, the signals were always there — you just weren't believing them because believing them was uncomfortable. This principle gives you a framework to trust what you see instead of what you want. Start using it in low-stakes situations until it becomes automatic.`,
    'overthinking-analyzer': `This is your framework for ending the spiral. When you're up at 1am running through a text thread, come back to this: what did she actually show you? Not imply. Not suggest. Show. Everything else — the analysis, the theories, the what-ifs — is noise. Four words. That's the filter.`,
  };
  const profileBlock10d = profileBlocks10d[profile] || profileBlocks10d['secure-ready'];

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
    <p><em>${profileBlock10d}</em></p>
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

${profileBlock10d}

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
  const profile = sub.quizProfile || 'secure-ready';

  const subject = `"I wasted 4 months. Signal Theory showed me in 10 minutes."`;

  const profileBlocks14d: Record<string, string> = {
    'secure-ready': `That story probably resonates — maybe not from your own experience, but you've watched someone close to you do it. The framework gives you language to recognize it in yourself when you're in it. Pro takes that precision further in the scenarios where two reads are genuinely close.`,
    'anxious-overreader': `The guy in that story held on because hope felt safer than clarity. You do something similar — but through anxiety rather than optimism. You stay because leaving feels like losing the last thread of possibility. Either way, the outcome is the same: months lost to something that was already resolved. Clarity is uncomfortable for ten minutes. Uncertainty is exhausting for months.`,
    'confident-misreader': `You'd probably identify with the surprise at the end more than the holding on. "Wait — she wasn't actually interested?" That shock is the tell. If you're reading the framework consistently, you won't be surprised. You'll know earlier. The investment stops before four months become the cost.`,
    'guarded-hesitant': `Notice what he felt at the end: not heartbreak — relief. That's worth sitting with. Clarity, even hard clarity, is lighter than prolonged uncertainty. You've been carrying uncertainty for a long time. The framework gives you permission to put it down.`,
    'hopeful-projector': `That's your story. Maybe not four months — maybe longer. The details change but the structure is identical: responsive but not invested, no forward movement, always a good reason. He knew. He just didn't want to admit it. Sound familiar? The analyzer won't tell you anything new. It'll help you finally believe what you already know.`,
    'cynical-burned-out': `You probably read that and thought "I could've told him in five minutes." You're right — you can see it in other people's situations. The hard part is applying that same clarity to your own, where your burned-out lens makes every situation look like a trap. The framework gives you precision where you currently have only suspicion.`,
    'pattern-blind-repeater': `That story isn't unique — it's probably yours, with different people. The framework they used, the signal state they got back, the outcome — you've been there. The difference is they finally got clarity. The analyzer gives you a way to track your own situations over time and start seeing the pattern. That's the breakthrough.`,
    'overthinking-analyzer': `He didn't need more data — he had plenty. What he needed was a framework to organize it and the courage to trust the conclusion. That's your challenge too. You have enough information. What you need is the discipline to stop seeking more and start trusting what's already there.`,
  };
  const profileBlock14d = profileBlocks14d[profile] || profileBlocks14d['secure-ready'];

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
    <p><em>${profileBlock14d}</em></p>
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

${profileBlock14d}

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
  const profile = sub.quizProfile || 'secure-ready';

  const subject = `One last thing (+ a free gift)`;

  const profileBlocks21d: Record<string, string> = {
    'secure-ready': `You came in with good instincts. The work now is sharpening the edges — the subtle signals, the ambiguous moments, the situations where two reads are both defensible. That's where the book and advanced training make the difference. Good readers don't just read clearly. They read early.`,
    'anxious-overreader': `You've learned that your anxiety isn't signal. That's the foundation — and it's not a small thing. Everything else builds on it. Keep practicing. The calm gets louder with repetition. At some point it becomes the default voice, not the anxious one.`,
    'confident-misreader': `You took the quiz. You read these emails. That's more self-awareness than most guys bring to this. Now do one more thing: use the framework before you escalate, not after you're confused. The book shows you exactly what to look for before you're invested — not after.`,
    'guarded-hesitant': `The framework gives you something your defensiveness couldn't: a reason to trust that isn't naive. You don't have to open up blindly. You can open up based on data — consistent initiation, follow-through, actual investment. That's not reckless. That's informed.`,
    'hopeful-projector': `The work is learning to invest proportionally — not less, but in response to what's actually there. The book gives you the language for that calibration. Hope is allowed. The problem was never the hope. It was hope with no reciprocation to justify it.`,
    'cynical-burned-out': `You deserve better than a closed door. The framework isn't about being less discerning — it's about being more precise. There's a real difference between a red flag and a trigger, between someone being manipulative and someone being imperfect. The book helps you tell them apart.`,
    'pattern-blind-repeater': `You have the most to gain here — because seeing your own pattern is the breakthrough. Use the analyzer every time. Read the book. Track what repeats. One pattern recognized and broken is a different life. That's not hyperbole. That's how this works.`,
    'overthinking-analyzer': `Everything you need is in the framework. Stop seeking more input and start trusting cleaner signal. The book is 80 pages — that's the ceiling. After that, trust what you've learned and be present. The analysis doesn't end. The spiraling does.`,
  };
  const profileBlock21d = profileBlocks21d[profile] || profileBlocks21d['secure-ready'];

  const bodyHtml = `
    <p>Hi ${name},</p>
    <p>This is the last email in this sequence. After this, I'll only reach out when there's something genuinely useful to share — new scenarios, framework updates, or insights from coaching conversations.</p>
    <p>Before I go, three things:</p>
    <p><strong>1. If you've been using the app — thank you.</strong></p>
    <p>Seriously. I built Signal Theory because I went through a divorce and had to figure this out from scratch. Every person who uses it validates that the framework works beyond my own experience. That matters to me.</p>
    <p><em>${profileBlock21d}</em></p>
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

${profileBlock21d}

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
