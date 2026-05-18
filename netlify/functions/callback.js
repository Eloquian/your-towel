exports.handler = async function(event, context) {
  const { code } = event.queryStringParameters;

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No authorisation code received' })
    };
  }

  const clientId = process.env.MIRO_CLIENT_ID;
  const clientSecret = process.env.MIRO_CLIENT_SECRET;
  const redirectUri = process.env.MIRO_REDIRECT_URI;

  try {
    const response = await fetch('https://api.miro.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Token exchange failed', details: data })
      };
    }

    // Redirect back to the app with the token in the URL fragment
    // Fragment (#) never leaves the browser, so the token stays client-side
    return {
      statusCode: 302,
      headers: {
        Location: `/?token=${data.access_token}&board_id=new`,
        'Cache-Control': 'no-cache'
      },
      body: ''
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error', details: err.message })
    };
  }
};
