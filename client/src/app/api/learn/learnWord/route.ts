import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define type for the raw query result
type WordQuestionResult = {
  answer: string;
  videoUrl: string | null;
};

export async function GET() {
  try {
    const questions = await prisma.$queryRaw<WordQuestionResult[]>`
      SELECT "answer", "videoUrl"
      FROM "WordQuestion"
      ORDER BY RANDOM()
      LIMIT 100;
    `;

    return NextResponse.json(questions);
  } catch (error: unknown) {
    console.error("Error fetching random questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// // GET - Fetch only answer and imageUrl from DB (A first)
// export async function GET() {
//   try {
//     const questions = await prisma.wordQuestion.findMany({
//       orderBy: { id: "asc" },
//       select: {
//         answer: true,
//         videoUrl: true,
//       },
//     });

//     return NextResponse.json(questions);
//   } catch (error: unknown) {
//     console.error("Error fetching questions:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch questions" },
//       { status: 500 }
//     );
//   }
// }
