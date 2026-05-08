import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getContent } from "../utils/cms";
import "../styles/gallery.css";

import img1 from "../assets/images/g1.jpg";
import img2 from "../assets/images/g2.jpg";
import img3 from "../assets/images/g3.jpg";
import img4 from "../assets/images/g4.jpg";
import img5 from "../assets/images/g5.jpg";
import img6 from "../assets/images/g6.jpg";
import img8 from "../assets/images/g8.jpg";
import img9 from "../assets/images/g9.jpg";
import img10 from "../assets/images/g10.jpg";
import img11 from "../assets/images/g11.jpg";
import img12 from "../assets/images/g12.jpg";
import img13 from "../assets/images/g13.jpg";


const Gallery = () => {
  const images = [
    { src: img1, title: "Ugba Catering", category: "Events" },
    { src: img2, title: "Executive Corporate Dining", category: "Corporate" },
    { src: img3, title: "Private Chef Experience", category: "Private Dining" },
    { src: img4, title: "Outdoor Shawarma Event", category: "Outdoor Events" },
    { src: img5, title: "Fine Dining Presentation", category: "Cuisine" },
    { src: img6, title: "Elegant Dessert Table", category: "Desserts" },
    { src: img8, title: "Elegant Event Setup", category: "Corporate" },
    { src: img9, title: "Drinks & Beverages", category: "Drinks" },
    { src: img10, title: "Nigerian Cuisine", category: "Cuisine" },
    { src: img11, title: "Luxury Wedding Cuisine", category: "Cuisine" },
    { src: img12, title: "Birthday Setup", category: "Birthday" },
    { src: img13, title: "Corporate Event Dining", category: "Corporate" },
  ];

  // 💎 CINEMATIC VARIANTS (FIXED NAME)
  const luxuryVariant = {
    hidden: (direction) => ({
      opacity: 0,
      x: direction === "left" ? -120 : 120,
      scale: 0.85,
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

  return (
    <section className="gallery-page">

      {/* HERO */}
      <section
        className="gallery-hero"
        style={{ backgroundImage: `url(${img2})` }}
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
            transition={{ delay: 0.3 }}
          >
            Discover unforgettable celebrations, elegant cuisine,
            and bespoke luxury catering crafted in Luxembourg.
          </motion.p>

        </div>
      </section>

      {/* INTRO */}
      <section className="gallery-intro section container">
        <div className="gallery-intro-grid">

          <div>
            <span className="mini-tag">Crafted Excellence</span>
            <h2>Moments Served with Elegance</h2>
          </div>

          <p>
            From private dining experiences to grand wedding receptions,
            every Chef-Chi event is designed with sophistication,
            flavour, and unforgettable presentation.
          </p>

        </div>
      </section>

      {/* GRID */}
      <section className="section container">
        <div className="gallery-grid">

          {images.map((item, index) => {
            const direction = index % 2 === 0 ? "left" : "right";

            return (
              <motion.div
                key={index}
                className="gallery-card"
                variants={luxuryVariant}
                custom={direction}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.2 }}
              >
                <img src={item.src} alt={item.title} loading="lazy" />

                <div className="gallery-content">
                  <span>{item.category}</span>
                  <h3>{item.title}</h3>
                </div>
              </motion.div>
            );
          })}

        </div>
      </section>

      {/* CTA */}
      <section className="gallery-cta">
        <div className="container">
          <h2>Create Your Own Luxury Experience</h2>
          <p>
            Let Chef-Chi Catering transform your event into
            a world-class culinary memory.
          </p>

          <a href="/contact">Book an Event</a>
        </div>
      </section>

    </section>
  );
};

export default Gallery;