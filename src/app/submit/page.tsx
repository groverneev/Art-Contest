"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export default function SubmitPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Something went wrong");
      }

      setSuccess(true);
      formRef.current?.reset();
      setPreview(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="bg-green-50 border border-green-200 rounded-xl p-8">
          <h1 className="text-3xl font-bold text-green-800 mb-4">
            Thank You!
          </h1>
          <p className="text-green-700 mb-6">
            Your artwork has been submitted successfully. It will appear in the
            gallery once it has been reviewed.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-green-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Submit Artwork</h1>
      <p className="text-gray-500 mb-8">
        Upload your artwork to enter the contest. All submissions will be
        reviewed before appearing in the gallery.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Artist Name */}
        <div>
          <label htmlFor="artist_name" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="artist_name"
            name="artist_name"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="Enter your name"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="artist_email" className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="email"
            id="artist_email"
            name="artist_email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="your@email.com"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="artist_phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="tel"
            id="artist_phone"
            name="artist_phone"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="Your phone number"
          />
        </div>

        {/* Artwork Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Artwork Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="Give your artwork a title"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
            placeholder="Tell us about your artwork"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Artwork Image <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
            <input
              type="file"
              name="image"
              accept="image/*"
              required
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
            />
            {preview && (
              <div className="mt-4 relative aspect-video max-w-sm mx-auto">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting..." : "Submit Artwork"}
        </button>
      </form>
    </div>
  );
}
