exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const body = JSON.parse(event.body);
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (body.zone) {
    return handleZoneRequest(body, apiKey);
  }

  const { system, messages } = body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing or invalid messages array' })
    };
  }

  try {
    const requestBody = {
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      messages,
    };
    if (system) {
      requestBody.system = system;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok || !data.content || !data.content[0]) {
      return {
        statusCode: 502,
        body: JSON.stringify({ error: 'Upstream API error', details: data })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Claude API error', details: err.message })
    };
  }
};

async function callClaude(apiKey, system, userContent) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      system,
      messages: [{ role: 'user', content: userContent }]
    })
  });

  const data = await response.json();

  if (!response.ok || !data.content || !data.content[0]) {
    throw new Error(JSON.stringify(data));
  }

  const raw = data.content[0].text;
  const clean = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

async function handleZoneRequest(body, apiKey) {
  const { answers, zone } = body;

  try {
    let result;

    if (zone === 'portrait') {
      result = await callClaude(apiKey,
        `You are a warm, precise prose writer assembling a professional portrait for someone navigating a difficult workplace transition.
Write in second person ("You do your best work when...").
Be specific, use the person's actual words, and write with warmth and quiet confidence.
Never use corporate language. Never use em dashes. British English spelling.
Return ONLY valid JSON in this exact format, no other text:
{
  "bestWork": "one to two sentences about when they do their best work",
  "nonNegotiable": "one to two sentences about what they won't compromise on",
  "headed": "one to two sentences about where they are headed",
  "untried": "one sentence about what they don't want to leave untried"
}`,
        `Assemble a portrait from these answers:

What kind of work made them lose track of time: ${answers.q1 || 'not answered'}
Something they are genuinely proud of: ${answers.q2 || 'not answered'}
What they will not budge on at work: ${answers.q3 || 'not answered'}
What a good day at work feels like: ${answers.q4 || 'not answered'}
What they would kick themselves for never trying: ${answers.q5 || 'not answered'}
Where they would go if it all resolved tomorrow: ${answers.q6 || 'not answered'}
What good looks like in twelve months: ${answers.q7 || 'not answered'}`
      );

    } else if (zone === 'options') {
      result = await callClaude(apiKey,
        `You are a warm, dry, precise writer helping someone map their professional options.
Based on their answers about possible moves and directions, organise their options into four categories.
Return ONLY valid JSON in this exact format, no other text:
{
  "rightNow": [{"label": "short option name", "detail": "one sentence elaboration"}, ...],
  "buildTowards": [{"label": "short option name", "detail": "one sentence elaboration"}, ...],
  "notThoughtAbout": [{"label": "short option name", "detail": "one sentence elaboration"}, ...],
  "currentSituation": [{"label": "short option name", "detail": "one sentence elaboration"}, ...]
}
Each category should have 2-4 options derived from the person's answers. Use their actual words where possible. Be specific and practical.`,
        `Organise these answers into an options map:

Most obvious move: ${answers.z3q1 || 'not answered'}
Option they keep dismissing: ${answers.z3q2 || 'not answered'}
With six months of runway: ${answers.z3q3 || 'not answered'}
One step closer to their direction: ${answers.z3q4 || 'not answered'}
What they would need: ${answers.z3q5 || 'not answered'}
Too ambitious version: ${answers.z3q6 || 'not answered'}
If they knew it would work out: ${answers.z3q7 || 'not answered'}
Option requiring most courage: ${answers.z3q8 || 'not answered'}
Thing they have quietly wanted to try: ${answers.z3q9 || 'not answered'}
What to get from current situation: ${answers.z3q10 || 'not answered'}
Worth changing from inside: ${answers.z3q11 || 'not answered'}
Staying on their terms: ${answers.z3q12 || 'not answered'}`
      );

    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Unknown zone' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Claude API error', details: err.message })
    };
  }
}
