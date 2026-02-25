import Link from "next/link";
import Image from "next/image";
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
      <section className="bg-gradient-to-br from-emerald-700 to-teal-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            2026 Dunebroom Earth Day Art Contest
          </h1>
          <p className="text-xl sm:text-2xl text-emerald-100 font-medium mb-4">
            Celebrate Earth Day Through Art
          </p>
          <p className="text-lg text-emerald-100/90 max-w-2xl mx-auto mb-10">
            Showcase your creativity in the 2026 Dunebroom Earth Day Art Contest!
            We are calling on artists of all ages to share their love for our
            planet. Submit your environmentally-inspired artwork for a chance to
            win prizes, raise environmental awareness, and be featured in our
            global digital gallery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/submit"
              className="inline-block bg-white text-emerald-700 font-semibold px-8 py-3 rounded-lg hover:bg-emerald-50 transition-colors"
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

      {/* Why Earth Day Matters */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Why Earth Day Matters
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          Every year on April 22nd, people all around the globe come together to
          celebrate Earth Day. It is a special day dedicated to protecting our
          environment, cleaning up our oceans, planting trees, and learning how to
          be better friends to nature. It reminds us that no matter where we live,
          we all share one home: Earth. And right now, our home needs our help.
          Your artwork can inspire your friends, your family, and your whole
          community to take action and make a difference.
        </p>
      </section>

      {/* Your Artistic Mission */}
      <section className="bg-emerald-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Your Artistic Mission
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Whether you love drawing vibrant rainforests, painting your favourite
            endangered animals, or building sculptures out of recycled materials,
            this is your chance to shine.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            <strong>The Theme:</strong> Create a piece of art that shows why the
            Earth is special to you, or your vision for a greener, cleaner future.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 text-lg mb-2">
                Use Any Style You Want
              </h3>
              <p className="text-gray-600">
                Grab your crayons, markers, paints, clay! You can even get creative
                by making &ldquo;upcycled&rdquo; art out of clean, recycled
                materials.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 text-lg mb-2">
                The Reward
              </h3>
              <p className="text-gray-600">
                All approved artwork will be featured in our grand Earth Day
                Digital Gallery, where your powerful message can be seen by
                everyone!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Age Groups & Prizes */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
          Age Groups &amp; Prizes
        </h2>
        <div className="grid sm:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-emerald-700 mb-4">
              5 to 10 Years
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>1st Prize: &#8377;5,100 + Certificate</li>
              <li>2nd Prize: &#8377;2,100 + Certificate</li>
              <li>3rd Prize: &#8377;1,100 + Certificate</li>
              <li>Honorary Mention (4): &#8377;501 each + Certificate</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-emerald-700 mb-4">
              11 to 17 Years
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>1st Prize: &#8377;5,100 + Certificate</li>
              <li>2nd Prize: &#8377;2,100 + Certificate</li>
              <li>3rd Prize: &#8377;1,100 + Certificate</li>
              <li>Honorary Mention (4): &#8377;501 each + Certificate</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Meet the Judges */}
      <section className="bg-emerald-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
            Meet the Judges
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
                <div className="flex-shrink-0 flex justify-center">
                  <Image
                    src="/Pavni-Diwanji-Profile-Picture.jpg"
                    alt="Pavni Diwanji"
                    width={200}
                    height={200}
                    className="rounded-full object-cover w-48 h-48"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-700 mb-3 text-center sm:text-left">
                    Artist Pavni Diwanji
                  </h3>
                  <div className="space-y-3 text-gray-600">
                    <p>
                      Pavni Diwanji is a contemporary visual artist whose work
                      explores memory, emotional residue, and the interior
                      landscapes of lived experience. Working primarily with
                      pastels and charcoal, she creates expressive compositions
                      that balance bold color with restraint, translating moments
                      of connection, stillness, and transition into distilled
                      visual form.
                    </p>
                    <p>
                      She has a master&apos;s degree in Computer Science from
                      Stanford University and has contributed to foundational web
                      technologies such as Java and later held senior executive
                      leadership roles at Silicon Valley companies including Google
                      and Instagram. This background in analytical thinking and
                      systems design informs her artistic practice, shaping a
                      sustained dialogue between structure and intuition.
                    </p>
                    <p>
                      Diwanji maintains her Artaye studio in Santa Cruz,
                      California, and practices within the Santa Cruz Art League
                      collective.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
                <div className="flex-shrink-0 flex justify-center">
                  <Image
                    src="/Prarthana-Bhargav-Kandavara.png"
                    alt="Prarthana Bhargav Kandavara"
                    width={200}
                    height={200}
                    className="rounded-full object-cover w-48 h-48"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-700 mb-3 text-center sm:text-left">
                    Artist Prarthana Bhargav Kandavara
                  </h3>
                  <div className="space-y-3 text-gray-600">
                    <p>
                      Prarthana Bhargav Kandavara is a self-taught hobby artist
                      and a software and automation engineer by profession. She
                      is known for creating personalized, narrative-driven, loose
                      watercolor works inspired by the lived experiences of
                      people, interpreted through the lens of culture,
                      philosophy, and timeless wisdom. Her art seeks to elicit
                      reflective engagement in viewers, inviting them to connect
                      their own memories, emotions, and stories to broader
                      cultural ideas.
                    </p>
                    <p>
                      She enjoys experimenting with wet-on-wet techniques to
                      capture the &apos;mood&apos; of the painting. As she says,
                      &ldquo;Water as a medium is fascinating—mix colours on the
                      paper and let water do its thing!&rdquo;
                    </p>
                    <p>
                      She publishes her art under the banner{" "}
                      <em>Chitritha_Oosulu</em>, a space where stories, colours,
                      and quiet reflections come together.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rules */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
            Rules of the Competition
          </h2>
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Eligibility</h3>
              <p className="text-gray-600">
                The age limit for participation is 5 to 17 years.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Originality</h3>
              <p className="text-gray-600">
                The artwork must be original and recently created. It should not be
                copied from any painting or source. The submitted work must be
                entirely the participant&apos;s own creation.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Artwork Specifications
              </h3>
              <ul className="text-gray-600 list-disc list-inside space-y-1">
                <li>Size: A4 (minimum) to Full Imperial (maximum)</li>
                <li>Any medium is allowed</li>
                <li>
                  Allowed surfaces: Ivory Sheet, Cartridge Sheet, or Canvas
                </li>
                <li>
                  Glitter or decorative materials must not be used or pasted on
                  the artwork
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Judging</h3>
              <p className="text-gray-600">
                The decision of the Selection Committee will be final and binding,
                and no appeal will be entertained.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Award Money &amp; Certificates
              </h3>
              <p className="text-gray-600">
                Our team will personally reach out to winning artists via email to
                securely collect account details and arrange the transfer of award
                money. All participants and winners will receive a soft copy
                certificate sent to their registered email.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Important Dates
              </h3>
              <ul className="text-gray-600 list-disc list-inside space-y-1">
                <li>Last Day of Submission: April 22, 2026, 11:59 PM IST</li>
                <li>Declaration of Results: May 30, 2026</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How to Register */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
          How to Register
        </h2>
        <p className="text-gray-600 text-center mb-10">
          There is no participation fee. Follow these simple steps:
        </p>
        <div className="grid sm:grid-cols-2 gap-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Register Online</h3>
              <p className="text-gray-600 text-sm mt-1">
                Fill out the online registration form with all necessary details.
                Please ensure the information is complete and true.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Upload Your Art</h3>
              <p className="text-gray-600 text-sm mt-1">
                Upload a clear image of your artwork at the time of registration.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Double-Check Your Email
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Provide an accurate and active email address. This is our only way
                to send certificates, updates, and contact you if you win!
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Tell Us Your Story
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Write a few lines about yourself and what inspired your Earth Day
                artwork. We&apos;ll feature your story alongside your art!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artwork Section */}
      {featured.length > 0 && (
        <section className="bg-emerald-50 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
              Featured Artwork
            </h2>
            <p className="text-gray-500 text-center mb-10">
              Top picks from our Earth Day contest
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((submission) => (
                <ArtworkCard
                  key={submission.id}
                  submission={submission}
                  featured
                />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/gallery"
                className="text-emerald-700 font-medium hover:text-emerald-900 transition-colors"
              >
                View all artwork &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-emerald-700 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Celebrate Earth Day?
          </h2>
          <p className="text-emerald-100 mb-8">
            Submit your artwork by April 22, 2026 and join our Earth Day Digital
            Gallery.
          </p>
          <Link
            href="/submit"
            className="inline-block bg-white text-emerald-700 font-semibold px-8 py-3 rounded-lg hover:bg-emerald-50 transition-colors"
          >
            Submit Your Artwork
          </Link>
        </div>
      </section>
    </div>
  );
}
