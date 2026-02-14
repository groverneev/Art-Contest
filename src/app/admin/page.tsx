"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Submission } from "@/lib/types";

type StatusFilter = "all" | "pending" | "approved" | "rejected";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("pending");
  const [loading, setLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const uploadFormRef = useRef<HTMLFormElement>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(false);

    // Test the password by making a request
    const res = await fetch("/api/admin?status=pending", {
      headers: { "x-admin-password": password },
    });

    if (res.ok) {
      setAuthenticated(true);
      const data = await res.json();
      setSubmissions(data.submissions);
    } else {
      setAuthError(true);
    }
  }

  async function fetchSubmissions(status: StatusFilter = filter) {
    setLoading(true);
    const res = await fetch(`/api/admin?status=${status}`, {
      headers: { "x-admin-password": password },
    });
    if (res.ok) {
      const data = await res.json();
      setSubmissions(data.submissions);
    }
    setLoading(false);
  }

  function handleFilterChange(newFilter: StatusFilter) {
    setFilter(newFilter);
    fetchSubmissions(newFilter);
  }

  async function updateSubmission(id: string, updates: Partial<Submission>) {
    await fetch("/api/admin", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify({ id, ...updates }),
    });
    fetchSubmissions();
  }

  async function deleteSubmission(id: string) {
    if (!confirm("Are you sure you want to delete this submission?")) return;
    await fetch(`/api/admin?id=${id}`, {
      method: "DELETE",
      headers: { "x-admin-password": password },
    });
    fetchSubmissions();
  }

  async function handleAdminUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "x-admin-password": password },
      body: formData,
    });

    if (res.ok) {
      uploadFormRef.current?.reset();
      setUploadPreview(null);
      setShowUploadForm(false);
      fetchSubmissions();
    }
    setUploading(false);
  }

  // Refresh on mount if already authenticated
  useEffect(() => {
    if (authenticated) fetchSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Admin Login
        </h1>
        {authError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-4">
            Incorrect password
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {showUploadForm ? "Cancel Upload" : "Upload on Behalf"}
        </button>
      </div>

      {/* Manual Upload Form */}
      {showUploadForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Upload Artwork on Behalf of Someone
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Use this for artwork received via email or WhatsApp. Submissions
            uploaded here are automatically approved.
          </p>
          <form
            ref={uploadFormRef}
            onSubmit={handleAdminUpload}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <input
              type="text"
              name="artist_name"
              required
              placeholder="Artist name *"
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            <select
              name="age_group"
              required
              defaultValue=""
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              <option value="" disabled>Age group *</option>
              <option value="5 to 10 years">5 to 10 years</option>
              <option value="11 to 17 years">11 to 17 years</option>
            </select>
            <input
              type="text"
              name="title"
              required
              placeholder="Artwork title *"
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            <input
              type="email"
              name="artist_email"
              required
              placeholder="Parent/guardian email *"
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            <input
              type="tel"
              name="artist_phone"
              placeholder="Phone number (optional)"
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            <textarea
              name="story"
              required
              placeholder="Tell us your story *"
              rows={2}
              className="sm:col-span-2 border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
            />
            <div className="sm:col-span-2">
              <input
                type="file"
                name="image"
                accept="image/*"
                required
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () =>
                      setUploadPreview(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
              />
              {uploadPreview && (
                <div className="mt-3 relative h-40 w-40">
                  <Image
                    src={uploadPreview}
                    alt="Preview"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={uploading}
              className="sm:col-span-2 bg-green-600 text-white font-medium py-2.5 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload & Auto-Approve"}
            </button>
          </form>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["pending", "approved", "rejected", "all"] as StatusFilter[]).map(
          (status) => (
            <button
              key={status}
              onClick={() => handleFilterChange(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === status
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status}
            </button>
          )
        )}
      </div>

      {/* Submissions List */}
      {loading ? (
        <p className="text-gray-500 text-center py-12">Loading...</p>
      ) : submissions.length === 0 ? (
        <p className="text-gray-500 text-center py-12">
          No {filter === "all" ? "" : filter} submissions found.
        </p>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4"
            >
              {/* Image Preview */}
              <div className="relative w-full sm:w-48 h-48 sm:h-36 flex-shrink-0">
                <Image
                  src={submission.image_url}
                  alt={submission.title}
                  fill
                  className="object-cover rounded-lg"
                  sizes="200px"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {submission.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      by {submission.artist_name}
                      {submission.uploaded_by_admin && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          Admin upload
                        </span>
                      )}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${
                      submission.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : submission.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {submission.status}
                  </span>
                </div>

                {submission.artist_email && (
                  <p className="text-xs text-gray-400 mt-1">
                    {submission.artist_email}
                  </p>
                )}
                {submission.artist_phone && (
                  <p className="text-xs text-gray-400">
                    {submission.artist_phone}
                  </p>
                )}
                {submission.age_group && (
                  <p className="text-xs text-gray-400">
                    Age group: {submission.age_group}
                  </p>
                )}
                {submission.story && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {submission.story}
                  </p>
                )}

                <p className="text-xs text-gray-400 mt-2">
                  {new Date(submission.created_at).toLocaleDateString()}
                </p>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {submission.status !== "approved" && (
                    <button
                      onClick={() =>
                        updateSubmission(submission.id, { status: "approved" })
                      }
                      className="text-xs font-medium px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                    >
                      Approve
                    </button>
                  )}
                  {submission.status !== "rejected" && (
                    <button
                      onClick={() =>
                        updateSubmission(submission.id, { status: "rejected" })
                      }
                      className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                    >
                      Reject
                    </button>
                  )}
                  {submission.status === "approved" && (
                    <button
                      onClick={() =>
                        updateSubmission(submission.id, {
                          is_featured: !submission.is_featured,
                        })
                      }
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                        submission.is_featured
                          ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {submission.is_featured ? "Unfeature" : "Feature"}
                    </button>
                  )}
                  <button
                    onClick={() => deleteSubmission(submission.id)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
