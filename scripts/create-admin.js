const { MongoClient } = require('mongodb');
const { hash } = require('bcryptjs');
require('dotenv').config();

// Replace with your MongoDB connection string
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/your-db-name";

async function createAdmin() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    
    const db = client.db();
    
    // Check if admin already exists
    const existingAdmin = await db.collection("users").findOne({ email: "admin@example.com" });
    
    if (existingAdmin) {
      console.log("Admin user already exists. Updating role to admin...");
      await db.collection("users").updateOne(
        { email: "admin@example.com" },
        { $set: { role: "admin" } }
      );
      console.log("Admin role updated successfully");
    } else {
      // Create a new admin user
      const hashedPassword = await hash("admin123", 12);
      
      await db.collection("users").insertOne({
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
        createdAt: new Date()
      });
      
      console.log("Admin user created successfully");
    }
    
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

createAdmin().catch(console.error); 