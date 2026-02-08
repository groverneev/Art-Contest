import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Submission } from "@/lib/types";
import ArtworkCard from "@/components/ArtworkCard";

export const revalidate = 60;

async function getFeaturedArtwork(): Promise<Submission[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("submissions")
    .select("*")
    .eq("status", "approved")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(6);

  return (data as Submission[]) || [];
}

export default async function Home() {
  const featured = await getFeaturedArtwork();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Art Contest
          </h1>
          <p className="text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto mb-10">
            Showcase your creativity! Submit your artwork for a chance to be
            featured in our gallery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/submit"
              className="inline-block bg-white text-indigo-600 font-semibold px-8 py-3 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Submit Your Artwork
            </Link>
            <Link
              href="/gallery"
              className="inline-block border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              Browse Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Artwork Section */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Featured Artwork
          </h2>
          <p className="text-gray-500 text-center mb-10">
            Our top picks from the contest
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((submission) => (
              <ArtworkCard key={submission.id} submission={submission} featured />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/gallery"
              className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
            >
              View all artwork &rarr;
            </Link>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Participate?
          </h2>
          <p className="text-gray-600 mb-8">
            Submit your artwork and join other talented artists in our contest.
          </p>
          <Link
            href="/submit"
            className="inline-block bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Submit Your Artwork
          </Link>
        </div>
      </section>
    </div>
  );
}
