# ConvertKit Quick Setup Checklist

**Time estimate:** 30-45 minutes to set up all 8 profiles

---

## Part 1: Create Tags (5 minutes)

**URL:** https://app.kit.com/subscribers

1. Click "Tags" in left sidebar (or "Expand Tags")
2. Click "Create new tag"
3. Enter tag name exactly as shown below
4. Save
5. Repeat for all 8

**Tag names (copy-paste these):**
```
ready-navigator
rusty-romantic
eager-rebuilder
cautious-observer
wounded-analyst
pattern-repeater
inconsistent-dater
self-aware-learner
```

✅ **Checkpoint:** You should have 8 tags visible in the Tags list

---

## Part 2: Create Broadcast Emails (20-30 minutes)

**For each profile, create one saved email:**

### Process (repeat 8 times):

1. Go to https://app.kit.com/broadcasts/new
2. Choose "Email" (not Broadcast)
3. Open the corresponding `.md` file from `signal-theory/email-sequences/`
4. Copy the **Subject line** → paste into ConvertKit subject field
5. Copy the **email body** (everything after subject line) → paste into ConvertKit editor
6. Format:
   - Use plain text editor OR
   - Light HTML (bold headers, preserve line breaks)
7. Preview to verify formatting looks clean
8. **Save as Draft** (don't send!)
9. Note the URL - you'll need the email ID later

### Files to use:

1. `action-plan-01-ready-navigator.md`
2. `action-plan-02-rusty-romantic.md`
3. `action-plan-03-eager-rebuilder.md`
4. `action-plan-04-cautious-observer.md`
5. `action-plan-05-wounded-analyst.md`
6. `action-plan-06-pattern-repeater.md`
7. `action-plan-07-inconsistent-dater.md`
8. `action-plan-08-self-aware-learner.md`

✅ **Checkpoint:** You should have 8 draft emails saved

---

## Part 3: Create Automations (10-15 minutes)

**For each profile, create one automation:**

### Process (repeat 8 times):

1. Go to https://app.kit.com/automations/new
2. **Name:** `Action Plan - [Profile Name]`
   - Example: `Action Plan - Ready Navigator`
3. **Trigger:** 
   - Type: "Tag added"
   - Select tag: Choose the matching profile tag
4. **Actions:**
   - Add "Wait" → 1 minute
   - Add "Send Email" → Select the matching draft email
5. **Publish** the automation (turn it on!)

### Automation mapping:

| Automation Name | Trigger Tag | Email to Send |
|----------------|-------------|---------------|
| Action Plan - Ready Navigator | ready-navigator | "Your Signal Theory results are in — and you're in the top 10%" |
| Action Plan - Rusty Romantic | rusty-romantic | "Your quiz results: You're not broken. You're rusty." |
| Action Plan - Eager Rebuilder | eager-rebuilder | "Your quiz results: You're not ready yet. (Read this anyway.)" |
| Action Plan - Cautious Observer | cautious-observer | "Your quiz results: You see the opportunities. You just don't take them." |
| Action Plan - Wounded Analyst | wounded-analyst | "Your quiz results: Your anxiety is louder than the signals." |
| Action Plan - Pattern Repeater | pattern-repeater | "Your quiz results: You're dating your past on repeat." |
| Action Plan - Inconsistent Dater | inconsistent-dater | "Your quiz results: You don't have a dating problem. You have a consistency problem." |
| Action Plan - Self-Aware Learner | self-aware-learner | "Your quiz results: You're closer than you think." |

✅ **Checkpoint:** You should have 8 active automations

---

## Part 4: Test (5 minutes)

1. Go to https://learnsignaltheory.com/quiz
2. Complete quiz with test email: `test-ready-navigator@example.com`
3. Select answers that would result in Ready Navigator profile
4. Submit
5. Check ConvertKit:
   - Subscriber created? ✓
   - Tag `ready-navigator` applied? ✓
   - Automation triggered? ✓
   - Email sent within 2-3 minutes? ✓

**If test passes:** System is live! 🎉

**If test fails:** Check troubleshooting section in `CONVERTKIT-SETUP.md`

---

## Quick Reference

**Backend API endpoint:** `POST /api/convertkit/subscribe`  
**Form ID:** 9264094  
**Auto-confirm:** Enabled (no double opt-in)  
**Incentive email:** Disabled (using automation instead)

**What happens when someone completes quiz:**
1. Quiz → Backend → ConvertKit API
2. ConvertKit adds subscriber + applies profile tag
3. Tag triggers automation
4. Automation sends matching action plan email
5. Done!

---

## Future: Email 2 & 3

**When ready to add follow-up emails:**

1. Write Email 2 ("Why This Is So Hard Alone") × 8 profiles
2. Write Email 3 ("How Signal Theory Works") × 8 profiles
3. Save as drafts in ConvertKit
4. Edit each automation:
   - Add "Wait" → 2 days
   - Add "Send Email" → Email 2
   - Add "Wait" → 2 days
   - Add "Send Email" → Email 3
5. Save automation

**Timeline:**
- Day 0: Action plan (immediate)
- Day 2: Email 2
- Day 4: Email 3 (the pitch)

---

## Tips

**Batch operations:**
- Create all 8 tags first (fast)
- Create all 8 emails next (takes longest)
- Create all 8 automations last (fast once emails are saved)

**Copy-paste efficiently:**
- Keep all 8 `.md` files open in tabs
- Copy subject → paste → copy body → paste → save
- Don't worry about perfect formatting - clean plain text is fine

**Test incrementally:**
- After creating first 3 profiles, test one
- Verify it works before finishing the rest
- Easier to debug early than after all 8 are done

---

## Done!

Once complete, you have a fully automated profile-specific email system. Every quiz completion triggers the right email for that person's specific situation.

**Next milestone:** Write Email 2 & 3 for the follow-up sequence (the selling emails).
