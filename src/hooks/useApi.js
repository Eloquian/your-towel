export async function assembleWithClaude(systemPrompt, userPrompt) {
  const response = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    throw new Error('API call failed');
  }

  const data = await response.json();
  return data.content?.[0]?.text || '';
}

export async function assemblePortrait(answers) {
  const system = `You are a warm, precise prose writer assembling a professional portrait for someone navigating a difficult workplace transition. 
Write in second person ("You do your best work when..."). 
Be specific, use the person's actual words, and write with warmth and quiet confidence.
Never use corporate language. Never use em dashes. British English spelling.
Return ONLY the four portrait elements in this exact JSON format, no other text:
{
  "bestWork": "one to two sentences about when they do their best work",
  "nonNegotiables": "one to two sentences about what they won't compromise on",
  "direction": "one to two sentences about where they are headed",
  "untried": "one sentence about what they don't want to leave untried"
}`;

  const user = `Assemble a portrait from these answers:

What kind of work made them lose track of time: ${answers.q1 || 'not answered'}
What did people who rated them most highly say: ${answers.q2 || 'not answered'}
A piece of work they are genuinely proud of: ${answers.q3 || 'not answered'}
What they will not compromise on: ${answers.q4 || 'not answered'}
What environment brings out their best: ${answers.q5 || 'not answered'}
What they want people to say about working with them: ${answers.q6 || 'not answered'}
What they would move towards professionally: ${answers.q7 || 'not answered'}
What they would regret not having tried: ${answers.q8 || 'not answered'}
What good looks like in twelve months: ${answers.q9 || 'not answered'}`;

  const raw = await assembleWithClaude(system, user);
  try {
    const clean = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    return {
      bestWork: raw,
      nonNegotiables: '',
      direction: '',
      untried: '',
    };
  }
}

export async function assembleOptionsMap(answers, portrait) {
  const system = `You are a warm, dry, precise writer assembling a summary of someone's options map.
Write in second person. Be specific. Use their actual language where possible.
Return ONLY valid JSON, no other text, in this format:
{
  "summary": "two to three sentences summarising the range of options they have named",
  "mostInteresting": "one sentence naming the option that feels most alive or surprising"
}`;

  const user = `Portrait context:
${JSON.stringify(portrait)}

Their options:
Obvious move: ${answers.q1 || 'not answered'}
Option they keep dismissing: ${answers.q2 || 'not answered'}
With six months runway: ${answers.q3 || 'not answered'}
Small step forward: ${answers.q4 || 'not answered'}
What they need: ${answers.q5 || 'not answered'}
Too ambitious version: ${answers.q6 || 'not answered'}
If they knew it would work out: ${answers.q7 || 'not answered'}
Option requiring most courage: ${answers.q8 || 'not answered'}
Thing quietly wanted to try: ${answers.q9 || 'not answered'}
What to get from HCL: ${answers.q10 || 'not answered'}
Worth changing from inside: ${answers.q11 || 'not answered'}
Staying on their terms: ${answers.q12 || 'not answered'}`;

  const raw = await assembleWithClaude(system, user);
  try {
    const clean = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    return { summary: raw, mostInteresting: '' };
  }
}
