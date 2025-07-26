import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb+srv://shivakumarsheethal:Skanda@290424@cluster0.cpcve7j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Only throw error in development, provide fallback for production builds
if (!process.env.MONGODB_URI && process.env.NODE_ENV === "development") {
  throw new Error("Please define the MONGODB_URI environment variable");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
