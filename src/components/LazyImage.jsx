import { useState } from "react";

const LazyImage = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      src={src}
      alt={alt}
      className={`lazy-img ${loaded ? "loaded" : ""}`}
      onLoad={() => setLoaded(true)}
    />
  );
};

export default LazyImage;