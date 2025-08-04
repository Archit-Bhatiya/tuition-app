import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Get all standards
export async function GET() {
  const standards = await prisma.standard.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json(standards);
}

// Create new standard
export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const standard = await prisma.standard.create({
      data: { name },
    });

    return NextResponse.json(standard);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create standard" }, { status: 500 });
  }
}