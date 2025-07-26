import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  // Check if the user is authenticated and has admin role
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  
  console.log("Session in admin/audit API:", JSON.stringify(session, null, 2));
  
  if (session.user.role !== "admin") {
    console.log("Unauthorized access to /api/admin/audit. User role:", session?.user?.role);
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  
  try {
    // Get query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const action = url.searchParams.get("action") || null;
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    const client = await clientPromise;
    const db = client.db();
    
    // Build query
    const query: Record<string, unknown> = {};
    if (action) {
      query.action = action;
    }
    
    // Fetch audit logs with pagination
    const auditLogs = await db
      .collection("audit_logs")
      .find(query)
      .sort({ timestamp: -1 }) // Most recent first
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Get total count for pagination
    const totalCount = await db.collection("audit_logs").countDocuments(query);
    
    // Fetch user details to include in the response
    const userIds = [
      ...new Set([
        ...auditLogs.map(log => log.actorId.toString()),
        ...auditLogs.map(log => log.targetUserId.toString())
      ])
    ];
    
    const users = await db
      .collection("users")
      .find(
        { _id: { $in: userIds.map(id => new ObjectId(id)) } },
        { projection: { _id: 1, name: 1, email: 1 } }
      )
      .toArray();
    
    // Create a map for quick lookup
    const userMap = users.reduce((acc, user) => {
      acc[user._id.toString()] = {
        name: user.name,
        email: user.email
      };
      return acc;
    }, {} as Record<string, { name: string; email: string }>);
    
    // Enhance audit logs with user details
    const enhancedLogs = auditLogs.map(log => ({
      ...log,
      actor: userMap[log.actorId.toString()],
      target: userMap[log.targetUserId.toString()]
    }));
    
    return NextResponse.json({
      logs: enhancedLogs,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount
      }
    });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
} 