import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../styles/about.css";
import chefImg from "../assets/images/about.jpg";
import { getContent } from "../api/cms";

const About = () => {
  /* =========================
     CMS STATE
  ========================= */
  const [content, setContent] = useState({
    about: {
      headline: "",
      text: "",
    },
  });

  /* =========================
     LOAD CMS CONTENT
  ========================= */
  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getContent();

        setContent({
          about: {
            headline:
              data?.about?.headline ||
              "Excellence Served Since Day One",

            text:
              data?.about?.text ||
              "Chef-Chi Catering Service Luxembourg was founded with one vision: to redefine catering through elegance, flavor, and memorable experiences.",
          },
        });
      } catch (err) {
        console.error("CMS Load Error:", err);
      }
    };

    loadContent();
  }, []);

  /* =========================
     ANIMATIONS
  ========================= */
  const cardVariants = {
    hidden: (direction) => ({
      opacity: 0,
      x: direction === "left" ? -140 : 140,
      scale: 0.85,
      filter: "blur(8px)",
    }),

    show: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <main className="about-page">

      {/* STORY */}
      <section className="about-story section">
        <div className="container about-grid">

          <motion.div
            className="about-image-wrap"
            variants={cardVariants}
            custom="left"
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.3 }}
          >
            <img src={chefImg} alt="Chef Chi Catering" />
          </motion.div>

          <motion.div
            className="about-content"
            variants={cardVariants}
            custom="right"
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.3 }}
          >

            <span className="mini-tag">Our Story</span>

            {/* CMS HEADLINE */}
            <h2>
              {content.about.headline}
            </h2>

            {/* CMS TEXT */}
            <p>
              {content.about.text}
            </p>

            <p>
              From intimate private dinners to grand luxury weddings and
              executive corporate events, we curate every detail with
              world-class standards.
            </p>

            {/* STATS */}
            <div className="about-stats">

              <motion.div
                className="stat-box"
                variants={cardVariants}
                custom="left"
                whileInView="show"
                viewport={{ once: false, amount: 0.3 }}
              >
                <h3>150+</h3>
                <span>Events Hosted</span>
              </motion.div>

              <motion.div
                className="stat-box"
                variants={cardVariants}
                custom="right"
                whileInView="show"
                viewport={{ once: false, amount: 0.3 }}
              >
                <h3>5★</h3>
                <span>Client Rating</span>
              </motion.div>

              <motion.div
                className="stat-box"
                variants={cardVariants}
                custom="left"
                whileInView="show"
                viewport={{ once: false, amount: 0.3 }}
              >
                <h3>10+</h3>
                <span>Years Experience</span>
              </motion.div>

            </div>

          </motion.div>

        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="philosophy-section">

        <div className="container philosophy-grid">

          <motion.div
            variants={cardVariants}
            custom="left"
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.3 }}
          >

            <span className="mini-tag">
              Our Philosophy
            </span>

            <h2>
              Luxury is Found in Every Detail
            </h2>

            <p>
              We believe exceptional catering is more than food —
              it is atmosphere, emotion, presentation, and service.
            </p>

            <ul className="about-list">
              <li>✔ Premium ingredients sourced carefully</li>
              <li>✔ Elegant Michelin-inspired plating</li>
              <li>✔ Tailored menus for every client</li>
              <li>✔ Flawless hospitality experience</li>
              <li>✔ Memorable events from start to finish</li>
            </ul>

          </motion.div>

        </div>

      </section>

      {/* CTA */}
      <section className="about-cta">

        <div className="container">

          <motion.div
            variants={cardVariants}
            custom="right"
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.3 }}
          >

            <h2>
              Let’s Create Something Unforgettable
            </h2>

            <p>
              Book Chef-Chi Catering Service Luxembourg
              for your next event.
            </p>

            <a href="/contact">
              Book Consultation
            </a>

          </motion.div>

        </div>

      </section>

    </main>
  );
};

export default About;