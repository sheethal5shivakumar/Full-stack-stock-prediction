import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ 
      authenticated: false,
      message: "Not authenticated" 
    });
  }
  
  return NextResponse.json({
    authenticated: true,
    session,
    hasRole: !!session.user.role,
    role: session.user.role,
    isAdmin: session.user.role === "admin"
  });
} 