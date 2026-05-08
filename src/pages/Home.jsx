import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import TestimonialSlider from "../components/TestimonialSlider";
import Reveal from "../components/Reveal";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "../styles/home.css";

import { getContent } from "../api/cms"; // ✅ ONLY ONE IMPORT

import img1 from "../assets/images/service1.jpg";
import img2 from "../assets/images/service2.jpg";
import img3 from "../assets/images/service3.jpg";
import img4 from "../assets/images/service4.jpg";
import img5 from "../assets/images/service5.jpg";
import img6 from "../assets/images/service6.jpg";
import img7 from "../assets/images/service7.jpg";
import img8 from "../assets/images/service8.jpg";

const Home = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  // 💎 LOAD CMS CONTENT
  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getContent();
        setContent(data);
      } catch (err) {
        console.log("CMS error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const cardVariants = {
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

  const services = [
    { image: img1, category: "Luxury Weddings", title: "Wedding Catering", desc: "Elegant wedding dining experiences..." },
    { image: img2, category: "Corporate Events", title: "Executive Catering", desc: "Professional catering solutions..." },
    { image: img3, category: "Private Dining", title: "Chef Experience", desc: "Exclusive chef-led dining..." },
    { image: img4, category: "Outdoor Events", title: "Luxury Outdoor Service", desc: "Premium outdoor catering..." },
    { image: img5, category: "Desserts", title: "Dessert Tables", desc: "Elegant dessert presentations..." },
    { image: img6, category: "Luxury Hospitality", title: "Cocktail Service", desc: "Sophisticated cocktail receptions..." },
    { image: img7, category: "Cuisine", title: "Fine Dining", desc: "Elevated culinary journeys..." },
    { image: img8, category: "Services", title: "Event Coordination", desc: "Seamless event planning..." },
  ];

  if (loading) {
    return <div className="loading-screen">Loading Experience...</div>;
  }

  return (
    <main className="home">

      {/* HERO (CMS CONTROLLED) */}
      <Hero
        title={content?.hero?.title || "Luxury Catering Experience"}
        subtitle={content?.hero?.subtitle || "Chef-Chi Catering Luxembourg"}
      />

      {/* TRUST BAR */}
      <section className="trust-bar">
        <div className="container trust-inner">
          <span>Luxury Catering Luxembourg</span>
          <span>Weddings • Corporate • Private Dining</span>
          <span>★★★★★ Elite Experience</span>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="section container">

        <Reveal>
          <span className="tag">What We Do</span>

          <h2>
            {content?.about?.headline || "Crafting Unforgettable Culinary Moments"}
          </h2>

          <p className="subtext">
            {content?.about?.text ||
              "We create premium catering experiences with precision, elegance, and Michelin-inspired presentation."}
          </p>
        </Reveal>

        <div className="services-grid">

          {services.map((item, index) => {
            const direction = index % 2 === 0 ? "left" : "right";

            return (
              <motion.div
                className="service-card"
                key={index}
                variants={cardVariants}
                custom={direction}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.2 }}
              >
                <img src={item.image} alt={item.title} loading="lazy" />

                <div className="service-content">
                  <span>{item.category}</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </motion.div>
            );
          })}

        </div>
      </section>

      {/* STORY */}
      <section className="story-section">
        <div className="container story-grid">

          <Reveal>
            <span className="tag">Our Philosophy</span>

            <h2>Luxury is in Every Detail</h2>

            <p>
              Chef-Chi Catering is built on elegance, precision, and unforgettable experiences.
            </p>

            <p>
              We transform every event into a cinematic culinary journey.
            </p>
          </Reveal>

        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div className="container center">

          <Reveal>
            <span className="tag">Client Stories</span>
            <h2>What Our Clients Say</h2>
          </Reveal>

          <TestimonialSlider />

        </div>
      </section>

      {/* CTA */}
      <section className="final-cta">

        <div className="container cta-box">

          <Reveal>

            <span className="tag">Let’s Create Magic</span>

            <h2>Ready to Elevate Your Event?</h2>

            <p>
              Book Chef-Chi Catering Service for a luxury experience.
            </p>

            <div className="cta-buttons">

              <Link to="/contact" className="btn primary">
                Book Event
              </Link>

              <Link to="/menu" className="btn ghost">
                View Menu
              </Link>

            </div>

          </Reveal>

        </div>

      </section>

    </main>
  );
};

export default Home;