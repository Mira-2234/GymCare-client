"use client";

import { useState } from "react";
import { useAuth } from "@/lib/useAuth";
import toast from "react-hot-toast";

export default function AddForumPostPage() {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const uploadToImgbb = async () => {
    if (!imageFile) {
      throw new Error("Select an image first.");
    }

    if (!process.env.NEXT_PUBLIC_IMAGBB_API_KEY) {
      throw new Error("IMGBB API key missing.");
    }

    const formData = new FormData();

    formData.append("image", imageFile);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGBB_API_KEY}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    console.log("IMGBB:", data);

    if (!res.ok || !data.success) {
      throw new Error(
        data?.error?.message || "Image upload failed."
      );
    }

    return data.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.email) {
      toast.error("Please login first.");
      return;
    }

    if (
      !title.trim() ||
      !description.trim() ||
      !imageFile
    ) {
      toast.error(
        "Please fill all fields and select image."
      );
      return;
    }

    try {
      setSubmitting(true);

      setUploading(true);

      const imageUrl = await uploadToImgbb();

      setUploading(false);

      console.log("IMAGE URL:", imageUrl);

      const payload = {
        title: title.trim(),
        description: description.trim(),
        image: imageUrl,
        authorName: user.name,
        authorEmail: user.email,
      };

      console.log("POST DATA:", payload);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/forum-posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      console.log("FORUM RESPONSE:", data);

      if (!res.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            "Failed to publish."
        );
      }

      toast.success(
        "Post published successfully!"
      );

      setTitle("");
      setDescription("");
      setImageFile(null);
      setPreviewUrl("");
    } catch (err) {
      console.error(err);

      toast.error(
        err?.message ||
          "Failed to publish post."
      );
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF5B3C]/15 text-xl">
          📝
        </div>

        <div>
          <h1 className="text-2xl font-bold text-[#F5F3EF]">
            Add Forum Post
          </h1>

          <p className="mt-1 text-sm text-[#9A9CA6]">
            Share something with community
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex flex-col gap-6 rounded-3xl border border-white/10 bg-[#1C1E24] p-8"
      >
        <div>
          <label className="mb-2 block text-xs text-[#9A9CA6]">
            Title
          </label>

          <input
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="w-full rounded-xl border border-white/10 bg-[#14151A] px-5 py-4 text-[#F5F3EF]"
            placeholder="Write title"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs text-[#9A9CA6]">
            Upload Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full rounded-xl border border-white/10 bg-[#14151A] p-4 text-[#9A9CA6]"
          />

          {previewUrl && (
            <img
              src={previewUrl}
              alt="preview"
              className="mt-4 h-60 w-full rounded-xl object-cover"
            />
          )}
        </div>

        <div>
          <label className="mb-2 block text-xs text-[#9A9CA6]">
            Description
          </label>

          <textarea
            rows={7}
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            className="w-full rounded-xl border border-white/10 bg-[#14151A] px-5 py-4 text-[#F5F3EF]"
            placeholder="Write description"
          />
        </div>

        <button
          disabled={submitting}
          className="rounded-xl bg-[#FF5B3C] py-4 font-semibold text-black disabled:opacity-50"
        >
          {submitting
            ? uploading
              ? "Uploading Image..."
              : "Publishing..."
            : "Publish Post"}
        </button>
      </form>
    </div>
  );
}