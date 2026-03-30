# Analyzer Quick Reference - For Any LLM

**Use this table if you're not Claude - simple lookup for signal state classification.**

---

## Signal State Lookup Table

| Signal State | Observable Patterns (need 2+) | Recommended Action | What NOT to Do |
|-------------|-------------------|-------------------|----------------|
| **Interest** | • Initiates contact or plans<br>• Responds consistently (hours not days)<br>• Invests time (long convos)<br>• Creates opportunities<br>• Physical warmth<br>• Follows through | Show up, match energy, trust the signals | Overthink, create doubt, play games, hesitate |
| **Uncertainty** | • Response timing varies wildly<br>• Warm words but no action<br>• Polite but doesn't initiate<br>• "Maybe" without counter-offers<br>• Warm in person, distant after | One specific invite (day/time/place), let her response clarify | Keep pushing, interpret optimistically, wait indefinitely |
| **Comfort** | • Easy friendly conversation<br>• Asks advice about other guys<br>• Prefers group settings<br>• Physical touch stays platonic<br>• No escalation attempts | Decide if friendship is enough, surface it directly if not | Assume it will change, stay hoping, act like friend |
| **Disengagement** | • Response time increasing (pattern)<br>• Message length/energy decreasing<br>• Plans canceled, no reschedule<br>• Vague about future<br>• Consistent away movement | Pull back, match her energy or lower, accept the direction | Chase, send more messages, try harder, hope |

---

## Classification Steps (For Weaker Models)

**1. Extract behaviors from user's description**
List ONLY observable actions (not interpretations):
- ✅ "She texted after 3 days"
- ❌ "She's probably busy"

**2. Count matches for each state**
Go through each state's pattern list. Count how many you observed (need 2+ to classify).

**3. Pick the state with most matches**
- If tied → default to **Uncertainty**
- If none match well → **Uncertainty**

**4. Write output using this template:**
```
Signal State: [Interest | Uncertainty | Comfort | Disengagement]

What I See:
- [Observable behavior 1]
- [Observable behavior 2]
- [Observable behavior 3]

What It Means:
[1-2 sentences on what this pattern typically indicates]

Your Move:
[Specific action aligned with the signal state]

Watch For:
[1 sentence about common mistakes for this state]
```

---

## The Master Question (Calibration Check)

Before finalizing, ask: **"Am I aligned with the signal or trying to change it?"**

If your "Your Move" advice involves:
- Chasing / compensating / trying harder
- Interpreting positivity into vague behavior
- Hoping she'll change

→ It's **NOT Interest**. Reclassify.

---

## Common Mistakes to Avoid

❌ **Don't:**
- Interpret "maybe" as "yes if you try harder"
- Read warm tone as interest (politeness ≠ interest)
- Suggest chasing declining energy
- Assume friendliness = romantic interest
- Tell user what SHE should do differently

✅ **Do:**
- Cite specific observable behaviors only
- Match recommendations to the signal state
- Be direct (user is 35-55, divorced, has BS detector)
- Trust patterns over isolated moments
