export const questions = [
  // ============================================
  // QUESTIONS 1-5: SIGNAL READING
  // ============================================

  // Q1 - Template 2: "What Happens Next"
  {
    id: 1,
    dimension: 'signal',
    text: "You're texting back and forth all week. Great energy. You suggest meeting up Saturday and she says 'Maybe! I'll let you know.' Saturday morning, nothing. What do you do?",
    options: [
      {
        label: "A) Send a casual check-in: 'Still up for tonight?'",
        value: 'A',
        scoring: { signal: 'GOOD' }
      },
      {
        label: "B) Wait for her to text — the ball's in her court",
        value: 'B',
        scoring: { signal: 'CAUTIOUS' }
      },
      {
        label: "C) Make other plans — 'maybe' means no",
        value: 'C',
        scoring: { signal: 'NEGATIVE_BIAS' }
      },
      {
        label: "D) Send something playful to re-engage, like a meme or callback to an earlier joke",
        value: 'D',
        scoring: { signal: 'POOR' }
      }
    ]
  },

  // Q2 - Template 2: "What Happens Next"
  {
    id: 2,
    dimension: 'signal',
    text: "First date, coffee shop. She's laughing, asking follow-up questions, leaning in. When you mention a restaurant you love, she says 'Oh, you'll have to take me there sometime.' What do you do?",
    options: [
      {
        label: "A) Lock it in: 'How's Thursday?'",
        value: 'A',
        scoring: { signal: 'GOOD' }
      },
      {
        label: "B) Play it cool — 'Yeah, we should' — and revisit later over text",
        value: 'B',
        scoring: { signal: 'CAUTIOUS' }
      },
      {
        label: "C) Assume she's just being polite and don't follow up on it",
        value: 'C',
        scoring: { signal: 'NEGATIVE_BIAS' }
      },
      {
        label: "D) Pull up the menu on your phone right now and start planning",
        value: 'D',
        scoring: { signal: 'POOR' }
      }
    ]
  },

  // Q3 - Template 2: "What Happens Next"
  {
    id: 3,
    dimension: 'signal',
    text: "You've been on three dates. She texts you a photo of something funny she saw and says 'this reminded me of you.' But she also took 8 hours to reply to your last message. What do you do?",
    options: [
      {
        label: "A) Respond warmly to the photo — she's thinking of you, that's what matters",
        value: 'A',
        scoring: { signal: 'GOOD' }
      },
      {
        label: "B) Reply but match her pace — take your time responding too",
        value: 'B',
        scoring: { signal: 'POOR' }
      },
      {
        label: "C) Notice the mixed signals but don't say anything yet — too early to read into texting speed",
        value: 'C',
        scoring: { signal: 'CAUTIOUS' }
      },
      {
        label: "D) Wonder if the slow replies mean she's talking to other guys",
        value: 'D',
        scoring: { signal: 'NEGATIVE_BIAS' }
      }
    ]
  },

  // Q4 - Template 6: Action-Based Reframe
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
    ]
  },

  // Q5 - Template 1: Forced Trade-Off
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
    ]
  },

  // ============================================
  // QUESTIONS 6-10: EMOTIONAL READINESS
  // ============================================

  // Q6 - Template 3: Ex-Pattern Trigger
  {
    id: 6,
    dimension: 'emotional',
    text: "New woman you're seeing cancels plans last minute — something came up with her kid. Your ex used to cancel constantly, always with an excuse. What do you do?",
    options: [
      {
        label: "A) Say 'no worries' and suggest rescheduling — single parents deal with this",
        value: 'A',
        scoring: { readiness: 'HIGH' }
      },
      {
        label: "B) Tell her directly: 'I get it, but reliability matters to me — can we lock something in?'",
        value: 'B',
        scoring: { readiness: 'HIGH' }
      },
      {
        label: "C) Say it's fine but start mentally keeping score of cancellations",
        value: 'C',
        scoring: { readiness: 'MEDIUM' }
      },
      {
        label: "D) Pull back on effort — you've seen this pattern before and know where it leads",
        value: 'D',
        scoring: { readiness: 'LOW' }
      }
    ]
  },

  // Q7 - Template 3: Ex-Pattern Trigger
  {
    id: 7,
    dimension: 'emotional',
    text: "You're at dinner with someone new and she checks her phone mid-conversation. Your ex was glued to her phone the last year of your marriage. What do you do?",
    options: [
      {
        label: "A) Barely notice — people check their phones, it's not a referendum on you",
        value: 'A',
        scoring: { readiness: 'HIGH' }
      },
      {
        label: "B) Notice the reaction in yourself, name it internally as an old trigger, and move on",
        value: 'B',
        scoring: { readiness: 'HIGH' }
      },
      {
        label: "C) Make a light comment: 'Everything okay?' — testing whether she's aware she did it",
        value: 'C',
        scoring: { readiness: 'MEDIUM' }
      },
      {
        label: "D) Say nothing but feel the mood shift — you're scanning for more signs now",
        value: 'D',
        scoring: { readiness: 'LOW' }
      }
    ]
  },

  // Q8 - Template 7: Gut Check
  {
    id: 8,
    dimension: 'emotional',
    text: "You're on a really good third date. She touches your arm, real eye contact, easy silence. First feeling?",
    options: [
      {
        label: "A) This is great — I'm enjoying this moment",
        value: 'A',
        scoring: { readiness: 'HIGH' }
      },
      {
        label: "B) Cautious optimism — trying not to get ahead of myself",
        value: 'B',
        scoring: { readiness: 'MEDIUM' }
      },
      {
        label: "C) A flicker of guilt, like you shouldn't be this happy yet",
        value: 'C',
        scoring: { readiness: 'LOW' }
      },
      {
        label: "D) Already thinking about where this could go — maybe she's the one",
        value: 'D',
        scoring: { readiness: 'MEDIUM' }
      }
    ]
  },

  // Q9 - Template 7: Gut Check
  {
    id: 9,
    dimension: 'emotional',
    text: "A mutual friend mentions your ex has been telling people the divorce was mostly your fault. First feeling?",
    options: [
      {
        label: "A) Annoyed, but not enough to engage — you know the truth",
        value: 'A',
        scoring: { readiness: 'HIGH' }
      },
      {
        label: "B) Need to set the record straight — people are hearing one side",
        value: 'B',
        scoring: { readiness: 'LOW' }
      },
      {
        label: "C) Sting of unfairness, then let it go — fighting the narrative feeds it",
        value: 'C',
        scoring: { readiness: 'HIGH' }
      },
      {
        label: "D) Honestly, a little rattled — what if she's right about some of it?",
        value: 'D',
        scoring: { readiness: 'MEDIUM' }
      }
    ]
  },

  // Q10 - Template 4: Friend Advice Flip
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
    ]
  },

  // ============================================
  // QUESTIONS 11-15: DATING STRATEGY
  // ============================================

  // Q11 - Template 2: "What Happens Next"
  {
    id: 11,
    dimension: 'strategy',
    text: "After a great second date, she texts 'I had such a good time 😊' at midnight. It's late and you're already in bed. What do you do?",
    options: [
      {
        label: "A) Reply in the morning with something warm — no need to perform availability at midnight",
        value: 'A',
        scoring: { strategy: 'CALIBRATED' }
      },
      {
        label: "B) Text back right away — momentum matters and she's clearly thinking about you",
        value: 'B',
        scoring: { strategy: 'ANXIOUS' }
      },
      {
        label: "C) Wait until tomorrow evening — don't want to seem too eager",
        value: 'C',
        scoring: { strategy: 'PASSIVE' }
      },
      {
        label: "D) Reply now and suggest the next date while she's feeling it",
        value: 'D',
        scoring: { strategy: 'OVER_INVESTING' }
      }
    ]
  },

  // Q12 - Template 2: "What Happens Next"
  {
    id: 12,
    dimension: 'strategy',
    text: "You've been seeing someone for a month. She mentions an event three weeks out and says 'we should go.' But you haven't had the 'what are we' conversation yet. What do you do?",
    options: [
      {
        label: "A) Say you're in — her planning ahead IS the signal about where this is going",
        value: 'A',
        scoring: { strategy: 'CALIBRATED' }
      },
      {
        label: "B) Say yes but use it as a segue: 'I'd love that — where do you see this going?'",
        value: 'B',
        scoring: { strategy: 'ANXIOUS' }
      },
      {
        label: "C) Hedge: 'Sounds fun, let me check my schedule' — three weeks is a big commitment this early",
        value: 'C',
        scoring: { strategy: 'PASSIVE' }
      },
      {
        label: "D) Say yes and immediately start thinking about how to lock this down",
        value: 'D',
        scoring: { strategy: 'OVER_INVESTING' }
      }
    ]
  },

  // Q13 - Template 1: Forced Trade-Off
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
    ]
  },

  // Q14 - Template 6: Action-Based Reframe
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
    ]
  },

  // Q15 - Template 1: Forced Trade-Off
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
    ]
  }
];
