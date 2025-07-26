import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
  // Check if the user is authenticated
  const session = await getServerSession();
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    // Get the email from query params
    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    
    // Only allow users to fetch their own data unless they're an admin
    if (email !== session.user.email && session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    
    const client = await clientPromise;
    const db = client.db();
    
    // Fetch the user from the database
    const user = await db.collection("users").findOne(
      { email },
      { projection: { password: 0 } } // Exclude password
    );
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Convert ObjectId to string for serialization
    const serializedUser = {
      ...user,
      _id: user._id.toString(),
    };
    
    return NextResponse.json({ user: serializedUser });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
} 