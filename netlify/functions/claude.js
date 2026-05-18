exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const { answers, zone } = JSON.parse(event.body);

  if (!answers || !zone) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing answers or zone' })
    };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  const prompts = {
    portrait: `You are writing a professional portrait for someone navigating a difficult workplace transition. They have answered a series of reflective questions. Your job is to assemble their answers into four short, crafted prose statements that feel like a mirror held up to them — warm, precise, and entirely in their own spirit.

The four elements are:
1. I do my best work when — drawn from their answers about the work that absorbed them, what they are proud of, and what a good day feels like
2. What I won't compromise on — drawn from their answer about their non-negotiable
3. Where I'm headed — drawn from their answers about direction and what good looks like in twelve months
4. What I don't want to leave untried — drawn from their answer about what they would kick themselves for never having tried

Rules:
- Each element is one to three sentences maximum
- Write in first person
- Use their own words and phrases wherever possible
- Do not interpret or add meaning they did not express
- Do not use corporate language or therapy language
- The tone is calm, clear, and quietly confident
- Return only a JSON object with keys: bestWork, nonNegotiable, headed, untried

Here are their answers:
${JSON.stringify(answers, null, 2)}

Return only valid JSON. No preamble, no explanation, no markdown.`,

    options: `You are helping someone map their professional options during a difficult transition. They have completed a portrait of themselves and answered questions about what they could do. Your job is to organise their raw answers into a clean options map — grouping similar ideas, surfacing the most substantive ones, and giving each a short plain-English label.

Rules:
- Do not invent options they did not mention
- Do not filter out options that seem unlikely — include everything
- Give each option a label of three to six words maximum
- Group them into: Right now, Build towards, Haven't let myself think about, Current situation
- Return only a JSON object with keys: rightNow, buildTowards, notThoughtAbout, currentSituation — each an array of objects with keys: label, detail
- No preamble, no explanation, no markdown

Here are their answers:
${JSON.stringify(answers, null, 2)}

Return only valid JSON.`
  };

  const prompt = prompts[zone];

  if (!prompt) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Unknown zone' })
    };
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok || !data.content || !data.content[0]) {
      return {
        statusCode: 502,
        body: JSON.stringify({ error: 'Upstream API error', details: data })
      };
    }

    const text = data.content[0].text;

    // Strip any markdown fences just in case
    const clean = text.replace(/```json\n?|```/g, '').trim();
    const parsed = JSON.parse(clean);

    return {
      statusCode: 200,
      body: JSON.stringify(parsed)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Claude API error', details: err.message })
    };
  }
};
