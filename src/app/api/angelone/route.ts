import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Angel One environment setup completed successfully",
    nextStep: "Now integrate direct REST login API",
  });
}
