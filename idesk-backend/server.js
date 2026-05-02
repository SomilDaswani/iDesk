require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/create-web-call', async (req, res) => {
  try {
    const response = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RETELL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        agent_id: process.env.RETELL_AGENT_ID
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create web call' });
  }
});

app.listen(3000, () => {
  console.log('iDesk backend running on port 3000');
});