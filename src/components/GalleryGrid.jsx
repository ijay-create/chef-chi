import "../styles/gallery.css";

const GalleryGrid = ({ images }) => {
  return (
    <div className="gallery-grid">
      {images.map((img, i) => (
        <div key={i} className="gallery-item">
          <img src={img} alt="" loading="lazy" />
        </div>
      ))}
    </div>
  );
};

export default GalleryGrid;