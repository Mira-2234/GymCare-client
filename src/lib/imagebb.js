/**
 * Uploads a single image file to Imgbb and returns its hosted URL.
 *
 * Requires NEXT_PUBLIC_IMGBB_API_KEY in your .env.local. It has to be
 * NEXT_PUBLIC_-prefixed because this upload happens straight from the
 * browser (no backend involved here) — which does mean the key is visible
 * in the client bundle. That's the standard tradeoff for client-side Imgbb
 * uploads; if you want it hidden, you'd proxy this through one of your own
 * API routes instead of calling imgbb.com directly.
 */
export async function uploadToImgbb(file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGBB_API_KEY}`,
    { method: "POST", body: formData }
  );

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.error?.message || "Image upload failed. Try again.");
  }

  return data.data.url;
}