import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Update API to update batch
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { name, startTime, endTime } = await req.json();

    const batch = await prisma.batch.update({
      where: { id: Number(params.id) },
      data: { name, startTime, endTime },
    });

    return NextResponse.json({ message: "Batch updated", batch });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update batch" }, { status: 500 });
  }
}

// Delete API to delete batch
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.batch.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ message: "Batch deleted" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete batch" }, { status: 500 });
  }
}
