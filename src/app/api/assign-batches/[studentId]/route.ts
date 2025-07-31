import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { studentId: string }
}

export async function GET(_: Request, { params }: Params) {
  try {
    const studentId = parseInt(params.studentId);
    if (isNaN(studentId)) {
      return NextResponse.json({ error: "Invalid studentId" }, { status: 400 });
    }

    const assignments = await prisma.studentBatch.findMany({
      where: { studentId },
      include: { Batch: true }
    });

    return NextResponse.json(assignments);
  } catch (error) {
    console.error("Fetch student batches error:", error);
    return NextResponse.json({ error: "Failed to fetch student batches" }, { status: 500 });
  }
}
