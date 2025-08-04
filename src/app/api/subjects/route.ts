import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Get all subjects
export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: { id: "asc" }
    });
    return NextResponse.json(subjects);
  } catch (error) {
    console.error("Fetch subjects error:", error);
    return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 });
  }
}

// Create new subject
export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const subject = await prisma.subject.create({
      data: { name }
    });

    return NextResponse.json(subject);
  } catch (error: any) {
    console.error("Create subject error:", error);
    return NextResponse.json({ error: "Failed to create subject" }, { status: 500 });
  }
}
