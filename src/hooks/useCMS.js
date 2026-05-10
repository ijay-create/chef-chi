import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;

const useCMS = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${BASE_URL}/api/content`);

      if (!res.ok) {
        throw new Error("Failed to load CMS content");
      }

      const data = await res.json();

      setContent(data);
    } catch (err) {
      console.error("CMS hook error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  return {
    content,
    loading,
    error,
    refetch: loadContent,
  };
};

export default useCMS;