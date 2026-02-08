export interface Submission {
  id: string;
  artist_name: string;
  artist_email: string | null;
  artist_phone: string | null;
  title: string;
  description: string | null;
  image_url: string;
  status: "pending" | "approved" | "rejected";
  is_featured: boolean;
  uploaded_by_admin: boolean;
  created_at: string;
}
