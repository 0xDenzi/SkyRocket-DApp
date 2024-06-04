const express = require('express');
const cors = require('cors');
const { getCollection } = require('./db'); // Adjust the path if needed

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for your React frontend

app.get('/api/proposals', async (req, res) => {
  try {
    const collection = await getCollection('Project');
    const proposals = await collection.find({}).toArray();
    res.json(proposals);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data from the database');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
