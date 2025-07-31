import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { studentId, batchIds } = await req.json();

    if (!studentId || !Array.isArray(batchIds)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Remove old assignments
    await prisma.studentBatch.deleteMany({
      where: { studentId },
    });

    // Create new assignments
    const newAssignments = await prisma.studentBatch.createMany({
      data: batchIds.map((batchId: number) => ({
        studentId,
        batchId,
      })),
    });

    return NextResponse.json({
      message: "Student batches updated successfully",
      count: newAssignments.count,
    });
  } catch (error) {
    console.error("Assign batches error:", error);
    return NextResponse.json({ error: "Failed to assign batches" }, { status: 500 });
  }
}