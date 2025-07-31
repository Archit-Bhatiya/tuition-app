import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      select: {
        id: true,
        studentName: true,
        parentName: true,
        standard: true,
      },
    });
    return NextResponse.json({ students });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}
