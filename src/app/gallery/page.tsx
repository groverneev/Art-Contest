import { supabase } from "@/lib/supabase";
import { Submission } from "@/lib/types";
import ArtworkCard from "@/components/ArtworkCard";

export const revalidate = 60;

async function getApprovedArtwork(): Promise<{
  featured: Submission[];
  all: Submission[];
}> {
  if (!supabase) return { featured: [], all: [] };
  const { data } = await supabase
    .from("submissions")
    .select("*")
    .eq("status", "approved")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  const submissions = (data as Submission[]) || [];
  return {
    featured: submissions.filter((s) => s.is_featured),
    all: submissions.filter((s) => !s.is_featured),
  };
}

export default async function GalleryPage() {
  const { featured, all } = await getApprovedArtwork();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Earth Day Art Gallery</h1>
      <p className="text-gray-500 mb-10">
        Explore artwork submitted to the 2026 Dunebroom Earth Day Art Contest
      </p>

      {/* Featured Section */}
      {featured.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Featured Artwork
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((submission) => (
              <ArtworkCard
                key={submission.id}
                submission={submission}
                featured
              />
            ))}
          </div>
        </section>
      )}

      {/* All Artwork Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          All Artwork
        </h2>
        {all.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {all.map((submission) => (
              <ArtworkCard key={submission.id} submission={submission} />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <p className="text-gray-500 text-center py-12">
            No artwork has been approved yet. Check back soon!
          </p>
        ) : null}
      </section>
    </div>
  );
}
