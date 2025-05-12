import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

// Load environment variables
dotenv.config();

// Function to seed admin user
const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/counseling-website');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
    } else {
      // Create admin user
      const adminUser = new User({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin123',  // This will be hashed by the pre-save hook
        role: 'admin',
      });

      await adminUser.save();
      console.log('Admin user created successfully');
    }

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

// Run the seed function
seedAdmin(); 