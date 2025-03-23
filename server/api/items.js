import express from 'express';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';

// Load environment variables
dotenv.config();

const router = express.Router();

// MongoDB Connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = 'test'; 
const collectionName = 'items';

// Connect to MongoDB
async function connectToMongo() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db(dbName).collection(collectionName);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}


// GET all items
router.get('/', async (req, res) => {
  try {
    const collection = await connectToMongo();
    const items = await collection.find({}).toArray();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET item by ID
router.get('/:id', async (req, res) => {
  try {
    const collection = await connectToMongo();
    const item = await collection.findOne({ _id: new ObjectId(req.params.id) });
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST new item
router.post('/', async (req, res) => {
  try {
    const collection = await connectToMongo();
    
    const newItem = {
      name: req.body.name,
      type: req.body.type,
      lat: Number(req.body.lat),
      lng: Number(req.body.lng),
      date: new Date().toLocaleDateString(),
      description: req.body.description || ''
    };
    
    const result = await collection.insertOne(newItem);
    
    res.status(201).json({
      _id: result.insertedId,
      ...newItem
    });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
