import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      studentName,
      parentName,
      parentEmail,
      password,
      standard,
      medium,
      schoolName,
      lastStandardMarks,
      schoolTiming,
      contactNumber,
      address,
      batchIds = [],
    } = body;

    // Hash parent password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Student with Parent info
    const student = await prisma.student.create({
      data: {
        studentName,
        parentName,
        parentEmail,
        password: hashedPassword,
        standard,
        medium,
        schoolName,
        lastStandardMarks,
        schoolTiming,
        contactNumber,
        address,
      },
    });

    // Link batches manually via StudentBatch table
    if (batchIds.length > 0) {
      await prisma.studentBatch.createMany({
        data: batchIds.map((batchId: number) => ({
          studentId: student.id,
          batchId,
        })),
      });
    }

    // Return with linked batches
    const studentWithBatches = await prisma.student.findUnique({
      where: { id: student.id },
      include: { batches: true },
    });

    return NextResponse.json({
      message: "Student added successfully",
      student,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to add student" },
      { status: 500 }
    );
  }
}
