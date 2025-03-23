import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Use the same MongoDB connection string as in your items.js
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = 'test';  // Same as in your items.js
const collectionName = 'items';

// Test data
const items = [
  {
    name: 'Cycle',
    type: 'lost',
    lat: 26.514761,
    lng: 80.222683,
    date: 'Jan 23, 2023',
    description: 'Black bicycle lost near IIT campus'
  },
  {
    name: 'Football',
    type: 'found',
    lat: 26.519446,
    lng: 80.236005,
    date: 'Jan 21, 2023',
    description: 'Keys found at the old lecture hall'
  },
  {
    name: 'Wallet',
    type: 'lost',
    lat: 26.514774,
    lng: 80.229643,
    date: 'Jan 22, 2023',
    description: 'Wallet lost near Staff Club'
  }
];

async function seedDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    
    // Clear existing data
    const deleteResult = await collection.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} documents`);
    
    // Insert new data
    const insertResult = await collection.insertMany(items);
    console.log(`Inserted ${insertResult.insertedCount} documents`);
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the seed function
seedDatabase();
