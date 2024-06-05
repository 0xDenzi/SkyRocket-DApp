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

// Toggle like
app.post('/api/toggleLike', async (req, res) => {
  const { projectTitle, userWalletAddress } = req.body;  // Use consistent naming across frontend and backend
  try {
    const likesCollection = await getCollection('Likes');
    const projectCollection = await getCollection('Project');

    // Check if the like already exists
    const existingLike = await likesCollection.findOne({ projectTitle: projectTitle, userWalletAddress: userWalletAddress });

    if (existingLike) {
      await likesCollection.deleteOne({ projectTitle: projectTitle, userWalletAddress: userWalletAddress });
      await projectCollection.updateOne({ project_title: projectTitle }, { $inc: { likes: -1 } });
      res.json({ newLikeStatus: false });
    } else {
      await likesCollection.insertOne({ projectTitle: projectTitle, userWalletAddress: userWalletAddress, HasLiked: true });
      await projectCollection.updateOne({ project_title: projectTitle }, { $inc: { likes: 1 } });
      res.json({ newLikeStatus: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing toggle like');
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
