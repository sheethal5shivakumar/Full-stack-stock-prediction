import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  
  console.log("Session in role update API:", JSON.stringify(session, null, 2));
  
  if (session.user.role !== "admin") {
    console.log("Unauthorized access to role update API. User role:", session?.user?.role);
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  
  try {
    const { userId, newRole } = await req.json();
    
    // Validate role
    if (!["admin", "user", "moderator"].includes(newRole)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db();
    
    // Check if user is trying to demote themselves
    if (session.user.id === userId && newRole !== "admin") {
      return NextResponse.json(
        { error: "Admins cannot demote themselves" },
        { status: 400 }
      );
    }
    
    // Get the target user
    const targetUser = await db.collection("users").findOne({ 
      _id: new ObjectId(userId) 
    });
    
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Check if this is the last admin
    if (targetUser.role === "admin" && newRole !== "admin") {
      const adminCount = await db
        .collection("users")
        .countDocuments({ role: "admin" });
        
      if (adminCount === 1) {
        return NextResponse.json(
          { error: "Cannot demote the last remaining admin" },
          { status: 400 }
        );
      }
    }
    
    // Update the user's role
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { role: newRole, updatedAt: new Date() } }
    );
    
    // Log the action to audit log
    await db.collection("audit_logs").insertOne({
      timestamp: new Date(),
      actorId: new ObjectId(session.user.id),
      targetUserId: new ObjectId(userId),
      action: "UPDATE_ROLE",
      details: {
        previousRole: targetUser.role || "user",
        newRole,
      },
    });
    
    return NextResponse.json({ success: true, role: newRole });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
} 