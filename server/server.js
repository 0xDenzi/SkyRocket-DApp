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

// Endpoint to update the project goal amount
app.post('/api/fund/updateGoal', async (req, res) => {
  const { newGoal } = req.body;
  const collection = await getCollection('Fund');
  try {
    await collection.updateOne({}, { $set: { proj_goal_amount: parseInt(newGoal, 10) } });
    res.status(200).send('Goal amount updated successfully');
  } catch (error) {
    console.error('Error updating goal amount:', error);
    res.status(500).send('Error updating goal amount');
  }
});

// Endpoint to extend the project deadline
app.post('/api/fund/extendDeadline', async (req, res) => {
  const { newDeadline } = req.body;
  const collection = await getCollection('Fund');
  try {
    await collection.updateOne({}, { $set: { deadline: parseInt(newDeadline, 10) } });
    res.status(200).send('Deadline extended successfully');
  } catch (error) {
    console.error('Error extending deadline:', error);
    res.status(500).send('Error extending deadline');
  }
});

// Endpoint to delete all entries in the Fund table
app.delete('/api/fund/releaseFunds', async (req, res) => {
  const collection = await getCollection('Fund');
  try {
    await collection.deleteMany({});
    res.status(200).send('All funds released successfully');
  } catch (error) {
    console.error('Error releasing funds:', error);
    res.status(500).send('Error releasing funds');
  }
});


// Endpoint to check if any entries exist in the Fund table
app.get('/api/fund/exists', async (req, res) => {
  try {
    const collection = await getCollection('Fund');
    const entryExists = await collection.findOne({});
    if (entryExists) {
      res.json({ exists: true });
    } else {
      // Explicitly send a success response indicating no entries exist.
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking fund entries:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/api/fund', async (req, res) => {
  try {
    const { walletAddress, proj_goal_amount, deadline, fundscollected } = req.body;
    const collection = await getCollection('Fund');
    const result = await collection.insertOne({
      walletAddress: walletAddress,
      proj_goal_amount: parseInt(proj_goal_amount, 10),
      deadline: parseInt(deadline, 10),
      fundscollected: parseInt(fundscollected, 10)
    });
    console.log("InsertOne Result:", result);  // Log the entire result object
    if (result.acknowledged) {
      const insertedDocument = await collection.findOne({_id: result.insertedId});
      res.status(201).json(insertedDocument);
    } else {
      throw new Error('Insert operation failed!');
    }
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).send('Error adding new fund entry: ${error.message}');
  }
});




// Create a new proposal
app.post('/api/proposals', async (req, res) => {
  try {
    const collection = await getCollection('Project');
    const proposal = req.body;
    await collection.insertOne(proposal);
    res.status(201).send('Proposal created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating new proposal');
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
