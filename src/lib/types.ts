export interface Submission {
  id: string;
  artist_name: string;
  age_group: string;
  artist_email: string;
  artist_phone: string | null;
  title: string;
  story: string;
  image_url: string;
  status: "pending" | "approved" | "rejected";
  is_featured: boolean;
  uploaded_by_admin: boolean;
  created_at: string;
}
