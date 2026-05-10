import { useEffect, useState } from "react";

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001";

const useCMS = () => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/content`
        );

        const data = await res.json();

        setContent(data);

      } catch (err) {
        console.error(err);
      }
    };

    loadContent();
  }, []);

  return content;
};

export default useCMS;