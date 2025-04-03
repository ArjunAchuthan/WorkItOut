import { MongoClient } from 'mongodb';

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'workitout_db;'; // Replace with your actual database name

const client = new MongoClient(url, {
  serverSelectionTimeoutMS: 2000,
  appName: 'WorkItOut'
});

export async function connectDB() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB server');
    return client.db(dbName);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export { client };
