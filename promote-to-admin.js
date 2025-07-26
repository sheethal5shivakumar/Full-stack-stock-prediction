// Script to promote a user to admin role in MongoDB Atlas
const { MongoClient } = require('mongodb');
require('dotenv').config();

// Get email from command line arguments
const userEmail = process.argv[2];
if (!userEmail) {
  console.error('Please provide an email address: node promote-to-admin.js user@example.com');
  process.exit(1);
}

// Connect to MongoDB Atlas using the connection string from your project
async function promoteToAdmin() {
  // Get the connection string from your .env file or replace with your actual MongoDB Atlas connection string
  // It should look like: mongodb+srv://username:password@cluster.mongodb.net/database_name
  const uri = process.env.MONGODB_URI || 'your_mongodb_atlas_connection_string';
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db();
    
    // Check if user exists
    const user = await db.collection('users').findOne({ email: userEmail });
    
    if (!user) {
      console.error(`User with email ${userEmail} not found`);
      return;
    }
    
    // Update user role to admin
    const result = await db.collection('users').updateOne(
      { email: userEmail },
      { $set: { role: 'admin' } }
    );
    
    if (result.modifiedCount === 1) {
      console.log(`✅ User ${userEmail} has been promoted to admin role`);
    } else {
      console.log(`⚠️ User ${userEmail} was not updated. They might already be an admin.`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

promoteToAdmin().catch(console.error); 