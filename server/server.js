const express = require('express');
const cors = require('cors');
const { ObjectId } = require('mongodb');
const { getCollection } = require('./db'); // Adjust the path if needed

const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://localhost:3001', // Adjust if your frontend address differs
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));
 // Enable CORS for your React frontend
app.use(express.json()); // Middleware to parse JSON bodies

// Get all proposals
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



// Assuming this is part of your express route handler:
app.get('/api/proposals/:id', async (req, res) => {
  try {
    const collection = await getCollection('Project');
    // Use new to instantiate ObjectId
    const proposal = await collection.findOne({_id: new ObjectId(req.params.id)});
    if (!proposal) {
      return res.status(404).send('Proposal not found');
    }
    res.json(proposal);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching proposal');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
