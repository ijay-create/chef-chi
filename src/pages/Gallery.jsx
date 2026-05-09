import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getContent } from "../api/cms";
import "../styles/gallery.css";

import heroImg from "../assets/images/g2.jpg";

/* =========================
   API URL
========================= */
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD CMS GALLERY
  ========================= */
  useEffect(() => {
    const loadGallery = async () => {
      try {
        const data = await getContent();

        if (Array.isArray(data?.gallery)) {
          setImages(data.gallery);
        } else {
          setImages([]);
        }

      } catch (err) {
        console.error("❌ Gallery load error:", err);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  /* =========================
     FIX IMAGE URLS
  ========================= */
  const getImageUrl = (src) => {
    if (!src) {
      return heroImg;
    }

    // already full URL
    if (src.startsWith("http")) {
      return src;
    }

    // remove accidental double slashes
    const cleanSrc = src.startsWith("/")
      ? src
      : `/${src}`;

    return `${BASE_URL}${cleanSrc}`;
  };

  /* =========================
     ANIMATION
  ========================= */
  const luxuryVariant = {
    hidden: (direction) => ({
      opacity: 0,
      x: direction === "left" ? -120 : 120,
      scale: 0.9,
      filter: "blur(6px)",
    }),

    show: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  /* =========================
     LOADING
  ========================= */
  if (loading) {
    return (
      <div className="section container">
        <h2>Loading Gallery...</h2>
      </div>
    );
  }

  return (
    <section className="gallery-page">

      {/* HERO */}
      <section
        className="gallery-hero"
        style={{
          backgroundImage: `url(${heroImg})`,
        }}
      >
        <div className="gallery-overlay">

          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Chef-Chi Experiences
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Our Signature Gallery
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Discover unforgettable celebrations,
            elegant cuisine, and luxury catering.
          </motion.p>

        </div>
      </section>

      {/* INTRO */}
      <section className="gallery-intro section container">

        <div className="gallery-intro-grid">

          <div>
            <span className="mini-tag">
              Crafted Excellence
            </span>

            <h2>
              Moments Served with Elegance
            </h2>
          </div>

          <p>
            From private dining experiences
            to grand wedding receptions,
            every Chef-Chi event is designed
            with sophistication and unforgettable
            presentation.
          </p>

        </div>

      </section>

      {/* GALLERY GRID */}
      <section className="section container">

        <div className="gallery-grid">

          {images.length > 0 ? (
            images.map((item, index) => {

              const direction =
                index % 2 === 0 ? "left" : "right";

              return (
                <motion.div
                  key={index}
                  className="gallery-card"
                  variants={luxuryVariant}
                  custom={direction}
                  initial="hidden"
                  whileInView="show"
                  viewport={{
                    once: false,
                    amount: 0.2,
                  }}
                >

                  <img
                    src={getImageUrl(item?.src)}
                    alt={item?.title || "Gallery Image"}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = heroImg;
                    }}
                  />

                  <div className="gallery-content">

                    <span>
                      {item?.category?.trim() || "Gallery"}
                    </span>

                    <h3>
                      {item?.title?.trim() || "Chef-Chi Event"}
                    </h3>

                  </div>

                </motion.div>
              );
            })
          ) : (
            <h3>No gallery images found.</h3>
          )}

        </div>

      </section>

      {/* CTA */}
      <section className="gallery-cta">

        <div className="container">

          <h2>
            Create Your Own Luxury Experience
          </h2>

          <p>
            Let Chef-Chi Catering transform
            your event into a world-class
            culinary memory.
          </p>

          <a href="/contact">
            Book an Event
          </a>

        </div>

      </section>

    </section>
  );
};

export default Gallery;