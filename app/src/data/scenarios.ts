import { Scenario } from '../types';

// ─────────────────────────────────────────────
// Signal Theory — Scenario Seed Data
// 15 scenarios covering texting, in-person, app-based
// ─────────────────────────────────────────────

export const SCENARIOS: Scenario[] = [
  // ── 1. Late Night Text ──────────────────────
  {
    id: 'scenario-001',
    title: 'Late Night Text',
    body:
      "You had a first date three days ago. It went well — dinner, two hours, easy conversation. Tonight at 11:15 PM she texts: \"Hey what are you up to?\" No context, no callback to the date. Just the check-in.",
    options: [
      {
        text: 'Reply casually, stay brief. \"Just winding down. You?\"',
        is_correct: true,
        explanation:
          'Late-night texts after a date are a signal of mild interest, not a booty call unless escalated. Staying brief and curious keeps the dynamic balanced. You respond, but you don\'t overextend.',
      },
      {
        text: 'Suggest making plans: \"Not much — we should grab drinks this week.\"',
        is_correct: false,
        explanation:
          'Reasonable but slightly premature. She hasn\'t indicated the text is about planning — it\'s a loose check-in. Pivoting straight to plans can feel like pressure.',
      },
      {
        text: 'Don\'t reply tonight. Respond in the morning.',
        is_correct: false,
        explanation:
          'Overthinking the timing. A casual late-night reply doesn\'t signal desperation. Waiting until morning to "play it cool" is a game — and most women notice.',
      },
      {
        text: 'Send a long reply about how much you enjoyed the date.',
        is_correct: false,
        explanation:
          'Over-investing at the first opportunity. She asked a casual question. A wall of enthusiasm rewrites the dynamic in her favor before it\'s established.',
      },
    ],
    correct_signal_state: 'NEUTRAL',
    category: 'texting',
    difficulty: 'basic',
    target_dimensions: ['signal_reading', 'strategy'],
    target_profiles: ['rusty-romantic', 'over-analyst'],
  },

  // ── 2. Delayed Response Pattern ─────────────
  {
    id: 'scenario-002',
    title: 'Delayed Response Pattern',
    body:
      "For the first two weeks after matching, she replied within 30-60 minutes — curious questions, emojis, real engagement. In the last 10 days, responses have gone to 6-8 hours with shorter content. The last two messages from her were single sentences.",
    options: [
      {
        text: 'Slow your own replies to match her pace. Don\'t initiate for a few days.',
        is_correct: true,
        explanation:
          'When engagement drops, matching energy is the calibrated response. Over-pursuing a cooling signal is the most common mistake. Pulling back tests whether her pace is situational (busy) or directional (fading).',
      },
      {
        text: 'Send a playful, high-effort message to re-engage her.',
        is_correct: false,
        explanation:
          'High effort against declining signal is the classic over-investment trap. You\'re trying to earn what used to come freely. This rarely works and often accelerates the fade.',
      },
      {
        text: 'Ask her directly: \"Have I done something wrong?\"',
        is_correct: false,
        explanation:
          'Needy framing. This makes her behavior about your anxiety rather than her interest level. It also forces a conversation she may not be ready to have, and puts pressure on her to manage your feelings.',
      },
      {
        text: 'Send a series of messages to fill the silence.',
        is_correct: false,
        explanation:
          'Double or triple texting against a slow-fade is the fastest way to eliminate yourself from consideration. It signals low self-awareness about the dynamic.',
      },
    ],
    correct_signal_state: 'NEGATIVE',
    category: 'texting',
    difficulty: 'intermediate',
    target_dimensions: ['signal_reading'],
    target_profiles: ['rusty-romantic', 'signal-blind'],
  },

  // ── 3. Post-Date Follow Up ───────────────────
  {
    id: 'scenario-003',
    title: 'Post-Date Follow Up',
    body:
      "You had a solid second date — dinner and a walk. You text the next afternoon: \"That was fun, let's do it again.\" She replies two hours later: \"Yeah it was fun! :)\" She doesn't suggest a time, day, or plan. That's the full reply.",
    options: [
      {
        text: 'Wait 2-3 days, then send a specific invite: \"Free Thursday or Saturday?\"',
        is_correct: true,
        explanation:
          'She confirmed enjoyment but didn\'t invest in logistics. That\'s a soft green light — interest exists but she\'s waiting for you to lead. A specific, low-pressure ask a few days out is the right move.',
      },
      {
        text: 'Reply immediately: \"Great! How about this weekend?\"',
        is_correct: false,
        explanation:
          'Not terrible, but jumping immediately signals you were waiting. The pause before a specific ask makes the invitation feel intentional rather than eager.',
      },
      {
        text: 'Take her non-commitment as a sign she\'s not interested.',
        is_correct: false,
        explanation:
          'Overly pessimistic reading. Many women confirm interest without driving logistics — especially early. Absence of a plan from her side doesn\'t mean absence of interest.',
      },
      {
        text: 'Send increasingly enthusiastic messages about how much you want to see her.',
        is_correct: false,
        explanation:
          'She gave a warm but minimal response. Escalating enthusiasm beyond what she\'s offered is textbook over-investment. It shifts the power dynamic unnecessarily.',
      },
    ],
    correct_signal_state: 'NEUTRAL',
    category: 'texting',
    difficulty: 'basic',
    target_dimensions: ['signal_reading', 'strategy'],
    target_profiles: ['over-analyst', 'signal-blind'],
  },

  // ── 4. Clear Interest ────────────────────────
  {
    id: 'scenario-004',
    title: 'Clear Interest',
    body:
      "On your third date she initiates most of the conversation, asks about your family, your work, and where you see yourself in five years. She laughs at your jokes before the punchline lands. At the end she says \"We should go to that festival next month\" while looking at her phone for the date.",
    options: [
      {
        text: 'Say yes, be specific: \"Let\'s do it. I\'ll grab tickets this week.\"',
        is_correct: true,
        explanation:
          'This is a clear POSITIVE signal stack — investment questions, genuine laughter, and she\'s planning future dates. Accept the invitation warmly and concretely. Vagueness here misreads what she\'s offering.',
      },
      {
        text: 'Play it cool: \"Maybe, I\'ll check my schedule.\"',
        is_correct: false,
        explanation:
          'She\'s showing real interest and you\'re manufacturing distance. Calibrated interest doesn\'t mean being cold to someone who\'s genuinely warm. You\'ll read as either unavailable or uninterested.',
      },
      {
        text: 'Say yes, then wait a week before following up about tickets.',
        is_correct: false,
        explanation:
          'She made a specific future-date suggestion — not a general "we should hang out." Letting it sit a week introduces ambiguity that doesn\'t serve you.',
      },
      {
        text: 'Assume she\'s just being friendly and don\'t act on it.',
        is_correct: false,
        explanation:
          'She asked investment questions, planned a future event, and was physically engaged. Reading all of this as "just friendly" is signal blindness at work.',
      },
    ],
    correct_signal_state: 'POSITIVE',
    category: 'in-person',
    difficulty: 'basic',
    target_dimensions: ['signal_reading'],
    target_profiles: ['over-analyst', 'signal-blind'],
  },

  // ── 5. App Match Goes Quiet ──────────────────
  {
    id: 'scenario-005',
    title: 'App Match Goes Quiet',
    body:
      "You matched on Hinge two weeks ago. Two days of strong back-and-forth — she asked questions, shared personal things, laughed via text. Then on day three: nothing. You sent one follow-up three days later. Seen, no reply. It's been a week.",
    options: [
      {
        text: 'Move on. She\'s had the message and chosen not to reply.',
        is_correct: true,
        explanation:
          'Two weeks of silence after a seen message is a clear signal. The app conversation, regardless of quality, didn\'t convert to real-world interest. Sending another message doesn\'t change that — it only changes how you\'re perceived.',
      },
      {
        text: 'Send a low-key message: \"Figured I\'d give it one more shot — coffee?\"',
        is_correct: false,
        explanation:
          'This feels self-aware but still violates the principle: she\'s already seen your last message. Another message doesn\'t give her new information. It signals you haven\'t read the silence.',
      },
      {
        text: 'Send something funny or unusual to stand out.',
        is_correct: false,
        explanation:
          'Creative effort against a week of deliberate silence is misread signal. She\'s not waiting for better content — she\'s made a decision. Effort here reads as not accepting it.',
      },
      {
        text: 'Unmatch and send a message on another platform.',
        is_correct: false,
        explanation:
          'Finding her elsewhere to pursue someone who\'s been silent crosses a line. It signals poor boundary awareness and will not land well.',
      },
    ],
    correct_signal_state: 'NEGATIVE',
    category: 'app-based',
    difficulty: 'basic',
    target_dimensions: ['signal_reading'],
    target_profiles: ['rusty-romantic', 'over-analyst'],
  },

  // ── 6. Physical Touch Test ───────────────────
  {
    id: 'scenario-006',
    title: 'Physical Touch Test',
    body:
      "You're on a second date at a wine bar. During conversation she touches your forearm three times while making a point, once while laughing, and puts her hand briefly on your shoulder when she excuses herself to the restroom. She's maintaining steady eye contact throughout.",
    options: [
      {
        text: 'Reciprocate proportionally — touch her hand briefly when you make a point.',
        is_correct: true,
        explanation:
          'She\'s initiating physical contact consistently and maintaining it with eye contact. That\'s a clear interest signal. Reciprocating in kind (not exceeding) establishes the dynamic as mutual and comfortable.',
      },
      {
        text: 'Don\'t touch back — let her lead, don\'t assume.',
        is_correct: false,
        explanation:
          'Reading this signal and choosing inaction leaves her doing all the work. Reciprocating isn\'t assuming — it\'s responding to what she\'s communicated clearly.',
      },
      {
        text: 'Immediately escalate to holding her hand.',
        is_correct: false,
        explanation:
          'The touches were casual contact during conversation, not escalation invitations. Jumping to hand-holding without a gradual progression misreads the pace.',
      },
      {
        text: 'Interpret the touching as friendly, since it\'s only a second date.',
        is_correct: false,
        explanation:
          'Repeated purposeful touch with sustained eye contact is a POSITIVE signal regardless of date number. Waiting for a specific date count to "allow" interest is a pattern from overthinking.',
      },
    ],
    correct_signal_state: 'POSITIVE',
    category: 'in-person',
    difficulty: 'intermediate',
    target_dimensions: ['signal_reading', 'readiness'],
    target_profiles: ['over-analyst', 'signal-blind'],
  },

  // ── 7. Cancel and Reschedule ─────────────────
  {
    id: 'scenario-007',
    title: 'Cancel and Reschedule',
    body:
      "You have a first date planned for Saturday. On Thursday she texts: \"Hey, I'm really sorry — something came up at work and I have to cancel Saturday. Are you free Tuesday instead? I'd really like to meet.\"",
    options: [
      {
        text: 'Confirm Tuesday. She cancelled but immediately offered an alternative.',
        is_correct: true,
        explanation:
          'This is a POSITIVE signal despite the cancellation. The immediate reschedule, the apology, and the explicit \"I\'d really like to meet\" are all investment behaviors. She didn\'t just cancel — she preserved the plan.',
      },
      {
        text: 'Say you\'ll check and get back to her, to avoid seeming too available.',
        is_correct: false,
        explanation:
          'She\'s showing clear interest and you\'re manufacturing distance for game reasons. This doesn\'t make you seem more valuable — it makes you seem passive or disinterested.',
      },
      {
        text: 'Express disappointment: \"That\'s a bummer, I was looking forward to Saturday.\"',
        is_correct: false,
        explanation:
          'Technically true, but leading with disappointment over a rescheduled first date adds emotional weight to a logistical change. Confirm the new plan cleanly.',
      },
      {
        text: 'Treat it as a red flag — she may cancel again.',
        is_correct: false,
        explanation:
          'One work-related cancellation with same-message reschedule is not a red flag. Pattern-reading from a single data point, especially when she invested in preserving the plan, is misread signal.',
      },
    ],
    correct_signal_state: 'POSITIVE',
    category: 'texting',
    difficulty: 'basic',
    target_dimensions: ['signal_reading'],
    target_profiles: ['over-analyst', 'rusty-romantic'],
  },

  // ── 8. Cancel No Reschedule ──────────────────
  {
    id: 'scenario-008',
    title: 'Cancel Without Rescheduling',
    body:
      "You have a first date planned for Friday. She texts Thursday morning: \"Hey — I'm so sorry, I have to cancel. Things are really hectic right now. Let's do it another time!\" No specific day, no \"when are you free,\" no follow-up question.",
    options: [
      {
        text: 'Reply graciously, then don\'t follow up. Let her reschedule if she wants.',
        is_correct: true,
        explanation:
          'A cancellation without a reschedule attempt is a NEGATIVE signal. She kept the door nominally open (\"another time\") but invested zero effort in making it happen. The calibrated response is warmth without pursuit. If she\'s interested, she\'ll follow through.',
      },
      {
        text: 'Suggest a specific alternative day in your reply.',
        is_correct: false,
        explanation:
          'You\'d be doing the rescheduling work she chose not to do. This is the moment to observe whether she initiates — not to paper over the signal with effort.',
      },
      {
        text: 'Send a follow-up in a week: \"Still want to grab that drink?\"',
        is_correct: false,
        explanation:
          'One follow-up isn\'t terrible in isolation, but she cancelled without rescheduling — that\'s a clear de-prioritization signal. Chasing after that doesn\'t change the underlying dynamic.',
      },
      {
        text: 'Tell her you\'re disappointed and she should have more respect for your time.',
        is_correct: false,
        explanation:
          'Even if the feeling is valid, expressing it to someone you\'ve never met is disproportionate. It reads as emotional volatility, not confidence.',
      },
    ],
    correct_signal_state: 'NEGATIVE',
    category: 'texting',
    difficulty: 'intermediate',
    target_dimensions: ['signal_reading', 'strategy'],
    target_profiles: ['rusty-romantic', 'signal-blind'],
  },

  // ── 9. Breadcrumbing ────────────────────────
  {
    id: 'scenario-009',
    title: 'Breadcrumbing',
    body:
      "You matched two months ago and had one good conversation that didn't convert to a date. Since then: she likes your Instagram posts regularly, occasionally reacts to your stories with fire emojis, but has not initiated a text or replied to your last two low-key messages.",
    options: [
      {
        text: 'Remove passive engagement from your calculus. She hasn\'t texted — treat it as disinterest.',
        is_correct: true,
        explanation:
          'Social media reactions cost nothing and mean little in isolation. She\'s not texting, not replying, not initiating plans. The likes are ambient noise, not signal. Acting on them is the breadcrumbing trap.',
      },
      {
        text: 'Reach out one more time referencing a story reaction: \"Glad that one landed for you — still up for coffee?\"',
        is_correct: false,
        explanation:
          'You\'ve already sent two unanswered messages. A third doesn\'t change her interest level — it only changes your read of the situation, and not for the better.',
      },
      {
        text: 'Post more interesting content to increase her engagement.',
        is_correct: false,
        explanation:
          'The goal isn\'t to generate more likes — it\'s a date. Optimizing your content feed to attract someone who won\'t reply to direct messages is misdirected effort.',
      },
      {
        text: 'Block her to stop the distraction.',
        is_correct: false,
        explanation:
          'Disproportionate response. Unfollowing or muting is reasonable if the engagement is distracting. Blocking sends a message that isn\'t warranted by passive social media behavior.',
      },
    ],
    correct_signal_state: 'NEGATIVE',
    category: 'app-based',
    difficulty: 'intermediate',
    target_dimensions: ['signal_reading'],
    target_profiles: ['rusty-romantic', 'signal-blind'],
  },

  // ── 10. The Slow Fade ────────────────────────
  {
    id: 'scenario-010',
    title: 'The Slow Fade',
    body:
      "You've been texting someone you met at a friend's party for two weeks. The first week: daily texts, long conversations, two calls. Week two: every other day, shorter messages, one call that ended abruptly. This week: two messages in five days, both one-liners. You initiated both.",
    options: [
      {
        text: 'Stop initiating. If she wants to continue, she knows where to find you.',
        is_correct: true,
        explanation:
          'The data pattern is clear: frequency down, depth down, you\'re doing all the initiating. That\'s a slow fade. Continuing to chase it prolongs something that\'s already ending. Stop initiating and let the outcome reveal itself.',
      },
      {
        text: 'Ask her directly: \"Are we still interested in this?\"',
        is_correct: false,
        explanation:
          'Forcing a DTR two weeks in after a party meeting is more pressure than clarity. If the fade is real, she\'ll feel obligated to explain something she may not have words for yet.',
      },
      {
        text: 'Plan a date immediately to create forward momentum.',
        is_correct: false,
        explanation:
          'Planning a date against declining engagement is a Hail Mary. If the fade is intentional, your enthusiasm won\'t reverse it — it will accelerate her withdrawal.',
      },
      {
        text: 'Continue initiating — you\'ve invested two weeks and shouldn\'t give up easily.',
        is_correct: false,
        explanation:
          'Sunk cost reasoning. Two weeks of investment doesn\'t obligate her to continue, and it doesn\'t change what the signal is telling you. Continuing to invest against a fade signal only costs you more.',
      },
    ],
    correct_signal_state: 'NEGATIVE',
    category: 'texting',
    difficulty: 'intermediate',
    target_dimensions: ['signal_reading', 'strategy'],
    target_profiles: ['rusty-romantic', 'signal-blind'],
  },

  // ── 11. Mixed Signals Date ───────────────────
  {
    id: 'scenario-011',
    title: 'Mixed Signals After Great Date',
    body:
      "Your third date was by far the best — two bottles of wine, great conversation until midnight, she kissed you goodnight and said \"I had the best time.\" The next day you text, she replies warmly. But for the following week, texts have been slow, polite, and surface-level. Nothing that builds on what happened.",
    options: [
      {
        text: 'Invite her to something specific and low-pressure. One more data point before drawing conclusions.',
        is_correct: true,
        explanation:
          'This is genuinely ambiguous: strong in-person connection, but the post-date text behavior isn\'t matching. The data is insufficient to write it off. One direct invitation gives you a clean signal: she either accepts eagerly, accepts politely, or declines. Any of those tells you more than the current noise.',
      },
      {
        text: 'Assume she\'s lost interest and stop texting.',
        is_correct: false,
        explanation:
          'Too fast. One great date followed by a slow week doesn\'t override the pattern that led to it. Life gets in the way. Without a direct data point, you\'re pattern-matching on anxiety.',
      },
      {
        text: 'Tell her you\'ve noticed the shift and ask what\'s going on.',
        is_correct: false,
        explanation:
          'Reasonable intent but premature execution. Having a \"what changed\" conversation after one week of slow texts adds pressure to something still finding its footing.',
      },
      {
        text: 'Send more messages to recreate the energy of the date.',
        is_correct: false,
        explanation:
          'You can\'t text your way back to a good in-person moment. Overloading the chat with effort when she\'s already running slower will read as pressure.',
      },
    ],
    correct_signal_state: 'AMBIGUOUS',
    category: 'texting',
    difficulty: 'advanced',
    target_dimensions: ['signal_reading', 'strategy'],
    target_profiles: ['over-analyst', 'rusty-romantic'],
  },

  // ── 12. Direct Ask ───────────────────────────
  {
    id: 'scenario-012',
    title: 'She Asks What You\'re Looking For',
    body:
      "You're on a second date and the conversation goes deeper than expected. After talking about her own post-divorce experience, she looks at you directly and asks: \"So what are you actually looking for? Like, are you dating casually or do you want something real?\"",
    options: [
      {
        text: 'Be direct and honest: \"Something real, when it\'s right. I\'m not rushing it, but I\'m not interested in just filling time either.\"',
        is_correct: true,
        explanation:
          'This question is an investment signal — she\'s disclosing and asking for reciprocal honesty. A direct, grounded answer shows self-awareness and isn\'t performative. The answer given is honest without being a proposal. It also filters: if she\'s looking for something casual only, you\'ve just found out.',
      },
      {
        text: 'Deflect: \"I\'m just seeing how things go, no real agenda.\"',
        is_correct: false,
        explanation:
          'This answer is designed to avoid commitment, but to a woman who just asked a direct question about intention, it reads as evasive. It signals you haven\'t thought about what you want, or that you\'re hiding it.',
      },
      {
        text: 'Tell her exactly what you want in a relationship — all of it.',
        is_correct: false,
        explanation:
          'She asked a real question that deserves a real answer — not a relationship requirements list. Oversharing your complete vision on date two reads as pressure regardless of how sincerely it\'s meant.',
      },
      {
        text: 'Turn it back on her: \"What are YOU looking for?\"',
        is_correct: false,
        explanation:
          'She just shared something vulnerable and asked you directly. Deflecting the question back to her reads as avoidance. Answer the question, then ask it back.',
      },
    ],
    correct_signal_state: 'POSITIVE',
    category: 'in-person',
    difficulty: 'advanced',
    target_dimensions: ['readiness', 'strategy'],
    target_profiles: ['over-analyst', 'ready-navigator'],
  },

  // ── 13. Social Media Lurker ──────────────────
  {
    id: 'scenario-013',
    title: 'Social Media Lurker',
    body:
      "You met briefly at a networking event a month ago. You connected on Instagram. Since then she views every story you post within minutes and occasionally reacts with emojis — a laugh, a fire. You sent her a low-key DM two weeks ago: \"Hey, good to connect. Let me know if you ever want to grab a coffee.\" She left it on read.",
    options: [
      {
        text: 'Treat the non-reply as a no. Story views don\'t translate to interest in meeting.',
        is_correct: true,
        explanation:
          'Story views are passive, free behaviors. She chose not to reply to a direct, low-pressure invitation. That\'s the meaningful data point. Interpreting continued passive engagement as interest is the social media attention trap.',
      },
      {
        text: 'Send another DM — she may have forgotten or missed it.',
        is_correct: false,
        explanation:
          'She views your stories within minutes. She saw the message. Following up on a read DM she chose not to answer doesn\'t land as persistence — it lands as not reading the signal.',
      },
      {
        text: 'Post more interesting content and see if she initiates.',
        is_correct: false,
        explanation:
          'Content optimization as a dating strategy is a loop that rarely ends in a date. You made a direct ask and she didn\'t respond. More content doesn\'t change that dynamic.',
      },
      {
        text: 'Comment on her content to stay visible.',
        is_correct: false,
        explanation:
          'Public commenting on her content after she didn\'t reply to your DM is visible to everyone and reads as low-awareness pursuit. It doesn\'t change the signal.',
      },
    ],
    correct_signal_state: 'AMBIGUOUS',
    category: 'app-based',
    difficulty: 'intermediate',
    target_dimensions: ['signal_reading'],
    target_profiles: ['signal-blind', 'rusty-romantic'],
  },

  // ── 14. Flirty But Unavailable ───────────────
  {
    id: 'scenario-014',
    title: 'Flirty But Always Busy',
    body:
      "You've been texting for three weeks after matching. The chemistry is real — witty, warm, occasionally flirty. Every time you suggest a specific plan she says something like \"I wish! I'm swamped this week\" or \"my schedule is insane right now.\" She's said this six times. She always keeps texting after.",
    options: [
      {
        text: 'Name the pattern once, clearly: \"Seems like timing is tough. I\'ll leave the door open — reach out when things clear up.\" Then stop initiating plans.',
        is_correct: true,
        explanation:
          'Six rejections of specific plans over three weeks is a AMBIGUOUS-to-NEGATIVE signal. The continued texting keeps the emotional connection alive without committing to anything real. Naming the pattern without anger gives her an honest exit and protects your time.',
      },
      {
        text: 'Keep suggesting plans — the right timing will eventually work.',
        is_correct: false,
        explanation:
          'You\'ve been rejected six times on logistics. Suggesting a seventh time isn\'t persistent — it\'s not reading the signal. The issue may not be timing.',
      },
      {
        text: 'Tell her you\'re starting to feel like she\'s stringing you along.',
        is_correct: false,
        explanation:
          'Even if the feeling is accurate, saying this positions you as emotionally vulnerable and reactive after three weeks of texts. It\'s more likely to end things awkwardly than to prompt honesty.',
      },
      {
        text: 'Offer to fit into her schedule: \"I\'m flexible — whenever works for you.\"',
        is_correct: false,
        explanation:
          'Over-accommodation to someone who\'s repeatedly unavailable removes all structure. \"Whenever works for you\" puts the ball entirely in her court and signals you\'ll reorganize your life around her. That\'s not attractive.',
      },
    ],
    correct_signal_state: 'AMBIGUOUS',
    category: 'texting',
    difficulty: 'advanced',
    target_dimensions: ['signal_reading', 'strategy'],
    target_profiles: ['rusty-romantic', 'signal-blind'],
  },

  // ── 15. Re-engage After Silence ─────────────
  {
    id: 'scenario-015',
    title: 'She Texts After 3-Week Silence',
    body:
      "You had two good dates but she went quiet for three weeks after you suggested a third. No explanation, no reply. Out of nowhere today she texts warmly: \"Hey stranger! How have you been? I've been thinking about you.\" Exclamation point, positive energy.",
    options: [
      {
        text: 'Reply warmly but briefly. If she\'s re-engaging, make her put in some work: let her explain the gap before you plan anything.',
        is_correct: true,
        explanation:
          'This is a NEUTRAL reboot signal, not a POSITIVE one. She disappeared for three weeks after being invited on a third date. A warm re-entry deserves a warm reply — but not full reinvestment without acknowledging what happened. Let her say more before you start making plans.',
      },
      {
        text: 'Reply enthusiastically and suggest seeing each other this weekend.',
        is_correct: false,
        explanation:
          'You\'re jumping to logistics for someone who just ghosted for three weeks. You\'re rewarding the disappearance with immediate availability. Even if you\'re interested, that dynamic doesn\'t serve you.',
      },
      {
        text: 'Ignore the message — she had her chance.',
        is_correct: false,
        explanation:
          'Possible, but not necessarily the best read. Life is complicated. A blanket \"she\'s dead to me\" response closes off something that might have a reasonable explanation. But you\'re also not obligated to jump back in.',
      },
      {
        text: 'Ask immediately: \"What happened? Why did you go quiet?\"',
        is_correct: false,
        explanation:
          'Asking directly before any rapport is re-established turns her re-engagement into a hearing. It signals you\'ve been waiting, upset, and ready to address it — which cedes power. Get a feel for the conversation first.',
      },
    ],
    correct_signal_state: 'NEUTRAL',
    category: 'texting',
    difficulty: 'advanced',
    target_dimensions: ['signal_reading', 'strategy', 'readiness'],
    target_profiles: ['rusty-romantic', 'over-analyst'],
  },
];

export default SCENARIOS;
