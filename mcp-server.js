const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/health', (req, res) => {
  res.send({ status: '✅ MCP server is running' });
});

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

app.listen(PORT, () => {
  console.log(`🚀 MCP server is running at http://localhost:${PORT}`);
});
