import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const password = request.headers.get("x-admin-password");
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();

    const artist_name = formData.get("artist_name") as string;
    const artist_email = (formData.get("artist_email") as string) || null;
    const artist_phone = (formData.get("artist_phone") as string) || null;
    const title = formData.get("title") as string;
    const description = (formData.get("description") as string) || null;
    const image = formData.get("image") as File;

    if (!artist_name || !title || !image) {
      return NextResponse.json(
        { error: "Name, title, and image are required" },
        { status: 400 }
      );
    }

    const supabase = getAdminSupabase();

    // Upload image
    const fileExt = image.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("artwork")
      .upload(fileName, image, { contentType: image.type });

    if (uploadError) {
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from("artwork")
      .getPublicUrl(fileName);

    // Insert as auto-approved, marked as admin upload
    const { error: insertError } = await supabase
      .from("submissions")
      .insert({
        artist_name,
        artist_email,
        artist_phone,
        title,
        description,
        image_url: urlData.publicUrl,
        status: "approved",
        is_featured: false,
        uploaded_by_admin: true,
      });

    if (insertError) {
      return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
