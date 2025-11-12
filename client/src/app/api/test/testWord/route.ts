import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch all questions from DB
export async function GET() {
  try {
    const questions = await prisma.wordQuestion.findMany({
      orderBy: { id: "desc" },
    });

    return NextResponse.json(questions);
  } catch (error: unknown) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}
