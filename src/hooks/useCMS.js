import { useEffect, useState } from "react";

const useCMS = () => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await fetch(
          "http://localhost:5001/api/content"
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