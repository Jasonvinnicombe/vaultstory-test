import { NextResponse } from "next/server";

import { sendSupportRequestEmail } from "@/lib/email";
import { supportRequestSchema } from "@/lib/validations/support";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = supportRequestSchema.safeParse(body);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json({ error: firstIssue?.message ?? "Check the form details and try again." }, { status: 400 });
    }

    const result = await sendSupportRequestEmail(parsed.data);

    if (result.status === "skipped") {
      return NextResponse.json(
        { error: "Support email sending is not configured yet. Please email support@vaultstory.app directly." },
        { status: 503 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "We could not send your support request right now." },
      { status: 500 },
    );
  }
}
