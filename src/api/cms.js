const BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5001";

export const getContent = async () => {
  const res = await fetch(`${BASE_URL}/api/content`);
  if (!res.ok) throw new Error("Failed to fetch content");
  return res.json();
};

export const updateContent = async (data) => {
  const res = await fetch(`${BASE_URL}/api/content`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update content");
  return res.json();
};

export const uploadImage = async (formData) => {
  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Image upload failed");
  return res.json();
};