exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const { system, messages } = JSON.parse(event.body);

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing or invalid messages array' })
    };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

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
