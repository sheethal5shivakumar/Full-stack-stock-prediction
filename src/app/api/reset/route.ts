import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  const { email } = await req.json();
  const client = await clientPromise;
  const db = client.db();
  
  const user = await db.collection("users").findOne({ email });
  
  if (!user) {
    return NextResponse.json({ 
      message: "If this email exists, a reset link has been sent." 
    });
  }
  
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
  
  await db.collection("password_resets").insertOne({
    userId: user._id,
    token,
    expires,
  });
  
  // Replace with actual email dispatch logic
  console.log(`Send email with link: https://yourdomain.com/reset/${token}`);
  
  return NextResponse.json({ 
    message: "If this email exists, a reset link has been sent." 
  });
} 