ARIN FARAHI ULTRA-LITE + AI

Performance:
- Three.js and GSAP are removed from the initial page.
- Earth fills the hero.
- Horizontal mouse movement rotates the Earth around its own Y axis; it does NOT tilt.
- The Milky Way + hacker scene stays behind the Earth.

AI:
Vercel -> Project -> Settings -> Environment Variables:
OPENAI_API_KEY = your OpenAI API key
OPENAI_MODEL = gpt-5.6-luna (optional)

Never put the API key in index.html.
The browser calls /api/chat and the key stays server-side.
