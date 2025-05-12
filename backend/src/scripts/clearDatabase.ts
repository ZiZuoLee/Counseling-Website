import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const clearDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/counseling-website');
    console.log('Connected to MongoDB');

    // Get all collections
    const collections = await mongoose.connection.db.collections();

    // Clear each collection
    for (const collection of collections) {
      await collection.deleteMany({});
      console.log(`Cleared collection: ${collection.collectionName}`);
    }

    console.log('All collections have been cleared successfully');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
};

// Run the script
clearDatabase(); 