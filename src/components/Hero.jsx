import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import heroImg from "../assets/images/hero.jpg";
import "../styles/hero.css";

const Hero = () => {
  const { scrollY } = useScroll();

  const y = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <section className="hero">

      <motion.div
        className="hero-bg"
        style={{
          y,
          backgroundImage: `url(${heroImg})`,
        }}
      />

      <div className="overlay">

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >

          <span className="badge">
            ✨ Premium Catering in Luxembourg
          </span>

          <h1>
            Luxury Catering Experience for Unforgettable Events
          </h1>

          <p>
            Chef-Chi Catering Service delivers refined culinary experiences for
            weddings, corporate events, and private dining. Every menu is
            crafted with elegance, precision, and passion.
          </p>

          <div className="hero-buttons">

            {/* NAVIGATION FIX */}
            <Link to="/contact" className="btn-primary">
              Book an Event
            </Link>

            <Link to="/menu" className="btn-secondary">
              View Menu
            </Link>

          </div>

        </motion.div>

      </div>

    </section>
  );
};

export default Hero;