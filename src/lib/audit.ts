import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

/**
 * Log an administrative action to the audit log
 * 
 * @param actorId - ID of the admin performing the action
 * @param action - Type of action (e.g., UPDATE_ROLE, DELETE_USER)
 * @param targetUserId - ID of the user affected by the action
 * @param details - Additional context about the action
 */
export async function logAuditEvent({
  actorId,
  action,
  targetUserId,
  details = {},
}: {
  actorId: string;
  action: string;
  targetUserId: string;
  details?: Record<string, unknown>;
}) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    await db.collection("audit_logs").insertOne({
      timestamp: new Date(),
      actorId: new ObjectId(actorId),
      targetUserId: new ObjectId(targetUserId),
      action,
      details,
    });
    
    console.log(`Audit log created: ${action} by ${actorId} on ${targetUserId}`);
  } catch (error) {
    console.error("Failed to create audit log:", error);
    // We don't throw here to prevent disrupting the main operation flow
    // But we log the error for monitoring
  }
}

/**
 * Standard action types for audit logs
 */
export const AuditActions = {
  UPDATE_ROLE: "UPDATE_ROLE",
  DELETE_USER: "DELETE_USER",
  CREATE_USER: "CREATE_USER",
  RESET_PASSWORD: "RESET_PASSWORD",
  LOGIN_ATTEMPT: "LOGIN_ATTEMPT",
  ACCOUNT_LOCK: "ACCOUNT_LOCK",
  ACCOUNT_UNLOCK: "ACCOUNT_UNLOCK",
}; 