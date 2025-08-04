import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: {
        standard: {   // include relation
          select: { name: true }
        }
      }
    });

    // Format data for frontend
    const formatted = students.map(student => ({
      id: student.id,
      studentName: student.studentName,
      parentName: student.parentName,
      standardName: student.standard?.name || null
    }));

    return NextResponse.json({ students: formatted });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}
