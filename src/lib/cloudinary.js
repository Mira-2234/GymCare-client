/**
 * src/lib/cloudinary.js
 *
 * Cloudinary-তে image upload করে URL রিটার্ন করে।
 * Unsigned upload preset ব্যবহার করছি — secret key লাগে না,
 * তাই সরাসরি browser থেকে call করা নিরাপদ।
 *
 * .env.local-এ এই দুটো variable থাকতে হবে:
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
 *   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset_name
 */
export async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  const data = await res.json();

  if (data.error) {
    throw new Error(data.error.message || "Image upload failed.");
  }

  return data.secure_url; // https://res.cloudinary.com/... format
}