/**
 * actionPlanContent.ts
 * Profile-specific action plan content embedded directly in code
 */

export interface ActionPlanContent {
  subject: string;
  body: string; // Markdown format
}

export const ACTION_PLAN_CONTENT: Record<string, ActionPlanContent> = {
  'wounded-analyst': {
    subject: 'Your Dating Readiness Profile: The Wounded Analyst',
    body: `Hi {firstName},

Based on your quiz answers, your dating readiness profile is **The Wounded Analyst**.

Here's what's happening: you're not bad at reading signals. You're actually paying very close attention. The problem is that your anxiety is louder than the signals.

Every delayed text becomes evidence of rejection. Every ambiguous moment becomes proof you did something wrong. Every date that doesn't end perfectly triggers a post-mortem where you replay every sentence looking for the mistake. You're not oblivious — you're hypervigilant. And hypervigilance is killing your dating life faster than cluelessness ever could.

This isn't a skills problem. It's an emotional one. Your last relationship left a wound that hasn't fully healed, and that wound is distorting everything you see. You're dating through a filter of fear, and fear makes everything look like rejection.

---

## Your 3 Practices

These practices are designed to create space between what your anxiety says and what's actually happening.

### Practice 1: The Anxiety Translator

When you catch yourself interpreting a signal negatively, write down two things: (1) what anxiety is telling you, and (2) the most neutral possible interpretation of the same signal.

Keep a note in your phone labeled "Anxiety vs. Reality." Over time, you'll notice that the neutral version is right far more often than the anxious version.

### Practice 2: The 24-Hour Freeze

When something triggers your analysis spiral — a delayed response, an ambiguous comment, a date that felt off — impose a 24-hour freeze. No interpretation. No action. No texting to "check in." Just wait.

Set a literal timer on your phone: 24 hours. During that time, do not analyze. Nine times out of ten, the spiral was premature.

### Practice 3: The Evidence Log

Every time something *good* happens in a dating interaction — she initiates a text, she suggests plans, she compliments you, she makes an effort — write it down.

Your brain selectively remembers negative signals. This log is a counterweight. When you're spiraling at 11 PM because she hasn't texted back, open the log and see fifteen entries of genuine interest.

---

## What's Next

Start with Practice 2 this week. The next time you feel the urge to double-text or seek reassurance — set the timer. 24 hours. No action.

The work ahead is real, and so is the payoff. You feel deeply. Once you're not filtering through fear, that depth becomes your greatest strength.

Good luck out there.

— The Signal Theory Team`
  },
  
  // Add other profiles here as needed - for now just wounded-analyst for testing
};
