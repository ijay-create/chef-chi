import { motion } from "framer-motion";
import "../styles/services.css";

import img1 from "../assets/images/service1.jpg";
import img2 from "../assets/images/service2.jpg";
import img3 from "../assets/images/service3.jpg";
import img4 from "../assets/images/service4.jpg";
import img5 from "../assets/images/service5.jpg";
import img6 from "../assets/images/service6.jpg";
import img7 from "../assets/images/service7.jpg";
import img8 from "../assets/images/service8.jpg";


const Services = () => {
  const services = [
    {
      image: img1,
      title: "Luxury Wedding Catering",
      category: "Weddings",
      desc: "Elegant menus, stunning presentations, and unforgettable service tailored for your special day.",
    },
    {
      image: img2,
      title: "Corporate Event Dining",
      category: "Corporate",
      desc: "Executive lunches, conferences, and premium hospitality designed to impress clients and teams.",
    },
    {
      image: img3,
      title: "Private Chef Experience",
      category: "Private Dining",
      desc: "Exclusive chef-curated meals in the comfort of your home or private venue.",
    },
    {
      image: img4,
      title: "Outdoor Event Catering",
      category: "Outdoor",
      desc: "Luxury catering solutions for garden parties, open-air celebrations, and premium outdoor events.",
    },
    {
      image: img5,
      title: "Dessert & Sweet Tables",
      category: "Desserts",
      desc: "Beautifully crafted dessert stations with premium sweets and bespoke displays.",
    },
    {
      image: img6,
      title: "Cocktail & Canapé Service",
      category: "Luxury Hospitality",
      desc: "Sophisticated cocktail receptions with handcrafted canapés and impeccable service.",
    },
    {
      image: img7,
      title: "Fine Dining Experiences",
      category: "Cuisine",
      desc: "Elevated culinary journeys with seasonal ingredients and innovative presentations.",
    },
    {
      image: img8,
      title: "Event Planning & Coordination",
      category: "Services",
      desc: "Seamless event planning and coordination for a stress-free celebration.",
    },
  ];

  return (
    <section className="services-page">

      {/* HERO */}
      <section
        className="services-hero"
        style={{ backgroundImage: `url(${img1})` }}
      >
        <div className="services-overlay">

          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Chef-Chi Catering Excellence
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            Bespoke Catering Services
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            From grand weddings to intimate dining, we create refined culinary
            experiences crafted with elegance and precision.
          </motion.p>

        </div>
      </section>

      {/* INTRO */}
      <section className="section container services-intro">
        <div className="services-intro-grid">

          <div>
            <span className="mini-title">Tailored Luxury</span>
            <h2>Exceptional Catering for Every Occasion</h2>
          </div>

          <p>
            Chef-Chi Catering Service Luxembourg offers elevated dining
            experiences designed around your vision. Every menu, every detail,
            every service touchpoint is curated for excellence.
          </p>

        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="section container">
        <div className="services-grid">

          {services.map((item, index) => (
            <div className="service-card" key={index}>

              <img src={item.image} alt={item.title} loading="lazy" />

              <div className="service-content">
                <span>{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>

            </div>
          ))}

        </div>
      </section>

      {/* WHY US */}
      <section className="why-services">
        <div className="container why-grid">

          <div>
            <span className="mini-title">Why Choose Us</span>
            <h2>Luxury Service Beyond Expectations</h2>
          </div>

          <div className="why-list">
            <p>✔ Bespoke Menus Designed for Your Event</p>
            <p>✔ Premium Ingredients & Fine Presentation</p>
            <p>✔ Experienced Hospitality Team</p>
            <p>✔ Seamless Planning & Event Coordination</p>
            <p>✔ Elegant Dining Experiences in Luxembourg</p>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="services-cta">
        <div className="container">
          <h2>Let’s Curate Your Perfect Event</h2>
          <p>
            Experience luxury catering tailored exclusively for your occasion.
          </p>

          <a href="/contact">Book Consultation</a>
        </div>
      </section>

    </section>
  );
};

export default Services;