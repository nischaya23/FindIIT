import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Use the same MongoDB connection string as in your items.js
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/test";
console.log("Connection URI:", uri); // Debug log

if (!uri) {
  console.error("MONGODB_URI is undefined. Check your .env file.");
  process.exit(1);
}

const client = new MongoClient(uri);
const dbName = 'test';
const collectionName = 'items';

// Test data with tags and user fields
const items = [
  {
    name: 'Cycle',
    type: 'lost',
    lat: 26.514761,
    lng: 80.222683,
    date: 'Jan 23, 2023',
    description: 'Black bicycle lost near IIT campus',
    tags: ['bicycle', 'black', 'campus'],
    user: {
      id: '1001',
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      phone: '9876543210'
    }
  },
  {
    name: 'Football',
    type: 'found',
    lat: 26.519446,
    lng: 80.236005,
    date: 'Jan 21, 2023',
    description: 'Football found at the old lecture hall',
    tags: ['sports', 'ball', 'lecture hall'],
    user: {
      id: '1002',
      name: 'Priya Patel',
      email: 'priya@example.com',
      phone: '8765432109'
    }
  },
  {
    name: 'Wallet',
    type: 'lost',
    lat: 26.514774,
    lng: 80.229643,
    date: 'Jan 22, 2023',
    description: 'Wallet lost near Staff Club',
    tags: ['wallet', 'leather', 'black', 'staff club'],
    user: {
      id: '1003',
      name: 'Amit Kumar',
      email: 'amit@example.com',
      phone: '7654321098'
    }
  },
  {
    name: 'Laptop',
    type: 'lost',
    lat: 26.517890,
    lng: 80.233456,
    date: 'Jan 25, 2023',
    description: 'HP laptop lost in the library',
    tags: ['electronics', 'laptop', 'HP', 'library'],
    user: {
      id: '1004',
      name: 'Sneha Gupta',
      email: 'sneha@example.com',
      phone: '6543210987'
    }
  },
  {
    name: 'Water Bottle',
    type: 'found',
    lat: 26.512345,
    lng: 80.227890,
    date: 'Jan 20, 2023',
    description: 'Blue water bottle found near the gym',
    tags: ['bottle', 'blue', 'gym'],
    user: {
      id: '1005',
      name: 'Vikram Singh',
      email: 'vikram@example.com',
      phone: '5432109876'
    }
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
    
    // Verify data was inserted by retrieving one document
    const sampleItem = await collection.findOne({});
    console.log('Sample item from database:');
    console.log(sampleItem);
    
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
