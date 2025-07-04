const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Healthcheck for Render or manual check
app.get('/health', (req, res) => {
  res.status(200).send({ status: '✅ MCP server is running' });
});

// ✅ POST endpoint for n8n commands
app.post('/mcp', (req, res) => {
  try {
    const { text1, type, ID, channel } = req.body;

    if (!text1 || !type || !ID || !channel) {
      console.warn('⚠️ Incomplete data from n8n:', req.body);
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('🟢 Received from n8n:', req.body);

    const response = {
      action: 'createContact',
      message: `Creating contact from message: "${text1}"`,
      payload: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890'
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('❌ Error in /mcp POST:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ SSE connection endpoint for n8n MCP Client
app.get('/mcp', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  console.log('🔗 MCP SSE connection opened');

  res.write('event: connected\n');
  res.write('data: MCP SSE connection established\n\n');

  const intervalId = setInterval(() => {
    res.write('event: ping\n');
    res.write('data: keep-alive\n\n');
  }, 25000);

  req.on('close', () => {
    console.log('❌ MCP SSE connection closed');
    clearInterval(intervalId);
    res.end();
  });
});

// ✅ 404 fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// ✅ Graceful startup
app.listen(PORT, () => {
  console.log(`🚀 MCP server running at http://localhost:${PORT}`);
});
