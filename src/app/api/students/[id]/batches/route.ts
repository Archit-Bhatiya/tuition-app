import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const studentId = parseInt(params.id);
    const assignments = await prisma.studentBatch.findMany({
      where: { studentId },
      select: { batchId: true },
    });

    return NextResponse.json({ batchIds: assignments.map((a) => a.batchId) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch student batches" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const studentId = parseInt(params.id);
    const { batchIds } = await req.json();

    // Remove old assignments
    await prisma.studentBatch.deleteMany({ where: { studentId } });

    // Add new ones
    await prisma.studentBatch.createMany({
      data: batchIds.map((batchId: number) => ({ studentId, batchId })),
    });

    return NextResponse.json({ message: "Batches updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update student batches" }, { status: 500 });
  }
}