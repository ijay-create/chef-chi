const BASE_URL = import.meta.env.VITE_API_URL;

export const getContent = async () => {
  const res = await fetch(`${BASE_URL}/api/content`);

  if (!res.ok) {
    throw new Error("Failed to fetch content");
  }

  return res.json();
};

export const updateContent = async (data) => {
  const token = localStorage.getItem("cms-token");

  const res = await fetch(`${BASE_URL}/api/content`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update content");
  }

  return res.json();
};

export const uploadImage = async (formData) => {
  const token = localStorage.getItem("cms-token");

  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Image upload failed");
  }

  return res.json();
};