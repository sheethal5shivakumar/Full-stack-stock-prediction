// Script to check session and role in the database
// Usage: node scripts/check-session.js <token>

const { MongoClient, ObjectId } = require('mongodb');
const { verify } = require('jsonwebtoken');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const secret = process.env.NEXTAUTH_SECRET;

if (!uri) {
  console.error('MONGODB_URI not found in environment variables');
  process.exit(1);
}

if (!secret) {
  console.error('NEXTAUTH_SECRET not found in environment variables');
  process.exit(1);
}

// Get the token from command line arguments
const token = process.argv[2];

if (!token) {
  console.error('Usage: node scripts/check-session.js <token>');
  console.error('You can get your token from the browser cookies (next-auth.session-token)');
  process.exit(1);
}

async function checkSession() {
  try {
    // Verify and decode the JWT token
    const decoded = verify(token, secret);
    console.log('\n--- JWT Token Data ---');
    console.log(JSON.stringify(decoded, null, 2));
    
    // Connect to MongoDB
    const client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // Find the user in the database
    if (decoded.sub || decoded.id) {
      const userId = decoded.sub || decoded.id;
      const user = await db.collection('users').findOne({ 
        _id: new ObjectId(userId) 
      });
      
      if (user) {
        console.log('\n--- User in Database ---');
        console.log({
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role || 'No role assigned'
        });
        
        // Check for role mismatch
        if (decoded.role !== user.role) {
          console.log('\n⚠️ WARNING: Role mismatch between token and database!');
          console.log(`Token role: ${decoded.role || 'undefined'}`);
          console.log(`Database role: ${user.role || 'undefined'}`);
          console.log('\nYou should sign out and sign back in to refresh your session.');
        } else {
          console.log('\n✅ Role in token matches database.');
        }
      } else {
        console.error(`\n❌ User with ID ${userId} not found in database!`);
      }
    } else {
      console.error('\n❌ No user ID found in token!');
    }
    
    await client.close();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkSession().catch(console.error); 