# Don't Panic
**A Hitchhiker's Self-Assessment**
*For people who find themselves between places.*

---

## Deploying to Netlify

### 1. Push to GitHub
Create a new repo and push this project to it.

### 2. Connect to Netlify
In Netlify, click **Add new site > Import an existing project** and connect your GitHub repo.

Netlify will auto-detect the build settings from `netlify.toml`:
- Build command: `npm run build`
- Publish directory: `build`
- Functions directory: `netlify/functions`

### 3. Set your API key
In the Netlify dashboard, go to **Site configuration > Environment variables** and add:

```
ANTHROPIC_API_KEY = your-key-here
```

### 4. Deploy
Trigger a deploy. Everything should work.

---

## Local development

```bash
npm install
npm start
```

For local testing of the Netlify function, install the Netlify CLI:

```bash
npm install -g netlify-cli
netlify dev
```

This runs both the React app and the serverless function locally, with your environment variables read from a `.env` file:

```
ANTHROPIC_API_KEY=your-key-here
```

---

## Project structure

```
dont-panic/
├── netlify/
│   └── functions/
│       └── claude.js        # Serverless proxy for Anthropic API
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── Background.js    # Nebula + stars
│   ├── hooks/
│   │   └── useApi.js        # API calls + prompt assembly
│   ├── zones/
│   │   ├── Zone0.js         # Ground
│   │   ├── Zone1.js         # Empathise (branching)
│   │   ├── Zone2.js         # Define + Portrait
│   │   ├── Zone3.js         # Ideate + Options map
│   │   ├── Zone4.js         # Prototype + Prepared positions
│   │   └── Zone5.js         # Test + Action brief
│   ├── App.js               # Orchestration + state
│   ├── styles.css           # Full visual identity
│   └── index.js
├── netlify.toml
└── package.json
```
