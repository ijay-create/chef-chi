import "../styles/gallery.css";

const GalleryGrid = ({ images }) => {
  return (
    <div className="gallery-grid">
      {images.map((item, i) => {
        const imageUrl = item.src?.startsWith("http")
          ? item.src
          : `https://chef-chi.onrender.com${item.src}`;

        return (
          <div key={i} className="gallery-item">
            <img src={imageUrl} alt={item.title || "gallery"} loading="lazy" />
          </div>
        );
      })}
    </div>
  );
};

export default GalleryGrid;