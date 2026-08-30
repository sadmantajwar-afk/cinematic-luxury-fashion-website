import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { eq } from "drizzle-orm";

const fallbackSubscribers = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Valid email is required" },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (process.env.DATABASE_URL) {
      try {
        const existing = await db
          .select()
          .from(newsletterSubscribers)
          .where(eq(newsletterSubscribers.email, trimmedEmail))
          .limit(1);

        if (existing.length > 0) {
          return NextResponse.json({
            success: true,
            message: "You are already enrolled in the DREV private dispatch.",
          });
        }

        await db.insert(newsletterSubscribers).values({
          email: trimmedEmail,
        });
      } catch (dbErr) {
        console.warn("DB subscription insert failed, recorded in-memory:", dbErr);
        fallbackSubscribers.add(trimmedEmail);
      }
    } else {
      if (fallbackSubscribers.has(trimmedEmail)) {
        return NextResponse.json({
          success: true,
          message: "You are already enrolled in the DREV private dispatch.",
        });
      }
      fallbackSubscribers.add(trimmedEmail);
    }

    return NextResponse.json({
      success: true,
      message: "Access granted. Welcome to the DREV visual archive and private releases.",
    });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process subscription" },
      { status: 500 }
    );
  }
}
