import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();

// Sample data - in a real app, this would come from a database
const items = [
  {
    id: '1',
    name: 'Cycle',
    type: 'lost',
    lat: 26.514761,
    lng: 80.222683,
    date: 'Jan 23, 2023',
    description: 'Black bicycle lost near IIT campus'
  },
  {
    id: '2',
    name: 'Football',
    type: 'found',
    lat: 26.519446,
    lng: 80.236005,
    date: 'Jan 21, 2023',
    description: 'Keys found at the old lecture hall'
  },
  {
    id: '3',
    name: 'Staff Club',
    type: 'lost',
    lat: 26.514774,
    lng: 80.229643,
    date: 'Jan 22, 2023',
    description: 'Wallet lost near Staff Club'
  }
];


// GET all items
router.get('/', (req, res) => {
  res.json(items);
});

// GET item by ID
router.get('/:id', (req, res) => {
  const item = items.find(item => item.id === req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }
  res.json(item);
});

// POST new item
router.post('/', (req, res) => {
  // In a real app, validate and save to database
  const newItem = {
    id: String(items.length + 1),
    ...req.body,
    date: new Date().toLocaleDateString()
  };
  
  items.push(newItem);
  res.status(201).json(newItem);
});

export default router;