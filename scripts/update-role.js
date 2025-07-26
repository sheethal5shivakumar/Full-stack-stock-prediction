// Script to update user roles in the database
// Usage: node scripts/update-role.js <email> <role>

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI not found in environment variables');
  process.exit(1);
}

const email = process.argv[2];
const role = process.argv[3];

if (!email || !role) {
  console.error('Usage: node scripts/update-role.js <email> <role>');
  process.exit(1);
}

async function updateRole() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const users = db.collection('users');
    
    // Find the user
    const user = await users.findOne({ email });
    
    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }
    
    console.log('Current user data:');
    console.log({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role || 'No role assigned'
    });
    
    // Update the role
    await users.updateOne(
      { email },
      { $set: { role } }
    );
    
    console.log(`Updated role for ${email} to "${role}"`);
    
    // Verify the update
    const updatedUser = await users.findOne({ email });
    console.log('Updated user data:');
    console.log({
      _id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

updateRole().catch(console.error); 