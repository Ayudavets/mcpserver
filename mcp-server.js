const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/health', (req, res) => {
  res.send({ status: '✅ MCP server is running' });
});

// POST endpoint for commands from n8n
app.post('/mcp', (req, res) => {
  const { text1, type, ID, channel } = req.body;

  console.log('🟢 Received from n8n:', req.body);

  const response = {
    action: 'createContact',
    message: `Creating contact from message: "${text1}"`,
    payload: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
    }
  };

  res.status(200).json(response);
});

// GET endpoint for SSE (used by n8n to open connection)
app.get('/mcp', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  console.log('🔗 MCP SSE connection opened');

  // Send an initial dummy event
  res.write('event: connected\n');
  res.write('data: MCP SSE connection established\n\n');

  // Keep connection alive every 25 seconds
  const intervalId = setInterval(() => {
    res.write('event: ping\n');
    res.write('data: keep-alive\n\n');
  }, 25000);

  // Handle disconnection
  req.on('close', () => {
    console.log('❌ MCP SSE connection closed');
    clearInterval(intervalId);
    res.end();
  });
});

app.listen(PORT, () => {
  console.log(`🚀 MCP server is running at http://localhost:${PORT}`);
});
