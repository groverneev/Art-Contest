import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";
import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const artist_name = formData.get("artist_name") as string;
    const age_group = formData.get("age_group") as string;
    const artist_email = formData.get("artist_email") as string;
    const artist_phone = (formData.get("artist_phone") as string) || null;
    const title = formData.get("title") as string;
    const story = formData.get("story") as string;
    const image = formData.get("image") as File;

    if (!artist_name || !age_group || !artist_email || !title || !story || !image) {
      return NextResponse.json(
        { error: "All required fields must be filled out" },
        { status: 400 }
      );
    }

    const supabase = getAdminSupabase();

    // Upload image to Supabase Storage
    const fileExt = image.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("artwork")
      .upload(fileName, image, {
        contentType: image.type,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }

    // Get public URL for the uploaded image
    const { data: urlData } = supabase.storage
      .from("artwork")
      .getPublicUrl(fileName);

    const image_url = urlData.publicUrl;

    // Insert submission into database
    const { error: insertError } = await supabase
      .from("submissions")
      .insert({
        artist_name,
        age_group,
        artist_email,
        artist_phone,
        title,
        story,
        image_url,
        status: "pending",
        is_featured: false,
        uploaded_by_admin: false,
      });

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to save submission" },
        { status: 500 }
      );
    }

    // Send email notification to admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        await getResend().emails.send({
          from: "Art Contest <onboarding@resend.dev>",
          to: adminEmail,
          subject: `New Artwork Submission: "${title}" by ${artist_name}`,
          html: `
            <h2>New Artwork Submission</h2>
            <p><strong>Artist:</strong> ${artist_name}</p>
            <p><strong>Age Group:</strong> ${age_group}</p>
            <p><strong>Email:</strong> ${artist_email}</p>
            ${artist_phone ? `<p><strong>Phone:</strong> ${artist_phone}</p>` : ""}
            <p><strong>Title:</strong> ${title}</p>
            <p><strong>Story:</strong> ${story}</p>
            <p><a href="${image_url}">View Image</a></p>
            <br/>
            <p>Log in to the admin dashboard to review this submission.</p>
          `,
        });
      }
    } catch {
      // Email failure shouldn't block the submission
      console.error("Failed to send email notification");
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
