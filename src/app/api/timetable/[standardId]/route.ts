import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { standardId: string }
}

// GET - Fetch timetable for a standard
export async function GET(_: Request, { params }: Params) {
  try {
    const standardId = parseInt(params.standardId);

    const timetable = await prisma.timetable.findMany({
      where: { standardId },
      include: { subject: true },
    });

    // Group subjects by day
    const grouped: Record<string, string[]> = {};
    timetable.forEach((entry) => {
      if (!grouped[entry.day]) grouped[entry.day] = [];
      grouped[entry.day].push(entry.subject.name);
    });

    return NextResponse.json(grouped);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch timetable" }, { status: 500 });
  }
}

// POST - Save timetable for a standard
export async function POST(req: Request, { params }: Params) {
  try {
    const standardId = parseInt(params.standardId);
    const body = await req.json(); // [{ day: "Monday", subjectIds: [1,2] }]

    // Remove old entries
    await prisma.timetable.deleteMany({ where: { standardId } });

    // Create new ones
    const data = body.flatMap((dayEntry: any) =>
      dayEntry.subjectIds.map((subjectId: number) => ({
        standardId,
        day: dayEntry.day,
        subjectId,
      }))
    );

    await prisma.timetable.createMany({ data });

    return NextResponse.json({ message: "Timetable saved successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save timetable" }, { status: 500 });
  }
}
