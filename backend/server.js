const express = require('express');
const cors = require('cors');
require('dotenv').config();

const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());


app.post('/generate', async (req, res) => {
  const userPrompt = req.body.prompt;
  if (!userPrompt) return res.status(400).json({ error: 'Prompt is empty!' });

  try {
    const response = await fetch('https://magic-backend.onrender.com/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `
You are a mystical storytelling engine, an ancient typewriter that weaves short paragraphs but complete story when a user types a sentence.

ONLY respond with the 2 next paragraph of the story and total 3 paragraphs. DO NOT ask questions, DO NOT talk to the user. Just continue the story in a magical, mysterious tone, full of wonder and narrative power.

Never break character. Never explain. Never stop the story. Never repeat story of same prompt that user gives.`
          },
          {
            role: 'user',
            content: userPrompt
          }
        ]
      })
    });

    const json = await response.json();
    const reply = json.choices?.[0]?.message?.content.trim();

    if (!reply) throw new Error('No response from Hack Club AI');

    res.json({ response: reply });
  } catch (err) {
    console.error('Hack Club AI error:', err.message);
    res.status(500).json({ error: 'Failed to generate story.' });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Magic Typewriter server running on http://localhost:${PORT}`);
});

