import { useEffect, useState } from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import "../styles/testimonial.css";

const testimonials = [
  {
    text: "Chef-Chi transformed our wedding into a five-star dining experience. Every guest was amazed by the elegance, flavour, and flawless service.",
    name: "Isabelle Laurent",
    role: "Wedding Client",
    rating: 5,
  },
  {
    text: "Exceptional corporate catering. The presentation was premium, the food exquisite, and the professionalism unmatched.",
    name: "Daniel Meyer",
    role: "Corporate Director",
    rating: 5,
  },
  {
    text: "A truly luxurious private dining experience. Every detail was curated beautifully. We felt like royalty.",
    name: "Sophia Klein",
    role: "Private Dining Guest",
    rating: 5,
  },
];

const TestimonialSlider = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  return (
    <section className="testimonial-section">

      <motion.div className="testimonial-card" 
        initial={{ opacity: 0 }} 
        whileInView={{ opacity: 1 }} 
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >

        <FaQuoteLeft className="quote-icon" />

        <div className="stars">
          {[...Array(testimonials[index].rating)].map((_, i) => (
            <FaStar key={i} />
          ))}
        </div>

        <p className="testimonial-text">
          "{testimonials[index].text}"
        </p>

        <div className="client-info">
          <h4>{testimonials[index].name}</h4>
          <span>{testimonials[index].role}</span>
        </div>

        <div className="testimonial-nav">
          <button onClick={prevSlide}>←</button>
          <button onClick={nextSlide}>→</button>
        </div>

      </motion.div>

      <div className="testimonial-dots">
        {testimonials.map((_, i) => (
          <span
            key={i}
            className={index === i ? "dot active" : "dot"}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>

    </section>
  );
};

export default TestimonialSlider;