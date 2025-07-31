import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get API to fetch batch
export async function GET() {
  const batches = await prisma.batch.findMany({
    // include: { students: true },
  });
  return NextResponse.json(batches);
}
// POST API to create batch
export async function POST(req: Request) {
  try {
    const { name, startTime, endTime } = await req.json();

    if (!name || !startTime || !endTime) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    const batch = await prisma.batch.create({
      data: { name, startTime, endTime },
    });

    return NextResponse.json({ message: "Batch created", batch });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create batch" }, { status: 500 });
  }
}
