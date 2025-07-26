import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  const client = await clientPromise;
  const db = client.db();
  const existing = await db.collection("users").findOne({ email });
  
  if (existing) {
    return NextResponse.json({ error: "Email already exists" }, { status: 409 });
  }
  
  const hashedPassword = await hash(password, 12);
  const result = await db.collection("users").insertOne({
    name,
    email,
    password: hashedPassword,
    role: "user",
    createdAt: new Date(),
  });
  
  return NextResponse.json({ success: true, userId: result.insertedId });
} 