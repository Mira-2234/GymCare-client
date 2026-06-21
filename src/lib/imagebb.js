

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