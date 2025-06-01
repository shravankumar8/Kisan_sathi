const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/v3/inference/chat', async (req, res) => {
  try {
    const { user_id, agent_id, session_id, message } = req.body;

    // Validate required fields
    if (!user_id || !agent_id || !session_id || !message) {
      return res.status(400).json({ error: 'Missing required fields: user_id, agent_id, session_id, and message are required' });
    }

    // Forward the request to the external API
    const externalApiResponse = await axios.post(
      'https://agent-prod.studio.lyzr.ai/v3/inference/chat/',
      {
        user_id,
        agent_id,
        session_id,
        message,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'sk-default-kKtXYeA4rpMOdv1mJCpeUGvN9ck8Yg8H',
        },
      }
    );

    // Send the full response from the external API to the frontend
    res.json(externalApiResponse.data);
  } catch (error) {
    console.error('Error forwarding request to external API:', error);
    res.status(500).json({ error: 'Failed to process the request' });
  }
});

module.exports = router;