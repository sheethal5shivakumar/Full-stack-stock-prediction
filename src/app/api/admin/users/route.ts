import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { authOptions } from "@/lib/auth";

export async function GET() {
  // Check if the user is authenticated and has admin role
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  
  console.log("Session in admin/users API:", JSON.stringify(session, null, 2));
  
  if (session.user.role !== "admin") {
    console.log("Unauthorized access to /api/admin/users. User role:", session?.user?.role);
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Fetch all users but exclude sensitive fields like passwords
    const users = await db
      .collection("users")
      .find({}, { projection: { password: 0 } })
      .toArray();
    
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
} 