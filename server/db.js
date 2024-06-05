const { MongoClient } = require('mongodb');

// Replace this URI with your actual MongoDB Atlas connection string
const uri = 'mongodb+srv://shamikhkabani08:8xMAU1Njikk6GJEf@proposals.06itqpa.mongodb.net/';

let db;

const connectToDatabase = async () => {
  if (db) return db;
  
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  db = client.db('Proposals'); // Replace with your database name
  return db;
};

const getCollection = async (collectionName) => {
  const database = await connectToDatabase();
  return database.collection(collectionName);
};

module.exports = { getCollection };
