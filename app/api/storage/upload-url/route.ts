import { NextResponse } from "next/server";

import { createPresignedUploadUrl, isR2Configured } from "@/lib/r2";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: "Please log in again before uploading files." }, { status: 401 });
    }

    if (!isR2Configured()) {
      return NextResponse.json({ strategy: "supabase" });
    }

    const body = await request.json().catch(() => null) as {
      bucket?: string;
      path?: string;
      contentType?: string;
    } | null;

    const bucket = body?.bucket?.trim();
    const path = body?.path?.trim();
    const contentType = body?.contentType?.trim() || undefined;

    if (!bucket || !path) {
      return NextResponse.json({ message: "Missing upload bucket or path." }, { status: 400 });
    }

    if (!path.startsWith(`${user.id}/`)) {
      return NextResponse.json({ message: "Uploads must stay inside the current user namespace." }, { status: 403 });
    }

    const result = await createPresignedUploadUrl({
      bucket,
      path,
      contentType,
    });

    return NextResponse.json({
      strategy: "r2",
      uploadUrl: result.uploadUrl,
      objectKey: result.objectKey,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to prepare upload.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
