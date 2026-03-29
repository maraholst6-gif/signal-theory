# Revised Questions - March 28, 2026

## Q4 - Hinge Dodger (REVISED)

**Original issue:** Options A and C both score GOOD but represent different strategies. Creates confusion about what "good signal reading" means.

**Revised:**

```javascript
{
  id: 4,
  dimension: 'signal',
  text: "You matched with someone on Hinge two weeks ago. Conversation is solid but she keeps dodging when you suggest meeting up — 'this week is crazy' twice now. What do you do?",
  options: [
    {
      label: "A) Go direct: 'I'm enjoying talking, but I'd rather meet in person. Let me know when you're free'",
      value: 'A',
      scoring: { signal: 'GOOD' }
    },
    {
      label: "B) Keep the text conversation going — she'll suggest meeting when she's ready",
      value: 'B',
      scoring: { signal: 'POOR' }
    },
    {
      label: "C) One more playful attempt: 'So... coffee this weekend or are you just collecting pen pals? 😏'",
      value: 'C',
      scoring: { signal: 'CAUTIOUS' }
    },
    {
      label: "D) Stop initiating — if she wanted to meet, she would have",
      value: 'D',
      scoring: { signal: 'NEGATIVE_BIAS' }
    }
  }
}
```

**Changes:**
- Removed duplicate GOOD option
- Made A the clear direct-communication winner
- C becomes playful but hedging (CAUTIOUS)
- Clearer signal-reading spectrum

---

## Q5 - Two Women Texting (REVISED)

**Original issue:** Option C ("meet both") sidesteps the dilemma and scores GOOD, undermining the forced-choice premise.

**Revised:**

```javascript
{
  id: 5,
  dimension: 'signal',
  text: "You're chatting with two women from apps. One sends long, thoughtful messages but takes a day to reply. The other replies instantly but keeps it to a few words. You're traveling for work next week and only have time for one date before you go. Who do you prioritize?",
  options: [
    {
      label: "A) Long messages — depth of engagement matters more than speed",
      value: 'A',
      scoring: { signal: 'GOOD' }
    },
    {
      label: "B) Fast replies — responsiveness shows she's actually interested",
      value: 'B',
      scoring: { signal: 'POOR' }
    },
    {
      label: "C) Neither gives you enough signal — flip a coin or go with whoever's more attractive",
      value: 'C',
      scoring: { signal: 'CAUTIOUS' }
    },
    {
      label: "D) The fast responder — momentum dies if you wait too long",
      value: 'D',
      scoring: { signal: 'POOR' }
    }
  }
}
```

**Changes:**
- Added time constraint to force the choice
- C now acknowledges indecision/defaulting to attraction (CAUTIOUS)
- Removed "meet both" escape hatch
- D reinforces POOR signal reading (confusing speed with interest)

---

## Q10 - Friend's Rebound (REVISED)

**Original issue:** Option A feels preachy for this demographic. "Make sure you're not running" doesn't model the non-judgmental calibration we want.

**Revised:**

```javascript
{
  id: 10,
  dimension: 'emotional',
  text: "Your buddy just finalized his divorce three months ago. He's already in a serious relationship and says he's never been happier. What do you tell him?",
  options: [
    {
      label: "A) 'That's great man — I'm still figuring out my own pace. How'd you know you were ready?'",
      value: 'A',
      scoring: { readiness: 'HIGH' }
    },
    {
      label: "B) 'If it feels right, it feels right — you know yourself'",
      value: 'B',
      scoring: { readiness: 'MEDIUM' }
    },
    {
      label: "C) 'Three months? Slow down — you're gonna repeat the same patterns'",
      value: 'C',
      scoring: { readiness: 'MEDIUM' }
    },
    {
      label: "D) 'Honestly jealous — I wish I could move on that fast'",
      value: 'D',
      scoring: { readiness: 'LOW' }
    }
  }
}
```

**Changes:**
- A becomes curious instead of cautionary (models self-awareness + non-judgment)
- Still acknowledges timing matters but doesn't lecture
- More authentic to how emotionally intelligent men actually talk

---

## Q13 - No Spark After 5 Dates (REVISED)

**Original issue:** Options A and D both score CALIBRATED but represent opposite strategies. Need to pick one as the calibrated response.

**Revised:**

```javascript
{
  id: 13,
  dimension: 'strategy',
  text: "You've been on five dates with someone you really like. She's great on paper and in person. But there's no physical spark yet. What do you do?",
  options: [
    {
      label: "A) Give it 2-3 more dates — attraction can build slowly",
      value: 'A',
      scoring: { strategy: 'PASSIVE' }
    },
    {
      label: "B) End it now — physical chemistry either exists or it doesn't",
      value: 'B',
      scoring: { strategy: 'OUTCOME_FOCUSED' }
    },
    {
      label: "C) Keep seeing her casually — everything else is there, maybe spark comes later",
      value: 'C',
      scoring: { strategy: 'PASSIVE' }
    },
    {
      label: "D) Talk to her about it directly — 'I like you, but I'm not feeling the physical connection yet. Are you?'",
      value: 'D',
      scoring: { strategy: 'CALIBRATED' }
    }
  }
}
```

**Changes:**
- A becomes PASSIVE (hoping/waiting for something to change)
- D stays CALIBRATED (direct communication, mutual check-in)
- C clarified as passive avoidance (different flavor than A)
- Clear distinction between outcome-focused (B), passive (A/C), and calibrated (D)

---

## Q14 - She Deleted Apps (REVISED)

**Original issue:** Option D (delete apps but keep talking to other person) scoring ANXIOUS feels off — it's more about deception than anxiety.

**Revised:**

```javascript
{
  id: 14,
  dimension: 'strategy',
  text: "You've been dating someone for a month, but you're also talking to two other people from apps. She just mentioned she deleted her apps. What do you do?",
  options: [
    {
      label: "A) Match her pace — delete your apps too and see where this goes",
      value: 'A',
      scoring: { strategy: 'OVER_INVESTING' }
    },
    {
      label: "B) Tell her directly: 'I really like you, but I'm still exploring right now'",
      value: 'B',
      scoring: { strategy: 'CALIBRATED' }
    },
    {
      label: "C) Say nothing — maybe she's just decluttering, you're not exclusive yet",
      value: 'C',
      scoring: { strategy: 'PASSIVE' }
    },
    {
      label: "D) Delete your apps but keep the conversations going with the other two — cover your bases",
      value: 'D',
      scoring: { strategy: 'OUTCOME_FOCUSED' }
    }
  }
}
```

**Changes:**
- D reframed as OUTCOME_FOCUSED (hedging, controlling, managing optics)
- More accurate label for the behavior
- Distinguishes from passive (C) and anxious over-investment (A)

---

## Q15 - Meet Her Friends (REVISED)

**Original issue:** All four options are reasonable. Hard to identify clearly problematic responses. Need sharper contrast.

**Revised:**

```javascript
{
  id: 15,
  dimension: 'strategy',
  text: "After four dates, she invites you to a party where all her close friends will be. What's your first thought?",
  options: [
    {
      label: "A) Natural next step — meeting friends at this point feels right",
      value: 'A',
      scoring: { strategy: 'CALIBRATED' }
    },
    {
      label: "B) Feels fast, but if she's comfortable introducing you, that's a good sign",
      value: 'B',
      scoring: { strategy: 'ANXIOUS' }
    },
    {
      label: "C) Too soon — you'd rather build more foundation before the friend test",
      value: 'C',
      scoring: { strategy: 'PASSIVE' }
    },
    {
      label: "D) This is huge — she's basically saying you're boyfriend material",
      value: 'D',
      scoring: { strategy: 'OVER_INVESTING' }
    }
  }
}
```

**Changes:**
- Reframed as "first thought" instead of "move" to get gut reaction
- A stays calibrated (no overthinking)
- B shows anxiety/second-guessing but still positive
- C is avoidant/slow-playing
- D over-reads the signal (milestone thinking)
- Clearer spectrum of responses

---

## Summary of Changes

| Question | Original Issue | Fix |
|----------|---------------|-----|
| Q4 | Two GOOD options | Made one clear winner (direct communication) |
| Q5 | Escape hatch option | Added time constraint, removed "meet both" |
| Q10 | Preachy HIGH option | Made curious/non-judgmental instead |
| Q13 | Two CALIBRATED options | Chose communication as CALIBRATED, waiting as PASSIVE |
| Q14 | Mismatched scoring | Changed deceptive behavior to OUTCOME_FOCUSED |
| Q15 | Weak contrasts | Reframed as gut reaction, sharpened D as over-investment |

**Next step:** Review these revisions and decide whether to update the live quiz or keep for V2/A-B test variant.
