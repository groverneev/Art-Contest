import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";

function checkPassword(request: NextRequest): boolean {
  const password = request.headers.get("x-admin-password");
  return password === process.env.ADMIN_PASSWORD;
}

// GET: Fetch all submissions (with optional status filter)
export async function GET(request: NextRequest) {
  if (!checkPassword(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const supabase = getAdminSupabase();

  let query = supabase
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }

  return NextResponse.json({ submissions: data });
}

// PATCH: Update a submission (approve, reject, toggle featured)
export async function PATCH(request: NextRequest) {
  if (!checkPassword(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "Submission ID required" }, { status: 400 });
  }

  const supabase = getAdminSupabase();

  const { error } = await supabase
    .from("submissions")
    .update(updates)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to update submission" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// DELETE: Delete a submission
export async function DELETE(request: NextRequest) {
  if (!checkPassword(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Submission ID required" }, { status: 400 });
  }

  const supabase = getAdminSupabase();

  // First, get the submission to find the image filename
  const { data: submission } = await supabase
    .from("submissions")
    .select("image_url")
    .eq("id", id)
    .single();

  // Delete the image from storage
  if (submission?.image_url) {
    const fileName = submission.image_url.split("/").pop();
    if (fileName) {
      await supabase.storage.from("artwork").remove([fileName]);
    }
  }

  // Delete the database row
  const { error } = await supabase
    .from("submissions")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete submission" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
