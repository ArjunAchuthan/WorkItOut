// app/api/seed-db/route.ts

import { NextResponse } from "next/server";
import { seedDatabase } from "@/lib/db/seed-data";

export async function POST() {
  try {
    const result = await seedDatabase();
    
    if (result.success) {
      return NextResponse.json({
        status: "success",
        message: result.message
      });
    } else {
      return NextResponse.json({
        status: "error",
        message: result.message,
        error: result.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json({
      status: "error",
      message: "An unexpected error occurred while seeding the database",
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

