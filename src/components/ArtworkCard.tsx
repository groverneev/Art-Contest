import Image from "next/image";
import { Submission } from "@/lib/types";

interface ArtworkCardProps {
  submission: Submission;
  featured?: boolean;
}

export default function ArtworkCard({ submission, featured }: ArtworkCardProps) {
  return (
    <div
      className={`bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${
        featured ? "ring-2 ring-indigo-200" : ""
      }`}
    >
      <div className="relative bg-gray-50">
        <Image
          src={submission.image_url}
          alt={submission.title}
          width={800}
          height={600}
          className="w-full h-auto"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {featured && (
          <span className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            Featured
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg">{submission.title}</h3>
        <p className="text-sm text-gray-500 mt-1">by {submission.artist_name}</p>
        {submission.description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {submission.description}
          </p>
        )}
      </div>
    </div>
  );
}
